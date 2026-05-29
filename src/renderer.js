import { WALL, FLOOR, DOOR_JUNCTION, STASH, LIFT, CELL_SIZE } from './maze.js';
import { isMuted } from './audio.js';
import { PALETTE, drawSprite, BELLHOP_SPRITES } from './sprites.js';

const P = PALETTE;

// ─── Wallpaper pattern (init once) ───────────────────────────────────────────
let wallpaperPattern = null;

function buildWallpaperPattern(ctx) {
  const size = 16;
  const oc = document.createElement('canvas');
  oc.width = size; oc.height = size;
  const ox = oc.getContext('2d');

  ox.fillStyle = P.NAVY;
  ox.fillRect(0, 0, size, size);

  // Diamond outline
  ox.strokeStyle = P.WALL_MID;
  ox.lineWidth = 0.5;
  ox.beginPath();
  ox.moveTo(size / 2, 0);
  ox.lineTo(size, size / 2);
  ox.lineTo(size / 2, size);
  ox.lineTo(0, size / 2);
  ox.closePath();
  ox.stroke();

  // Center dot
  ox.fillStyle = P.WALL_LT;
  ox.fillRect(size / 2 - 1, size / 2 - 1, 2, 2);

  wallpaperPattern = ctx.createPattern(oc, 'repeat');
}

export function initRenderer(ctx) {
  buildWallpaperPattern(ctx);
}

// ─── Vignette ─────────────────────────────────────────────────────────────────
function drawVignette(ctx, W, H) {
  const grad = ctx.createRadialGradient(W / 2, H / 2, H * 0.25, W / 2, H / 2, H * 0.85);
  grad.addColorStop(0, 'rgba(0,0,0,0)');
  grad.addColorStop(1, 'rgba(0,0,0,0.5)');
  ctx.globalAlpha = 1;
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, W, H);
}

// ─── Maze ─────────────────────────────────────────────────────────────────────
export function drawMaze(ctx, maze, doorOverlays, floorNum = 1) {
  const W = maze[0].length * CELL_SIZE;
  const H = maze.length * CELL_SIZE;

  // Wallpaper background
  if (wallpaperPattern) {
    ctx.fillStyle = wallpaperPattern;
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
        _drawWall(ctx, x, y, S, row);
      } else if (cell === FLOOR) {
        _drawFloor(ctx, x, y, S, row, col, floorOffset);
      } else if (cell === DOOR_JUNCTION) {
        _drawFloor(ctx, x, y, S, row, col, floorOffset);
        ctx.strokeStyle = P.GOLD;
        ctx.lineWidth = 1;
        ctx.strokeRect(x + 1, y + 1, S - 2, S - 2);
      } else if (cell === STASH) {
        _drawFloor(ctx, x, y, S, row, col, floorOffset);
        // Sparkle stash indicator
        ctx.fillStyle = P.GOLD_LT;
        ctx.beginPath();
        ctx.arc(x + S / 2, y + S / 2, 3, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = P.WHITE;
        ctx.fillRect(x + S / 2 - 1, y + S / 2 - 1, 2, 2);
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
      }
    }
  }

  // Door overlays
  if (doorOverlays) {
    doorOverlays.forEach(d => {
      const x = d.col * CELL_SIZE;
      const y = d.row * CELL_SIZE;
      _drawDoor(ctx, x, y, CELL_SIZE, d);
    });
  }
}

function _drawWall(ctx, x, y, S, row) {
  // Base
  ctx.fillStyle = P.WALL_MID;
  ctx.fillRect(x, y, S, S);
  // Top highlight
  ctx.fillStyle = P.WALL_LT;
  ctx.fillRect(x, y, S, 2);
  ctx.fillRect(x, y, 2, S);
  // Bottom shadow
  ctx.fillStyle = P.WALL_DARK;
  ctx.fillRect(x, y + S - 2, S, 2);
  ctx.fillRect(x + S - 2, y, 2, S);
  // Brick mortar lines every 4px
  ctx.fillStyle = P.WALL_DARK;
  const brickH = 4;
  const brickOffset = (row % 2) * (S / 2); // stagger rows
  for (let my = brickH; my < S; my += brickH) {
    ctx.fillRect(x, y + my, S, 1);
  }
  // Vertical mortar at staggered offset
  const vx = (brickOffset + S / 2) % S;
  ctx.fillRect(x + vx, y, 1, S);
}

function _drawFloor(ctx, x, y, S, row, col, offset) {
  const light = (row + col + offset) % 2 === 0;
  ctx.fillStyle = light ? P.CREAM : P.CREAM_DK;
  ctx.fillRect(x, y, S, S);
  // Subtle grout lines
  ctx.fillStyle = 'rgba(0,0,0,0.08)';
  ctx.fillRect(x, y, S, 1);
  ctx.fillRect(x, y, 1, S);
}

function _drawDoor(ctx, x, y, S, d) {
  // Wood base
  ctx.fillStyle = P.WOOD_DARK;
  ctx.fillRect(x, y, S, S);
  // Wood grain lines
  ctx.fillStyle = P.WOOD_MID;
  for (let gx = 2; gx < S; gx += 3) {
    ctx.fillRect(x + gx, y + 1, 1, S - 2);
  }
  // Left highlight
  ctx.fillStyle = P.WOOD_LT;
  ctx.fillRect(x, y, 2, S);
  // Gold frame border
  ctx.strokeStyle = P.GOLD;
  ctx.lineWidth = 2;
  ctx.strokeRect(x + 1, y + 1, S - 2, S - 2);
  // Gold door knob (right side, middle)
  ctx.fillStyle = P.GOLD_LT;
  ctx.fillRect(x + S - 4, y + S / 2 - 2, 2, 3);
  ctx.fillStyle = P.GOLD;
  ctx.fillRect(x + S - 5, y + S / 2 - 1, 2, 2);

  // Wrong answer flash: red X
  if (d.flash > 0) {
    ctx.fillStyle = P.RED;
    ctx.globalAlpha = Math.min(1, d.flash / 150);
    // X diagonal 1
    for (let i = 0; i < S - 4; i++) {
      ctx.fillRect(x + 2 + i, y + 2 + i, 2, 2);
      ctx.fillRect(x + S - 4 - i, y + 2 + i, 2, 2);
    }
    ctx.globalAlpha = 1;
  }

  // Answer value badge — above door, but below HUD if too close to top
  const text = String(d.value);
  ctx.font = 'bold 8px monospace';
  const tw = ctx.measureText(text).width;
  const bw = tw + 6;
  const bh = 10;
  const bx = x + S / 2 - bw / 2;
  const HUD_H = 16;
  const by = (y - bh - 1 < HUD_H) ? y + S + 1 : y - bh - 1;
  ctx.fillStyle = P.GOLD;
  _roundRect(ctx, bx, by, bw, bh, 2);
  ctx.fill();
  ctx.fillStyle = P.NAVY;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, x + S / 2, by + bh / 2);
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
export function drawBellhop(ctx, bx, by, dir = 'down', walkFrame = 0) {
  const px = bx * CELL_SIZE;
  const py = by * CELL_SIZE;
  const frames = BELLHOP_SPRITES[dir] || BELLHOP_SPRITES.down;
  const frame = frames[walkFrame % frames.length];
  // Center 8-wide sprite in CELL_SIZE cell
  const ox = Math.floor((CELL_SIZE - 8) / 2);
  drawSprite(ctx, frame, px + ox, py);
}

// ─── Sum banner ───────────────────────────────────────────────────────────────
export function drawSumBanner(ctx, junction, sum, maze) {
  if (!junction || !sum) return;
  const cx = junction.col * CELL_SIZE + CELL_SIZE / 2;

  const isHorizontal = maze &&
    maze[junction.row]?.[junction.col - 1] !== WALL &&
    maze[junction.row]?.[junction.col + 1] !== WALL;

  const offset = isHorizontal ? 3 : 4;
  const cy = junction.row * CELL_SIZE + (offset * CELL_SIZE);

  const text = `${sum.a} + ${sum.b} = ?`;
  ctx.font = 'bold 12px monospace';
  const pad = 7;
  const tw = ctx.measureText(text).width;
  const bw = tw + pad * 2;
  const bh = 20;

  // Shadow
  ctx.fillStyle = 'rgba(0,0,0,0.6)';
  _roundRect(ctx, cx - bw / 2 + 1, cy - bh / 2 + 2, bw, bh, 4);
  ctx.fill();

  // Badge background
  ctx.fillStyle = P.NAVY;
  _roundRect(ctx, cx - bw / 2, cy - bh / 2, bw, bh, 4);
  ctx.fill();

  // Gold border
  ctx.strokeStyle = P.GOLD;
  ctx.lineWidth = 2;
  _roundRect(ctx, cx - bw / 2, cy - bh / 2, bw, bh, 4);
  ctx.stroke();

  // Text
  ctx.fillStyle = P.GOLD_LT;
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
    } else {
      // Coin spin: 4 frames
      ctx.fillStyle = p.frame === 0 || p.frame === 2 ? P.GOLD : P.GOLD_LT;
      const w = p.frame === 0 ? 4 : p.frame === 2 ? 4 : p.frame === 1 ? 3 : 1;
      ctx.fillRect(p.x - w / 2, p.y - 2, w, 4);
      // Glint on frame 0
      if (p.frame === 0) {
        ctx.fillStyle = P.WHITE;
        ctx.fillRect(p.x + 1, p.y - 2, 1, 1);
      }
    }
  });
  ctx.globalAlpha = 1;
}

// ─── HUD ──────────────────────────────────────────────────────────────────────
export function drawHUD(ctx, state, W, H, showFloor = true) {
  // Money badge
  const moneyText = `$${Math.floor(state.displayMoney)}`;
  ctx.font = 'bold 8px monospace';
  const mw = ctx.measureText(moneyText).width + 10;
  ctx.fillStyle = P.NAVY;
  _roundRect(ctx, 2, 2, mw, 12, 2);
  ctx.fill();
  ctx.strokeStyle = P.GOLD;
  ctx.lineWidth = 1.5;
  _roundRect(ctx, 2, 2, mw, 12, 2);
  ctx.stroke();
  ctx.fillStyle = P.CREAM;
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  ctx.fillText(moneyText, 7, 8);

  // Floor badge (hotel room number plate style)
  if (showFloor) {
    const floorText = `FLOOR ${state.currentFloor}`;
    const fw = ctx.measureText(floorText).width + 10;
    ctx.fillStyle = P.WOOD_MID;
    _roundRect(ctx, W / 2 - fw / 2, 2, fw, 12, 2);
    ctx.fill();
    ctx.strokeStyle = P.GOLD;
    ctx.lineWidth = 1.5;
    _roundRect(ctx, W / 2 - fw / 2, 2, fw, 12, 2);
    ctx.stroke();
    ctx.fillStyle = P.GOLD_LT;
    ctx.textAlign = 'center';
    ctx.fillText(floorText, W / 2, 8);
  }

  // Mute badge
  ctx.font = '7px monospace';
  const muteText = isMuted() ? '[M]OFF' : '[M]ON';
  const muteW = ctx.measureText(muteText).width + 8;
  ctx.fillStyle = P.NAVY;
  _roundRect(ctx, W - muteW - 2, 2, muteW, 12, 2);
  ctx.fill();
  ctx.strokeStyle = P.WALL_MID;
  ctx.lineWidth = 1;
  _roundRect(ctx, W - muteW - 2, 2, muteW, 12, 2);
  ctx.stroke();
  ctx.fillStyle = P.CREAM_DK;
  ctx.textAlign = 'right';
  ctx.fillText(muteText, W - 6, 8);

  // Combo badge
  if (state.streak >= 2) {
    const mult = state.streak >= 4 ? 2.5 : state.streak === 3 ? 2.0 : 1.5;
    const comboText = `×${mult} COMBO`;
    ctx.font = 'bold 8px monospace';
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
    ctx.fillStyle = P.CREAM;
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
