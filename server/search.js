import { PROVIDER_NAMES, PROVIDER_LINKS, queryProvider } from "./providers.js";

export function readSearchConfig(env) {
  const integer = (value, fallback = 0) =>
    /^\d+$/.test(String(value)) && Number.isSafeInteger(Number(value))
      ? Number(value)
      : fallback;
  const order = [
    ...new Set(
      (env.SEARCH_PROVIDER_ORDER || PROVIDER_NAMES.join(","))
        .split(",")
        .map((name) => name.trim())
        .filter((name) => PROVIDER_NAMES.includes(name)),
    ),
  ];
  return {
    dailyLimit: integer(env.SEARCH_DAILY_LIMIT, 30),
    providers: order.map((name) => ({
      name,
      key: env[`${name.toUpperCase()}_API_KEY`] || "",
      limit: integer(env[`${name.toUpperCase()}_REQUEST_LIMIT`]),
    })),
  };
}

export class SearchUnavailable extends Error {
  constructor(code) {
    super("Web search unavailable");
    this.code = code;
  }
}

export class WebSearch {
  constructor(
    config,
    budgetStore,
    { fetchImpl = fetch, now = () => Date.now() } = {},
  ) {
    this.config = config;
    this.budgetStore = budgetStore;
    this.fetchImpl = fetchImpl;
    this.now = now;
    this.queue = Promise.resolve();
  }
  isConfigured() {
    return (
      this.config.dailyLimit > 0 &&
      this.config.providers.some(
        (provider) => provider.key && provider.limit > 0,
      )
    );
  }
  search(query) {
    // Serialize calls so provider throttling and budget updates cannot race.
    const task = this.queue.then(() => this.execute(query));
    this.queue = task.catch(() => {});
    return task;
  }
  async execute(query) {
    if (!this.isConfigured()) throw new SearchUnavailable("not_configured");
    for (const provider of this.config.providers) {
      if (!provider.key || !provider.limit) continue;
      let reserved;
      try {
        reserved = await this.budgetStore.reserve(
          provider.name,
          provider.limit,
          this.config.dailyLimit,
        );
      } catch {
        throw new SearchUnavailable("budget_unavailable");
      }
      if (!reserved) continue;
      try {
        const results = await queryProvider(
          provider.name,
          provider.key,
          query,
          this.fetchImpl,
        );
        return {
          results,
          provider: provider.name,
          providerURL: PROVIDER_LINKS[provider.name],
          retrievedAt: new Date(this.now()).toISOString(),
          verification: "search_snippets",
        };
      } catch (error) {
        const now = this.now();
        const disabled = [401, 402, 403, 432, 433].includes(error.status);
        const delay = error.status === 429 ? 60000 : 30000;
        const retrySeconds = Number(error.retryAfter);
        const retryDate = Date.parse(error.retryAfter || "");
        const retryTime =
          Number.isFinite(retrySeconds) && retrySeconds > 0
            ? now + Math.min(retrySeconds, 86400) * 1000
            : Number.isFinite(retryDate)
              ? Math.min(retryDate, now + 86400000)
              : now + delay;
        try {
          await this.budgetStore.coolDown(
            provider.name,
            disabled
              ? Number.MAX_SAFE_INTEGER
              : Math.max(now + delay, retryTime),
          );
        } catch {
          throw new SearchUnavailable("budget_unavailable");
        }
        // An exhausted, invalid, timed-out, or throttled provider falls through to the next.
      }
    }
    throw new SearchUnavailable("no_provider_available");
  }
}
