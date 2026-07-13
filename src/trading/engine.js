// Signal Desk — free technical-analysis engine (no API key required).
// Fetches live OHLCV candles from Binance's public market-data API and runs
// a disciplined rule-based analysis: trend structure, key levels, momentum,
// confluence scoring, and a risk-managed trade plan. Produces the same
// result shape as the AI analyst so the UI renderer is shared.

const DATA_HOSTS = [
  'https://data-api.binance.vision', // public market-data mirror (CORS enabled)
  'https://api.binance.com',
];

export const TIMEFRAMES = ['15m', '1h', '4h', '1d', '1w'];

const HIGHER_TF = { '15m': '1h', '1h': '4h', '4h': '1d', '1d': '1w', '1w': '1M' };

export function normalizeSymbol(input) {
  let s = String(input || '').toUpperCase().replace(/[^A-Z0-9]/g, '');
  if (!s) return '';
  // Bare coin name -> USDT pair
  const quotes = ['USDT', 'USDC', 'FDUSD', 'BTC', 'ETH', 'EUR', 'TRY'];
  if (!quotes.some((q) => s.endsWith(q) && s.length > q.length)) s += 'USDT';
  return s;
}

async function fetchKlines(symbol, interval, limit = 300) {
  let lastErr;
  for (const host of DATA_HOSTS) {
    try {
      const res = await fetch(`${host}/api/v3/klines?symbol=${symbol}&interval=${interval}&limit=${limit}`);
      if (res.status === 400) throw Object.assign(new Error(`Symbol "${symbol}" not found on Binance. Try e.g. BTCUSDT, ETHUSDT, SOLUSDT.`), { fatal: true });
      if (!res.ok) throw new Error(`Market data request failed (${res.status})`);
      const rows = await res.json();
      if (!Array.isArray(rows) || rows.length < 60) {
        throw Object.assign(new Error('Not enough price history for this pair/timeframe.'), { fatal: true });
      }
      return rows.map((r) => ({
        time: r[0], open: +r[1], high: +r[2], low: +r[3], close: +r[4], volume: +r[5],
      }));
    } catch (e) {
      if (e.fatal) throw e;
      lastErr = e;
    }
  }
  throw new Error(`Could not reach Binance market data (${lastErr?.message || 'network error'}). Check your connection and try again.`);
}

// ---------------- indicator math ----------------
function ema(values, period) {
  const k = 2 / (period + 1);
  const out = new Array(values.length).fill(null);
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

function fmt(price) {
  if (!isFinite(price)) return '—';
  if (price >= 1000) return price.toLocaleString('en-US', { maximumFractionDigits: 0 });
  if (price >= 10) return price.toFixed(2);
  if (price >= 0.1) return price.toFixed(4);
  return price.toPrecision(4);
}

// ---------------- the analysis ----------------
export async function analyzeLive(symbolInput, interval) {
  const symbol = normalizeSymbol(symbolInput);
  if (!symbol) throw new Error('Enter a symbol, e.g. BTC or BTCUSDT.');
  const candles = await fetchKlines(symbol, interval);
  return buildAnalysis(symbol, interval, candles);
}

export function buildAnalysis(symbol, interval, candles) {
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
  add('Volume', `Current volume ${(volNow / volAvg).toFixed(2)}x the 20-bar average on a ${lastBull ? 'green' : 'red'} candle.`,
    volNow > 1.2 * volAvg ? (lastBull ? 'bullish' : 'bearish') : 'neutral');

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

  // ---- trade plan with strict 2:1 reward-to-risk ----
  let tradePlan = null;
  let rrNote = '';
  if (verdict === 'BUY') {
    // Stop goes below the nearest support only when that support is close
    // enough to be this trade's invalidation; otherwise a 1.5×ATR swing stop.
    const supUsable = nearestSup && (price - nearestSup.price) <= 3 * a;
    const stop = supUsable ? nearestSup.price - 0.5 * a : price - 1.5 * a;
    const risk = price - stop;
    const tp1 = nearestRes ? nearestRes.price : price + Math.max(3 * a, 2.2 * risk);
    const tp2 = resistanceZones.slice().sort((x, y) => x.price - y.price)[1]?.price ?? tp1 + 2 * a;
    const rr = (tp1 - price) / risk;
    if (rr >= 2) {
      tradePlan = {
        entry: `~${fmt(price)} (current price) or on a pullback toward ${nearestSup ? fmt(nearestSup.price) : 'support'}`,
        stop_loss: `${fmt(stop)} — ${supUsable ? 'below the nearest support zone minus half an ATR' : '1.5×ATR swing stop below entry'}`,
        take_profit_1: `${fmt(tp1)} — nearest resistance zone`,
        take_profit_2: `${fmt(tp2)} — next resistance / measured extension`,
        risk_reward: `${rr.toFixed(1)} : 1 to TP1`,
        position_note: 'Risk no more than 1–2% of your account between entry and stop. Take partial profit at TP1 and move the stop to break-even.',
      };
    } else {
      verdict = 'HOLD';
      rrNote = `A long setup exists but reward-to-risk to the nearest resistance is only ${rr.toFixed(1)}:1 — below the 2:1 minimum. Wait for a pullback toward ${nearestSup ? fmt(nearestSup.price) : 'support'} to improve the entry.`;
    }
  } else if (verdict === 'SELL') {
    const resUsable = nearestRes && (nearestRes.price - price) <= 3 * a;
    const stop = resUsable ? nearestRes.price + 0.5 * a : price + 1.5 * a;
    const risk = stop - price;
    const tp1 = nearestSup ? nearestSup.price : price - Math.max(3 * a, 2.2 * risk);
    const tp2 = supportZones.slice().sort((x, y) => y.price - x.price)[1]?.price ?? tp1 - 2 * a;
    const rr = (price - tp1) / risk;
    if (rr >= 2) {
      tradePlan = {
        entry: `~${fmt(price)} (current price) or on a bounce toward ${nearestRes ? fmt(nearestRes.price) : 'resistance'}`,
        stop_loss: `${fmt(stop)} — ${resUsable ? 'above the nearest resistance zone plus half an ATR' : '1.5×ATR swing stop above entry'}`,
        take_profit_1: `${fmt(tp1)} — nearest support zone`,
        take_profit_2: `${fmt(tp2)} — next support / measured extension`,
        risk_reward: `${rr.toFixed(1)} : 1 to TP1`,
        position_note: 'Risk no more than 1–2% of your account between entry and stop. Take partial profit at TP1 and move the stop to break-even.',
      };
    } else {
      verdict = 'HOLD';
      rrNote = `A short setup exists but reward-to-risk to the nearest support is only ${rr.toFixed(1)}:1 — below the 2:1 minimum. Wait for a bounce toward ${nearestRes ? fmt(nearestRes.price) : 'resistance'} to improve the entry.`;
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
      : `${rrNote || 'No position to invalidate.'} A breakout close ${nearestRes ? `above ${fmt(nearestRes.price)}` : 'above resistance'} or breakdown ${nearestSup ? `below ${fmt(nearestSup.price)}` : 'below support'} with volume would create a fresh setup.`;

  const summary = verdict === 'HOLD'
    ? (rrNote || `${symbol} on the ${interval} is ${structureTrend === 'range' ? 'ranging' : `in a ${structureTrend}`} with ${bullFactors} bullish vs ${bearFactors} bearish factors — not enough one-sided confluence to justify a position. Cash is a position.`)
    : `${symbol} on the ${interval} shows ${bullFactors} bullish vs ${bearFactors} bearish factors in a ${structureTrend}, with price ${nearSupport ? 'at support' : nearResistance ? 'at resistance' : 'in play'} — a disciplined ${verdict.toLowerCase()} setup with defined risk.`;

  const reasoning = [
    `Score check: ${bullFactors} bullish, ${bearFactors} bearish, net ${score >= 0 ? '+' : ''}${score}. Structure says ${structureTrend}; the 200-EMA filter says ${ema200[n] == null ? 'insufficient history' : price > ema200[n] ? 'bulls control the big picture' : 'bears control the big picture'}.`,
    verdict === 'BUY' ? `The long works because structure, trend filter, and momentum agree while price is ${nearSupport ? `sitting on a ${nearestSup.touches}-touch support zone at ${fmt(nearestSup.price)}` : 'not yet extended'}. The stop goes where the idea is wrong — beyond support — never at an arbitrary percentage.`
      : verdict === 'SELL' ? `The short works because structure, trend filter, and momentum agree while price is ${nearResistance ? `pressing into a ${nearestRes.touches}-touch resistance zone at ${fmt(nearestRes.price)}` : 'not yet extended'}. The stop goes beyond resistance — where the idea is proven wrong.`
        : `Standing aside is the professional call here: ${rrNote || 'the factors are split and price is not at a level where being wrong is cheap. Most charts, most of the time, are a HOLD.'} Set an alert at the levels above and let the market come to you.`,
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
    confluences,
    risks,
    invalidation,
    higher_timeframe_check: `Check the ${HIGHER_TF[interval] || 'higher'} timeframe: the ${verdict === 'SELL' ? 'downtrend' : 'uptrend'} thesis is stronger if structure and the 200-EMA agree there too.`,
    verdict_reasoning: reasoning,
    live_price: price,
  };
}
