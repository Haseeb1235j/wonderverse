// LearnMode Component
import { Animations } from "../../utils/animations.js";
import { VoiceService } from "../../services/voice.js";

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
                <button class="btn btn-ghost btn-sm speak-section-btn" data-section="what" style="padding: 2px var(--space-2); font-size: 0.9rem; border-radius: var(--radius-sm);" title="Listen to section">🔊</button>
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
              <button class="btn btn-ghost btn-sm speak-section-btn" data-section="why" style="padding: 2px var(--space-2); font-size: 0.9rem; border-radius: var(--radius-sm);" title="Listen to section">🔊</button>
            </h3>
            <p id="learn-why-text" class="text-body" style="margin: 0;">
              ${learnContent.whyItMatters}
            </p>
          </div>

          <!-- How it works -->
          <div class="card" style="border-left: 4px solid var(--accent-blue);">
            <h3 style="color: var(--accent-blue); margin-top: 0; margin-bottom: var(--space-3); font-size: 1.3rem; display: flex; align-items: center; gap: 8px;">
              ⚙️ How it works
              <button class="btn btn-ghost btn-sm speak-section-btn" data-section="how" style="padding: 2px var(--space-2); font-size: 0.9rem; border-radius: var(--radius-sm);" title="Listen to section">🔊</button>
            </h3>
            <p id="learn-how-text" class="text-body" style="margin: 0;">
              ${learnContent.howItWorks}
            </p>
          </div>

          <!-- Real-world examples -->
          <div class="card" style="border-left: 4px solid var(--accent-amber);">
            <h3 style="color: var(--accent-amber); margin-top: 0; margin-bottom: var(--space-3); font-size: 1.3rem; display: flex; align-items: center; gap: 8px;">
              🌍 Real-world Examples
              <button class="btn btn-ghost btn-sm speak-section-btn" data-section="examples" style="padding: 2px var(--space-2); font-size: 0.9rem; border-radius: var(--radius-sm);" title="Listen to section">🔊</button>
            </h3>
            <p id="learn-examples-text" class="text-body" style="margin: 0;">
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
      // Stop speaking when toggling ELI10 mode
      const whatSpeakBtn = document.querySelector('.speak-section-btn[data-section="what"]');
      if (whatSpeakBtn && whatSpeakBtn.classList.contains("speaking")) {
        VoiceService.stop();
      }

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

    // Section Speaker Integration
    const sectionBtns = document.querySelectorAll(".speak-section-btn");
    sectionBtns.forEach(btn => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        
        const sectionId = btn.getAttribute("data-section");
        let textElId = "";
        if (sectionId === "what") textElId = "learn-what-text";
        else if (sectionId === "why") textElId = "learn-why-text";
        else if (sectionId === "how") textElId = "learn-how-text";
        else if (sectionId === "examples") textElId = "learn-examples-text";
        
        const textEl = document.getElementById(textElId);
        if (!textEl) return;
        
        if (btn.classList.contains("speaking")) {
          VoiceService.stop();
          return;
        }
        
        // Reset all other section speaker buttons
        sectionBtns.forEach(b => {
          b.innerHTML = "🔊";
          b.classList.remove("speaking");
        });
        
        btn.innerHTML = "⏹️";
        btn.classList.add("speaking");
        
        VoiceService.speak(
          textEl.innerText,
          () => {
            btn.innerHTML = "⏹️";
            btn.classList.add("speaking");
          },
          () => {
            btn.innerHTML = "🔊";
            btn.classList.remove("speaking");
          },
          (err) => {
            console.error("Section voice error", err);
            btn.innerHTML = "🔊";
            btn.classList.remove("speaking");
          }
        );
      });
    });
  }
};

export default LearnMode;
