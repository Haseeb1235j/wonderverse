// SearchPage Component
import { WikipediaService } from "../services/wikipedia.js";
import { detectCategory, getCategoryIcon, getCategoryLabel } from "../generators/categoryDetector.js";
import { Animations } from "../utils/animations.js";
import { Router } from "../router.js";
import { SkeletonLoader } from "../components/ui/SkeletonLoader.js";
import { StorageService } from "../services/storage.js";

export const SearchPage = {
  container: null,
  query: "",

  render(params) {
    this.query = params.q || "";
    
    return `
      <div class="search-page-container" style="display: flex; flex-direction: column; gap: var(--space-6); min-height: 70vh;">
        <div id="search-status-bar" class="reveal animate-fade-up">
          <h1 class="text-h1">Searching Universe</h1>
          <p class="text-small text-secondary">Interrogating Wikipedia core systems...</p>
        </div>

        <div id="search-results-mount" style="position: relative; z-index: 5;">
          ${SkeletonLoader.renderSearchSkeletons()}
        </div>
      </div>
    `;
  },

  async bindEvents(params) {
    this.container = document.getElementById("search-results-mount");
    this.query = params.q || "";

    if (!this.query) {
      this.renderNoResults();
      return;
    }

    this.executeSearchQuery();
  },

  async executeSearchQuery() {
    const statusBar = document.getElementById("search-status-bar");
    if (statusBar) {
      statusBar.innerHTML = `
        <h1 class="text-h1">Searching For "${this.query}"</h1>
        <p class="text-small text-secondary">Connecting to live Wikipedia nodes...</p>
      `;
    }

    try {
      const results = await WikipediaService.search(this.query);
      
      if (results === null) {
        // State 4: API Error
        this.renderAPIError();
      } else if (results.length === 0) {
        // State 3: No Results
        this.renderNoResults();
      } else {
        // State 2: Results Found
        this.renderResults(results);
      }
    } catch (e) {
      console.error(e);
      this.renderAPIError();
    }
  },

  renderResults(hits) {
    const statusBar = document.getElementById("search-status-bar");
    if (statusBar) {
      statusBar.innerHTML = `
        <h1 class="text-h1">Found ${hits.length} Results</h1>
        <p class="text-small text-secondary">Verified database nodes matching "${this.query}"</p>
      `;
    }

    const cardsHtml = hits.map((hit, idx) => {
      const category = detectCategory(hit.title, hit.snippet);
      const catIcon = getCategoryIcon(category);
      const catLabel = getCategoryLabel(category);
      const cleanSnippet = hit.snippet
        .replace(/<\/?[^>]+(>|$)/g, "") // strip html tags
        .trim();

      return `
        <div class="result-card reveal card card-glow tilt-card" style="margin-bottom: var(--space-4); display: flex; flex-direction: column; justify-content: space-between; min-height: 180px;">
          <div class="mouse-glow"></div>
          <div>
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--space-2);">
              <span class="badge badge-${category}">${catIcon} ${catLabel}</span>
              <span class="text-tiny text-muted" style="font-weight: 700;">NODE #${idx + 1}</span>
            </div>
            <h3 class="text-h3" style="color: var(--text-primary); margin-top: var(--space-2); margin-bottom: var(--space-2);">${hit.title}</h3>
            <p class="text-small text-secondary" style="line-height: 1.5; margin-bottom: var(--space-4);">${cleanSnippet || "No summary text available."}...</p>
          </div>
          
          <div style="display: flex; gap: var(--space-3); flex-wrap: wrap;">
            <button class="btn btn-primary btn-sm open-journey-btn" data-title="${hit.title}">
              Open Visual Journey →
            </button>
            <a href="https://en.wikipedia.org/wiki/${encodeURIComponent(hit.title.replace(/ /g, '_'))}" target="_blank" class="btn btn-ghost btn-sm">
              Wikipedia ↗
            </a>
          </div>
        </div>
      `;
    }).join("");

    this.container.innerHTML = `
      <div style="max-width: var(--content-max); margin: 0 auto; display: flex; flex-direction: column; gap: var(--space-4);">
        ${cardsHtml}
      </div>
    `;

    // Bind click handlers
    this.container.querySelectorAll(".open-journey-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        const title = btn.getAttribute("data-title");
        // Save query context as query
        Router.navigate(`topic?t=${encodeURIComponent(title.replace(/ /g, '_'))}&q=${encodeURIComponent(this.query)}`);
      });
    });

    Animations.initScrollReveal();
    Animations.setupTilt();
  },

  renderNoResults() {
    const statusBar = document.getElementById("search-status-bar");
    if (statusBar) {
      statusBar.innerHTML = `
        <h1 class="text-h1">No Results Found</h1>
        <p class="text-small text-secondary">No matching telemetry coordinates for "${this.query}"</p>
      `;
    }

    const suggested = ["Photosynthesis", "Black Hole", "Viking"];
    const fallbackCards = [
      { title: "Volcano", desc: "A rupture in the crust of planetary objects releasing hot lava.", cat: "earth" },
      { title: "DNA", desc: "A molecule that carries genetic instructions for living organisms.", cat: "biology" },
      { title: "Ancient Egypt", desc: "A majestic civilization concentrated along the Nile river.", cat: "history" },
      { title: "Quantum Physics", desc: "A fundamental branch of physics exploring small matter behavior.", cat: "physics" }
    ];

    this.container.innerHTML = `
      <div style="max-width: var(--content-max); margin: 0 auto; display: flex; flex-direction: column; gap: var(--space-8); text-align: center; padding: var(--space-6) 0;">
        <div class="card" style="padding: var(--space-8); border-color: var(--accent-amber);">
          <span style="font-size: 2.5rem; display: block; margin-bottom: var(--space-3);">🧭</span>
          <h3 class="text-h2" style="margin: 0; color: var(--accent-amber);">Explore Suggestion Channels</h3>
          <p style="color: var(--text-secondary); font-size: 0.95rem; line-height: 1.5; max-width: 500px; margin: var(--space-2) auto var(--space-4) auto;">
            We couldn't locate matching records for "${this.query}". Verify spellings or query one of our trending nodes instead.
          </p>
          <div style="display: flex; gap: var(--space-3); justify-content: center; flex-wrap: wrap;">
            ${suggested.map(s => `<button class="btn btn-secondary btn-sm suggest-btn" data-query="${s}">${s}</button>`).join('')}
          </div>
        </div>

        <div style="text-align: left;">
          <h4 class="text-h3" style="margin-bottom: var(--space-4);">Popular Learning Channels</h4>
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: var(--space-4);">
            ${fallbackCards.map(fc => `
              <div class="card card-glow tilt-card try-topic-btn" data-query="${fc.title}" style="display: flex; flex-direction: column; justify-content: space-between; min-height: 150px; cursor: pointer;">
                <div>
                  <span class="badge badge-${fc.cat}">${getCategoryIcon(fc.cat)} ${getCategoryLabel(fc.cat)}</span>
                  <h4 class="text-h3" style="margin-top: var(--space-2); margin-bottom: 2px;">${fc.title}</h4>
                  <p style="font-size: 0.75rem; color: var(--text-secondary); line-height: 1.3; margin: 0;">${fc.desc}</p>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    `;

    this.container.querySelectorAll(".suggest-btn, .try-topic-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        const query = btn.getAttribute("data-query");
        Router.navigate(`search?q=${encodeURIComponent(query)}`);
      });
    });

    Animations.initScrollReveal();
    Animations.setupTilt();
  },

  renderAPIError() {
    const statusBar = document.getElementById("search-status-bar");
    if (statusBar) {
      statusBar.innerHTML = `
        <h1 class="text-h1" style="color: var(--accent-rose);">Telemetry Connection Failure</h1>
        <p class="text-small text-secondary">Could not fetch live knowledge. Showing offline learning examples.</p>
      `;
    }

    const fallbacks = [
      { title: "Black Hole", cat: "space" },
      { title: "Human Heart", cat: "biology" },
      { title: "Artificial Intelligence", cat: "technology" },
      { title: "Ancient Egypt", cat: "history" },
      { title: "Volcano", cat: "earth" },
      { title: "DNA", cat: "biology" },
      { title: "Internet", cat: "technology" },
      { title: "Moon", cat: "space" }
    ];

    const cardsHtml = fallbacks.map(f => `
      <div class="card card-glow tilt-card try-topic-btn" data-query="${f.title}" style="display: flex; flex-direction: column; justify-content: space-between; min-height: 140px; cursor: pointer;">
        <div>
          <span class="badge badge-${f.cat}">${getCategoryIcon(f.cat)} ${getCategoryLabel(f.cat)}</span>
          <h3 class="text-h3" style="margin-top: var(--space-2); margin-bottom: 0;">${f.title}</h3>
        </div>
        <span style="font-size: 0.72rem; color: var(--accent-cyan); font-weight: 700;">Open Offline Journey</span>
      </div>
    `).join("");

    this.container.innerHTML = `
      <div style="max-width: var(--content-max); margin: 0 auto; display: flex; flex-direction: column; gap: var(--space-6);">
        <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: var(--space-4);">
          ${cardsHtml}
        </div>
      </div>
    `;

    this.container.querySelectorAll(".try-topic-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        const query = btn.getAttribute("data-query");
        Router.navigate(`topic?t=${encodeURIComponent(query.replace(/ /g, '_'))}`);
      });
    });

    Animations.initScrollReveal();
    Animations.setupTilt();
  }
};

export default SearchPage;
