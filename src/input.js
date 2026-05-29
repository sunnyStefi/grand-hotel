const keys = {};

window.addEventListener('keydown', e => { keys[e.code] = true; });
window.addEventListener('keyup',  e => { keys[e.code] = false; });

export function getInput() {
  if (keys['ArrowUp'])    return 'up';
  if (keys['ArrowDown'])  return 'down';
  if (keys['ArrowLeft'])  return 'left';
  if (keys['ArrowRight']) return 'right';
  return null;
}

export function isSpaceJustPressed() {
  const v = keys['Space'];
  return !!v;
}

// Track space press as an edge (just-pressed, not held)
let spacePrev = false;
export function consumeSpacePress() {
  const now = !!keys['Space'];
  const fired = now && !spacePrev;
  spacePrev = now;
  return fired;
}

// Build screen navigation
let enterPrev = false;
export function consumeEnterPress() {
  const now = !!(keys['Enter'] || keys['Space']);
  const fired = now && !enterPrev;
  enterPrev = now;
  return fired;
}

let upPrev = false, downPrev = false;
export function consumeNavUp() {
  const now = !!keys['ArrowUp'];
  const fired = now && !upPrev;
  upPrev = now;
  return fired;
}
export function consumeNavDown() {
  const now = !!keys['ArrowDown'];
  const fired = now && !downPrev;
  downPrev = now;
  return fired;
}
