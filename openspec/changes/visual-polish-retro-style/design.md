## Context

The game is a Canvas 2D app rendered at a fixed logical resolution (320×180) scaled up to fill the browser window. All drawing happens in `src/renderer.js` via plain Canvas 2D API — no sprite sheets, no external assets. The current renderer draws walls as filled rectangles, the bellhop as a colored rectangle, coins as circles, and doors as rectangles with text. Everything is functional but visually plain.

Constraints:
- No build tools, no external dependencies, no image files
- Must stay vanilla JS / Canvas 2D
- Must run at 60fps on a mid-range laptop browser
- Cannot change gameplay logic, input, math engine, or storage

## Goals / Non-Goals

**Goals:**
- Make the game visually arresting — the kind of retro pixel art that makes people stop scrolling
- Cohesive 16-color retro palette across every element
- Detailed, characterful bellhop with directional walk animation
- Textured maze walls with brick detail and depth shading
- Ornate doors with glow effects and dramatic open/wrong-answer feedback
- Spinning coin animation with glint
- CRT scanline overlay + vignette for authentic arcade feel
- Hotel wallpaper background pattern
- Pixel-style HUD (money, floor, combo) with retro badge aesthetics
- Upgraded particle system: arc trajectories, light rays, screen shake

**Non-Goals:**
- External image assets (everything drawn in code)
- Changes to gameplay, maze layout, math logic, or input
- Sound design changes
- Mobile/touch support changes

## Decisions

### D1: All sprites drawn in Canvas 2D code (no image files)
**Decision:** Define sprites as pixel grids (2D arrays of palette indices) and render them via `ctx.fillRect` at 1×1 logical pixels, scaled up by the canvas transform.

**Why over alternatives:**
- *Image files*: require asset loading, HTTP requests, CORS handling — too much overhead with no build tool
- *SVG*: doesn't give the authentic pixel-art look at low resolution
- *Canvas pixel grid*: zero dependencies, instant load, full palette control, easy to animate by swapping frames

### D2: Strict 16-color palette, defined once as a constant
**Decision:** Define `PALETTE` as an object with named entries (`BURGUNDY`, `GOLD`, `CREAM`, `NAVY`, `WALL_DARK`, etc.). Every draw call references palette entries by name, never raw hex strings.

**Why:** Enforces visual cohesion. Changing a palette entry updates every element that uses it. Makes theming per floor trivial (swap 2–3 palette entries).

**Palette (16 colors):**
```
BURGUNDY     #6B2737   (primary accent, bellhop uniform)
BURGUNDY_LT  #8B3A4A   (uniform highlight)
GOLD         #D4A017   (coins, door hardware, HUD accents)
GOLD_LT      #F0C040   (coin glint, door glow)
CREAM        #F5E6C8   (floor tiles light)
CREAM_DK     #C8B99A   (floor tiles dark, checkerboard)
WALL_DARK    #1A1A2E   (wall base, deep shadow)
WALL_MID     #2D2D44   (brick mid-tone)
WALL_LT      #3D3D5C   (brick highlight edge)
WOOD_DARK    #3B1F0D   (door base)
WOOD_MID     #6B3A1F   (door mid)
WOOD_LT      #8B5A2B   (door highlight)
GREEN        #2D6A4F   (moss, correct flash accent)
NAVY         #16213E   (background, HUD bg)
WHITE        #FFFFFF   (text, coin glint pixel)
RED          #C0392B   (wrong-answer X flash, error state)
```

### D3: Bellhop as a 8×16 pixel sprite with 4 directional sets × 4 walk frames
**Decision:** Define bellhop as a 3D array `[direction][frame][row][col]` of palette keys. Renderer reads `game.state.direction` and `game.state.walkFrame` to pick the right frame.

Walk frame advances every 6 game ticks when moving, resets to 0 when still (standing pose).

**Why 8×16:** Tall enough to show hat + uniform + legs with readable detail at 2–3× zoom. Small enough to stay crisp at 320×180 logical resolution.

### D4: CRT effect via CSS + Canvas composite
**Decision:**
- CSS: `canvas` element gets `image-rendering: pixelated` (already set) plus a scanline overlay via a sibling `<div>` with a repeating linear-gradient (1px black / 1px transparent at 50% opacity).
- Canvas: After each frame, draw a radial gradient (transparent center → black edges) as a vignette using `globalAlpha = 0.35`.

**Why over full shader approach:** WebGL is overkill for a Canvas 2D game. CSS overlay + Canvas vignette achieves 90% of the CRT look with zero complexity cost.

### D5: Screen shake as a renderer-level transform offset
**Decision:** `game.state.shake = { x, y, ttl }`. At render start, apply `ctx.translate(shake.x, shake.y)` before drawing anything. `game.js` decrements `ttl` each tick and lerps `x, y` toward 0.

Shake triggered by wrong-answer event (magnitude 4px, 12 tick duration).

**Why in renderer/game vs. input:** Shake is a visual feedback concern, not input. Keeping it in game state (not renderer state) means the renderer stays stateless.

### D6: Particle system upgrade — arc trajectories
**Decision:** Coin particles get `vx`, `vy` (initial velocity), `gravity = 0.15` applied each tick. Particles render as a 2×2 square (not circle) in gold palette colors, rotating through 4 coin-face frames.

Light-ray particles (correct answer): 8 rays emanating from door center, each a short line segment that expands outward and fades alpha over 20 ticks.

**Why arc over straight-line:** Arcing coins look physically satisfying. Straight-line scatter is what the current system does and it reads as "explosion effect" not "coins flying."

### D7: Wallpaper as a pre-rendered offscreen canvas pattern
**Decision:** On init, draw one tile of the diamond/fleur-de-lis pattern onto an offscreen `OffscreenCanvas` (or hidden `<canvas>`), then use `ctx.createPattern()`. Fill the background each frame before drawing the maze.

**Why:** Pattern fill is one draw call regardless of canvas size. Redrawing the wallpaper tile-by-tile each frame would cost ~N*M fillRect calls.

## Risks / Trade-offs

- **Sprite definition verbosity** → The pixel grids for bellhop (4 dirs × 4 frames × 8×16) are ~2000 palette-index values. Tedious to write but not complex. Mitigation: define a helper `px(paletteKey)` alias and use template-literal grid notation for readability.
- **60fps with scanline CSS overlay** → CSS overlay compositing is GPU-accelerated and costs nothing measurable. Vignette gradient is one draw call. No performance risk.
- **Walk frame desync on diagonal input** → Game only allows 4-directional movement; no diagonal. No risk.
- **CRT div overlapping click targets** → The scanline div sits on top of the canvas. Set `pointer-events: none` on it. [Risk] → one CSS property, trivially mitigated.
- **Offscreen canvas support** → `OffscreenCanvas` is supported in all modern browsers. Fallback: use a hidden `<canvas>` element if needed.

## Migration Plan

1. Add `PALETTE` constant and sprite data to a new `src/sprites.js` file (imported by renderer via `<script>` tag in `index.html`).
2. Update `src/renderer.js` top-to-bottom: palette refs, wallpaper init, then each draw function.
3. Add scanline `<div>` to `index.html` with CSS.
4. Add `shake` state to `src/game.js`, wire to wrong-answer event.
5. Upgrade particle system in `src/game.js` (arc physics) and `src/renderer.js` (spin frames, light rays).
6. Manual play-test: verify 60fps, all visual states look correct, no regression in gameplay.

Rollback: `git revert` — no data migration, no breaking API changes.

## Open Questions

- **Bellhop idle animation?** A 2-frame breathing/blinking idle would add life. Doable post-MVP of this change.
- **Per-floor palette shift?** Lobby = cream/gold, upper floors = warmer or cooler tint. Easy to add once base palette is locked.
- **Fleur-de-lis vs. diamond wallpaper?** Either works. Diamond is simpler to code; fleur-de-lis is more hotel-iconic. Decision deferred to implementation — pick whichever reads better at 320×180.
