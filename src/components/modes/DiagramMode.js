// DiagramMode Component
import { Animations } from "../../utils/animations.js";
import { StorageService } from "../../services/storage.js";
import { Toast } from "../ui/Toast.js";
import { textParser } from "../../utils/textParser.js";

export const DiagramMode = {
  render(svgMarkup, topicTitle, category) {
    const isSaved = StorageService.isFavorite(topicTitle, "diagrams");

    return `
      <div class="diagram-mode-container reveal animate-fade-up" style="display: grid; grid-template-columns: 1fr 340px; gap: var(--space-6); padding-top: var(--space-2);">
        <!-- SVG Viewport Box -->
        <div class="card" style="padding: var(--space-4); display: flex; justify-content: center; align-items: center; background: #0c0c14; border: 1px solid var(--border-default); overflow: hidden; min-height: 400px; border-radius: var(--radius-lg);">
          <div id="svg-viewport" style="width: 100%; height: auto;">
            ${svgMarkup}
          </div>
        </div>

        <!-- Diagram Telemetry / Sidebar details -->
        <div style="display: flex; flex-direction: column; gap: var(--space-5);">
          <div class="card" style="padding: var(--space-5); display: flex; flex-direction: column; justify-content: space-between; height: 100%;">
            <div>
              <span class="text-tiny text-accent" style="font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em;">Dynamic Telemetry</span>
              <h3 class="text-h2" style="margin-top: var(--space-2); margin-bottom: var(--space-4); font-size: 1.3rem;">
                ${topicTitle} Schema
              </h3>
              
              <div id="diagram-explain" class="card" style="background: var(--bg-secondary); border-color: var(--border-default); padding: var(--space-4); min-height: 160px; font-size: 0.9rem; line-height: 1.5;">
                <p style="color: var(--text-secondary); text-align: center; margin-top: var(--space-8);">
                  Tap on any branch node in the diagram to inspect its conceptual properties.
                </p>
              </div>
            </div>

            <div style="margin-top: var(--space-6); display: flex; gap: var(--space-3);">
              <button id="diagram-save-btn" class="btn btn-secondary btn-sm" style="width: 100%; justify-content: center;">
                ${isSaved ? "★ Saved Diagram" : "☆ Save Diagram"}
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
  },

  bindEvents(topicTitle, extract, category) {
    Animations.initScrollReveal();

    const saveBtn = document.getElementById("diagram-save-btn");
    saveBtn?.addEventListener("click", () => {
      const added = StorageService.toggleFavorite(topicTitle, "diagrams");
      saveBtn.innerText = added ? "★ Saved Diagram" : "☆ Save Diagram";
      Toast.show(added ? "Diagram saved to library!" : "Diagram removed from library.");
    });

    // Parse extract to generate descriptions for nodes
    const sentences = textParser.splitSentences(extract);
    const sentence1 = sentences[0] || `${topicTitle} is a fascinating topic to explore.`;
    const sentence2 = sentences[1] || `Understanding ${topicTitle} opens new perspectives.`;
    const sentence3 = sentences[2] || `${topicTitle} has wide real-world applications.`;
    const topKeywords = textParser.extractKeywords(extract, 5);

    const descriptions = {
      'center': `${topicTitle} represents the primary coordinate under exploration.`,
      'central-body': `${topicTitle} represents the primary celestial coordinate under exploration.`,
      'What it is': sentence1,
      'Why it matters': `${topicTitle} plays an important role in its field.`,
      'Key facts': `Key terms and facts: ${topKeywords.slice(0, 3).join(', ') || 'Complex and multifaceted'}.`,
      'Real examples': sentence2,
      'Related concepts': `Related concepts: ${topKeywords.slice(3, 5).join(', ') || 'Various related fields'}.`,
      'Explore further': sentence3,
      
      // Space labels
      'Core Star / Planet': `Core Star / Planet: ${topicTitle}`,
      'Atmosphere / Ring': sentences[0] || 'Atmospheric telemetry elements',
      'Satellite Orbit': sentences[1] || 'Satellite orbital gravity locks',
      'Cosmic Influence': sentences[2] || 'Deep field interstellar magnetic force',
      'Legacy / Records': sentences[3] || 'Observational record history',

      // Biology labels
      'System Head': `Core organism system representing: ${topicTitle}`,
      'Structural Core': sentences[0] || 'Core structural component.',
      'Motor Functions': sentences[1] || 'Nervous system signals.',
      'Energy Conversion': sentences[2] || 'Metabolic synthesis actions.',
      'Regulation loops': sentences[3] || 'Homeostatic balance control.',

      // History labels
      'Origin / Genesis': sentences[0] || 'Original inception period.',
      'Growth / Expansion': sentences[1] || 'Expansion and integration.',
      'Zenith / Peak': sentences[2] || 'Historical zenith and peak power.',
      'Legacy / Impact': sentences[3] || 'Lasting impact on systems today.',

      // Technology labels
      'Data Source': `Core system input representing: ${topicTitle}`,
      'Processing core': sentences[0] || 'Main algorithm core.',
      'Security firewall': sentences[1] || 'Access gatekeeper.',
      'Telemetry logs': sentences[2] || 'Output system monitors.',
      'User Client': sentences[3] || 'Client UI layout.',

      // Earth labels
      'Step 1: Evaporation': sentences[0] || 'Evaporation from surface sources.',
      'Step 2: Condensation': sentences[1] || 'Gaseous moisture turns cloud.',
      'Step 3: Precipitation': sentences[2] || 'Rain/snow delivers water.',
      'Step 4: Collection': sentences[3] || 'Runoff merges in collection reservoirs.',
      'Step 5: Regeneration': `Regeneration loop of: ${topicTitle}`
    };

    const explainEl = document.getElementById("diagram-explain");

    // Connect node clicks
    document.querySelectorAll(".diagram-node").forEach(node => {
      node.addEventListener("click", () => {
        const nodeId = node.getAttribute("data-node");
        const desc = descriptions[nodeId] || `Selected coordinate details for branch: ${nodeId}.`;
        
        if (explainEl) {
          explainEl.innerHTML = `
            <h4 style="color: var(--accent-cyan); margin-top: 0; margin-bottom: var(--space-2); font-size: 1.05rem;">
              🔍 ${nodeId}
            </h4>
            <p style="color: var(--text-primary); margin: 0; line-height: 1.4; font-size: 0.875rem;">
              ${desc}
            </p>
          `;
        }
      });
    });
  }
};

export default DiagramMode;
