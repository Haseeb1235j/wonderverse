// DashboardPage Component
import { StorageService } from "../services/storage.js";
import { Animations } from "../utils/animations.js";
import { Router } from "../router.js";
import { ProgressBar } from "../components/ui/ProgressBar.js";

export const DashboardPage = {
  render() {
    const progress = StorageService.getProgress();
    const scores = StorageService.getQuizScores();
    const streak = StorageService.getStreak();
    const timeVal = StorageService.getLearningTime();

    const completedCount = progress.completedChapters?.length || 0;
    const completedQuizzes = Object.keys(scores).length;
    let totalScore = 0;
    Object.values(scores).forEach(s => totalScore += s);
    const accuracy = completedQuizzes > 0 ? Math.round((totalScore / (completedQuizzes * 5)) * 100) : 0;

    // Build SVG Progress Bar Graph (100% locally and free)
    const chartData = [12, 24, Math.min(60, timeVal), Math.min(60, completedQuizzes * 10), Math.min(60, totalScore * 8)];
    const maxVal = Math.max(...chartData, 35);
    const chartSvg = `
      <svg viewBox="0 0 350 150" style="width:100%; height:100%; font-family:var(--font-sans);">
        <line x1="30" y1="10" x2="30" y2="120" stroke="var(--border-default)" stroke-width="1.5"/>
        <line x1="30" y1="120" x2="330" y2="120" stroke="var(--border-default)" stroke-width="1.5"/>
        <line x1="30" y1="65" x2="330" y2="65" stroke="rgba(255,255,255,0.02)" stroke-width="1"/>
        ${chartData.map((val, idx) => {
          const h = (val / maxVal) * 90;
          const x = 50 + (idx * 55);
          const y = 120 - h;
          const labels = ["Day 1", "Day 2", "Day 3", "Day 4", "Day 5"];
          return `
            <rect x="${x}" y="${y}" width="28" height="${h}" rx="4" fill="url(#bar-grad)" style="filter: drop-shadow(0 0 4px rgba(124, 58, 237, 0.255));"/>
            <text x="${x + 14}" y="135" fill="var(--text-muted)" font-size="8" text-anchor="middle" font-weight="600">${labels[idx]}</text>
          `;
        }).join("")}
        <defs>
          <linearGradient id="bar-grad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="var(--accent-cyan)"/>
            <stop offset="100%" stop-color="var(--accent-purple)"/>
          </linearGradient>
        </defs>
      </svg>
    `;

    return `
      <div class="dashboard-page-container" style="display: flex; flex-direction: column; gap: var(--space-8); position: relative; z-index: 5;">
        <div class="page-title-banner reveal animate-fade-up">
          <h1 class="text-h1">Progress Dashboard</h1>
          <p class="text-small text-secondary">Your personal academic telemetry console.</p>
        </div>

        <!-- Metric grid -->
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: var(--space-4);" class="reveal animate-fade-up">
          <div class="card text-center" style="display: flex; flex-direction: column; align-items: center; gap: var(--space-2);">
            <span style="font-size: 2rem;">🔥</span>
            <h4 class="text-h2" style="margin: 0; font-size: 1.85rem;">${streak.currentStreak}</h4>
            <p class="text-tiny text-secondary" style="font-weight: 700; text-transform: uppercase; margin: 0;">Reading Streak</p>
          </div>
          <div class="card text-center" style="display: flex; flex-direction: column; align-items: center; gap: var(--space-2);">
            <span style="font-size: 2rem;">📚</span>
            <h4 class="text-h2" style="margin: 0; font-size: 1.85rem;">${completedCount}</h4>
            <p class="text-tiny text-secondary" style="font-weight: 700; text-transform: uppercase; margin: 0;">Completed Chapters</p>
          </div>
          <div class="card text-center" style="display: flex; flex-direction: column; align-items: center; gap: var(--space-2);">
            <span style="font-size: 2rem;">⏱️</span>
            <h4 class="text-h2" style="margin: 0; font-size: 1.85rem;">${timeVal} Mins</h4>
            <p class="text-tiny text-secondary" style="font-weight: 700; text-transform: uppercase; margin: 0;">Learning Time</p>
          </div>
          <div class="card text-center" style="display: flex; flex-direction: column; align-items: center; gap: var(--space-2);">
            <span style="font-size: 2rem;">🎯</span>
            <h4 class="text-h2" style="margin: 0; font-size: 1.85rem;">${accuracy}%</h4>
            <p class="text-tiny text-secondary" style="font-weight: 700; text-transform: uppercase; margin: 0;">Quiz Accuracy</p>
          </div>
        </div>

        <!-- Visual Analytics Grid -->
        <div style="display: grid; grid-template-columns: 1.2fr 1fr; gap: var(--space-6); margin-top: var(--space-4);" class="reveal animate-fade-up">
          <div class="card" style="display: flex; flex-direction: column; gap: var(--space-4);">
            <h3 class="text-h3" style="margin: 0;">Focus Telemetry Map</h3>
            <div style="height: 180px; display: flex; align-items: center; justify-content: center;">
              ${chartSvg}
            </div>
          </div>

          <div class="card" style="display: flex; flex-direction: column; justify-content: center; gap: var(--space-4); padding: var(--space-6);">
            <h3 class="text-h3" style="margin: 0;">Latest Logged Coordinates</h3>
            ${progress.continueReading ? `
              <p class="text-body text-secondary" style="margin: 0;">
                You were recently exploring <strong>${progress.continueReading.topicId}</strong> in <strong>${progress.continueReading.mode.toUpperCase()}</strong> mode.
              </p>
              <button id="resume-telemetry-btn" class="btn btn-primary" style="align-self: flex-start;">
                Resume Journey
              </button>
            ` : `
              <p class="text-body text-secondary" style="margin: 0;">
                No active reading bookmarks found. Search for a subject to start.
              </p>
              <button id="resume-search-btn" class="btn btn-primary" style="align-self: flex-start;">
                Search Portal
              </button>
            `}
          </div>
        </div>
      </div>
    `;
  },

  bindEvents() {
    Animations.initScrollReveal();

    const progress = StorageService.getProgress();
    
    document.getElementById("resume-telemetry-btn")?.addEventListener("click", () => {
      if (progress.continueReading) {
        const t = progress.continueReading.topicId;
        const mode = progress.continueReading.mode;
        Router.navigate(`topic?t=${encodeURIComponent(t.replace(/ /g, '_'))}&mode=${mode}`);
      }
    });

    document.getElementById("resume-search-btn")?.addEventListener("click", () => {
      Router.navigate("");
    });
  }
};

export default DashboardPage;
