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
    [W,F,F,F,F,F,F,F,F,F,D,F,F,F,F,F,F,F,S,W],
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
    [W,F,F,F,F,W,F,F,F,D,F,F,S,W,F,F,F,W,F,W],
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

/**
 * Find floor cells suitable for adding a new door junction.
 * Must be a FLOOR tile, not the spawn cell (1,1), with ≥2 floor neighbors,
 * and not adjacent to an existing DOOR_JUNCTION.
 */
function findJunctionCandidates(maze) {
  const candidates = [];
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      if (maze[r][c] !== FLOOR) continue;
      if (r === 1 && c === 1) continue;
      let nearD = false;
      let floorNeighbors = 0;
      for (const [dr, dc] of [[-1,0],[1,0],[0,-1],[0,1]]) {
        const nr = r + dr, nc = c + dc;
        if (nr < 0 || nr >= ROWS || nc < 0 || nc >= COLS) continue;
        if (maze[nr][nc] === DOOR_JUNCTION) nearD = true;
        if (maze[nr][nc] === FLOOR || maze[nr][nc] === STASH) floorNeighbors++;
      }
      if (!nearD && floorNeighbors >= 2) candidates.push({r, c});
    }
  }
  // Shuffle
  for (let i = candidates.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [candidates[i], candidates[j]] = [candidates[j], candidates[i]];
  }
  return candidates;
}

export function createFloor(floorNumber) {
  const template = TEMPLATES[(floorNumber - 1) % TEMPLATES.length];
  // Deep copy so mutations don't affect the template
  const maze = template.map(row => [...row]);

  // --- Progressive difficulty per floor cycle ---
  // Every 3 floors (1 TEMPLATES cycle) the maze gets a bit tougher
  const cycle = Math.floor((floorNumber - 1) / TEMPLATES.length);

  // Extra door junctions (more math to solve)
  const extraJunctions = Math.min(cycle, 3);
  if (extraJunctions > 0) {
    const candidates = findJunctionCandidates(maze);
    for (let i = 0; i < Math.min(extraJunctions, candidates.length); i++) {
      maze[candidates[i].r][candidates[i].c] = DOOR_JUNCTION;
    }
  }

  // Fewer coin stashes on higher cycles
  const stashesToRemove = Math.min(Math.max(0, cycle - 1), 2);
  if (stashesToRemove > 0) {
    const stashCells = [];
    for (let r = 0; r < ROWS; r++)
      for (let c = 0; c < COLS; c++)
        if (maze[r][c] === STASH) stashCells.push({r, c});
    for (let i = stashCells.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [stashCells[i], stashCells[j]] = [stashCells[j], stashCells[i]];
    }
    for (let i = 0; i < Math.min(stashesToRemove, stashCells.length); i++) {
      maze[stashCells[i].r][stashCells[i].c] = FLOOR;
    }
  }

  return maze;
}

export const COLS = 20;
export const ROWS = 11;
export const CELL_SIZE = 16; // logical px per cell
