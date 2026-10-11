import test from "node:test";
import assert from "node:assert/strict";
import { queryProvider } from "../server/providers.js";

test("a timed-out provider request aborts and returns a safe error", async () => {
  const fetchImpl = (url, options) =>
    new Promise((resolve, reject) => {
      options.signal.addEventListener("abort", () =>
        reject(new Error("Abort with private upstream details")),
      );
    });
  await assert.rejects(
    queryProvider("tavily", "private-key", "query", fetchImpl, 10),
    (error) => error.status === 502 && !error.message.includes("private"),
  );
});
