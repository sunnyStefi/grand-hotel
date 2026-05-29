const KEY = 'grand-hotel-save';

export function saveState(state) {
  const data = {
    hotel: state.hotel,
    money: state.money,
    highestFloor: state.currentFloor,
    difficulty: { tier: state.tier, recentAnswers: state.recentAnswers },
    stats: state.stats,
  };
  try {
    localStorage.setItem(KEY, JSON.stringify(data));
  } catch (_) {}
}

export function loadState() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (_) {
    return null;
  }
}
