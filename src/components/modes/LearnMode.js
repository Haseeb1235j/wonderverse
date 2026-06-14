// LearnMode Component
import { Animations } from "../../utils/animations.js";
import { VoiceService } from "../../services/voice.js";
import { WikipediaService } from "../../services/wikipedia.js";

// AI Video Concept Visualizers (Procedural Synthesizers based on Category)
function drawSpace(ctx, width, height, tick) {
  ctx.fillStyle = '#05050a';
  ctx.fillRect(0, 0, width, height);
  
  // Accretion Disc glow
  const cx = width / 2;
  const cy = height / 2;
  const discGrad = ctx.createRadialGradient(cx, cy, 10, cx, cy, 150);
  discGrad.addColorStop(0, '#000000');
  discGrad.addColorStop(0.1, '#f59e0b');
  discGrad.addColorStop(0.3, '#7c3aed');
  discGrad.addColorStop(0.8, 'rgba(6,182,212,0.06)');
  discGrad.addColorStop(1, 'transparent');
  
  ctx.fillStyle = discGrad;
  ctx.beginPath();
  ctx.arc(cx, cy, 180, 0, Math.PI * 2);
  ctx.fill();
  
  // Moving orbit streams
  ctx.strokeStyle = 'rgba(34,211,238,0.2)';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.ellipse(cx, cy, 110, 40, tick * 0.005, 0, Math.PI * 2);
  ctx.stroke();
  
  // Singularity Core
  ctx.fillStyle = '#000000';
  ctx.beginPath();
  ctx.arc(cx, cy, 28 + Math.sin(tick * 0.05) * 2, 0, Math.PI * 2);
  ctx.fill();
  
  // Telemetry grids
  ctx.strokeStyle = 'rgba(6,182,212,0.1)';
  ctx.lineWidth = 0.5;
  for (let i = 0; i < width; i += 40) {
    ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, height); ctx.stroke();
  }
}

function drawBiology(ctx, width, height, tick) {
  ctx.fillStyle = '#05050a';
  ctx.fillRect(0, 0, width, height);
  
  const cx = width / 2;
  const points = 15;
  
  // Draw DNA double helix
  for (let i = 0; i < points; i++) {
    const y = (i / points) * (height - 80) + 40;
    const angle = (i * 0.4) + (tick * 0.025);
    const w = 80;
    
    const x1 = cx + Math.sin(angle) * w;
    const x2 = cx - Math.sin(angle) * w;
    
    ctx.strokeStyle = 'rgba(255,255,255,0.12)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(x1, y);
    ctx.lineTo(x2, y);
    ctx.stroke();
    
    ctx.fillStyle = '#10b981'; // emerald
    ctx.beginPath();
    ctx.arc(x1, y, 6, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.fillStyle = '#3b82f6'; // blue
    ctx.beginPath();
    ctx.arc(x2, y, 6, 0, Math.PI * 2);
    ctx.fill();
  }
}

function drawTechnology(ctx, width, height, tick) {
  ctx.fillStyle = 'rgba(5, 5, 10, 0.25)'; // trail blur
  ctx.fillRect(0, 0, width, height);
  
  const cx = width / 2;
  const cy = height / 2;
  
  ctx.strokeStyle = 'rgba(167, 139, 250, 0.4)';
  ctx.lineWidth = 2;
  
  // Circuit tracks
  ctx.beginPath();
  ctx.moveTo(40, cy - 80);
  ctx.lineTo(cx - 80, cy - 80);
  ctx.lineTo(cx, cy);
  ctx.lineTo(width - 40, cy);
  ctx.stroke();
  
  ctx.fillStyle = '#22d3ee';
  ctx.beginPath();
  ctx.arc(cx - 80, cy - 80, 5, 0, Math.PI * 2);
  ctx.arc(cx, cy, 5, 0, Math.PI * 2);
  ctx.fill();
  
  // Binary node data
  const dataX = (tick * 3) % (width + 100) - 50;
  ctx.fillStyle = '#34d399';
  ctx.beginPath();
  ctx.arc(dataX, cy, 8, 0, Math.PI * 2);
  ctx.fill();
}

function drawPhysics(ctx, width, height, tick) {
  ctx.fillStyle = '#05050a';
  ctx.fillRect(0, 0, width, height);
  
  const cx = width / 2;
  const cy = height / 2;
  
  // Nucleus
  ctx.fillStyle = '#f43f5e';
  ctx.beginPath();
  ctx.arc(cx, cy, 14, 0, Math.PI * 2);
  ctx.fill();
  
  // Orbits
  ctx.lineWidth = 1;
  const orbits = [
    { rot: Math.PI / 6, speed: 0.02, color: '#22d3ee' },
    { rot: -Math.PI / 3, speed: 0.015, color: '#a78bfa' },
    { rot: Math.PI / 2, speed: 0.025, color: '#fb7185' }
  ];
  
  orbits.forEach(o => {
    ctx.strokeStyle = 'rgba(255,255,255,0.15)';
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(o.rot);
    
    ctx.beginPath();
    ctx.ellipse(0, 0, 120, 40, 0, 0, Math.PI*2);
    ctx.stroke();
    
    const ex = 120 * Math.cos(tick * o.speed);
    const ey = 40 * Math.sin(tick * o.speed);
    ctx.fillStyle = o.color;
    ctx.beginPath();
    ctx.arc(ex, ey, 6, 0, Math.PI*2);
    ctx.fill();
    ctx.restore();
  });
}

function drawFallback(ctx, width, height, tick) {
  ctx.fillStyle = '#05050a';
  ctx.fillRect(0, 0, width, height);
  
  const nodes = [];
  const nodesCount = 14;
  for (let i = 0; i < nodesCount; i++) {
    const x = (Math.sin(i * 354 + tick * 0.0008) * 0.45 + 0.5) * width;
    const y = (Math.cos(i * 928 + tick * 0.0012) * 0.45 + 0.5) * height;
    nodes.push({ x, y });
  }
  
  // Lines
  ctx.strokeStyle = 'rgba(6, 182, 212, 0.12)';
  ctx.lineWidth = 1;
  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      const dist = Math.hypot(nodes[i].x - nodes[j].x, nodes[i].y - nodes[j].y);
      if (dist < 130) {
        ctx.beginPath();
        ctx.moveTo(nodes[i].x, nodes[i].y);
        ctx.lineTo(nodes[j].x, nodes[j].y);
        ctx.stroke();
      }
    }
  }
  
  // Nodes
  nodes.forEach((n, idx) => {
    ctx.fillStyle = idx % 2 === 0 ? '#22d3ee' : '#a78bfa';
    ctx.beginPath();
    ctx.arc(n.x, n.y, 4, 0, Math.PI * 2);
    ctx.fill();
  });
}

// Fullscreen Deep Dive Portal Handler
function openDeepDiveModal(title, category, sections, mediaData, videos, defaultTab = "details") {
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

  // Render Videos Grid HTML
  let videosListHtml = "";
  videos.forEach(vid => {
    videosListHtml += `
      <div class="video-footage-card" data-src="${vid.url}" data-mime="${vid.mime}" data-title="${vid.title.replace(/"/g, '&quot;')}">
        <div class="video-card-thumbnail">
          <span class="play-icon">▶</span>
        </div>
        <div class="video-card-title">${vid.title.replace(/\.[a-zA-Z0-9]+$/, '')}</div>
      </div>
    `;
  });

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
        <button class="deep-dive-tab-btn ${defaultTab === 'details' ? 'active' : ''}" data-tab="details">📄 Advanced Details</button>
        <button class="deep-dive-tab-btn ${defaultTab === 'footage' ? 'active' : ''}" data-tab="footage">📷 Real Footage (${images.length})</button>
        <button class="deep-dive-tab-btn ${defaultTab === 'videos' ? 'active' : ''}" data-tab="videos">🎥 Real Videos (${videos.length})</button>
      </div>

      <!-- Body -->
      <div class="deep-dive-body">
        <!-- Tab 1: Details -->
        <div class="deep-dive-tab-content ${defaultTab === 'details' ? 'active' : ''}" id="tab-details">
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
        <div class="deep-dive-tab-content ${defaultTab === 'footage' ? 'active' : ''}" id="tab-footage">
          <div class="media-footage-grid">
            ${mediaGridHtml}
          </div>
        </div>

        <!-- Tab 3: Videos -->
        <div class="deep-dive-tab-content ${defaultTab === 'videos' ? 'active' : ''}" id="tab-videos" style="flex-direction: column; overflow: hidden;">
          <!-- AI video header banner -->
          <div style="padding: var(--space-4) var(--space-6); background: rgba(124, 58, 237, 0.08); border-bottom: 1px solid var(--border-default); display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 10px; flex-shrink: 0; z-index: 10;">
            <div style="display: flex; flex-direction: column;">
              <h4 style="margin: 0; color: var(--accent-violet); font-size: 0.95rem; display: flex; align-items: center; gap: 6px;">✨ AI Video Synthesis Engine</h4>
              <p style="font-size: 0.75rem; color: var(--text-secondary); margin: 0;">Synthesize a high-fidelity animated telemetry simulation for this topic.</p>
            </div>
            <button id="synthesize-video-btn" class="btn btn-primary btn-sm" style="font-weight: 700;">
              ✨ Synthesize AI Video
            </button>
          </div>

          <!-- Video grid (default view) -->
          <div class="video-footage-grid" id="videos-default-view" style="flex: 1;">
            ${videosListHtml}
          </div>

          <!-- AI Synthesizer view (hidden by default) -->
          <div class="synthesis-container" id="synthesis-workspace" style="display: none; flex: 1;">
            <!-- Left Canvas pane -->
            <div class="synthesis-canvas-pane">
              <canvas id="synthesis-canvas"></canvas>
              <div style="position: absolute; bottom: 20px; left: 20px; display: flex; gap: 10px; z-index: 10;">
                <button id="synthesis-stop-btn" class="btn btn-secondary btn-sm" style="border-radius: var(--radius-full); font-weight: 700; background: rgba(30, 30, 42, 0.85); backdrop-filter: blur(4px);">
                  ⏹️ Exit Simulator
                </button>
              </div>
              <div id="synthesis-telemetry-indicator" style="position: absolute; top: 20px; right: 20px; font-family: var(--font-mono); font-size: 0.72rem; color: var(--accent-cyan); text-shadow: 0 0 5px rgba(6,182,212,0.5);">
                ● ENGINE ACTIVE | FPS: 60
              </div>
            </div>

            <!-- Right Telemetry log console -->
            <div class="synthesis-console-pane">
              <div style="display: flex; flex-direction: column; height: 100%; justify-content: space-between;">
                <div style="display: flex; flex-direction: column; overflow: hidden; height: calc(100% - 60px);">
                  <div class="synthesis-log-title">⚙️ SYSTEM LOG</div>
                  <div class="synthesis-logs" id="synthesis-console-logs"></div>
                </div>
                <div class="synthesis-telemetry">
                  <div>
                    <span style="display: block; color: var(--text-muted); font-size: 0.6rem;">GRID MATRIX</span>
                    <span style="color: var(--accent-violet);" id="matrix-coord">0.0.0</span>
                  </div>
                  <div>
                    <span style="display: block; color: var(--text-muted); font-size: 0.6rem;">RENDER BUFFER</span>
                    <span style="color: var(--accent-emerald);">OK</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;

  document.body.appendChild(overlay);
  document.body.style.overflow = "hidden"; // Disable background scrolling

  // Synthesizer State variables
  let animFrameId = null;
  let synthActive = false;

  function stopSynthesis() {
    synthActive = false;
    if (animFrameId) {
      cancelAnimationFrame(animFrameId);
      animFrameId = null;
    }
    // Stop voice narration
    VoiceService.stop();
    
    // UI cleanups
    const synthWorkspace = overlay.querySelector("#synthesis-workspace");
    const videosGrid = overlay.querySelector("#videos-default-view");
    const synthHeaderBtn = overlay.querySelector("#synthesize-video-btn");
    
    if (synthWorkspace && videosGrid) {
      synthWorkspace.style.display = "none";
      videosGrid.style.display = "grid";
    }
    if (synthHeaderBtn) {
      synthHeaderBtn.innerText = "✨ Synthesize AI Video";
      synthHeaderBtn.disabled = false;
    }
  }

  function startSynthesis() {
    VoiceService.stop();
    synthActive = true;
    
    const synthWorkspace = overlay.querySelector("#synthesis-workspace");
    const videosGrid = overlay.querySelector("#videos-default-view");
    const synthHeaderBtn = overlay.querySelector("#synthesize-video-btn");
    
    if (synthWorkspace && videosGrid) {
      videosGrid.style.display = "none";
      synthWorkspace.style.display = "grid";
    }
    if (synthHeaderBtn) {
      synthHeaderBtn.innerText = "✨ COMPILING SIMULATION...";
      synthHeaderBtn.disabled = true;
    }

    // Populate dynamic console logs
    const consoleEl = overlay.querySelector("#synthesis-console-logs");
    if (consoleEl) {
      consoleEl.innerHTML = "";
      const logs = [
        `[0.00s] Initializing WonderVerse Visual Synthesis Engine...`,
        `[0.05s] Establishing semantic connection to commons database...`,
        `[0.12s] Resolving coordinates for topic: ${title}...`,
        `[0.20s] Found topic category: ${category.toUpperCase()}`,
        `[0.32s] Loading neural procedural shaders...`,
        `[0.45s] Mapping vector constellations...`,
        `[0.55s] Starting rendering pipeline (60fps)...`,
        `[0.70s] Frame Buffer status: OK`,
        `[0.85s] Synchronizing audio narration telemetry...`,
        `[1.00s] AI Concept Video compilation: COMPLETE`,
        `[1.20s] Loop playback ACTIVE`
      ];
      
      let logIdx = 0;
      function addNextLog() {
        if (!synthActive || logIdx >= logs.length) return;
        const line = document.createElement("div");
        line.className = "synthesis-log-line";
        line.innerText = logs[logIdx];
        consoleEl.appendChild(line);
        consoleEl.scrollTop = consoleEl.scrollHeight;
        logIdx++;
        setTimeout(addNextLog, 300 + Math.random() * 300);
      }
      addNextLog();
    }

    // Canvas loop rendering
    const canvas = overlay.querySelector("#synthesis-canvas");
    if (canvas) {
      const ctx = canvas.getContext('2d');
      canvas.width = 600;
      canvas.height = 400;
      
      let tick = 0;
      function loop() {
        if (!synthActive) return;
        
        const cat = category ? category.toLowerCase() : "";
        if (cat === 'space') {
          drawSpace(ctx, canvas.width, canvas.height, tick);
        } else if (cat === 'biology' || cat === 'bio') {
          drawBiology(ctx, canvas.width, canvas.height, tick);
        } else if (cat === 'technology' || cat === 'tech') {
          drawTechnology(ctx, canvas.width, canvas.height, tick);
        } else if (cat === 'physics' || cat === 'science') {
          drawPhysics(ctx, canvas.width, canvas.height, tick);
        } else {
          drawFallback(ctx, canvas.width, canvas.height, tick);
        }
        
        const coordEl = overlay.querySelector("#matrix-coord");
        if (coordEl && tick % 15 === 0) {
          coordEl.innerText = `${Math.floor(Math.random()*256)}.${Math.floor(Math.random()*256)}.${Math.floor(Math.random()*999)}`;
        }

        tick++;
        animFrameId = requestAnimationFrame(loop);
      }
      loop();
    }

    // AI Narration explaining the topic in the background
    const textToSpeak = `Synthesized visual compilation for ${title}. Overview: ${sections[0]?.text?.replace(/<[^>]*>/g, '').slice(0, 300) || "Visual animation mapping scientific parameters."}`;
    VoiceService.speak(
      textToSpeak,
      () => {},
      () => {},
      (err) => console.log(err)
    );
  }

  // Bind Synthesis button clicks
  overlay.querySelector("#synthesize-video-btn")?.addEventListener("click", startSynthesis);
  overlay.querySelector("#synthesis-stop-btn")?.addEventListener("click", stopSynthesis);

  // Functions to manage tabs
  const tabBtns = overlay.querySelectorAll(".deep-dive-tab-btn");
  tabBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      tabBtns.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      
      const tabId = btn.getAttribute("data-tab");
      overlay.querySelectorAll(".deep-dive-tab-content").forEach(tc => tc.classList.remove("active"));
      overlay.querySelector(`#tab-${tabId}`).classList.add("active");
      
      // Stop speech on tab change
      VoiceService.stop();
      const speakBtn = overlay.querySelector("#modal-speak-btn");
      if (speakBtn) speakBtn.innerHTML = "🔊 Listen Section";
      
      // Stop canvas loop if leaving video tab
      if (tabId !== 'videos') {
        stopSynthesis();
      }
    });
  });

  // Function to load section content
  async function loadSection(index, name) {
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
    
    // Clean up links in html
    let cleanedHtml = html.replace(/href="\/\/en.wikipedia.org/g, 'href="https://en.wikipedia.org');
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

  // Bind Video Lightbox player for video cards
  overlay.querySelectorAll(".video-footage-card").forEach(card => {
    card.addEventListener("click", () => {
      const src = card.getAttribute("data-src");
      const mime = card.getAttribute("data-mime");
      const vtitle = card.getAttribute("data-title");
      openVideoLightbox(src, mime, vtitle);
    });
  });

  function openVideoLightbox(src, mime, vtitle) {
    VoiceService.stop();
    
    const lightbox = document.createElement("div");
    lightbox.className = "video-lightbox-overlay";
    lightbox.id = "deep-dive-video-lightbox";
    
    lightbox.innerHTML = `
      <div class="video-lightbox-wrapper">
        <div style="background: var(--bg-secondary); padding: var(--space-4) var(--space-6); border-bottom: 1px solid var(--border-default); display: flex; justify-content: space-between; align-items: center;">
          <h4 style="margin: 0; font-size: 0.95rem; color: #ffffff; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 600px;">🎥 ${vtitle}</h4>
          <button id="video-lightbox-close" class="btn btn-ghost btn-sm" style="border-radius: var(--radius-full); font-size: 1.2rem; width: 32px; height: 32px; padding: 0;">✕</button>
        </div>
        <video controls autoplay>
          <source src="${src}" type="${mime}">
          Your browser does not support HTML5 video playback.
        </video>
      </div>
    `;

    document.body.appendChild(lightbox);

    const closeVideo = () => {
      const vid = lightbox.querySelector("video");
      if (vid) vid.pause();
      lightbox.remove();
    };

    lightbox.addEventListener("click", (e) => {
      if (e.target.id === "deep-dive-video-lightbox" || e.target.id === "video-lightbox-close") {
        closeVideo();
      }
    });
  }

  // Close Modal handler
  const closeModal = () => {
    stopSynthesis();
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
        <p class="vocab-definition" data-term="${kt.term}" style="font-size: 0.825rem; color: var(--text-secondary); margin: 0; line-height: 1.4;">${kt.definition}</p>
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
              Unlock advanced breakdowns, deep subsections, archive photo galleries, and real footage educational videos.
            </p>
            <div style="display: flex; gap: var(--space-3); justify-content: center; flex-wrap: wrap; margin-top: var(--space-2);">
              <button id="learn-know-more-btn" class="btn btn-primary" style="display: flex; align-items: center; gap: var(--space-2); font-weight: 700; border-radius: var(--radius-md);">
                <span>🔍 Know More & Real Footage</span>
              </button>
              <button id="learn-watch-videos-btn" class="btn btn-secondary" style="display: flex; align-items: center; gap: var(--space-2); font-weight: 700; border-radius: var(--radius-md); border-color: var(--accent-purple); color: var(--accent-violet);">
                <span>🎥 Watch Real Videos</span>
              </button>
            </div>
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

    // Advanced Deep Portal Trigger Event & Trigger fallbacks
    const knowMoreBtn = document.getElementById("learn-know-more-btn");
    const watchVideosBtn = document.getElementById("learn-watch-videos-btn");

    async function triggerPortal(activeTab) {
      const topicTitle = window.topicPageInstance?.title || "";
      const topicCategory = window.topicPageInstance?.category || "";
      if (!topicTitle) return;

      const triggerBtn = activeTab === "videos" ? watchVideosBtn : knowMoreBtn;
      const originalHtml = triggerBtn.innerHTML;

      triggerBtn.disabled = true;
      triggerBtn.innerHTML = `<span>⏳ Loading Deep Portal...</span>`;

      try {
        const [sections, mediaData, videos] = await Promise.all([
          WikipediaService.getSections(topicTitle),
          WikipediaService.getMediaList(topicTitle),
          WikipediaService.getVideos(topicTitle, topicCategory)
        ]);

        triggerBtn.disabled = false;
        triggerBtn.innerHTML = originalHtml;

        if (!sections || sections.length === 0) {
          alert("Could not load advanced sections for this topic.");
          return;
        }

        openDeepDiveModal(topicTitle, topicCategory, sections, mediaData, videos, activeTab);
      } catch (err) {
        console.error("Deep dive loading failed", err);
        triggerBtn.disabled = false;
        triggerBtn.innerHTML = originalHtml;
        alert("Failed to access deep dive database. Please check connection.");
      }
    }

    knowMoreBtn?.addEventListener("click", () => triggerPortal("details"));
    watchVideosBtn?.addEventListener("click", () => triggerPortal("videos"));

    // Fetch rich dictionary definitions asynchronously
    document.querySelectorAll(".vocab-definition").forEach(async (el) => {
      const term = el.getAttribute("data-term");
      if (!term) return;
      try {
        const res = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(term.toLowerCase())}`);
        if (res.ok) {
          const data = await res.json();
          const definition = data[0]?.meanings?.[0]?.definitions?.[0]?.definition;
          if (definition) {
            el.innerText = definition;
          }
        }
      } catch (e) {
        // Safe fallback to default string
      }
    });
  }
};

export default LearnMode;
