// SavedPage Component
import { StorageService } from "../services/storage.js";
import { Animations } from "../utils/animations.js";
import { Router } from "../router.js";
import { getCategoryIcon, getCategoryLabel, detectCategory } from "../generators/categoryDetector.js";

export const SavedPage = {
  render() {
    const favs = StorageService.getFavorites();
    const favTopics = favs.topics || [];
    const favDiagrams = favs.diagrams || [];
    const totalFavs = favTopics.length + favDiagrams.length;

    if (totalFavs === 0) {
      return `
        <div class="saved-page-container" style="display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 70vh; text-align: center; gap: var(--space-4); position: relative; z-index: 5;">
          <div class="card reveal animate-fade-up" style="max-width: 500px; padding: var(--space-8); display: flex; flex-direction: column; align-items: center; gap: var(--space-4);">
            <span style="font-size: 3rem; filter: drop-shadow(0 0 10px rgba(167,139,250,0.35));">🔮</span>
            <h2 class="text-h2" style="margin: 0;">Saved Library Empty</h2>
            <p class="text-body text-secondary" style="margin: 0; line-height: 1.5;">
              Explore topics using the search portal and bookmark them to sync your learning telemetry here.
            </p>
            <button id="saved-search-btn" class="btn btn-primary" style="margin-top: var(--space-2);">
              Search Topics
            </button>
          </div>
        </div>
      `;
    }

    let favTopicsHtml = "";
    if (favTopics.length > 0) {
      favTopicsHtml = `
        <div class="reveal animate-fade-up">
          <h3 class="text-h2" style="margin-bottom: var(--space-4);">★ Bookmarked Topics</h3>
          <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: var(--space-5);">
            ${favTopics.map(title => {
              const category = detectCategory(title, "");
              const catIcon = getCategoryIcon(category);
              const catLabel = getCategoryLabel(category);
              return `
                <div class="card card-glow tilt-card fav-topic-card" data-title="${title}" style="cursor: pointer; display: flex; flex-direction: column; justify-content: space-between; min-height: 150px;">
                  <div class="mouse-glow"></div>
                  <div>
                    <span class="badge badge-${category}">${catIcon} ${catLabel}</span>
                    <h4 class="text-h3" style="margin-top: var(--space-3); margin-bottom: 0;">${title}</h4>
                  </div>
                  <span style="font-size: 0.75rem; color: var(--accent-cyan); font-weight: 700; margin-top: var(--space-4);">
                    Open Learning Hub →
                  </span>
                </div>
              `;
            }).join("")}
          </div>
        </div>
      `;
    }

    let favDiagramsHtml = "";
    if (favDiagrams.length > 0) {
      favDiagramsHtml = `
        <div class="reveal animate-fade-up" style="margin-top: var(--space-10);">
          <h3 class="text-h2" style="margin-bottom: var(--space-4);">★ Bookmarked Vector Schemas</h3>
          <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: var(--space-5);">
            ${favDiagrams.map(dId => {
              const category = detectCategory(dId, "");
              const catIcon = getCategoryIcon(category);
              const catLabel = getCategoryLabel(category);
              return `
                <div class="card card-glow tilt-card fav-diagram-card" data-title="${dId}" style="cursor: pointer; display: flex; flex-direction: column; justify-content: space-between; min-height: 150px;">
                  <div class="mouse-glow"></div>
                  <div>
                    <span class="badge badge-${category}">${catIcon} ${catLabel}</span>
                    <h4 class="text-h3" style="margin-top: var(--space-3); margin-bottom: 0;">${dId} Schema</h4>
                  </div>
                  <span style="font-size: 0.75rem; color: var(--accent-purple); font-weight: 700; margin-top: var(--space-4);">
                    Load Diagram Vector →
                  </span>
                </div>
              `;
            }).join("")}
          </div>
        </div>
      `;
    }

    return `
      <div class="saved-page-container" style="display: flex; flex-direction: column; gap: var(--space-8); position: relative; z-index: 5;">
        <div class="page-title-banner reveal animate-fade-up">
          <h1 class="text-h1">Saved Library</h1>
          <p class="text-small text-secondary">Your bookmarked visual learning profiles cached in localStorage.</p>
        </div>

        ${favTopicsHtml}
        ${favDiagramsHtml}
      </div>
    `;
  },

  bindEvents() {
    Animations.initScrollReveal();
    Animations.setupTilt();

    document.getElementById("saved-search-btn")?.addEventListener("click", () => {
      Router.navigate("");
    });

    document.querySelectorAll(".fav-topic-card").forEach(card => {
      card.addEventListener("click", () => {
        const title = card.getAttribute("data-title");
        Router.navigate(`topic?t=${encodeURIComponent(title.replace(/ /g, '_'))}`);
      });
    });

    document.querySelectorAll(".fav-diagram-card").forEach(card => {
      card.addEventListener("click", () => {
        const title = card.getAttribute("data-title");
        Router.navigate(`topic?t=${encodeURIComponent(title.replace(/ /g, '_'))}&mode=diagram`);
      });
    });
  }
};

export default SavedPage;
