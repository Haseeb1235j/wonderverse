import test from "node:test";
import assert from "node:assert/strict";

globalThis.localStorage = { getItem: () => null, setItem() {} };
globalThis.window = { location: { hash: "" }, addEventListener() {} };
globalThis.document = {
  documentElement: { setAttribute() {} },
  querySelectorAll: () => [],
  getElementById: () => null,
};
const { Router } = await import("../src/router.js");
const { SearchPage } = await import("../src/pages/SearchPage.js");
const { WikipediaService } = await import("../src/services/wikipedia.js");
const { WebSearchService } = await import("../src/services/webSearch.js");
const { renderExternalSearch } = await import(
  "../src/components/ExternalSearch.js"
);

test("without a configured backend, Web search makes no request and offers explicit external links", async (t) => {
  const fetchMock = t.mock.method(globalThis, "fetch", () => {
    throw new Error("Unexpected request");
  });
  await assert.rejects(
    WebSearchService.search("current information"),
    (error) => error.code === "not_configured",
  );
  assert.equal(fetchMock.mock.callCount(), 0);
  SearchPage.scope = "web";
  SearchPage.query = "current information";
  SearchPage.container = { innerHTML: "" };
  SearchPage.renderAPIError("not_configured");
  assert.match(
    SearchPage.container.innerHTML,
    /Search Wikipedia inside WonderVerse/,
  );
  assert.match(
    SearchPage.container.innerHTML,
    /Results are not loaded into WonderVerse/,
  );
});

test("external search links preserve the exact query and escape displayed text", () => {
  const query = "R&D? 100% + C++ <script>alert(1)</script>";
  const html = renderExternalSearch(query);
  assert.ok(!html.includes("<script>"));
  assert.match(html, /&lt;script&gt;/);
  const urls = [...html.matchAll(/href="([^"]+)"/g)].map(
    (match) => new URL(match[1]),
  );
  assert.equal(urls.length, 2);
  for (const url of urls) assert.equal(url.searchParams.get("q"), query);
});

test("route parsing preserves encoded ampersands, percent signs and question marks", () => {
  const value = "R&D? 100% + C++";
  window.location.hash = `#/search?q=${encodeURIComponent(value)}`;
  assert.deepEqual(Router.parseRoute(), {
    route: "/search",
    params: { q: value },
  });
  window.location.hash = "#/topic/Black_Hole/diagram";
  assert.deepEqual(Router.parseRoute(), {
    route: "/topic",
    params: { t: "Black_Hole", mode: "diagram" },
  });
  window.location.hash = "#/search/%broken";
  assert.equal(Router.parseRoute().params.q, "%broken");
});

test("late search responses cannot replace the current page or newer results", async (t) => {
  const deferred = [];
  t.mock.method(
    WikipediaService,
    "search",
    () => new Promise((resolve) => deferred.push(resolve)),
  );
  const rendered = [];
  t.mock.method(SearchPage, "setStatus", () => {});
  t.mock.method(SearchPage, "renderResults", (hits) =>
    rendered.push(hits[0].title),
  );
  SearchPage.scope = "topics";
  SearchPage.container = { isConnected: true };
  SearchPage.query = "first";
  const first = SearchPage.executeSearchQuery();
  SearchPage.query = "second";
  const second = SearchPage.executeSearchQuery();
  deferred[1]([{ title: "second" }]);
  await second;
  deferred[0]([{ title: "first" }]);
  await first;
  assert.deepEqual(rendered, ["second"]);
  const third = SearchPage.executeSearchQuery();
  SearchPage.destroy();
  deferred[2]([{ title: "after navigation" }]);
  await third;
  assert.deepEqual(rendered, ["second"]);
});

test("search result markup escapes untrusted titles and snippets", () => {
  const mount = { innerHTML: "", querySelectorAll: () => [] };
  SearchPage.container = mount;
  SearchPage.query = "<script>alert(1)</script>";
  SearchPage.renderResults([
    { title: "<img src=x onerror=alert(1)>", snippet: '& unsafe "text"' },
  ]);
  assert.ok(!mount.innerHTML.includes("<img"));
  assert.match(mount.innerHTML, /&lt;img/);
  assert.match(mount.innerHTML, /&amp; unsafe/);
});

test("article documents ignore stale loads and keep the explicitly selected article", async (t) => {
  const deferred = [];
  t.mock.method(
    WikipediaService,
    "getLeadArticle",
    () => new Promise((resolve) => deferred.push(resolve)),
  );
  const shown = [];
  t.mock.method(SearchPage, "showDocument", (data) => shown.push(data));
  SearchPage.container = { isConnected: true };
  const button = () => ({
    disabled: false,
    textContent: "Read document",
    isConnected: true,
  });
  const first = SearchPage.openArticleDocument("First", button());
  const second = SearchPage.openArticleDocument("Kepler-452b", button());
  deferred[1]({
    extract: "A disputed candidate.",
    revision: 123,
    timestamp: "2026-10-01T00:00:00Z",
  });
  await second;
  deferred[0]({ extract: "Unrelated first article." });
  await first;
  assert.equal(shown.length, 1);
  assert.equal(shown[0].query, "Kepler-452b");
  assert.equal(shown[0].sources[0].text, "A disputed candidate.");
  assert.equal(
    shown[0].sources[0].url,
    "https://en.wikipedia.org/w/index.php?oldid=123",
  );
  const third = SearchPage.openArticleDocument("After navigation", button());
  SearchPage.destroy();
  deferred[2]({ extract: "Late article." });
  await third;
  assert.equal(shown.length, 1);
});

test("a missing introduction does not become a fabricated document", async (t) => {
  t.mock.method(WikipediaService, "getLeadArticle", async () => null);
  const shown = t.mock.method(SearchPage, "showDocument", () => {});
  SearchPage.container = { isConnected: true };
  const button = {
    disabled: false,
    textContent: "Read document",
    isConnected: true,
  };
  await SearchPage.openArticleDocument("Unknown", button);
  assert.equal(shown.mock.callCount(), 0);
  assert.equal(button.disabled, false);
});
