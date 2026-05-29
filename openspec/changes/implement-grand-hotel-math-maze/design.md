## Context

Grand Hotel Gold is a greenfield browser game — no existing codebase, no prior specs. The target player is a 7-year-old; the build window is ~2 hours. The full experience spec lives in `docs/grand-hotel-math-maze.md`. Constraints: no frameworks, no build tools, no backend, vanilla JS + Canvas only. Runs from a local HTTP server (`python3 -m http.server 8000`).

## Goals / Non-Goals

**Goals:**
- Deliver a playable core loop (maze → math door → coins → build) within the 2-hour window.
- Maintain 60 fps on any modern desktop browser with no perceived latency on input.
- Keep every source file comprehensible to a single developer in one sitting.
- Persist hotel/money/progress across browser sessions via localStorage.

**Non-Goals:**
- Mobile / touch support (arrow keys only).
- Server-side anything (no API, no auth, no analytics).
- Procedural maze generation (hand-crafted grid for v1).
- Pixel-perfect sprite art (colored shapes with outlines are sufficient for the 2-hour window).
- Network multiplayer.

## Decisions

### 1. Canvas 2D over DOM rendering
**Decision:** Render everything (maze, bellhop, coins, HUD) on a single `<canvas>` element.  
**Why:** Frame-level control over rendering order, no layout reflow, pixel-art scaling (`imageSmoothingEnabled = false`) is trivial, and the particle burst system fits naturally in a clear-and-redraw loop. DOM diffing adds complexity with no benefit here.  
**Alternative considered:** CSS grid + positioned `<div>` elements. Rejected — hitbox logic and particle effects become needlessly complex.

### 2. Logical resolution 320 × 180, scaled to window
**Decision:** All game logic runs on a 320 × 180 logical grid; a CSS `transform: scale()` fills the browser window while preserving the retro aspect ratio.  
**Why:** Keeps coordinate math simple (integers), guarantees pixel-art sharpness at any window size, and makes the "retro" aesthetic intentional rather than accidental.  
**Alternative considered:** Render at native window size. Rejected — fractional coordinates break pixel art crispness and complicate tile sizing.

### 3. requestAnimationFrame game loop with delta-time
**Decision:** Single `requestAnimationFrame` loop in `game.js`; all updates receive `dt` (milliseconds since last frame).  
**Why:** Smooth 60 fps across different refresh rates; speed-bonus timer stays accurate regardless of frame rate.  
**Alternative considered:** `setInterval` at 60 ms. Rejected — loses sync with display refresh, causes visible tearing.

### 4. Grid-based maze (2D array), static for v1
**Decision:** The maze is a 2D array of cell types (`WALL`, `FLOOR`, `DOOR`, `STASH`, `LIFT`). Floor 1 is hand-authored; subsequent floors reuse a small set of hand-crafted templates.  
**Why:** Procedural generation is a solved but time-consuming problem. Hand-crafting guarantees the dead-end stash layout and door placement satisfy the design spec within the time budget.  
**Alternative considered:** Recursive backtracker. Deferred — easy to add later once core loop is validated.

### 5. ES6 modules (`<script type="module">`)
**Decision:** Each `src/*.js` file is an ES6 module; `index.html` imports `game.js` as the entry point.  
**Why:** Enables named imports/exports without a bundler, keeps files independently readable, avoids global namespace pollution.  
**Alternative considered:** Single concatenated JS file. Rejected — makes future edits harder and debugging a mess.

### 6. Web Audio API for SFX, HTML5 `<audio>` for music
**Decision:** SFX (ding, ching, buzz, combo, fanfare, cha-ching) are generated or loaded via Web Audio API. The looping chiptune uses an HTML5 `<audio>` element with `loop` attribute.  
**Why:** Web Audio allows precise timing and programmatic gain control (critical for mute toggle). HTML5 `<audio>` handles seamless looping of the music file with zero extra code.  
**Alternative considered:** All audio via HTML5 `<audio>`. Rejected — cannot reliably trigger multiple rapid SFX overlaps (coin burst plays ching many times per second).

### 7. Web Speech API for spoken sums
**Decision:** `window.speechSynthesis.speak()` reads the sum aloud when a door junction is reached.  
**Why:** Zero asset overhead — no pre-recorded audio files to load, works in all modern browsers, voice can be tuned per OS. Mute toggle calls `speechSynthesis.cancel()`.  
**Alternative considered:** Pre-recorded MP3s for each sum. Deferred — asset production takes time; TTS covers all sums instantly.

### 8. Single global state object
**Decision:** `game.js` owns a single `state` object (`{ player, maze, coins, combo, timer, difficulty, hotel, ui }`). All modules receive or import from it.  
**Why:** For a game this size, a central state object is simpler and faster to debug than an event bus or observer pattern. No framework needed.  
**Alternative considered:** Event-driven pub/sub. Rejected — adds indirection and makes execution flow harder to follow during a 2-hour build.

### 9. localStorage under key `grand-hotel-save`
**Decision:** All persistent state serialises to a single JSON blob saved to `localStorage['grand-hotel-save']` after each floor clear.  
**Why:** Single-key write is atomic from the browser's perspective and trivial to wipe/debug. Structured as `{ hotel, money, highestFloor, difficulty, stats }`.  
**Alternative considered:** IndexedDB. Rejected — async API adds complexity; the data volume (~1 KB) doesn't justify it.

## Risks / Trade-offs

| Risk | Mitigation |
|---|---|
| Web Speech API voice unavailable (some browsers/OS) | Degrade gracefully — skip TTS, game is fully playable without it |
| Canvas performance on older hardware | Keep sprite counts low (≤ 1 bellhop, ≤ 20 coin particles, ≤ 8 door tiles); no blur/shadow filters in hot path |
| Hand-crafted maze limits replayability | Ship 3 floor templates; procedural generation can replace them in v2 |
| localStorage cleared by browser (private mode, storage pressure) | Show a soft warning on load if save not found; game always starts fresh gracefully |
| 2-hour time budget slips | MUST-list items (core loop, juice, persistence) take priority; SHOULD/COULD items are cut, not half-done |

## Open Questions

- **Player name / color personalization** — design doc lists this as COULD; confirm whether to include in v1 or skip entirely.
- **Number of hand-crafted floor templates** — 3 is proposed; confirm whether 2 is sufficient to ship within time budget.
- **Combo visual** — flames vs sparkles vs counter badge; any strong preference before renderer work starts?
