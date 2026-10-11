import test from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, readFile, writeFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { BudgetStore, initializeUsage } from "../server/budgetStore.js";
import { WebSearch, readSearchConfig } from "../server/search.js";
import { queryProvider } from "../server/providers.js";

async function setup(t, env = {}) {
  const directory = await mkdtemp(join(tmpdir(), "wonderverse-test-"));
  t.after(() => rm(directory, { recursive: true, force: true }));
  const path = join(directory, "usage.json");
  await initializeUsage(path);
  return {
    path,
    store: new BudgetStore(path),
    config: readSearchConfig({
      TAVILY_API_KEY: "test-tavily",
      TAVILY_REQUEST_LIMIT: "3",
      SERPER_API_KEY: "test-serper",
      SERPER_REQUEST_LIMIT: "3",
      ...env,
    }),
  };
}
const json = (body, status = 200, headers = {}) =>
  new Response(JSON.stringify(body), { status, headers });
const tavily = {
  results: [
    {
      title: "Original page",
      url: "https://example.com/source",
      content: "A source excerpt.",
    },
  ],
};
const serper = {
  organic: [
    {
      title: "Other page",
      link: "https://example.org/source",
      snippet: "Another source excerpt.",
    },
  ],
};

test("keys without explicit positive budgets are disabled and cannot make a request", async (t) => {
  const { store } = await setup(t);
  const search = new WebSearch(
    readSearchConfig({ TAVILY_API_KEY: "test-key" }),
    store,
    { fetchImpl: () => assert.fail("must not call a provider") },
  );
  await assert.rejects(search.search("a topic"), { code: "not_configured" });
});

test("quota exhaustion switches providers and remembers exhausted provider across restarts", async (t) => {
  const { path, store, config } = await setup(t);
  const calls = [];
  const fetchImpl = async (url) => {
    calls.push(url);
    return url.includes("tavily") ? json({}, 432) : json(serper);
  };
  const first = await new WebSearch(config, store, { fetchImpl }).search(
    "a topic",
  );
  assert.equal(first.provider, "serper");
  assert.equal(calls.length, 2);
  calls.length = 0;
  const second = await new WebSearch(config, new BudgetStore(path), {
    fetchImpl,
  }).search("another topic");
  assert.equal(second.provider, "serper");
  assert.equal(calls.length, 1);
});

test("hard lifetime cap persists across restarts and switches before making an extra request", async (t) => {
  const { path, store, config } = await setup(t, { TAVILY_REQUEST_LIMIT: "1" });
  const calls = [];
  const fetchImpl = async (url) => {
    calls.push(url);
    return url.includes("tavily") ? json(tavily) : json(serper);
  };
  assert.equal(
    (await new WebSearch(config, store, { fetchImpl }).search("first"))
      .provider,
    "tavily",
  );
  assert.equal(
    (
      await new WebSearch(config, new BudgetStore(path), { fetchImpl }).search(
        "second",
      )
    ).provider,
    "serper",
  );
  assert.equal(calls.filter((url) => url.includes("tavily")).length, 1);
  assert.equal(
    JSON.parse(await readFile(path, "utf8")).providers.tavily.used,
    1,
  );
});

test("missing or corrupted budget ledger fails closed without calling a provider", async (t) => {
  const { path, config } = await setup(t);
  await writeFile(path, "{broken");
  const fetchImpl = () => assert.fail("must not call a provider");
  await assert.rejects(
    new WebSearch(config, new BudgetStore(path), { fetchImpl }).search("topic"),
    { code: "budget_unavailable" },
  );
  await rm(path);
  await assert.rejects(
    new WebSearch(config, new BudgetStore(path), { fetchImpl }).search("topic"),
    { code: "budget_unavailable" },
  );
});

test("concurrent searches never exceed reserved request budget", async (t) => {
  const { store, config } = await setup(t, {
    TAVILY_REQUEST_LIMIT: "1",
    SERPER_REQUEST_LIMIT: "0",
  });
  let calls = 0;
  const search = new WebSearch(config, store, {
    fetchImpl: async () => {
      calls++;
      return json(tavily);
    },
  });
  const results = await Promise.allSettled([
    search.search("first"),
    search.search("second"),
    search.search("third"),
  ]);
  assert.equal(calls, 1);
  assert.equal(
    results.filter((result) => result.status === "fulfilled").length,
    1,
  );
});

test("empty valid results do not burn another provider’s credits", async (t) => {
  const { store, config } = await setup(t);
  let calls = 0;
  const search = new WebSearch(config, store, {
    fetchImpl: async () => {
      calls++;
      return json({ results: [] });
    },
  });
  const result = await search.search("obscure topic");
  assert.deepEqual(result.results, []);
  assert.equal(calls, 1);
});

test("network errors, malformed data and rate limits fall back; attempts still count", async (t) => {
  for (const mode of ["network", "malformed", "rate-limit"]) {
    const { store, config, path } = await setup(t);
    const search = new WebSearch(config, store, {
      fetchImpl: async (url) => {
        if (!url.includes("tavily")) return json(serper);
        if (mode === "network")
          throw new Error("upstream secret must not leak");
        return mode === "rate-limit"
          ? json({}, 429, { "Retry-After": "60" })
          : json({ unexpected: true });
      },
    });
    assert.equal((await search.search("topic")).provider, "serper");
    assert.equal(
      JSON.parse(await readFile(path, "utf8")).providers.tavily.used,
      1,
    );
  }
});

test("global daily limit stops fallback when the daily attempt budget is spent", async (t) => {
  const { store, config } = await setup(t, { SEARCH_DAILY_LIMIT: "1" });
  let calls = 0;
  const search = new WebSearch(config, store, {
    fetchImpl: async () => {
      calls++;
      return json({}, 432);
    },
  });
  await assert.rejects(search.search("topic"), {
    code: "no_provider_available",
  });
  assert.equal(calls, 1);
});

test("normalization deduplicates links, rejects dangerous URLs, and leaves unknown dates unknown", async () => {
  const result = await queryProvider("tavily", "key", "topic", async () =>
    json({
      results: [
        { title: "Unsafe", url: "javascript:alert(1)", content: "No" },
        { title: "Source", url: "https://example.com/", content: "Text" },
        { title: "Duplicate", url: "https://example.com/", content: "Again" },
        {
          title: "Credentials",
          url: "https://user:password@example.com/",
          content: "No",
        },
      ],
    }),
  );
  assert.equal(result.length, 1);
  assert.equal(result[0].sourceDate, null);
});

test("Tavily explicitly uses basic search without paid depth upgrades or generated answers", async () => {
  await queryProvider("tavily", "secret", "topic", async (url, options) => {
    const body = JSON.parse(options.body);
    assert.equal(body.search_depth, "basic");
    assert.equal(body.auto_parameters, false);
    assert.equal(body.include_answer, false);
    assert.equal(options.headers.Authorization, "Bearer secret");
    return json(tavily);
  });
});

test("Serper and Brave use their own credentials and expected response shapes", async () => {
  await queryProvider(
    "serper",
    "serper-secret",
    "topic",
    async (url, options) => {
      assert.equal(options.headers["X-API-KEY"], "serper-secret");
      assert.equal(JSON.parse(options.body).num, 10);
      return json(serper);
    },
  );
  const results = await queryProvider(
    "brave",
    "brave-secret",
    "a&b",
    async (url, options) => {
      assert.equal(options.headers["X-Subscription-Token"], "brave-secret");
      assert.equal(new URL(url).searchParams.get("q"), "a&b");
      return json({
        web: {
          results: [
            {
              title: "Source",
              url: "https://example.com/",
              description: "Preview",
              age: "2 days ago",
            },
          ],
        },
      });
    },
  );
  assert.equal(results[0].sourceDate, "2 days ago");
});
