export const PROVIDER_NAMES = ["tavily", "serper", "brave"];
export const PROVIDER_LINKS = {
  tavily: "https://tavily.com/",
  serper: "https://serper.dev/",
  brave: "https://brave.com/search/api/",
};

export class ProviderError extends Error {
  constructor(status, retryAfter = null) {
    super("Search provider unavailable");
    this.status = status;
    this.retryAfter = retryAfter;
  }
}

function safeURL(value) {
  try {
    const url = new URL(value);
    return ["http:", "https:"].includes(url.protocol) &&
      !url.username &&
      !url.password
      ? url.href
      : null;
  } catch {
    return null;
  }
}

function resultsFor(name, data) {
  const rows =
    name === "tavily"
      ? data.results
      : name === "serper"
        ? data.organic
        : data.web?.results;
  // Distinguish an invalid response from a legitimate search with no matches.
  if (!Array.isArray(rows)) {
    if (
      name === "brave" &&
      data.type === "search" &&
      data.query &&
      !data.web &&
      !data.error
    )
      return [];
    throw new ProviderError(502);
  }
  const seen = new Set();
  return rows
    .flatMap((row) => {
      const url = safeURL(row.url || row.link);
      if (
        !url ||
        typeof row.title !== "string" ||
        !row.title.trim() ||
        seen.has(url)
      )
        return [];
      seen.add(url);
      return [
        {
          title: row.title.slice(0, 500),
          url,
          domain: new URL(url).hostname,
          snippet: String(
            row.content || row.snippet || row.description || "",
          ).slice(0, 2000),
          // Provider-reported text; never relabel a crawl age as a publication date.
          sourceDate:
            typeof (row.published_date || row.date || row.age) === "string"
              ? (row.published_date || row.date || row.age).slice(0, 100)
              : null,
        },
      ];
    })
    .slice(0, 10);
}

export async function queryProvider(
  name,
  key,
  query,
  fetchImpl = fetch,
  timeoutMs = 6500,
) {
  let url, options;
  if (name === "tavily") {
    url = "https://api.tavily.com/search";
    options = {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query,
        search_depth: "basic",
        auto_parameters: false,
        max_results: 10,
        include_answer: false,
        include_raw_content: false,
        include_images: false,
      }),
    };
  } else if (name === "serper") {
    url = "https://google.serper.dev/search";
    options = {
      method: "POST",
      headers: { "X-API-KEY": key, "Content-Type": "application/json" },
      body: JSON.stringify({ q: query, num: 10 }),
    };
  } else if (name === "brave") {
    url = `https://api.search.brave.com/res/v1/web/search?${new URLSearchParams({ q: query, count: "10", safesearch: "moderate" })}`;
    options = {
      headers: { "X-Subscription-Token": key, Accept: "application/json" },
    };
  } else throw new ProviderError(500);
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetchImpl(url, {
      ...options,
      signal: controller.signal,
      redirect: "error",
    });
    if (!response.ok)
      throw new ProviderError(
        response.status,
        response.headers.get("retry-after"),
      );
    const data = await response.json();
    if (data.error) throw new ProviderError(502);
    return resultsFor(name, data);
  } catch (error) {
    if (error instanceof ProviderError) throw error;
    // Do not propagate upstream messages, keys, URLs, or queries to the client/logs.
    throw new ProviderError(502);
  } finally {
    clearTimeout(timer);
  }
}
