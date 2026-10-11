import { SearchBar } from "./SearchBar.js";
import { store } from "../store.js";
import { Router } from "../router.js";
import { icon } from "../utils/icons.js";
export const Header = {
  render() {
    const state = store.getState();
    return `<a class="mobile-wordmark" href="#/landing" aria-label="WonderVerse home">w.</a><span class="header-title" id="header-page-title">Explore</span>
      <div class="header-search">${SearchBar.render("Search WonderVerse", "header-search")}</div>
      <button id="theme-toggle-btn" class="btn btn-ghost btn-icon" aria-label="Switch to ${state.theme === "dark" ? "light" : "dark"} mode" title="Switch appearance">${icon(state.theme === "dark" ? "sun" : "moon")}</button>`;
  },
  bindEvents() {
    SearchBar.bindEvents("header-search", (query) =>
      Router.navigate(`search?q=${encodeURIComponent(query)}`),
    );
    document
      .getElementById("theme-toggle-btn")
      ?.addEventListener("click", () => {
        store.toggleTheme();
        this.updateHeader();
        document.getElementById("theme-toggle-btn")?.focus();
      });
  },
  updateHeader() {
    const element = document.querySelector("header.top-header");
    if (!element) return;
    element.innerHTML = this.render();
    this.bindEvents();
    this.updateTitle(Router.parseRoute().route);
  },
  updateTitle(route) {
    const title = document.getElementById("header-page-title");
    if (title)
      title.textContent =
        {
          "/": "Explore",
          "/search": "Search",
          "/topic": "Discover",
          "/saved": "Saved",
          "/diagrams": "Diagrams",
          "/dashboard": "Progress",
          "/badges": "Achievements",
          "/about": "About",
        }[route] || "WonderVerse";
  },
};
export default Header;
