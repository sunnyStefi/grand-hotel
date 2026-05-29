export const TIER_10 = 'TIER_10';
export const TIER_15 = 'TIER_15';
export const TIER_20 = 'TIER_20';

const TIER_RANGES = {
  [TIER_10]: { min: 2,  max: 10 },
  [TIER_15]: { min: 11, max: 15 },
  [TIER_20]: { min: 16, max: 20 },
};
const TIER_ORDER = [TIER_10, TIER_15, TIER_20];

function randInt(lo, hi) {
  return Math.floor(lo + Math.random() * (hi - lo + 1));
}

export function generateSum(tier) {
  const { min, max } = TIER_RANGES[tier];
  const answer = randInt(min, max);
  const a = randInt(1, answer - 1);
  const b = answer - a;
  return { a, b, answer };
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
