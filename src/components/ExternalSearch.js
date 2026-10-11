import { escapeHTML, icon } from "../utils/icons.js";

// These are navigation links, not search responses. Nothing is sent until clicked.
export function renderExternalSearch(query = "") {
  const engines = [
    ["Google", "https://www.google.com/search?q="],
    ["DuckDuckGo", "https://duckduckgo.com/?q="],
  ];
  const text = query.trim();
  return `<section class="card external-search" aria-label="Search on another website">
    <h3 class="text-h3">Search the wider web</h3>
    <p class="text-small text-secondary">${text ? `Search for “${escapeHTML(text)}” directly with a search engine.` : "Enter a question above, or open a search engine to start."} These links open another website. Results are not loaded into WonderVerse.</p>
    <div class="result-actions">${engines.map(([name, base]) => `<a class="btn btn-secondary" href="${text ? base + encodeURIComponent(text) : new URL(base).origin}" target="_blank" rel="noopener noreferrer">Search on ${name} ${icon("external", 14)}</a>`).join("")}</div>
  </section>`;
}
