import { StorageService } from "../../services/storage.js";
import { Toast } from "../ui/Toast.js";
import { escapeHTML, icon } from "../../utils/icons.js";
import { wikiArticleURL } from "../../utils/sourceText.js";

export const ExploreMode = {
  render(topicTitle, relatedData) {
    const isSaved = StorageService.isFavorite(topicTitle, "topics");
    const pages = Object.values(relatedData?.query?.pages || {});
    const links = pages
      .flatMap((page) => page.links || [])
      .filter((link) => link.ns === 0 && link.title !== topicTitle)
      .slice(0, 8);
    return `<div class="explore-mode-container">
      <div class="card" style="padding:var(--space-6)">
        <h3 class="text-h2">Keep exploring</h3>
        <p class="text-body text-secondary">Save this topic for later, or continue reading the original article on Wikipedia.</p>
        <div style="display:flex;gap:var(--space-3);flex-wrap:wrap;margin-top:var(--space-5)">
          <button id="explore-save-btn" class="btn btn-primary" aria-pressed="${isSaved}">${isSaved ? "Saved to library" : "Save to library"}</button>
          <a href="${wikiArticleURL(topicTitle)}" target="_blank" rel="noopener noreferrer" class="btn btn-secondary">View Wikipedia ${icon("external", 16)}</a>
        </div>
      </div>
      <div class="card" style="padding:var(--space-6)">
        <h3 class="text-h2">Linked topics</h3>
        <p class="text-secondary text-small">Articles linked from this Wikipedia page.</p>
        <div class="collection-grid" style="margin-top:var(--space-4)">${links.length ? links.map((link) => `<a class="collection-item" href="#/topic?t=${encodeURIComponent(link.title.replace(/ /g, "_"))}"><strong>${escapeHTML(link.title)}</strong><span>Open article ${icon("arrowRight", 14)}</span></a>`).join("") : `<p class="text-secondary">${relatedData ? "No linked topics were returned." : "Linked topics are unavailable right now."}</p>`}</div>
      </div>
    </div>`;
  },
  bindEvents(topicTitle) {
    const saveBtn = document.getElementById("explore-save-btn");
    saveBtn?.addEventListener("click", () => {
      const added = StorageService.toggleFavorite(topicTitle, "topics");
      saveBtn.textContent = added ? "Saved to library" : "Save to library";
      saveBtn.setAttribute("aria-pressed", String(added));
      Toast.show(added ? "Saved to library." : "Removed from library.");
    });
  },
};
export default ExploreMode;
