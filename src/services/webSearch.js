export class WebSearchError extends Error {
  constructor(code) {
    super("Web search unavailable");
    this.code = code;
  }
}

const endpoint = import.meta.env?.VITE_SEARCH_API_URL?.trim() || "";
export const WebSearchService = {
  isConfigured() {
    return Boolean(endpoint);
  },
  async search(query) {
    if (!endpoint) throw new WebSearchError("not_configured");
    const controller = new AbortController(),
      timer = setTimeout(() => controller.abort(), 26000);
    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ q: query }),
        signal: controller.signal,
        credentials: "omit",
        cache: "no-store",
      });
      const data = await response.json();
      if (!response.ok)
        throw new WebSearchError(data.error || "search_unavailable");
      if (!Array.isArray(data.results))
        throw new WebSearchError("invalid_response");
      // Accept only safe external links, even if a backend is misconfigured.
      data.results = data.results.filter((result) => {
        try {
          const url = new URL(result.url);
          return (
            ["http:", "https:"].includes(url.protocol) &&
            !url.username &&
            !url.password &&
            typeof result.title === "string"
          );
        } catch {
          return false;
        }
      });
      return data;
    } catch (error) {
      if (error instanceof WebSearchError) throw error;
      throw new WebSearchError("connection_failed");
    } finally {
      clearTimeout(timer);
    }
  },
};
