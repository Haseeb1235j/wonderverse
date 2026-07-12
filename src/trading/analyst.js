// Signal Desk — chart analysis engine.
// Sends the chart screenshot to Claude Opus 4.8 (vision + adaptive thinking)
// with a veteran-trader analysis framework and a strict JSON output schema.

import Anthropic from '@anthropic-ai/sdk';

const MODEL = 'claude-opus-4-8';

// ---------------------------------------------------------------------------
// The analyst persona + methodology. This is the heart of the system: a
// disciplined, evidence-only framework. The model may only cite what is
// actually visible on the chart, must always define invalidation, and must
// default to HOLD when confluence or reward-to-risk is insufficient.
// ---------------------------------------------------------------------------
const SYSTEM_PROMPT = `You are "The Desk" — a veteran discretionary trader with 30+ years of experience across equities, futures, forex, and crypto. You survived the 1997 Asian crisis, the dot-com crash, 2008, the 2020 COVID crash, and every crypto winter. You built a nine-figure fortune not by predicting the future, but by ruthless discipline: trading only when the odds and the reward-to-risk are clearly in your favor, and sitting on your hands the rest of the time. Your motto: "The market pays patience and punishes opinion."

You are analyzing a chart screenshot provided by a retail trader who will act on your verdict. Treat this with the seriousness of managing your own money.

## Your analysis process (do ALL of this before deciding)

1. **Read the chart itself first.** Identify the asset, timeframe, price scale, and how much history is visible. If the platform shows indicator values, read them precisely.
2. **Market structure.** Determine the trend from swing highs/lows (HH/HL = uptrend, LH/LL = downtrend, overlapping = range). Identify the current phase: impulse, pullback, consolidation, distribution/accumulation, breakout, or breakdown.
3. **Key levels.** Mark the horizontal support/resistance zones that price has actually respected (multiple touches, strong reactions), prior swing points, round numbers, and any visible trendlines or channels. Note where price sits relative to them RIGHT NOW.
4. **Candles and patterns.** Read the last 5–10 candles for momentum and rejection (wicks, engulfing, pins, inside bars). Identify any larger pattern only if it is genuinely well-formed (head & shoulders, double top/bottom, flags, wedges, triangles) — do not force patterns onto noise.
5. **Indicators — only what is visible.** If the screenshot shows moving averages, RSI, MACD, volume, Bollinger Bands, etc., read them and weigh them. NEVER invent a reading for an indicator that is not on the chart. If volume is not shown, say so and reason without it.
6. **Confluence scoring.** List every factor as bullish, bearish, or neutral. A tradeable signal requires MULTIPLE independent factors agreeing (structure + level + momentum at minimum). One pretty candle is not a signal.
7. **The trade, if there is one.** Define entry (current price or a specific trigger level), stop-loss placed beyond the level that invalidates the idea (never an arbitrary %), and two take-profit targets at logical levels. Compute reward-to-risk to TP1.
8. **Pre-mortem.** Before finalizing, argue the OTHER side: what does the opposing trader see? If the counter-case is nearly as strong, the verdict is HOLD.

## Iron rules (non-negotiable)

- **BUY or SELL only when**: at least 3 independent factors align, price is at or near a meaningful level (never chasing mid-range), AND reward-to-risk to TP1 is at least 2:1. Otherwise the verdict is HOLD — and HOLD is a professional answer, not a failure.
- **HOLD is mandatory when**: the chart is unreadable/too zoomed/cropped, there's too little history to establish structure, price is mid-range between levels, signals genuinely conflict, or a well-formed setup simply isn't present. Most charts, most of the time, are a HOLD.
- **Never fabricate.** Every price you quote must be readable from the chart (approximate with "~" if the scale is coarse). Every indicator reading must be visible. If you cannot read the price scale, give levels descriptively ("the swing low from the left third of the chart") and lower your confidence.
- **Confidence honesty.** A single screenshot of a single timeframe with no volume/context caps confidence at 80. Reserve 80+ for textbook setups with heavy confluence. Below 55 confidence, the verdict must be HOLD.
- **This is one timeframe.** Note explicitly what a higher/lower timeframe check should confirm before entry.
- **Risk first.** Position note must always include: risk no more than 1–2% of account on the stop, and the stop is not optional.

## Voice

Write verdict_reasoning like a veteran talking to a junior at the desk: direct, concrete, zero hype, zero hedging-waffle. Explain WHY in terms of what the market is doing, who's trapped, and where the liquidity is. If the verdict is HOLD, say exactly what you'd wait for to change your mind.`;

// Structured output schema — guarantees a parseable verdict object.
const OUTPUT_SCHEMA = {
  type: 'object',
  properties: {
    verdict: { type: 'string', enum: ['BUY', 'SELL', 'HOLD'] },
    confidence: {
      type: 'integer',
      description: 'Confidence in the verdict, 0-100. Must be below 55 if verdict is HOLD due to insufficient signal quality; capped at 80 for single-screenshot analysis unless the setup is textbook.',
    },
    asset: { type: 'string', description: 'Asset/ticker as read from the chart, or "Unknown" if not visible.' },
    timeframe: { type: 'string', description: 'Chart timeframe as read from the chart, or "Unknown".' },
    chart_quality: {
      type: 'string',
      enum: ['good', 'fair', 'poor'],
      description: 'How readable/complete the screenshot is for analysis.',
    },
    summary: { type: 'string', description: 'The trade thesis in 2-3 sentences, plain language.' },
    market_structure: {
      type: 'object',
      properties: {
        trend: { type: 'string', enum: ['uptrend', 'downtrend', 'range', 'transition'] },
        phase: { type: 'string', description: 'Current phase: impulse, pullback, consolidation, breakout, distribution, etc.' },
        notes: { type: 'string', description: 'Swing structure observations (HH/HL, LH/LL, ranges).' },
      },
      required: ['trend', 'phase', 'notes'],
      additionalProperties: false,
    },
    key_levels: {
      type: 'object',
      properties: {
        supports: { type: 'array', items: { type: 'string' }, description: 'Support levels/zones, strongest first, as read from the chart.' },
        resistances: { type: 'array', items: { type: 'string' }, description: 'Resistance levels/zones, strongest first.' },
      },
      required: ['supports', 'resistances'],
      additionalProperties: false,
    },
    technicals: {
      type: 'array',
      description: 'Each factor actually observed on the chart with its directional bias.',
      items: {
        type: 'object',
        properties: {
          factor: { type: 'string', description: 'e.g. "Price vs 200 MA", "RSI(14)", "Last 5 candles", "Volume"' },
          reading: { type: 'string', description: 'What is actually visible.' },
          bias: { type: 'string', enum: ['bullish', 'bearish', 'neutral'] },
        },
        required: ['factor', 'reading', 'bias'],
        additionalProperties: false,
      },
    },
    trade_plan: {
      anyOf: [
        {
          type: 'object',
          properties: {
            entry: { type: 'string', description: 'Entry price or trigger condition.' },
            stop_loss: { type: 'string', description: 'Stop level and why it is placed there.' },
            take_profit_1: { type: 'string' },
            take_profit_2: { type: 'string' },
            risk_reward: { type: 'string', description: 'Reward-to-risk to TP1, e.g. "2.4 : 1".' },
            position_note: { type: 'string', description: 'Position sizing / risk guidance (max 1-2% account risk).' },
          },
          required: ['entry', 'stop_loss', 'take_profit_1', 'take_profit_2', 'risk_reward', 'position_note'],
          additionalProperties: false,
        },
        { type: 'null' },
      ],
      description: 'Full trade plan for BUY/SELL. null when verdict is HOLD.',
    },
    confluences: { type: 'array', items: { type: 'string' }, description: 'Independent factors supporting the verdict.' },
    risks: { type: 'array', items: { type: 'string' }, description: 'Counter-signals and what the opposing side sees.' },
    invalidation: { type: 'string', description: 'The specific price action that kills this thesis.' },
    higher_timeframe_check: { type: 'string', description: 'What to confirm on a higher/lower timeframe before acting.' },
    verdict_reasoning: { type: 'string', description: 'The full desk-veteran reasoning behind the verdict, 1-3 paragraphs.' },
  },
  required: [
    'verdict', 'confidence', 'asset', 'timeframe', 'chart_quality', 'summary',
    'market_structure', 'key_levels', 'technicals', 'trade_plan',
    'confluences', 'risks', 'invalidation', 'higher_timeframe_check', 'verdict_reasoning',
  ],
  additionalProperties: false,
};

/**
 * Analyze a chart screenshot.
 * @param {Object} opts
 * @param {string} opts.apiKey - Anthropic API key (used directly from the browser).
 * @param {string} opts.imageBase64 - base64 image data (no data: prefix).
 * @param {string} opts.mediaType - e.g. "image/png".
 * @param {string} [opts.context] - optional user-provided context (asset, timeframe, notes).
 * @param {(status: string) => void} [opts.onStatus] - progress callback.
 * @returns {Promise<Object>} parsed analysis object matching OUTPUT_SCHEMA.
 */
export async function analyzeChart({ apiKey, imageBase64, mediaType, context, onStatus }) {
  const client = new Anthropic({ apiKey, dangerouslyAllowBrowser: true });

  const userText = [
    'Analyze this chart screenshot and give me your verdict: BUY, SELL, or HOLD.',
    context && context.trim() ? `Trader-provided context (verify against the chart, do not blindly trust): ${context.trim()}` : null,
    'Remember: only cite what is visible, apply the iron rules, and default to HOLD when the setup is not clearly there.',
  ].filter(Boolean).join('\n\n');

  onStatus?.('Reading the chart…');

  const stream = client.messages.stream({
    model: MODEL,
    max_tokens: 16000,
    thinking: { type: 'adaptive' },
    output_config: {
      effort: 'high',
      format: { type: 'json_schema', schema: OUTPUT_SCHEMA },
    },
    system: SYSTEM_PROMPT,
    messages: [
      {
        role: 'user',
        content: [
          { type: 'image', source: { type: 'base64', media_type: mediaType, data: imageBase64 } },
          { type: 'text', text: userText },
        ],
      },
    ],
  });

  stream.on('contentBlock', (block) => {
    if (block.type === 'thinking') onStatus?.('Deep analysis in progress — structure, levels, confluence…');
    if (block.type === 'text') onStatus?.('Writing the verdict…');
  });

  const message = await stream.finalMessage();

  if (message.stop_reason === 'refusal') {
    throw new Error('The analysis was declined for this image. Please upload a plain market chart screenshot.');
  }
  if (message.stop_reason === 'max_tokens') {
    throw new Error('The analysis ran too long and was cut off. Please try again.');
  }

  const textBlock = message.content.find((b) => b.type === 'text');
  if (!textBlock) throw new Error('No analysis was returned. Please try again.');

  return JSON.parse(textBlock.text);
}

export function describeError(error) {
  if (error instanceof Anthropic.AuthenticationError) {
    return 'Invalid API key. Check your Anthropic API key in Settings (it starts with "sk-ant-").';
  }
  if (error instanceof Anthropic.RateLimitError) {
    return 'Rate limit reached. Wait a minute and try again.';
  }
  if (error instanceof Anthropic.BadRequestError) {
    return `The request was rejected: ${error.message}`;
  }
  if (error instanceof Anthropic.APIConnectionError) {
    return 'Could not reach the Anthropic API. Check your internet connection.';
  }
  if (error instanceof Anthropic.APIError) {
    return `API error (${error.status}): ${error.message}`;
  }
  return error?.message || 'Something went wrong. Please try again.';
}
