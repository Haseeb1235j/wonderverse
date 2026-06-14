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
    const sentence1 = sentences[0] || `${topicTitle} is a key topic of investigation.`;
    const sentence2 = sentences[1] || `Further research on ${topicTitle} helps explain its mechanisms.`;
    const sentence3 = sentences[2] || `Its applications are observed across various domains.`;
    const sentence4 = sentences[3] || `A deeper breakdown reveals how its core components interact.`;
    const topKeywords = textParser.extractKeywords(extract, 5);

    const descriptions = {
      'center': `${topicTitle} is the central hub of this concept map. It represents the primary theme and coordinates all outer topics: ${topKeywords.join(', ')}.`,
      'central-body': `${topicTitle} is the primary gravity anchor of this space model. Its structure governs the surrounding orbital paths and satellites.`,
      
      // Concept Map (Universal Fallback)
      'What it is': `Definition and Core Concept: ${sentence1} It establishes the primary definition and parameters of the topic.`,
      'Why it matters': `Significance & Relevance: ${topicTitle} plays an important role because it connects multiple theoretical and practical concepts. ${sentence2}`,
      'Key facts': `Key observations, metrics, and parameters: ${topKeywords.slice(0, 3).join(', ') || 'Complex and multifaceted'}. These are key identifiers used by experts in the field.`,
      'Real examples': `Real-World Application: We see this in practice where: ${sentence3} It forms the foundation of real world applications.`,
      'Related concepts': `Related Concepts & Domains: Major connected studies include ${topKeywords.slice(3, 5).join(', ') || 'Various related fields'}. These fields share structural or functional traits.`,
      'Explore further': `Future Scope & Advanced Exploration: ${sentence4} Researchers are investigating these areas to expand our knowledge base.`,
      
      // Space labels
      'Core Star / Planet': `Core celestial body representing ${topicTitle}. Its mass, density, and magnetic properties dictate coordinates for all surrounding paths.`,
      'Atmosphere / Ring': `Atmosphere and rings surrounding the core: ${sentence1}`,
      'Satellite Orbit': `Outer satellite orbits containing lunar or synthetic observers: ${sentence2}`,
      'Cosmic Influence': `Deep space magnetic vectors and radiation belts: ${sentence3}`,
      'Legacy / Records': `Observational telemetry and historical catalog entries: ${sentence4}`,

      // Biology labels
      'System Head': `Primary system controller representing ${topicTitle}. It processes inputs and regulates other nodes.`,
      'Structural Core': `Core structural anatomy: ${sentence1}`,
      'Motor Functions': `Neural signals and physical movement control: ${sentence2}`,
      'Energy Conversion': `Metabolism and energy synthesis: ${sentence3}`,
      'Regulation loops': `Homeostasis regulation: ${sentence4}`,

      // History labels
      'Origin / Genesis': `Initial inception phase of ${topicTitle}: ${sentence1}`,
      'Growth / Expansion': `Second phase, detailing expansion and integration: ${sentence2}`,
      'Zenith / Peak': `Peak level of development and peak system influence: ${sentence3}`,
      'Legacy / Impact': `Final legacy phase, detailing the lasting historical impact: ${sentence4}`,

      // Technology labels
      'Data Source': `System input hub for ${topicTitle}. Receives incoming raw data packages.`,
      'Processing core': `Main processing block: ${sentence1}`,
      'Security firewall': `Security gateway: ${sentence2}`,
      'Telemetry logs': `Logging console that monitors outputs: ${sentence3}`,
      'User Client': `Client UI layout: ${sentence4}`,

      // Earth labels
      'Step 1: Evaporation': `Phase 1 (Evaporation): ${sentence1}`,
      'Step 2: Condensation': `Phase 2 (Condensation): ${sentence2}`,
      'Step 3: Precipitation': `Phase 3 (Precipitation): ${sentence3}`,
      'Step 4: Collection': `Phase 4 (Collection): ${sentence4}`,
      'Step 5: Regeneration': `Phase 5 (Regeneration): Regeneration cycle restoring the core state of ${topicTitle}.`,

      // Physics labels
      'Mass Object': `Mass Object: The central body representing the core mass of ${topicTitle}. Under acceleration due to the balanced sum of external vectors.`,
      'FN: Normal Force': `Normal Force (FN): Support vector perpendicular to the surface, counteracting gravity: ${sentence1}`,
      'FG: Gravitational Pull': `Gravitational Force (FG): Force pulling the mass down toward the planet center: ${sentence2}`,
      'FA: Applied Force': `Applied Force (FA): Direct energy application pushing the mass object forward: ${sentence3}`,
      'FF: Friction Resistance': `Friction Resistance (FF): Opposing force resisting movement along the surface: ${sentence4}`,

      // Economics labels
      'Producers': `Producers: Businesses and agents that supply goods and services. They consume capital to run operations for ${topicTitle}: ${sentence1}`,
      'Consumers': `Consumers: Individuals and markets that purchase goods and services. They supply labor and financial capital, driving demand: ${sentence2}`,
      'Goods flow': `Goods & Services Flow: Shows the transfer of physical products, digital items, or expert services from Producers to Consumers: ${sentence3}`,
      'Capital flow': `Financial Capital Flow: Shows the payment and money transactions returned from Consumers to Producers, funding further creation: ${sentence4}`,
      'Market Telemetry': `General Flow Telemetry for ${topicTitle}: Transactional loops coordinate capital and product distributions between producers and consumers in the market.`
    };

    const explainEl = document.getElementById("diagram-explain");

    // Connect node clicks
    document.querySelectorAll(".diagram-node").forEach(node => {
      node.addEventListener("click", () => {
        const nodeId = node.getAttribute("data-node");
        const desc = descriptions[nodeId] || `Selected coordinate details for branch: ${nodeId}.`;
        
        if (explainEl) {
          explainEl.innerHTML = `
            <div style="display:flex; flex-direction:column; gap: var(--space-3); animation: fadeIn 0.25s forwards;">
              <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid var(--border-default); padding-bottom:8px;">
                <h4 style="color: var(--accent-cyan); margin: 0; font-size: 1.05rem;">
                  🔍 ${nodeId}
                </h4>
                <span style="font-size:0.65rem; font-family:var(--font-mono); color:var(--accent-emerald); background:rgba(16,185,129,0.15); padding:2px 6px; border-radius:4px; font-weight:700;">NODE NOMINAL</span>
              </div>
              <p style="color: var(--text-primary); margin: 0; line-height: 1.5; font-size: 0.875rem;">
                ${desc}
              </p>
              <div style="display:grid; grid-template-columns:1fr 1fr; gap:6px; font-family:var(--font-mono); font-size:0.68rem; color:var(--text-muted); border-top:1px solid var(--border-default); padding-top:8px; margin-top:4px;">
                <div>LOAD INDEX: <span style="color:var(--accent-purple)">98.4%</span></div>
                <div>CORRELATION: <span style="color:var(--accent-cyan)">ACTIVE</span></div>
              </div>
            </div>
          `;
        }
      });
    });
  }
};

export default DiagramMode;
