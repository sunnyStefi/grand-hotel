# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Grand Hotel Gold** — an educational math game for a 7-year-old combining maze exploration, money collection, and hotel building. Core mechanic: drive a bellhop through hotel corridors, answer addition problems to open doors, collect coins, and build a growing hotel empire. See `docs/grand-hotel-math-maze.md` for the full design vision.

**Constraints:**
- 2-hour build window
- Web-based, browser playable (no app download)
- No backend — pure local storage + client-side
- Vanilla JavaScript (no frameworks — keep it light and fast)
- Retro pixel-art style with chiptune audio (memorability > polish)

**North Star:** When he answers `8 + 7` in 0.5 seconds to chase the combo and asks for "one more floor," we've won.

---

## Tech Stack & Architecture

**Frontend:** Vanilla HTML5, Canvas 2D rendering, JavaScript (ES6+). No build tools, no dependencies.

**Storage:** Browser localStorage for persistent state (hotel layout, money, progress, stats).

**Audio:** Web Audio API for SFX; HTML5 `<audio>` for looping music track.

**Server:** Simple HTTP server for local development (Python 3: `python3 -m http.server 8000`, or Node: `npx http-server`).

**Game Architecture:**

```
index.html                          # Entry point, Canvas setup
src/
  game.js                           # Main game loop, state management
  renderer.js                       # Canvas drawing (maze, bellhop, doors, UI)
  input.js                          # Arrow key / keyboard handling
  maze.js                           # Maze generation, pathfinding, door placement
  math-engine.js                    # Adaptive sum generation, difficulty curve
  audio.js                          # Chiptune looping, SFX playback
  storage.js                        # localStorage for hotel/money/stats
  
assets/
  sprites/                          # Pixel-art bellhop, doors, coins, hotel elements
  audio/
    music-loop.mp3                  # Jazzy chiptune (loop)
    sfx-ding.mp3                    # Door open
    sfx-ching.mp3                   # Coin collect
    sfx-buzz.mp3                    # Wrong answer
    sfx-combo.mp3                   # Combo tick
    sfx-cashout.mp3                 # Floor clear
```

**Game Loop:**
1. **Input:** Capture arrow keys → move bellhop
2. **Update:** Collision detection (doors, coins), adaptive math, combo tracking, speed tracking
3. **Render:** Draw maze, bellhop, coins, doors with current sum, money counter, UI
4. **Persistence:** Auto-save hotel state after floor clear

---

## Running & Development

**Start dev server:**
```bash
cd /path/to/grand-hotel
python3 -m http.server 8000        # Then open http://localhost:8000
# OR
npx http-server                     # If Node is available
```

**Play-test locally:**
1. Run server, open `http://localhost:8000` in browser
2. Test with son — does the loop feel good? Are coins satisfying? Is the difficulty right?
3. Mute/unmute works? No crashes on retry?

**Build process:** None — serve files as-is. CSS inline in `index.html` if minimal.

---

## Design Principles (Keep These in Mind While Coding)

**From the 9 immortal-game rules:**

1. **Core loop in 10 seconds:** drive → see sum → steer to answer → coins burst → repeat. Everything else is context.
2. **Juice over perfection:** every successful action must *feel amazing*. Ding, coins scatter, combo ticks. No feature is worth skipping this.
3. **Instant readability:** huge digits on doors, bold colors, obvious exits. A 7-year-old reads the screen in a glance.
4. **Collection dopamine:** money counter rolling up, hotel visibly growing. This is the long-term hook.
5. **Flow, not frustration:** adaptive difficulty targets ~80% success. Wrong answers = buzz + instant retry, never game-over.
6. **No fear, pure challenge:** speed is rewarded (bonus coins), not feared. Combo chasing is the tension.
7. **Audio identity:** the chiptune loop is half the memory. He'll hum it weeks later.
8. **Personality:** the bellhop and the hotel *theme* tie the whole world together.

**When implementing:**
- Prioritize the core loop and juice over features (wrong doors, hidden coins, etc., come later).
- Every game state change should either move the loop forward or give feedback.
- Test on an actual 7-year-old (or imagine the 10-second attention test).
- Math difficulty should *feel* invisible — if he thinks "I'm doing an addition problem," the game has failed.

---

## Key Implementation Notes

**Maze Generation:**
- Start with a simple hand-drawn grid maze (not procedural) for the first floor to save time.
- Doors are placed at junctions; non-door paths lead deeper into the maze or to dead-end coin stashes.

**Math Engine:**
- Simple problem pool by difficulty: `sums_10 = [(3,4), (5,2), ...]`, `sums_15 = [(7,8), ...]`, etc.
- Adaptive logic: if last 3 answers correct *and* fast, bump to next tier; if 2+ misses, ease back.
- Wrong-answer "decoys" are smart (near-misses: `7+5=?` → `[10, 12, 14]` not `[12, 99, 3]`).

**Rendering:**
- Use Canvas with a small pixel-perfect scale (e.g., 320×180 logical, scaled up to fill window).
- Bellhop, coins, doors drawn as sprites or simple shapes (circles, rectangles with color).
- Real pixel art is nice but takes time — solid colored shapes with outlines work fine for 2 hours.

**Audio:**
- Music loop should be seamless and short (~8–16 bars) so it doesn't feel repetitive.
- SFX are short (.mp3 or .wav). Load once on startup.
- Volume slider or mute button is essential (parents will appreciate it).

**Persistence:**
- Save after each floor clear: `{ hotel: {floors, rooms, ...}, money, stats, difficulty, progress }` → localStorage.
- Load on startup; if not found, initialize defaults.

**Performance:**
- Vanilla Canvas rendering should be 60 fps on any modern browser. Keep sprite counts low (one bellhop, ~20 coins max on screen, ~6 doors).
- No complex animations — movement is fast and snappy, not smooth transitions.

---

## Scope Priorities (2-hour window)

**MUST (game is playable):**
- Maze floor (walls, empty space, bellhop sprite or shape).
- Arrow-key movement with collision detection.
- 3–4 doors per floor, each with a sum and 2–3 answer doors.
- Correct door → opens, coins burst, sound (ding + ching).
- Wrong door → buzzes, can retry immediately.
- Money counter visible on screen, increments on coins.
- Adaptive sums (start 10, ramp to 20).
- One clearable floor → "cash out" → next floor.
- Local storage persistence (hotel and money saved).

**SHOULD (makes it stick, if time allows):**
- Speed bonus (answer quickly → more coins).
- Combo multiplier (correct in a row → 2x, 3x, etc.).
- Build screen: spend money to add rooms/floors to the hotel.
- Floor-clear fanfare + coin-counter animation.

**COULD (polish, after 1.5 hours):**
- Hidden coin stashes in dead-end corridors.
- Spoken numbers (text-to-speech or pre-recorded).
- Stats dashboard ("Bellhop of the Year").
- Hotel visual grows as he builds (sprites for rooms, decor).

**WON'T (future versions):**
- Enemies, lives, hazards.
- Subtraction or multiplication.
- Multiplayer.

---

## Testing Notes

**Manual play-testing is the only test that matters.** Code works iff:
1. He can beat a floor in ~60–90 seconds.
2. Every correct answer feels rewarding (sound + coins + visual feedback).
3. He asks for "one more floor" instead of asking to stop.
4. The hotel visibly grows; he understands he's building it.
5. No crashes on retry, pause, or navigation.

---

## File Reference

- **docs/grand-hotel-math-maze.md** — full design doc; refer here for feature details, UX decisions, and why each choice exists.
- **CLAUDE.md** (this file) — technical guidance and scope priorities.