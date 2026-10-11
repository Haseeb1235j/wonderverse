import { escapeHTML, icon } from "../utils/icons.js";
import { wikiArticleURL } from "../utils/sourceText.js";

function displayDate(value) {
  const date = new Date(value);
  return Number.isFinite(date.getTime())
    ? date.toLocaleString(undefined, {
        dateStyle: "medium",
        timeStyle: "short",
      })
    : null;
}

export const SourceNote = {
  render(data) {
    const source = data.leadExtract ? data.articleSource || {} : data.summary;
    const updated = source.timestamp ? displayDate(source.timestamp) : null;
    const revision = String(source.revision || "");
    const revisionURL = /^\d+$/.test(revision)
      ? `https://en.wikipedia.org/w/index.php?oldid=${revision}`
      : wikiArticleURL(data.summary.title);
    return `<aside class="source-note" aria-label="Information source"><div class="source-note-top"><strong>${icon("book", 15)} Wikipedia · single source</strong><a href="${escapeHTML(revisionURL)}" target="_blank" rel="noopener noreferrer">${/^\d+$/.test(revision) ? "View source revision" : "View source article"} ${icon("external", 13)}</a></div>
      <p>Article excerpts and reading activities. Facts have not been independently verified against other sources.</p>
      <p class="source-dates">Retrieved ${escapeHTML(displayDate(data.fetchedAt) || "just now")} · ${updated ? `Source last edited ${escapeHTML(updated)}` : "Source edit date unavailable"}</p></aside>`;
  },
};
