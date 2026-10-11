import { StorageService } from "../services/storage.js";
import { icon } from "../utils/icons.js";
const achievements = [
  {
    id: "space-rookie",
    title: "Space explorer",
    desc: "Complete a quiz on Moon or Quantum Physics.",
    symbol: "space",
  },
  {
    id: "science-explorer",
    title: "Science explorer",
    desc: "Complete a quiz on DNA or Photosynthesis.",
    symbol: "chemistry",
  },
  {
    id: "history-hunter",
    title: "History explorer",
    desc: "Complete a quiz on Ancient Egypt.",
    symbol: "history",
  },
  {
    id: "diagram-master",
    title: "Visual thinker",
    desc: "Save two diagrams to your library.",
    symbol: "diagram",
  },
  {
    id: "quiz-warrior",
    title: "Perfect score",
    desc: "Answer all five questions correctly in a quiz.",
    symbol: "quiz",
  },
  {
    id: "story-finisher",
    title: "Building momentum",
    desc: "Complete quizzes on three different topics.",
    symbol: "book",
  },
  {
    id: "knowledge-collector",
    title: "Knowledge collector",
    desc: "Save three topics or unlock six achievements.",
    symbol: "bookmark",
  },
];
export const BadgesPage = {
  render() {
    const unlocked = StorageService.getBadges();
    return `<div class="badges-page-container"><div class="page-title-banner"><h1 class="text-h1">Curiosity adds up.</h1><p class="text-small text-secondary">${unlocked.length} of ${achievements.length} achievements unlocked. Keep exploring at your own pace.</p></div>
      <div class="achievement-grid">${achievements
        .map((item) => {
          const active = unlocked.includes(item.id);
          return `<article class="achievement-card ${active ? "unlocked" : ""}"><span class="achievement-icon">${icon(item.symbol, 28)}</span><h2>${item.title}</h2><p>${item.desc}</p><span class="achievement-status">${active ? icon("check", 14) + " Unlocked" : "Not yet unlocked"}</span></article>`;
        })
        .join("")}</div></div>`;
  },
};
export default BadgesPage;
