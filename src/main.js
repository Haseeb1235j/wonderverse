// WonderVerse App Bootstrap & Entry Point
import "./styles/main.css";
import { Router } from "./router.js";
import { store } from "./store.js";
import { StorageService } from "./services/storage.js";
import { Header } from "./components/Header.js";
import { Toast } from "./components/ui/Toast.js";

const App = {
  init() {
    // 1. Initialize Sticky Header immediately
    Header.updateHeader();

    // 2. Bootstrap router (handles page rendering based on path)
    Router.init(({ route, params }) => {
      Header.updateTitle(route);
      this.closeMobileMenu();
    });

    // 3. Update reading streak
    StorageService.updateReadingStreak();

    // 4. Set study focus time tracker interval (1 minute ticks)
    setInterval(() => {
      StorageService.incrementLearningTime(1);
    }, 60000);

    // 5. Setup event bindings
    this.setupListeners();
  },

  setupListeners() {
    document.querySelector(".skip-link")?.addEventListener("click", (event) => {
      event.preventDefault();
      document.getElementById("app")?.focus();
    });
    const moreButton = document.getElementById("mobile-more-btn");
    const moreMenu = document.getElementById("mobile-more-menu");
    moreButton?.addEventListener("click", () => {
      const open = moreMenu.hidden;
      moreMenu.hidden = !open;
      moreButton.setAttribute("aria-expanded", String(open));
    });
    document.addEventListener("click", (event) => {
      if (
        !moreMenu?.contains(event.target) &&
        !moreButton?.contains(event.target)
      )
        this.closeMobileMenu();
    });
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && moreMenu && !moreMenu.hidden) {
        this.closeMobileMenu();
        moreButton?.focus();
      }
    });
    window.addEventListener("resize", () => {
      if (window.innerWidth > 600) this.closeMobileMenu();
    });

    // Handle badge unlocks
    window.addEventListener("badge-unlocked", (e) => {
      const badges = e.detail.badges;
      if (badges && badges.length > 0) {
        // Show premium Web Audio synth toast notification for the unlocked badge
        Toast.showAchievement(badges[0]);
      }
    });

    // Listen to store streak updates to refresh header streak text
    store.subscribe("stateChange", ({ current }) => {
      const streakEl = document.getElementById("header-streak-badge");
      if (streakEl && current.streak) {
        streakEl.innerText = `${current.streak.currentStreak} day streak`;
      }
    });
  },
};

App.closeMobileMenu = () => {
  const menu = document.getElementById("mobile-more-menu");
  if (menu) menu.hidden = true;
  document
    .getElementById("mobile-more-btn")
    ?.setAttribute("aria-expanded", "false");
};

// Start application
App.init();
export default App;
