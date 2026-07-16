// Signal Desk — free technical-analysis engine (no API key required).
// Fetches live OHLCV candles and runs a disciplined rule-based analysis:
// trend structure, key levels, momentum, confluence scoring, and a
// risk-managed trade plan. Produces the same result shape as the AI analyst
// so the UI renderer is shared.
//
// Markets covered:
//  - Crypto  → Binance public market-data API (real-time, CORS enabled).
//              Coins not listed on Binance fall back to Yahoo Finance.
//  - Forex / gold / silver → Yahoo Finance chart API (fetched through
//              public CORS relays because Yahoo does not send CORS headers).

const BINANCE_HOSTS = [
  'https://data-api.binance.vision', // public market-data mirror (CORS enabled)
  'https://api.binance.com',
];

export const TIMEFRAMES = ['15m', '1h', '4h', '1d', '1w'];

const HIGHER_TF = { '15m': '1h', '1h': '4h', '4h': '1d', '1d': '1w', '1w': '1M' };

// ---------------- instrument resolution ----------------
const FX_CODES = new Set([
  'USD', 'EUR', 'GBP', 'JPY', 'AUD', 'NZD', 'CAD', 'CHF', 'SGD', 'HKD',
  'SEK', 'NOK', 'DKK', 'MXN', 'ZAR', 'TRY', 'PLN', 'INR', 'CNH', 'CNY', 'THB',
]);
const METAL_CODES = new Set(['XAU', 'XAG']);
const ALIASES = {
  GOLD: 'XAUUSD', SILVER: 'XAGUSD', BITCOIN: 'BTC', ETHEREUM: 'ETH',
  SOLANA: 'SOL', DOGE: 'DOGE', DOGECOIN: 'DOGE', RIPPLE: 'XRP', CARDANO: 'ADA',
};

// Turns whatever the user typed ("btc", "ETH/USD", "eur usd", "gold",
// "GBPJPY") into a resolved instrument the fetch layer understands.
export function resolveInstrument(input) {
  let s = String(input || '').toUpperCase().replace(/[^A-Z0-9]/g, '');
  if (!s) return null;
  s = ALIASES[s] || s;

  // Forex / metals: two recognized 3-letter codes back to back (EURUSD,
  // GBPJPY, XAUUSD…). Checked before crypto so "EURUSD" never becomes a
  // bogus Binance pair.
  if (s.length === 6) {
    const base = s.slice(0, 3), quote = s.slice(3);
    const baseOk = FX_CODES.has(base) || METAL_CODES.has(base);
    if (baseOk && FX_CODES.has(quote) && !(base === 'USD' && quote === 'USD')) {
      return {
        market: METAL_CODES.has(base) ? 'metal' : 'forex',
        display: `${base}/${quote}`,
        yahoo: [`${s}=X`, ...(s === 'XAUUSD' ? ['GC=F'] : s === 'XAGUSD' ? ['SI=F'] : [])],
      };
    }
  }
  // Bare fiat code ("EUR") → against USD
  if (s.length === 3 && FX_CODES.has(s) && s !== 'USD') {
    return { market: 'forex', display: `${s}/USD`, yahoo: [`${s}USD=X`] };
  }
  if (s.length === 3 && METAL_CODES.has(s)) {
    return { market: 'metal', display: `${s}/USD`, yahoo: [`${s}USD=X`, s === 'XAU' ? 'GC=F' : 'SI=F'] };
  }

  // Crypto. Normalize any quote spelling to a Binance USDT pair, and keep a
  // Yahoo fallback for coins Binance doesn't list.
  let base = s;
  for (const q of ['USDT', 'USDC', 'FDUSD', 'USD', 'PERP']) {
    if (base.endsWith(q) && base.length > q.length) { base = base.slice(0, -q.length); break; }
  }
  // Explicit non-USD crypto cross (ETHBTC…): pass through to Binance as-is.
  const crossQuotes = ['BTC', 'ETH', 'BNB', 'EUR', 'TRY'];
  const cross = crossQuotes.find((q) => s.endsWith(q) && s.length > q.length);
  if (cross && !FX_CODES.has(s.slice(0, s.length - cross.length))) {
    return { market: 'crypto', display: s, binance: s, yahoo: [] };
  }
  return {
    market: 'crypto',
    display: `${base}/USDT`,
    binance: `${base}USDT`,
    yahoo: [`${base}-USD`],
  };
}

// Back-compat export used by tests.
export function normalizeSymbol(input) {
  const r = resolveInstrument(input);
  return r ? (r.binance || r.yahoo[0] || '') : '';
}

// ---------------- data layer ----------------
// fetch with a hard timeout so one dead host/relay can't stall a scan.
function fetchT(url, ms = 10000) {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), ms);
  return fetch(url, { signal: ctrl.signal }).finally(() => clearTimeout(timer));
}

async function fetchBinance(symbol, interval, limit = 400) {
  let lastErr;
  for (const host of BINANCE_HOSTS) {
    try {
      // Klines + live ticker in parallel — the last kline is the currently
      // forming candle, and the ticker stamps it with the latest trade so
      // the analysis runs on to-the-second data.
      const [klRes, tkRes] = await Promise.all([
        fetchT(`${host}/api/v3/klines?symbol=${symbol}&interval=${interval}&limit=${limit}`, 8000),
        fetchT(`${host}/api/v3/ticker/price?symbol=${symbol}`, 8000).catch(() => null),
      ]);
      if (klRes.status === 400) throw Object.assign(new Error('not-listed'), { notListed: true });
      if (!klRes.ok) throw new Error(`Market data request failed (${klRes.status})`);
      const rows = await klRes.json();
      if (!Array.isArray(rows) || rows.length < 60) {
        throw Object.assign(new Error('Not enough price history for this pair/timeframe.'), { fatal: true });
      }
      const candles = rows.map((r) => ({
        time: r[0], open: +r[1], high: +r[2], low: +r[3], close: +r[4], volume: +r[5],
      }));
      if (tkRes && tkRes.ok) {
        const tick = await tkRes.json();
        const live = +tick.price;
        if (isFinite(live) && live > 0) {
          const last = candles[candles.length - 1];
          last.close = live;
          last.high = Math.max(last.high, live);
          last.low = Math.min(last.low, live);
        }
      }
      return { candles, source: 'Binance (live)' };
    } catch (e) {
      if (e.fatal || e.notListed) throw e;
      lastErr = e;
    }
  }
  throw new Error(`Could not reach Binance market data (${lastErr?.message || 'network error'}).`);
}

// Yahoo's chart API has no CORS headers, so browser calls go through public
// relays. Several are tried in order — any one working is enough.
const CORS_RELAYS = [
  (u) => `https://api.allorigins.win/raw?url=${encodeURIComponent(u)}`,
  (u) => `https://corsproxy.io/?url=${encodeURIComponent(u)}`,
  (u) => `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(u)}`,
];

const YAHOO_INTERVALS = {
  '15m': { interval: '15m', range: '20d' },
  '1h': { interval: '60m', range: '60d' },
  '4h': { interval: '60m', range: '180d', bucket: 4 * 3600 * 1000 },
  '1d': { interval: '1d', range: '2y' },
  '1w': { interval: '1wk', range: '10y' },
};

function aggregate(candles, bucketMs) {
  const out = [];
  for (const c of candles) {
    const t = Math.floor(c.time / bucketMs) * bucketMs;
    const last = out[out.length - 1];
    if (last && last.time === t) {
      last.high = Math.max(last.high, c.high);
      last.low = Math.min(last.low, c.low);
      last.close = c.close;
      last.volume += c.volume;
    } else {
      out.push({ time: t, open: c.open, high: c.high, low: c.low, close: c.close, volume: c.volume });
    }
  }
  return out;
}

async function fetchYahoo(symbols, interval) {
  const cfg = YAHOO_INTERVALS[interval];
  let lastErr;
  for (const sym of symbols) {
    // cb busts relay-side caches so quotes stay fresh.
    const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(sym)}?interval=${cfg.interval}&range=${cfg.range}&includePrePost=false&cb=${Date.now()}`;
    for (const relay of CORS_RELAYS) {
      try {
        const res = await fetchT(relay(url), 12000);
        if (!res.ok) throw new Error(`relay ${res.status}`);
        const data = await res.json();
        const result = data?.chart?.result?.[0];
        if (!result) { lastErr = new Error(data?.chart?.error?.description || 'symbol not found'); break; }
        const ts = result.timestamp || [];
        const q = result.indicators?.quote?.[0] || {};
        let candles = [];
        for (let i = 0; i < ts.length; i++) {
          if (q.close?.[i] == null || q.open?.[i] == null) continue;
          candles.push({
            time: ts[i] * 1000,
            open: q.open[i], high: q.high[i], low: q.low[i], close: q.close[i],
            volume: q.volume?.[i] || 0,
          });
        }
        if (cfg.bucket) candles = aggregate(candles, cfg.bucket);
        candles = candles.slice(-400);
        if (candles.length < 60) throw new Error('not enough history');
        const live = result.meta?.regularMarketPrice;
        if (isFinite(live) && live > 0) {
          const last = candles[candles.length - 1];
          last.close = live;
          last.high = Math.max(last.high, live);
          last.low = Math.min(last.low, live);
        }
        return { candles, source: 'Yahoo Finance' };
      } catch (e) {
        lastErr = e;
      }
    }
  }
  throw new Error(`Could not load market data for this symbol (${lastErr?.message || 'network error'}). Check the symbol and try again.`);
}

async function fetchCandles(instr, interval) {
  if (instr.market === 'crypto' && instr.binance) {
    try {
      return await fetchBinance(instr.binance, interval);
    } catch (e) {
      if (!e.notListed || !instr.yahoo.length) {
        if (e.notListed) {
          throw new Error(`"${instr.display}" isn't listed on Binance. Try the full pair, e.g. BTCUSDT, ETHUSDT, or a forex pair like EURUSD.`);
        }
        throw e;
      }
      return fetchYahoo(instr.yahoo, interval); // coin not on Binance → Yahoo
    }
  }
  return fetchYahoo(instr.yahoo, interval);
}

// Lightweight live-quote lookup used by the UI to keep the shown price
// fresh after the analysis has rendered.
export async function fetchLivePrice(instr) {
  if (instr.market === 'crypto' && instr.binance) {
    for (const host of BINANCE_HOSTS) {
      try {
        const res = await fetchT(`${host}/api/v3/ticker/price?symbol=${instr.binance}`, 6000);
        if (!res.ok) continue;
        const p = +(await res.json()).price;
        if (isFinite(p) && p > 0) return p;
      } catch { /* try next host */ }
    }
  }
  return null; // forex relies on the analysis timestamp + manual refresh
}

// ---------------- indicator math ----------------
function ema(values, period) {
  const k = 2 / (period + 1);
  const out = new Array(values.length).fill(null);
  if (values.length < period) return out;
  let prev = values.slice(0, period).reduce((a, b) => a + b, 0) / period;
  out[period - 1] = prev;
  for (let i = period; i < values.length; i++) {
    prev = values[i] * k + prev * (1 - k);
    out[i] = prev;
  }
  return out;
}

function sma(values, period) {
  const out = new Array(values.length).fill(null);
  let sum = 0;
  for (let i = 0; i < values.length; i++) {
    sum += values[i];
    if (i >= period) sum -= values[i - period];
    if (i >= period - 1) out[i] = sum / period;
  }
  return out;
}

function rsi(closes, period = 14) {
  const out = new Array(closes.length).fill(null);
  let gain = 0, loss = 0;
  for (let i = 1; i <= period; i++) {
    const d = closes[i] - closes[i - 1];
    if (d >= 0) gain += d; else loss -= d;
  }
  let avgGain = gain / period, avgLoss = loss / period;
  out[period] = avgLoss === 0 ? 100 : 100 - 100 / (1 + avgGain / avgLoss);
  for (let i = period + 1; i < closes.length; i++) {
    const d = closes[i] - closes[i - 1];
    avgGain = (avgGain * (period - 1) + Math.max(d, 0)) / period;
    avgLoss = (avgLoss * (period - 1) + Math.max(-d, 0)) / period;
    out[i] = avgLoss === 0 ? 100 : 100 - 100 / (1 + avgGain / avgLoss);
  }
  return out;
}

function macd(closes, fast = 12, slow = 26, signal = 9) {
  const emaFast = ema(closes, fast);
  const emaSlow = ema(closes, slow);
  const line = closes.map((_, i) => (emaFast[i] != null && emaSlow[i] != null ? emaFast[i] - emaSlow[i] : null));
  const valid = line.filter((v) => v != null);
  const sigValid = ema(valid, signal);
  const sig = new Array(line.length).fill(null);
  let j = 0;
  for (let i = 0; i < line.length; i++) if (line[i] != null) sig[i] = sigValid[j++] ?? null;
  const hist = line.map((v, i) => (v != null && sig[i] != null ? v - sig[i] : null));
  return { line, signal: sig, hist };
}

function atr(candles, period = 14) {
  const trs = candles.map((c, i) => {
    if (i === 0) return c.high - c.low;
    const prev = candles[i - 1].close;
    return Math.max(c.high - c.low, Math.abs(c.high - prev), Math.abs(c.low - prev));
  });
  return sma(trs, period);
}

// Swing pivots (fractal with k neighbors on each side). Adjacent bars of a
// flat-topped swing can all qualify, so pivots within 2k bars of each other
// are merged into one swing point (keeping the extreme).
function pivots(candles, k = 3) {
  const highs = [], lows = [];
  for (let i = k; i < candles.length - k; i++) {
    let isHigh = true, isLow = true;
    for (let j = i - k; j <= i + k; j++) {
      if (candles[j].high > candles[i].high) isHigh = false;
      if (candles[j].low < candles[i].low) isLow = false;
    }
    if (isHigh) {
      const last = highs[highs.length - 1];
      if (last && i - last.i <= 2 * k) { if (candles[i].high > last.price) { last.i = i; last.price = candles[i].high; } }
      else highs.push({ i, price: candles[i].high });
    }
    if (isLow) {
      const last = lows[lows.length - 1];
      if (last && i - last.i <= 2 * k) { if (candles[i].low < last.price) { last.i = i; last.price = candles[i].low; } }
      else lows.push({ i, price: candles[i].low });
    }
  }
  return { highs, lows };
}

// Cluster pivot prices into zones; count touches for strength.
function levelZones(points, tolerance) {
  const zones = [];
  for (const p of points) {
    const zone = zones.find((z) => Math.abs(z.price - p.price) <= tolerance);
    if (zone) {
      zone.touches += 1;
      zone.price = (zone.price * (zone.touches - 1) + p.price) / zone.touches;
      zone.lastIndex = Math.max(zone.lastIndex, p.i);
    } else {
      zones.push({ price: p.price, touches: 1, lastIndex: p.i });
    }
  }
  return zones.sort((a, b) => b.touches - a.touches || b.lastIndex - a.lastIndex);
}

export function fmt(price) {
  if (!isFinite(price)) return '—';
  if (price >= 1000) return price.toLocaleString('en-US', { maximumFractionDigits: 0 });
  if (price >= 10) return price.toFixed(2);
  if (price >= 0.1) return price.toFixed(4);
  return price.toPrecision(4);
}

// ---------------- the analysis ----------------
export async function analyzeLive(symbolInput, interval, { minRR = 2 } = {}) {
  const instr = resolveInstrument(symbolInput);
  if (!instr) throw new Error('Enter a symbol — e.g. BTC, ETHUSDT, EURUSD, GBPJPY, GOLD.');
  const { candles, source } = await fetchCandles(instr, interval);
  const analysis = buildAnalysis(instr.display, interval, candles, { minRR });
  analysis.source = source;
  analysis.as_of = Date.now();
  analysis.instrument = instr;
  return analysis;
}

// ---------------- market scanner ----------------
// The scanner sweeps a watchlist with the exact same engine and discipline
// as a single analysis — it never loosens the rules to manufacture signals.
export const SCAN_CRYPTO = [
  'BTC', 'ETH', 'BNB', 'SOL', 'XRP', 'DOGE', 'ADA', 'AVAX', 'LINK', 'DOT',
  'LTC', 'TRX', 'ATOM', 'UNI', 'NEAR', 'APT', 'ARB', 'OP', 'SUI', 'PEPE',
  'SHIB', 'TON', 'BCH', 'FIL',
];
export const SCAN_FX = [
  'EURUSD', 'GBPUSD', 'USDJPY', 'AUDUSD', 'USDCAD', 'USDCHF', 'NZDUSD',
  'GBPJPY', 'EURJPY', 'XAUUSD',
];

async function pool(items, worker, size) {
  const queue = items.map((item, i) => [i, item]);
  const out = new Array(items.length);
  await Promise.all(Array.from({ length: Math.min(size, items.length) }, async () => {
    while (queue.length) {
      const [i, item] = queue.shift();
      out[i] = await worker(item);
    }
  }));
  return out;
}

const parsePrice = (s) => parseFloat(String(s).replace(/,/g, ''));

export async function scanMarkets(interval, { includeFx = true, onProgress, minRR = 2 } = {}) {
  const targets = [...SCAN_CRYPTO, ...(includeFx ? SCAN_FX : [])];
  let done = 0;
  const settled = await pool(targets, async (sym) => {
    try {
      return await analyzeLive(sym, interval, { minRR });
    } catch {
      return null; // one dead market must not sink the scan
    } finally {
      done += 1;
      onProgress?.(done, targets.length);
    }
  }, 8);

  const analyses = settled.filter(Boolean);
  const ready = analyses
    .filter((a) => a.verdict !== 'HOLD' && a.trade_plan)
    .sort((x, y) => y.confidence - x.confidence);

  // "Almost ready": HOLDs whose nearest watch trigger sits close to the
  // current price, ranked by how close the trigger is (in %).
  const near = analyses
    .filter((a) => a.verdict === 'HOLD' && (a.watch_plan || []).length && a.live_price > 0)
    .map((a) => {
      const best = a.watch_plan
        .map((w) => ({ w, dist: Math.abs(parsePrice(w.entry) - a.live_price) / a.live_price * 100 }))
        .filter((x) => isFinite(x.dist))
        .sort((x, y) => x.dist - y.dist)[0];
      return best ? { analysis: a, plan: best.w, distancePct: best.dist } : null;
    })
    .filter(Boolean)
    .sort((x, y) => x.distancePct - y.distancePct);

  return { ready, near, scanned: analyses.length, total: targets.length };
}

// minRR is the user's minimum risk-to-reward: 2 means only 1:2 or better
// setups are allowed, 3 means 1:3+, and so on. R:R is always shown in the
// trader-standard "1 : X" (risk : reward) notation.
export function buildAnalysis(symbol, interval, candles, { minRR = 2 } = {}) {
  const closes = candles.map((c) => c.close);
  const vols = candles.map((c) => c.volume);
  const n = candles.length - 1;
  const price = closes[n];

  const ema20 = ema(closes, 20), ema50 = ema(closes, 50), ema200 = ema(closes, 200);
  const rsi14 = rsi(closes, 14);
  const { line: macdLine, signal: macdSig, hist: macdHist } = macd(closes);
  const atr14 = atr(candles, 14);
  const volSma = sma(vols, 20);

  const a = atr14[n] || (price * 0.01);
  const { highs, lows } = pivots(candles);

  // ---- structure: compare the last two confirmed swing highs and lows ----
  const lastHighs = highs.slice(-2), lastLows = lows.slice(-2);
  let structureTrend = 'range';
  let structureNote = 'Not enough confirmed swings to define structure.';
  if (lastHighs.length === 2 && lastLows.length === 2) {
    const hh = lastHighs[1].price > lastHighs[0].price;
    const hl = lastLows[1].price > lastLows[0].price;
    const lh = lastHighs[1].price < lastHighs[0].price;
    const ll = lastLows[1].price < lastLows[0].price;
    if (hh && hl) { structureTrend = 'uptrend'; structureNote = `Higher high (${fmt(lastHighs[1].price)} > ${fmt(lastHighs[0].price)}) and higher low (${fmt(lastLows[1].price)} > ${fmt(lastLows[0].price)}).`; }
    else if (lh && ll) { structureTrend = 'downtrend'; structureNote = `Lower high (${fmt(lastHighs[1].price)} < ${fmt(lastHighs[0].price)}) and lower low (${fmt(lastLows[1].price)} < ${fmt(lastLows[0].price)}).`; }
    else { structureTrend = 'range'; structureNote = `Mixed swings — highs ${hh ? 'rising' : 'falling'}, lows ${hl ? 'rising' : 'falling'}: no clean trend structure.`; }
  }
  // EMA alignment refines/overrides ambiguous structure
  const emaBull = ema20[n] > ema50[n] && price > ema200[n];
  const emaBear = ema20[n] < ema50[n] && price < ema200[n];
  if (structureTrend === 'range' && emaBull) structureTrend = 'transition';
  if (structureTrend === 'range' && emaBear) structureTrend = 'transition';

  // ---- key levels ----
  const tol = a * 0.75;
  const resistanceZones = levelZones(highs.filter((p) => p.price > price), tol).slice(0, 3);
  const supportZones = levelZones(lows.filter((p) => p.price < price), tol).slice(0, 3);
  const nearestSup = supportZones.slice().sort((x, y) => y.price - x.price)[0] || null;
  const nearestRes = resistanceZones.slice().sort((x, y) => x.price - y.price)[0] || null;

  const nearSupport = nearestSup && (price - nearestSup.price) <= 1.5 * a;
  const nearResistance = nearestRes && (nearestRes.price - price) <= 1.5 * a;

  // ---- factor scoring ----
  const technicals = [];
  let score = 0;
  const add = (factor, reading, bias, weight = 1) => {
    technicals.push({ factor, reading, bias });
    score += bias === 'bullish' ? weight : bias === 'bearish' ? -weight : 0;
  };

  add('Market structure', structureNote,
    structureTrend === 'uptrend' ? 'bullish' : structureTrend === 'downtrend' ? 'bearish' : 'neutral', 2);

  add('Price vs EMA 200', ema200[n] != null
    ? `Price ${fmt(price)} is ${price > ema200[n] ? 'above' : 'below'} the 200-EMA (${fmt(ema200[n])}).`
    : 'Not enough history for the 200-EMA.',
  ema200[n] == null ? 'neutral' : price > ema200[n] ? 'bullish' : 'bearish');

  add('EMA 20/50 alignment', `EMA20 ${fmt(ema20[n])} vs EMA50 ${fmt(ema50[n])} — ${ema20[n] > ema50[n] ? 'bullish stack' : 'bearish stack'}.`,
    ema20[n] > ema50[n] ? 'bullish' : 'bearish');

  const r = rsi14[n];
  add('RSI (14)', `RSI at ${r.toFixed(1)}${r > 70 ? ' — overbought zone' : r < 30 ? ' — oversold zone' : ''}.`,
    r > 70 ? 'bearish' : r < 30 ? 'bullish' : r >= 55 ? 'bullish' : r <= 45 ? 'bearish' : 'neutral');

  const mBull = macdLine[n] != null && macdLine[n] > macdSig[n];
  const histRising = macdHist[n] != null && macdHist[n - 1] != null && macdHist[n] > macdHist[n - 1];
  add('MACD (12,26,9)', `MACD line ${mBull ? 'above' : 'below'} signal; histogram ${histRising ? 'rising' : 'falling'}.`,
    mBull && histRising ? 'bullish' : !mBull && !histRising ? 'bearish' : 'neutral');

  const volNow = vols[n], volAvg = volSma[n] || volNow;
  const lastBull = closes[n] >= candles[n].open;
  const hasVolume = volAvg > 0;
  add('Volume', hasVolume
    ? `Current volume ${(volNow / volAvg).toFixed(2)}x the 20-bar average on a ${lastBull ? 'green' : 'red'} candle.`
    : 'No volume data for this market (typical for spot forex).',
  hasVolume && volNow > 1.2 * volAvg ? (lastBull ? 'bullish' : 'bearish') : 'neutral');

  add('Location vs levels',
    nearSupport ? `Price is within 1.5×ATR of support ${fmt(nearestSup.price)} (${nearestSup.touches} touches).`
      : nearResistance ? `Price is within 1.5×ATR of resistance ${fmt(nearestRes.price)} (${nearestRes.touches} touches).`
        : 'Price is mid-range — not at a meaningful level.',
    nearSupport ? 'bullish' : nearResistance ? 'bearish' : 'neutral');

  // last-3-candle momentum
  const mom3 = closes[n] - closes[n - 3];
  add('Short-term momentum', `Last 3 candles net ${mom3 >= 0 ? '+' : ''}${fmt(mom3)} (${((mom3 / closes[n - 3]) * 100).toFixed(2)}%).`,
    Math.abs(mom3) < 0.3 * a ? 'neutral' : mom3 > 0 ? 'bullish' : 'bearish');

  // ---- verdict ----
  const bullFactors = technicals.filter((t) => t.bias === 'bullish').length;
  const bearFactors = technicals.filter((t) => t.bias === 'bearish').length;

  let verdict = 'HOLD';
  if (score >= 3 && bullFactors >= 3 && structureTrend !== 'downtrend' && !nearResistance) verdict = 'BUY';
  else if (score <= -3 && bearFactors >= 3 && structureTrend !== 'uptrend' && !nearSupport) verdict = 'SELL';

  // ---- trade plan gated by the user's minimum risk-to-reward (1:minRR) ----
  let tradePlan = null;
  let rrNote = '';
  if (verdict === 'BUY') {
    // Stop goes below the nearest support only when that support is close
    // enough to be this trade's invalidation; otherwise a 1.5×ATR swing stop.
    const supUsable = nearestSup && (price - nearestSup.price) <= 3 * a;
    const stop = supUsable ? nearestSup.price - 0.5 * a : price - 1.5 * a;
    const risk = price - stop;
    const tp1 = nearestRes ? nearestRes.price : price + Math.max(3 * a, (minRR + 0.2) * risk);
    const tp2 = resistanceZones.slice().sort((x, y) => x.price - y.price)[1]?.price ?? tp1 + 2 * a;
    const rr = (tp1 - price) / risk;
    if (rr >= minRR) {
      tradePlan = {
        entry: `~${fmt(price)} (current price) or on a pullback toward ${nearestSup ? fmt(nearestSup.price) : 'support'}`,
        stop_loss: `${fmt(stop)} — ${supUsable ? 'below the nearest support zone minus half an ATR' : '1.5×ATR swing stop below entry'}`,
        take_profit_1: `${fmt(tp1)} — nearest resistance zone`,
        take_profit_2: `${fmt(tp2)} — next resistance / measured extension`,
        risk_reward: `1 : ${rr.toFixed(1)} to TP1`,
        rr,
        position_note: 'Risk no more than 1–2% of your account between entry and stop. Take partial profit at TP1 and move the stop to break-even.',
      };
    } else {
      verdict = 'HOLD';
      rrNote = `A long setup exists but risk-to-reward to the nearest resistance is only 1:${rr.toFixed(1)} — below your 1:${minRR} minimum. Wait for a pullback toward ${nearestSup ? fmt(nearestSup.price) : 'support'} to improve the entry.`;
    }
  } else if (verdict === 'SELL') {
    const resUsable = nearestRes && (nearestRes.price - price) <= 3 * a;
    const stop = resUsable ? nearestRes.price + 0.5 * a : price + 1.5 * a;
    const risk = stop - price;
    const tp1 = nearestSup ? nearestSup.price : price - Math.max(3 * a, (minRR + 0.2) * risk);
    const tp2 = supportZones.slice().sort((x, y) => y.price - x.price)[1]?.price ?? tp1 - 2 * a;
    const rr = (price - tp1) / risk;
    if (rr >= minRR) {
      tradePlan = {
        entry: `~${fmt(price)} (current price) or on a bounce toward ${nearestRes ? fmt(nearestRes.price) : 'resistance'}`,
        stop_loss: `${fmt(stop)} — ${resUsable ? 'above the nearest resistance zone plus half an ATR' : '1.5×ATR swing stop above entry'}`,
        take_profit_1: `${fmt(tp1)} — nearest support zone`,
        take_profit_2: `${fmt(tp2)} — next support / measured extension`,
        risk_reward: `1 : ${rr.toFixed(1)} to TP1`,
        rr,
        position_note: 'Risk no more than 1–2% of your account between entry and stop. Take partial profit at TP1 and move the stop to break-even.',
      };
    } else {
      verdict = 'HOLD';
      rrNote = `A short setup exists but risk-to-reward to the nearest support is only 1:${rr.toFixed(1)} — below your 1:${minRR} minimum. Wait for a bounce toward ${nearestRes ? fmt(nearestRes.price) : 'resistance'} to improve the entry.`;
    }
  }

  // ---- HOLD watch plan: the exact conditions that would turn this into a
  // trade, each with its own stop and 1:minRR-minimum targets, so "HOLD"
  // always answers "then when DO I buy or sell?" ----
  const watchPlans = [];
  const tpFactor = minRR + 0.2; // measured target just past the minimum
  if (verdict === 'HOLD') {
    if (nearestRes) {
      const entry = nearestRes.price + 0.25 * a;
      const stop = nearestRes.price - a;
      const risk = entry - stop;
      const nextRes = resistanceZones.slice().sort((x, y) => x.price - y.price)[1]?.price;
      const tp1 = nextRes && nextRes >= entry + minRR * risk ? nextRes : entry + tpFactor * risk;
      const tp2 = Math.max(entry + (minRR + 1.5) * risk, nextRes ?? 0);
      watchPlans.push({
        side: 'BUY',
        trigger: `Candle CLOSES above resistance ${fmt(nearestRes.price)} with above-average volume`,
        entry: fmt(entry),
        stop_loss: `${fmt(stop)} (back inside the broken level = failed breakout)`,
        take_profit_1: fmt(tp1),
        take_profit_2: fmt(tp2),
        risk_reward: `1 : ${((tp1 - entry) / risk).toFixed(1)}`,
        rr: (tp1 - entry) / risk,
        note: 'Do not chase a wick through the level — wait for the candle close.',
      });
    }
    if (nearestSup) {
      const entry = nearestSup.price - 0.25 * a;
      const stop = nearestSup.price + a;
      const risk = stop - entry;
      const nextSup = supportZones.slice().sort((x, y) => y.price - x.price)[1]?.price;
      const tp1 = nextSup && nextSup <= entry - minRR * risk ? nextSup : entry - tpFactor * risk;
      const tp2 = Math.min(entry - (minRR + 1.5) * risk, nextSup ?? Infinity);
      watchPlans.push({
        side: 'SELL',
        trigger: `Candle CLOSES below support ${fmt(nearestSup.price)} with above-average volume`,
        entry: fmt(entry),
        stop_loss: `${fmt(stop)} (back above the broken level = failed breakdown)`,
        take_profit_1: fmt(tp1),
        take_profit_2: fmt(tp2),
        risk_reward: `1 : ${((entry - tp1) / risk).toFixed(1)}`,
        rr: (entry - tp1) / risk,
        note: 'Do not chase a wick through the level — wait for the candle close.',
      });
    }
    // In a trend, the pullback entry usually comes before the breakout — put
    // the with-trend trigger first.
    if (structureTrend === 'uptrend' && nearestSup && nearestRes) {
      const entry = nearestSup.price + 0.25 * a;
      const stop = nearestSup.price - 0.75 * a;
      const risk = entry - stop;
      const tp1 = nearestRes.price;
      if ((tp1 - entry) / risk >= minRR) {
        watchPlans.unshift({
          side: 'BUY',
          trigger: `Pullback into support ${fmt(nearestSup.price)} that holds (bullish rejection candle)`,
          entry: fmt(entry),
          stop_loss: `${fmt(stop)} (below the support zone)`,
          take_profit_1: fmt(tp1),
          take_profit_2: fmt(Math.max(tp1 + 2 * a, entry + (minRR + 1.5) * risk)),
          risk_reward: `1 : ${((tp1 - entry) / risk).toFixed(1)}`,
          rr: (tp1 - entry) / risk,
          note: 'With-trend entry — the higher-probability setup in an uptrend.',
        });
      }
    } else if (structureTrend === 'downtrend' && nearestSup && nearestRes) {
      const entry = nearestRes.price - 0.25 * a;
      const stop = nearestRes.price + 0.75 * a;
      const risk = stop - entry;
      const tp1 = nearestSup.price;
      if ((entry - tp1) / risk >= minRR) {
        watchPlans.unshift({
          side: 'SELL',
          trigger: `Bounce into resistance ${fmt(nearestRes.price)} that stalls (bearish rejection candle)`,
          entry: fmt(entry),
          stop_loss: `${fmt(stop)} (above the resistance zone)`,
          take_profit_1: fmt(tp1),
          take_profit_2: fmt(Math.min(tp1 - 2 * a, entry - (minRR + 1.5) * risk)),
          risk_reward: `1 : ${((entry - tp1) / risk).toFixed(1)}`,
          rr: (entry - tp1) / risk,
          note: 'With-trend entry — the higher-probability setup in a downtrend.',
        });
      }
    }
  }

  // confidence: scaled by |score|, capped at 80 (single-timeframe discipline)
  let confidence = verdict === 'HOLD'
    ? Math.min(50, 30 + Math.abs(score) * 4)
    : Math.min(80, 45 + Math.abs(score) * 5 + (nearSupport || nearResistance ? 5 : 0));

  const confluences = technicals
    .filter((t) => t.bias === (verdict === 'SELL' ? 'bearish' : 'bullish'))
    .map((t) => `${t.factor}: ${t.reading}`);
  const risks = technicals
    .filter((t) => t.bias === (verdict === 'SELL' ? 'bullish' : 'bearish'))
    .map((t) => `${t.factor}: ${t.reading}`);
  if (verdict !== 'HOLD') risks.push('Live markets can gap through levels on news — the stop-loss is mandatory, not optional.');

  const invalidation = verdict === 'BUY'
    ? `A decisive candle close below ${nearestSup ? fmt(nearestSup.price - 0.5 * a) : fmt(price - 2 * a)} invalidates the long idea.`
    : verdict === 'SELL'
      ? `A decisive candle close above ${nearestRes ? fmt(nearestRes.price + 0.5 * a) : fmt(price + 2 * a)} invalidates the short idea.`
      : `${rrNote || 'No position to invalidate.'} The watch plan above lists the exact triggers that create a fresh setup.`;

  const summary = verdict === 'HOLD'
    ? (rrNote || `${symbol} on the ${interval} is ${structureTrend === 'range' ? 'ranging' : `in a ${structureTrend}`} with ${bullFactors} bullish vs ${bearFactors} bearish factors — not enough one-sided confluence to justify a position right now. The watch plan below shows exactly what would change that.`)
    : `${symbol} on the ${interval} shows ${bullFactors} bullish vs ${bearFactors} bearish factors in a ${structureTrend}, with price ${nearSupport ? 'at support' : nearResistance ? 'at resistance' : 'in play'} — a disciplined ${verdict.toLowerCase()} setup with defined risk.`;

  const reasoning = [
    `Score check: ${bullFactors} bullish, ${bearFactors} bearish, net ${score >= 0 ? '+' : ''}${score}. Structure says ${structureTrend}; the 200-EMA filter says ${ema200[n] == null ? 'insufficient history' : price > ema200[n] ? 'bulls control the big picture' : 'bears control the big picture'}.`,
    verdict === 'BUY' ? `The long works because structure, trend filter, and momentum agree while price is ${nearSupport ? `sitting on a ${nearestSup.touches}-touch support zone at ${fmt(nearestSup.price)}` : 'not yet extended'}. The stop goes where the idea is wrong — beyond support — never at an arbitrary percentage.`
      : verdict === 'SELL' ? `The short works because structure, trend filter, and momentum agree while price is ${nearResistance ? `pressing into a ${nearestRes.touches}-touch resistance zone at ${fmt(nearestRes.price)}` : 'not yet extended'}. The stop goes beyond resistance — where the idea is proven wrong.`
        : `Standing aside is the professional call here: ${rrNote || 'the factors are split and price is not at a level where being wrong is cheap. Most charts, most of the time, are a HOLD.'} Set alerts at the trigger levels in the watch plan and let the market come to you.`,
    'This is a single-timeframe read on live data. Confirm the bias on the higher timeframe before committing, and never risk more than 1–2% per trade.',
  ].join('\n');

  return {
    verdict,
    confidence: Math.round(confidence),
    asset: symbol,
    timeframe: interval,
    chart_quality: 'good',
    summary,
    market_structure: {
      trend: structureTrend,
      phase: nearSupport ? 'testing support' : nearResistance ? 'testing resistance' : structureTrend === 'range' ? 'consolidation' : 'trend in progress',
      notes: structureNote,
    },
    key_levels: {
      supports: supportZones.map((z) => `${fmt(z.price)} (${z.touches} touch${z.touches > 1 ? 'es' : ''})`),
      resistances: resistanceZones.map((z) => `${fmt(z.price)} (${z.touches} touch${z.touches > 1 ? 'es' : ''})`),
    },
    technicals,
    trade_plan: tradePlan,
    watch_plan: watchPlans,
    confluences,
    risks,
    invalidation,
    higher_timeframe_check: `Check the ${HIGHER_TF[interval] || 'higher'} timeframe: the ${verdict === 'SELL' ? 'downtrend' : 'uptrend'} thesis is stronger if structure and the 200-EMA agree there too.`,
    verdict_reasoning: reasoning,
    live_price: price,
  };
}
