## ADDED Requirements

### Requirement: 16-color retro palette
The system SHALL define a single `PALETTE` constant in `src/sprites.js` containing exactly 16 named color entries. Every draw call in `src/renderer.js` SHALL reference palette entries by name; raw hex strings SHALL NOT appear in renderer code.

#### Scenario: Palette is the sole source of color
- **WHEN** any element is drawn to the canvas
- **THEN** its fill color is derived exclusively from a `PALETTE` named entry

#### Scenario: Palette swap updates all elements
- **WHEN** a single palette entry value is changed
- **THEN** every element referencing that entry reflects the new color without any other code changes

---

### Requirement: Pixel-art sprite system
The system SHALL define sprites as 2D arrays of palette keys in `src/sprites.js`. The renderer SHALL draw sprites by iterating each row/column and calling `ctx.fillRect` at 1×1 logical pixels. No external image files SHALL be used.

#### Scenario: Sprite renders at correct scale
- **WHEN** a sprite is drawn at position (x, y)
- **THEN** each pixel in the sprite grid maps to exactly one logical pixel on the canvas, scaled up uniformly by the canvas transform

#### Scenario: No image assets required
- **WHEN** the game loads
- **THEN** all visual elements render without fetching any image file

---

### Requirement: Bellhop character sprite
The system SHALL render the bellhop as an 8×16 pixel sprite. The sprite SHALL have 4 directional sets (up, down, left, right) each with 4 walk frames, defined in `src/sprites.js`. The renderer SHALL select the frame based on `game.state.direction` and `game.state.walkFrame`.

#### Scenario: Walk animation plays while moving
- **WHEN** the bellhop is moving in any direction
- **THEN** `walkFrame` advances by 1 every 6 game ticks, cycling through frames 0–3

#### Scenario: Bellhop stands still when not moving
- **WHEN** no movement input is active
- **THEN** `walkFrame` is 0 (standing pose) and does not advance

#### Scenario: Direction reflects last input
- **WHEN** the bellhop moves left
- **THEN** the left-facing sprite set is rendered; same rule applies for all 4 directions

---

### Requirement: Textured maze walls
The system SHALL draw maze walls with a brick/stone texture using at least 3 palette tones (`WALL_DARK`, `WALL_MID`, `WALL_LT`). Each wall cell SHALL include: a base fill, a darker inset shadow line on the bottom and right edges, and a lighter highlight on the top and left edges.

#### Scenario: Wall has visible depth
- **WHEN** a wall cell is rendered
- **THEN** the top-left edges are drawn in `WALL_LT` and bottom-right edges in `WALL_DARK`, creating a raised-brick illusion

#### Scenario: Brick grid is visible
- **WHEN** wall cells are rendered
- **THEN** a horizontal brick-row pattern is visible using alternating mortar lines in `WALL_DARK`

---

### Requirement: Tiled floor pattern
The system SHALL draw floor cells as a checkerboard pattern alternating `CREAM` and `CREAM_DK` palette entries. The pattern SHALL be offset by floor number so each floor has a distinct but consistent look.

#### Scenario: Checkerboard pattern renders on floor cells
- **WHEN** a floor (walkable) cell is drawn
- **THEN** its color alternates between `CREAM` and `CREAM_DK` based on (col + row) % 2

#### Scenario: Pattern is stable per floor
- **WHEN** the player clears a floor and advances to the next
- **THEN** the new floor's tile pattern uses a different starting offset

---

### Requirement: Ornate door sprites
The system SHALL render each door as a wooden door graphic using `WOOD_DARK`, `WOOD_MID`, and `WOOD_LT` palette tones with a gold door knob pixel and a gold frame border. The math sum SHALL be displayed above the door in a glowing badge styled with `GOLD` background and `NAVY` text.

#### Scenario: Door renders with wood texture
- **WHEN** a door cell is drawn in its default (closed) state
- **THEN** vertical wood-grain lines in `WOOD_MID` over a `WOOD_DARK` base are visible, with a `WOOD_LT` highlight on the left edge

#### Scenario: Correct answer opens door with light burst
- **WHEN** the player selects the correct answer door
- **THEN** the door flashes `GOLD_LT` for 8 frames, then disappears, and 8 light-ray particles emanate from the door center

#### Scenario: Wrong answer flashes red X
- **WHEN** the player selects an incorrect answer door
- **THEN** a red X overlay (`RED` palette) flashes on the door for 12 frames and screen shake is triggered

---

### Requirement: Spinning coin animation
The system SHALL render coins as a 4-frame spin animation cycling through: full circle (face), ellipse wide, ellipse narrow, ellipse wide (reverse). A 1×1 `GOLD_LT` glint pixel SHALL appear at the top-right of the coin on frame 0.

#### Scenario: Coin animates continuously
- **WHEN** a coin is present on the floor
- **THEN** its frame advances every 8 game ticks, cycling 0→1→2→3→0

#### Scenario: Collected coin bursts into arc particles
- **WHEN** the player collects a coin
- **THEN** 6–8 coin particles are emitted, each with random `vx` (±3) and `vy` (-4 to -1), subject to `gravity = 0.15` per tick, rendered as 2×2 `GOLD` squares cycling through spin frames

---

### Requirement: CRT visual overlay
The system SHALL render a scanline effect and screen vignette on every frame. The scanline effect SHALL be a CSS `<div>` with `pointer-events: none` overlaying the canvas, using a repeating linear-gradient of 1px semi-transparent black lines. The vignette SHALL be a radial gradient drawn on the canvas after all game elements, with `globalAlpha = 0.35`.

#### Scenario: Scanlines are visible but not obstructive
- **WHEN** the game is running
- **THEN** horizontal scanlines are visible across the entire canvas at 50% opacity, and all game elements beneath remain fully legible

#### Scenario: Vignette darkens screen edges
- **WHEN** the game is running
- **THEN** the canvas corners and edges are darkened toward black while the center remains at full brightness

#### Scenario: Overlay does not block input
- **WHEN** the player presses any key
- **THEN** the CSS overlay div does not intercept keyboard or mouse events (`pointer-events: none`)

---

### Requirement: Hotel wallpaper background
The system SHALL tile a repeating diamond or fleur-de-lis pattern behind the maze using `ctx.createPattern()` from a pre-rendered offscreen canvas. The pattern SHALL be initialized once at game start and reused every frame.

#### Scenario: Wallpaper fills canvas before maze draws
- **WHEN** each frame renders
- **THEN** the wallpaper pattern is drawn first, covering the entire canvas, before walls, floors, or any game elements

#### Scenario: Pattern is initialized once
- **WHEN** the game starts
- **THEN** the offscreen canvas pattern is created exactly once and reused for all subsequent frames

---

### Requirement: Screen shake on wrong answer
The system SHALL store shake state as `{ x, y, ttl }` in `game.state`. On a wrong-answer event, shake SHALL be initialized to `{ x: 4, y: 3, ttl: 12 }`. Each tick, `x` and `y` SHALL be multiplied by -0.7 (alternating sign) and `ttl` decremented. The renderer SHALL apply `ctx.translate(shake.x, shake.y)` before drawing any game element.

#### Scenario: Shake triggers on wrong answer
- **WHEN** the player selects an incorrect answer door
- **THEN** `game.state.shake` is set to `{ x: 4, y: 3, ttl: 12 }`

#### Scenario: Shake decays and stops
- **WHEN** `game.state.shake.ttl` reaches 0
- **THEN** `shake.x` and `shake.y` are 0 and no translation is applied

#### Scenario: Shake does not affect game logic
- **WHEN** screen shake is active
- **THEN** collision detection, player position, and all game state values are unaffected by the visual offset

---

### Requirement: Retro pixel-style HUD
The system SHALL render the money counter, floor indicator, and combo badge using bold block-letter drawing (or a pixel font via Canvas) on `NAVY` background badges. Each badge SHALL have a `GOLD` border of 2px and `CREAM` text. The money counter SHALL display a `$` prefix icon.

#### Scenario: HUD elements are legible at all times
- **WHEN** any game state is active (playing, paused, door junction)
- **THEN** the HUD badges are drawn on top of all other elements and remain fully visible

#### Scenario: Combo badge shows multiplier
- **WHEN** the combo count is 2 or higher
- **THEN** the combo badge displays `×2`, `×3`, etc. with a star-burst decorative border in `GOLD_LT`
