import { escapeHTML, icon } from "../utils/icons.js";
import { sourceSentences } from "../utils/sourceText.js";

const isoDate = (value) => {
  const date = typeof value === "string" ? new Date(value) : null;
  return date && Number.isFinite(date.getTime()) ? date.toISOString() : null;
};

export function plainSourceExcerpt(value) {
  if (typeof value !== "string") return "";
  return value
    .replace(/<\/?(?:span|b|i|em|strong|mark|small|br|p)\b[^>]*>/gi, "")
    .replace(
      /&(amp|quot|apos|lt|gt|nbsp);/g,
      (_, name) =>
        ({ amp: "&", quot: '"', apos: "'", lt: "<", gt: ">", nbsp: " " })[name],
    )
    .trim();
}

export function createSourceDocument(
  query,
  rows,
  {
    provider,
    retrievedAt,
    matchedQuery = "",
    kind = "search-previews",
    sourceEditedAt,
  },
) {
  const seen = new Set();
  const sources = rows
    .flatMap((row) => {
      try {
        const url = new URL(row.url);
        if (
          !["https:", "http:"].includes(url.protocol) ||
          url.username ||
          url.password ||
          seen.has(url.href) ||
          typeof row.title !== "string" ||
          !row.title.trim()
        )
          return [];
        seen.add(url.href);
        return [
          {
            title: row.title,
            url: url.href,
            text: plainSourceExcerpt(row.snippet),
            date: typeof row.sourceDate === "string" ? row.sourceDate : "",
          },
        ];
      } catch {
        return [];
      }
    })
    .slice(0, 10);
  return {
    query,
    provider,
    matchedQuery,
    retrievedAt: isoDate(retrievedAt),
    kind: kind === "article-introduction" ? kind : "search-previews",
    sourceEditedAt: isoDate(sourceEditedAt),
    sources,
  };
}

export function renderSourceDocument(document) {
  const article = document.kind === "article-introduction";
  const sourceText = (text) => {
    if (!article) return escapeHTML(text);
    const sentences = sourceSentences(text),
      paragraphs = [];
    for (let i = 0; i < sentences.length; i += 3)
      paragraphs.push(
        `<p>${escapeHTML(sentences.slice(i, i + 3).join(" "))}</p>`,
      );
    return paragraphs.join("");
  };
  return `<article class="source-document" aria-label="Source document">
    <header><span class="eyebrow">${article ? "ARTICLE DOCUMENT" : "SOURCE BRIEF"}</span><h2 tabindex="-1">${escapeHTML(document.query)}</h2><p>${article ? `Article introduction from ${escapeHTML(document.provider)}. Source wording preserved; the full article and its claims have not been independently checked.` : `Collected excerpts from ${escapeHTML(document.provider)}. These are search previews; full pages have not been read or cross-checked.`}</p>${document.matchedQuery ? `<p>Suggested search: <strong>${escapeHTML(document.matchedQuery)}</strong></p>` : ""}<p class="text-small text-secondary">${document.retrievedAt ? `Retrieved ${escapeHTML(new Date(document.retrievedAt).toLocaleString())}` : "Retrieval time unavailable"} · ${document.sources.length} source ${document.sources.length === 1 ? "page" : "pages"}</p>${article ? `<p class="text-small text-secondary">${document.sourceEditedAt ? `Article last edited: ${escapeHTML(new Date(document.sourceEditedAt).toLocaleString())}` : "Article edit date unavailable"}</p>` : ""}<button id="download-source-document" class="btn btn-secondary btn-sm">${icon("book", 15)} Download document (.md)</button></header>
    <h3>${article ? "Introduction" : "Source excerpts"}</h3>
    ${document.sources.length ? document.sources.map((source, index) => `<section class="source-document-section"><h4>${escapeHTML(source.title)} <a href="${escapeHTML(source.url)}" target="_blank" rel="noopener noreferrer" aria-label="Open source ${index + 1}">[${index + 1}]</a></h4>${source.text ? `<blockquote>${sourceText(source.text)}</blockquote>` : '<p class="text-secondary">No excerpt was returned for this source.</p>'}<p class="text-small text-secondary">${escapeHTML(new URL(source.url).hostname)}${article ? "" : ` · ${source.date ? `Date shown by provider: ${escapeHTML(source.date)}` : "Source date unavailable"}`}</p></section>`).join("") : "<p>No source excerpts were retrieved. A factual answer cannot be prepared from missing evidence.</p>"}
    <footer><h3>Before relying on this</h3><p>Open the numbered sources to check context, dates, and whether they answer your question. Different pages can disagree. No additional facts have been generated for this brief.</p></footer>
  </article>`;
}

const mdText = (value) => String(value).replace(/([\\`*_{}\[\]<>#])/g, "\\$1");
export function sourceDocumentMarkdown(document) {
  const article = document.kind === "article-introduction";
  const lines = [
    `# ${mdText(document.query)}`,
    "",
    article
      ? `Article introduction from ${mdText(document.provider)}. Source wording preserved; the full article and its claims have not been independently checked.`
      : `Source brief from ${mdText(document.provider)} search excerpts. Full pages have not been read or cross-checked.`,
    "",
    `Retrieved: ${document.retrievedAt || "unavailable"}`,
  ];
  if (document.matchedQuery)
    lines.push(`Suggested search: ${mdText(document.matchedQuery)}`);
  if (article)
    lines.push(
      `Article last edited: ${document.sourceEditedAt || "unavailable"}`,
    );
  lines.push("", article ? "## Introduction" : "## Source excerpts", "");
  if (!document.sources.length)
    lines.push(
      "No source excerpts were retrieved. No factual answer has been generated.",
      "",
    );
  document.sources.forEach((source, index) => {
    lines.push(
      `### ${index + 1}. ${mdText(source.title)}`,
      "",
      source.text
        ? source.text
            .split(/\r?\n/)
            .map((line) => `> ${mdText(line)}`)
            .join("\n")
        : "No excerpt was returned for this source.",
      "",
      `Source [${index + 1}]: <${source.url.replace(/[<>\r\n]/g, encodeURIComponent)}>`,
      ...(article
        ? []
        : [
            `Source date: ${source.date ? `provider-reported ${mdText(source.date)}` : "unavailable"}`,
          ]),
      "",
    );
  });
  lines.push(
    "## Before relying on this",
    "",
    "Open the source pages to check context, dates, and whether they answer the question. Different pages can disagree. No additional facts have been generated for this brief.",
    "",
  );
  return lines.join("\n");
}
