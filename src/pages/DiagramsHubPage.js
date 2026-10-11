import { diagramsData } from "../data.js";
import { icon, escapeHTML } from "../utils/icons.js";
const articles = {
  "solar-system": ["Solar System", "space"],
  "black-hole": ["Black hole", "space"],
  "human-heart": ["Heart", "biology"],
  brain: ["Human brain", "biology"],
  atom: ["Atom", "physics"],
  "water-cycle": ["Water cycle", "earth"],
  volcano: ["Volcano", "earth"],
  "food-chain": ["Food chain", "biology"],
  timeline: ["Ancient Egypt", "history"],
  "neural-net": ["Artificial neural network", "technology"],
};
export const DiagramsHubPage = {
  render() {
    return `<div class="diagrams-hub-page-container"><div class="page-title-banner"><h1 class="text-h1">See the connections.</h1><p class="text-small text-secondary">Read source excerpts through an interactive article map.</p></div>
      <div class="diagram-library">${diagramsData
        .map((diagram) => {
          const [article, category] = articles[diagram.id] || [
            diagram.title,
            "explore",
          ];
          return `<a class="diagram-library-card" href="#/topic?t=${encodeURIComponent(article.replace(/ /g, "_"))}&mode=diagram"><div class="diagram-card-art">${icon(category, 42)}<span>${icon("diagram", 22)}</span></div><div class="diagram-card-copy"><h2>${escapeHTML(article)}</h2><p>Read the introduction as an interactive article map.</p><span>Explore diagram ${icon("arrow", 15)}</span></div></a>`;
        })
        .join("")}</div></div>`;
  },
};
export default DiagramsHubPage;
