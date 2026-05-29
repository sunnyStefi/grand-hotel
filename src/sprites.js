export const PALETTE = {
  OUTLINE:   '#2C2C2C',
  SKIN:      '#FFDBB4',
  HAT:       '#2C2C2C',
  EYE:       '#26334A',
  WHITE:     '#FFFFFF',
  UNIFORM:   '#C0392B',

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

const BELLHOP_DOWN = [
  [_,_,_,_,_,O,O,_,O,O,_,_,_,_,_,_],
  [_,_,_,_,O,S,S,S,S,S,O,_,_,_,_,_],
  [_,_,_,O,G,G,G,G,G,G,G,O,_,_,_,_],
  [_,_,O,F,F,F,F,F,F,F,F,F,O,_,_,_],
  [_,O,F,F,F,F,F,F,F,F,F,F,F,O,_,_],
  [_,O,F,F,_,_,E,_,E,_,_,F,F,O,_,_],
  [_,O,F,F,_,_,_,_,_,_,_,F,F,O,_,_],
  [_,O,F,F,_,_,_,_,_,_,_,F,F,O,_,_],
  [_,O,T,T,T,T,T,T,T,T,T,T,T,O,_,_],
  [_,_,T,T,T,_,G,_,T,T,T,_,_,_,_,_],
  [_,_,_,T,T,T,T,T,T,T,_,_,_,_,_,_],
  [_,_,_,_,T,T,T,T,T,_,_,_,_,_,_,_],
  [_,_,_,_,_,S,S,S,S,_,_,_,_,_,_,_],
  [_,_,_,_,_,S,S,S,S,_,_,_,_,_,_,_],
  [_,_,_,_,_,O,O,O,O,_,_,_,_,_,_,_],
  [_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_],
];

const BELLHOP_UP = [
  [_,_,_,_,_,O,O,_,O,O,_,_,_,_,_,_],
  [_,_,_,_,O,S,S,S,S,S,O,_,_,_,_,_],
  [_,_,_,O,G,G,G,G,G,G,G,O,_,_,_,_],
  [_,_,O,S,S,S,S,S,S,S,S,S,O,_,_,_],
  [_,O,S,S,S,S,S,S,S,S,S,S,S,O,_,_],
  [_,O,S,S,S,S,S,S,S,S,S,S,S,O,_,_],
  [_,O,S,S,S,S,S,S,S,S,S,S,S,O,_,_],
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

const BELLHOP_LEFT = [
  [_,_,_,_,O,O,_,O,O,_,_,_,_,_,_,_],
  [_,_,_,O,S,S,S,S,S,O,_,_,_,_,_,_],
  [_,_,O,G,G,G,G,G,G,G,O,_,_,_,_,_],
  [_,O,F,F,F,F,F,F,F,F,S,S,O,_,_,_],
  [_,O,F,F,F,F,F,F,F,F,S,S,O,_,_,_],
  [_,O,F,F,F,_,E,_,F,F,S,S,O,_,_,_],
  [_,O,F,F,F,_,_,_,F,F,S,S,O,_,_,_],
  [_,O,F,F,F,_,_,_,F,F,S,S,O,_,_,_],
  [_,O,T,T,T,T,T,T,T,T,T,T,O,_,_,_],
  [_,_,T,T,T,_,G,T,T,T,T,_,_,_,_,_],
  [_,_,_,T,T,T,T,T,T,T,_,_,_,_,_,_],
  [_,_,_,_,T,T,T,T,T,_,_,_,_,_,_,_],
  [_,_,_,_,S,S,S,S,S,S,_,_,_,_,_,_],
  [_,_,_,_,S,S,S,S,S,S,_,_,_,_,_,_],
  [_,_,_,O,O,O,O,O,O,O,O,_,_,_,_,_],
  [_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_],
];

const BELLHOP_RIGHT = [
  [_,_,_,_,_,_,_,O,O,_,O,O,_,_,_,_],
  [_,_,_,_,_,O,S,S,S,S,S,O,_,_,_,_],
  [_,_,_,_,O,G,G,G,G,G,G,G,O,_,_,_],
  [_,_,_,O,S,S,F,F,F,F,F,F,F,O,_,_],
  [_,_,_,O,S,S,F,F,F,F,F,F,F,O,_,_],
  [_,_,_,O,S,S,F,F,_,E,_,F,F,F,O,_],
  [_,_,_,O,S,S,F,F,_,_,_,F,F,F,O,_],
  [_,_,_,O,S,S,F,F,_,_,_,F,F,F,O,_],
  [_,_,O,T,T,T,T,T,T,T,T,T,T,O,_,_],
  [_,_,_,_,T,T,T,T,G,_,T,T,T,_,_,_],
  [_,_,_,_,_,T,T,T,T,T,T,T,_,_,_,_],
  [_,_,_,_,_,_,T,T,T,T,T,_,_,_,_,_],
  [_,_,_,_,_,S,S,S,S,S,S,_,_,_,_,_],
  [_,_,_,_,_,S,S,S,S,S,S,_,_,_,_,_],
  [_,_,_,O,O,O,O,O,O,O,O,_,_,_,_,_],
  [_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_],
];

export const BELLHOP_SPRITES = {
  down:  [BELLHOP_DOWN, BELLHOP_DOWN, BELLHOP_DOWN, BELLHOP_DOWN],
  up:    [BELLHOP_UP, BELLHOP_UP, BELLHOP_UP, BELLHOP_UP],
  left:  [BELLHOP_LEFT, BELLHOP_LEFT, BELLHOP_LEFT, BELLHOP_LEFT],
  right: [BELLHOP_RIGHT, BELLHOP_RIGHT, BELLHOP_RIGHT, BELLHOP_RIGHT],
};

export function getBellhopSprites(floorNum) {
  return BELLHOP_SPRITES;
}