// Decorative line icons; interactive controls provide their own text or label.
const paths = {
  search: '<circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 4.5 4.5"/>',
  explore:
    '<circle cx="12" cy="12" r="9"/><path d="m16 8-2.5 5.5L8 16l2.5-5.5Z"/>',
  bookmark: '<path d="M6 3h12v18l-6-4-6 4Z"/>',
  diagram:
    '<rect x="9" y="2" width="6" height="5" rx="1"/><rect x="2" y="17" width="6" height="5" rx="1"/><rect x="16" y="17" width="6" height="5" rx="1"/><path d="M12 7v5M5 17v-5h14v5"/>',
  chart: '<path d="M4 3v17h17M8 15l4-5 4 2 5-7"/>',
  award:
    '<circle cx="12" cy="8" r="5"/><path d="m8.5 12-2 9 5.5-3 5.5 3-2-9"/>',
  info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7v.1"/>',
  arrow: '<path d="M4 12h16m-6-6 6 6-6 6"/>',
  external: '<path d="M14 3h7v7m0-7L10 14M10 3H3v18h18v-7"/>',
  sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.5 1.5m11 11L19 19M5 19l1.5-1.5m11-11L19 5"/>',
  moon: '<path d="M21 13A9 9 0 0 1 11 3a9 9 0 1 0 10 10Z"/>',
  book: '<path d="M12 5v16M3 3l9 2 9-2v16l-9 2-9-2Z"/>',
  learn: '<path d="m2 9 10-5 10 5-10 5Zm4 2v6l6 3 6-3v-6M22 9v7"/>',
  quiz: '<circle cx="12" cy="12" r="9"/><path d="m8 12 3 3 5-6"/>',
  volume:
    '<path d="m11 4-6 5H2v6h3l6 5ZM15 8a6 6 0 0 1 0 8m3-11a10 10 0 0 1 0 14"/>',
  stop: '<rect x="5" y="5" width="14" height="14" rx="1"/>',
  share: '<path d="M12 16V2m-5 5 5-5 5 5M5 11H3v11h18V11h-2"/>',
  copy: '<rect x="8" y="8" width="13" height="13" rx="2"/><path d="M16 8V3H3v13h5"/>',
  check: '<path d="m4 12 5 5L20 6"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 6v6l4 2"/>',
  space:
    '<circle cx="12" cy="12" r="5"/><ellipse cx="12" cy="12" rx="11" ry="3" transform="rotate(-30 12 12)"/>',
  biology:
    '<path d="M7 2c0 9 10 11 10 20M17 2C17 11 7 13 7 22M8 5h8M9 9h6m-6 6h6m-7 4h8"/>',
  history: '<path d="m2 8 10-5 10 5ZM4 21h16M5 10v8m7-8v8m7-8v8"/>',
  technology:
    '<rect x="3" y="4" width="18" height="13" rx="2"/><path d="M8 21h8m-4-4v4M7 8l-2 2 2 2m10-4 2 2-2 2"/>',
  earth:
    '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c6 5 6 13 0 18-6-5-6-13 0-18Z"/>',
  physics: '<path d="m13 2-9 12h7l-1 8 10-12h-7Z"/>',
  chemistry:
    '<path d="M9 2h6m-5 0v7L4 19q-1 3 3 3h10q4 0 3-3L14 9V2M7 15h10"/>',
  economics: '<path d="M3 3v18h18M7 15l4-5 4 2 6-7"/>',
  culture:
    '<path d="M12 3c-5 0-9 4-9 9s4 9 9 9h1c2 0 3-2 1-4s0-4 2-4h2c6 0 3-10-6-10Z"/><path d="M7 9h.1M11 6h.1M16 8h.1M6 13h.1"/>',
  sports:
    '<path d="M7 3h10v6a5 5 0 0 1-10 0ZM7 5H3v2a4 4 0 0 0 4 4m10-6h4v2a4 4 0 0 1-4 4m-5 3v5m-4 2h8"/>',
};
export function icon(name, size = 20) {
  return `<svg class="icon" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${paths[name] || paths.explore}</svg>`;
}
export function escapeHTML(value = "") {
  return String(value).replace(
    /[&<>"']/g,
    (char) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        char
      ],
  );
}
