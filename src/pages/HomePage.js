// HomePage Component
import { store } from "../store.js";
import { Router } from "../router.js";
import { SearchBar } from "../components/SearchBar.js";
import { Animations } from "../utils/animations.js";
import { getCategoryIcon, getCategoryLabel } from "../generators/categoryDetector.js";
import { StorageService } from "../services/storage.js";
import { VoiceService } from "../services/voice.js";

// Particle constellation background for the hero section
function initParticleCanvas(canvasEl) {
  if (!canvasEl) return;
  const ctx = canvasEl.getContext('2d');
  if (!ctx) return;

  const resize = () => {
    const rect = canvasEl.parentElement.getBoundingClientRect();
    canvasEl.width = rect.width;
    canvasEl.height = rect.height;
  };
  resize();
  window.addEventListener('resize', resize);

  const particles = Array.from({length:60}, () => ({
    x: Math.random() * canvasEl.width,
    y: Math.random() * canvasEl.height,
    r: Math.random() * 1.5 + 0.5,
    vx: (Math.random()-0.5) * 0.25,
    vy: (Math.random()-0.5) * 0.25,
    opacity: Math.random() * 0.5 + 0.1
  }));

  let animId;
  function draw() {
    ctx.clearRect(0, 0, canvasEl.width, canvasEl.height);
    // Draw particles
    particles.forEach(p => {
      p.x = (p.x + p.vx + canvasEl.width) % canvasEl.width;
      p.y = (p.y + p.vy + canvasEl.height) % canvasEl.height;
      ctx.beginPath(); 
      ctx.arc(p.x, p.y, p.r, 0, Math.PI*2);
      ctx.fillStyle = `rgba(167,139,250,${p.opacity})`; 
      ctx.fill();
    });
    // Draw connections
    particles.forEach((a, i) => {
      particles.slice(i+1).forEach(b => {
        const dist = Math.hypot(a.x-b.x, a.y-b.y);
        if (dist < 90) {
          ctx.beginPath(); 
          ctx.moveTo(a.x, a.y); 
          ctx.lineTo(b.x, b.y);
          ctx.strokeStyle = `rgba(124,58,237,${0.12*(1-dist/90)})`; 
          ctx.stroke();
        }
      });
    });
    animId = requestAnimationFrame(draw);
  }
  draw();
  
  return () => {
    cancelAnimationFrame(animId);
    window.removeEventListener('resize', resize);
  };
}

export const HomePage = {
  cleanupCanvas: null,

  render() {
    const state = store.getState();
    const recentSearches = state.recentSearches || [];
    const favorites = state.favorites?.topics || [];
    
    // 6 trending quick-chips below search (from history fallbacks or storage)
    const quickChips = recentSearches.slice(0, 6).map(h => h.title);
    const trendingChips = quickChips.length > 0 ? quickChips : ["Quantum Physics", "Human Brain", "Dinosaurs", "Ancient Egypt", "Volcano", "Artificial Intelligence"];

    // 12 topic chips in a flowing grid
    const tryTopics = [
      { icon: "🌌", label: "Moon", cat: "space" },
      { icon: "🧬", label: "DNA", cat: "biology" },
      { icon: "🏛️", label: "Ancient Egypt", cat: "history" },
      { icon: "🌋", label: "Volcano", cat: "earth" },
      { icon: "⚡", label: "Quantum Physics", cat: "physics" },
      { icon: "💻", label: "Artificial Intelligence", cat: "technology" },
      { icon: "🌍", label: "Photosynthesis", cat: "biology" },
      { icon: "🧪", label: "Chemistry", cat: "chemistry" },
      { icon: "💹", label: "Bitcoin", cat: "economics" },
      { icon: "🗺️", label: "Geography", cat: "geography" },
      { icon: "🏆", label: "Cricket", cat: "sports" },
      { icon: "🌊", label: "Ocean", cat: "earth" }
    ];

    // 8 popular search cards
    const popularCards = [
      { title: "Black Hole", desc: "A region of spacetime exhibiting gravitational acceleration so strong that nothing can escape from it.", cat: "space" },
      { title: "Human Heart", desc: "A muscular organ in most animals, which pumps blood through the blood vessels of the circulatory system.", cat: "biology" },
      { title: "Ancient Rome", desc: "The ancient civilization that grew from an agricultural community founded on the Italian Peninsula.", cat: "history" },
      { title: "Internet", desc: "A global system of interconnected computer networks that uses the Internet protocol suite.", cat: "technology" },
      { title: "Dinosaurs", desc: "A diverse group of reptiles of the clade Dinosauria that first appeared during the Triassic period.", cat: "biology" },
      { title: "Volcano", desc: "A rupture in the crust of a planetary-mass object, such as Earth, that allows hot lava and gases to escape.", cat: "earth" },
      { title: "Quantum Mechanics", desc: "A fundamental theory in physics that provides a description of the physical properties of nature at the scale of atoms.", cat: "physics" },
      { title: "Photosynthesis", desc: "A process used by plants and other organisms to convert light energy into chemical energy.", cat: "biology" }
    ];

    // 5 Mode preview details
    const modePreviews = [
      { name: "Story Mode", icon: "📚", desc: "Comic panels featuring character narration and text balloons." },
      { name: "Learn Mode", icon: "🧠", desc: "ELI10 options, vocabulary definitions, and structured details." },
      { name: "Diagram Mode", icon: "📊", desc: "Interactive SVG vectors that respond to clicks and nodes." },
      { name: "Quiz Mode", icon: "🎯", desc: "5 dynamic multiple choice questions with synth audio feedback." },
      { name: "Explore Mode", icon: "🧭", desc: "Suggests related subjects, search metrics, and Wikipedia coordinates." }
    ];

    return `
      <div class="homepage-container" style="display: flex; flex-direction: column; gap: var(--space-12); position: relative; z-index: 5;">
        
        <!-- SECTION 1: HERO SECTION -->
        <section class="hero-card reveal animate-fade-up" style="position: relative; overflow: hidden; padding: var(--space-16) var(--space-6); min-height: 480px; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; border-radius: var(--radius-xl); background: var(--gradient-hero);">
          <canvas id="hero-particle-canvas" style="position: absolute; inset: 0; width: 100%; height: 100%; pointer-events: none; z-index: 1;"></svg></canvas>
          
          <div style="position: relative; z-index: 2; max-width: 750px; display: flex; flex-direction: column; gap: var(--space-4); align-items: center;">
            <h1 class="text-hero" style="color: #ffffff; text-shadow: 0 4px 12px rgba(0,0,0,0.5);">
              Search Anything.<br/>Learn It Visually.
            </h1>
            <p class="text-body text-secondary" style="font-size: 1.15rem; max-width: 600px;">
              WonderVerse turns any topic into explanations, comics, diagrams, quizzes, and visual learning journeys using free public knowledge.
            </p>
            
            <div style="width: 100%; max-width: 580px; margin-top: var(--space-4);">
              ${SearchBar.render("Search any topic: AI, health, moon, dinosaurs, business...", "hero-search")}
            </div>
            
            <div style="display: flex; gap: var(--space-2); align-items: center; justify-content: center; flex-wrap: wrap; margin-top: var(--space-2);">
              <span class="text-tiny text-muted" style="font-weight: 700;">RECENT CORES:</span>
              ${trendingChips.map(chip => `
                <button class="btn btn-secondary btn-sm trending-chip-btn" data-query="${chip}" style="border-radius: var(--radius-full); font-size: 0.75rem;">
                  ${chip}
                </button>
              `).join('')}
            </div>
          </div>
        </section>

        <!-- SECTION 2: TRENDING TOPICS GRID -->
        <section class="reveal">
          <h2 class="text-h2" style="margin-bottom: var(--space-4); text-align: center;">Try Any Topic</h2>
          <div class="trending-grid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(160px, 1fr)); gap: var(--space-3);">
            ${tryTopics.map(topic => `
              <button class="card card-glow try-topic-btn" data-query="${topic.label}" style="display: flex; align-items: center; justify-content: center; gap: var(--space-2); padding: var(--space-4); cursor: pointer; text-align: center; border-radius: var(--radius-md);">
                <span style="font-size: 1.35rem;">${topic.icon}</span>
                <span class="text-small" style="font-weight: 600; color: var(--text-primary);">${topic.label}</span>
              </button>
            `).join('')}
          </div>
        </section>

        <!-- SECTION 3: POPULAR SEARCHES -->
        <section class="reveal">
          <h2 class="text-h2" style="margin-bottom: var(--space-2);">Explore What Others Are Learning</h2>
          <p class="text-small text-muted" style="margin-bottom: var(--space-6);">Explore high-fidelity visual cards crafted dynamically from encyclopedic database registries.</p>
          <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: var(--space-6);">
            ${popularCards.map(card => {
              const catIcon = getCategoryIcon(card.cat);
              const catLabel = getCategoryLabel(card.cat);
              return `
                <div class="card card-glow tilt-card reveal" style="display: flex; flex-direction: column; justify-content: space-between; min-height: 240px;">
                  <div class="mouse-glow"></div>
                  <div>
                    <span class="badge badge-${card.cat}">${catIcon} ${catLabel}</span>
                    <h3 class="text-h3" style="margin-top: var(--space-3); margin-bottom: var(--space-2);">${card.title}</h3>
                    <p class="text-small text-secondary" style="line-height: 1.4; height: 60px; overflow: hidden; margin-bottom: var(--space-4);">${card.desc}</p>
                  </div>
                  <button class="btn btn-secondary btn-sm popular-open-btn" data-title="${card.title}" style="width: 100%; justify-content: center;">
                    Open Journey →
                  </button>
                </div>
              `;
            }).join('')}
          </div>
        </section>

        <!-- SECTION 4: VISUAL JOURNEY PREVIEW -->
        <section class="reveal">
          <h2 class="text-h2" style="margin-bottom: var(--space-2);">What You Get</h2>
          <p class="text-small text-muted" style="margin-bottom: var(--space-6);">WonderVerse maps every search coordinate into five responsive telemetry profiles.</p>
          <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: var(--space-5);">
            ${modePreviews.map(m => `
              <div class="card" style="display: flex; flex-direction: column; gap: var(--space-2); text-align: center; padding: var(--space-5);">
                <span style="font-size: 2.25rem;">${m.icon}</span>
                <h4 class="text-h3" style="margin: 0;">${m.name}</h4>
                <p class="text-small text-secondary" style="line-height: 1.4; margin: 0;">${m.desc}</p>
              </div>
            `).join('')}
          </div>
        </section>

        <!-- SECTION 5: HOW IT WORKS -->
        <section class="reveal card" style="background: var(--bg-secondary); padding: var(--space-8);">
          <h2 class="text-h2" style="margin-top: 0; margin-bottom: var(--space-6); text-align: center;">How WonderVerse Works</h2>
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: var(--space-8); position: relative; z-index: 2;">
            <div class="text-center" style="display: flex; flex-direction: column; gap: var(--space-2);">
              <span class="text-mono" style="font-size: 1.5rem; color: var(--accent-cyan); font-weight: bold;">01</span>
              <h4 class="text-h3" style="margin: 0;">Search Any Subject</h4>
              <p class="text-small text-secondary" style="line-height: 1.4; margin: 0;">Type any coordinate into the engine. Our system queries public servers instantly.</p>
            </div>
            <div class="text-center" style="display: flex; flex-direction: column; gap: var(--space-2);">
              <span class="text-mono" style="font-size: 1.5rem; color: var(--accent-purple); font-weight: bold;">02</span>
              <h4 class="text-h3" style="margin: 0;">Dynamic Structuring</h4>
              <p class="text-small text-secondary" style="line-height: 1.4; margin: 0;">Generator filters complex definitions, creates comics, and formats lessons.</p>
            </div>
            <div class="text-center" style="display: flex; flex-direction: column; gap: var(--space-2);">
              <span class="text-mono" style="font-size: 1.5rem; color: var(--accent-amber); font-weight: bold;">03</span>
              <h4 class="text-h3" style="margin: 0;">Interactive Telemetry</h4>
              <p class="text-small text-secondary" style="line-height: 1.4; margin: 0;">Explore the topic through concept maps, quizzes, and ELI10 simplicity cards.</p>
            </div>
          </div>
        </section>

        <!-- SECTION 6: RECENTLY EXPLORED -->
        ${recentSearches.length > 0 ? `
          <section class="reveal">
            <h2 class="text-h2" style="margin-bottom: var(--space-4);">Recently Explored</h2>
            <div class="horizontal-scroll-row" style="display: flex; gap: var(--space-4); overflow-x: auto; padding-bottom: 10px;">
              ${recentSearches.map(item => {
                const catIcon = getCategoryIcon(item.category);
                const catLabel = getCategoryLabel(item.category);
                return `
                  <div class="card card-glow tilt-card try-topic-btn" data-query="${item.title}" style="flex: 0 0 240px; display: flex; flex-direction: column; justify-content: space-between; cursor: pointer; min-height: 140px; padding: var(--space-4);">
                    <div>
                      <span class="badge badge-${item.category}">${catIcon} ${catLabel}</span>
                      <h4 class="text-h3" style="margin-top: var(--space-2); margin-bottom: 4px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${item.title}</h4>
                    </div>
                    <span style="font-size: 0.72rem; color: var(--text-muted); font-weight: 500;">Opened on ${item.date}</span>
                  </div>
                `;
              }).join('')}
            </div>
          </section>
        ` : ''}

        <!-- SECTION 7: SAVED TOPICS -->
        ${favorites.length > 0 ? `
          <section class="reveal">
            <h2 class="text-h2" style="margin-bottom: var(--space-4);">Saved Library Preview</h2>
            <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: var(--space-4);">
              ${favorites.slice(0, 4).map(fav => `
                <div class="card card-glow try-topic-btn" data-query="${fav}" style="display: flex; justify-content: space-between; align-items: center; padding: var(--space-4); cursor: pointer;">
                  <div style="min-width: 0;">
                    <h4 class="text-h3" style="margin: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${fav}</h4>
                    <span style="font-size: 0.72rem; color: var(--accent-cyan); font-weight: 600;">Saved Topic</span>
                  </div>
                  <span style="font-size: 1.15rem; color: var(--accent-amber);">★</span>
                </div>
              `).join('')}
            </div>
          </section>
        ` : ''}

        <!-- SECTION 8: STATS BAR -->
        <section class="reveal card" style="background: var(--bg-secondary); border-color: var(--border-default); padding: var(--space-5);">
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(160px, 1fr)); gap: var(--space-6); text-align: center;">
            <div>
              <h4 class="text-mono text-h2" style="color: var(--accent-cyan); font-size: 2rem; margin: 0;">UNLIMITED</h4>
              <p class="text-tiny text-secondary" style="font-weight: 700; margin-top: 4px; text-transform: uppercase;">Topics Covered</p>
            </div>
            <div>
              <h4 class="text-mono text-h2" style="color: var(--accent-purple); font-size: 2rem; margin: 0;">5 MODES</h4>
              <p class="text-tiny text-secondary" style="font-weight: 700; margin-top: 4px; text-transform: uppercase;">Learning views</p>
            </div>
            <div>
              <h4 class="text-mono text-h2" style="color: var(--accent-amber); font-size: 2rem; margin: 0;">DYNAMIC</h4>
              <p class="text-tiny text-secondary" style="font-weight: 700; margin-top: 4px; text-transform: uppercase;">Quizzes created</p>
            </div>
            <div>
              <h4 class="text-mono text-h2" style="color: var(--accent-rose); font-size: 2rem; margin: 0;">7 TYPES</h4>
              <p class="text-tiny text-secondary" style="font-weight: 700; margin-top: 4px; text-transform: uppercase;">Diagram templates</p>
            </div>
            <div>
              <h4 class="text-mono text-h2" style="color: var(--accent-emerald); font-size: 2rem; margin: 0;">100% FREE</h4>
              <p class="text-tiny text-secondary" style="font-weight: 700; margin-top: 4px; text-transform: uppercase;">No account keys</p>
            </div>
          </div>
        </section>

      </div>
    `;
  },

  bindEvents() {
    // Scroll reveal setup
    Animations.initScrollReveal();
    Animations.setupTilt();

    // Bind Hero Particle Canvas
    const canvas = document.getElementById("hero-particle-canvas");
    if (canvas) {
      this.cleanupCanvas = initParticleCanvas(canvas);
    }

    // Bind hero search input
    SearchBar.bindEvents("hero-search", (query) => {
      Router.navigate(`search?q=${encodeURIComponent(query)}`);
    });

    // Bind trending chips clicks
    document.querySelectorAll(".trending-chip-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        const query = btn.getAttribute("data-query");
        Router.navigate(`search?q=${encodeURIComponent(query)}`);
      });
    });

    // Bind grid topic chips click
    document.querySelectorAll(".try-topic-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        const query = btn.getAttribute("data-query");
        Router.navigate(`search?q=${encodeURIComponent(query)}`);
      });
    });

    // Bind popular open button
    document.querySelectorAll(".popular-open-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        const title = btn.getAttribute("data-title");
        Router.navigate(`topic?t=${encodeURIComponent(title.replace(/ /g, '_'))}`);
      });
    });
  },

  destroy() {
    VoiceService.stop();
    if (this.cleanupCanvas) {
      this.cleanupCanvas();
      this.cleanupCanvas = null;
    }
  }
};

export default HomePage;
