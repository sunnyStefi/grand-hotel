import { WALL, FLOOR, DOOR_JUNCTION, STASH, LIFT, DOWN_LIFT, CELL_SIZE } from './maze.js';
import { isMuted } from './audio.js';
import { PALETTE, drawSprite, BELLHOP_SPRITES, getBellhopSprites } from './sprites.js';

const P = PALETTE;

// ─── Wallpaper patterns (per floor) ───────────────────────────────────────────
let wallpaperPatterns = {};

function buildWallpaperPatterns(ctx) {
  const size = 16;

  // Floor 1: Classic brick with warm browns
  {
    const oc = document.createElement('canvas');
    oc.width = size; oc.height = size;
    const ox = oc.getContext('2d');
    ox.fillStyle = '#8B4513';
    ox.fillRect(0, 0, size, size);
    // Brick pattern - horizontal line every 8px
    ox.strokeStyle = '#654321';
    ox.lineWidth = 0.5;
    ox.beginPath();
    ox.moveTo(0, size / 2);
    ox.lineTo(size, size / 2);
    ox.stroke();
    // Vertical brick divider
    ox.beginPath();
    ox.moveTo(size / 2, 0);
    ox.lineTo(size / 2, size / 2);
    ox.stroke();
    ox.beginPath();
    ox.moveTo(size / 2, size / 2);
    ox.lineTo(size / 2, size);
    ox.stroke();
    // Shading
    ox.fillStyle = 'rgba(0,0,0,0.15)';
    ox.fillRect(0, size / 2 - 0.5, size, 1);
    wallpaperPatterns[1] = ctx.createPattern(oc, 'repeat');
  }

  // Floor 2: Teal/turquoise with decorative dots
  {
    const oc = document.createElement('canvas');
    oc.width = size; oc.height = size;
    const ox = oc.getContext('2d');
    ox.fillStyle = '#2D8A7D';
    ox.fillRect(0, 0, size, size);
    // Geometric pattern - circles
    ox.fillStyle = '#1F5A54';
    ox.beginPath();
    ox.arc(size / 2, size / 2, 3, 0, Math.PI * 2);
    ox.fill();
    // Corner accents
    ox.fillStyle = 'rgba(255,255,255,0.1)';
    ox.fillRect(1, 1, 2, 2);
    ox.fillRect(size - 3, size - 3, 2, 2);
    wallpaperPatterns[2] = ctx.createPattern(oc, 'repeat');
  }

  // Floor 3: Light blue/modern with subtle texture
  {
    const oc = document.createElement('canvas');
    oc.width = size; oc.height = size;
    const ox = oc.getContext('2d');
    ox.fillStyle = '#5DA5D4';
    ox.fillRect(0, 0, size, size);
    // Modern diagonal lines
    ox.strokeStyle = '#4A8BC2';
    ox.lineWidth = 1;
    for (let i = 0; i < size * 2; i += 4) {
      ox.beginPath();
      ox.moveTo(i, 0);
      ox.lineTo(i - size, size);
      ox.stroke();
    }
    // Light overlay
    ox.fillStyle = 'rgba(255,255,255,0.05)';
    ox.fillRect(0, 0, size, size);
    wallpaperPatterns[3] = ctx.createPattern(oc, 'repeat');
  }

  // Floor 4: Purple/lavender with ornate pattern
  {
    const oc = document.createElement('canvas');
    oc.width = size; oc.height = size;
    const ox = oc.getContext('2d');
    ox.fillStyle = '#9B6DB4';
    ox.fillRect(0, 0, size, size);
    // Ornate cross pattern (fancy)
    ox.fillStyle = '#7A4F8C';
    ox.fillRect(size / 2 - 1, 0, 2, size);
    ox.fillRect(0, size / 2 - 1, size, 2);
    // Decorative corners
    ox.fillStyle = '#D4A5E8';
    ox.fillRect(1, 1, 3, 3);
    ox.fillRect(size - 4, 1, 3, 3);
    ox.fillRect(1, size - 4, 3, 3);
    ox.fillRect(size - 4, size - 4, 3, 3);
    wallpaperPatterns[4] = ctx.createPattern(oc, 'repeat');
  }
}

export function initRenderer(ctx) {
  buildWallpaperPatterns(ctx);
}

// ─── Coin rendering ──────────────────────────────────────────────────────────
function _drawCoin(ctx, cx, cy, r, frame) {
  // Animated gold coin: frame 0,2=face, 1=turning, 3=edge
  if (frame === 3) {
    ctx.fillStyle = P.GOLD;
    ctx.fillRect(cx - r * 0.5, cy - 1, r, 2);
    ctx.fillStyle = P.GOLD_LT;
    ctx.fillRect(cx - r * 0.4, cy - 1, 2, 2);
    ctx.fillStyle = '#8B6914';
    ctx.fillRect(cx + r * 0.4 - 2, cy - 1, 2, 2);
    return;
  }

  const squish = frame === 1 ? 0.55 : 1;

  ctx.save();
  ctx.translate(cx, cy);

  ctx.fillStyle = 'rgba(0,0,0,0.2)';
  ctx.beginPath();
  ctx.ellipse(1, 1, r * squish, r * 0.65, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.scale(squish, 1);

  const grad = ctx.createRadialGradient(-r * 0.2, -r * 0.2, 0, 0, 0, r);
  grad.addColorStop(0, '#F5D060');
  grad.addColorStop(0.4, P.GOLD);
  grad.addColorStop(1, '#8B6914');
  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.arc(0, 0, r, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#B8860B';
  ctx.beginPath();
  ctx.arc(0, 0, r * 0.65, 0, Math.PI * 2);
  ctx.fill();

  if (squish > 0.5) {
    ctx.fillStyle = P.GOLD_LT;
    ctx.font = `bold ${Math.floor(r * 1.1)}px monospace`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('$', 0, 0);

    ctx.fillStyle = 'rgba(255,255,255,0.3)';
    ctx.beginPath();
    ctx.arc(-r * 0.25, -r * 0.3, r * 0.25, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.restore();
}

// ─── Vignette ─────────────────────────────────────────────────────────────────
function drawVignette(ctx, W, H) {
  const grad = ctx.createRadialGradient(W / 2, H / 2, H * 0.25, W / 2, H / 2, H * 0.85);
  grad.addColorStop(0, 'rgba(0,0,0,0)');
  grad.addColorStop(1, 'rgba(0,0,0,0.2)');
  ctx.globalAlpha = 1;
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, W, H);
}

// ─── Maze ─────────────────────────────────────────────────────────────────────
export function drawMaze(ctx, maze, doorOverlays, floorNum = 1) {
  const W = maze[0].length * CELL_SIZE;
  const H = maze.length * CELL_SIZE;

  // Wallpaper background (per floor)
  const floorMod = ((floorNum - 1) % 4) + 1;
  if (wallpaperPatterns[floorMod]) {
    ctx.fillStyle = wallpaperPatterns[floorMod];
    ctx.fillRect(0, 0, W, H);
  }

  const floorOffset = (floorNum - 1) % 2;

  for (let row = 0; row < maze.length; row++) {
    for (let col = 0; col < maze[row].length; col++) {
      const cell = maze[row][col];
      const x = col * CELL_SIZE;
      const y = row * CELL_SIZE;
      const S = CELL_SIZE;

      if (cell === WALL) {
        _drawWall(ctx, x, y, S, row, floorNum);
      } else if (cell === FLOOR) {
        _drawFloor(ctx, x, y, S, row, col, floorOffset, floorNum);
      } else if (cell === DOOR_JUNCTION) {
        _drawFloor(ctx, x, y, S, row, col, floorOffset, floorNum);
        ctx.strokeStyle = P.GOLD;
        ctx.lineWidth = 1;
        ctx.strokeRect(x + 1, y + 1, S - 2, S - 2);
      } else if (cell === STASH) {
        _drawFloor(ctx, x, y, S, row, col, floorOffset, floorNum);
        // Glow aura
        ctx.fillStyle = 'rgba(212,160,23,0.15)';
        ctx.beginPath();
        ctx.arc(x + S / 2, y + S / 2, 9, 0, Math.PI * 2);
        ctx.fill();
        _drawCoin(ctx, x + S / 2, y + S / 2, 6, 0);
      } else if (cell === LIFT) {
        ctx.fillStyle = P.WALL_MID;
        ctx.fillRect(x, y, S, S);
        ctx.fillStyle = P.GOLD;
        ctx.fillRect(x + 2, y + 2, S - 4, S - 4);
        ctx.fillStyle = P.NAVY;
        ctx.font = 'bold 7px monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('UP', x + S / 2, y + S / 2);
      } else if (cell === DOWN_LIFT) {
        ctx.fillStyle = P.WALL_MID;
        ctx.fillRect(x, y, S, S);
        ctx.fillStyle = '#4A90D9';
        ctx.fillRect(x + 2, y + 2, S - 4, S - 4);
        ctx.fillStyle = P.CREAM;
        ctx.font = 'bold 7px monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('DN', x + S / 2, y + S / 2);
      }
    }
  }

  // Door overlays
  if (doorOverlays) {
    doorOverlays.forEach(d => {
      const x = d.col * CELL_SIZE;
      const y = d.row * CELL_SIZE;
      _drawDoor(ctx, x, y, CELL_SIZE, d, floorNum);
    });
  }
}

function _drawWall(ctx, x, y, S, row, floorNum = 1) {
  const floorMod = (floorNum - 1) % 4;

  if (floorMod === 0) {
    // Floor 1: Classic dark brick
    ctx.fillStyle = '#6B3410';
    ctx.fillRect(x, y, S, S);
    ctx.fillStyle = '#8B4513';
    ctx.fillRect(x, y, S, 2);
    ctx.fillRect(x, y, 2, S);
    ctx.fillStyle = '#4A2410';
    ctx.fillRect(x, y + S - 2, S, 2);
    ctx.fillRect(x + S - 2, y, 2, S);
    // Brick pattern
    ctx.fillStyle = '#5A3110';
    for (let my = 4; my < S; my += 4) {
      ctx.fillRect(x, y + my, S, 1);
    }
    const vx = ((row % 2) * (S / 2) + S / 2) % S;
    ctx.fillRect(x + vx, y, 1, S);
  } else if (floorMod === 1) {
    // Floor 2: Teal/turquoise modern
    ctx.fillStyle = '#1F5A54';
    ctx.fillRect(x, y, S, S);
    ctx.fillStyle = '#2D8A7D';
    ctx.fillRect(x, y, S, 2);
    ctx.fillRect(x, y, 2, S);
    ctx.fillStyle = '#0F3A34';
    ctx.fillRect(x, y + S - 2, S, 2);
    ctx.fillRect(x + S - 2, y, 2, S);
    // Decorative grid
    ctx.fillStyle = 'rgba(255,255,255,0.08)';
    ctx.fillRect(x + S / 2 - 1, y, 2, S);
    ctx.fillRect(x, y + S / 2 - 1, S, 2);
  } else if (floorMod === 2) {
    // Floor 3: Light blue panels
    ctx.fillStyle = '#4A8BC2';
    ctx.fillRect(x, y, S, S);
    ctx.fillStyle = '#5DA5D4';
    ctx.fillRect(x, y, S, 2);
    ctx.fillRect(x, y, 2, S);
    ctx.fillStyle = '#3A6BA2';
    ctx.fillRect(x, y + S - 2, S, 2);
    ctx.fillRect(x + S - 2, y, 2, S);
    // Panel lines
    ctx.strokeStyle = '#2A5B92';
    ctx.lineWidth = 0.5;
    ctx.strokeRect(x + 2, y + 2, S - 4, S - 4);
  } else {
    // Floor 4: Purple ornate
    ctx.fillStyle = '#7A4F8C';
    ctx.fillRect(x, y, S, S);
    ctx.fillStyle = '#9B6DB4';
    ctx.fillRect(x, y, S, 2);
    ctx.fillRect(x, y, 2, S);
    ctx.fillStyle = '#5A3F6C';
    ctx.fillRect(x, y + S - 2, S, 2);
    ctx.fillRect(x + S - 2, y, 2, S);
    // Ornate corners
    ctx.fillStyle = '#D4A5E8';
    ctx.fillRect(x + 2, y + 2, 2, 2);
    ctx.fillRect(x + S - 4, y + 2, 2, 2);
    ctx.fillRect(x + 2, y + S - 4, 2, 2);
    ctx.fillRect(x + S - 4, y + S - 4, 2, 2);
  }
}

function _drawFloor(ctx, x, y, S, row, col, offset, floorNum = 1) {
  const light = (row + col + offset) % 2 === 0;

  // Choose floor colors based on floor number
  let lightColor, darkColor;
  const floorMod = (floorNum - 1) % 4;
  if (floorMod === 0) {
    lightColor = P.FLOOR_1_LT;
    darkColor = P.FLOOR_1_DK;
  } else if (floorMod === 1) {
    lightColor = P.FLOOR_2_LT;
    darkColor = P.FLOOR_2_DK;
  } else if (floorMod === 2) {
    lightColor = P.FLOOR_3_LT;
    darkColor = P.FLOOR_3_DK;
  } else {
    lightColor = P.FLOOR_4_LT;
    darkColor = P.FLOOR_4_DK;
  }

  ctx.fillStyle = light ? lightColor : darkColor;
  ctx.fillRect(x, y, S, S);
  // Subtle grout lines
  ctx.fillStyle = 'rgba(0,0,0,0.08)';
  ctx.fillRect(x, y, S, 1);
  ctx.fillRect(x, y, 1, S);
}

function _drawDoor(ctx, x, y, S, d, floorNum = 1) {
  // Full square with answer number
  const floorMod = (floorNum - 1) % 4;
  const doorColors = ['#4A2410', '#1F5A54', '#3A6BA2', '#5A3F6C'];
  ctx.fillStyle = doorColors[floorMod];
  ctx.fillRect(x, y, S, S);

  ctx.strokeStyle = P.GOLD;
  ctx.lineWidth = 1.5;
  ctx.strokeRect(x + 1, y + 1, S - 2, S - 2);

  const text = String(d.value);
  ctx.font = 'bold 10px monospace';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = '#FFFFFF';
  ctx.fillText(text, x + S / 2, y + S / 2);

  // Wrong answer flash: red X
  if (d.flash > 0) {
    ctx.fillStyle = P.RED;
    ctx.globalAlpha = Math.min(1, d.flash / 150);
    for (let i = 0; i < S - 4; i++) {
      ctx.fillRect(x + 2 + i, y + 2 + i, 2, 2);
      ctx.fillRect(x + S - 4 - i, y + 2 + i, 2, 2);
    }
    ctx.globalAlpha = 1;
  }
}

function _roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.arcTo(x + w, y, x + w, y + r, r);
  ctx.lineTo(x + w, y + h - r);
  ctx.arcTo(x + w, y + h, x + w - r, y + h, r);
  ctx.lineTo(x + r, y + h);
  ctx.arcTo(x, y + h, x, y + h - r, r);
  ctx.lineTo(x, y + r);
  ctx.arcTo(x, y, x + r, y, r);
  ctx.closePath();
}

// ─── Bellhop ─────────────────────────────────────────────────────────────────
export function drawBellhop(ctx, bx, by, dir = 'down', walkFrame = 0, floorNum = 1) {
  const px = bx * CELL_SIZE;
  const py = by * CELL_SIZE;
  const sprites = getBellhopSprites(floorNum);
  const frames = sprites[dir] || sprites.down;
  const frame = frames[walkFrame % frames.length];
  drawSprite(ctx, frame, px, py, 1);
}

// ─── Sum banner ───────────────────────────────────────────────────────────────
export function drawSumBanner(ctx, junction, sum, maze, floorNum = 1) {
  if (!junction || !sum) return;
  const cx = junction.col * CELL_SIZE + CELL_SIZE / 2;

  const isHorizontal = maze &&
    maze[junction.row]?.[junction.col - 1] !== WALL &&
    maze[junction.row]?.[junction.col + 1] !== WALL;

  const offset = isHorizontal ? 3 : 4;
  const cy = junction.row * CELL_SIZE + (offset * CELL_SIZE);

  const text = `${sum.a} ${sum.operator} ${sum.b} = ?`;
  ctx.font = 'bold 12px monospace';
  const pad = 7;
  const tw = ctx.measureText(text).width;
  const bw = tw + pad * 2;
  const bh = 20;

  // Shadow
  ctx.fillStyle = 'rgba(0,0,0,0.6)';
  _roundRect(ctx, cx - bw / 2 + 1, cy - bh / 2 + 2, bw, bh, 4);
  ctx.fill();

  // Badge background — per floor theme
  const floorMod = (floorNum - 1) % 4;
  const sumColors = ['#4A2410', '#1F5A54', '#3A6BA2', '#5A3F6C'];
  ctx.fillStyle = sumColors[floorMod];
  _roundRect(ctx, cx - bw / 2, cy - bh / 2, bw, bh, 4);
  ctx.fill();

  // Gold border
  ctx.strokeStyle = P.GOLD;
  ctx.lineWidth = 2;
  _roundRect(ctx, cx - bw / 2, cy - bh / 2, bw, bh, 4);
  ctx.stroke();

  // Text
  ctx.fillStyle = '#FFFFFF';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, cx, cy);
}

// ─── Particles ────────────────────────────────────────────────────────────────
export function updateParticles(particles, dt) {
  const dtS = dt / 1000;
  for (let i = particles.length - 1; i >= 0; i--) {
    const p = particles[i];
    p.x += p.vx * dtS;
    p.y += p.vy * dtS;
    if (p.type === 'coin') {
      p.vy += p.gravity * dtS * 60; // px/s² gravity
      p.frame = (p.frame || 0);
      p.frameTick = (p.frameTick || 0) + dt;
      if (p.frameTick >= 80) { p.frame = (p.frame + 1) % 4; p.frameTick = 0; }
    } else if (p.type === 'ray') {
      p.len += 3;
    }
    p.life -= dt;
    if (p.life <= 0) particles.splice(i, 1);
  }
}

export function spawnCoins(particles, col, row, targetX, targetY) {
  for (let i = 0; i < 8; i++) {
    const angle = (Math.PI * 2 * i) / 8 + (Math.random() - 0.5) * 0.5;
    const speed = 35 + Math.random() * 40;
    particles.push({
      type: 'coin',
      x: col * CELL_SIZE + CELL_SIZE / 2,
      y: row * CELL_SIZE + CELL_SIZE / 2,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed - 25,
      gravity: 0.15,
      life: 700,
      maxLife: 700,
      frame: 0,
      frameTick: 0,
      targetX, targetY,
    });
  }
}

export function spawnLightRays(particles, col, row) {
  for (let i = 0; i < 8; i++) {
    const angle = (Math.PI * 2 * i) / 8;
    particles.push({
      type: 'ray',
      x: col * CELL_SIZE + CELL_SIZE / 2,
      y: row * CELL_SIZE + CELL_SIZE / 2,
      vx: Math.cos(angle),
      vy: Math.sin(angle),
      len: 2,
      life: 350,
      maxLife: 350,
    });
  }
}

export function spawnMoneyRemoval(particles, col, row, amount) {
  for (let i = 0; i < 6; i++) {
    const angle = (Math.PI * 2 * i) / 6 + (Math.random() - 0.5) * 0.4;
    const speed = 30 + Math.random() * 30;
    particles.push({
      type: 'removal',
      x: col * CELL_SIZE + CELL_SIZE / 2,
      y: row * CELL_SIZE + CELL_SIZE / 2,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed - 30,
      gravity: 0.2,
      life: 600,
      maxLife: 600,
      amount,
    });
  }
}

export function drawParticles(ctx, particles) {
  particles.forEach(p => {
    const alpha = Math.min(1, p.life / p.maxLife * 2);
    ctx.globalAlpha = alpha;

    if (p.type === 'ray') {
      ctx.strokeStyle = P.GOLD_LT;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(p.x, p.y);
      ctx.lineTo(p.x + p.vx * p.len, p.y + p.vy * p.len);
      ctx.stroke();
    } else if (p.type === 'removal') {
      // Money removal particle (red/orange)
      ctx.fillStyle = P.RED;
      ctx.fillRect(p.x - 2, p.y - 2, 4, 4);
    } else if (p.type === 'coin') {
      _drawCoin(ctx, p.x, p.y, 5, p.frame);
    }
  });
  ctx.globalAlpha = 1;
}

// ─── HUD ──────────────────────────────────────────────────────────────────────
export function drawHUD(ctx, state, W, H, showFloor = true) {
  // Money badge with coin icon
  const moneyText = `${Math.floor(state.displayMoney)}`;
  ctx.font = 'bold 9px monospace';
  const coinW = 11;
  const mw = ctx.measureText(moneyText).width + 10 + coinW;
  ctx.fillStyle = P.NAVY;
  _roundRect(ctx, 2, 2, mw, 12, 2);
  ctx.fill();
  ctx.strokeStyle = P.GOLD;
  ctx.lineWidth = 1.5;
  _roundRect(ctx, 2, 2, mw, 12, 2);
  ctx.stroke();
  _drawCoin(ctx, 9, 8, 4, 0);
  ctx.fillStyle = '#FFFFFF';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  ctx.fillText(moneyText, 9 + 6, 8);

  // Inflation badge (right side, next to mute)
  const inflText2 = state.inflationEnabled !== false ? 'INFL ON' : 'INFL OFF';
  ctx.font = '7px monospace';
  const inflW2 = ctx.measureText(inflText2).width + 8;
  const muteText2 = isMuted() ? '[M]ON' : '[M]OFF';
  const muteW2 = ctx.measureText(muteText2).width + 8;
  const inflX2 = W - muteW2 - 4 - inflW2;
  ctx.fillStyle = state.inflationEnabled !== false ? P.BURGUNDY : P.WALL_MID;
  _roundRect(ctx, inflX2, 2, inflW2, 12, 2);
  ctx.fill();
  ctx.strokeStyle = state.inflationEnabled !== false ? P.RED : P.WALL_LT;
  ctx.lineWidth = 1;
  _roundRect(ctx, inflX2, 2, inflW2, 12, 2);
  ctx.stroke();
  ctx.fillStyle = state.inflationEnabled !== false ? '#FFFFFF' : P.CREAM_DK;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(inflText2, inflX2 + inflW2 / 2, 8);

  // Floor badge (hotel room number plate style)
  if (showFloor) {
    const floorText = `FLOOR ${state.currentFloor}`;
    ctx.font = 'bold 9px monospace';
    const fw = ctx.measureText(floorText).width + 10;
    ctx.fillStyle = P.WOOD_MID;
    _roundRect(ctx, W / 2 - fw / 2, 2, fw, 12, 2);
    ctx.fill();
    ctx.strokeStyle = P.GOLD;
    ctx.lineWidth = 1.5;
    _roundRect(ctx, W / 2 - fw / 2, 2, fw, 12, 2);
    ctx.stroke();
    ctx.fillStyle = '#FFFFFF';
    ctx.textAlign = 'center';
    ctx.fillText(floorText, W / 2, 8);
  }

  // Title watermark
  ctx.fillStyle = 'rgba(245,200,66,0.5)';
  ctx.font = '5px monospace';
  ctx.textAlign = 'right';
  ctx.fillText('GRAND HOTEL GOLD', W - muteW2 - inflW2 - 8, 8);

  // Mute badge
  ctx.font = '7px monospace';
  ctx.fillStyle = isMuted() ? P.BURGUNDY : P.NAVY;
  _roundRect(ctx, W - muteW2 - 2, 2, muteW2, 12, 2);
  ctx.fill();
  ctx.strokeStyle = isMuted() ? P.RED : P.WALL_MID;
  ctx.lineWidth = 1;
  _roundRect(ctx, W - muteW2 - 2, 2, muteW2, 12, 2);
  ctx.stroke();
  ctx.fillStyle = isMuted() ? '#FFFFFF' : P.CREAM_DK;
  ctx.textAlign = 'right';
  ctx.fillText(muteText2, W - 6, 8);

  // Combo badge
  if (state.streak >= 2) {
    const mult = state.streak >= 4 ? 2.5 : state.streak === 3 ? 2.0 : 1.5;
    const comboText = `×${mult} COMBO`;
    ctx.font = 'bold 9px monospace';
    const cw = ctx.measureText(comboText).width + 10;
    ctx.fillStyle = P.BURGUNDY;
    _roundRect(ctx, 2, H - 14, cw, 12, 2);
    ctx.fill();
    // Star-burst border
    ctx.strokeStyle = P.GOLD_LT;
    ctx.lineWidth = 1.5;
    _roundRect(ctx, 2, H - 14, cw, 12, 2);
    ctx.stroke();
    // Inner accent line
    ctx.strokeStyle = P.GOLD;
    ctx.lineWidth = 0.5;
    _roundRect(ctx, 4, H - 12, cw - 4, 8, 1);
    ctx.stroke();
    ctx.fillStyle = '#FFFFFF';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillText(comboText, 7, H - 8);
  }
}

export function drawPauseOverlay(ctx, W, H) {
  ctx.fillStyle = 'rgba(0,0,0,0.65)';
  ctx.fillRect(0, 0, W, H);
  ctx.fillStyle = P.GOLD_LT;
  ctx.font = 'bold 14px monospace';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('PAUSED', W / 2, H / 2 - 8);
  ctx.fillStyle = P.CREAM;
  ctx.font = '8px monospace';
  ctx.fillText('press SPACE to resume', W / 2, H / 2 + 8);
}

export function drawBuildScreen(ctx, state, selectedIdx, W, H) {
  ctx.fillStyle = P.NAVY;
  ctx.fillRect(0, 0, W, H);

  _drawHotelSilhouette(ctx, state.hotel, W);

  ctx.fillStyle = P.GOLD_LT;
  ctx.font = 'bold 10px monospace';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'top';
  ctx.fillText('GRAND HOTEL GOLD', W / 2, 18);

  const stars = state.hotel.stars || 1;
  ctx.fillStyle = P.GOLD;
  ctx.fillText('★'.repeat(stars) + '☆'.repeat(3 - stars), W / 2, 30);

  ctx.fillStyle = P.CREAM;
  ctx.font = '9px monospace';
  ctx.fillText(`Bank: $${Math.floor(state.money)}`, W / 2, 42);

  const items = _buildItems(state);
  items.forEach((item, i) => {
    const iy = 58 + i * 14;
    const selected = i === selectedIdx;
    ctx.fillStyle = selected ? P.GOLD : (item.locked ? P.WALL_LT : P.CREAM);
    ctx.textAlign = 'left';
    ctx.font = selected ? 'bold 8px monospace' : '8px monospace';
    const prefix = selected ? '▶ ' : '  ';
    const suffix = item.locked ? ' (locked)' : item.canAfford ? '' : ` ($${item.cost})`;
    ctx.fillText(`${prefix}${item.label}${suffix}`, 8, iy);
  });

  const ny = H - 14;
  ctx.fillStyle = selectedIdx === items.length ? P.GOLD_LT : P.CREAM;
  ctx.font = selectedIdx === items.length ? 'bold 9px monospace' : '9px monospace';
  ctx.textAlign = 'center';
  ctx.fillText(selectedIdx === items.length ? '▶ NEXT FLOOR ◀' : 'NEXT FLOOR  (↓)', W / 2, ny);

  ctx.fillStyle = P.WALL_LT;
  ctx.font = '7px monospace';
  ctx.fillText('↑↓ navigate   SPACE/ENTER select', W / 2, H - 4);
}

function _buildItems(state) {
  const { hotel, money } = state;
  const rooms = hotel.rooms || 0;
  const floors = hotel.floors || 1;
  const items = [];
  const roomCosts = [200, 300, 350];
  for (let i = 0; i < 3; i++) {
    if (rooms <= i) {
      items.push({ label: `Room ${i + 1}`, cost: roomCosts[i], locked: rooms < i, canAfford: money >= roomCosts[i], action: 'room', idx: i });
      break;
    }
  }
  if (rooms >= 3) {
    items.push({ label: `Floor ${floors + 1}`, cost: 1000, locked: false, canAfford: money >= 1000, action: 'floor' });
  }
  return items;
}

function _drawHotelSilhouette(ctx, hotel, W) {
  const rooms = hotel.rooms || 0;
  const floors = hotel.floors || 1;
  const bx = W / 2 - 20;
  const baseY = 16;
  const fw = 40, fh = 8;

  for (let f = 0; f < floors; f++) {
    const fy = baseY - f * (fh + 1);
    ctx.fillStyle = f === 0 ? P.WOOD_MID : P.BURGUNDY;
    ctx.fillRect(bx, fy - fh, fw, fh);
    const winCount = f === 0 ? rooms : 3;
    for (let w = 0; w < winCount; w++) {
      ctx.fillStyle = P.GOLD_LT;
      ctx.fillRect(bx + 4 + w * 10, fy - fh + 2, 6, 4);
    }
    ctx.strokeStyle = P.GOLD;
    ctx.lineWidth = 0.5;
    ctx.strokeRect(bx, fy - fh, fw, fh);
  }
}

export function drawVignetteOverlay(ctx, W, H) {
  drawVignette(ctx, W, H);
}

export function getBuildItems(state) {
  return _buildItems(state);
}
