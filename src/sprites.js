// ─── Cute Cozy Pixel Bellhop Pack ────────────────────────────────────────────
export const PALETTE = {
  // Outline / uniform details
  CAT_OUTLINE: '#2C2C2C',
  // Skin tone
  CAT_FUR: '#FFDBB4',
  // Hair / hat shade
  CAT_SHADE: '#2C2C2C',
  // Eyes
  CAT_EYES: '#26334A',
  // Eye sparkle
  CAT_WHITE: '#FFFFFF',
  // Mouth
  CAT_NOSE: '#FF7A9E',
  // Blush
  BLUSH: '#FFBCCF',
  // Uniform red
  CAT_TAIL: '#C0392B',

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
const T = 'CAT_TAIL'; // uniform red
const G = 'GOLD';

// ─── Cute Bellhop Sprites (Person Shape) ────────────────────────────────────

// DOWN - Front view (more human proportions)
const BELLHOP_DOWN = [
  [_,_,_,_,_,O,O,O,O,O,_,_,_,_,_,_],
  [_,_,_,_,O,S,S,S,S,S,O,_,_,_,_,_],
  [_,_,_,O,S,S,S,S,S,S,S,O,_,_,_,_],
  [_,_,O,F,F,F,F,F,F,F,F,F,O,_,_,_],
  [_,O,F,F,E,H,E,F,F,E,H,F,F,O,_,_],
  [_,O,F,F,E,H,E,F,F,E,H,F,F,O,_,_],
  [_,O,F,F,F,N,F,F,F,N,F,F,F,O,_,_],
  [_,O,T,T,T,T,T,T,T,T,T,T,T,O,_,_],
  [_,O,T,G,G,T,T,T,T,T,G,G,T,O,_,_],
  [_,O,T,T,T,T,T,T,T,T,T,T,T,O,_,_],
  [_,O,S,S,S,S,S,S,S,S,S,S,S,O,_,_],
  [_,O,S,S,S,S,_,_,_,S,S,S,S,O,_,_],
  [_,O,S,S,_,_,_,_,_,_,_,S,S,O,_,_],
  [_,_,O,O,_,_,_,_,_,_,_,O,O,_,_,_],
  [_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_],
  [_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_],
];

// UP - Back view
const BELLHOP_UP = [
  [_,_,_,_,_,O,O,O,O,O,_,_,_,_,_,_],
  [_,_,_,O,O,S,S,S,S,S,O,O,_,_,_,_],
  [_,_,O,S,S,S,S,S,S,S,S,S,O,_,_,_],
  [_,O,S,S,T,T,T,T,T,T,T,S,S,O,_,_],
  [_,O,S,T,T,T,T,T,T,T,T,T,S,O,_,_],
  [_,O,S,S,S,S,S,S,S,S,S,S,S,O,_,_],
  [_,O,S,S,S,S,S,S,S,S,S,S,S,O,_,_],
  [_,O,T,T,T,T,T,T,T,T,T,T,T,O,_,_],
  [_,O,T,G,G,T,T,T,T,T,G,G,T,O,_,_],
  [_,O,T,T,T,T,T,T,T,T,T,T,T,O,_,_],
  [_,O,S,S,S,S,S,S,S,S,S,S,S,O,_,_],
  [_,O,S,S,S,S,S,S,S,S,S,S,S,O,_,_],
  [_,_,O,S,S,S,S,S,S,S,S,S,O,_,_,_],
  [_,_,_,O,O,O,O,O,O,O,O,O,_,_,_,_],
  [_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_],
  [_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_],
];

// LEFT
const BELLHOP_LEFT = [
  [_,_,_,_,O,O,O,O,O,O,_,_,_,_,_,_],
  [_,_,_,O,S,S,S,S,S,S,O,_,_,_,_,_],
  [_,_,O,S,F,F,F,F,F,S,S,O,_,_,_,_],
  [_,O,S,F,F,E,H,E,F,F,S,S,O,_,_,_],
  [_,O,S,F,F,E,H,E,F,F,S,S,O,_,_,_],
  [_,O,S,F,F,F,N,F,F,F,S,S,O,_,_,_],
  [_,O,T,T,T,T,T,T,T,T,T,S,O,_,_,_],
  [_,O,T,G,T,T,T,T,T,T,T,S,O,_,_,_],
  [_,O,T,T,T,T,T,T,T,T,T,S,O,_,_,_],
  [_,O,S,S,S,S,S,S,S,S,S,S,O,_,_,_],
  [_,O,S,S,S,S,S,S,S,S,S,S,O,_,_,_],
  [_,O,S,S,S,S,S,S,S,S,S,O,_,_,_,_],
  [_,_,O,S,S,S,S,S,S,S,O,_,_,_,_,_],
  [_,_,_,O,O,O,O,O,O,O,_,_,_,_,_,_],
  [_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_],
  [_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_],
];

// RIGHT
const BELLHOP_RIGHT = [
  [_,_,_,_,_,O,O,O,O,O,O,_,_,_,_,_],
  [_,_,_,_,O,S,S,S,S,S,S,O,_,_,_,_],
  [_,_,_,O,S,S,F,F,F,F,S,S,O,_,_,_],
  [_,_,O,S,F,F,E,H,E,F,F,S,O,_,_,_],
  [_,_,O,S,F,F,E,H,E,F,F,S,O,_,_,_],
  [_,_,O,S,F,F,F,N,F,F,F,S,O,_,_,_],
  [_,_,O,S,T,T,T,T,T,T,T,T,O,_,_,_],
  [_,_,O,S,T,T,T,T,T,G,T,O,_,_,_,_],
  [_,_,O,S,T,T,T,T,T,T,T,O,_,_,_,_],
  [_,_,O,S,S,S,S,S,S,S,S,O,_,_,_,_],
  [_,_,O,S,S,S,S,S,S,S,S,O,_,_,_,_],
  [_,_,_,O,S,S,S,S,S,S,S,O,_,_,_,_],
  [_,_,_,_,O,O,O,O,O,O,O,_,_,_,_,_],
  [_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_],
  [_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_],
  [_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_],
];

// ─── Sprite set export ──────────────────────────────────────────────────────
export const BELLHOP_SPRITES = {
  down:  [BELLHOP_DOWN, BELLHOP_DOWN, BELLHOP_DOWN, BELLHOP_DOWN],
  up:    [BELLHOP_UP, BELLHOP_UP, BELLHOP_UP, BELLHOP_UP],
  left:  [BELLHOP_LEFT, BELLHOP_LEFT, BELLHOP_LEFT, BELLHOP_LEFT],
  right: [BELLHOP_RIGHT, BELLHOP_RIGHT, BELLHOP_RIGHT, BELLHOP_RIGHT],
};

export function getCatSpritesForFloor(floorNum) {
  return BELLHOP_SPRITES;
}