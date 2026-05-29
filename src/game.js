import { createFloor, WALL, FLOOR, DOOR_JUNCTION, STASH, LIFT, DOWN_LIFT, CELL_SIZE, COLS, ROWS } from './maze.js';
import { generateSum, generateDecoys, updateTier, TIER_10 } from './math-engine.js';
import { getInput, getInputJustPressed, consumeSpacePress, consumeEnterPress, consumeNavUp, consumeNavDown } from './input.js';
import { initAudio, playSfx, speakSum, setMuted, isMuted } from './audio.js';
import { saveState, loadState } from './storage.js';
import {
  initRenderer, drawMaze, drawBellhop, drawSumBanner, drawHUD, drawPauseOverlay,
  drawBuildScreen, updateParticles, spawnCoins, spawnLightRays, spawnMoneyRemoval, drawParticles,
  drawVignetteOverlay, getBuildItems,
} from './renderer.js';

// ─── Canvas setup ────────────────────────────────────────────────────────────
const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
const LW = COLS * CELL_SIZE;  // 320
const LH = ROWS * CELL_SIZE;  // 176  (11 * 16)
canvas.width = LW;
canvas.height = LH;
canvas.style.imageRendering = 'pixelated';
ctx.imageSmoothingEnabled = false;
initRenderer(ctx);

function resizeCanvas() {
  const scaleX = window.innerWidth / LW;
  const scaleY = window.innerHeight / LH;
  const scale = Math.min(scaleX, scaleY);
  canvas.style.width  = `${LW * scale}px`;
  canvas.style.height = `${LH * scale}px`;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

// ─── State ────────────────────────────────────────────────────────────────────
function defaultState() {
  return {
    ui: 'game',       // 'game' | 'build' | 'pause' | 'clear'
    currentFloor: 1,
    maze: null,
    bellhop: { x: 1, y: 1 },
    direction: 'down',
    walkFrame: 0,
    walkTick: 0,
    moveTimer: 0,
    MOVE_INTERVAL: 100,  // ms per cell (held repeat)

    // Math
    activeJunction: null,   // { row, col }
    doorOverlays: null,     // [{ row, col, value, correct, flash }]
    currentSum: null,
    junctionStartTime: 0,
    recentAnswers: [],

    // Coins
    money: 0,
    displayMoney: 0,
    moneyAnimTimer: 0,
    moneyAnimTarget: 0,
    moneyAnimStart: 0,
    streak: 0,
    particles: [],

    // Lift
    liftBlocked: false,
    liftBlockTimer: 0,
    downLiftMessage: false,
    downLiftMessageTimer: 0,

    // Difficulty
    tier: TIER_10,

    // Hotel
    hotel: { rooms: 0, floors: 1, stars: 1 },

    // Stats
    stats: { bestCombo: 0, fastestAnswer: Infinity },

    // Build screen
    buildSelectedIdx: 0,

    // Screen shake
    shake: { x: 0, y: 0, ttl: 0 },

    // UI
    paused: false,
    clearAnimTimer: 0,
  };
}

const state = defaultState();

// ─── Load saved state ─────────────────────────────────────────────────────────
const saved = loadState();
if (saved) {
  state.money = saved.money || 0;
  state.displayMoney = state.money;
  state.moneyAnimTimer = 400;   // skip animation so loaded balance shows immediately
  state.moneyAnimStart = state.money;
  state.moneyAnimTarget = state.money;
  state.currentFloor = saved.highestFloor || 1;
  state.hotel = saved.hotel || state.hotel;
  if (saved.difficulty) {
    state.tier = saved.difficulty.tier || TIER_10;
    state.recentAnswers = saved.difficulty.recentAnswers || [];
  }
  state.stats = saved.stats || state.stats;
}

// ─── Floor init ───────────────────────────────────────────────────────────────
function loadFloor(floorNum) {
  state.maze = createFloor(floorNum);
  state.bellhop = { x: 1, y: 1 };
  state.activeJunction = null;
  state.doorOverlays = null;
  state.currentSum = null;
  state.resolvedJunctions = 0;
  state.liftBlocked = false;
  state.particles = [];
  state.streak = 0;
  // Count junctions
  state.totalJunctions = 0;
  for (let r = 0; r < ROWS; r++)
    for (let c = 0; c < COLS; c++)
      if (state.maze[r][c] === DOOR_JUNCTION) state.totalJunctions++;
}

loadFloor(state.currentFloor);

// ─── Audio init (requires user gesture) ──────────────────────────────────────
let audioReady = false;
function ensureAudio() {
  if (!audioReady) { initAudio(); audioReady = true; }
}
window.addEventListener('keydown', ensureAudio, { once: true });
window.addEventListener('click',   ensureAudio, { once: true });

// ─── Mute button region (canvas-relative, logical coords) ────────────────────
const MUTE_X = LW - 40, MUTE_Y = 0, MUTE_W = 40, MUTE_H = 14;
canvas.addEventListener('click', e => {
  const rect = canvas.getBoundingClientRect();
  const scaleX = LW / rect.width;
  const scaleY = LH / rect.height;
  const lx = (e.clientX - rect.left) * scaleX;
  const ly = (e.clientY - rect.top)  * scaleY;
  if (lx >= MUTE_X && lx <= MUTE_X + MUTE_W && ly >= MUTE_Y && ly <= MUTE_Y + MUTE_H) {
    setMuted(!isMuted());
  }
  // Build screen item click
  if (state.ui === 'build') {
    const items = getBuildItems(state);
    const totalOpts = items.length + 1; // items + next floor
    for (let i = 0; i < totalOpts; i++) {
      const iy = 44 + i * 14;
      if (ly >= iy && ly < iy + 14) { state.buildSelectedIdx = i; activateBuildSelection(); }
    }
  }
});

// ─── Coin award helper ────────────────────────────────────────────────────────
function awardCoins(elapsedMs, doorCol, doorRow) {
  const base = 15;
  const speed = elapsedMs < 3000 ? 15 : 0;
  const comboMult = state.streak >= 4 ? 2.5 : state.streak === 3 ? 2.0 : state.streak === 2 ? 1.5 : 1.0;
  const amount = Math.round((base + speed) * comboMult);

  state.moneyAnimStart  = state.displayMoney;
  state.moneyAnimTarget = state.money + amount;
  state.moneyAnimTimer  = 0;
  state.money += amount;

  spawnCoins(state.particles, doorCol, doorRow, 12, 7); // arc toward HUD money position
  playSfx('ching');
  return amount;
}

// ─── Junction activation ──────────────────────────────────────────────────────
function activateJunction(row, col) {
  if (state.activeJunction) return;
  state.activeJunction = { row, col };
  state.junctionStartTime = performance.now();
  state.currentSum = generateSum(state.tier);
  speakSum(state.currentSum.a, state.currentSum.b);

  // Place answer doors on adjacent FLOOR cells
  const dirs = [[-1,0],[1,0],[0,-1],[0,1]];
  const candidates = dirs
    .map(([dr, dc]) => ({ row: row + dr, col: col + dc }))
    .filter(p => p.row >= 0 && p.row < ROWS && p.col >= 0 && p.col < COLS
              && state.maze[p.row][p.col] === FLOOR);

  const doorCount = Math.min(Math.max(2, candidates.length), 4);
  const used = candidates.slice(0, doorCount);
  const decoys = generateDecoys(state.currentSum.answer, doorCount - 1);
  const values = [state.currentSum.answer, ...decoys].sort(() => Math.random() - 0.5);

  state.doorOverlays = used.map((pos, i) => ({
    row: pos.row, col: pos.col,
    value: values[i],
    correct: values[i] === state.currentSum.answer,
    flash: 0,
  }));
}

// ─── Movement & collision ─────────────────────────────────────────────────────
const DIR_DELTA = { up: [0,-1], down: [0,1], left: [-1,0], right: [1,0] };

function tryMove(dir) {
  state.direction = dir;
  const [dx, dy] = DIR_DELTA[dir];
  const nx = state.bellhop.x + dx;
  const ny = state.bellhop.y + dy;
  if (nx < 0 || nx >= COLS || ny < 0 || ny >= ROWS) return;

  const cell = state.maze[ny][nx];

  // Check if stepping into an answer door overlay
  if (state.doorOverlays) {
    const door = state.doorOverlays.find(d => d.col === nx && d.row === ny);
    if (door) {
      const elapsed = performance.now() - state.junctionStartTime;
      const ans = { correct: door.correct, elapsed };
      state.recentAnswers.push(ans);
      state.stats.fastestAnswer = Math.min(state.stats.fastestAnswer, elapsed);

      if (door.correct) {
        playSfx('ding');
        state.streak++;
        if (state.streak > state.stats.bestCombo) state.stats.bestCombo = state.streak;
        if (state.streak >= 2) playSfx('combo');
        awardCoins(elapsed, nx, ny);
        spawnLightRays(state.particles, nx, ny);
        // Resolve junction
        state.maze[state.activeJunction.row][state.activeJunction.col] = FLOOR;
        state.doorOverlays = null;
        state.activeJunction = null;
        state.currentSum = null;
        state.resolvedJunctions++;
        // Tier update
        if (state.recentAnswers.length % 5 === 0) {
          state.tier = updateTier(state.tier, state.recentAnswers);
        }
        state.bellhop.x = nx;
        state.bellhop.y = ny;
      } else {
        playSfx('buzz');
        playSfx('sad');
        state.streak = 0;
        door.flash = 300;
        state.shake = { x: 4, y: 3, ttl: 12 };
        // Remove money penalty
        const penalty = 10;
        state.money = Math.max(0, state.money - penalty);
        state.moneyAnimStart = state.displayMoney;
        state.moneyAnimTarget = state.money;
        state.moneyAnimTimer = 0;
        spawnMoneyRemoval(state.particles, nx, ny, penalty);
        // Don't move
      }
      return;
    }
  }

  if (cell === WALL) return;

  if (cell === DOOR_JUNCTION && !state.activeJunction) {
    activateJunction(ny, nx);
    state.bellhop.x = nx;
    state.bellhop.y = ny;
    return;
  }

  if (cell === STASH) {
    const coins = 20 + Math.floor(Math.random() * 31);
    state.moneyAnimStart  = state.displayMoney;
    state.moneyAnimTarget = state.money + coins;
    state.moneyAnimTimer  = 0;
    state.money += coins;
    spawnCoins(state.particles, nx, ny, 12, 7);
    playSfx('ching');
    state.maze[ny][nx] = FLOOR;
    state.bellhop.x = nx;
    state.bellhop.y = ny;
    return;
  }

  if (cell === LIFT) {
    if (state.resolvedJunctions < state.totalJunctions) {
      state.liftBlocked = true;
      state.liftBlockTimer = 1500;
      return;
    }
    startFloorClear();
    return;
  }

  if (cell === DOWN_LIFT) {
    if (state.currentFloor <= 1) {
      state.downLiftMessage = true;
      state.downLiftMessageTimer = 1500;
    } else {
      state.currentFloor--;
      loadFloor(state.currentFloor);
      playSfx('ding');
    }
    return;
  }

  state.bellhop.x = nx;
  state.bellhop.y = ny;
}

// ─── Floor clear ──────────────────────────────────────────────────────────────
function startFloorClear() {
  state.ui = 'clear';
  state.clearAnimTimer = 2000;
  playSfx('fanfare');
}

function showBuildScreen() {
  saveState(state);
  state.ui = 'build';
  state.buildSelectedIdx = 0;
}

function activateBuildSelection() {
  const items = getBuildItems(state);
  const idx = state.buildSelectedIdx;

  if (idx === items.length) {
    // Next floor
    state.currentFloor++;
    loadFloor(state.currentFloor);
    state.ui = 'game';
    return;
  }

  const item = items[idx];
  if (!item || item.locked || !item.canAfford) {
    playSfx('buzz');
    return;
  }

  if (item.action === 'room') {
    state.money -= item.cost;
    state.displayMoney = state.money;
    state.hotel.rooms++;
  } else if (item.action === 'floor') {
    state.money -= item.cost;
    state.displayMoney = state.money;
    state.hotel.floors++;
  }

  // Recalc stars
  const { rooms, floors } = state.hotel;
  state.hotel.stars = floors >= 2 ? 3 : rooms >= 3 ? 2 : 1;

  playSfx('cashout');
  saveState(state);
}

// ─── Update ───────────────────────────────────────────────────────────────────
let lastTime = 0;

function update(dt) {
  // Pause toggle
  if (consumeSpacePress()) {
    if (state.ui === 'game' || state.ui === 'pause') {
      state.paused = !state.paused;
      state.ui = state.paused ? 'pause' : 'game';
    }
  }

  if (state.ui === 'pause') return;

  if (state.ui === 'clear') {
    state.clearAnimTimer -= dt;
    if (state.clearAnimTimer <= 0) showBuildScreen();
    return;
  }

  if (state.ui === 'build') {
    if (consumeNavUp())   state.buildSelectedIdx = Math.max(0, state.buildSelectedIdx - 1);
    if (consumeNavDown()) {
      const items = getBuildItems(state);
      state.buildSelectedIdx = Math.min(items.length, state.buildSelectedIdx + 1);
    }
    if (consumeEnterPress()) activateBuildSelection();
    return;
  }

  // Game update
  // Door flash timers
  if (state.doorOverlays) {
    state.doorOverlays.forEach(d => { if (d.flash > 0) d.flash -= dt; });
  }

  // Lift block message
  if (state.liftBlockTimer > 0) state.liftBlockTimer -= dt;
  else state.liftBlocked = false;

  // Down lift message
  if (state.downLiftMessageTimer > 0) state.downLiftMessageTimer -= dt;
  else state.downLiftMessage = false;

  // Money display animation
  if (state.moneyAnimTimer < 400) {
    state.moneyAnimTimer += dt;
    const t = Math.min(1, state.moneyAnimTimer / 400);
    state.displayMoney = state.moneyAnimStart + (state.moneyAnimTarget - state.moneyAnimStart) * t;
  }

  // Particles
  updateParticles(state.particles, dt);

  // Screen shake decay
  if (state.shake.ttl > 0) {
    state.shake.x *= -0.7;
    state.shake.y *= -0.7;
    state.shake.ttl--;
    if (state.shake.ttl <= 0) { state.shake.x = 0; state.shake.y = 0; }
  }

  // Movement — instant on first press, then repeat at MOVE_INTERVAL
  const justPressed = getInputJustPressed();
  if (justPressed) state.moveTimer = state.MOVE_INTERVAL;
  state.moveTimer += dt;
  const dir = getInput();
  if (state.moveTimer >= state.MOVE_INTERVAL) {
    state.moveTimer -= state.MOVE_INTERVAL;
    if (dir && !state.activeJunction) tryMove(dir);
    else if (dir && state.doorOverlays) tryMove(dir);
  }

  // Walk animation
  if (dir) {
    state.walkTick += dt;
    if (state.walkTick >= 120) {
      state.walkTick = 0;
      state.walkFrame = (state.walkFrame + 1) % 4;
    }
  } else {
    state.walkFrame = 0;
    state.walkTick = 0;
  }
}

// ─── Render ───────────────────────────────────────────────────────────────────
function render() {
  ctx.clearRect(0, 0, LW, LH);

  if (state.ui === 'build') {
    drawBuildScreen(ctx, state, state.buildSelectedIdx, LW, LH);
    drawHUD(ctx, state, LW, LH, false);
    drawVignetteOverlay(ctx, LW, LH);
    return;
  }

  // Apply screen shake
  ctx.save();
  ctx.translate(state.shake.x, state.shake.y);

  // Maze + game elements
  drawMaze(ctx, state.maze, state.doorOverlays, state.currentFloor);
  drawBellhop(ctx, state.bellhop.x, state.bellhop.y, state.direction, state.walkFrame, state.currentFloor);
  drawSumBanner(ctx, state.activeJunction, state.currentSum, state.maze);
  drawParticles(ctx, state.particles);

  ctx.restore();

  drawHUD(ctx, state, LW, LH);

  // Lift blocked message
  if (state.liftBlocked && state.liftBlockTimer > 0) {
    ctx.fillStyle = 'rgba(0,0,0,0.7)';
    ctx.fillRect(LW / 2 - 60, LH / 2 - 8, 120, 16);
    ctx.fillStyle = '#f5c842';
    ctx.font = '8px monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('Open all doors first!', LW / 2, LH / 2);
  }

  // Down lift message
  if (state.downLiftMessage && state.downLiftMessageTimer > 0) {
    ctx.fillStyle = 'rgba(0,0,0,0.7)';
    ctx.fillRect(LW / 2 - 70, LH / 2 - 8, 140, 16);
    ctx.fillStyle = '#4A90D9';
    ctx.font = '8px monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('Ground floor!', LW / 2, LH / 2);
  }

  // Floor clear overlay
  if (state.ui === 'clear') {
    ctx.fillStyle = 'rgba(0,0,0,0.55)';
    ctx.fillRect(0, 0, LW, LH);
    ctx.fillStyle = '#f5c842';
    ctx.font = 'bold 14px monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('FLOOR CLEAR!', LW / 2, LH / 2 - 10);
    ctx.fillStyle = '#fff8e7';
    ctx.font = '9px monospace';
    ctx.fillText(`Bank: $${Math.floor(state.money)}`, LW / 2, LH / 2 + 6);
  }

  if (state.ui === 'pause') drawPauseOverlay(ctx, LW, LH);

  drawVignetteOverlay(ctx, LW, LH);
}

// ─── Loop ─────────────────────────────────────────────────────────────────────
function loop(ts) {
  const dt = Math.min(ts - lastTime, 100); // cap at 100ms
  lastTime = ts;
  update(dt);
  render();
  requestAnimationFrame(loop);
}

requestAnimationFrame(ts => { lastTime = ts; requestAnimationFrame(loop); });
