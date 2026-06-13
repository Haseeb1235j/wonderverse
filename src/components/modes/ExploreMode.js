// ExploreMode Component
import { Animations } from "../../utils/animations.js";
import { StorageService } from "../../services/storage.js";
import { Toast } from "../ui/Toast.js";
import { Router } from "../../router.js";

export const ExploreMode = {
  render(topicTitle) {
    const isSaved = StorageService.isFavorite(topicTitle, "topics");

    return `
      <div class="explore-mode-container reveal animate-fade-up" style="display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-6); padding-top: var(--space-2);">
        <!-- Platform actions -->
        <div class="card" style="display: flex; flex-direction: column; justify-content: center; padding: var(--space-6);">
          <h3 class="text-h2" style="margin-top: 0; margin-bottom: var(--space-3); font-size: 1.3rem;">Explore Telemetry Control</h3>
          <p class="text-body text-secondary" style="margin-bottom: var(--space-6); font-size: 0.95rem;">
            Bookmark this topic in your browser's localStorage or open external Wikipedia database coordinates.
          </p>
          
          <div style="display: flex; gap: var(--space-4); flex-wrap: wrap;">
            <button id="explore-save-btn" class="btn btn-primary">
              ${isSaved ? "★ Saved in Library" : "☆ Save in Library"}
            </button>
            <a href="https://en.wikipedia.org/wiki/${encodeURIComponent(topicTitle.replace(/ /g, '_'))}" target="_blank" class="btn btn-secondary">
              View Wikipedia ↗
            </a>
          </div>
        </div>

        <!-- Related Topics Mount -->
        <div class="card" style="padding: var(--space-6);">
          <h3 class="text-h2" style="margin-top: 0; margin-bottom: var(--space-3); font-size: 1.3rem;">Related Conceptual Coordinates</h3>
          <div id="related-topics-list" style="display: flex; flex-direction: column; gap: var(--space-3); margin-top: var(--space-4);">
            <p style="color: var(--text-muted); font-size: 0.85rem; text-align: center; margin-top: var(--space-6);">
              Retrieving related coordinate chips...
            </p>
          </div>
        </div>
      </div>
    `;
  },

  async bindEvents(topicTitle) {
    Animations.initScrollReveal();

    const saveBtn = document.getElementById("explore-save-btn");
    saveBtn?.addEventListener("click", () => {
      const added = StorageService.toggleFavorite(topicTitle, "topics");
      saveBtn.innerText = added ? "★ Saved in Library" : "☆ Save in Library";
      Toast.show(added ? "Saved to library!" : "Removed from library.");
    });

    const relatedContainer = document.getElementById("related-topics-list");
    if (!relatedContainer) return;

    try {
      const url = `https://en.wikipedia.org/api/rest_v1/page/related/${encodeURIComponent(topicTitle.replace(/ /g, '_'))}`;
      const response = await fetch(url);
      if (!response.ok) throw new Error("Failed to fetch related topics");
      
      const data = await response.json();
      const pages = data.pages || [];
      
      if (pages.length === 0) {
        relatedContainer.innerHTML = `<p style="color: var(--text-muted); font-size: 0.85rem; text-align: center;">No related topics found.</p>`;
        return;
      }

      relatedContainer.innerHTML = pages.slice(0, 3).map(p => `
        <div class="card related-chip tilt-card" data-title="${p.title}" style="cursor: pointer; padding: var(--space-4); display: flex; justify-content: space-between; align-items: center; background: var(--bg-secondary); border-color: var(--border-default);">
          <div style="flex: 1; min-width: 0;">
            <h5 style="color: var(--accent-cyan); font-size: 0.95rem; margin: 0 0 4px 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${p.title}</h5>
            <p style="font-size: 0.75rem; color: var(--text-secondary); line-height: 1.3; margin: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${p.description || 'General topic.'}</p>
          </div>
          <span class="badge badge-default" style="font-size: 0.65rem; padding: 2px 8px; flex-shrink: 0; margin-left: 10px;">EXPLORE</span>
        </div>
      `).join("");

      // Bind related chip clicks
      relatedContainer.querySelectorAll(".related-chip").forEach(chip => {
        chip.addEventListener("click", () => {
          const title = chip.getAttribute("data-title");
          Router.navigate(`topic?t=${encodeURIComponent(title.replace(/ /g, '_'))}`);
        });
      });

      // Init tilt on cards
      Animations.setupTilt();

    } catch (err) {
      console.warn("Could not fetch related pages", err);
      relatedContainer.innerHTML = `<p style="color: var(--text-muted); font-size: 0.85rem; text-align: center;">Related coordinates offline.</p>`;
    }
  }
};

export default ExploreMode;
