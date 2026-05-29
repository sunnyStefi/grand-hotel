## 1. Palette & Sprite Foundation

- [ ] 1.1 Create `src/sprites.js` with the 16-color `PALETTE` constant (all named entries: BURGUNDY, GOLD, CREAM, WALL_DARK, WOOD_DARK, etc.)
- [ ] 1.2 Add `drawSprite(ctx, grid, x, y)` helper in `src/sprites.js` that iterates a 2D palette-key array and calls `ctx.fillRect` per pixel
- [ ] 1.3 Add `<script src="src/sprites.js">` to `index.html` before `renderer.js`
- [ ] 1.4 Replace all raw hex color strings in `src/renderer.js` with `PALETTE.*` references

## 2. Bellhop Sprite

- [ ] 2.1 Define bellhop pixel grid in `src/sprites.js`: 4 directional sets × 4 walk frames × 8×16 pixels (palette-key 2D arrays)
- [ ] 2.2 Add `walkFrame` and `direction` fields to `game.state` in `src/game.js`
- [ ] 2.3 Advance `walkFrame` every 6 ticks when moving, reset to 0 when still
- [ ] 2.4 Update `src/renderer.js` `drawBellhop()` to call `drawSprite` with the correct direction+frame grid instead of drawing a rectangle

## 3. Maze Wall & Floor Textures

- [ ] 3.1 Rewrite wall cell drawing in `src/renderer.js`: base fill `WALL_MID`, top/left highlight `WALL_LT`, bottom/right shadow `WALL_DARK`
- [ ] 3.2 Add horizontal brick mortar lines inside wall cells using 1px `WALL_DARK` rows every 4 logical pixels
- [ ] 3.3 Rewrite floor cell drawing: checkerboard `CREAM` / `CREAM_DK` based on `(col + row + floorOffset) % 2`
- [ ] 3.4 Pass current floor number into the floor draw call to compute `floorOffset`

## 4. Ornate Doors

- [ ] 4.1 Rewrite door drawing in `src/renderer.js`: `WOOD_DARK` base, vertical `WOOD_MID` grain lines, `WOOD_LT` left highlight, 2px `GOLD` frame border
- [ ] 4.2 Add a 2×3px gold door knob pixel cluster on the right side of each door
- [ ] 4.3 Style the sum badge above the door: `GOLD` background, `NAVY` text, rounded corners (2px radius)
- [ ] 4.4 Add correct-answer door flash: fill door with `GOLD_LT` for 8 frames on correct selection
- [ ] 4.5 Add wrong-answer door overlay: draw red X (`RED` palette) over door for 12 frames on incorrect selection

## 5. Coin Animation

- [ ] 5.1 Add `coinFrame` counter to each coin in `game.state`; advance every 8 ticks, cycle 0–3
- [ ] 5.2 Rewrite coin drawing in `src/renderer.js` to render 4 frames: full circle, wide ellipse, narrow ellipse, wide ellipse
- [ ] 5.3 Draw a 1×1 `GOLD_LT` glint pixel at top-right of coin on frame 0

## 6. Particle System Upgrade

- [ ] 6.1 Add `vx`, `vy`, `gravity` fields to coin particle objects in `src/game.js`; init with random `vx` (±3), `vy` (-4 to -1), `gravity = 0.15`
- [ ] 6.2 Apply gravity each tick: `particle.vy += gravity`; update `particle.x += vx`, `particle.y += vy`
- [ ] 6.3 Render coin particles as 2×2 `GOLD` squares in `src/renderer.js` (replace circle draw)
- [ ] 6.4 Add light-ray particles on correct answer: emit 8 rays from door center, each expanding outward 3px/tick and fading alpha over 20 ticks
- [ ] 6.5 Render light rays in `src/renderer.js` as short line segments in `GOLD_LT` with decreasing `globalAlpha`

## 7. Screen Shake

- [ ] 7.1 Add `shake: { x: 0, y: 0, ttl: 0 }` to `game.state` initial state in `src/game.js`
- [ ] 7.2 Set `shake = { x: 4, y: 3, ttl: 12 }` on wrong-answer event
- [ ] 7.3 Each tick when `ttl > 0`: multiply `x` and `y` by -0.7, decrement `ttl`; zero both when `ttl` reaches 0
- [ ] 7.4 In `src/renderer.js` render function: apply `ctx.save()`, `ctx.translate(shake.x, shake.y)` before drawing, `ctx.restore()` after

## 8. CRT Overlay & Vignette

- [ ] 8.1 Add a `<div id="scanlines">` sibling to the canvas in `index.html`, positioned absolute over the canvas, with CSS `pointer-events: none`
- [ ] 8.2 Style `#scanlines` with `repeating-linear-gradient(transparent 0px, transparent 1px, rgba(0,0,0,0.5) 1px, rgba(0,0,0,0.5) 2px)` at full canvas size
- [ ] 8.3 Add vignette draw at end of each frame in `src/renderer.js`: radial gradient `transparent` center → `rgba(0,0,0,0.35)` edges, full canvas size

## 9. Hotel Wallpaper Background

- [ ] 9.1 Create an offscreen canvas in `src/renderer.js` `init()` and draw one tile of the diamond wallpaper pattern using `NAVY` base and `WALL_MID` diamond outlines
- [ ] 9.2 Call `ctx.createPattern(offscreenCanvas, 'repeat')` and store as `wallpaperPattern`
- [ ] 9.3 Draw `wallpaperPattern` as the first operation each frame before any maze element

## 10. Retro HUD

- [ ] 10.1 Rewrite money counter badge in `src/renderer.js`: `NAVY` fill, 2px `GOLD` border, `CREAM` text with `$` prefix icon drawn as pixel art
- [ ] 10.2 Rewrite floor indicator badge: styled as a hotel room number plate (`WOOD_MID` background, `GOLD` text, `GOLD` border)
- [ ] 10.3 Rewrite combo badge: show `×N` in `CREAM` on `BURGUNDY` background; when combo ≥ 2 add star-burst decoration in `GOLD_LT` around the badge border

## 11. Verification

- [ ] 11.1 Run dev server (`python3 -m http.server 8000`) and verify 60fps with all new visuals active (use browser DevTools Performance tab)
- [ ] 11.2 Confirm all 10 visual requirements from the spec are visible: palette, sprite, bellhop animation, wall texture, floor tiles, ornate doors, spinning coins, CRT overlay, wallpaper, HUD badges
- [ ] 11.3 Play through a full floor: correct answers trigger light rays + coin burst, wrong answers trigger red X + shake, floor clear works, build screen renders correctly
- [ ] 11.4 Verify no gameplay regression: movement, collision, math answers, combo, money counter, persistence all behave as before
