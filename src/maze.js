export const WALL = 0;
export const FLOOR = 1;
export const DOOR_JUNCTION = 2;
export const STASH = 3;
export const LIFT = 4;
export const DOWN_LIFT = 5;

// W=WALL, F=FLOOR, D=DOOR_JUNCTION, S=STASH, L=LIFT, V=DOWN_LIFT
const W = WALL, F = FLOOR, D = DOOR_JUNCTION, S = STASH, L = LIFT, V = DOWN_LIFT;

const TEMPLATES = [
  // Floor 1 — 20 cols × 11 rows, start at (1,1)
  [
    [W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W],
    [W,F,F,F,W,F,F,F,F,D,F,F,F,W,F,F,F,F,F,W],
    [W,F,W,F,W,F,W,W,F,W,F,W,F,W,F,W,W,W,F,W],
    [W,F,W,F,F,F,W,S,F,W,F,W,F,F,F,W,F,F,F,W],
    [W,F,W,W,W,D,W,W,W,W,F,W,W,W,W,W,F,W,W,W],
    [W,F,F,F,F,F,F,F,F,F,D,F,F,F,F,F,F,W,S,W],
    [W,W,W,D,W,W,W,W,F,W,W,W,W,D,W,W,F,W,W,W],
    [W,S,F,F,F,W,F,F,F,F,F,W,F,F,F,W,F,F,F,W],
    [W,F,W,W,F,W,F,W,W,W,F,W,F,W,F,W,W,W,F,W],
    [W,F,F,F,F,F,F,F,F,F,F,F,F,W,F,F,F,F,L,W],
    [W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W],
  ],
  // Floor 2
  [
    [W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W],
    [W,F,F,D,F,F,F,W,S,W,F,F,F,F,F,W,F,F,F,W],
    [W,F,W,W,W,W,F,W,F,W,F,W,W,W,F,W,F,W,F,W],
    [W,F,F,F,F,W,F,F,F,D,F,W,S,W,F,F,F,W,F,W],
    [W,W,W,D,W,W,W,W,W,W,F,W,W,W,W,W,W,W,F,W],
    [W,F,F,F,F,F,F,F,F,F,D,F,F,F,F,F,F,F,F,W],
    [W,F,W,W,W,D,W,W,F,W,W,W,W,D,W,W,F,W,W,W],
    [W,F,F,F,W,F,F,W,F,F,F,W,F,F,F,W,F,F,F,W],
    [W,W,W,F,W,F,W,W,W,W,F,W,F,W,W,W,W,W,F,W],
    [W,V,F,F,F,F,F,F,F,F,F,F,F,W,F,F,F,F,L,W],
    [W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W],
  ],
  // Floor 3
  [
    [W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W],
    [W,F,F,F,F,F,F,W,F,D,F,F,F,F,W,F,F,S,F,W],
    [W,F,W,W,D,W,F,W,F,W,W,W,F,W,W,W,F,W,F,W],
    [W,F,W,F,F,W,F,F,F,F,F,W,F,F,F,W,F,W,F,W],
    [W,F,W,F,W,W,W,W,W,W,F,W,W,W,F,W,W,W,F,W],
    [W,D,F,F,F,F,F,F,F,F,D,F,F,F,F,F,F,F,F,W],
    [W,W,W,D,W,W,F,W,W,F,W,W,W,D,W,W,F,W,W,W],
    [W,F,F,F,W,F,F,W,F,F,F,W,F,F,F,W,F,S,F,W],
    [W,F,W,W,W,F,W,W,W,W,F,W,F,W,W,W,W,W,F,W],
    [W,V,F,F,F,F,F,F,F,F,F,F,F,W,F,F,F,F,L,W],
    [W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W],
  ],
];

export function createFloor(floorNumber) {
  const template = TEMPLATES[(floorNumber - 1) % TEMPLATES.length];
  // Deep copy so mutations don't affect the template
  return template.map(row => [...row]);
}

export const COLS = 20;
export const ROWS = 11;
export const CELL_SIZE = 16; // logical px per cell
