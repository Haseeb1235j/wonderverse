// LearnMode Component
import { Animations } from "../../utils/animations.js";
import { VoiceService } from "../../services/voice.js";
import { WikipediaService } from "../../services/wikipedia.js";

// AI Video Concept Visualizers (Procedural Synthesizers based on Category)
function drawHUD(ctx, width, height, tick, title, subText) {
  // 1. Grid backdrop
  ctx.strokeStyle = 'rgba(6, 182, 212, 0.05)';
  ctx.lineWidth = 0.5;
  const gridSize = 30;
  for (let x = 0; x < width; x += gridSize) {
    ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, height); ctx.stroke();
  }
  for (let y = 0; y < height; y += gridSize) {
    ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(width, y); ctx.stroke();
  }

  // 2. Futuristic Scanline
  const scanlineY = (tick * 1.5) % height;
  ctx.strokeStyle = 'rgba(6, 182, 212, 0.08)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(0, scanlineY);
  ctx.lineTo(width, scanlineY);
  ctx.stroke();

  // 3. Telemetry Borders
  ctx.strokeStyle = 'rgba(6, 182, 212, 0.3)';
  ctx.lineWidth = 1;
  // Top-left bracket
  ctx.beginPath(); ctx.moveTo(15, 30); ctx.lineTo(15, 15); ctx.lineTo(30, 15); ctx.stroke();
  // Top-right bracket
  ctx.beginPath(); ctx.moveTo(width - 30, 15); ctx.lineTo(width - 15, 15); ctx.lineTo(width - 15, 30); ctx.stroke();
  // Bottom-left bracket
  ctx.beginPath(); ctx.moveTo(15, height - 30); ctx.lineTo(15, height - 15); ctx.lineTo(30, height - 15); ctx.stroke();
  // Bottom-right bracket
  ctx.beginPath(); ctx.moveTo(width - 30, height - 15); ctx.lineTo(width - 15, height - 15); ctx.lineTo(width - 15, height - 30); ctx.stroke();

  // 4. Futuristic Text HUD
  ctx.font = '700 12px var(--font-mono, monospace)';
  ctx.fillStyle = 'rgba(6, 182, 212, 0.8)';
  ctx.fillText(`SYSTEM: AI SYNTHESIZER`, 25, 30);
  
  ctx.font = '400 9px var(--font-mono, monospace)';
  ctx.fillStyle = 'rgba(167, 139, 250, 0.6)';
  ctx.fillText(`TARGET: ${title.toUpperCase()}`, 25, 45);
  ctx.fillText(`SECTOR: ${subText.toUpperCase()}`, 25, 58);

  ctx.fillStyle = 'rgba(6, 182, 212, 0.5)';
  ctx.fillText(`COORD: ${Math.sin(tick*0.01).toFixed(4)}`, width - 120, 30);
  ctx.fillText(`BUFF: NOMINAL`, width - 120, 42);
}

function drawSpace(ctx, width, height, tick, title, skipBackground = false) {
  if (!skipBackground) {
    ctx.fillStyle = '#030307';
    ctx.fillRect(0, 0, width, height);
  }
  drawHUD(ctx, width, height, tick, title, 'Cosmic Telemetry');

  const cx = width / 2;
  const cy = height / 2 + 10;
  
  // Rotating galaxy accretion disk
  const numRings = 4;
  for (let r = 0; r < numRings; r++) {
    const rx = 140 - r * 25;
    const ry = 45 - r * 8;
    const angleOffset = tick * (0.01 + r * 0.005);
    
    ctx.strokeStyle = r === 0 ? 'rgba(245, 158, 11, 0.4)' : 'rgba(124, 58, 237, 0.2)';
    ctx.lineWidth = 2 - r * 0.3;
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(angleOffset);
    ctx.beginPath();
    ctx.ellipse(0, 0, rx, ry, 0, 0, Math.PI * 2);
    ctx.stroke();
    
    // Glowing stars on orbits
    const numStars = 6;
    for (let s = 0; s < numStars; s++) {
      const starAngle = (s * Math.PI * 2 / numStars) + tick * 0.01;
      const sx = rx * Math.cos(starAngle);
      const sy = ry * Math.sin(starAngle);
      ctx.fillStyle = r % 2 === 0 ? '#22d3ee' : '#fb7185';
      ctx.beginPath();
      ctx.arc(sx, sy, 3 - r * 0.5, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }

  // Black hole core
  const grad = ctx.createRadialGradient(cx, cy, 5, cx, cy, 32);
  grad.addColorStop(0, '#000000');
  grad.addColorStop(0.3, '#000000');
  grad.addColorStop(0.6, '#f59e0b');
  grad.addColorStop(0.8, 'rgba(124, 58, 237, 0.4)');
  grad.addColorStop(1, 'transparent');
  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.arc(cx, cy, 35, 0, Math.PI * 2);
  ctx.fill();
}

function drawBiology(ctx, width, height, tick, title, skipBackground = false) {
  if (!skipBackground) {
    ctx.fillStyle = '#030307';
    ctx.fillRect(0, 0, width, height);
  }
  drawHUD(ctx, width, height, tick, title, 'Genetic Synthesis');

  const cx = width / 2;
  const cy = height / 2 + 10;
  const numNodes = 12;
  
  // Draw DNA double helix spinning
  for (let i = 0; i < numNodes; i++) {
    const yOffset = (i / numNodes) * 180 - 90;
    const angle = (i * 0.45) + (tick * 0.035);
    const strandWidth = 70;
    
    const x1 = cx + Math.sin(angle) * strandWidth;
    const x2 = cx - Math.sin(angle) * strandWidth;
    const y = cy + yOffset;
    
    // Connector rungs
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(x1, y);
    ctx.lineTo(x2, y);
    ctx.stroke();

    // Node 1
    ctx.fillStyle = '#10b981';
    ctx.beginPath();
    ctx.arc(x1, y, 6, 0, Math.PI * 2);
    ctx.fill();
    // Glowing aura
    ctx.fillStyle = 'rgba(16, 185, 129, 0.3)';
    ctx.beginPath();
    ctx.arc(x1, y, 10, 0, Math.PI * 2);
    ctx.fill();

    // Node 2
    ctx.fillStyle = '#3b82f6';
    ctx.beginPath();
    ctx.arc(x2, y, 6, 0, Math.PI * 2);
    ctx.fill();
    // Glowing aura
    ctx.fillStyle = 'rgba(59, 130, 246, 0.3)';
    ctx.beginPath();
    ctx.arc(x2, y, 10, 0, Math.PI * 2);
    ctx.fill();
  }

  // Cellular floating organisms
  ctx.strokeStyle = 'rgba(34, 211, 238, 0.2)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.arc(450, 150 + Math.sin(tick * 0.02) * 10, 15, 0, Math.PI * 2);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(150, 280 + Math.cos(tick * 0.025) * 15, 8, 0, Math.PI * 2);
  ctx.stroke();
}

function drawTechnology(ctx, width, height, tick, title, skipBackground = false) {
  if (!skipBackground) {
    ctx.fillStyle = 'rgba(3, 3, 7, 0.3)'; // Trail fade for data flow
    ctx.fillRect(0, 0, width, height);
  }
  drawHUD(ctx, width, height, tick, title, 'Neural Matrix Network');

  const cx = width / 2;
  const cy = height / 2 + 10;
  
  // Neural nodes
  const nodes = [
    { x: cx, y: cy, label: "CORE" },
    { x: cx - 120, y: cy - 60, label: "DATA" },
    { x: cx + 120, y: cy - 60, label: "SYS" },
    { x: cx - 120, y: cy + 60, label: "NET" },
    { x: cx + 120, y: cy + 60, label: "MEM" },
  ];

  // Draw circuit traces
  ctx.strokeStyle = 'rgba(167, 139, 250, 0.2)';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  for (let i = 1; i < nodes.length; i++) {
    ctx.moveTo(nodes[0].x, nodes[0].y);
    ctx.lineTo(nodes[i].x, nodes[i].y);
  }
  ctx.stroke();

  // Pulse data packages along lines
  nodes.forEach((n, idx) => {
    if (idx > 0) {
      const pulseT = (tick * 0.015 + idx * 0.25) % 1.0;
      const px = nodes[0].x + (n.x - nodes[0].x) * pulseT;
      const py = nodes[0].y + (n.y - nodes[0].y) * pulseT;
      ctx.fillStyle = '#22d3ee';
      ctx.beginPath();
      ctx.arc(px, py, 4, 0, Math.PI * 2);
      ctx.fill();
    }

    // Node Core
    ctx.fillStyle = '#09090e';
    ctx.strokeStyle = idx === 0 ? '#a78bfa' : '#34d399';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(n.x, n.y, 16, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Node labels
    ctx.font = '700 8px var(--font-mono)';
    ctx.fillStyle = '#ffffff';
    ctx.textBaseline = 'middle';
    ctx.textAlign = 'center';
    ctx.fillText(n.label, n.x, n.y);
  });
  ctx.textAlign = 'left'; // Reset
}

function drawPhysics(ctx, width, height, tick, title, skipBackground = false) {
  if (!skipBackground) {
    ctx.fillStyle = '#030307';
    ctx.fillRect(0, 0, width, height);
  }
  drawHUD(ctx, width, height, tick, title, 'Quantum Mechanics');

  const cx = width / 2;
  const cy = height / 2 + 10;

  // Nucleus particle swarm
  ctx.fillStyle = '#f43f5e';
  const numNucleons = 5;
  for (let i = 0; i < numNucleons; i++) {
    const nx = cx + Math.sin(tick * 0.05 + i * 72) * 5;
    const ny = cy + Math.cos(tick * 0.05 + i * 36) * 5;
    ctx.beginPath();
    ctx.arc(nx, ny, i % 2 === 0 ? 5 : 6, 0, Math.PI * 2);
    ctx.fill();
  }

  // Bohr Orbits
  const orbits = [
    { rx: 110, ry: 40, rot: Math.PI / 6, speed: 0.02, color: '#22d3ee' },
    { rx: 140, ry: 50, rot: -Math.PI / 4, speed: 0.015, color: '#a78bfa' },
    { rx: 160, ry: 30, rot: Math.PI / 2, speed: 0.025, color: '#fb7185' }
  ];

  orbits.forEach((orb) => {
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.lineWidth = 1;
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(orb.rot);
    
    ctx.beginPath();
    ctx.ellipse(0, 0, orb.rx, orb.ry, 0, 0, Math.PI * 2);
    ctx.stroke();

    // Electron particle
    const ex = orb.rx * Math.cos(tick * orb.speed);
    const ey = orb.ry * Math.sin(tick * orb.speed);
    
    ctx.fillStyle = orb.color;
    ctx.beginPath();
    ctx.arc(ex, ey, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  });
}

function drawFallback(ctx, width, height, tick, title, skipBackground = false) {
  if (!skipBackground) {
    ctx.fillStyle = '#030307';
    ctx.fillRect(0, 0, width, height);
  }
  drawHUD(ctx, width, height, tick, title, 'Universal Schematic');

  const cx = width / 2;
  const cy = height / 2 + 10;

  // 3D wireframe rotating globe
  const globeRadius = 100;
  ctx.strokeStyle = 'rgba(6, 182, 212, 0.15)';
  ctx.lineWidth = 1;

  const numLat = 5;
  for (let i = 1; i < numLat; i++) {
    const latH = globeRadius * Math.sin((i / numLat) * Math.PI - Math.PI / 2);
    const latR = globeRadius * Math.cos((i / numLat) * Math.PI - Math.PI / 2);
    ctx.beginPath();
    ctx.ellipse(cx, cy + latH, latR, latR * 0.25, tick * 0.005, 0, Math.PI * 2);
    ctx.stroke();
  }

  const numLong = 6;
  for (let i = 0; i < numLong; i++) {
    const angle = (i * Math.PI / numLong) + tick * 0.003;
    ctx.beginPath();
    ctx.ellipse(cx, cy, globeRadius * Math.sin(angle), globeRadius, 0, 0, Math.PI * 2);
    ctx.stroke();
  }

  ctx.fillStyle = 'rgba(6, 182, 212, 0.4)';
  ctx.beginPath();
  ctx.arc(cx, cy, 8 + Math.sin(tick * 0.05) * 3, 0, Math.PI * 2);
  ctx.fill();
}

// Fullscreen Deep Dive Portal Handler
function openDeepDiveModal(title, category, sections, mediaData, videos, defaultTab = "details", learnContent) {
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
    const cleanTitle = vid.title.replace(/\.[a-zA-Z0-9]+$/, '').replace(/"/g, '&quot;');
    const thumbStyle = vid.thumbnail ? `background-image: url('${vid.thumbnail}'); background-size: cover; background-position: center;` : '';
    videosListHtml += `
      <div class="video-footage-card" data-src="${vid.url}" data-mime="${vid.mime}" data-title="${cleanTitle}" title="${cleanTitle}">
        <div class="video-card-thumbnail" style="${thumbStyle}">
          <div style="position: absolute; inset: 0; background: rgba(10,10,15,0.45); display: flex; align-items: center; justify-content: center; z-index: 1;">
            <span class="play-icon" style="text-shadow: 0 0 10px rgba(0,0,0,0.8);">▶</span>
          </div>
        </div>
        <div class="video-card-title">${cleanTitle}</div>
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

    // Load actual documentary photos of the topic in the background
    const imageList = images || [];
    const loadedImages = [];
    imageList.slice(0, 6).forEach(img => {
      const imgEl = new Image();
      imgEl.crossOrigin = "anonymous";
      imgEl.src = img.src;
      imgEl.onload = () => loadedImages.push(imgEl);
    });

    // Compile narrative sentences for subtitles/captions
    const narrativeSentences = [
      `WonderVerse AI telemetry synthesis for ${title}.`,
      `Definition summary: ${learnContent?.overview || ""}`,
      `Why this topic is important: ${learnContent?.whyItMatters || ""}`,
      `Operational mechanics: ${learnContent?.howItWorks || ""}`,
      `Real life application example: ${learnContent?.realExamples || ""}`
    ].map(s => s.replace(/Imagine explaining.*to a 10-year-old:/gi, '').trim()).filter(Boolean);

    // Populate dynamic console logs using REAL ARTICLE FACTS
    const consoleEl = overlay.querySelector("#synthesis-console-logs");
    if (consoleEl) {
      consoleEl.innerHTML = "";
      const facts = learnContent?.keyFacts || [];
      const terms = learnContent?.keyTerms || [];
      const logs = [
        `[0.00s] Initializing WonderVerse Visual Synthesis Engine...`,
        `[0.05s] Establishing connection to Wikipedia Core Database...`,
        `[0.10s] Resolving telemetry coordinates for: ${title.toUpperCase()}`,
        `[0.18s] Category classified: ${category.toUpperCase()}`,
        `[0.25s] Extracting semantic content sections...`,
        `[0.30s] SUMMARY: "${(learnContent?.overview || "").slice(0, 100)}..."`,
        `[0.38s] Generating procedural neural visualizations...`,
        ...facts.map((fact, idx) => `[0.48s] EXTR_FACT_${idx+1}: "${fact.slice(0, 110)}..."`),
        ...terms.map((t, idx) => `[0.65s] INDEX_VOCAB_${idx+1}: ${t.term} - ${t.definition.slice(0, 90)}`),
        `[0.85s] Synchronizing background voice narration...`,
        `[0.95s] Visual synthesis compile status: COMPLETE (60fps)`,
        `[1.05s] Simulation loop running in telemetry window.`
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
        
        // 1. Draw base background (black)
        ctx.fillStyle = '#030307';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // 2. Draw documentary slides (if loaded)
        if (loadedImages.length > 0) {
          const imgDuration = 360; // 6 seconds per image at 60fps
          const imgIdx = Math.floor((tick / imgDuration) % loadedImages.length);
          const activeImg = loadedImages[imgIdx];
          if (activeImg && activeImg.complete) {
            // Draw image with Ken Burns panning/zooming effect
            const scale = 1.05 + Math.sin(tick * 0.003) * 0.05;
            const w = canvas.width * scale;
            const h = canvas.height * scale;
            const x = (canvas.width - w) / 2 + Math.cos(tick * 0.002) * 5;
            const y = (canvas.height - h) / 2 + Math.sin(tick * 0.002) * 5;
            ctx.drawImage(activeImg, x, y, w, h);
            
            // Draw a semi-transparent overlay vignette
            ctx.fillStyle = 'rgba(5, 5, 10, 0.45)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
          }
        }
        
        // 3. Draw Category Procedural Animation (Space, Biology, Tech, Physics, Fallback) as a glowing overlay
        const cat = category ? category.toLowerCase() : "";
        ctx.save();
        if (loadedImages.length > 0) {
          ctx.globalAlpha = 0.5; // Blend animated shapes over background images
        }
        
        // Draw the visual elements using skipBackground = true
        if (cat === 'space') {
          drawSpace(ctx, canvas.width, canvas.height, tick, title, true);
        } else if (cat === 'biology' || cat === 'bio') {
          drawBiology(ctx, canvas.width, canvas.height, tick, title, true);
        } else if (cat === 'technology' || cat === 'tech') {
          drawTechnology(ctx, canvas.width, canvas.height, tick, title, true);
        } else if (cat === 'physics' || cat === 'science' || cat === 'chemistry') {
          drawPhysics(ctx, canvas.width, canvas.height, tick, title, true);
        } else {
          drawFallback(ctx, canvas.width, canvas.height, tick, title, true);
        }
        ctx.restore();
        
        // 4. Force HUD to draw on top of everything if skipBackground was used
        if (loadedImages.length > 0) {
          drawHUD(ctx, canvas.width, canvas.height, tick, title, category || 'Universal');
        }
        
        // 5. Draw captions / subtitles at the bottom
        if (narrativeSentences.length > 0) {
          const subDuration = 360; // 6 seconds per subtitle
          const subIdx = Math.floor(tick / subDuration) % narrativeSentences.length;
          const subtitle = narrativeSentences[subIdx];
          
          // Draw Subtitle Container Box
          ctx.fillStyle = 'rgba(5, 5, 10, 0.85)';
          ctx.strokeStyle = 'rgba(6, 182, 212, 0.35)';
          ctx.lineWidth = 1;
          ctx.fillRect(20, canvas.height - 75, canvas.width - 40, 50);
          ctx.strokeRect(20, canvas.height - 75, canvas.width - 40, 50);
          
          // Subtitle text lines wrapping
          ctx.font = '500 11px var(--font-sans, sans-serif)';
          ctx.fillStyle = '#ffffff';
          ctx.textAlign = 'center';
          
          const maxLineChars = 75;
          if (subtitle.length > maxLineChars) {
            const splitIdx = subtitle.indexOf(' ', maxLineChars - 10);
            const line1 = subtitle.slice(0, splitIdx);
            const line2 = subtitle.slice(splitIdx).trim();
            ctx.fillText(line1, canvas.width / 2, canvas.height - 57);
            ctx.fillText(line2, canvas.width / 2, canvas.height - 40);
          } else {
            ctx.fillText(subtitle, canvas.width / 2, canvas.height - 48);
          }
          ctx.textAlign = 'left'; // reset
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
    const textToSpeak = `Welcome to the WonderVerse AI Video Simulator for ${title}. Here is a summary of the topic: ${learnContent?.overview || ""} Why it matters: ${learnContent?.whyItMatters || ""} How it works: ${learnContent?.howItWorks || ""}`;
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
          <div class="card" style="border-left: 4px solid var(--accent-purple);" id="learn-why-card">
            <h3 style="color: var(--accent-purple); margin-top: 0; margin-bottom: var(--space-3); font-size: 1.3rem; display: flex; align-items: center; gap: 8px;">
              🌟 Why it matters
              <button class="btn btn-ghost btn-sm speak-section-btn" data-section="why" style="padding: 2px var(--space-2); font-size: 0.9rem; border-radius: var(--radius-sm);" title="Listen to section">🔊</button>
            </h3>
            <p id="learn-why-text" class="text-body" style="margin: 0;">
              ${learnContent.whyItMatters}
            </p>
          </div>

          <!-- How it works -->
          <div class="card" style="border-left: 4px solid var(--accent-blue);" id="learn-how-card">
            <h3 style="color: var(--accent-blue); margin-top: 0; margin-bottom: var(--space-3); font-size: 1.3rem; display: flex; align-items: center; gap: 8px;">
              ⚙️ How it works
              <button class="btn btn-ghost btn-sm speak-section-btn" data-section="how" style="padding: 2px var(--space-2); font-size: 0.9rem; border-radius: var(--radius-sm);" title="Listen to section">🔊</button>
            </h3>
            <p id="learn-how-text" class="text-body" style="margin: 0;">
              ${learnContent.howItWorks}
            </p>
          </div>

          <!-- Real-world examples -->
          <div class="card" style="border-left: 4px solid var(--accent-amber);" id="learn-examples-card">
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
      VoiceService.stop();
      document.querySelectorAll(".speak-section-btn").forEach(b => {
        b.innerHTML = "🔊";
        b.classList.remove("speaking");
      });

      isELI10 = !isELI10;
      
      const whatText = document.getElementById("learn-what-text");
      const whyText = document.getElementById("learn-why-text");
      const howText = document.getElementById("learn-how-text");
      const examplesText = document.getElementById("learn-examples-text");

      const whatCard = document.getElementById("learn-what-card");
      const whyCard = document.getElementById("learn-why-card");
      const howCard = document.getElementById("learn-how-card");
      const examplesCard = document.getElementById("learn-examples-card");

      if (isELI10) {
        toggleBtn.innerHTML = "⭐ Standard Mode";
        toggleBtn.style.background = "var(--accent-amber)";
        toggleBtn.style.color = "#000";
        toggleBtn.style.boxShadow = "0 0 12px rgba(245, 158, 11, 0.4)";
        
        if (whatCard) whatCard.style.borderColor = "var(--accent-amber)";
        if (whyCard) whyCard.style.borderColor = "var(--accent-amber)";
        if (howCard) howCard.style.borderColor = "var(--accent-amber)";
        if (examplesCard) examplesCard.style.borderColor = "var(--accent-amber)";

        if (whatText) whatText.innerHTML = `<span style="color: var(--accent-amber); font-weight: 700; font-size: 0.85rem; display: block; margin-bottom: 4px;">👶 ELI10 • SIMPLE SUMMARY</span>${learnContent.eli10_overview}`;
        if (whyText) whyText.innerHTML = `<span style="color: var(--accent-amber); font-weight: 700; font-size: 0.85rem; display: block; margin-bottom: 4px;">👶 ELI10 • WHY IT MATTERS</span>${learnContent.eli10_whyItMatters}`;
        if (howText) howText.innerHTML = `<span style="color: var(--accent-amber); font-weight: 700; font-size: 0.85rem; display: block; margin-bottom: 4px;">👶 ELI10 • HOW IT WORKS</span>${learnContent.eli10_howItWorks}`;
        if (examplesText) examplesText.innerHTML = `<span style="color: var(--accent-amber); font-weight: 700; font-size: 0.85rem; display: block; margin-bottom: 4px;">👶 ELI10 • REAL WORLD EXAMPLE</span>${learnContent.eli10_realExamples}`;
      } else {
        toggleBtn.innerHTML = "👶 Explain Like I'm 10";
        toggleBtn.style.background = "";
        toggleBtn.style.color = "";
        toggleBtn.style.boxShadow = "";
        
        if (whatCard) whatCard.style.borderColor = "var(--accent-cyan)";
        if (whyCard) whyCard.style.borderColor = "var(--accent-purple)";
        if (howCard) howCard.style.borderColor = "var(--accent-blue)";
        if (examplesCard) examplesCard.style.borderColor = "var(--accent-amber)";

        if (whatText) whatText.innerText = learnContent.overview;
        if (whyText) whyText.innerText = learnContent.whyItMatters;
        if (howText) howText.innerText = learnContent.howItWorks;
        if (examplesText) examplesText.innerText = learnContent.realExamples;
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

        openDeepDiveModal(topicTitle, topicCategory, sections, mediaData, videos, activeTab, learnContent);
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
