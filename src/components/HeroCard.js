// HeroCard Component
import { StorageService } from "../services/storage.js";
import { getCategoryIcon, getCategoryLabel, getDifficultyLevel } from "../generators/categoryDetector.js";

export const HeroCard = {
  render(summaryData, category) {
    const title = summaryData.title;
    const extract = summaryData.extract || "No description available.";
    const image = summaryData.thumbnail?.source || null;
    const difficulty = getDifficultyLevel(extract);
    
    const isSaved = StorageService.isFavorite(title, "topics");
    const categoryIcon = getCategoryIcon(category);
    const categoryLabel = getCategoryLabel(category);
    const wikiUrl = summaryData.content_urls?.desktop?.page || `https://en.wikipedia.org/wiki/${encodeURIComponent(title.replace(/ /g, '_'))}`;

    const imageSection = image 
      ? `<img src="${image}" alt="${title}" class="hero-image" style="width:100%; height:100%; object-fit:cover;" />` 
      : `<div class="hero-image-placeholder" style="width:100%; height:100%; display:flex; align-items:center; justify-content:center; font-size:3rem; background:var(--bg-elevated);">${categoryIcon}</div>`;

    return `
      <div class="hero-card card card-glow reveal animate-fade-up" style="display: grid; grid-template-columns: 200px 1fr; gap: var(--space-6); align-items: center; margin-bottom: var(--space-6);">
        <div class="hero-image-wrapper" style="width: 200px; height: 200px; border-radius: var(--radius-lg); overflow: hidden; border: 1px solid var(--border-default); position: relative; display: flex; justify-content: center; align-items: center;">
          ${imageSection}
        </div>
        
        <div class="hero-info" style="display: flex; flex-direction: column; justify-content: space-between; height: 100%;">
          <div>
            <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: var(--space-4); margin-bottom: var(--space-2);">
              <div style="display: flex; flex-direction: column; gap: var(--space-2);">
                <div style="display: flex; gap: var(--space-2); flex-wrap: wrap;">
                  <span class="badge badge-${category}">${categoryIcon} ${categoryLabel}</span>
                  <span class="badge badge-${difficulty}">${difficulty}</span>
                </div>
                <h1 class="text-h1" style="margin: 0; background: linear-gradient(135deg, #ffffff 0%, var(--text-accent) 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">
                  ${title}
                </h1>
              </div>
              
              <button id="hero-save-btn" class="btn btn-secondary btn-sm" style="border-radius: var(--radius-full); font-weight:600;">
                ${isSaved ? "★ Saved" : "☆ Save Topic"}
              </button>
            </div>
            
            <p class="text-body text-secondary" style="margin-top: var(--space-2); margin-bottom: var(--space-4); line-height: 1.6;">
              ${extract}
            </p>
          </div>
          
          <div style="display: flex; gap: var(--space-3); flex-wrap: wrap;">
            <a href="${wikiUrl}" target="_blank" class="btn btn-ghost btn-sm">
              Wikipedia ↗
            </a>
            <button id="hero-share-btn" class="btn btn-ghost btn-sm">
              🔗 Share
            </button>
            <button id="hero-copy-btn" class="btn btn-ghost btn-sm">
              📋 Copy Link
            </button>
          </div>
        </div>
      </div>
    `;
  },

  bindEvents(summaryData) {
    const title = summaryData.title;
    
    // Save/Unsave
    const saveBtn = document.getElementById("hero-save-btn");
    saveBtn?.addEventListener("click", () => {
      const added = StorageService.toggleFavorite(title, "topics");
      saveBtn.innerText = added ? "★ Saved" : "☆ Save Topic";
      
      // Dispatch favorite state change
      window.dispatchEvent(new CustomEvent("favorite-toggled", { detail: { title, added } }));
    });

    // Share button
    const shareBtn = document.getElementById("hero-share-btn");
    shareBtn?.addEventListener("click", () => {
      if (navigator.share) {
        navigator.share({
          title: `WonderVerse Learning Journey: ${title}`,
          text: `Explore ${title} visually on WonderVerse!`,
          url: window.location.href,
        }).catch(err => console.log(err));
      } else {
        navigator.clipboard.writeText(window.location.href);
        alert("Link copied to clipboard!");
      }
    });

    // Copy Link button
    const copyBtn = document.getElementById("hero-copy-btn");
    copyBtn?.addEventListener("click", () => {
      navigator.clipboard.writeText(window.location.href);
      copyBtn.innerText = "✓ Copied!";
      setTimeout(() => {
        copyBtn.innerText = "📋 Copy Link";
      }, 2000);
    });
  }
};

export default HeroCard;
