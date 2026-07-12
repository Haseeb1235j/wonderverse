// Signal Desk — UI controller.
import { analyzeChart, describeError } from './analyst.js';
import './trading.css';

const els = {
  keyInput: document.getElementById('api-key'),
  keySave: document.getElementById('save-key'),
  keyStatus: document.getElementById('key-status'),
  keyToggle: document.getElementById('toggle-key'),
  dropZone: document.getElementById('drop-zone'),
  fileInput: document.getElementById('file-input'),
  preview: document.getElementById('preview'),
  previewImg: document.getElementById('preview-img'),
  clearImage: document.getElementById('clear-image'),
  context: document.getElementById('context-input'),
  analyzeBtn: document.getElementById('analyze-btn'),
  status: document.getElementById('status'),
  error: document.getElementById('error'),
  results: document.getElementById('results'),
};

const KEY_STORAGE = 'signal-desk-api-key';
let image = null; // { base64, mediaType }

// ---------------- API key handling ----------------
function loadKey() {
  const key = localStorage.getItem(KEY_STORAGE) || '';
  els.keyInput.value = key;
  updateKeyStatus(key);
  return key;
}
function updateKeyStatus(key) {
  els.keyStatus.textContent = key ? 'Key saved on this device' : 'No key saved — analysis needs your Anthropic API key';
  els.keyStatus.classList.toggle('ok', Boolean(key));
}
els.keySave.addEventListener('click', () => {
  const key = els.keyInput.value.trim();
  if (key) localStorage.setItem(KEY_STORAGE, key);
  else localStorage.removeItem(KEY_STORAGE);
  updateKeyStatus(key);
});
els.keyToggle.addEventListener('click', () => {
  const hidden = els.keyInput.type === 'password';
  els.keyInput.type = hidden ? 'text' : 'password';
  els.keyToggle.textContent = hidden ? 'Hide' : 'Show';
});

// ---------------- Image intake (click / drag / paste) ----------------
const ACCEPTED = ['image/png', 'image/jpeg', 'image/webp', 'image/gif'];

function setImageFromFile(file) {
  if (!file || !ACCEPTED.includes(file.type)) {
    showError('Please use a PNG, JPEG, WEBP, or GIF screenshot.');
    return;
  }
  if (file.size > 20 * 1024 * 1024) {
    showError('Image is too large (max 20 MB). Take a tighter screenshot.');
    return;
  }
  const reader = new FileReader();
  reader.onload = () => {
    const dataUrl = reader.result;
    image = { base64: dataUrl.split(',')[1], mediaType: file.type };
    els.previewImg.src = dataUrl;
    els.preview.hidden = false;
    els.dropZone.classList.add('has-image');
    clearError();
    updateAnalyzeState();
  };
  reader.readAsDataURL(file);
}

els.dropZone.addEventListener('click', () => els.fileInput.click());
els.fileInput.addEventListener('change', () => setImageFromFile(els.fileInput.files[0]));

['dragover', 'dragenter'].forEach((evt) =>
  els.dropZone.addEventListener(evt, (e) => { e.preventDefault(); els.dropZone.classList.add('dragging'); }));
['dragleave', 'drop'].forEach((evt) =>
  els.dropZone.addEventListener(evt, (e) => { e.preventDefault(); els.dropZone.classList.remove('dragging'); }));
els.dropZone.addEventListener('drop', (e) => setImageFromFile(e.dataTransfer.files[0]));

document.addEventListener('paste', (e) => {
  const item = [...(e.clipboardData?.items || [])].find((i) => i.type.startsWith('image/'));
  if (item) setImageFromFile(item.getAsFile());
});

els.clearImage.addEventListener('click', (e) => {
  e.stopPropagation();
  image = null;
  els.preview.hidden = true;
  els.previewImg.src = '';
  els.fileInput.value = '';
  els.dropZone.classList.remove('has-image');
  updateAnalyzeState();
});

function updateAnalyzeState() {
  els.analyzeBtn.disabled = !image;
}

// ---------------- Status / errors ----------------
function showStatus(text) {
  els.status.textContent = text;
  els.status.hidden = !text;
}
function showError(text) {
  els.error.textContent = text;
  els.error.hidden = false;
}
function clearError() {
  els.error.hidden = true;
}

// ---------------- Analysis ----------------
els.analyzeBtn.addEventListener('click', async () => {
  const apiKey = els.keyInput.value.trim() || localStorage.getItem(KEY_STORAGE);
  if (!apiKey) {
    showError('Add your Anthropic API key in Settings first (get one at console.anthropic.com).');
    return;
  }
  if (!image) return;

  clearError();
  els.results.hidden = true;
  els.results.innerHTML = '';
  els.analyzeBtn.disabled = true;
  els.analyzeBtn.classList.add('working');
  showStatus('Sending the chart to the desk…');

  try {
    const analysis = await analyzeChart({
      apiKey,
      imageBase64: image.base64,
      mediaType: image.mediaType,
      context: els.context.value,
      onStatus: showStatus,
    });
    renderResults(analysis);
  } catch (err) {
    console.error(err);
    showError(describeError(err));
  } finally {
    showStatus('');
    els.analyzeBtn.classList.remove('working');
    updateAnalyzeState();
  }
});

// ---------------- Rendering ----------------
const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
}[c]));

const BIAS_ICON = { bullish: '▲', bearish: '▼', neutral: '◆' };

function renderResults(a) {
  const verdict = a.verdict;
  const vClass = verdict.toLowerCase();
  const conf = Math.max(0, Math.min(100, Number(a.confidence) || 0));

  const techRows = (a.technicals || []).map((t) => `
    <tr>
      <td>${esc(t.factor)}</td>
      <td>${esc(t.reading)}</td>
      <td class="bias ${esc(t.bias)}">${BIAS_ICON[t.bias] || ''} ${esc(t.bias)}</td>
    </tr>`).join('');

  const plan = a.trade_plan ? `
    <section class="card plan-card">
      <h3>Trade Plan</h3>
      <div class="plan-grid">
        <div class="plan-item"><span class="plan-label">Entry</span><span class="plan-value">${esc(a.trade_plan.entry)}</span></div>
        <div class="plan-item stop"><span class="plan-label">Stop-Loss</span><span class="plan-value">${esc(a.trade_plan.stop_loss)}</span></div>
        <div class="plan-item tp"><span class="plan-label">Target 1</span><span class="plan-value">${esc(a.trade_plan.take_profit_1)}</span></div>
        <div class="plan-item tp"><span class="plan-label">Target 2</span><span class="plan-value">${esc(a.trade_plan.take_profit_2)}</span></div>
        <div class="plan-item rr"><span class="plan-label">Reward : Risk</span><span class="plan-value">${esc(a.trade_plan.risk_reward)}</span></div>
      </div>
      <p class="plan-note">${esc(a.trade_plan.position_note)}</p>
    </section>` : `
    <section class="card plan-card hold-note">
      <h3>No Trade</h3>
      <p>The desk is sitting this one out. Cash is a position — wait for the setup described below.</p>
    </section>`;

  els.results.innerHTML = `
    <section class="verdict-banner ${vClass}">
      <div class="verdict-main">
        <span class="verdict-word">${esc(verdict)}</span>
        <span class="verdict-asset">${esc(a.asset)} · ${esc(a.timeframe)}</span>
      </div>
      <div class="confidence">
        <div class="confidence-label">Confidence <strong>${conf}%</strong></div>
        <div class="confidence-track"><div class="confidence-fill" style="width:${conf}%"></div></div>
        <div class="chart-quality">Chart quality: ${esc(a.chart_quality)}</div>
      </div>
    </section>

    <section class="card">
      <h3>Thesis</h3>
      <p>${esc(a.summary)}</p>
    </section>

    ${plan}

    <section class="card">
      <h3>Market Structure</h3>
      <p><span class="tag ${esc(a.market_structure.trend)}">${esc(a.market_structure.trend)}</span>
         <span class="tag phase">${esc(a.market_structure.phase)}</span></p>
      <p>${esc(a.market_structure.notes)}</p>
    </section>

    <section class="card levels-card">
      <h3>Key Levels</h3>
      <div class="levels-grid">
        <div>
          <h4 class="res">Resistance</h4>
          <ul>${(a.key_levels.resistances || []).map((l) => `<li>${esc(l)}</li>`).join('') || '<li>—</li>'}</ul>
        </div>
        <div>
          <h4 class="sup">Support</h4>
          <ul>${(a.key_levels.supports || []).map((l) => `<li>${esc(l)}</li>`).join('') || '<li>—</li>'}</ul>
        </div>
      </div>
    </section>

    <section class="card">
      <h3>Technical Read</h3>
      <table class="tech-table">
        <thead><tr><th>Factor</th><th>Reading</th><th>Bias</th></tr></thead>
        <tbody>${techRows}</tbody>
      </table>
    </section>

    <section class="card split-card">
      <div>
        <h3 class="for">Confluences (${(a.confluences || []).length})</h3>
        <ul>${(a.confluences || []).map((c) => `<li>${esc(c)}</li>`).join('')}</ul>
      </div>
      <div>
        <h3 class="against">Risks &amp; Counter-case</h3>
        <ul>${(a.risks || []).map((r) => `<li>${esc(r)}</li>`).join('')}</ul>
      </div>
    </section>

    <section class="card warn-card">
      <h3>Invalidation</h3>
      <p>${esc(a.invalidation)}</p>
      <h3>Confirm Before Acting</h3>
      <p>${esc(a.higher_timeframe_check)}</p>
    </section>

    <section class="card reasoning-card">
      <h3>The Desk's Reasoning</h3>
      ${esc(a.verdict_reasoning).split('\n').filter(Boolean).map((p) => `<p>${p}</p>`).join('')}
    </section>

    <p class="disclaimer">Educational analysis of a single chart screenshot — not financial advice. No signal system is 100% accurate; markets carry risk of loss. Always use the stop-loss and never risk more than 1–2% of your account per trade.</p>
  `;
  els.results.hidden = false;
  els.results.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// ---------------- Init ----------------
loadKey();
updateAnalyzeState();
