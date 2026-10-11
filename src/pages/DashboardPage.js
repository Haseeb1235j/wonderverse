import { StorageService } from "../services/storage.js";
import { icon, escapeHTML } from "../utils/icons.js";
export const DashboardPage = {
  render() {
    const progress = StorageService.getProgress(),
      scores = StorageService.getQuizScores(),
      streak = StorageService.getStreak(),
      minutes = StorageService.getLearningTime();
    const entries = Object.entries(scores),
      total = entries.reduce((sum, [, score]) => sum + score, 0),
      average = entries.length
        ? Math.round((total / (entries.length * 5)) * 100)
        : 0;
    const recent = progress.continueReading;
    return `<div class="dashboard-page-container"><div class="page-title-banner"><h1 class="text-h1">Your progress, at a glance.</h1><p class="text-small text-secondary">Every question is a step toward understanding.</p></div>
      <div class="progress-metrics">${[
        ["clock", streak.currentStreak, "Day streak"],
        ["book", entries.length, "Topics tested"],
        ["clock", `${minutes}m`, "Time recorded"],
        ["quiz", `${average}%`, "Best-score average"],
      ]
        .map(
          ([symbol, value, label]) =>
            `<div>${icon(symbol, 20)}<strong>${value}</strong><span>${label}</span></div>`,
        )
        .join("")}</div>
      <div class="progress-columns"><section class="card"><h2 class="text-h2">Quiz results</h2><p class="text-small text-secondary">Your best score for each topic.</p>
        ${entries.length ? `<div class="quiz-score-list">${entries.map(([title, score]) => `<a href="#/topic?t=${encodeURIComponent(title.replace(/ /g, "_"))}&mode=quiz"><div><span>${escapeHTML(title)}</span><strong>${score}/5</strong></div><span class="score-track"><span style="width:${Math.max(0, Math.min(100, (score / 5) * 100))}%"></span></span></a>`).join("")}</div>` : `<div class="progress-empty">${icon("chart", 30)}<p>Your quiz results will appear here.<br/>Find a topic and give one a try.</p></div>`}
      </section><section class="card resume-card"><span class="eyebrow">PICK UP WHERE YOU LEFT OFF</span><h2>${recent ? escapeHTML(recent.topicId) : "Your next discovery awaits."}</h2><p>${recent ? "Return to the last topic you explored." : "Choose something that interests you and start exploring."}</p>
        <a class="btn btn-primary" href="${recent ? `#/topic?t=${encodeURIComponent(recent.topicId.replace(/ /g, "_"))}&mode=${encodeURIComponent(recent.mode)}` : "#/landing"}">${recent ? "Continue exploring" : "Find a topic"} ${icon("arrow", 16)}</a></section></div>
      <p class="collection-note">Progress is stored in this browser. Best-score average uses one saved score per topic.</p></div>`;
  },
};
export default DashboardPage;
