import { StorageService } from "../services/storage.js";
import {
  detectCategory,
  getCategoryIcon,
  getCategoryLabel,
} from "../generators/categoryDetector.js";
import { icon, escapeHTML } from "../utils/icons.js";
export const SavedPage = {
  render() {
    const saved = StorageService.getFavorites(),
      topics = saved.topics || [],
      diagrams = saved.diagrams || [];
    const collection = (titles, label, mode) =>
      `<section class="collection-section"><h2>${label}<span>${titles.length}</span></h2><div class="collection-list">${titles
        .map((title) => {
          const category = detectCategory(title, "");
          return `<a class="collection-row" href="#/topic?t=${encodeURIComponent(title.replace(/ /g, "_"))}${mode ? "&mode=diagram" : ""}"><span class="collection-icon">${mode ? icon("diagram", 22) : getCategoryIcon(category)}</span><div><h3>${escapeHTML(title)}</h3><p>${mode ? "Saved diagram" : getCategoryLabel(category)}</p></div>${icon("arrow", 18)}</a>`;
        })
        .join("")}</div></section>`;
    return `<div class="saved-page-container"><div class="page-title-banner"><h1 class="text-h1">Your saved ideas.</h1><p class="text-small text-secondary">A personal collection of things worth coming back to.</p></div>
      ${!topics.length && !diagrams.length ? `<div class="empty-state">${icon("bookmark", 36)}<h2>Make room for your next discovery.</h2><p>Save a topic or diagram as you explore. You’ll find it here whenever you want to return.</p><a class="btn btn-primary" href="#/landing">Explore topics ${icon("arrow", 16)}</a></div>` : ""}
      ${topics.length ? collection(topics, "Topics", false) : ""}${diagrams.length ? collection(diagrams, "Diagrams", true) : ""}
      <p class="collection-note">Your collection is stored in this browser.</p></div>`;
  },
};
export default SavedPage;
