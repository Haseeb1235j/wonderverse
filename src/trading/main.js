// Signal Desk — UI controller. The desk is fully self-contained: live
// market data plus the local analysis engine, with no external service
// in the loop.
import { analyzeLive, fetchLivePrice, scanMarkets } from './engine.js';
import './trading.css';

const els = {
  symbolInput: document.getElementById('symbol-input'),
  tfSelect: document.getElementById('tf-select'),
  rrSelect: document.getElementById('rr-select'),
  analyzeBtn: document.getElementById('analyze-btn'),
  status: document.getElementById('status'),
  error: document.getElementById('error'),
  results: document.getElementById('results'),
  scanBtn: document.getElementById('scan-btn'),
  scanFx: document.getElementById('scan-fx'),
  scanStatus: document.getElementById('scan-status'),
  scanResults: document.getElementById('scan-results'),
  notice: document.getElementById('desk-notice'),
  noticeOk: document.getElementById('notice-ok'),
  noticeSkip: document.getElementById('notice-skip'),
};

const NOTICE_STORAGE = 'signal-desk-notice-dismissed';
let priceTimer = null; // live-price refresh loop for the current result

function updateAnalyzeState() {
  els.analyzeBtn.disabled = !els.symbolInput.value.trim();
}
els.symbolInput.addEventListener('input', updateAnalyzeState);
els.symbolInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && !els.analyzeBtn.disabled) els.analyzeBtn.click();
});

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
  clearError();
  stopPriceLoop();
  els.results.hidden = true;
  els.results.innerHTML = '';
  els.analyzeBtn.disabled = true;
  els.analyzeBtn.classList.add('working');

  try {
    showStatus('Pulling live market data…');
    const analysis = await analyzeLive(els.symbolInput.value, els.tfSelect.value, {
      minRR: Number(els.rrSelect.value) || 2,
    });
    renderResults(analysis);
    showNotice();
  } catch (err) {
    console.error(err);
    showError(err?.message || 'Something went wrong. Please try again.');
  } finally {
    showStatus('');
    els.analyzeBtn.classList.remove('working');
    updateAnalyzeState();
  }
});

// ---------------- Market scanner ----------------
els.scanBtn.addEventListener('click', async () => {
  clearError();
  els.scanBtn.disabled = true;
  els.scanResults.hidden = true;
  els.scanResults.innerHTML = '';
  els.scanStatus.hidden = false;

  try {
    const interval = els.tfSelect.value;
    const scan = await scanMarkets(interval, {
      minRR: Number(els.rrSelect.value) || 2,
      includeFx: els.scanFx.checked,
      onProgress: (done, total) => {
        els.scanStatus.textContent = `Scanning ${total} markets on the ${interval}… ${done}/${total}`;
      },
    });
    renderScan(scan, interval);
  } catch (err) {
    console.error(err);
    showError(err?.message || 'Scan failed. Please try again.');
  } finally {
    els.scanStatus.hidden = true;
    els.scanBtn.disabled = false;
  }
});

// Clicking a scan card loads the full analysis for that market.
els.scanResults.addEventListener('click', (e) => {
  const card = e.target.closest('[data-symbol]');
  if (!card) return;
  els.symbolInput.value = card.dataset.symbol;
  updateAnalyzeState();
  els.analyzeBtn.click();
});

function scanCard(a) {
  const p = a.trade_plan;
  const vClass = a.verdict.toLowerCase();
  return `
    <button type="button" class="scan-card ${vClass}" data-symbol="${esc(a.asset)}">
      <div class="scan-card-head">
        <span class="scan-verdict ${vClass}">${esc(a.verdict)}</span>
        <span class="scan-symbol">${esc(a.asset)}</span>
        <span class="scan-conf">${esc(a.confidence)}%</span>
      </div>
      <div class="scan-price">Price ${fmtPrice(a.live_price)}</div>
      <div class="scan-plan">
        <span>Entry <strong>${esc(String(p.entry).split(' ')[0].replace('~', ''))}</strong></span>
        <span>Stop <strong>${esc(String(p.stop_loss).split(' ')[0])}</strong></span>
        <span>TP1 <strong>${esc(String(p.take_profit_1).split(' ')[0])}</strong></span>
        <span>R:R <strong>${esc(String(p.risk_reward).split(' to')[0].replace(/\s/g, ''))}</strong></span>
      </div>
      <div class="scan-open">Tap for the full analysis →</div>
    </button>`;
}

function nearCard(n) {
  const a = n.analysis, w = n.plan;
  const sClass = w.side.toLowerCase();
  return `
    <button type="button" class="scan-card near ${sClass}" data-symbol="${esc(a.asset)}">
      <div class="scan-card-head">
        <span class="scan-verdict watch ${sClass}">WATCH · ${esc(w.side)}</span>
        <span class="scan-symbol">${esc(a.asset)}</span>
        <span class="scan-conf">${n.distancePct.toFixed(1)}% away</span>
      </div>
      <div class="scan-trigger">${esc(w.trigger)}</div>
      <div class="scan-plan">
        <span>Entry <strong>${esc(w.entry)}</strong></span>
        <span>Stop <strong>${esc(String(w.stop_loss).split(' ')[0])}</strong></span>
        <span>TP1 <strong>${esc(w.take_profit_1)}</strong></span>
        <span>R:R <strong>${esc(String(w.risk_reward).replace(/\s/g, ''))}</strong></span>
      </div>
      <div class="scan-open">Tap for the full analysis →</div>
    </button>`;
}

function renderScan(scan, interval) {
  const readyHtml = scan.ready.length
    ? `<h4 class="scan-section">✅ Ready now — ${scan.ready.length} setup${scan.ready.length > 1 ? 's' : ''} pass every filter</h4>
       <div class="scan-grid">${scan.ready.map(scanCard).join('')}</div>`
    : `<div class="scan-empty">No A+ setups across ${scan.scanned} markets on the ${interval} right now — and that's the honest answer, not a glitch. Forcing trades when the market offers none is how accounts die. The closest setups are below; set alerts at their trigger levels.</div>`;

  const nearHtml = scan.near.length
    ? `<h4 class="scan-section">⏳ Almost ready — closest to triggering</h4>
       <div class="scan-grid">${scan.near.slice(0, 6).map(nearCard).join('')}</div>`
    : '';

  const failNote = scan.scanned < scan.total
    ? `<p class="scan-note">${scan.total - scan.scanned} market${scan.total - scan.scanned > 1 ? 's' : ''} could not be reached and ${scan.total - scan.scanned > 1 ? 'were' : 'was'} skipped.</p>` : '';

  els.scanResults.innerHTML = readyHtml + nearHtml + failNote;
  els.scanResults.hidden = false;
}

// ---------------- Live price refresh ----------------
function stopPriceLoop() {
  if (priceTimer) { clearInterval(priceTimer); priceTimer = null; }
}

function fmtPrice(p) {
  if (p == null || !isFinite(p)) return '—';
  if (p >= 1000) return p.toLocaleString('en-US', { maximumFractionDigits: 0 });
  if (p >= 10) return p.toFixed(2);
  if (p >= 0.1) return p.toFixed(4);
  return p.toPrecision(4);
}

// Keeps the price in the verdict banner ticking after the analysis renders
// (crypto refreshes its quote; other markets show freshness of the pull).
function startPriceLoop(analysis) {
  const instr = analysis.instrument;
  let asOf = analysis.as_of || Date.now();

  const tickAgo = () => {
    const el = document.getElementById('live-price-ago');
    if (!el) { stopPriceLoop(); return; }
    const s = Math.max(0, Math.round((Date.now() - asOf) / 1000));
    el.textContent = s < 5 ? 'live' : `updated ${s}s ago`;
  };
  tickAgo();

  let n = 0;
  priceTimer = setInterval(async () => {
    n += 1;
    tickAgo();
    if (instr && n % 8 === 0) { // every ~8s, refresh the quote itself
      const p = await fetchLivePrice(instr);
      const el = document.getElementById('live-price-value');
      if (!el) { stopPriceLoop(); return; }
      if (p != null) {
        el.textContent = fmtPrice(p);
        asOf = Date.now();
        tickAgo();
      }
    }
  }, 1000);
}

// ---------------- Rendering ----------------
const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
}[c]));

const BIAS_ICON = { bullish: '▲', bearish: '▼', neutral: '◆' };

function planGrid(p) {
  return `
    <div class="plan-grid">
      <div class="plan-item"><span class="plan-label">Entry</span><span class="plan-value">${esc(p.entry)}</span></div>
      <div class="plan-item stop"><span class="plan-label">Stop-Loss</span><span class="plan-value">${esc(p.stop_loss)}</span></div>
      <div class="plan-item tp"><span class="plan-label">Target 1</span><span class="plan-value">${esc(p.take_profit_1)}</span></div>
      <div class="plan-item tp"><span class="plan-label">Target 2</span><span class="plan-value">${esc(p.take_profit_2)}</span></div>
      <div class="plan-item rr"><span class="plan-label">Risk : Reward</span><span class="plan-value">${esc(p.risk_reward)}</span></div>
    </div>`;
}

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

  // Action block: a live trade plan for BUY/SELL, or concrete "here is when
  // you DO trade" triggers for HOLD.
  let action;
  if (a.trade_plan) {
    action = `
      <section class="card plan-card">
        <h3>Trade Plan</h3>
        ${planGrid(a.trade_plan)}
        <p class="plan-note">${esc(a.trade_plan.position_note)}</p>
      </section>`;
  } else if ((a.watch_plan || []).length) {
    action = `
      <section class="card plan-card">
        <h3>No trade yet — here's exactly when to act</h3>
        ${a.watch_plan.map((w) => `
          <div class="watch-trigger ${w.side === 'BUY' ? 'buy' : 'sell'}">
            <div class="watch-head">
              <span class="watch-side">${esc(w.side)}</span>
              <span class="watch-when">${esc(w.trigger)}</span>
            </div>
            ${planGrid(w)}
            <p class="plan-note">${esc(w.note)}</p>
          </div>`).join('')}
      </section>`;
  } else {
    action = `
      <section class="card plan-card hold-note">
        <h3>No Trade</h3>
        <p>The desk is sitting this one out. Cash is a position — wait for a clean setup.</p>
      </section>`;
  }

  const sourceLine = a.source
    ? `<div class="source-line">Data: ${esc(a.source)} · <span id="live-price-ago">live</span></div>` : '';
  const livePrice = a.live_price != null
    ? `<div class="live-price">Price <strong id="live-price-value">${fmtPrice(a.live_price)}</strong></div>` : '';

  els.results.innerHTML = `
    <section class="verdict-banner ${vClass}">
      <div class="verdict-main">
        <span class="verdict-word">${esc(verdict)}</span>
        <span class="verdict-asset">${esc(a.asset)} · ${esc(a.timeframe)}</span>
        ${livePrice}
        ${sourceLine}
      </div>
      <div class="confidence">
        <div class="confidence-label">Confidence <strong>${conf}%</strong></div>
        <div class="confidence-track"><div class="confidence-fill" style="width:${conf}%"></div></div>
        <div class="chart-quality"><span class="tag ${esc(a.market_structure.trend)}">${esc(a.market_structure.trend)}</span> <span class="tag phase">${esc(a.market_structure.phase)}</span></div>
      </div>
    </section>

    <section class="card thesis-card">
      <h3>Thesis</h3>
      <p>${esc(a.summary)}</p>
    </section>

    ${action}

    <div class="detail-grid">
      <details class="card">
        <summary><h3>Key Levels</h3></summary>
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
      </details>

      <details class="card">
        <summary><h3>Technical Read (${(a.technicals || []).length} factors)</h3></summary>
        <div class="table-scroll">
          <table class="tech-table">
            <thead><tr><th>Factor</th><th>Reading</th><th>Bias</th></tr></thead>
            <tbody>${techRows}</tbody>
          </table>
        </div>
      </details>

      <details class="card">
        <summary><h3>Confluences (${(a.confluences || []).length}) &amp; Risks (${(a.risks || []).length})</h3></summary>
        <div class="split-card">
          <div>
            <h4 class="for">For the call</h4>
            <ul>${(a.confluences || []).map((c) => `<li>${esc(c)}</li>`).join('') || '<li>—</li>'}</ul>
          </div>
          <div>
            <h4 class="against">Against / risks</h4>
            <ul>${(a.risks || []).map((r) => `<li>${esc(r)}</li>`).join('') || '<li>—</li>'}</ul>
          </div>
        </div>
      </details>

      <details class="card warn-card">
        <summary><h3>Invalidation &amp; Confirmation</h3></summary>
        <p><strong>Invalidation:</strong> ${esc(a.invalidation)}</p>
        <p><strong>Confirm first:</strong> ${esc(a.higher_timeframe_check)}</p>
        <p><strong>Structure notes:</strong> ${esc(a.market_structure.notes)}</p>
      </details>

      <details class="card reasoning-card">
        <summary><h3>The Desk's Reasoning</h3></summary>
        ${esc(a.verdict_reasoning).split('\n').filter(Boolean).map((p) => `<p>${p}</p>`).join('')}
      </details>
    </div>

    <p class="disclaimer">Educational market analysis — not financial advice. No signal system is 100% accurate; markets carry risk of loss. Always use the stop-loss and never risk more than 1–2% of your account per trade.</p>
  `;
  els.results.hidden = false;
  els.results.scrollIntoView({ behavior: 'smooth', block: 'start' });
  startPriceLoop(a);
}

// ---------------- Post-analysis notice ----------------
function showNotice() {
  if (localStorage.getItem(NOTICE_STORAGE) === '1') return;
  els.notice.hidden = false;
  requestAnimationFrame(() => els.notice.classList.add('open'));
}
function closeNotice(remember) {
  if (remember) localStorage.setItem(NOTICE_STORAGE, '1');
  els.notice.classList.remove('open');
  setTimeout(() => { els.notice.hidden = true; }, 180);
}
els.noticeOk.addEventListener('click', () => closeNotice(false));
els.noticeSkip.addEventListener('click', () => closeNotice(true));
els.notice.addEventListener('click', (e) => { if (e.target === els.notice) closeNotice(false); });

// ---------------- Init ----------------
updateAnalyzeState();
