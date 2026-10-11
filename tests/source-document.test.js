import test from "node:test";
import assert from "node:assert/strict";
import {
  createSourceDocument,
  renderSourceDocument,
  sourceDocumentMarkdown,
  plainSourceExcerpt,
} from "../src/components/SourceDocument.js";

test("source documents preserve qualifications and numbers and link every excerpt to its source", () => {
  const text =
    "This planet may be habitable. Its estimated radius is 1.63 times Earth’s; this is uncertain.";
  const brief = createSourceDocument(
    "Kepler 452 b",
    [
      {
        title: "Kepler-452b",
        url: "https://en.wikipedia.org/wiki/Kepler-452b",
        snippet: text,
      },
    ],
    {
      provider: "Wikipedia",
      retrievedAt: "2026-10-11T08:00:00Z",
      matchedQuery: "kepler 452 b",
    },
  );
  assert.equal(brief.sources[0].text, text);
  const html = renderSourceDocument(brief),
    markdown = sourceDocumentMarkdown(brief);
  assert.match(html, /Open source 1/);
  assert.match(html, /full pages have not been read or cross-checked/i);
  assert.ok(markdown.includes(text));
  assert.ok(
    markdown.includes(
      "Source [1]: <https://en.wikipedia.org/wiki/Kepler-452b>",
    ),
  );
  assert.match(markdown, /Suggested search: kepler 452 b/);
  assert.match(markdown, /Source date: unavailable/);
});

test("empty or missing excerpts do not generate facts; unsafe or duplicate sources are excluded", () => {
  const brief = createSourceDocument(
    "Unknown",
    [
      { title: "Unsafe", url: "javascript:alert(1)", snippet: "fake" },
      {
        title: "Credential URL",
        url: "https://secret@example.com/",
        snippet: "fake",
      },
      { title: "<script>bad</script>", url: "https://example.com/" },
      { title: "Duplicate", url: "https://example.com/", snippet: "duplicate" },
    ],
    { provider: "Example", retrievedAt: "invalid" },
  );
  assert.equal(brief.sources.length, 1);
  assert.equal(brief.sources[0].text, "");
  assert.equal(brief.retrievedAt, null);
  assert.match(renderSourceDocument(brief), /No excerpt was returned/);
  assert.ok(!renderSourceDocument(brief).includes("<script>"));
  const empty = createSourceDocument("Unknown", [], { provider: "Example" });
  assert.match(
    sourceDocumentMarkdown(empty),
    /No factual answer has been generated/,
  );
});

test("search markup is removed without destroying numeric comparisons", () => {
  assert.equal(
    plainSourceExcerpt(
      '<span class="searchmatch">Value</span> &lt; 3.5 and > 1.2; &quot;estimated&quot;.',
    ),
    'Value < 3.5 and > 1.2; "estimated".',
  );
});

test("an article document preserves the selected introduction and identifies revision and edit date", () => {
  const text =
    "Kepler-452b is a disputed exoplanet candidate. Initial reports claim a radius of 1.63 Earth radii. This remains uncertain.";
  const brief = createSourceDocument(
    "Kepler-452b",
    [
      {
        title: "Kepler-452b",
        url: "https://en.wikipedia.org/w/index.php?oldid=123",
        snippet: text,
      },
    ],
    {
      provider: "Wikipedia",
      kind: "article-introduction",
      retrievedAt: "2026-10-11T08:00:00Z",
      sourceEditedAt: "2026-10-01T00:00:00Z",
    },
  );
  assert.equal(brief.sources.length, 1);
  assert.equal(brief.sources[0].text, text);
  const html = renderSourceDocument(brief),
    markdown = sourceDocumentMarkdown(brief);
  assert.match(html, /ARTICLE DOCUMENT/);
  assert.match(html, /Article last edited/);
  assert.match(html, /oldid=123/);
  assert.ok(!html.includes("These are search previews"));
  assert.ok(markdown.includes(text));
  assert.match(markdown, /Article last edited: 2026-10-01T00:00:00.000Z/);
});
