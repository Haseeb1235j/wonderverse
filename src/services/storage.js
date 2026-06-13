// Storage Service — localStorage CRUD wrapper for WonderVerse

const STORAGE_KEYS = {
  PROGRESS: "wonderverse_progress",
  FAVORITES: "wonderverse_favorites",
  QUIZ_SCORES: "wonderverse_quiz_scores",
  BADGES: "wonderverse_badges",
  STREAK: "wonderverse_streak",
  LEARNING_TIME: "wonderverse_learning_time",
  HISTORY: "wonderverse_history",
  THEME: "wonderverse_theme"
};

const defaultProgress = {
  continueReading: null, // { topicId, mode, timestamp }
  completedChapters: [] // Array of topic titles
};

const defaultFavorites = {
  topics: [], // Array of topic titles
  diagrams: [] // Array of diagram/topic names
};

const defaultStreak = {
  currentStreak: 0,
  lastReadDate: null // YYYY-MM-DD
};

function getJSON(key, defaultValue) {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : defaultValue;
  } catch (e) {
    console.error(`Error reading key ${key} from localStorage`, e);
    return defaultValue;
  }
}

function setJSON(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error(`Error writing key ${key} to localStorage`, e);
  }
}

export const StorageService = {
  // Theme
  getTheme() {
    return localStorage.getItem(STORAGE_KEYS.THEME) || "dark";
  },
  
  setTheme(theme) {
    localStorage.setItem(STORAGE_KEYS.THEME, theme);
  },

  // Reading Progress
  getProgress() {
    return getJSON(STORAGE_KEYS.PROGRESS, defaultProgress);
  },

  saveProgress(topicId, mode) {
    const progress = this.getProgress();
    progress.continueReading = { topicId, mode, timestamp: Date.now() };
    setJSON(STORAGE_KEYS.PROGRESS, progress);
    this.updateReadingStreak();
  },

  markChapterComplete(topicId) {
    const progress = this.getProgress();
    if (!progress.completedChapters.includes(topicId)) {
      progress.completedChapters.push(topicId);
    }
    setJSON(STORAGE_KEYS.PROGRESS, progress);
    this.checkAndUnlockBadges();
  },

  // Favorites (Saved Topics & Diagrams)
  getFavorites() {
    return getJSON(STORAGE_KEYS.FAVORITES, defaultFavorites);
  },

  toggleFavorite(id, type) {
    const favs = this.getFavorites();
    if (!favs[type]) favs[type] = [];
    const list = favs[type];
    const index = list.indexOf(id);
    if (index > -1) {
      list.splice(index, 1);
    } else {
      list.push(id);
    }
    setJSON(STORAGE_KEYS.FAVORITES, favs);
    this.checkAndUnlockBadges();
    return index === -1; // returns true if added, false if removed
  },

  isFavorite(id, type) {
    const favs = this.getFavorites();
    return favs[type]?.includes(id) || false;
  },

  // Quiz Scores
  getQuizScores() {
    return getJSON(STORAGE_KEYS.QUIZ_SCORES, {});
  },

  saveQuizScore(topicId, score) {
    const scores = this.getQuizScores();
    const prevBest = scores[topicId] || 0;
    scores[topicId] = Math.max(prevBest, score);
    setJSON(STORAGE_KEYS.QUIZ_SCORES, scores);
    this.checkAndUnlockBadges();
  },

  // Streaks
  getStreak() {
    return getJSON(STORAGE_KEYS.STREAK, defaultStreak);
  },

  updateReadingStreak() {
    const streak = this.getStreak();
    const today = new Date().toISOString().split("T")[0];
    
    if (streak.lastReadDate === today) {
      return; // Already updated today
    }

    if (!streak.lastReadDate) {
      streak.currentStreak = 1;
    } else {
      const lastDate = new Date(streak.lastReadDate);
      const currentDate = new Date(today);
      const diffTime = Math.abs(currentDate - lastDate);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays === 1) {
        streak.currentStreak += 1;
      } else if (diffDays > 1) {
        streak.currentStreak = 1; // reset streak if gap is more than 1 day
      }
    }
    
    streak.lastReadDate = today;
    setJSON(STORAGE_KEYS.STREAK, streak);
    this.checkAndUnlockBadges();
    
    // Dispatch event for components to listen to
    window.dispatchEvent(new CustomEvent("streak-updated", { detail: streak }));
  },

  // Learning Time
  getLearningTime() {
    return getJSON(STORAGE_KEYS.LEARNING_TIME, 0);
  },

  incrementLearningTime(minutes) {
    let time = this.getLearningTime();
    time += minutes;
    setJSON(STORAGE_KEYS.LEARNING_TIME, time);
    this.checkAndUnlockBadges();
    window.dispatchEvent(new CustomEvent("learning-time-updated", { detail: time }));
  },

  // Badges
  getBadges() {
    return getJSON(STORAGE_KEYS.BADGES, []);
  },

  checkAndUnlockBadges() {
    const badges = this.getBadges();
    const scores = this.getQuizScores();
    const progress = this.getProgress();
    const favs = this.getFavorites();
    const streak = this.getStreak();
    const time = this.getLearningTime();

    const newlyUnlocked = [];

    const tryUnlock = (badgeId) => {
      if (!badges.includes(badgeId)) {
        badges.push(badgeId);
        newlyUnlocked.push(badgeId);
      }
    };

    // 1. Space Rookie (Completed a space topic or got quiz score in it)
    if (progress.completedChapters.includes("Black Hole") || progress.completedChapters.includes("Moon") || progress.completedChapters.includes("Quantum Physics")) {
      tryUnlock("space-rookie");
    }

    // 2. Science Explorer (Finished Biology, Science or Physics topics)
    if (progress.completedChapters.includes("Human Heart") || progress.completedChapters.includes("DNA") || progress.completedChapters.includes("Photosynthesis")) {
      tryUnlock("science-explorer");
    }

    // 3. History Hunter (Finished Egypt or History topic)
    if (progress.completedChapters.includes("Ancient Egypt")) {
      tryUnlock("history-hunter");
    }

    // 4. Diagram Master (Faved at least 2 diagrams)
    if (favs.diagrams?.length >= 2) {
      tryUnlock("diagram-master");
    }

    // 5. Quiz Warrior (Got 5/5 score on any quiz)
    const hasPerfectScore = Object.values(scores).some(score => score === 5);
    if (hasPerfectScore) {
      tryUnlock("quiz-warrior");
    }

    // 6. Story Finisher (Completed at least 3 chapters)
    if (progress.completedChapters.length >= 3) {
      tryUnlock("story-finisher");
    }

    // 7. Knowledge Collector (Unlocked 6 badges or saved 3 topics)
    if (badges.length >= 6 || (favs.topics?.length) >= 3) {
      tryUnlock("knowledge-collector");
    }

    if (newlyUnlocked.length > 0) {
      setJSON(STORAGE_KEYS.BADGES, badges);
      // Fire visual event
      window.dispatchEvent(new CustomEvent("badge-unlocked", { detail: { badges: newlyUnlocked } }));
    }
  },

  // Search History (recent searches)
  getRecentSearches() {
    return getJSON(STORAGE_KEYS.HISTORY, []);
  },

  addRecentSearch(topic) {
    // topic = { title, query, category, image, date }
    const history = this.getRecentSearches();
    const index = history.findIndex(h => h.title.toLowerCase() === topic.title.toLowerCase());
    if (index > -1) {
      history.splice(index, 1);
    }
    history.unshift({
      title: topic.title,
      query: topic.query || topic.title,
      category: topic.category || "universal",
      image: topic.image || null,
      date: new Date().toLocaleDateString()
    });
    if (history.length > 10) {
      history.pop();
    }
    setJSON(STORAGE_KEYS.HISTORY, history);
    window.dispatchEvent(new CustomEvent("history-updated", { detail: history }));
  }
};
