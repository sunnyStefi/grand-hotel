## Why

The game currently renders as flat colored rectangles — functional but forgettable. A 7-year-old (and any adult watching) should feel like they stepped into a tiny, living hotel world the moment the game loads. Right now it doesn't earn that reaction. We're going for jaw-drop retro: the kind of pixel art that makes people stop and say "wait, you made this?"

## What Changes

- **Bellhop character**: Replace the plain rectangle with a detailed pixel-art bellhop — red uniform, gold buttons, pillbox hat, animated walk cycle (4 frames, each direction). He should ooze personality.
- **Maze walls**: Textured brick/stone pattern with subtle shading and corner details. Not flat gray — depth, cracks, moss hints.
- **Floors**: Checkerboard or herringbone tile pattern with slight color variation per floor (lobby = marble white/gold, upper floors = warmer hues).
- **Doors**: Ornate wooden door sprites with gold door knobs, number plates, and a glowing sum display above each. Wrong-answer doors get a red X flash; correct ones burst open with light.
- **Coins**: Spinning gold coin animation (4-frame flip), glinting highlight pixel.
- **Color palette**: Locked to a strict 16-color retro palette — deep burgundy, gold, cream, forest green, navy. Every element shares this palette for visual cohesion.
- **Lighting FX**: Scanline overlay on the canvas for authentic CRT feel. Subtle vignette around screen edges.
- **HUD**: Pixel-font money counter with dollar-sign icon, floor indicator styled as a hotel room number plate, combo badge with star burst.
- **Background**: Subtle repeating wallpaper pattern (classic hotel diamond or fleur-de-lis) behind the maze.
- **Particle system upgrade**: Coins burst with arc trajectories and spin; correct-answer flash sends light rays from the door; wrong-answer gets a screen shake + dust cloud.

## Capabilities

### New Capabilities
- `retro-visual-style`: Complete visual overhaul — pixel palette, sprite system, CRT overlay, wallpaper background, enhanced particles, and all rendering changes.

### Modified Capabilities
<!-- none — this is additive rendering work, no spec-level behavior changes -->

## Impact

- `src/renderer.js` — primary file; nearly every draw function gets upgraded
- `src/game.js` — screen shake state, particle trajectory updates
- `index.html` — canvas scaling, CSS for CRT overlay and scanlines
- New sprite data inline in renderer (no external assets — pure Canvas 2D drawing code)
- No gameplay logic changes; math engine, storage, input untouched
