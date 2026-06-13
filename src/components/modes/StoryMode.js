// StoryMode Component
import { Animations } from "../../utils/animations.js";

export const StoryMode = {
  render(panels, topicTitle) {
    if (!panels || panels.length === 0) {
      return `<p class="text-secondary">No story panels generated.</p>`;
    }

    const panelsHtml = panels.map((panel, idx) => {
      const isLast = idx === panels.length - 1;
      const numStr = String(panel.id).padStart(2, '0');
      
      let bubbleClass = "speech-bubble";
      if (panel.style.includes("narrator")) {
        bubbleClass = "speech-bubble narrator";
      } else if (panel.style.includes("fact-card")) {
        bubbleClass = "fact-card";
      } else if (panel.style.includes("highlight-card")) {
        bubbleClass = "highlight-card";
      } else if (panel.style.includes("example-card")) {
        bubbleClass = "highlight-card"; // fallback to styled block
      }

      let ctaButtons = "";
      if (panel.hasNavButtons) {
        ctaButtons = `
          <div style="display: flex; gap: var(--space-3); margin-top: var(--space-4); flex-wrap: wrap;">
            <button class="btn btn-primary btn-sm" onclick="window.topicPageInstance.switchMode('learn')">Learn Mode</button>
            <button class="btn btn-secondary btn-sm" onclick="window.topicPageInstance.switchMode('diagram')">Diagram Mode</button>
            <button class="btn btn-primary btn-sm" onclick="window.topicPageInstance.switchMode('quiz')">Take Quiz</button>
          </div>
        `;
      }

      return `
        <div class="story-panel reveal animate-fade-up" data-panel="${panel.id}">
          <div class="panel-header">
            <span class="panel-number">${numStr}</span>
            <span class="panel-character">${panel.character}</span>
            <h3 class="panel-title text-h3">${panel.title}</h3>
          </div>
          <div class="panel-body">
            <div class="${bubbleClass}">
              <p class="text-body">${panel.text}</p>
              ${ctaButtons}
            </div>
          </div>
          ${!isLast ? `<div class="panel-connector">▼</div>` : ""}
        </div>
      `;
    }).join("");

    return `
      <div class="story-mode-container" style="max-width: var(--content-max); margin: 0 auto; padding-top: var(--space-2);">
        ${panelsHtml}
      </div>
    `;
  },

  bindEvents() {
    // Triggers intersection observer reveal fades
    Animations.initScrollReveal();
  }
};

export default StoryMode;
