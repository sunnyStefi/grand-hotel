export const PALETTE = {
  OUTLINE:   '#2C2C2C',
  SKIN:      '#FFDBB4',
  HAT:       '#2C2C2C',
  EYE:       '#26334A',
  WHITE:     '#FFFFFF',
  UNIFORM:   '#C0392B',
  CHEEK:     '#FF9EB0',
  MOUTH:     '#7A3030',

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
const S = 'HAT';
const E = 'EYE';
const T = 'UNIFORM';
const G = 'GOLD';
const C = 'CHEEK';
const M = 'MOUTH';
const W = 'WHITE';

// Big round head, sparkly eyes, rosy cheeks, a little smile — pure bellhop charm.
const BELLHOP_DOWN = [
  [_,_,_,_,_,O,O,_,O,O,_,_,_,_,_,_],
  [_,_,_,_,O,S,S,S,S,S,O,_,_,_,_,_],
  [_,_,_,O,G,G,G,G,G,G,G,O,_,_,_,_],
  [_,_,O,F,F,F,F,F,F,F,F,F,O,_,_,_],
  [_,O,F,F,F,F,F,F,F,F,F,F,F,O,_,_],
  [_,O,F,F,W,E,F,F,F,E,W,F,F,O,_,_],
  [_,O,F,F,E,E,F,F,F,E,E,F,F,O,_,_],
  [_,O,F,C,F,F,M,M,M,F,F,C,F,O,_,_],
  [_,O,T,T,T,T,T,T,T,T,T,T,T,O,_,_],
  [_,_,T,T,T,_,G,_,T,T,T,_,_,_,_,_],
  [_,_,_,T,T,T,T,T,T,T,_,_,_,_,_,_],
  [_,_,_,_,T,T,T,T,T,_,_,_,_,_,_,_],
  [_,_,_,_,_,S,S,S,S,_,_,_,_,_,_,_],
  [_,_,_,_,_,S,S,S,S,_,_,_,_,_,_,_],
  [_,_,_,_,_,O,O,O,O,_,_,_,_,_,_,_],
  [_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_],
];

const BELLHOP_DOWN_STEP = [
  [_,_,_,_,_,O,O,_,O,O,_,_,_,_,_,_],
  [_,_,_,_,O,S,S,S,S,S,O,_,_,_,_,_],
  [_,_,_,O,G,G,G,G,G,G,G,O,_,_,_,_],
  [_,_,O,F,F,F,F,F,F,F,F,F,O,_,_,_],
  [_,O,F,F,F,F,F,F,F,F,F,F,F,O,_,_],
  [_,O,F,F,W,E,F,F,F,E,W,F,F,O,_,_],
  [_,O,F,F,E,E,F,F,F,E,E,F,F,O,_,_],
  [_,O,F,C,F,F,M,M,M,F,F,C,F,O,_,_],
  [_,O,T,T,T,T,T,T,T,T,T,T,T,O,_,_],
  [_,_,T,T,T,_,G,_,T,T,T,_,_,_,_,_],
  [_,_,_,T,T,T,T,T,T,T,_,_,_,_,_,_],
  [_,_,_,_,T,T,T,T,T,_,_,_,_,_,_,_],
  [_,_,_,_,S,S,_,S,S,_,_,_,_,_,_,_],
  [_,_,_,_,S,S,_,S,S,_,_,_,_,_,_,_],
  [_,_,_,_,O,O,_,O,O,_,_,_,_,_,_,_],
  [_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_],
];

const BELLHOP_UP = [
  [_,_,_,_,_,O,O,_,O,O,_,_,_,_,_,_],
  [_,_,_,_,O,S,S,S,S,S,O,_,_,_,_,_],
  [_,_,_,O,G,G,G,G,G,G,G,O,_,_,_,_],
  [_,_,O,S,S,S,S,S,S,S,S,S,O,_,_,_],
  [_,O,S,S,S,S,S,S,S,S,S,S,S,O,_,_],
  [_,O,F,S,S,S,S,S,S,S,S,S,F,O,_,_],
  [_,O,F,S,S,S,S,S,S,S,S,S,F,O,_,_],
  [_,O,S,S,S,S,S,S,S,S,S,S,S,O,_,_],
  [_,O,T,T,T,T,T,T,T,T,T,T,T,O,_,_],
  [_,_,T,T,T,_,G,_,T,T,T,_,_,_,_,_],
  [_,_,_,T,T,T,T,T,T,T,_,_,_,_,_,_],
  [_,_,_,_,T,T,T,T,T,_,_,_,_,_,_,_],
  [_,_,_,_,_,S,S,S,S,_,_,_,_,_,_,_],
  [_,_,_,_,_,S,S,S,S,_,_,_,_,_,_,_],
  [_,_,_,_,_,O,O,O,O,_,_,_,_,_,_,_],
  [_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_],
];

const BELLHOP_UP_STEP = [
  [_,_,_,_,_,O,O,_,O,O,_,_,_,_,_,_],
  [_,_,_,_,O,S,S,S,S,S,O,_,_,_,_,_],
  [_,_,_,O,G,G,G,G,G,G,G,O,_,_,_,_],
  [_,_,O,S,S,S,S,S,S,S,S,S,O,_,_,_],
  [_,O,S,S,S,S,S,S,S,S,S,S,S,O,_,_],
  [_,O,F,S,S,S,S,S,S,S,S,S,F,O,_,_],
  [_,O,F,S,S,S,S,S,S,S,S,S,F,O,_,_],
  [_,O,S,S,S,S,S,S,S,S,S,S,S,O,_,_],
  [_,O,T,T,T,T,T,T,T,T,T,T,T,O,_,_],
  [_,_,T,T,T,_,G,_,T,T,T,_,_,_,_,_],
  [_,_,_,T,T,T,T,T,T,T,_,_,_,_,_,_],
  [_,_,_,_,T,T,T,T,T,_,_,_,_,_,_,_],
  [_,_,_,_,S,S,_,S,S,_,_,_,_,_,_,_],
  [_,_,_,_,S,S,_,S,S,_,_,_,_,_,_,_],
  [_,_,_,_,O,O,_,O,O,_,_,_,_,_,_,_],
  [_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_],
];

const BELLHOP_LEFT = [
  [_,_,_,_,O,O,_,O,O,_,_,_,_,_,_,_],
  [_,_,_,O,S,S,S,S,S,O,_,_,_,_,_,_],
  [_,_,O,G,G,G,G,G,G,G,O,_,_,_,_,_],
  [_,O,F,F,F,F,F,F,F,F,S,S,O,_,_,_],
  [_,O,F,F,F,F,F,F,F,F,S,S,O,_,_,_],
  [_,O,F,F,W,E,F,F,F,F,S,S,O,_,_,_],
  [_,O,F,F,E,E,F,F,F,F,S,S,O,_,_,_],
  [_,O,F,M,M,C,F,F,F,F,S,S,O,_,_,_],
  [_,O,T,T,T,T,T,T,T,T,T,T,O,_,_,_],
  [_,_,T,T,T,_,G,T,T,T,T,_,_,_,_,_],
  [_,_,_,T,T,T,T,T,T,T,_,_,_,_,_,_],
  [_,_,_,_,T,T,T,T,T,_,_,_,_,_,_,_],
  [_,_,_,_,S,S,S,S,S,S,_,_,_,_,_,_],
  [_,_,_,_,S,S,S,S,S,S,_,_,_,_,_,_],
  [_,_,_,O,O,O,O,O,O,O,O,_,_,_,_,_],
  [_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_],
];

const BELLHOP_LEFT_STEP = [
  [_,_,_,_,O,O,_,O,O,_,_,_,_,_,_,_],
  [_,_,_,O,S,S,S,S,S,O,_,_,_,_,_,_],
  [_,_,O,G,G,G,G,G,G,G,O,_,_,_,_,_],
  [_,O,F,F,F,F,F,F,F,F,S,S,O,_,_,_],
  [_,O,F,F,F,F,F,F,F,F,S,S,O,_,_,_],
  [_,O,F,F,W,E,F,F,F,F,S,S,O,_,_,_],
  [_,O,F,F,E,E,F,F,F,F,S,S,O,_,_,_],
  [_,O,F,M,M,C,F,F,F,F,S,S,O,_,_,_],
  [_,O,T,T,T,T,T,T,T,T,T,T,O,_,_,_],
  [_,_,T,T,T,_,G,T,T,T,T,_,_,_,_,_],
  [_,_,_,T,T,T,T,T,T,T,_,_,_,_,_,_],
  [_,_,_,_,T,T,T,T,T,_,_,_,_,_,_,_],
  [_,_,_,_,S,S,_,_,S,S,_,_,_,_,_,_],
  [_,_,_,_,S,S,_,_,S,S,_,_,_,_,_,_],
  [_,_,_,_,O,O,_,_,O,O,_,_,_,_,_,_],
  [_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_],
];

const BELLHOP_RIGHT = [
  [_,_,_,_,_,_,_,O,O,_,O,O,_,_,_,_],
  [_,_,_,_,_,O,S,S,S,S,S,O,_,_,_,_],
  [_,_,_,_,O,G,G,G,G,G,G,G,O,_,_,_],
  [_,_,_,O,S,S,F,F,F,F,F,F,F,O,_,_],
  [_,_,_,O,S,S,F,F,F,F,F,F,F,O,_,_],
  [_,_,_,O,S,S,F,F,F,E,W,F,F,F,O,_],
  [_,_,_,O,S,S,F,F,F,E,E,F,F,F,O,_],
  [_,_,_,O,S,S,F,F,F,C,M,M,F,F,O,_],
  [_,_,O,T,T,T,T,T,T,T,T,T,T,O,_,_],
  [_,_,_,_,T,T,T,T,G,_,T,T,T,_,_,_],
  [_,_,_,_,_,T,T,T,T,T,T,T,_,_,_,_],
  [_,_,_,_,_,_,T,T,T,T,T,_,_,_,_,_],
  [_,_,_,_,_,S,S,S,S,S,S,_,_,_,_,_],
  [_,_,_,_,_,S,S,S,S,S,S,_,_,_,_,_],
  [_,_,_,O,O,O,O,O,O,O,O,_,_,_,_,_],
  [_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_],
];

const BELLHOP_RIGHT_STEP = [
  [_,_,_,_,_,_,_,O,O,_,O,O,_,_,_,_],
  [_,_,_,_,_,O,S,S,S,S,S,O,_,_,_,_],
  [_,_,_,_,O,G,G,G,G,G,G,G,O,_,_,_],
  [_,_,_,O,S,S,F,F,F,F,F,F,F,O,_,_],
  [_,_,_,O,S,S,F,F,F,F,F,F,F,O,_,_],
  [_,_,_,O,S,S,F,F,F,E,W,F,F,F,O,_],
  [_,_,_,O,S,S,F,F,F,E,E,F,F,F,O,_],
  [_,_,_,O,S,S,F,F,F,C,M,M,F,F,O,_],
  [_,_,O,T,T,T,T,T,T,T,T,T,T,O,_,_],
  [_,_,_,_,T,T,T,T,G,_,T,T,T,_,_,_],
  [_,_,_,_,_,T,T,T,T,T,T,T,_,_,_,_],
  [_,_,_,_,_,_,T,T,T,T,T,_,_,_,_,_],
  [_,_,_,_,_,S,S,_,_,S,S,_,_,_,_,_],
  [_,_,_,_,_,S,S,_,_,S,S,_,_,_,_,_],
  [_,_,_,_,_,O,O,_,_,O,O,_,_,_,_,_],
  [_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_],
];

// Hold each pose ~240ms for a gentle waddle (walkFrame advances every 120ms).
export const BELLHOP_SPRITES = {
  down:  [BELLHOP_DOWN, BELLHOP_DOWN, BELLHOP_DOWN_STEP, BELLHOP_DOWN_STEP],
  up:    [BELLHOP_UP, BELLHOP_UP, BELLHOP_UP_STEP, BELLHOP_UP_STEP],
  left:  [BELLHOP_LEFT, BELLHOP_LEFT, BELLHOP_LEFT_STEP, BELLHOP_LEFT_STEP],
  right: [BELLHOP_RIGHT, BELLHOP_RIGHT, BELLHOP_RIGHT_STEP, BELLHOP_RIGHT_STEP],
};

export function getBellhopSprites(floorNum) {
  return BELLHOP_SPRITES;
}
