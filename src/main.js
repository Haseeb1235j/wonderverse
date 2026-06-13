// WonderVerse App Bootstrap & Entry Point
import './styles/main.css';
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
      console.log(`Navigation routing to: ${route}`, params);
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
    // Logo click redirect
    document.getElementById("sidebar-logo")?.addEventListener("click", () => {
      Router.navigate("");
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
        streakEl.innerText = `🔥 STREAK: ${current.streak.currentStreak} DAYS`;
      }
    });
  }
};

// Start application
App.init();
export default App;
