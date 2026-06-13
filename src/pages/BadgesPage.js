// BadgesPage Component
import { StorageService } from "../services/storage.js";
import { Animations } from "../utils/animations.js";

export const BadgesPage = {
  render() {
    const unlocked = StorageService.getBadges();
    
    const badgeConfigs = [
      { id: "space-rookie", title: "Space Rookie", desc: "Completed your first space exploration topic.", icon: "🌌" },
      { id: "science-explorer", title: "Science Explorer", desc: "Analyzed human anatomy or atomic physics structure.", icon: "🧪" },
      { id: "history-hunter", title: "History Hunter", desc: "Successfully navigated the rise of Ancient Egypt.", icon: "🏛️" },
      { id: "diagram-master", title: "Diagram Master", desc: "Saved at least two vector diagrams to library.", icon: "🎛️" },
      { id: "quiz-warrior", title: "Quiz Warrior", desc: "Scored a perfect 5/5 score on any quiz module.", icon: "🎯" },
      { id: "story-finisher", title: "Story Finisher", desc: "Successfully completed at least three comic chapters.", icon: "📚" },
      { id: "knowledge-collector", title: "Knowledge Collector", desc: "Unlocked six badges or saved three topics.", icon: "👑" }
    ];

    const gridHtml = badgeConfigs.map(b => {
      const isUnlocked = unlocked.includes(b.id);
      return `
        <div class="card reveal animate-fade-up text-center" style="display: flex; flex-direction: column; align-items: center; gap: var(--space-3); padding: var(--space-6); filter: grayscale(${isUnlocked ? '0%' : '100%'}); opacity: ${isUnlocked ? '1' : '0.65'}; border-color: ${isUnlocked ? 'var(--accent-purple)' : 'var(--border-default)'}; position: relative; overflow: hidden;">
          <div style="width: 70px; height: 70px; border-radius: var(--radius-full); background: var(--bg-secondary); display: flex; align-items: center; justify-content: center; font-size: 2.25rem; border: 2px solid ${isUnlocked ? 'var(--accent-purple)' : 'var(--border-default)'}; margin-bottom: var(--space-2); filter: drop-shadow(${isUnlocked ? '0 0 8px rgba(124,58,237,0.4)' : 'none'});">
            <span>${b.icon}</span>
          </div>
          <h4 class="text-h3" style="color: ${isUnlocked ? 'var(--text-primary)' : 'var(--text-muted)'}; margin: 0;">${b.title}</h4>
          <p class="text-small text-secondary" style="line-height: 1.4; margin: 0;">${b.desc}</p>
          ${isUnlocked ? `
            <span style="font-size: 0.65rem; color: var(--accent-amber); font-weight: 700; letter-spacing: 0.05em; text-transform: uppercase;">
              ★ TELEMETRY UNLOCKED
            </span>` : `
            <span style="font-size: 0.65rem; color: var(--text-muted); font-weight: 600; letter-spacing: 0.05em; text-transform: uppercase;">
              LOCKED
            </span>`}
        </div>
      `;
    }).join("");

    return `
      <div class="badges-page-container" style="display: flex; flex-direction: column; gap: var(--space-8); position: relative; z-index: 5;">
        <div class="page-title-banner reveal animate-fade-up">
          <h1 class="text-h1">Academy Achievements</h1>
          <p class="text-small text-secondary">Earn badges by studying comic storyboards and finishing quizzes.</p>
        </div>

        <div class="badges-grid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: var(--space-5);">
          ${gridHtml}
        </div>
      </div>
    `;
  },

  bindEvents() {
    Animations.initScrollReveal();
  }
};

export default BadgesPage;
