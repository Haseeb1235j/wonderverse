import { createServer } from "node:http";
import { resolve } from "node:path";
import { BudgetStore, initializeUsage } from "./budgetStore.js";
import { WebSearch, readSearchConfig, SearchUnavailable } from "./search.js";

const ledger = resolve(
  process.env.SEARCH_USAGE_FILE || "server/data/usage.json",
);
if (process.argv.includes("--init-usage")) {
  const { mkdir } = await import("node:fs/promises");
  await mkdir(resolve(ledger, ".."), { recursive: true });
  await initializeUsage(ledger);
  console.log(
    "Created a new search usage ledger. Existing ledgers are never overwritten.",
  );
} else {
  const search = new WebSearch(
    readSearchConfig(process.env),
    new BudgetStore(ledger),
  );
  const origins = new Set(
    (
      process.env.ALLOWED_ORIGINS ||
      "http://127.0.0.1:5173,http://localhost:5173"
    )
      .split(",")
      .map((value) => value.trim()),
  );
  const recent = new Map();
  createServer(async (request, response) => {
    response.setHeader("Cache-Control", "no-store");
    response.setHeader("X-Content-Type-Options", "nosniff");
    const send = (status, body) => {
      response.writeHead(status, { "Content-Type": "application/json" });
      response.end(JSON.stringify(body));
    };
    const origin = request.headers.origin;
    if (!origin || !origins.has(origin))
      return send(403, { error: "origin_not_allowed" });
    response.setHeader("Access-Control-Allow-Origin", origin);
    response.setHeader("Vary", "Origin");
    if (request.method === "OPTIONS") {
      response.setHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS");
      response.setHeader("Access-Control-Allow-Headers", "Content-Type");
      response.writeHead(204);
      response.end();
      return;
    }
    if (request.url === "/api/search/status" && request.method === "GET")
      return send(200, { configured: search.isConfigured() });
    if (request.url !== "/api/search") return send(404, { error: "not_found" });
    if (request.method !== "POST")
      return send(405, { error: "method_not_allowed" });
    if (!request.headers["content-type"]?.startsWith("application/json"))
      return send(415, { error: "json_required" });
    const now = Date.now(),
      address = request.socket.remoteAddress;
    for (const [key, times] of recent)
      if (!times.some((time) => time > now - 60000)) recent.delete(key);
    const times = (recent.get(address) || []).filter(
      (time) => time > now - 60000,
    );
    if (times.length >= 6) {
      response.setHeader("Retry-After", "60");
      return send(429, { error: "too_many_requests" });
    }
    times.push(now);
    recent.set(address, times);
    try {
      const chunks = [];
      let size = 0;
      for await (const chunk of request) {
        size += chunk.length;
        if (size > 8192) {
          send(413, { error: "request_too_large" });
          request.destroy();
          return;
        }
        chunks.push(chunk);
      }
      let input;
      try {
        input = JSON.parse(Buffer.concat(chunks).toString("utf8"));
      } catch {
        return send(400, { error: "invalid_json" });
      }
      const query = typeof input?.q === "string" ? input.q.trim() : "";
      if (!query || query.length > 400 || /[\u0000-\u001f]/.test(query))
        return send(400, { error: "invalid_query" });
      send(200, await search.search(query));
    } catch (error) {
      send(503, {
        error:
          error instanceof SearchUnavailable
            ? error.code
            : "search_unavailable",
      });
    }
  }).listen(
    Number(process.env.SEARCH_PORT || 8787),
    process.env.SEARCH_HOST || "127.0.0.1",
    () =>
      console.log(
        "WonderVerse search API started. No queries or credentials are logged.",
      ),
  );
}
