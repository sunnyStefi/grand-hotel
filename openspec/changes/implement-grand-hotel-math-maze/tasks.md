## 1. Project Scaffold

- [ ] 1.1 Create `index.html` with a single `<canvas id="game">` element, inline minimal CSS (black background, centered canvas), and `<script type="module" src="src/game.js">`
- [ ] 1.2 Create empty module stubs: `src/game.js`, `src/renderer.js`, `src/input.js`, `src/maze.js`, `src/math-engine.js`, `src/audio.js`, `src/storage.js`
- [ ] 1.3 Create `assets/audio/` directory with placeholder filenames listed in a `README` (music-loop.mp3, sfx-ding.mp3, sfx-ching.mp3, sfx-buzz.mp3, sfx-combo.mp3, sfx-fanfare.mp3, sfx-cashout.mp3)
- [ ] 1.4 Verify the game loads without errors in a browser at `http://localhost:8000` (blank canvas, no console errors)

## 2. Game Loop & Input

- [ ] 2.1 In `game.js`, initialise the canvas at logical 320×180 and scale it to fill the window via CSS `transform: scale()`, preserving aspect ratio; set `imageSmoothingEnabled = false`
- [ ] 2.2 Implement the `requestAnimationFrame` loop in `game.js` with delta-time (`dt`) passed to `update(dt)` and `render()` each frame
- [ ] 2.3 In `input.js`, capture `keydown`/`keyup` for arrow keys and export a `getInput()` function returning the current held direction
- [ ] 2.4 In `input.js`, capture `Spacebar` keydown to toggle a `paused` flag exported from `game.js`
- [ ] 2.5 Verify 60 fps loop runs and `getInput()` returns correct direction on arrow key hold

## 3. Maze Rendering & Navigation

- [ ] 3.1 In `maze.js`, define cell type constants (`WALL`, `FLOOR`, `DOOR_JUNCTION`, `STASH`, `LIFT`) and export a `createFloor(template)` function that returns a 20×11 2D array
- [ ] 3.2 Author one hand-crafted floor template (20×11 grid) with at least 4 `DOOR_JUNCTION` cells, 3 `STASH` cells, dead-end corridors, and one `LIFT` cell
- [ ] 3.3 In `renderer.js`, implement `drawMaze(ctx, maze)` — draw each cell as a 16×16 px tile using distinct fill colours (WALL: dark grey, FLOOR: tan, DOOR_JUNCTION: gold border, STASH: green dot, LIFT: cyan arrow)
- [ ] 3.4 In `game.js`, initialise bellhop position at the maze start cell; represent as `{ x, y }` in grid coordinates
- [ ] 3.5 In `game.js` update loop, read `getInput()` and move bellhop one cell per 250 ms in the held direction; block on `WALL` cells
- [ ] 3.6 In `renderer.js`, draw the bellhop as a coloured rectangle (or sprite if available) at its current grid position
- [ ] 3.7 Author two additional floor templates (floors 2 and 3) for variety; `maze.js` cycles through templates by floor number

## 4. Math Engine

- [ ] 4.1 In `math-engine.js`, define sum pools for each tier: `TIER_10` (sums 2–10), `TIER_15` (sums 11–15), `TIER_20` (sums 16–20); export `generateSum(tier)` returning `{ a, b, answer }`
- [ ] 4.2 In `math-engine.js`, implement `generateDecoys(answer, count)` returning `count` distinct near-miss integers (within ±3, positive, not equal to answer)
- [ ] 4.3 In `game.js`, when the bellhop enters a `DOOR_JUNCTION` cell: generate a sum, place 2–4 answer door overlays on adjacent `FLOOR` cells (one correct, rest decoys), record junction start timestamp
- [ ] 4.4 In `renderer.js`, render answer doors as bold number labels on coloured door tiles; render the sum banner (`a + b = ?`) in large text above the junction
- [ ] 4.5 In `game.js`, detect bellhop movement into an answer door overlay: if correct → open door (convert to `FLOOR`), record correct answer + elapsed time, clear overlays; if wrong → push bellhop back one cell, flash door red, record wrong answer + elapsed time
- [ ] 4.6 In `math-engine.js`, implement `updateTier(recentAnswers)` — checks last 5 answers; upgrades tier if 3+ correct AND avg time < 3 s; downgrades if 2+ errors OR avg time > 5 s; clamps to TIER_10/TIER_20 boundaries
- [ ] 4.7 Call `updateTier` in `game.js` after every 5th answer is recorded

## 5. Coin & Combo System

- [ ] 5.1 In `game.js`, implement `calculateAward(elapsedMs, streak)` returning coin amount: base 15 + speed bonus 15 (if elapsed < 3000 ms), multiplied by combo factor (×1.0/1.5/2.0/2.5 for streak 0–1/2/3/4+), rounded to integer
- [ ] 5.2 On correct answer, call `calculateAward`, add result to `state.money`, increment `state.streak`; on wrong answer, reset `state.streak` to 0
- [ ] 5.3 In `renderer.js`, implement a coin particle system: on award, spawn 6–10 particles at the door position, animate outward then arc toward counter position over 600 ms
- [ ] 5.4 In `renderer.js`, implement `drawMoneyCounter(ctx, displayValue)` — renders current display value; in `game.js`, animate `displayValue` from old to new balance over 400 ms on each award
- [ ] 5.5 In `renderer.js`, render the combo label (`×1.5 COMBO`, etc.) in the HUD when `state.streak >= 2`; hide when streak < 2

## 6. Stash Collection & Floor-Clear

- [ ] 6.1 In `game.js` update loop, when bellhop enters a `STASH` cell: award 20–50 coins (random), play ching SFX, convert cell to `FLOOR`
- [ ] 6.2 In `game.js`, track a `resolvedJunctions` counter; increment on each correct door; a junction is resolved only on first correct answer (not on retry)
- [ ] 6.3 In `game.js`, when bellhop enters `LIFT` cell: if `resolvedJunctions < totalJunctions`, block movement and flash a brief "more doors ahead" HUD message; if all resolved, trigger floor-clear sequence
- [ ] 6.4 Implement floor-clear sequence: pause input, play fanfare SFX, animate money counter rolling up total earned this floor, then call `showBuildScreen()`
- [ ] 6.5 In `game.js`, implement `showBuildScreen()` — sets `state.ui = 'build'`; `render()` switches to build screen drawing; `update()` skips maze logic while in build state

## 7. Hotel Builder

- [ ] 7.1 In `renderer.js`, implement `drawBuildScreen(ctx, state)` — show hotel silhouette (rooms as rectangles stacked per floor), current money, purchasable items list, star rating, and "Next Floor" button
- [ ] 7.2 In `game.js`, handle build-screen input: arrow keys navigate the item list; `Enter`/`Space` selects; mouse click on item also selects
- [ ] 7.3 In `game.js`, implement room purchase logic: deduct cost if balance sufficient and room is next in sequence (Room 1→2→3); play cashout SFX; update `state.hotel.rooms`
- [ ] 7.4 In `game.js`, implement floor purchase logic: available only when all 3 rooms on current floor are built and balance ≥ 1000; deduct cost, increment `state.hotel.floors`, play cashout SFX
- [ ] 7.5 In `game.js`, compute star rating from hotel state: 1 star (1–2 rooms), 2 stars (3 rooms or first new floor), 3 stars (2+ floors); update `state.hotel.stars` after each purchase
- [ ] 7.6 In `game.js`, implement "Next Floor" action: save state to localStorage, increment `state.currentFloor`, load next maze template, reset junction counters and combo, set `state.ui = 'game'`

## 8. Audio

- [ ] 8.1 In `audio.js`, create an `AudioContext` lazily (on first user gesture); implement `loadSfx(url)` returning a decoded `AudioBuffer`; load all six SFX files on init
- [ ] 8.2 In `audio.js`, implement `playSfx(buffer)` — creates a `BufferSourceNode`, connects to `gainNode`, and starts it; allows overlapping calls
- [ ] 8.3 In `audio.js`, create an HTML5 `<audio>` element for `music-loop.mp3` with `loop` attribute; auto-play at volume 0.4 after first user gesture
- [ ] 8.4 In `audio.js`, implement spoken sums: `speakSum(a, b)` calls `speechSynthesis.speak()` with text `"[a] plus [b]"`; wrap in try/catch for graceful degradation; call from `game.js` when a junction activates
- [ ] 8.5 In `audio.js`, implement `setMuted(muted)`: sets music volume to 0 or 0.4, sets SFX gain to 0 or 1.0, calls `speechSynthesis.cancel()` when muting
- [ ] 8.6 In `renderer.js`, draw a mute toggle button (🔊/🔇 icon) in the top-right corner of the canvas at all times; in `input.js`, handle click/tap on that region and call `audio.setMuted()`

## 9. Persistence

- [ ] 9.1 In `storage.js`, implement `saveState(state)` — serialises `{ hotel, money, highestFloor, difficulty, stats }` to `localStorage['grand-hotel-save']`
- [ ] 9.2 In `storage.js`, implement `loadState()` — reads and JSON-parses `localStorage['grand-hotel-save']`; returns `null` if absent or unparseable
- [ ] 9.3 In `game.js` on startup, call `loadState()`; if non-null, merge into `state`; otherwise initialise defaults (empty hotel, 0 coins, TIER_10)
- [ ] 9.4 Call `saveState(state)` at the start of `showBuildScreen()` (after each floor clear)

## 10. HUD, Pause, & Final Integration

- [ ] 10.1 In `renderer.js`, implement the persistent HUD overlay: money counter (top-left), floor number (top-centre), mute button (top-right), combo label (centre-left when active)
- [ ] 10.2 In `renderer.js`, implement the pause overlay: semi-transparent dark fill over the canvas, centred "PAUSED — press Space to resume" text
- [ ] 10.3 In `game.js`, skip `update()` (but still call `render()`) while `state.paused === true`; music continues during pause
- [ ] 10.4 Wire all modules into `game.js`: confirm import/export chain is complete (input → game, maze → game, math-engine → game, coin logic → game, audio → game, storage → game, renderer ← game)
- [ ] 10.5 Manual play-test: start game, navigate to a door, answer correctly (ding + coins + combo), answer wrongly (buzz + bounce + combo reset), clear a floor (fanfare + build screen), purchase a room (cha-ching + hotel updates), advance to next floor, reload page (state restored from localStorage)
- [ ] 10.6 Manual play-test: verify mute button silences music + SFX + speech; verify pause freezes movement; verify lift blocks until all junctions resolved
