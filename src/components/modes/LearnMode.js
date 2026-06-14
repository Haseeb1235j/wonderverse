// LearnMode Component
import { Animations } from "../../utils/animations.js";
import { VoiceService } from "../../services/voice.js";
import { WikipediaService } from "../../services/wikipedia.js";

// Fullscreen Deep Dive Portal Handler
function openDeepDiveModal(title, sections, mediaData) {
  // Stop any active TTS first
  VoiceService.stop();

  // Create overlay
  const overlay = document.createElement("div");
  overlay.className = "deep-dive-overlay";
  overlay.id = "deep-dive-portal-overlay";

  // Filter sections to show only toclevel === 1 (main sections)
  // and exclude reference/see also sections that have no content or are just metadata
  const ignoredHeaders = ["see also", "references", "further reading", "external links", "notes", "bibliography", "sources", "indexes"];
  const mainSections = sections.filter(sec => 
    sec.toclevel === 1 && 
    !ignoredHeaders.includes(sec.line.toLowerCase())
  );
  
  // Filter media
  const items = mediaData?.items || [];
  const images = items
    .filter(item => item.type === 'image' && item.showInGallery)
    .map(item => {
      const src = item.srcset?.[item.srcset.length - 1]?.src || item.src;
      const cleanSrc = src.startsWith('//') ? `https:${src}` : src;
      return {
        title: item.title.replace('File:', '').replace(/_/g, ' '),
        src: cleanSrc,
        caption: item.caption?.text || item.title.replace('File:', '').replace(/_/g, ' ')
      };
    });

  // Render Sidebar items HTML
  const sidebarHtml = mainSections.map((sec, idx) => `
    <button class="deep-dive-section-item ${idx === 0 ? 'active' : ''}" data-index="${sec.index}" data-title="${sec.line}">
      ${sec.number ? sec.number + '. ' : ''}${sec.line}
    </button>
  `).join("");

  // Render Image Grid HTML
  let mediaGridHtml = "";
  if (images.length === 0) {
    mediaGridHtml = `
      <div style="grid-column: 1/-1; text-align: center; padding: var(--space-12); color: var(--text-secondary);">
        <span style="font-size: 3rem; display: block; margin-bottom: var(--space-4);">📷</span>
        <h3 style="color: var(--text-primary);">No Archive Photos Found</h3>
        <p style="font-size: 0.9rem; margin-top: 4px;">There are no gallery footages available for this topic in the archive.</p>
      </div>
    `;
  } else {
    mediaGridHtml = images.map(img => `
      <div class="media-footage-card" data-src="${img.src}" data-caption="${img.caption.replace(/"/g, '&quot;')}">
        <img src="${img.src}" alt="${img.title}" loading="lazy" />
        <div class="media-footage-caption">${img.title}</div>
      </div>
    `).join("");
  }

  // Modal Inner HTML
  overlay.innerHTML = `
    <div class="deep-dive-modal">
      <!-- Header -->
      <div class="deep-dive-header">
        <div style="display: flex; flex-direction: column;">
          <span class="text-tiny text-mono" style="color: var(--accent-cyan); font-weight: 700; letter-spacing: 0.1em;">DEEP DIVE PORTAL</span>
          <h2 style="margin: 0; font-size: 1.4rem; color: #ffffff;">${title}</h2>
        </div>
        <button id="deep-dive-close" class="btn btn-ghost btn-sm" style="border-radius: var(--radius-full); font-size: 1.25rem; width: 40px; height: 40px; padding: 0;">✕</button>
      </div>

      <!-- Tabs -->
      <div class="deep-dive-tabs">
        <button class="deep-dive-tab-btn active" data-tab="details">📄 Advanced Details</button>
        <button class="deep-dive-tab-btn" data-tab="footage">📷 Real Footage (${images.length})</button>
      </div>

      <!-- Body -->
      <div class="deep-dive-body">
        <!-- Tab 1: Details -->
        <div class="deep-dive-tab-content active" id="tab-details">
          <div class="deep-dive-split">
            <!-- Sidebar -->
            <div class="deep-dive-sidebar">
              ${sidebarHtml}
            </div>
            <!-- Content Pane -->
            <div class="deep-dive-content-pane" id="deep-dive-content">
              <div id="section-loading" style="display: none; justify-content: center; align-items: center; height: 100%; width: 100%;">
                <span class="text-secondary" style="font-size: 1.1rem; display: flex; align-items: center; gap: 8px;">
                  ⏳ Loading section content...
                </span>
              </div>
              <div id="section-body-wrapper" style="position: relative; width: 100%;">
                <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--border-default); padding-bottom: var(--space-4); margin-bottom: var(--space-4); gap: var(--space-4);">
                  <h3 id="active-section-title" style="margin: 0; font-size: 1.5rem; color: var(--accent-cyan);">Loading...</h3>
                  <button id="modal-speak-btn" class="btn btn-secondary btn-sm" style="border-radius: var(--radius-full); display: flex; align-items: center; gap: 6px; font-weight: 600; white-space: nowrap;">
                    🔊 Listen Section
                  </button>
                </div>
                <div id="active-section-html" class="text-body text-secondary" style="font-size: 1.02rem; line-height: 1.8;">
                  Please select a section from the sidebar to inspect advanced data.
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Tab 2: Footage -->
        <div class="deep-dive-tab-content" id="tab-footage">
          <div class="media-footage-grid">
            ${mediaGridHtml}
          </div>
        </div>
      </div>
    </div>
  `;

  document.body.appendChild(overlay);
  document.body.style.overflow = "hidden"; // Disable background scrolling

  // Functions to manage tabs
  const tabBtns = overlay.querySelectorAll(".deep-dive-tab-btn");
  tabBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      tabBtns.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      
      const tabId = btn.getAttribute("data-tab");
      overlay.querySelectorAll(".deep-dive-tab-content").forEach(tc => tc.classList.remove("active"));
      overlay.querySelector(`#tab-${tabId}`).classList.add("active");
      
      // Stop speech on tab change inside modal
      VoiceService.stop();
      const speakBtn = overlay.querySelector("#modal-speak-btn");
      if (speakBtn) speakBtn.innerHTML = "🔊 Listen Section";
    });
  });

  // Function to load section content
  async function loadSection(index, name) {
    // Stop any speech first
    VoiceService.stop();
    const speakBtn = overlay.querySelector("#modal-speak-btn");
    if (speakBtn) speakBtn.innerHTML = "🔊 Listen Section";

    const contentPane = overlay.querySelector("#deep-dive-content");
    const loadingEl = overlay.querySelector("#section-loading");
    const wrapperEl = overlay.querySelector("#section-body-wrapper");
    const titleEl = overlay.querySelector("#active-section-title");
    const htmlEl = overlay.querySelector("#active-section-html");

    wrapperEl.style.display = "none";
    loadingEl.style.display = "flex";

    const html = await WikipediaService.getSectionText(title, index);
    
    loadingEl.style.display = "none";
    wrapperEl.style.display = "block";

    titleEl.innerText = name;
    
    // Clean up HTML from Wikipedia: remove raw style tags, meta, or reference tags
    let cleanedHtml = html;
    
    // Replace double slash links with https
    cleanedHtml = cleanedHtml.replace(/href="\/\/en.wikipedia.org/g, 'href="https://en.wikipedia.org');
    
    // Set HTML content
    htmlEl.innerHTML = cleanedHtml;
    contentPane.scrollTop = 0;
  }

  // Bind sidebar section clicks
  const sidebarItems = overlay.querySelectorAll(".deep-dive-section-item");
  sidebarItems.forEach(item => {
    item.addEventListener("click", () => {
      sidebarItems.forEach(sib => sib.classList.remove("active"));
      item.classList.add("active");
      
      const index = item.getAttribute("data-index");
      const name = item.getAttribute("data-title");
      loadSection(index, name);
    });
  });

  // Bind speak narration
  const modalSpeakBtn = overlay.querySelector("#modal-speak-btn");
  modalSpeakBtn?.addEventListener("click", () => {
    if (VoiceService.isPlaying()) {
      VoiceService.stop();
      modalSpeakBtn.innerHTML = "🔊 Listen Section";
    } else {
      modalSpeakBtn.innerHTML = "⏹️ Stop";
      
      const textToSpeak = overlay.querySelector("#active-section-html").innerText;
      VoiceService.speak(
        textToSpeak,
        () => {
          modalSpeakBtn.innerHTML = "⏹️ Stop";
        },
        () => {
          modalSpeakBtn.innerHTML = "🔊 Listen Section";
        },
        (err) => {
          console.error("Modal speaker error", err);
          modalSpeakBtn.innerHTML = "🔊 Listen Section";
        }
      );
    }
  });

  // Load first section by default
  if (mainSections.length > 0) {
    loadSection(mainSections[0].index, mainSections[0].line);
  }

  // Bind Lightbox overlay for footage grid
  overlay.querySelectorAll(".media-footage-card").forEach(card => {
    card.addEventListener("click", () => {
      const src = card.getAttribute("data-src");
      const caption = card.getAttribute("data-caption");
      openLightbox(src, caption);
    });
  });

  function openLightbox(src, caption) {
    const lightbox = document.createElement("div");
    lightbox.className = "lightbox-overlay";
    lightbox.id = "deep-dive-lightbox";
    lightbox.innerHTML = `
      <button id="lightbox-close" class="btn btn-ghost" style="position: absolute; top: var(--space-6); right: var(--space-6); color: #fff; font-size: 1.5rem; width: 40px; height: 40px; padding: 0;">✕</button>
      <div class="lightbox-img-wrapper">
        <img src="${src}" alt="Lightbox zoom" />
      </div>
      <div class="lightbox-caption">${caption}</div>
    `;

    document.body.appendChild(lightbox);

    const closeLightbox = () => {
      lightbox.remove();
    };

    lightbox.addEventListener("click", (e) => {
      if (e.target.id === "deep-dive-lightbox" || e.target.id === "lightbox-close") {
        closeLightbox();
      }
    });
  }

  // Close Modal handler
  const closeModal = () => {
    VoiceService.stop();
    overlay.remove();
    document.body.style.overflow = ""; // Re-enable background scrolling
  };

  overlay.querySelector("#deep-dive-close").addEventListener("click", closeModal);
  overlay.addEventListener("click", (e) => {
    if (e.target.id === "deep-dive-portal-overlay") {
      closeModal();
    }
  });
}

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

          <!-- Deepen Your Knowledge CTA Card -->
          <div class="card card-glow text-center reveal animate-fade-up" style="padding: var(--space-6); background: var(--gradient-hero); border-color: var(--accent-cyan); display: flex; flex-direction: column; align-items: center; gap: var(--space-3); margin-top: var(--space-4);">
            <h3 style="color: #ffffff; margin: 0; font-size: 1.3rem; display: flex; align-items: center; gap: var(--space-2);">
              🧠 Deepen Your Knowledge
            </h3>
            <p class="text-body text-secondary" style="font-size: 0.92rem; max-width: 500px; margin: 0; line-height: 1.5;">
              Unlock advanced breakdowns, deep encyclopedic subsections, and a photographic gallery of real footage sourced directly from scientific archives.
            </p>
            <button id="learn-know-more-btn" class="btn btn-primary" style="margin-top: var(--space-2); display: flex; align-items: center; gap: var(--space-2); font-weight: 700; border-radius: var(--radius-md);">
              <span>🔍 Know More & Real Footage</span>
            </button>
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

    // Advanced Deep Portal Trigger Event
    const knowMoreBtn = document.getElementById("learn-know-more-btn");
    knowMoreBtn?.addEventListener("click", async () => {
      const topicTitle = window.topicPageInstance?.title || "";
      if (!topicTitle) return;

      knowMoreBtn.disabled = true;
      knowMoreBtn.innerHTML = `<span>⏳ Loading Deep Portal...</span>`;

      try {
        const [sections, mediaData] = await Promise.all([
          WikipediaService.getSections(topicTitle),
          WikipediaService.getMediaList(topicTitle)
        ]);

        knowMoreBtn.disabled = false;
        knowMoreBtn.innerHTML = `<span>🔍 Know More & Real Footage</span>`;

        if (!sections || sections.length === 0) {
          alert("Could not load advanced sections for this topic.");
          return;
        }

        openDeepDiveModal(topicTitle, sections, mediaData);
      } catch (err) {
        console.error("Deep dive loading failed", err);
        knowMoreBtn.disabled = false;
        knowMoreBtn.innerHTML = `<span>🔍 Know More & Real Footage</span>`;
        alert("Failed to access deep dive database. Please check connection.");
      }
    });
  }
};

export default LearnMode;
