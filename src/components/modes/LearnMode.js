// LearnMode Component
import { Animations } from "../../utils/animations.js";

export const LearnMode = {
  render(learnContent) {
    if (!learnContent) {
      return `<p class="text-secondary">No learn content generated.</p>`;
    }

    const keyTermsHtml = learnContent.keyTerms.map(kt => `
      <div style="padding: var(--space-3); background: var(--bg-elevated); border: 1px solid var(--border-default); border-radius: var(--radius-md);">
        <strong style="color: var(--accent-violet); font-size: 0.95rem; display: block; margin-bottom: 2px;">${kt.term}</strong>
        <p style="font-size: 0.825rem; color: var(--text-secondary); margin: 0; line-height: 1.4;">${kt.definition}</p>
      </div>
    `).join("");

    const keyFactsHtml = learnContent.keyFacts.map((fact, idx) => `
      <div style="padding: var(--space-3); background: var(--bg-elevated); border: 1px solid var(--border-default); border-radius: var(--radius-md); font-size: 0.85rem; line-height: 1.4; display: flex; gap: var(--space-3); align-items: flex-start;">
        <span style="color: var(--accent-cyan); font-weight: bold;">0${idx+1}</span>
        <span style="color: var(--text-primary);">${fact}</span>
      </div>
    `).join("");

    return `
      <div class="learn-mode-container reveal animate-fade-up" style="display: grid; grid-template-columns: 1fr 340px; gap: var(--space-6); padding-top: var(--space-2);">
        <!-- Main Structured Column -->
        <div style="display: flex; flex-direction: column; gap: var(--space-5);">
          <!-- What it is -->
          <div class="card" style="border-left: 4px solid var(--accent-cyan);" id="learn-what-card">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--space-3); flex-wrap: wrap; gap: 10px;">
              <h3 style="color: var(--accent-cyan); margin: 0; display: flex; align-items: center; gap: 8px; font-size: 1.3rem;">
                📖 What it is
              </h3>
              <button id="eli10-toggle" class="btn btn-secondary btn-sm" style="border-radius: var(--radius-full);">
                👶 Explain Like I'm 10
              </button>
            </div>
            <p id="learn-what-text" class="text-body" style="margin: 0; font-size: 1.05rem;">
              ${learnContent.overview}
            </p>
          </div>

          <!-- Why it matters -->
          <div class="card" style="border-left: 4px solid var(--accent-purple);">
            <h3 style="color: var(--accent-purple); margin-top: 0; margin-bottom: var(--space-3); font-size: 1.3rem; display: flex; align-items: center; gap: 8px;">
              🌟 Why it matters
            </h3>
            <p class="text-body" style="margin: 0;">
              ${learnContent.whyItMatters}
            </p>
          </div>

          <!-- How it works -->
          <div class="card" style="border-left: 4px solid var(--accent-blue);">
            <h3 style="color: var(--accent-blue); margin-top: 0; margin-bottom: var(--space-3); font-size: 1.3rem; display: flex; align-items: center; gap: 8px;">
              ⚙️ How it works
            </h3>
            <p class="text-body" style="margin: 0;">
              ${learnContent.howItWorks}
            </p>
          </div>

          <!-- Real-world examples -->
          <div class="card" style="border-left: 4px solid var(--accent-amber);">
            <h3 style="color: var(--accent-amber); margin-top: 0; margin-bottom: var(--space-3); font-size: 1.3rem; display: flex; align-items: center; gap: 8px;">
              🌍 Real-world Examples
            </h3>
            <p class="text-body" style="margin: 0;">
              ${learnContent.realExamples}
            </p>
          </div>
        </div>

        <!-- Sidebar Column -->
        <div style="display: flex; flex-direction: column; gap: var(--space-5);">
          <!-- Key Facts -->
          <div class="card" style="padding: var(--space-5);">
            <h4 class="text-h3" style="color: var(--accent-cyan); margin-top: 0; margin-bottom: var(--space-4);">💡 Key Facts</h4>
            <div style="display: flex; flex-direction: column; gap: var(--space-3);">
              ${keyFactsHtml}
            </div>
          </div>

          <!-- Key Terms -->
          <div class="card" style="padding: var(--space-5);">
            <h4 class="text-h3" style="color: var(--accent-violet); margin-top: 0; margin-bottom: var(--space-4);">🔑 Vocabulary</h4>
            <div style="display: flex; flex-direction: column; gap: var(--space-3);">
              ${keyTermsHtml}
            </div>
          </div>
        </div>
      </div>
    `;
  },

  bindEvents(learnContent) {
    Animations.initScrollReveal();

    let isELI10 = false;
    const toggleBtn = document.getElementById("eli10-toggle");
    const whatText = document.getElementById("learn-what-text");
    const whatCard = document.getElementById("learn-what-card");

    toggleBtn?.addEventListener("click", () => {
      isELI10 = !isELI10;
      if (isELI10) {
        toggleBtn.innerText = "⭐ Standard Mode";
        whatCard.style.borderColor = "var(--accent-amber)";
        whatText.innerHTML = `
          <strong>ELI10 Mode Active:</strong><br/>
          ${learnContent.eli5}
        `;
      } else {
        toggleBtn.innerText = "👶 Explain Like I'm 10";
        whatCard.style.borderColor = "var(--accent-cyan)";
        whatText.innerText = learnContent.overview;
      }
    });
  }
};

export default LearnMode;
