n# 🏨 Grand Hotel Gold

A math-adventure game for 7-year-olds where you drive a bellhop through hotel mazes, answer addition problems, collect coins, and build your own growing empire.

## 🎮 The Game

You're a bellhop navigating twisty hotel corridors. Each door has an addition problem—solve it correctly to unlock the door and burst coins onto the floor. Collect enough coins to clear the floor, and you earn the right to build a new room in your hotel.

**The loop:** Drive → See a sum → Steer to the right answer → Coins scatter → Repeat. Everything else is just context.

## 🚀 How to Play

### Start the Game

```bash
# Using Python (macOS/Linux)
python3 -m http.server 8000

# Or using Node
npx http-server
```

Then open **http://localhost:8000** in your browser and click **Play**.

### Gameplay Basics

- **Move:** Arrow keys to steer the bellhop through corridors
- **Answer doors:** When you see a sum (e.g., `7 + 5 = ?`), steer toward the correct answer door
  - ✅ Right answer → Door opens, coins burst, you get points
  - ❌ Wrong answer → Buzzer, instant retry—no penalty
- **Collect coins:** Run over coins to add them to your money counter
- **Clear the floor:** Collect enough coins to finish the floor
- **Build your hotel:** At the end of each floor, spend your coins on:
  - **Room 1** ($200) — adds a room to your hotel
  - **Room 2** ($300) — fancier room
  - **Room 3** ($350) — luxury suite
  - **Floor 2** ($1000) — add a whole new floor to your hotel
- **Mute button:** Top-right corner to toggle sound on/off

## 💡 Design Philosophy

This game was built on one principle: **juice over perfection**.

Every correct answer *feels amazing*. The coins burst, the money counter rolls up, and your hotel grows right before your eyes. The chiptune loop is designed to stick in your head—you'll be humming it days later.

The math never feels like a chore. It's woven into the challenge of navigating the maze at speed. Want more coins? Answer faster. Want a combo multiplier? String together correct answers.

## ⚙️ How It Works

**No backend. No login. No ads.** 

The entire game lives in your browser. Your hotel, your coins, your progress—all saved locally. Close the browser, come back tomorrow, and everything is right where you left it.

- **Adaptive difficulty:** The game learns as you play. Easy sums at first, then ramps up. Get a few wrong? It backs off. String together wins? It gets harder.
- **Speed bonuses:** Fast answers earn extra coins. This teaches pattern recognition without feeling like math homework.
- **Combo multipliers:** Correct answers in a row multiply your coins. The tension of chasing a combo is the game's hidden magic.

## 🛠️ Technical Details

- **Built with:** Vanilla JavaScript (no frameworks, no dependencies—just the browser)
- **Graphics:** Canvas 2D with pixel-perfect sprites
- **Audio:** Web Audio API synthesized SFX + procedural chiptune loop + Web Speech API for spoken sums
- **Storage:** Browser localStorage (no server required)
- **Speed:** Runs at 60 FPS on any modern browser

## 📦 Project Structure

```
index.html              # Game entry point
src/
  game.js               # Main game loop, state management
  renderer.js           # Canvas drawing (maze, bellhop, coins, UI)
  input.js              # Keyboard controls
  maze.js               # Floor layouts and pathfinding
  math-engine.js        # Adaptive sum generation
  audio.js              # Chiptune + SFX synthesis
  storage.js            # localStorage persistence
```

## 🎯 Win Condition

You've won when he asks for "one more floor" instead of asking to stop. 🏆

---

**Made with ❤️ for math learners (aged 7+)**