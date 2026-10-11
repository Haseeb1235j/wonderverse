import { StorageService } from "../../services/storage.js";
import { Toast } from "../ui/Toast.js";
import { sourceSentences } from "../../utils/sourceText.js";
import { escapeHTML, icon } from "../../utils/icons.js";

export const DiagramMode = {
  render(svgMarkup, topicTitle) {
    const saved = StorageService.isFavorite(topicTitle, "diagrams");
    return `<div class="diagram-mode-container"><div class="card diagram-viewport-card"><div id="svg-viewport">${svgMarkup}</div><p class="text-small text-secondary">A reading map of the article’s introduction. Lines group excerpts from the same source.</p></div>
      <aside class="card diagram-source-panel"><span class="eyebrow">SOURCE TEXT</span><h3>${escapeHTML(topicTitle)}</h3><div id="diagram-explain" aria-live="polite"><p class="text-secondary">Select an excerpt to read the complete text.</p></div>
      <button id="diagram-save-btn" class="btn btn-secondary" aria-pressed="${saved}">${icon(saved ? "check" : "bookmark", 16)} ${saved ? "Saved diagram" : "Save diagram"}</button></aside></div>`;
  },
  bindEvents(topicTitle, extract) {
    const sentences = sourceSentences(extract);
    const save = document.getElementById("diagram-save-btn");
    save?.addEventListener("click", () => {
      const added = StorageService.toggleFavorite(topicTitle, "diagrams");
      save.innerHTML = `${icon(added ? "check" : "bookmark", 16)} ${added ? "Saved diagram" : "Save diagram"}`;
      save.setAttribute("aria-pressed", String(added));
      Toast.show(added ? "Diagram saved." : "Diagram removed.");
    });
    document.querySelectorAll(".diagram-node").forEach((node) => {
      const select = () => {
        const index = Number(node.dataset.node),
          panel = document.getElementById("diagram-explain");
        if (panel && sentences[index])
          panel.innerHTML = `<h4>Source excerpt ${index + 1}</h4><blockquote>${escapeHTML(sentences[index])}</blockquote><p class="text-small text-secondary">From the Wikipedia introduction shown above.</p>`;
      };
      node.addEventListener("click", select);
      node.addEventListener("keydown", (event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          select();
        }
      });
    });
  },
};
export default DiagramMode;
