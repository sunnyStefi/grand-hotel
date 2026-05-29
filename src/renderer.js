import { WALL, FLOOR, DOOR_JUNCTION, STASH, LIFT, CELL_SIZE } from './maze.js';
import { isMuted } from './audio.js';

// Colours
const C = {
  wall:        '#2a1a08',
  floor:       '#c8a46e',
  floorAlt:    '#b8945e',
  door:        '#f5c842',
  doorBorder:  '#c8860a',
  stash:       '#4ade80',
  lift:        '#38bdf8',
  bellhop:     '#e63946',
  cap:         '#1d3557',
  coin:        '#fbbf24',
  hud:         'rgba(0,0,0,0.55)',
  text:        '#fff8e7',
  gold:        '#f5c842',
  shadow:      'rgba(0,0,0,0.7)',
};

export function drawMaze(ctx, maze, doorOverlays) {
  for (let row = 0; row < maze.length; row++) {
    for (let col = 0; col < maze[row].length; col++) {
      const cell = maze[row][col];
      const x = col * CELL_SIZE;
      const y = row * CELL_SIZE;

      if (cell === WALL) {
        ctx.fillStyle = C.wall;
        ctx.fillRect(x, y, CELL_SIZE, CELL_SIZE);
        // inner bevel
        ctx.fillStyle = 'rgba(255,255,255,0.04)';
        ctx.fillRect(x, y, CELL_SIZE, 2);
        ctx.fillRect(x, y, 2, CELL_SIZE);
      } else if (cell === FLOOR) {
        ctx.fillStyle = (row + col) % 2 === 0 ? C.floor : C.floorAlt;
        ctx.fillRect(x, y, CELL_SIZE, CELL_SIZE);
      } else if (cell === DOOR_JUNCTION) {
        ctx.fillStyle = C.floor;
        ctx.fillRect(x, y, CELL_SIZE, CELL_SIZE);
        ctx.strokeStyle = C.doorBorder;
        ctx.lineWidth = 1.5;
        ctx.strokeRect(x + 1, y + 1, CELL_SIZE - 2, CELL_SIZE - 2);
      } else if (cell === STASH) {
        ctx.fillStyle = C.floor;
        ctx.fillRect(x, y, CELL_SIZE, CELL_SIZE);
        ctx.fillStyle = C.stash;
        ctx.beginPath();
        ctx.arc(x + CELL_SIZE / 2, y + CELL_SIZE / 2, 4, 0, Math.PI * 2);
        ctx.fill();
      } else if (cell === LIFT) {
        ctx.fillStyle = C.lift;
        ctx.fillRect(x, y, CELL_SIZE, CELL_SIZE);
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 9px monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('UP', x + CELL_SIZE / 2, y + CELL_SIZE / 2);
      }
    }
  }

  // Draw answer door overlays
  if (doorOverlays) {
    doorOverlays.forEach(d => {
      const x = d.col * CELL_SIZE;
      const y = d.row * CELL_SIZE;
      ctx.fillStyle = d.flash > 0 ? '#ff4444' : C.door;
      ctx.fillRect(x, y, CELL_SIZE, CELL_SIZE);
      ctx.strokeStyle = C.doorBorder;
      ctx.lineWidth = 1.5;
      ctx.strokeRect(x + 1, y + 1, CELL_SIZE - 2, CELL_SIZE - 2);
      ctx.fillStyle = '#1a0a00';
      ctx.font = 'bold 9px monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(String(d.value), x + CELL_SIZE / 2, y + CELL_SIZE / 2);
    });
  }
}

export function drawBellhop(ctx, bx, by, dir) {
  const px = bx * CELL_SIZE;
  const py = by * CELL_SIZE;
  // Body
  ctx.fillStyle = C.bellhop;
  ctx.fillRect(px + 3, py + 6, 10, 8);
  // Head
  ctx.fillStyle = '#f4a261';
  ctx.fillRect(px + 4, py + 2, 8, 7);
  // Cap
  ctx.fillStyle = C.cap;
  ctx.fillRect(px + 3, py + 1, 10, 3);
  ctx.fillRect(px + 2, py + 3, 12, 2);
}

export function drawSumBanner(ctx, junction, sum, maze) {
  if (!junction || !sum) return;
  const cx = junction.col * CELL_SIZE + CELL_SIZE / 2;

  // Detect if junction is horizontal or vertical based on adjacent cells
  const isHorizontal = maze &&
    maze[junction.row]?.[junction.col - 1] !== WALL &&
    maze[junction.row]?.[junction.col + 1] !== WALL;

  // Place banner 3 cells below for horizontal, 4 cells below for vertical (more space from bellhop)
  const offset = isHorizontal ? 3 : 4;
  const cy = junction.row * CELL_SIZE + (offset * CELL_SIZE);

  const text = `${sum.a} + ${sum.b} = ?`;
  ctx.font = 'bold 13px monospace';
  const pad = 6;
  const tw = ctx.measureText(text).width;
  const bw = tw + pad * 2;
  const bh = 18;
  ctx.fillStyle = 'rgba(26,10,0,0.88)';
  ctx.fillRect(cx - bw / 2, cy - bh / 2, bw, bh);
  ctx.strokeStyle = C.gold;
  ctx.lineWidth = 2;
  ctx.strokeRect(cx - bw / 2, cy - bh / 2, bw, bh);
  ctx.fillStyle = C.gold;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, cx, cy);
}

// Particles
export function updateParticles(particles, dt) {
  for (let i = particles.length - 1; i >= 0; i--) {
    const p = particles[i];
    p.x += p.vx * dt / 1000;
    p.y += p.vy * dt / 1000;
    p.vy += 60 * dt / 1000; // gravity
    p.life -= dt;
    if (p.life <= 0) particles.splice(i, 1);
  }
}

export function spawnCoins(particles, col, row, targetX, targetY) {
  for (let i = 0; i < 8; i++) {
    const angle = (Math.PI * 2 * i) / 8 + (Math.random() - 0.5) * 0.5;
    const speed = 30 + Math.random() * 40;
    particles.push({
      x: col * CELL_SIZE + CELL_SIZE / 2,
      y: row * CELL_SIZE + CELL_SIZE / 2,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed - 20,
      life: 600,
      maxLife: 600,
      targetX, targetY,
    });
  }
}

export function drawParticles(ctx, particles) {
  particles.forEach(p => {
    const alpha = Math.min(1, p.life / p.maxLife * 2);
    ctx.globalAlpha = alpha;
    ctx.fillStyle = C.coin;
    ctx.beginPath();
    ctx.arc(p.x, p.y, 2.5, 0, Math.PI * 2);
    ctx.fill();
  });
  ctx.globalAlpha = 1;
}

export function drawHUD(ctx, state, W, H, showFloor = true) {
  // Background strip
  ctx.fillStyle = C.hud;
  ctx.fillRect(0, 0, W, 14);

  // Money
  ctx.fillStyle = C.gold;
  ctx.font = 'bold 9px monospace';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  ctx.fillText(`$${Math.floor(state.displayMoney)}`, 4, 7);

  // Floor number (suppressed on build screen where it overlaps the title)
  if (showFloor) {
    ctx.textAlign = 'center';
    ctx.fillStyle = C.text;
    ctx.fillText(`FLOOR ${state.currentFloor}`, W / 2, 7);
  }

  // Combo
  if (state.streak >= 2) {
    const mult = state.streak >= 4 ? 2.5 : state.streak === 3 ? 2.0 : 1.5;
    ctx.fillStyle = '#fb923c';
    ctx.textAlign = 'left';
    ctx.fillText(`×${mult} COMBO`, 4, H - 7);
  }

  // Mute button
  ctx.textAlign = 'right';
  ctx.fillStyle = C.text;
  ctx.font = '9px monospace';
  ctx.fillText(isMuted() ? '[M]OFF' : '[M]ON', W - 3, 7);
}

export function drawPauseOverlay(ctx, W, H) {
  ctx.fillStyle = 'rgba(0,0,0,0.6)';
  ctx.fillRect(0, 0, W, H);
  ctx.fillStyle = C.gold;
  ctx.font = 'bold 12px monospace';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('PAUSED', W / 2, H / 2 - 8);
  ctx.fillStyle = C.text;
  ctx.font = '8px monospace';
  ctx.fillText('press SPACE to resume', W / 2, H / 2 + 6);
}

export function drawBuildScreen(ctx, state, selectedIdx, W, H) {
  // Background
  ctx.fillStyle = '#1a0a00';
  ctx.fillRect(0, 0, W, H);

  // Hotel silhouette
  _drawHotelSilhouette(ctx, state.hotel, W);

  // Title
  ctx.fillStyle = C.gold;
  ctx.font = 'bold 10px monospace';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'top';
  ctx.fillText('GRAND HOTEL GOLD', W / 2, 4);

  // Stars
  const stars = state.hotel.stars || 1;
  ctx.fillText('★'.repeat(stars) + '☆'.repeat(3 - stars), W / 2, 16);

  // Money
  ctx.fillStyle = C.text;
  ctx.font = '9px monospace';
  ctx.fillText(`Bank: $${Math.floor(state.money)}`, W / 2, 28);

  // Items
  const items = _buildItems(state);
  items.forEach((item, i) => {
    const iy = 44 + i * 14;
    const selected = i === selectedIdx;
    ctx.fillStyle = selected ? C.gold : (item.locked ? '#555' : C.text);
    ctx.textAlign = 'left';
    ctx.font = selected ? 'bold 8px monospace' : '8px monospace';
    const prefix = selected ? '▶ ' : '  ';
    const suffix = item.locked ? ' (locked)' : item.canAfford ? '' : ` ($${item.cost})`;
    ctx.fillText(`${prefix}${item.label}${suffix}`, 8, iy);
  });

  // Next floor button
  const ny = H - 14;
  ctx.fillStyle = selectedIdx === items.length ? C.gold : C.text;
  ctx.font = selectedIdx === items.length ? 'bold 9px monospace' : '9px monospace';
  ctx.textAlign = 'center';
  ctx.fillText(selectedIdx === items.length ? '▶ NEXT FLOOR ◀' : 'NEXT FLOOR  (↓)', W / 2, ny);

  ctx.fillStyle = '#666';
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
      items.push({
        label: `Room ${i + 1}`,
        cost: roomCosts[i],
        locked: rooms < i,
        canAfford: money >= roomCosts[i],
        action: 'room',
        idx: i,
      });
      break; // only show next purchasable room
    }
  }

  if (rooms >= 3) {
    items.push({
      label: `Floor ${floors + 1}`,
      cost: 1000,
      locked: false,
      canAfford: money >= 1000,
      action: 'floor',
    });
  }

  return items;
}

function _drawHotelSilhouette(ctx, hotel, W) {
  const rooms = hotel.rooms || 0;
  const floors = hotel.floors || 1;
  const bx = W / 2 - 20;
  const baseY = 42;
  const fw = 40, fh = 8;

  for (let f = 0; f < floors; f++) {
    const fy = baseY - f * (fh + 1);
    ctx.fillStyle = f === 0 ? '#c8860a' : '#e6a020';
    ctx.fillRect(bx, fy - fh, fw, fh);
    // windows
    const winCount = f === 0 ? rooms : 3;
    for (let w = 0; w < winCount; w++) {
      ctx.fillStyle = '#fef08a';
      ctx.fillRect(bx + 4 + w * 10, fy - fh + 2, 6, 4);
    }
  }
  // Stars above
  const stars = hotel.stars || 1;
  ctx.fillStyle = C.gold;
  ctx.font = '8px monospace';
  ctx.textAlign = 'center';
  ctx.fillText('★'.repeat(stars), W / 2, baseY - floors * (fh + 1) - 4);
}

export function getBuildItems(state) {
  return _buildItems(state);
}
