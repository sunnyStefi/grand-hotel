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

let prevDir = null;
export function getInputJustPressed() {
  const dir = getInput();
  const fired = dir !== null && dir !== prevDir;
  prevDir = dir;
  return fired ? dir : null;
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

// Enter only (no Space) — used by the pause menu so Space stays a pure
// pause/resume toggle without also firing menu selection on the same frame.
let enterOnlyPrev = false;
export function consumeEnterOnly() {
  const now = !!keys['Enter'];
  const fired = now && !enterOnlyPrev;
  enterOnlyPrev = now;
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
