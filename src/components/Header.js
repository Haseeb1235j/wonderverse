// Header Component
import { SearchBar } from "./SearchBar.js";
import { store } from "../store.js";
import { Router } from "../router.js";

export const Header = {
  render() {
    const state = store.getState();
    const streak = state.streak?.currentStreak || 0;
    
    return `
      <div style="width: 420px; max-width: 100%;">
        ${SearchBar.render("Search any topic...", "header-search")}
      </div>
      <div style="display: flex; align-items: center; gap: 20px;">
        <button id="theme-toggle-btn" class="btn btn-ghost btn-icon" style="font-size: 1.1rem; padding: 6px;" title="Toggle Light/Dark Mode">
          ${state.theme === 'dark' ? '☀️' : '🌙'}
        </button>
        <div style="font-size: 13px; font-weight: 700; color: var(--accent-cyan);" id="header-streak-badge">
          🔥 STREAK: ${streak} DAYS
        </div>
      </div>
    `;
  },

  bindEvents() {
    SearchBar.bindEvents("header-search", (query) => {
      Router.navigate(`search?q=${encodeURIComponent(query)}`);
    });

    const themeBtn = document.getElementById("theme-toggle-btn");
    themeBtn?.addEventListener("click", () => {
      store.toggleTheme();
      // Update header render immediately to switch icon
      this.updateHeader();
    });
  },

  updateHeader() {
    const headerEl = document.querySelector("header.top-header");
    if (headerEl) {
      headerEl.innerHTML = this.render();
      this.bindEvents();
    }
  }
};

export default Header;
