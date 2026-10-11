import { WikipediaService } from "../services/wikipedia.js";
import { WebSearchService } from "../services/webSearch.js";
import {
  detectCategory,
  getCategoryIcon,
  getCategoryLabel,
} from "../generators/categoryDetector.js";
import { Router } from "../router.js";
import { SearchBar } from "../components/SearchBar.js";
import { renderExternalSearch } from "../components/ExternalSearch.js";
import {
  createSourceDocument,
  renderSourceDocument,
  sourceDocumentMarkdown,
  plainSourceExcerpt,
} from "../components/SourceDocument.js";
import { wikiArticleURL } from "../utils/sourceText.js";
import { SkeletonLoader } from "../components/ui/SkeletonLoader.js";
import { icon, escapeHTML } from "../utils/icons.js";
const suggestions = [
  "Photosynthesis",
  "Black hole",
  "Ancient Egypt",
  "Heart",
  "Artificial intelligence",
  "Volcano",
  "DNA",
  "Moon",
];
const providerLabels = {
  tavily: "Tavily",
  serper: "Serper",
  brave: "Brave Search",
};

export const SearchPage = {
  container: null,
  query: "",
  scope: "topics",
  requestId: 0,
  documentData: null,
  documentRequestId: 0,
  documentControls(ready = true) {
    return `<div class="search-document-toolbar"><button id="toggle-source-document" class="btn btn-secondary btn-sm" aria-expanded="false" aria-controls="source-document-mount" ${ready ? "" : "hidden"}>Read as document</button><span class="text-small text-secondary">${ready ? "Source excerpts with numbered references." : "Choose a result to read its article introduction as a document."}</span><span id="document-status" class="text-small text-secondary" role="status"></span></div><div id="source-document-mount" hidden></div>`;
  },
  bindDocument(rows, provider, retrievedAt) {
    this.documentData = rows
      ? createSourceDocument(this.query, rows, {
          provider,
          retrievedAt,
        })
      : null;
    const button = document.getElementById("toggle-source-document");
    const mount = document.getElementById("source-document-mount");
    const list = this.container?.querySelector?.(".search-results-list");
    if (!button || !mount || !list) return;
    button.addEventListener("click", () => {
      if (mount.hidden) this.showDocument(this.documentData);
      else {
        mount.hidden = true;
        list.hidden = false;
        button.setAttribute("aria-expanded", "false");
        button.textContent = "Read as document";
      }
    });
  },
  showDocument(data) {
    const button = document.getElementById("toggle-source-document");
    const mount = document.getElementById("source-document-mount");
    const list = this.container?.querySelector?.(".search-results-list");
    if (!data || !button || !mount || !list) return;
    this.documentData = data;
    mount.hidden = false;
    list.hidden = true;
    button.hidden = false;
    button.setAttribute("aria-expanded", "true");
    button.textContent = "Show results";
    mount.innerHTML = renderSourceDocument(data);
    mount.querySelector("h2")?.focus();
    document
      .getElementById("download-source-document")
      ?.addEventListener("click", () => {
        const url = URL.createObjectURL(
          new Blob([sourceDocumentMarkdown(this.documentData)], {
            type: "text/markdown;charset=utf-8",
          }),
        );
        const link = document.createElement("a");
        link.href = url;
        link.download = "wonderverse-source-brief.md";
        document.body.appendChild(link);
        link.click();
        link.remove();
        setTimeout(() => URL.revokeObjectURL(url), 1000);
      });
  },
  async openArticleDocument(title, button) {
    const request = this.requestId,
      documentRequest = ++this.documentRequestId;
    const mount = this.container;
    const status = document.getElementById("document-status");
    const current = () =>
      request === this.requestId &&
      documentRequest === this.documentRequestId &&
      mount === this.container &&
      mount?.isConnected;
    button.disabled = true;
    button.textContent = "Loading document…";
    if (status)
      status.textContent = "Loading the selected article introduction…";
    try {
      const article = await WikipediaService.getLeadArticle(title);
      if (!current()) return;
      if (!article?.extract) {
        if (status)
          status.textContent =
            "The introduction is unavailable. Try again or open the Wikipedia source.";
        return;
      }
      const revision =
        Number.isSafeInteger(article.revision) && article.revision > 0;
      const data = createSourceDocument(
        title,
        [
          {
            title,
            url: revision
              ? `https://en.wikipedia.org/w/index.php?oldid=${article.revision}`
              : wikiArticleURL(title),
            snippet: article.extract,
          },
        ],
        {
          provider: "Wikipedia",
          retrievedAt: new Date().toISOString(),
          kind: "article-introduction",
          sourceEditedAt: article.timestamp,
        },
      );
      if (status) status.textContent = "";
      this.showDocument(data);
    } catch {
      if (current() && status)
        status.textContent =
          "The introduction could not be loaded. Try again or open the Wikipedia source.";
    } finally {
      if (button.isConnected) {
        button.disabled = false;
        button.textContent = "Read document";
      }
    }
  },
  render(params) {
    this.requestId++;
    this.documentRequestId++;
    this.documentData = null;
    this.query = params.q || "";
    this.scope = ["web", "topics"].includes(params.scope)
      ? params.scope
      : WebSearchService.isConfigured()
        ? "web"
        : "topics";
    return `<div class="search-page-container"><div class="page-title-banner"><h1 class="text-h1">Follow the question.</h1><p class="text-small text-secondary">Find source pages, or explore an encyclopedia topic.</p><div class="search-page-form">${SearchBar.render("Search a topic or question", "page-search", this.query)}</div></div>
      <div class="search-scopes" role="group" aria-label="Search source">${[
        ["web", "Web"],
        ["topics", "Encyclopedia"],
      ]
        .map(
          ([id, label]) =>
            `<button class="feed-filter ${this.scope === id ? "active" : ""}" data-scope="${id}" aria-pressed="${this.scope === id}">${label}</button>`,
        )
        .join("")}</div>
      <aside class="source-note">${this.scope === "web" ? "<strong>Web source results</strong><p>Search previews point to original pages. A search result does not establish that a claim is true or a listing is still available. Open the source to check details and dates.</p>" : "<strong>Encyclopedia search · Wikipedia</strong><p>Background articles from a single source. For current or changing information, use Web search and check the original pages.</p>"}</aside>
      <div id="search-status-bar" role="status"></div><div id="search-results-mount">${this.query ? SkeletonLoader.renderSearchSkeletons() : ""}</div></div>`;
  },
  bindEvents(params) {
    this.container = document.getElementById("search-results-mount");
    this.query = params.q || "";
    SearchBar.bindEvents("page-search", (query) =>
      Router.navigate(
        `search?q=${encodeURIComponent(query)}&scope=${this.scope}`,
      ),
    );
    document
      .querySelectorAll("[data-scope]")
      .forEach((button) =>
        button.addEventListener("click", () =>
          Router.navigate(
            `search?q=${encodeURIComponent(this.query)}&scope=${button.dataset.scope}`,
          ),
        ),
      );
    if (this.scope === "web" && !WebSearchService.isConfigured())
      this.renderAPIError("not_configured");
    else if (this.query) this.executeSearchQuery();
    else if (this.scope === "web") {
      this.setStatus(
        "Search the web",
        "Enter a topic or question to find source pages.",
      );
      this.container.innerHTML = renderExternalSearch();
    } else this.renderNoResults(true);
  },
  setStatus(title, detail) {
    const status = document.getElementById("search-status-bar");
    if (status)
      status.innerHTML = `<h2 class="text-h3">${escapeHTML(title)}</h2><p class="text-small text-secondary">${escapeHTML(detail)}</p>`;
  },
  async executeSearchQuery() {
    const request = ++this.requestId,
      query = this.query,
      mount = this.container,
      scope = this.scope;
    this.setStatus(
      `Searching for “${query}”`,
      scope === "web"
        ? "Finding source pages…"
        : "Finding articles on Wikipedia…",
    );
    const current = () =>
      request === this.requestId &&
      mount === this.container &&
      mount?.isConnected;
    try {
      if (scope === "web") {
        const data = await WebSearchService.search(query);
        if (!current()) return;
        this.renderWebResults(data);
      } else {
        const results = await WikipediaService.search(query);
        if (!current()) return;
        if (results === null) this.renderAPIError();
        else if (!results.length) this.renderNoResults();
        else this.renderResults(results);
      }
    } catch (error) {
      if (current()) this.renderAPIError(error.code);
    }
  },
  renderWebResults(data) {
    const provider = providerLabels[data.provider] || "Search provider";
    const retrieved = new Date(data.retrievedAt);
    const time = Number.isFinite(retrieved.getTime())
      ? retrieved.toLocaleString()
      : "Time unavailable";
    this.setStatus(
      `${data.results.length} web results for “${this.query}”`,
      `Search via ${provider} · Retrieved ${time} · Source claims not independently verified`,
    );
    this.container.innerHTML = data.results.length
      ? `${this.documentControls()}<div class="search-results-list">${data.results.map((result) => `<article class="search-result"><span class="web-source-domain">${icon("external", 13)} ${escapeHTML(new URL(result.url).hostname)}</span><h3><a href="${escapeHTML(result.url)}" target="_blank" rel="noopener noreferrer">${escapeHTML(result.title)}</a></h3><p>${escapeHTML((result.snippet || "").replace(/<[^>]*>/g, ""))}</p><p class="text-small text-secondary">${result.sourceDate ? `Date shown by provider: ${escapeHTML(result.sourceDate)}` : "Source date unavailable"}</p><a href="${escapeHTML(result.url)}" target="_blank" rel="noopener noreferrer" class="btn btn-secondary btn-sm">Open source ${icon("external", 13)}</a></article>`).join("")}</div><p class="collection-note">Results supplied by ${escapeHTML(provider)}. Search previews can omit context; use the original page for details.</p>`
      : '<div class="empty-collection"><h3>No matching web pages returned</h3><p>Try different keywords. No answer has been generated from missing evidence.</p></div>';
    if (data.results.length)
      this.bindDocument(data.results, provider, data.retrievedAt);
  },
  renderResults(hits) {
    const suggestedQuery = hits.find(
      (hit) => hit.suggestedQuery,
    )?.suggestedQuery;
    this.setStatus(
      suggestedQuery
        ? `${hits.length} suggested articles`
        : `${hits.length} ${hits.length === 1 ? "article" : "articles"} for “${this.query}”`,
      suggestedQuery
        ? `Wikipedia suggested “${suggestedQuery}” for “${this.query}”. Choose the article you meant.`
        : "Wikipedia matches · article excerpts, not verified answers to your question.",
    );
    const query = this.query;
    this.container.innerHTML = `${this.documentControls(false)}<div class="search-results-list">${hits
      .map((hit) => {
        const category = detectCategory(hit.title, hit.snippet),
          snippet = plainSourceExcerpt(hit.snippet);
        return `<article class="search-result"><div class="badge">${getCategoryIcon(category)} ${getCategoryLabel(category)}</div><h3>${escapeHTML(hit.title)}</h3><p>${escapeHTML(snippet || "Open this article to learn more.")}</p><div class="result-actions"><button class="btn btn-primary btn-sm open-journey-btn" data-title="${escapeHTML(hit.title)}">Explore topic ${icon("arrow", 15)}</button><button class="btn btn-secondary btn-sm article-document-btn" data-title="${escapeHTML(hit.title)}">Read document</button><a class="btn btn-ghost btn-sm" href="${escapeHTML(wikiArticleURL(hit.title))}" target="_blank" rel="noopener noreferrer">Wikipedia ${icon("external", 13)}</a></div></article>`;
      })
      .join("")}</div>`;
    this.bindDocument(null);
    this.container
      .querySelectorAll(".article-document-btn")
      .forEach((button) =>
        button.addEventListener("click", () =>
          this.openArticleDocument(button.dataset.title, button),
        ),
      );
    this.container
      .querySelectorAll(".open-journey-btn")
      .forEach((button) =>
        button.addEventListener("click", () =>
          Router.navigate(
            `topic?t=${encodeURIComponent(button.dataset.title.replace(/ /g, "_"))}&q=${encodeURIComponent(query)}`,
          ),
        ),
      );
  },
  renderSuggestions() {
    return `<div class="search-suggestions">${suggestions.map((title) => `<button class="suggest-btn" data-query="${title}">${icon("search", 16)}<span>${title}</span>${icon("arrow", 16)}</button>`).join("")}</div>`;
  },
  bindSuggestions() {
    this.container
      .querySelectorAll(".suggest-btn")
      .forEach((button) =>
        button.addEventListener("click", () =>
          Router.navigate(
            `search?q=${encodeURIComponent(button.dataset.query)}&scope=${this.scope}`,
          ),
        ),
      );
  },
  renderNoResults(initial = false) {
    this.setStatus(
      initial ? "A few starting points" : `No articles for “${this.query}”`,
      initial
        ? "See where your curiosity takes you."
        : "Try broader keywords or check the spelling.",
    );
    this.container.innerHTML = `${initial ? "" : `${renderExternalSearch(this.query)}<h3 class="text-h3">Other topics to explore</h3>`}${this.renderSuggestions()}`;
    this.bindSuggestions();
  },
  renderAPIError(code) {
    if (this.scope === "web") {
      this.setStatus(
        code === "not_configured"
          ? "Web search isn’t connected yet."
          : "Web search is unavailable right now.",
        code === "not_configured"
          ? "Search Wikipedia inside WonderVerse, or use the links below to search on another website."
          : "Search capacity or the connection is unavailable. You can retry or explicitly switch to encyclopedia articles.",
      );
      this.container.innerHTML = `${renderExternalSearch(this.query)}<div class="result-actions">${code === "not_configured" ? "" : '<button class="btn btn-secondary" id="retry-search">Try again</button>'}<a class="btn btn-primary" href="#/search?q=${encodeURIComponent(this.query)}&scope=topics">Search Wikipedia inside WonderVerse</a></div>`;
    } else {
      this.setStatus(
        "We couldn’t load the articles.",
        "Check your connection and try again. These suggestions need a connection too.",
      );
      this.container.innerHTML = `<button class="btn btn-secondary" id="retry-search">Try again</button>${this.renderSuggestions()}`;
      this.bindSuggestions();
    }
    document
      .getElementById("retry-search")
      ?.addEventListener("click", () => this.executeSearchQuery());
  },
  destroy() {
    this.requestId++;
    this.documentRequestId++;
    this.container = null;
    this.documentData = null;
  },
};
export default SearchPage;
