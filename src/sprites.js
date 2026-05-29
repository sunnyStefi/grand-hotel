// ─── Cute Cozy Pixel Rabbit Pack ─────────────────────────────────────────────
export const PALETTE = {
  // Rabbit outline
  CAT_OUTLINE: '#3F2C2A',
  // Soft cream fur
  CAT_FUR: '#FFE9C9',
  // Gentle shading
  CAT_SHADE: '#F5D6B0',
  // Big sparkling eyes
  CAT_EYES: '#26334A',
  // Eye highlights
  CAT_WHITE: '#FFFFFF',
  // Tiny pink nose
  CAT_NOSE: '#FF7A9E',
  // Blush cheeks
  BLUSH: '#FFBCCF',
  // Inner ear pink
  CAT_TAIL: '#FF9EB8',

  // Environment palette (unchanged)
  BURGUNDY: '#6B2737',
  BURGUNDY_LT: '#8B3A4A',
  GOLD: '#D4A017',
  GOLD_LT: '#F0C040',
  CREAM: '#F5E6C8',
  CREAM_DK: '#C8B99A',
  WALL_DARK: '#1A1A2E',
  WALL_MID: '#2D2D44',
  WALL_LT: '#3D3D5C',
  WOOD_DARK: '#3B1F0D',
  WOOD_MID: '#6B3A1F',
  WOOD_LT: '#8B5A2B',
  GREEN: '#2D6A4F',
  NAVY: '#16213E',
  WHITE: '#FFFFFF',
  RED: '#C0392B',
  FLOOR_1_LT: '#E8D4B8',
  FLOOR_1_DK: '#D4B896',
  FLOOR_2_LT: '#C8E6D6',
  FLOOR_2_DK: '#A8D4BC',
  FLOOR_3_LT: '#D4E8F5',
  FLOOR_3_DK: '#A8D4E8',
  FLOOR_4_LT: '#E8D4F5',
  FLOOR_4_DK: '#D8B8E8',
};

// ─── Sprite renderer ────────────────────────────────────────────────────────
export function drawSprite(ctx, grid, x, y, scale = 1) {
  for (let row = 0; row < grid.length; row++) {
    for (let col = 0; col < grid[row].length; col++) {
      const key = grid[row][col];
      if (!key) continue;
      ctx.fillStyle = PALETTE[key];
      ctx.fillRect(x + col * scale, y + row * scale, scale, scale);
    }
  }
}

// ─── aliases ────────────────────────────────────────────────────────────────
const _ = null;
const O = 'CAT_OUTLINE';
const F = 'CAT_FUR';
const S = 'CAT_SHADE';
const E = 'CAT_EYES';
const H = 'CAT_WHITE';
const B = 'BLUSH';
const N = 'CAT_NOSE';
const T = 'CAT_TAIL';

// ─── Cute Rabbit Sprites (Big Ears + Round Shape) ───────────────────────────

// DOWN - Front view with tall floppy ears
const RABBIT_DOWN = [
  [_,_,_,O,O,O,O,O,O,O,O,O,_,_,_,_],
  [_,_,O,F,F,F,F,F,F,F,F,F,O,_,_,_],
  [_,O,F,F,T,T,_,_,_,T,T,F,F,O,_,_],
  [_,O,F,T,T,T,_,_,_,T,T,T,F,O,_,_],
  [_,O,F,T,T,F,F,F,F,F,T,T,F,O,_,_],
  [_,O,F,F,F,E,H,E,E,H,E,F,F,O,_,_],
  [_,O,F,F,F,E,H,E,E,H,E,F,F,O,_,_],
  [_,O,F,F,F,F,N,F,F,N,F,F,F,O,_,_],
  [_,O,F,F,B,B,F,F,F,F,B,B,F,O,_,_],
  [_,O,F,F,F,F,F,F,F,F,F,F,F,O,_,_],
  [_,_,O,F,F,F,F,F,F,F,F,F,O,_,_,_],
  [_,_,_,O,O,F,F,F,F,F,O,O,_,_,_,_],
  [_,_,_,_,_,O,O,O,O,O,_,_,_,_,_,_],
  [_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_],
  [_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_],
  [_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_],
];

// UP - Back view with ears folded back
const RABBIT_UP = [
  [_,_,_,_,O,O,O,O,O,O,O,_,_,_,_,_],
  [_,_,O,O,F,F,T,T,T,F,F,O,O,_,_,_],
  [_,O,F,F,F,T,T,T,T,T,F,F,F,O,_,_],
  [_,O,F,F,F,T,T,F,F,T,T,F,F,O,_,_],
  [_,O,F,F,F,F,F,F,F,F,F,F,F,O,_,_],
  [_,O,F,F,F,F,F,F,F,F,F,F,F,O,_,_],
  [_,O,F,F,F,F,F,F,F,F,F,F,F,O,_,_],
  [_,O,F,F,F,F,F,F,F,F,F,F,F,O,_,_],
  [_,O,F,F,F,F,F,F,F,F,F,F,F,O,_,_],
  [_,O,F,F,F,F,F,F,F,F,F,F,F,O,_,_],
  [_,_,O,F,F,F,F,F,F,F,F,F,O,_,_,_],
  [_,_,_,O,F,F,F,F,F,F,F,O,_,_,_,_],
  [_,_,_,_,O,O,F,F,F,O,O,_,_,_,_,_],
  [_,_,_,_,_,_,O,O,O,_,_,_,_,_,_,_],
  [_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_],
  [_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_],
];

// LEFT
const RABBIT_LEFT = [
  [_,_,_,_,_,O,O,O,O,O,O,_,_,_,_,_],
  [_,_,_,O,O,F,F,T,T,F,F,O,_,_,_,_],
  [_,_,O,F,F,F,T,T,T,F,F,F,O,_,_,_],
  [_,O,F,F,F,T,T,T,T,F,F,F,F,O,_,_],
  [_,O,F,F,E,H,E,F,F,F,F,F,F,O,_,_],
  [_,O,F,F,E,H,E,F,F,F,F,F,F,O,_,_],
  [_,O,F,F,F,N,F,F,F,F,F,F,F,O,_,_],
  [_,O,F,B,B,F,F,F,F,F,F,F,F,O,_,_],
  [_,O,F,F,F,F,F,F,F,F,F,F,F,O,_,_],
  [_,O,F,F,F,F,F,F,F,F,F,F,O,_,_,_],
  [_,_,O,F,F,F,F,F,F,F,F,O,_,_,_,_],
  [_,_,_,O,F,F,F,F,F,F,O,_,_,_,_,_],
  [_,_,_,_,O,O,O,O,O,O,_,_,_,_,_,_],
  [_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_],
  [_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_],
  [_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_],
];

// RIGHT
const RABBIT_RIGHT = [
  [_,_,_,_,_,_,O,O,O,O,O,O,_,_,_,_],
  [_,_,_,_,O,F,F,T,T,F,F,O,O,_,_,_],
  [_,_,_,O,F,F,T,T,T,F,F,F,F,O,_,_],
  [_,_,O,F,F,T,T,T,T,T,F,F,F,O,_,_],
  [_,_,O,F,F,F,F,F,E,H,E,F,F,O,_,_],
  [_,_,O,F,F,F,F,F,E,H,E,F,F,O,_,_],
  [_,_,O,F,F,F,F,F,F,N,F,F,F,O,_,_],
  [_,_,O,F,F,F,F,F,F,B,B,F,F,O,_,_],
  [_,_,O,F,F,F,F,F,F,F,F,F,F,O,_,_],
  [_,_,_,O,F,F,F,F,F,F,F,F,O,_,_,_],
  [_,_,_,_,O,F,F,F,F,F,F,O,_,_,_,_],
  [_,_,_,_,_,O,F,F,F,F,O,_,_,_,_,_],
  [_,_,_,_,_,_,O,O,O,O,_,_,_,_,_,_],
  [_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_],
  [_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_],
  [_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_],
];

// ─── Sprite set export ──────────────────────────────────────────────────────
const RABBIT_SPRITES = {
  down:  [RABBIT_DOWN, RABBIT_DOWN, RABBIT_DOWN, RABBIT_DOWN],
  up:    [RABBIT_UP, RABBIT_UP, RABBIT_UP, RABBIT_UP],
  left:  [RABBIT_LEFT, RABBIT_LEFT, RABBIT_LEFT, RABBIT_LEFT],
  right: [RABBIT_RIGHT, RABBIT_RIGHT, RABBIT_RIGHT, RABBIT_RIGHT],
};

export function getCatSpritesForFloor(floorNum) {
  return RABBIT_SPRITES;
}

export const BELLHOP_SPRITES = RABBIT_SPRITES;