// Reactive state store (pub/sub) for WonderVerse
import { StorageService } from "./services/storage.js";

class Store {
  constructor() {
    this.subscribers = {};
    this.state = {
      theme: StorageService.getTheme(),
      recentSearches: StorageService.getRecentSearches(),
      favorites: StorageService.getFavorites(),
      progress: StorageService.getProgress(),
      quizScores: StorageService.getQuizScores(),
      badges: StorageService.getBadges(),
      streak: StorageService.getStreak(),
      learningTime: StorageService.getLearningTime(),
      activeTopic: null // Stores currently loaded topic data
    };

    // Bind theme immediately
    document.documentElement.setAttribute("data-theme", this.state.theme);

    // Sync state on StorageService window events
    window.addEventListener("streak-updated", (e) => {
      this.setState({ streak: e.detail });
    });
    window.addEventListener("learning-time-updated", (e) => {
      this.setState({ learningTime: e.detail });
    });
    window.addEventListener("history-updated", (e) => {
      this.setState({ recentSearches: e.detail });
    });
    window.addEventListener("badge-unlocked", (e) => {
      this.setState({ badges: StorageService.getBadges() });
    });
  }

  subscribe(event, callback) {
    if (!this.subscribers[event]) {
      this.subscribers[event] = [];
    }
    this.subscribers[event].push(callback);
    // Return unsubscribe fn
    return () => {
      this.subscribers[event] = this.subscribers[event].filter(cb => cb !== callback);
    };
  }

  publish(event, data) {
    if (this.subscribers[event]) {
      this.subscribers[event].forEach(callback => {
        try {
          callback(data);
        } catch (e) {
          console.error(`Error executing subscriber for event ${event}`, e);
        }
      });
    }
  }

  getState() {
    return this.state;
  }

  setState(newState) {
    const oldState = { ...this.state };
    this.state = { ...this.state, ...newState };

    if (newState.theme && newState.theme !== oldState.theme) {
      StorageService.setTheme(newState.theme);
      document.documentElement.setAttribute("data-theme", newState.theme);
      this.publish("theme", newState.theme);
    }

    if (newState.favorites) {
      this.publish("favorites", newState.favorites);
    }

    this.publish("stateChange", { old: oldState, current: this.state });
  }

  toggleTheme() {
    const nextTheme = this.state.theme === "dark" ? "light" : "dark";
    this.setState({ theme: nextTheme });
  }
}

export const store = new Store();
export default store;
