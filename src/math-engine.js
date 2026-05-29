export const TIER_1 = 'TIER_1';
export const TIER_2 = 'TIER_2';
export const TIER_3 = 'TIER_3';

const TIER_CONFIGS = {
  [TIER_1]: { min: 2, max: 8  },
  [TIER_2]: { min: 4, max: 12 },
  [TIER_3]: { min: 8, max: 16 },
};
const TIER_ORDER = [TIER_1, TIER_2, TIER_3];

function randInt(lo, hi) {
  return Math.floor(lo + Math.random() * (hi - lo + 1));
}

// Chance a problem is subtraction, driven by floor (not tier):
// floor 1 = pure addition (simple sums), then subtraction is introduced at
// floor 2 and ramps up gradually as the player climbs.
function subProbability(floorNum) {
  if (floorNum < 2) return 0;
  return Math.min(0.5, 0.15 + (floorNum - 2) * 0.12);
}

export function generateProblem(tier, floorNum = 1) {
  const cfg = TIER_CONFIGS[tier];
  if (Math.random() < subProbability(floorNum)) {
    // Subtraction — keep it simple: small subtrahend, never negative.
    const a = randInt(cfg.min, cfg.max);
    const b = randInt(1, Math.min(a - 1, 5));
    return { a, b, operator: '−', answer: a - b };
  } else {
    // Addition
    const answer = randInt(cfg.min, cfg.max);
    const a = randInt(1, answer - 1);
    const b = answer - a;
    return { a, b, operator: '+', answer };
  }
}

export function generateDecoys(answer, count) {
  const decoys = new Set();
  let attempts = 0;
  while (decoys.size < count && attempts < 100) {
    attempts++;
    const offset = randInt(1, 3) * (Math.random() < 0.5 ? 1 : -1);
    const v = answer + offset;
    if (v > 0 && v !== answer) decoys.add(v);
  }
  // Fallback: fill remaining with sequential offsets
  for (let i = 1; decoys.size < count; i++) {
    if (i !== answer && i > 0) decoys.add(answer + i);
  }
  return [...decoys].slice(0, count);
}

export function updateTier(currentTier, recentAnswers) {
  if (recentAnswers.length < 5) return currentTier;
  const last5 = recentAnswers.slice(-5);
  const correct = last5.filter(a => a.correct).length;
  const avgTime = last5.reduce((s, a) => s + a.elapsed, 0) / 5;
  const idx = TIER_ORDER.indexOf(currentTier);

  if (correct >= 3 && avgTime < 3000 && idx < TIER_ORDER.length - 1) {
    return TIER_ORDER[idx + 1];
  }
  if ((last5.filter(a => !a.correct).length >= 2 || avgTime > 5000) && idx > 0) {
    return TIER_ORDER[idx - 1];
  }
  return currentTier;
}
