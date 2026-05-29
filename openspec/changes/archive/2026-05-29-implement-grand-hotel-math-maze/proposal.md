## Why

Grand Hotel Gold does not exist yet. This change builds the complete game from scratch — a browser-playable, vanilla-JS math maze for a 7-year-old that wraps fast addition practice inside a coin-collecting, hotel-building loop. The design doc is finalized (`docs/grand-hotel-math-maze.md`); this change translates it into working code within a 2-hour build window.

## What Changes

- **New:** `index.html` entry point with Canvas setup and inline minimal CSS
- **New:** `src/game.js` — main game loop, state machine, floor progression
- **New:** `src/renderer.js` — Canvas 2D drawing (maze, bellhop, doors, coins, HUD)
- **New:** `src/input.js` — arrow-key capture, pause (spacebar), mute toggle
- **New:** `src/maze.js` — static grid maze layout, door placement, dead-end stash locations
- **New:** `src/math-engine.js` — adaptive tier system, sum pool, decoy generation
- **New:** `src/audio.js` — Web Audio SFX + HTML5 music loop + spoken numbers via TTS
- **New:** `src/storage.js` — localStorage read/write for hotel, money, progress, stats
- **New:** `assets/` — placeholder pixel-art sprites and audio files

## Capabilities

### New Capabilities

- `maze-navigation`: Maze floor rendering and bellhop movement — grid layout, wall collision, arrow-key controls, dead-end coin stash discovery, lift/exit visibility.
- `math-engine`: Adaptive sum generation and door mechanic — three difficulty tiers (sums to 10/15/20), smart decoy answers (near-misses), tier upgrade/downgrade rules checked every 5 answers, door correct/wrong feedback.
- `coin-rewards`: Coin earning system — base 15 coins per correct door, speed bonus (+15 if < 3 s), combo multiplier (×1.5/×2.0/×2.5 on consecutive correct answers), animated counter with burst particles and juice.
- `hotel-builder`: Build screen and session flow — floor-clear → cash-out → build screen (spend coins on rooms/floors) → lift to next floor; hotel visual growth with star rating; localStorage persistence of hotel state, money, and difficulty progress.
- `audio`: All audio concerns — looping chiptune music track, SFX (ding/ching/buzz/combo/fanfare/cha-ching), Web Speech API for spoken sums, mute toggle always visible.

### Modified Capabilities

*(No existing specs — this is a greenfield build.)*

## Impact

- **New files only** — no existing code is modified.
- **No dependencies** — vanilla HTML5/Canvas/JS, no build tools, no npm.
- **Browser APIs used:** Canvas 2D, Web Audio API, Web Speech API, localStorage.
- **Dev server:** `python3 -m http.server 8000` — no build step.
- **Persistence:** localStorage key `grand-hotel-save` for all player state.
