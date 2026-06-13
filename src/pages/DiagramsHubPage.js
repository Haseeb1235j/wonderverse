// DiagramsHubPage Component
import { diagramsData } from "../data.js";
import { Animations } from "../utils/animations.js";
import { Router } from "../router.js";
import { detectCategory, getCategoryIcon, getCategoryLabel } from "../generators/categoryDetector.js";

export const DiagramsHubPage = {
  render() {
    const cardsHtml = diagramsData.map(d => {
      const category = detectCategory(d.title, d.desc || "");
      const catIcon = getCategoryIcon(category);
      const catLabel = getCategoryLabel(category);
      
      return `
        <div class="card card-glow tilt-card reveal" style="display: flex; flex-direction: column; justify-content: space-between; min-height: 220px; cursor: pointer;" data-title="${d.title}">
          <div class="mouse-glow"></div>
          <div>
            <span class="badge badge-${category}">${catIcon} ${catLabel}</span>
            <h3 class="text-h3" style="margin-top: var(--space-3); margin-bottom: var(--space-2);">${d.title}</h3>
            <p class="text-small text-secondary" style="line-height: 1.4; height: 50px; overflow: hidden; margin-bottom: var(--space-4);">${d.desc || 'Interactive vector concept map.'}</p>
          </div>
          <span style="font-size: 0.75rem; color: var(--accent-cyan); font-weight: bold; display: flex; align-items: center; gap: 5px;">
            Initialize Diagram →
          </span>
        </div>
      `;
    }).join("");

    return `
      <div class="diagrams-hub-page-container" style="display: flex; flex-direction: column; gap: var(--space-8); position: relative; z-index: 5;">
        <div class="page-title-banner reveal animate-fade-up">
          <h1 class="text-h1">Interactive Diagrams Hub</h1>
          <p class="text-small text-secondary">Access all high-fidelity interactive vector models and schematic profiles locally cached on the system.</p>
        </div>

        <div class="badges-grid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: var(--space-6); margin-bottom: var(--space-12);">
          ${cardsHtml}
        </div>
      </div>
    `;
  },

  bindEvents() {
    Animations.initScrollReveal();
    Animations.setupTilt();

    document.querySelectorAll(".diagrams-hub-page-container .tilt-card").forEach(card => {
      card.addEventListener("click", () => {
        const title = card.getAttribute("data-title");
        Router.navigate(`topic?t=${encodeURIComponent(title.replace(/ /g, '_'))}&mode=diagram`);
      });
    });
  }
};

export default DiagramsHubPage;
