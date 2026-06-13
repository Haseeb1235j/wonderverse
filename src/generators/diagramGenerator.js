// Diagram Generator — Category to SVG diagram compiler
import { helpers } from "../utils/helpers.js";
import { textParser } from "../utils/textParser.js";

export function generateDiagram(category, topicData) {
  const { title, extract, query } = topicData;

  switch(category) {
    case 'space':      return generateOrbitalDiagram(title, extract);
    case 'biology':    return generateBodySystemDiagram(title, extract);
    case 'history':    return generateTimelineDiagram(title, extract);
    case 'technology': return generateNetworkDiagram(title, extract);
    case 'earth':      return generateProcessCycleDiagram(title, extract);
    case 'physics':    return generateForceDiagram(title, extract);
    case 'economics':  return generateFlowDiagram(title, extract);
    default:           return generateConceptMap(title, extract, query || title);
  }
}

// 1. CONCEPT MAP (Universal Fallback)
function generateConceptMap(title, extract, query) {
  const sentences = textParser.splitSentences(extract);
  const sentence1 = sentences[0] || `${title} is a fascinating topic to explore.`;
  const sentence2 = sentences[1] || `Understanding ${title} opens new perspectives.`;
  const sentence3 = sentences[2] || `${title} has wide real-world applications.`;

  const topKeywords = textParser.extractKeywords(extract, 5);

  const branches = [
    { label: 'What it is',         angle: -60,  x: 220, y: 160, color: '#7c3aed', desc: helpers.capitalize(sentence1.slice(0, 50)) + '...' },
    { label: 'Why it matters',     angle: 0,    x: 400, y: 80,  color: '#3b82f6', desc: `${title} plays an important role in its field.` },
    { label: 'Key facts',          angle: 60,   x: 580, y: 160, color: '#10b981', desc: topKeywords.slice(0, 3).join(', ') || 'Complex and multifaceted' },
    { label: 'Real examples',      angle: 120,  x: 580, y: 360, color: '#f59e0b', desc: helpers.capitalize(sentence2.slice(0, 50)) + '...' },
    { label: 'Related concepts',   angle: 180,  x: 400, y: 440, color: '#f43f5e', desc: topKeywords.slice(3, 5).join(', ') || 'Various related fields' },
    { label: 'Explore further',    angle: 240,  x: 220, y: 360, color: '#06b6d4', desc: helpers.capitalize(sentence3.slice(0, 50)) + '...' },
  ];

  const centerX = 400, centerY = 260;
  const titleShort = title.length > 18 ? title.slice(0, 18) + '...' : title;

  let svg = `<svg viewBox="0 0 800 520" xmlns="http://www.w3.org/2000/svg" 
    style="background:#111118; border-radius:16px; width:100%; font-family:Inter,sans-serif;">
    <defs>
      <radialGradient id="centerGrad" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stop-color="#7c3aed" stop-opacity="0.4"/>
        <stop offset="100%" stop-color="#3b82f6" stop-opacity="0.15"/>
      </radialGradient>
    </defs>
    <!-- Background grid -->
    <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
      <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255,255,255,0.03)" stroke-width="1"/>
    </pattern>
    <rect width="800" height="520" fill="url(#grid)"/>
    <!-- Title -->
    <text x="400" y="35" text-anchor="middle" fill="#a78bfa" font-size="13" font-weight="600" letter-spacing="1">CONCEPT MAP</text>
    <!-- Center node -->
    <circle cx="${centerX}" cy="${centerY}" r="70" fill="url(#centerGrad)" stroke="#7c3aed" stroke-width="1.5" class="diagram-node" data-node="center"/>
    <text x="${centerX}" y="${centerY-6}" text-anchor="middle" fill="#f0f0f8" font-size="14" font-weight="700">${titleShort}</text>
    <text x="${centerX}" y="${centerY+14}" text-anchor="middle" fill="#a0a0b8" font-size="10">tap node to explore</text>`;

  branches.forEach(branch => {
    const endX = branch.x;
    const endY = branch.y;

    svg += `
    <!-- Branch: ${branch.label} -->
    <line x1="${centerX}" y1="${centerY}" x2="${endX}" y2="${endY}" 
          stroke="${branch.color}" stroke-width="1.5" stroke-opacity="0.4" stroke-dasharray="5,3"/>
    <circle cx="${endX}" cy="${endY}" r="50" fill="${branch.color}" fill-opacity="0.12" stroke="${branch.color}" stroke-width="1" class="diagram-node" data-node="${branch.label}" style="cursor:pointer;"/>
    <text x="${endX}" y="${endY-8}" text-anchor="middle" fill="${branch.color}" font-size="10" font-weight="600">${branch.label}</text>
    <foreignObject x="${endX-44}" y="${endY+2}" width="88" height="48">
      <div xmlns="http://www.w3.org/1999/xhtml" style="font-size:8px;color:rgba(255,255,255,0.6);text-align:center;line-height:1.3;pointer-events:none;">${branch.desc}</div>
    </foreignObject>`;
  });

  svg += `</svg>`;
  return svg;
}

// 2. SPACE / ORBITAL DIAGRAM
function generateOrbitalDiagram(title, extract) {
  const sentences = textParser.splitSentences(extract);
  const orbitalNodes = [
    { label: 'Core Star / Planet', angle: 0, r: 25, color: '#f59e0b', desc: title },
    { label: 'Atmosphere / Ring', angle: 72, r: 85, color: '#3b82f6', desc: sentences[0]?.slice(0, 60) || 'Atmospheric telemetry elements' },
    { label: 'Satellite Orbit', angle: 144, r: 125, color: '#06b6d4', desc: sentences[1]?.slice(0, 60) || 'Satellite orbital gravity locks' },
    { label: 'Cosmic Influence', angle: 216, r: 165, color: '#7c3aed', desc: sentences[2]?.slice(0, 60) || 'Deep field interstellar magnetic force' },
    { label: 'Legacy / Records', angle: 288, r: 205, color: '#f43f5e', desc: sentences[3]?.slice(0, 60) || 'Observational record history' }
  ];

  const centerX = 400, centerY = 260;
  let svg = `<svg viewBox="0 0 800 520" xmlns="http://www.w3.org/2000/svg" style="background:#0a0a12; border-radius:16px; width:100%; font-family:Inter,sans-serif;">
    <defs>
      <radialGradient id="sunGrad" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stop-color="#fffbdf"/>
        <stop offset="50%" stop-color="#f59e0b" stop-opacity="0.8"/>
        <stop offset="100%" stop-color="#ef4444" stop-opacity="0.1"/>
      </radialGradient>
    </defs>
    <!-- Stars background -->
    <rect width="800" height="520" fill="#09090e"/>
    <circle cx="120" cy="80" r="1" fill="#fff" opacity="0.5"/>
    <circle cx="680" cy="120" r="1.5" fill="#fff" opacity="0.8"/>
    <circle cx="200" cy="400" r="0.8" fill="#fff" opacity="0.3"/>
    <circle cx="580" cy="440" r="1.2" fill="#fff" opacity="0.6"/>
    
    <text x="400" y="35" text-anchor="middle" fill="#3b82f6" font-size="13" font-weight="600" letter-spacing="1">CELESTIAL ORBITAL TELEMETRY</text>
    
    <!-- Concentric Orbit rings -->
    <circle cx="${centerX}" cy="${centerY}" r="85" fill="none" stroke="rgba(59, 130, 246, 0.15)" stroke-width="1.5" stroke-dasharray="4,4"/>
    <circle cx="${centerX}" cy="${centerY}" r="145" fill="none" stroke="rgba(6, 182, 212, 0.15)" stroke-width="1.5" stroke-dasharray="4,4"/>
    <circle cx="${centerX}" cy="${centerY}" r="205" fill="none" stroke="rgba(124, 58, 237, 0.15)" stroke-width="1.5" stroke-dasharray="4,4"/>
    
    <!-- Central Solar Body -->
    <circle cx="${centerX}" cy="${centerY}" r="45" fill="url(#sunGrad)" stroke="#f59e0b" stroke-width="1" class="diagram-node" data-node="central-body" style="cursor:pointer;"/>
    <text x="${centerX}" y="${centerY+4}" text-anchor="middle" fill="#ffffff" font-size="11" font-weight="700">${title.slice(0, 16)}</text>`;

  orbitalNodes.slice(1).forEach((node, i) => {
    const angleRad = (node.angle * Math.PI) / 180;
    const nodeX = centerX + node.r * Math.cos(angleRad);
    const nodeY = centerY + node.r * Math.sin(angleRad);
    
    svg += `
    <line x1="${centerX}" y1="${centerY}" x2="${nodeX}" y2="${nodeY}" stroke="rgba(255,255,255,0.06)" stroke-width="1"/>
    <circle cx="${nodeX}" cy="${nodeY}" r="22" fill="#111118" stroke="${node.color}" stroke-width="2" class="diagram-node" data-node="${node.label}" style="cursor:pointer;"/>
    <circle cx="${nodeX}" cy="${nodeY}" r="6" fill="${node.color}" opacity="0.8"/>
    
    <text x="${nodeX}" y="${nodeY-28}" text-anchor="middle" fill="${node.color}" font-size="9" font-weight="700">${node.label}</text>
    <foreignObject x="${nodeX-60}" y="${nodeY+26}" width="120" height="35">
      <div xmlns="http://www.w3.org/1999/xhtml" style="font-size:7px;color:#a0a0b8;text-align:center;line-height:1.2;">${node.desc}</div>
    </foreignObject>`;
  });

  svg += `</svg>`;
  return svg;
}

// 3. BIOLOGY / BODY SYSTEM DIAGRAM
function generateBodySystemDiagram(title, extract) {
  const sentences = textParser.splitSentences(extract);
  const organs = [
    { name: 'System Head', x: 400, y: 100, color: '#10b981', desc: title },
    { name: 'Structural Core', x: 250, y: 220, color: '#34d399', desc: sentences[0]?.slice(0, 60) || 'Core structural component.' },
    { name: 'Motor Functions', x: 550, y: 220, color: '#059669', desc: sentences[1]?.slice(0, 60) || 'Nervous system signals.' },
    { name: 'Energy Conversion', x: 250, y: 380, color: '#06b6d4', desc: sentences[2]?.slice(0, 60) || 'Metabolic synthesis actions.' },
    { name: 'Regulation loops', x: 550, y: 380, color: '#3b82f6', desc: sentences[3]?.slice(0, 60) || 'Homeostatic balance control.' }
  ];

  let svg = `<svg viewBox="0 0 800 520" xmlns="http://www.w3.org/2000/svg" style="background:#0a0f0d; border-radius:16px; width:100%; font-family:Inter,sans-serif;">
    <text x="400" y="35" text-anchor="middle" fill="#10b981" font-size="13" font-weight="600" letter-spacing="1">BIOLOGICAL HIERARCHY LAYOUT</text>
    
    <!-- Curved Connections -->
    <path d="M 400 100 Q 325 160 250 220" fill="none" stroke="rgba(16,185,129,0.2)" stroke-width="2"/>
    <path d="M 400 100 Q 475 160 550 220" fill="none" stroke="rgba(16,185,129,0.2)" stroke-width="2"/>
    <path d="M 250 220 L 250 380" fill="none" stroke="rgba(52,211,153,0.2)" stroke-width="2"/>
    <path d="M 550 220 L 550 380" fill="none" stroke="rgba(5,150,105,0.2)" stroke-width="2"/>
    <path d="M 250 220 Q 400 300 550 220" fill="none" stroke="rgba(255,255,255,0.05)" stroke-width="1.5" stroke-dasharray="3,3"/>`;

  organs.forEach(org => {
    svg += `
    <g class="diagram-node" data-node="${org.name}" style="cursor:pointer;">
      <rect x="${org.x - 70}" y="${org.y - 25}" width="140" height="50" rx="10" fill="#161b18" stroke="${org.color}" stroke-width="2"/>
      <text x="${org.x}" y="${org.y + 4}" text-anchor="middle" fill="#ffffff" font-size="9" font-weight="700">${org.name}</text>
      <foreignObject x="${org.x - 65}" y="${org.y + 30}" width="130" height="40">
        <div xmlns="http://www.w3.org/1999/xhtml" style="font-size:7px;color:#a0b8aa;text-align:center;line-height:1.2;">${org.desc}</div>
      </foreignObject>
    </g>`;
  });

  svg += `</svg>`;
  return svg;
}

// 4. HISTORY TIMELINE DIAGRAM
function generateTimelineDiagram(title, extract) {
  const sentences = textParser.splitSentences(extract);
  const phases = [
    { label: 'Origin / Genesis', year: 'Phase I', color: '#fbbf24', desc: sentences[0]?.slice(0, 75) || 'Original inception period.' },
    { label: 'Growth / Expansion', year: 'Phase II', color: '#f59e0b', desc: sentences[1]?.slice(0, 75) || 'Expansion and integration.' },
    { label: 'Zenith / Peak', year: 'Phase III', color: '#fb7185', desc: sentences[2]?.slice(0, 75) || 'Historical zenith and peak power.' },
    { label: 'Legacy / Impact', year: 'Phase IV', color: '#f43f5e', desc: sentences[3]?.slice(0, 75) || 'Lasting impact on systems today.' }
  ];

  let svg = `<svg viewBox="0 0 800 520" xmlns="http://www.w3.org/2000/svg" style="background:#130e0a; border-radius:16px; width:100%; font-family:Inter,sans-serif;">
    <text x="400" y="35" text-anchor="middle" fill="#fbbf24" font-size="13" font-weight="600" letter-spacing="1">CHRONOLOGICAL HISTORICAL TIMELINE</text>
    
    <!-- Timeline spine -->
    <line x1="80" y1="260" x2="720" y2="260" stroke="rgba(251,191,36,0.3)" stroke-width="3"/>
    <polygon points="730,260 715,252 715,268" fill="#fbbf24"/>`;

  phases.forEach((p, idx) => {
    const x = 140 + idx * 170;
    const yOffset = idx % 2 === 0 ? -90 : 90;
    const lineY = idx % 2 === 0 ? 170 : 350;

    svg += `
    <!-- Connectors -->
    <line x1="${x}" y1="260" x2="${x}" y2="${260 + yOffset/2}" stroke="${p.color}" stroke-width="1.5" stroke-dasharray="3,3"/>
    
    <!-- Timeline node -->
    <circle cx="${x}" cy="260" r="10" fill="#111118" stroke="${p.color}" stroke-width="3" class="diagram-node" data-node="${p.label}" style="cursor:pointer;"/>
    
    <!-- Content card -->
    <g class="diagram-node" data-node="${p.label}" style="cursor:pointer;">
      <rect x="${x-75}" y="${idx % 2 === 0 ? 110 : 280}" width="150" height="75" rx="8" fill="#1e1814" stroke="${p.color}" stroke-width="1"/>
      <text x="${x}" y="${idx % 2 === 0 ? 130 : 300}" text-anchor="middle" fill="${p.color}" font-size="9" font-weight="800">${p.year}</text>
      <text x="${x}" y="${idx % 2 === 0 ? 142 : 312}" text-anchor="middle" fill="#ffffff" font-size="8" font-weight="600">${p.label}</text>
      <foreignObject x="${x-70}" y="${idx % 2 === 0 ? 148 : 318}" width="140" height="34">
        <div xmlns="http://www.w3.org/1999/xhtml" style="font-size:6.5px;color:#d0c0b8;text-align:center;line-height:1.2;">${p.desc}</div>
      </foreignObject>
    </g>`;
  });

  svg += `</svg>`;
  return svg;
}

// 5. TECHNOLOGY / NETWORK DIAGRAM
function generateNetworkDiagram(title, extract) {
  const sentences = textParser.splitSentences(extract);
  const nodes = [
    { label: 'Data Source', x: 120, y: 260, color: '#a78bfa', desc: title },
    { label: 'Processing core', x: 320, y: 150, color: '#8a2be2', desc: sentences[0]?.slice(0, 60) || 'Main algorithm core.' },
    { label: 'Security firewall', x: 320, y: 370, color: '#c084fc', desc: sentences[1]?.slice(0, 60) || 'Access gatekeeper.' },
    { label: 'Telemetry logs', x: 520, y: 260, color: '#06b6d4', desc: sentences[2]?.slice(0, 60) || 'Output system monitors.' },
    { label: 'User Client', x: 700, y: 260, color: '#10b981', desc: sentences[3]?.slice(0, 60) || 'Client UI layout.' }
  ];

  let svg = `<svg viewBox="0 0 800 520" xmlns="http://www.w3.org/2000/svg" style="background:#0c0914; border-radius:16px; width:100%; font-family:Inter,sans-serif;">
    <text x="400" y="35" text-anchor="middle" fill="#a78bfa" font-size="13" font-weight="600" letter-spacing="1">NETWORK FLOWCHART DATA STREAM</text>
    
    <!-- Paths -->
    <path d="M 120 260 L 320 150" stroke="rgba(167, 139, 250, 0.4)" stroke-width="2" stroke-dasharray="3,3"/>
    <path d="M 120 260 L 320 370" stroke="rgba(167, 139, 250, 0.4)" stroke-width="2" stroke-dasharray="3,3"/>
    <path d="M 320 150 L 520 260" stroke="rgba(138, 43, 226, 0.4)" stroke-width="2"/>
    <path d="M 320 370 L 520 260" stroke="rgba(192, 132, 252, 0.4)" stroke-width="2"/>
    <path d="M 520 260 L 700 260" stroke="rgba(6, 182, 212, 0.4)" stroke-width="3"/>`;

  nodes.forEach(n => {
    svg += `
    <g class="diagram-node" data-node="${n.label}" style="cursor:pointer;">
      <circle cx="${n.x}" cy="${n.y}" r="35" fill="#181326" stroke="${n.color}" stroke-width="2.5"/>
      <text x="${n.x}" y="${n.y + 4}" text-anchor="middle" fill="#ffffff" font-size="8" font-weight="800">${n.label.toUpperCase()}</text>
      <foreignObject x="${n.x-55}" y="${n.y+42}" width="110" height="40">
        <div xmlns="http://www.w3.org/1999/xhtml" style="font-size:7px;color:#a0a0c8;text-align:center;line-height:1.2;">${n.desc}</div>
      </foreignObject>
    </g>`;
  });

  svg += `</svg>`;
  return svg;
}

// 6. EARTH / PROCESS CYCLE DIAGRAM
function generateProcessCycleDiagram(title, extract) {
  const sentences = textParser.splitSentences(extract);
  const steps = [
    { label: 'Step 1: Evaporation', x: 400, y: 100, color: '#3b82f6', desc: sentences[0]?.slice(0, 65) || 'Evaporation from surface sources.' },
    { label: 'Step 2: Condensation', x: 580, y: 220, color: '#06b6d4', desc: sentences[1]?.slice(0, 65) || 'Gaseous moisture turns cloud.' },
    { label: 'Step 3: Precipitation', x: 500, y: 400, color: '#10b981', desc: sentences[2]?.slice(0, 65) || 'Rain/snow delivers water.' },
    { label: 'Step 4: Collection', x: 300, y: 400, color: '#f59e0b', desc: sentences[3]?.slice(0, 65) || 'Runoff merges in collection reservoirs.' },
    { label: 'Step 5: Regeneration', x: 220, y: 220, color: '#fb7185', desc: title }
  ];

  let svg = `<svg viewBox="0 0 800 520" xmlns="http://www.w3.org/2000/svg" style="background:#0a0c10; border-radius:16px; width:100%; font-family:Inter,sans-serif;">
    <text x="400" y="35" text-anchor="middle" fill="#06b6d4" font-size="13" font-weight="600" letter-spacing="1">NATURAL RECYCLING PROCESS CYCLE</text>
    
    <!-- Circular Arrow spine -->
    <circle cx="400" cy="260" r="160" fill="none" stroke="rgba(255,255,255,0.04)" stroke-width="8"/>`;

  steps.forEach((step, idx) => {
    svg += `
    <g class="diagram-node" data-node="${step.label}" style="cursor:pointer;">
      <circle cx="${step.x}" cy="${step.y}" r="32" fill="#111827" stroke="${step.color}" stroke-width="2"/>
      <circle cx="${step.x}" cy="${step.y}" r="8" fill="${step.color}" opacity="0.3"/>
      <text x="${step.x}" y="${step.y+3}" text-anchor="middle" fill="#ffffff" font-size="7" font-weight="800">NODE ${idx+1}</text>
      <text x="${step.x}" y="${step.y-38}" text-anchor="middle" fill="${step.color}" font-size="9" font-weight="700">${step.label}</text>
      <foreignObject x="${step.x-60}" y="${step.y+36}" width="120" height="35">
        <div xmlns="http://www.w3.org/1999/xhtml" style="font-size:7px;color:#9ca3af;text-align:center;line-height:1.2;">${step.desc}</div>
      </foreignObject>
    </g>`;
  });

  svg += `</svg>`;
  return svg;
}

// 7. PHYSICS / FORCE VECTOR DIAGRAM
function generateForceDiagram(title, extract) {
  const sentences = textParser.splitSentences(extract);
  let svg = `<svg viewBox="0 0 800 520" xmlns="http://www.w3.org/2000/svg" style="background:#0c0a0f; border-radius:16px; width:100%; font-family:Inter,sans-serif;">
    <text x="400" y="35" text-anchor="middle" fill="#f43f5e" font-size="13" font-weight="600" letter-spacing="1">FORCE VECTORS & MASS MATRIX</text>
    
    <!-- Body Core -->
    <rect x="300" y="180" width="200" height="120" rx="12" fill="#1f1a24" stroke="#7c3aed" stroke-width="3" class="diagram-node" data-node="Mass Object" style="cursor:pointer;"/>
    <text x="400" y="246" text-anchor="middle" fill="#ffffff" font-size="14" font-weight="800">${title}</text>
    
    <!-- Normal Force (Up) -->
    <line x1="400" y1="180" x2="400" y2="70" stroke="#06b6d4" stroke-width="3.5"/>
    <polygon points="400,60 393,75 407,75" fill="#06b6d4"/>
    <text x="420" y="80" fill="#06b6d4" font-size="10" font-weight="700">FN: Normal Force</text>
    
    <!-- Gravity Force (Down) -->
    <line x1="400" y1="300" x2="400" y2="420" stroke="#f43f5e" stroke-width="3.5"/>
    <polygon points="400,430 393,415 407,415" fill="#f43f5e"/>
    <text x="420" y="420" fill="#f43f5e" font-size="10" font-weight="700">FG: Gravitational Pull</text>
    
    <!-- Applied Force (Right) -->
    <line x1="500" y1="240" x2="630" y2="240" stroke="#10b981" stroke-width="3.5"/>
    <polygon points="640,240 625,233 625,247" fill="#10b981"/>
    <text x="645" y="244" fill="#10b981" font-size="10" font-weight="700">FA: Applied Force</text>
    
    <!-- Friction Force (Left) -->
    <line x1="300" y1="240" x2="170" y2="240" stroke="#f59e0b" stroke-width="3.5"/>
    <polygon points="160,240 175,233 175,247" fill="#f59e0b"/>
    <text x="90" y="244" fill="#f59e0b" font-size="10" font-weight="700">FF: Friction Resistance</text>
    
    <foreignObject x="310" y="315" width="180" height="50">
      <div xmlns="http://www.w3.org/1999/xhtml" style="font-size:8px;color:#a78bfa;text-align:center;line-height:1.2;">${sentences[0]?.slice(0, 75) || 'Forces act on the central body in opposing directions, creating net acceleration.'}</div>
    </foreignObject>
  </svg>`;
  return svg;
}

// 8. ECONOMICS / FLOW DIAGRAM
function generateFlowDiagram(title, extract) {
  const sentences = textParser.splitSentences(extract);
  let svg = `<svg viewBox="0 0 800 520" xmlns="http://www.w3.org/2000/svg" style="background:#090b0e; border-radius:16px; width:100%; font-family:Inter,sans-serif;">
    <text x="400" y="35" text-anchor="middle" fill="#10b981" font-size="13" font-weight="600" letter-spacing="1">SUPPLY AND DEMAND MARKET TRANSACTION FLOW</text>
    
    <!-- Market Nodes -->
    <g class="diagram-node" data-node="Producers" style="cursor:pointer;">
      <rect x="100" y="210" width="140" height="80" rx="10" fill="#111827" stroke="#10b981" stroke-width="2.5"/>
      <text x="170" y="255" text-anchor="middle" fill="#ffffff" font-size="12" font-weight="800">PRODUCERS</text>
    </g>
    
    <g class="diagram-node" data-node="Consumers" style="cursor:pointer;">
      <rect x="560" y="210" width="140" height="80" rx="10" fill="#111827" stroke="#3b82f6" stroke-width="2.5"/>
      <text x="630" y="255" text-anchor="middle" fill="#ffffff" font-size="12" font-weight="800">CONSUMERS</text>
    </g>
    
    <!-- Flows -->
    <!-- Goods flow (producer to consumer) -->
    <path d="M 240 230 C 370 160 430 160 560 230" fill="none" stroke="#10b981" stroke-width="3"/>
    <polygon points="560,230 543,220 551,235" fill="#10b981"/>
    <text x="400" y="170" text-anchor="middle" fill="#10b981" font-size="9" font-weight="700">GOODS & SERVICES FLOW</text>
    
    <!-- Capital flow (consumer to producer) -->
    <path d="M 560 270 C 430 340 370 340 240 270" fill="none" stroke="#3b82f6" stroke-width="3"/>
    <polygon points="240,270 257,280 249,265" fill="#3b82f6"/>
    <text x="400" y="325" text-anchor="middle" fill="#3b82f6" font-size="9" font-weight="700">FINANCIAL CAPITAL FLOW</text>
    
    <foreignObject x="250" y="215" width="300" height="80">
      <div xmlns="http://www.w3.org/1999/xhtml" style="font-size:8px;color:#9ca3af;text-align:center;line-height:1.4;">
        <strong>Market Telemetry: ${title}</strong><br/>
        ${sentences[0]?.slice(0, 120) || 'Transactional loops coordinate capital and product distributions between agents.'}
      </div>
    </foreignObject>
  </svg>`;
  return svg;
}
