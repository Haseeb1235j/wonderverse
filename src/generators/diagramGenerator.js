import { sourceSentences } from "../utils/sourceText.js";
import { escapeHTML } from "../utils/icons.js";

// An article reading map. Connections show shared source, not scientific causation.
export function generateDiagram(category, { title, extract = "" }) {
  const sentences = sourceSentences(extract).slice(0, 4);
  const nodes = sentences.map((sentence, index) => {
    const x = index % 2 ? 565 : 235,
      y = index < 2 ? 125 : 395;
    return `<g class="diagram-node" data-node="${index}" role="button" tabindex="0" aria-label="Read source excerpt ${index + 1}">
      <rect x="${x - 125}" y="${y - 55}" width="250" height="110" rx="12" fill="#111315" stroke="#536471"/>
      <text x="${x}" y="${y - 22}" text-anchor="middle" fill="#4ba7e5" font-size="13" font-weight="600">Source excerpt ${index + 1}</text>
      <foreignObject x="${x - 110}" y="${y - 10}" width="220" height="56"><div xmlns="http://www.w3.org/1999/xhtml" style="font:13px system-ui;color:#a0a6ac;line-height:1.4;display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;overflow:hidden;text-align:center;">${escapeHTML(sentence)}</div></foreignObject>
    </g>`;
  });
  const lines = sentences
    .map(
      (_, index) =>
        `<line x1="400" y1="260" x2="${index % 2 ? 565 : 235}" y2="${index < 2 ? 125 : 395}" stroke="#2f3336" stroke-width="2"/>`,
    )
    .join("");
  return `<svg viewBox="0 0 800 520" xmlns="http://www.w3.org/2000/svg" role="group" aria-label="Article map for ${escapeHTML(title)}" style="width:100%;font-family:system-ui,sans-serif;background:#080808;border-radius:12px;">
    <text x="400" y="36" text-anchor="middle" fill="#a0a6ac" font-size="13">ARTICLE READING MAP</text>${lines}
    <rect x="265" y="223" width="270" height="74" rx="14" fill="#111315" stroke="#1d9bf0"/>
    <text x="400" y="255" text-anchor="middle" fill="#e7e9ea" font-size="16" font-weight="600">${escapeHTML(title.length > 25 ? title.slice(0, 25) + "…" : title)}</text>
    <text x="400" y="278" text-anchor="middle" fill="#a0a6ac" font-size="11">Wikipedia introduction</text>${nodes.join("")}
    <text x="400" y="500" text-anchor="middle" fill="#a0a6ac" font-size="11">Select an excerpt to read its complete source text.</text></svg>`;
}
