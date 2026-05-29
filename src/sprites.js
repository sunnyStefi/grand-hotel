// ─── Palette ─────────────────────────────────────────────────────────────────
export const PALETTE = {
  BURGUNDY:    '#6B2737',
  BURGUNDY_LT: '#8B3A4A',
  GOLD:        '#D4A017',
  GOLD_LT:     '#F0C040',
  CREAM:       '#F5E6C8',
  CREAM_DK:    '#C8B99A',
  WALL_DARK:   '#1A1A2E',
  WALL_MID:    '#2D2D44',
  WALL_LT:     '#3D3D5C',
  WOOD_DARK:   '#3B1F0D',
  WOOD_MID:    '#6B3A1F',
  WOOD_LT:     '#8B5A2B',
  GREEN:       '#2D6A4F',
  NAVY:        '#16213E',
  WHITE:       '#FFFFFF',
  RED:         '#C0392B',
  // Floor colors - one per floor
  FLOOR_1_LT:  '#E8D4B8',
  FLOOR_1_DK:  '#D4B896',
  FLOOR_2_LT:  '#C8E6D6',
  FLOOR_2_DK:  '#A8D4BC',
  FLOOR_3_LT:  '#D4E8F5',
  FLOOR_3_DK:  '#A8D4E8',
  FLOOR_4_LT:  '#E8D4F5',
  FLOOR_4_DK:  '#D8B8E8',
  // Cat colors - will be selected based on floor
  // Orange cat
  CAT_ORANGE:  '#FF9D4D',
  CAT_ORANGE_DK: '#E67E35',
  // White cat
  CAT_WHITE:   '#F5F5F5',
  CAT_GRAY:    '#D3D3D3',
  // Gray cat
  CAT_GRAY_MD: '#A9A9A9',
  CAT_GRAY_DK: '#696969',
  // Black cat
  CAT_BLACK:   '#1A1A1A',
  CAT_BLACK_DK: '#0A0A0A',
  // Common
  EYE_WHITE:   '#FFFFFF',
  EYE_BLACK:   '#000000',
  EYE_PUPIL:   '#4A4A4A',
  NOSE_PINK:   '#FF99BB',
  MOUTH_PINK:  '#FFB3D9',
  BLUSH:       '#FFB8C8',
};

// ─── Sprite renderer ──────────────────────────────────────────────────────────
// grid: 2D array of PALETTE keys (null = transparent)
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

// ─── Cute Cat sprites ────────────────────────────────────────────────────────
// 8 wide × 16 tall, palette key per pixel (null = transparent)
// Directions: down (facing camera), up, left, right
// 4 walk frames each
// Multiple color variants for different floors

const _ = null;

// Helper to create cat sprites with custom colors
function createCatSprites(bodyColor, bodyDark, accentColor) {
  // Down-facing frames (4 frames: neutral, step-right, neutral, step-left)
  const CAT_DOWN = [
    // Frame 0 - neutral, adorable face
    [
      [_,_,bodyColor,bodyColor,bodyColor,bodyColor,_,_],           // ears
      [_,bodyColor,accentColor,accentColor,accentColor,accentColor,bodyColor,_],  // inner ears
      [_,bodyColor,bodyColor,bodyColor,bodyColor,bodyColor,bodyColor,_],
      [_,bodyColor,bodyColor,bodyColor,bodyColor,bodyColor,bodyColor,_], // head
      [_,bodyColor,'EYE_WHITE','EYE_BLACK',bodyColor,'EYE_WHITE','EYE_BLACK',_], // eyes
      [_,bodyColor,'BLUSH',bodyColor,'NOSE_PINK',bodyColor,'BLUSH',_],  // blush & nose
      [_,bodyColor,bodyColor,'MOUTH_PINK','MOUTH_PINK',bodyColor,bodyColor,_],  // smile
      [_,bodyColor,bodyColor,bodyColor,bodyColor,bodyColor,bodyColor,_],  // body
      [_,bodyColor,'WHITE','WHITE','WHITE','WHITE',bodyColor,_],
      [_,bodyColor,'WHITE','WHITE','WHITE','WHITE',bodyColor,_],
      [_,bodyDark,bodyColor,bodyColor,bodyColor,bodyColor,bodyDark,_],
      [_,_,bodyDark,bodyDark,bodyDark,bodyDark,_,_],                     // legs
      [_,_,bodyDark,bodyDark,bodyDark,bodyDark,_,_],
      [_,_,bodyDark,bodyDark,bodyDark,bodyDark,_,_], // paws
      [_,_,bodyDark,bodyDark,bodyDark,bodyDark,_,_],
      [_,_,_,_,_,_,_,_],
    ],
    // Frame 1 - step right, slight head tilt
    [
      [_,_,bodyColor,bodyColor,bodyColor,bodyColor,_,_],
      [_,bodyColor,accentColor,accentColor,accentColor,accentColor,bodyColor,_],
      [_,bodyColor,bodyColor,bodyColor,bodyColor,bodyColor,bodyColor,_],
      [_,bodyColor,bodyColor,bodyColor,bodyColor,bodyColor,bodyColor,_],
      [_,bodyColor,'EYE_WHITE','EYE_BLACK',bodyColor,'EYE_WHITE','EYE_BLACK',_],
      [_,bodyColor,'BLUSH',bodyColor,'NOSE_PINK',bodyColor,'BLUSH',_],
      [_,bodyColor,bodyColor,'MOUTH_PINK','MOUTH_PINK',bodyColor,bodyColor,_],
      [_,bodyColor,bodyColor,bodyColor,bodyColor,bodyColor,bodyColor,_],
      [_,bodyColor,'WHITE','WHITE','WHITE','WHITE',bodyColor,_],
      [_,bodyColor,'WHITE','WHITE','WHITE','WHITE',bodyColor,_],
      [_,bodyDark,bodyColor,bodyColor,bodyColor,bodyColor,bodyDark,_],
      [_,_,bodyDark,bodyDark,_,_,_,_],
      [_,_,_,_,bodyDark,bodyDark,bodyDark,_],
      [_,_,_,bodyDark,bodyDark,_,bodyDark,_],
      [_,_,_,bodyDark,_,_,bodyDark,_],
      [_,_,_,_,_,_,_,_],
    ],
    // Frame 2 - neutral (same as 0)
    [
      [_,_,bodyColor,bodyColor,bodyColor,bodyColor,_,_],
      [_,bodyColor,accentColor,accentColor,accentColor,accentColor,bodyColor,_],
      [_,bodyColor,bodyColor,bodyColor,bodyColor,bodyColor,bodyColor,_],
      [_,bodyColor,bodyColor,bodyColor,bodyColor,bodyColor,bodyColor,_],
      [_,bodyColor,'EYE_WHITE','EYE_BLACK',bodyColor,'EYE_WHITE','EYE_BLACK',_],
      [_,bodyColor,'BLUSH',bodyColor,'NOSE_PINK',bodyColor,'BLUSH',_],
      [_,bodyColor,bodyColor,'MOUTH_PINK','MOUTH_PINK',bodyColor,bodyColor,_],
      [_,bodyColor,bodyColor,bodyColor,bodyColor,bodyColor,bodyColor,_],
      [_,bodyColor,'WHITE','WHITE','WHITE','WHITE',bodyColor,_],
      [_,bodyColor,'WHITE','WHITE','WHITE','WHITE',bodyColor,_],
      [_,bodyDark,bodyColor,bodyColor,bodyColor,bodyColor,bodyDark,_],
      [_,_,bodyDark,bodyDark,bodyDark,bodyDark,_,_],
      [_,_,bodyDark,bodyDark,bodyDark,bodyDark,_,_],
      [_,_,bodyDark,bodyDark,bodyDark,bodyDark,_,_],
      [_,_,bodyDark,bodyDark,bodyDark,bodyDark,_,_],
      [_,_,_,_,_,_,_,_],
    ],
    // Frame 3 - step left, slight head tilt
    [
      [_,_,bodyColor,bodyColor,bodyColor,bodyColor,_,_],
      [_,bodyColor,accentColor,accentColor,accentColor,accentColor,bodyColor,_],
      [_,bodyColor,bodyColor,bodyColor,bodyColor,bodyColor,bodyColor,_],
      [_,bodyColor,bodyColor,bodyColor,bodyColor,bodyColor,bodyColor,_],
      [_,bodyColor,'EYE_WHITE','EYE_BLACK',bodyColor,'EYE_WHITE','EYE_BLACK',_],
      [_,bodyColor,'BLUSH',bodyColor,'NOSE_PINK',bodyColor,'BLUSH',_],
      [_,bodyColor,bodyColor,'MOUTH_PINK','MOUTH_PINK',bodyColor,bodyColor,_],
      [_,bodyColor,bodyColor,bodyColor,bodyColor,bodyColor,bodyColor,_],
      [_,bodyColor,'WHITE','WHITE','WHITE','WHITE',bodyColor,_],
      [_,bodyColor,'WHITE','WHITE','WHITE','WHITE',bodyColor,_],
      [_,bodyDark,bodyColor,bodyColor,bodyColor,bodyColor,bodyDark,_],
      [_,bodyDark,bodyDark,_,_,bodyDark,bodyDark,_],
      [_,_,_,bodyDark,bodyDark,_,_,_],
      [_,bodyDark,_,bodyDark,bodyDark,_,bodyDark,_],
      [_,bodyDark,_,bodyDark,_,_,bodyDark,_],
      [_,_,_,_,_,_,_,_],
    ],
  ];

  // Up-facing (back of cat, ears visible)
  const CAT_UP = [
    [
      [_,_,bodyColor,bodyColor,bodyColor,bodyColor,_,_],
      [_,bodyColor,accentColor,accentColor,accentColor,accentColor,bodyColor,_],
      [_,bodyColor,bodyColor,bodyColor,bodyColor,bodyColor,bodyColor,_],
      [_,bodyColor,bodyColor,bodyColor,bodyColor,bodyColor,bodyColor,_],
      [_,bodyColor,bodyColor,bodyColor,bodyColor,bodyColor,bodyColor,_],
      [_,bodyColor,bodyColor,bodyColor,bodyColor,bodyColor,bodyColor,_],
      [_,bodyColor,'WHITE','WHITE','WHITE','WHITE',bodyColor,_],
      [_,bodyColor,'WHITE','WHITE','WHITE','WHITE',bodyColor,_],
      [_,bodyColor,bodyColor,bodyColor,bodyColor,bodyColor,bodyColor,_],
      [_,bodyDark,bodyColor,bodyColor,bodyColor,bodyColor,bodyDark,_],
      [_,bodyDark,bodyColor,bodyColor,bodyColor,bodyColor,bodyDark,_],
      [_,bodyDark,bodyDark,bodyDark,bodyDark,bodyDark,bodyDark,_],
      [_,_,bodyDark,bodyDark,bodyDark,bodyDark,_,_],
      [_,_,bodyDark,bodyDark,bodyDark,bodyDark,_,_],
      [_,_,bodyDark,bodyDark,bodyDark,bodyDark,_,_],
      [_,_,_,_,_,_,_,_],
    ],
    [
      [_,_,bodyColor,bodyColor,bodyColor,bodyColor,_,_],
      [_,bodyColor,accentColor,accentColor,accentColor,accentColor,bodyColor,_],
      [_,bodyColor,bodyColor,bodyColor,bodyColor,bodyColor,bodyColor,_],
      [_,bodyColor,bodyColor,bodyColor,bodyColor,bodyColor,bodyColor,_],
      [_,bodyColor,bodyColor,bodyColor,bodyColor,bodyColor,bodyColor,_],
      [_,bodyColor,bodyColor,bodyColor,bodyColor,bodyColor,bodyColor,_],
      [_,bodyColor,'WHITE','WHITE','WHITE','WHITE',bodyColor,_],
      [_,bodyColor,'WHITE','WHITE','WHITE','WHITE',bodyColor,_],
      [_,bodyColor,bodyColor,bodyColor,bodyColor,bodyColor,bodyColor,_],
      [_,bodyDark,bodyColor,bodyColor,bodyColor,bodyColor,bodyDark,_],
      [_,bodyDark,bodyColor,bodyColor,bodyColor,bodyColor,bodyDark,_],
      [_,bodyDark,bodyDark,bodyDark,bodyDark,bodyDark,bodyDark,_],
      [_,_,bodyDark,bodyDark,_,_,_,_],
      [_,_,_,bodyDark,bodyDark,_,_,_],
      [_,_,bodyDark,bodyDark,bodyDark,bodyDark,_,_],
      [_,_,_,_,_,_,_,_],
    ],
    [
      [_,_,bodyColor,bodyColor,bodyColor,bodyColor,_,_],
      [_,bodyColor,accentColor,accentColor,accentColor,accentColor,bodyColor,_],
      [_,bodyColor,bodyColor,bodyColor,bodyColor,bodyColor,bodyColor,_],
      [_,bodyColor,bodyColor,bodyColor,bodyColor,bodyColor,bodyColor,_],
      [_,bodyColor,bodyColor,bodyColor,bodyColor,bodyColor,bodyColor,_],
      [_,bodyColor,bodyColor,bodyColor,bodyColor,bodyColor,bodyColor,_],
      [_,bodyColor,'WHITE','WHITE','WHITE','WHITE',bodyColor,_],
      [_,bodyColor,'WHITE','WHITE','WHITE','WHITE',bodyColor,_],
      [_,bodyColor,bodyColor,bodyColor,bodyColor,bodyColor,bodyColor,_],
      [_,bodyDark,bodyColor,bodyColor,bodyColor,bodyColor,bodyDark,_],
      [_,bodyDark,bodyColor,bodyColor,bodyColor,bodyColor,bodyDark,_],
      [_,bodyDark,bodyDark,bodyDark,bodyDark,bodyDark,bodyDark,_],
      [_,_,bodyDark,bodyDark,bodyDark,bodyDark,_,_],
      [_,_,bodyDark,bodyDark,bodyDark,bodyDark,_,_],
      [_,_,bodyDark,bodyDark,bodyDark,bodyDark,_,_],
      [_,_,_,_,_,_,_,_],
    ],
    [
      [_,_,bodyColor,bodyColor,bodyColor,bodyColor,_,_],
      [_,bodyColor,accentColor,accentColor,accentColor,accentColor,bodyColor,_],
      [_,bodyColor,bodyColor,bodyColor,bodyColor,bodyColor,bodyColor,_],
      [_,bodyColor,bodyColor,bodyColor,bodyColor,bodyColor,bodyColor,_],
      [_,bodyColor,bodyColor,bodyColor,bodyColor,bodyColor,bodyColor,_],
      [_,bodyColor,bodyColor,bodyColor,bodyColor,bodyColor,bodyColor,_],
      [_,bodyColor,'WHITE','WHITE','WHITE','WHITE',bodyColor,_],
      [_,bodyColor,'WHITE','WHITE','WHITE','WHITE',bodyColor,_],
      [_,bodyColor,bodyColor,bodyColor,bodyColor,bodyColor,bodyColor,_],
      [_,bodyDark,bodyColor,bodyColor,bodyColor,bodyColor,bodyDark,_],
      [_,bodyDark,bodyColor,bodyColor,bodyColor,bodyColor,bodyDark,_],
      [_,bodyDark,bodyDark,bodyDark,bodyDark,bodyDark,bodyDark,_],
      [_,bodyDark,bodyDark,_,_,bodyDark,bodyDark,_],
      [_,_,_,bodyDark,bodyDark,_,_,_],
      [_,bodyDark,bodyDark,bodyDark,bodyDark,bodyDark,bodyDark,_],
      [_,_,_,_,_,_,_,_],
    ],
  ];

  // Left-facing (side profile)
  const CAT_LEFT = [
    [
      [_,_,bodyColor,bodyColor,bodyColor,_,_,_],
      [_,bodyColor,accentColor,accentColor,bodyColor,_,_,_],
      [_,bodyColor,bodyColor,bodyColor,bodyColor,_,_,_],
      [_,bodyColor,bodyColor,bodyColor,bodyColor,_,_,_],
      [_,bodyColor,'EYE_WHITE','EYE_BLACK',bodyColor,_,_,_],
      [_,bodyColor,'BLUSH','NOSE_PINK',bodyColor,_,_,_],
      [_,bodyColor,bodyColor,'MOUTH_PINK',bodyColor,_,_,_],
      [_,bodyColor,bodyColor,bodyColor,bodyColor,_,_,_],
      [_,bodyColor,'WHITE','WHITE','WHITE','WHITE',_,_],
      [_,bodyColor,'WHITE','WHITE','WHITE',bodyColor,_,_],
      [_,bodyColor,bodyColor,bodyColor,bodyColor,bodyColor,_,_],
      [_,bodyDark,bodyColor,bodyColor,bodyColor,bodyColor,_,_],
      [_,_,bodyDark,bodyDark,bodyDark,bodyDark,_,_],
      [_,_,bodyDark,bodyDark,bodyDark,bodyDark,_,_],
      [_,_,bodyDark,bodyDark,bodyDark,bodyDark,_,_],
      [_,_,_,_,_,_,_,_],
    ],
    [
      [_,_,bodyColor,bodyColor,bodyColor,_,_,_],
      [_,bodyColor,accentColor,accentColor,bodyColor,_,_,_],
      [_,bodyColor,bodyColor,bodyColor,bodyColor,_,_,_],
      [_,bodyColor,bodyColor,bodyColor,bodyColor,_,_,_],
      [_,bodyColor,'EYE_WHITE','EYE_BLACK',bodyColor,_,_,_],
      [_,bodyColor,'BLUSH','NOSE_PINK',bodyColor,_,_,_],
      [_,bodyColor,bodyColor,'MOUTH_PINK',bodyColor,_,_,_],
      [_,bodyColor,bodyColor,bodyColor,bodyColor,_,_,_],
      [_,bodyColor,'WHITE','WHITE','WHITE','WHITE',_,_],
      [_,bodyColor,'WHITE','WHITE','WHITE',bodyColor,_,_],
      [_,bodyColor,bodyColor,bodyColor,bodyColor,bodyColor,_,_],
      [_,bodyDark,bodyColor,bodyColor,bodyColor,bodyColor,_,_],
      [_,_,_,bodyDark,bodyDark,bodyDark,_,_],
      [_,_,bodyDark,bodyDark,_,_,_,_],
      [_,_,bodyDark,bodyDark,bodyDark,bodyDark,_,_],
      [_,_,_,_,_,_,_,_],
    ],
    [
      [_,_,bodyColor,bodyColor,bodyColor,_,_,_],
      [_,bodyColor,accentColor,accentColor,bodyColor,_,_,_],
      [_,bodyColor,bodyColor,bodyColor,bodyColor,_,_,_],
      [_,bodyColor,bodyColor,bodyColor,bodyColor,_,_,_],
      [_,bodyColor,'EYE_WHITE','EYE_BLACK',bodyColor,_,_,_],
      [_,bodyColor,'BLUSH','NOSE_PINK',bodyColor,_,_,_],
      [_,bodyColor,bodyColor,'MOUTH_PINK',bodyColor,_,_,_],
      [_,bodyColor,bodyColor,bodyColor,bodyColor,_,_,_],
      [_,bodyColor,'WHITE','WHITE','WHITE','WHITE',_,_],
      [_,bodyColor,'WHITE','WHITE','WHITE',bodyColor,_,_],
      [_,bodyColor,bodyColor,bodyColor,bodyColor,bodyColor,_,_],
      [_,bodyDark,bodyColor,bodyColor,bodyColor,bodyColor,_,_],
      [_,_,bodyDark,bodyDark,bodyDark,bodyDark,_,_],
      [_,_,bodyDark,bodyDark,bodyDark,bodyDark,_,_],
      [_,_,bodyDark,bodyDark,bodyDark,bodyDark,_,_],
      [_,_,_,_,_,_,_,_],
    ],
    [
      [_,_,bodyColor,bodyColor,bodyColor,_,_,_],
      [_,bodyColor,accentColor,accentColor,bodyColor,_,_,_],
      [_,bodyColor,bodyColor,bodyColor,bodyColor,_,_,_],
      [_,bodyColor,bodyColor,bodyColor,bodyColor,_,_,_],
      [_,bodyColor,'EYE_WHITE','EYE_BLACK',bodyColor,_,_,_],
      [_,bodyColor,'BLUSH','NOSE_PINK',bodyColor,_,_,_],
      [_,bodyColor,bodyColor,'MOUTH_PINK',bodyColor,_,_,_],
      [_,bodyColor,bodyColor,bodyColor,bodyColor,_,_,_],
      [_,bodyColor,'WHITE','WHITE','WHITE','WHITE',_,_],
      [_,bodyColor,'WHITE','WHITE','WHITE',bodyColor,_,_],
      [_,bodyColor,bodyColor,bodyColor,bodyColor,bodyColor,_,_],
      [_,bodyDark,bodyColor,bodyColor,bodyColor,bodyColor,_,_],
      [_,bodyDark,bodyDark,_,_,bodyDark,_,_],
      [_,_,_,bodyDark,bodyDark,_,_,_],
      [_,_,bodyDark,bodyDark,bodyDark,bodyDark,_,_],
      [_,_,_,_,_,_,_,_],
    ],
  ];

  // Right-facing: mirror of left
  function mirrorGrid(grid) {
    return grid.map(frame => frame.map(row => [...row].reverse()));
  }
  const CAT_RIGHT = mirrorGrid(CAT_LEFT);

  return {
    down: CAT_DOWN,
    up: CAT_UP,
    left: CAT_LEFT,
    right: CAT_RIGHT,
  };
}

// Create cat sprite variants with different colors for each floor
const CAT_COLORS = [
  // Floor 1: Orange cat
  createCatSprites('CAT_ORANGE', 'CAT_ORANGE_DK', 'CAT_CREAM'),
  // Floor 2: White cat
  createCatSprites('CAT_WHITE', 'CAT_GRAY', 'CAT_GRAY'),
  // Floor 3: Gray cat
  createCatSprites('CAT_GRAY_MD', 'CAT_GRAY_DK', 'CAT_GRAY'),
  // Floor 4: Black cat
  createCatSprites('CAT_BLACK', 'CAT_BLACK_DK', 'WHITE'),
];

// Get cat sprites for a specific floor (cycles through colors)
export function getCatSpritesForFloor(floorNum) {
  const colorIndex = (floorNum - 1) % CAT_COLORS.length;
  return CAT_COLORS[colorIndex];
}

// Default export for compatibility
export const BELLHOP_SPRITES = CAT_COLORS[0];

