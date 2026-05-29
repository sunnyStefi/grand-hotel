export const PALETTE = {
  OUTLINE:   '#2C2C2C',
  SKIN:      '#FFDBB4',
  HAT:       '#2C2C2C',
  EYE:       '#26334A',
  WHITE:     '#FFFFFF',
  UNIFORM:   '#C0392B',
  CHEEK:     '#FF9EB0',
  MOUTH:     '#7A3030',

  HAIR:      '#5A3825',
  SHIRT:     '#E63946',
  PANTS:     '#3A5BA0',
  SHOE:      '#2C2C2C',

  BURGUNDY:  '#6B2737',
  BURGUNDY_LT: '#8B3A4A',
  GOLD:      '#D4A017',
  GOLD_LT:   '#F0C040',
  CREAM:     '#F5E6C8',
  CREAM_DK:  '#C8B99A',
  WALL_DARK: '#1A1A2E',
  WALL_MID:  '#2D2D44',
  WALL_LT:   '#3D3D5C',
  WOOD_DARK: '#3B1F0D',
  WOOD_MID:  '#6B3A1F',
  WOOD_LT:   '#8B5A2B',
  GREEN:     '#2D6A4F',
  NAVY:      '#16213E',
  RED:       '#C0392B',
  FLOOR_1_LT: '#E8D4B8',
  FLOOR_1_DK: '#D4B896',
  FLOOR_2_LT: '#C8E6D6',
  FLOOR_2_DK: '#A8D4BC',
  FLOOR_3_LT: '#D4E8F5',
  FLOOR_3_DK: '#A8D4E8',
  FLOOR_4_LT: '#E8D4F5',
  FLOOR_4_DK: '#D8B8E8',
};

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

const _ = null;
const O = 'OUTLINE';
const F = 'SKIN';
const E = 'EYE';
const W = 'WHITE';
const C = 'CHEEK';
const M = 'MOUTH';
const H = 'HAIR';   // brown hair
const R = 'SHIRT';  // red t-shirt
const P = 'PANTS';  // blue jeans
const B = 'SHOE';   // sneakers

// A cheerful little 7-year-old boy: messy brown hair, red tee, blue jeans, sneakers.
const BOY_DOWN = [
  [_,_,_,_,_,H,H,H,H,H,H,_,_,_,_,_],
  [_,_,_,_,H,H,H,H,H,H,H,H,_,_,_,_],
  [_,_,_,O,H,H,H,H,H,H,H,H,O,_,_,_],
  [_,_,O,H,F,F,F,F,F,F,F,F,F,O,_,_],
  [_,O,F,F,F,F,F,F,F,F,F,F,F,F,O,_],
  [_,O,F,F,W,E,F,F,F,F,E,W,F,F,O,_],
  [_,O,F,F,E,E,F,F,F,F,E,E,F,F,O,_],
  [_,O,F,C,F,F,F,M,M,F,F,F,C,F,O,_],
  [_,_,O,F,F,F,F,F,F,F,F,F,F,O,_,_],
  [_,_,_,O,R,R,R,R,R,R,R,R,O,_,_,_],
  [_,_,O,R,R,R,R,R,R,R,R,R,R,O,_,_],
  [_,_,O,F,R,R,R,R,R,R,R,R,F,O,_,_],
  [_,_,_,O,P,P,P,_,_,P,P,P,O,_,_,_],
  [_,_,_,O,P,P,P,_,_,P,P,P,O,_,_,_],
  [_,_,_,O,B,B,B,_,_,B,B,B,O,_,_,_],
  [_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_],
];

const BOY_DOWN_STEP = [
  [_,_,_,_,_,H,H,H,H,H,H,_,_,_,_,_],
  [_,_,_,_,H,H,H,H,H,H,H,H,_,_,_,_],
  [_,_,_,O,H,H,H,H,H,H,H,H,O,_,_,_],
  [_,_,O,H,F,F,F,F,F,F,F,F,F,O,_,_],
  [_,O,F,F,F,F,F,F,F,F,F,F,F,F,O,_],
  [_,O,F,F,W,E,F,F,F,F,E,W,F,F,O,_],
  [_,O,F,F,E,E,F,F,F,F,E,E,F,F,O,_],
  [_,O,F,C,F,F,F,M,M,F,F,F,C,F,O,_],
  [_,_,O,F,F,F,F,F,F,F,F,F,F,O,_,_],
  [_,_,_,O,R,R,R,R,R,R,R,R,O,_,_,_],
  [_,_,O,R,R,R,R,R,R,R,R,R,R,O,_,_],
  [_,_,O,F,R,R,R,R,R,R,R,R,F,O,_,_],
  [_,_,_,O,P,P,P,_,_,P,P,P,O,_,_,_],
  [_,_,_,O,B,B,B,_,_,P,P,P,O,_,_,_],
  [_,_,_,_,_,_,_,_,_,B,B,B,O,_,_,_],
  [_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_],
];

const BOY_UP = [
  [_,_,_,_,_,H,H,H,H,H,H,_,_,_,_,_],
  [_,_,_,_,H,H,H,H,H,H,H,H,_,_,_,_],
  [_,_,_,O,H,H,H,H,H,H,H,H,O,_,_,_],
  [_,_,O,H,H,H,H,H,H,H,H,H,H,O,_,_],
  [_,O,H,H,H,H,H,H,H,H,H,H,H,H,O,_],
  [_,O,H,H,H,H,H,H,H,H,H,H,H,H,O,_],
  [_,O,H,H,H,H,H,H,H,H,H,H,H,H,O,_],
  [_,O,F,H,H,H,H,H,H,H,H,H,H,F,O,_],
  [_,_,O,F,F,F,F,F,F,F,F,F,F,O,_,_],
  [_,_,_,O,R,R,R,R,R,R,R,R,O,_,_,_],
  [_,_,O,R,R,R,R,R,R,R,R,R,R,O,_,_],
  [_,_,O,F,R,R,R,R,R,R,R,R,F,O,_,_],
  [_,_,_,O,P,P,P,_,_,P,P,P,O,_,_,_],
  [_,_,_,O,P,P,P,_,_,P,P,P,O,_,_,_],
  [_,_,_,O,B,B,B,_,_,B,B,B,O,_,_,_],
  [_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_],
];

const BOY_UP_STEP = [
  [_,_,_,_,_,H,H,H,H,H,H,_,_,_,_,_],
  [_,_,_,_,H,H,H,H,H,H,H,H,_,_,_,_],
  [_,_,_,O,H,H,H,H,H,H,H,H,O,_,_,_],
  [_,_,O,H,H,H,H,H,H,H,H,H,H,O,_,_],
  [_,O,H,H,H,H,H,H,H,H,H,H,H,H,O,_],
  [_,O,H,H,H,H,H,H,H,H,H,H,H,H,O,_],
  [_,O,H,H,H,H,H,H,H,H,H,H,H,H,O,_],
  [_,O,F,H,H,H,H,H,H,H,H,H,H,F,O,_],
  [_,_,O,F,F,F,F,F,F,F,F,F,F,O,_,_],
  [_,_,_,O,R,R,R,R,R,R,R,R,O,_,_,_],
  [_,_,O,R,R,R,R,R,R,R,R,R,R,O,_,_],
  [_,_,O,F,R,R,R,R,R,R,R,R,F,O,_,_],
  [_,_,_,O,P,P,P,_,_,P,P,P,O,_,_,_],
  [_,_,_,O,B,B,B,_,_,P,P,P,O,_,_,_],
  [_,_,_,_,_,_,_,_,_,B,B,B,O,_,_,_],
  [_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_],
];

const BOY_RIGHT = [
  [_,_,_,_,_,_,H,H,H,H,H,H,_,_,_,_],
  [_,_,_,_,_,H,H,H,H,H,H,H,H,_,_,_],
  [_,_,_,_,O,H,H,H,H,H,H,H,H,O,_,_],
  [_,_,_,O,H,H,F,F,F,F,F,F,F,O,_,_],
  [_,_,_,O,H,F,F,F,F,F,F,F,F,F,O,_],
  [_,_,_,O,H,F,F,F,W,E,F,F,F,F,O,_],
  [_,_,_,O,H,F,F,F,E,E,F,F,F,F,O,_],
  [_,_,_,O,F,F,F,F,F,C,M,M,F,F,O,_],
  [_,_,_,_,O,F,F,F,F,F,F,F,F,O,_,_],
  [_,_,_,_,O,R,R,R,R,R,R,R,O,_,_,_],
  [_,_,_,O,R,R,R,R,R,R,R,R,O,_,_,_],
  [_,_,_,O,F,R,R,R,R,R,R,F,O,_,_,_],
  [_,_,_,_,O,P,P,P,_,P,P,P,O,_,_,_],
  [_,_,_,_,O,P,P,P,_,P,P,P,O,_,_,_],
  [_,_,_,_,O,B,B,B,_,B,B,B,O,_,_,_],
  [_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_],
];

const BOY_RIGHT_STEP = [
  [_,_,_,_,_,_,H,H,H,H,H,H,_,_,_,_],
  [_,_,_,_,_,H,H,H,H,H,H,H,H,_,_,_],
  [_,_,_,_,O,H,H,H,H,H,H,H,H,O,_,_],
  [_,_,_,O,H,H,F,F,F,F,F,F,F,O,_,_],
  [_,_,_,O,H,F,F,F,F,F,F,F,F,F,O,_],
  [_,_,_,O,H,F,F,F,W,E,F,F,F,F,O,_],
  [_,_,_,O,H,F,F,F,E,E,F,F,F,F,O,_],
  [_,_,_,O,F,F,F,F,F,C,M,M,F,F,O,_],
  [_,_,_,_,O,F,F,F,F,F,F,F,F,O,_,_],
  [_,_,_,_,O,R,R,R,R,R,R,R,O,_,_,_],
  [_,_,_,O,R,R,R,R,R,R,R,R,O,_,_,_],
  [_,_,_,O,F,R,R,R,R,R,R,F,O,_,_,_],
  [_,_,_,_,O,P,P,P,_,P,P,P,O,_,_,_],
  [_,_,_,_,O,B,B,B,_,P,P,P,O,_,_,_],
  [_,_,_,_,_,_,_,_,_,B,B,B,O,_,_,_],
  [_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_],
];

const BOY_LEFT = [
  [_,_,_,_,H,H,H,H,H,H,_,_,_,_,_,_],
  [_,_,_,H,H,H,H,H,H,H,H,_,_,_,_,_],
  [_,_,O,H,H,H,H,H,H,H,H,O,_,_,_,_],
  [_,_,O,F,F,F,F,F,F,F,H,H,O,_,_,_],
  [_,O,F,F,F,F,F,F,F,F,F,H,O,_,_,_],
  [_,O,F,F,F,F,E,W,F,F,F,H,O,_,_,_],
  [_,O,F,F,F,F,E,E,F,F,F,H,O,_,_,_],
  [_,O,F,F,M,M,C,F,F,F,F,F,O,_,_,_],
  [_,_,O,F,F,F,F,F,F,F,F,O,_,_,_,_],
  [_,_,_,O,R,R,R,R,R,R,R,O,_,_,_,_],
  [_,_,_,O,R,R,R,R,R,R,R,R,O,_,_,_],
  [_,_,_,O,F,R,R,R,R,R,R,F,O,_,_,_],
  [_,_,_,O,P,P,P,_,P,P,P,O,_,_,_,_],
  [_,_,_,O,P,P,P,_,P,P,P,O,_,_,_,_],
  [_,_,_,O,B,B,B,_,B,B,B,O,_,_,_,_],
  [_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_],
];

const BOY_LEFT_STEP = [
  [_,_,_,_,H,H,H,H,H,H,_,_,_,_,_,_],
  [_,_,_,H,H,H,H,H,H,H,H,_,_,_,_,_],
  [_,_,O,H,H,H,H,H,H,H,H,O,_,_,_,_],
  [_,_,O,F,F,F,F,F,F,F,H,H,O,_,_,_],
  [_,O,F,F,F,F,F,F,F,F,F,H,O,_,_,_],
  [_,O,F,F,F,F,E,W,F,F,F,H,O,_,_,_],
  [_,O,F,F,F,F,E,E,F,F,F,H,O,_,_,_],
  [_,O,F,F,M,M,C,F,F,F,F,F,O,_,_,_],
  [_,_,O,F,F,F,F,F,F,F,F,O,_,_,_,_],
  [_,_,_,O,R,R,R,R,R,R,R,O,_,_,_,_],
  [_,_,_,O,R,R,R,R,R,R,R,R,O,_,_,_],
  [_,_,_,O,F,R,R,R,R,R,R,F,O,_,_,_],
  [_,_,_,O,P,P,P,_,P,P,P,O,_,_,_,_],
  [_,_,_,O,P,P,P,_,B,B,B,O,_,_,_,_],
  [_,_,_,O,B,B,B,_,_,_,_,_,_,_,_,_],
  [_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_],
];

// Hold each pose ~240ms for a gentle waddle (walkFrame advances every 120ms).
export const BELLHOP_SPRITES = {
  down:  [BOY_DOWN, BOY_DOWN, BOY_DOWN_STEP, BOY_DOWN_STEP],
  up:    [BOY_UP, BOY_UP, BOY_UP_STEP, BOY_UP_STEP],
  left:  [BOY_LEFT, BOY_LEFT, BOY_LEFT_STEP, BOY_LEFT_STEP],
  right: [BOY_RIGHT, BOY_RIGHT, BOY_RIGHT_STEP, BOY_RIGHT_STEP],
};

export function getBellhopSprites(floorNum) {
  return BELLHOP_SPRITES;
}
