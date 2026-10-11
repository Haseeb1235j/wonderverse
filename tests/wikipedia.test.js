import test from "node:test";
import assert from "node:assert/strict";
import { WikipediaService, fetchTopicData } from "../src/services/wikipedia.js";

test("misspelled searches retry the actual Wikipedia suggestion and label suggested matches", async (t) => {
  const queries = [];
  t.mock.method(globalThis, "fetch", async (url) => {
    const params = new URL(url).searchParams;
    const query = params.get("gsrsearch") || params.get("srsearch");
    queries.push(query);
    if (params.has("generator") && query === "kepler 452 b")
      return new Response(
        JSON.stringify({
          query: {
            pages: {
              1: {
                title: "Kepler-452b",
                extract: "A source excerpt.",
                index: 1,
              },
            },
          },
        }),
      );
    if (params.has("list"))
      return new Response(
        JSON.stringify({
          query: { search: [], searchinfo: { suggestion: "kepler 452 b" } },
        }),
      );
    return new Response(JSON.stringify({ query: { pages: {} } }));
  });
  const hits = await WikipediaService.search("keplar 452 b");
  assert.deepEqual(queries, ["keplar 452 b", "keplar 452 b", "kepler 452 b"]);
  assert.equal(hits[0].title, "Kepler-452b");
  assert.equal(hits[0].suggestedQuery, "kepler 452 b");
});

test("suggestion retries are bounded and errors never become invented matches", async (t) => {
  let calls = 0;
  t.mock.method(globalThis, "fetch", async () => {
    calls++;
    return new Response(
      JSON.stringify({
        query: {
          pages: {},
          search: [],
          searchinfo: {
            suggestion: calls < 3 ? "first correction" : "second correction",
          },
        },
      }),
    );
  });
  assert.deepEqual(await WikipediaService.search("Unmatched query"), []);
  assert.equal(calls, 4);
});

test("a weak partial match does not hide the engine’s more relevant spelling suggestion", async (t) => {
  const queries = [];
  t.mock.method(globalThis, "fetch", async (url) => {
    const params = new URL(url).searchParams,
      query = params.get("gsrsearch") || params.get("srsearch");
    queries.push(query);
    if (params.has("generator"))
      return new Response(
        JSON.stringify({
          query: {
            pages: {
              1: {
                title:
                  query === "kepler 452b"
                    ? "Kepler-452b"
                    : "Kepler space telescope",
                extract: "Actual excerpt.",
                index: 1,
              },
            },
          },
        }),
      );
    return new Response(
      JSON.stringify({
        query: {
          search: [
            { title: "Kepler space telescope", snippet: "Actual excerpt." },
          ],
          searchinfo: { suggestion: "kepler 452b" },
        },
      }),
    );
  });
  const hits = await WikipediaService.search("keplar 452b");
  assert.equal(hits[0].title, "Kepler-452b");
  assert.equal(hits[0].suggestedQuery, "kepler 452b");
  assert.deepEqual(queries, ["keplar 452b", "keplar 452b", "kepler 452b"]);
});

test("an unavailable exact article offers real search choices without auto-selecting", async (t) => {
  t.mock.method(WikipediaService, "getSummary", async () => null);
  t.mock.method(WikipediaService, "search", async () => [
    { title: "Kepler-452b", snippet: "Real excerpt." },
  ]);
  const data = await fetchTopicData("keplar 452 b");
  assert.equal(data.summary, null);
  assert.equal(data.choices[0].title, "Kepler-452b");
  assert.equal(data.title, "keplar 452 b");
});

test("HTTP and API errors are not treated as articles or empty successful searches", async (t) => {
  t.mock.method(
    globalThis,
    "fetch",
    async () =>
      new Response(JSON.stringify({ title: "Not found", detail: "Missing" }), {
        status: 404,
      }),
  );
  assert.equal(await WikipediaService.getSummary("Missing"), null);
  assert.equal(await WikipediaService.search("Missing"), null);
  t.mock.restoreAll();
  t.mock.method(
    globalThis,
    "fetch",
    async () => new Response(JSON.stringify({ error: { code: "failed" } })),
  );
  assert.equal(await WikipediaService.search("Missing"), null);
});

test("disambiguation asks for a choice instead of silently choosing an unrelated article", async (t) => {
  let summaryCalls = 0;
  t.mock.method(WikipediaService, "getSummary", async () => {
    summaryCalls++;
    return {
      title: "Mercury",
      type: "disambiguation",
      extract: "Several subjects.",
    };
  });
  t.mock.method(WikipediaService, "search", async () => [
    { title: "Mercury (planet)" },
    { title: "Mercury (element)" },
  ]);
  const data = await fetchTopicData("Mercury");
  assert.equal(data.summary.type, "disambiguation");
  assert.equal(data.choices.length, 2);
  assert.equal(summaryCalls, 1);
});

test("article lead and revision metadata are fetched together", async (t) => {
  t.mock.method(globalThis, "fetch", async (url) => {
    assert.equal(new URL(url).searchParams.get("prop"), "extracts|revisions");
    return new Response(
      JSON.stringify({
        query: {
          pages: {
            1: {
              extract: "Source text.",
              revisions: [{ revid: 123, timestamp: "2026-10-01T00:00:00Z" }],
            },
          },
        },
      }),
    );
  });
  assert.deepEqual(await WikipediaService.getLeadArticle("Example"), {
    extract: "Source text.",
    revision: 123,
    timestamp: "2026-10-01T00:00:00Z",
  });
});

test("no topic video results stays empty instead of showing unrelated Science footage", async (t) => {
  let calls = 0;
  t.mock.method(globalThis, "fetch", async (url) => {
    calls++;
    assert.match(decodeURIComponent(url), /Obscure subject/);
    return new Response(JSON.stringify({ query: { pages: {} } }));
  });
  assert.deepEqual(
    await WikipediaService.getVideos("Obscure subject", "biology"),
    [],
  );
  assert.equal(calls, 1);
});
