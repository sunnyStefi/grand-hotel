export const TIER_1 = 'TIER_1';
export const TIER_2 = 'TIER_2';
export const TIER_3 = 'TIER_3';

const TIER_CONFIGS = {
  [TIER_1]: { min: 2, max: 8,  allowSub: false },
  [TIER_2]: { min: 4, max: 12, allowSub: true  },
  [TIER_3]: { min: 8, max: 16, allowSub: true  },
};
const TIER_ORDER = [TIER_1, TIER_2, TIER_3];

function randInt(lo, hi) {
  return Math.floor(lo + Math.random() * (hi - lo + 1));
}

export function generateProblem(tier) {
  const cfg = TIER_CONFIGS[tier];
  if (cfg.allowSub && Math.random() < 0.4) {
    // Subtraction
    const a = randInt(cfg.min, cfg.max);
    const b = randInt(1, Math.max(a - 1, 1));
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
