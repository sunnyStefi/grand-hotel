# 🏨 GRAND HOTEL GOLD — Design Doc

*A retro maze game that secretly trains fast addition.*
*(Working title — see "Open Decisions" for alternatives.)*

> **One line:** Drive a bellhop through the floors of a grand hotel, open sum-locked
> room doors by steering into the right answer, collect the tips, and spend your
> fortune building the hotel taller — the faster you add, the richer you get.

This document covers the **experience and design** only. The technical build plan
comes after we agree on this.

---

## 1. Why this design fits him

| He loves… | In the game… |
|---|---|
| **Hotel** (the board game) | He literally builds a hotel empire — floors, rooms, stars — that grows and is saved between sessions. |
| **Collecting money** | Coins burst from every door; a fat money counter rolls up; he cashes out and spends it. |
| **Mazes** | Each hotel floor is a maze of corridors, doors, and hidden coin stashes. |
| **Getting good & fast at addition** | Speed earns more coins and combos; difficulty quietly ramps to keep him at the edge of his ability. |

The maze, the money, and the hotel are **one world** — not three bolted-together ideas.

---

## 2. The player & the goal

- **Player:** one sharp 7-year-old. Reads short words; learns fastest through pictures, numbers, and sound.
- **What we want him to gain:** confidence and *speed* with addition (sums to 10, ramping past 20).
- **What he thinks he's doing:** getting rich and building the biggest hotel in town.
- **Design rule:** the math is the *gameplay*, never a quiz that interrupts the fun.

---

## 3. The core loop (the 10-second hook)

```
   drive  →  a room door shows a sum  →  steer into the right answer-door
     ↑                                              ↓
  next corridor   ←   COINS BURST + door opens   ←  ✔ correct (faster = more coins)
```

Repeated dozens of times per floor. At the end of a floor he **cashes out** and
**builds** part of his hotel, then climbs to the next (harder) floor.

This loop must be fun *with no math feedback at all* — just driving and grabbing
coins should already feel good. The math makes it meaningful.

---

## 4. The world & theme — Grand Hotel

- A warm, golden, slightly art-deco **grand hotel**. Think jazzy, glamorous, "ding ding, bellhop!"
- **Mascot:** a cheerful **bellhop** in a red cap and uniform (his character — see personalization).
- Each **level = one floor** of the hotel. Clear the floor's doors → take the lift up → next floor.
- The building he explores is the *same* building he's constructing in the Build screen. Climbing the maze = climbing his own growing tower.
- Friendly, never scary. Guests cheer, coins sparkle, lifts go *ding*.

---

## 5. The core mechanic — "drive into the right door"

This is the heart of the game and what makes it feel like a game, not a worksheet.

1. He reaches a **junction or a grand doorway** in the corridor.
2. A banner shows a sum: **`7 + 5 = ?`** (big digits, spoken aloud by a voice so he hears the problem).
3. The way forward splits into **2–4 numbered doors**, e.g. `10` · `12` · `14`.
4. He **steers the bellhop into the door with the correct answer**.
   - ✔ **Correct:** door swings open with a *ding*, **coins burst out**, combo ticks up, he drives on.
   - ✘ **Wrong:** door buzzes red and gently bounces him back; he can **immediately try another door**. No game-over, no shame.
5. **Faster = more coins.** Answer within ~3 seconds and you earn a speed bonus (double coins for that door). Combo builds on consecutive correct answers (×1.5 at 2 in a row, ×2.0 at 3, ×2.5 at 4+), multiplying total earnings.

Pure keyboard: **arrow keys to move, that's it.** No typing, no menus mid-run. Movement and answering are the same action.

---

## 6. Adaptive math — always at the edge of his ability

Goal: keep him succeeding ~80% of the time so he stays in "flow" — stretched but winning.

**Tier system (three difficulty levels):**
- **Tier 10:** sums to 10 (`3+4`, `6+2`, `5+5`, etc.)
- **Tier 15:** sums to 15 (`7+8`, `9+6`, `8+7`, etc.) — introduces "carrying" concepts.
- **Tier 20:** sums to 20 (`9+11`, `12+8`, etc.) — transition toward 2-digit thinking.

**Adaptive rules (check after every 5 answers):**
- **Upgrade tier** if last 3+ answers are correct *and* average time < 3 seconds → bump from Tier 10→15 or 15→20.
- **Downgrade tier** if 2+ errors in the last 5 answers *or* average time > 5 seconds → drop back to protect confidence.
- **Starting tier:** Tier 10 (sums to 10).

**Smart decoys:** The wrong-answer doors are near-misses, not traps.
- Tier 10: `3+4=?` → `[7, 8, 9]` — teaches counting carefully.
- Tier 15: `7+8=?` → `[14, 15, 16]` — real discrimination needed.

He never sees the words "difficulty" — it just feels like the hotel getting fancier as he progresses.

---

## 7. Money & the hotel empire (the reason to keep playing)

**Coin earning (per correct door):**
- **Base:** 15 coins per correct answer.
- **Speed bonus:** if answered in < 3 seconds, +15 coins (30 total).
- **Combo multiplier:** 
  - No streak: ×1.0
  - 2 correct in a row: ×1.5
  - 3 correct in a row: ×2.0
  - 4+ correct in a row: ×2.5
  - Combo resets on a wrong answer (no penalty, just reset to ×1.0).

**Example floor earnings:**
- 8 doors per floor, expect ~7 correct (70–80% success).
- Without speed bonus: 7 × 15 = 105 coins.
- With speed (5 fast, 2 slow): 5×30 + 2×15 = 180 coins.
- With combo (avg ×1.5 multiplier): ~270 coins per floor.

**Building prices (cumulative growth):**
- **Room 1:** 200 coins → earns immediately after Floor 1 (instant reward!).
- **Room 2:** 300 coins → Floor 2.
- **Room 3:** 350 coins → Floor 3.
- **Floor 2 of hotel:** 1,000 coins → earned over Floors 4–5 (major milestone).

**Build screen mechanics:**
- At the end of each floor, cash out and visit the Build screen.
- Spend coins to add rooms, then entire new floors to the hotel.
- **Persistence:** the hotel, bank, and progress are **saved in local storage**, so it's *his* hotel waiting for him next time.
- **Visual growth:** the hotel visibly expands as rooms are built. Star rating (⭐ → ⭐⭐⭐) increases as more rooms/floors are added.

**Floor unlock:** Clearing a maze floor **immediately unlocks the next maze floor** (with slightly harder math via adaptive tiers). Building the hotel is a *separate progression* — he can replay floors to earn more coins if he wants.

---

## 8. Speed, combos & gentle stakes

- **Speed bonus:** answer within ~3 seconds → double coins for that door. Directly trains "fast" without ever feeling punished for slowness.
- **Combo multiplier:** a streak of correct answers multiplies the coin payout (×1.5, ×2.0, ×2.5). Breaking the streak just resets to ×1.0 — no other penalty, no shame.
- **Gentle failure:** a wrong answer = buzz + instant retry. No coin loss, no game-over, no timer pressure. He just tries the next door.
- **No lives, no enemies, no fear.** The tension comes from chasing a bigger combo and racing against the clock for speed bonuses, not from punishment. The game wants him to win.

---

## 9. Game feel — the "juice" (this is half the magic)

Every action must give satisfying feedback. Target list:

- 🪙 Coins **burst and scatter** with a bright *ching*; they fly into the counter.
- 🚪 Doors **swing open** with a *ding* and a flash of light.
- 🔥 Combo builds → **flames/sparkles** around the counter; bigger numbers pop.
- 📳 A little **screen shake** on a big combo or a floor-clear.
- 🔢 The answer number **pops up** and the bellhop does a **happy hop**.
- 🎉 **Floor-clear fanfare** + the money counter rolls up like a jackpot.
- 🛎️ **Build screen:** satisfying *cha-ching* cash-register sounds as the hotel grows.

If a correct answer doesn't feel *delightful*, nothing else matters. Polish this first.

---

## 10. Art direction

- **Style:** chunky, readable **retro pixel art** (think 16-bit, Jazz Jackrabbit warmth).
- **Palette:** warm **gold / red / teal** hotel colors; high contrast so a 7-year-old reads everything instantly.
- **Readability rules (from the immortal games):** bold silhouettes, **huge digits** on doors, coins are big and obviously shiny, the exit/lift is obvious.
- **Signage:** art-deco "GRAND HOTEL", glowing "VACANCY", floor numbers.
- **Mascot:** red-capped bellhop, expressive, celebrates wins.

---

## 11. Audio — the part he'll hum

- **Music:** an upbeat looping **chiptune** with a jazzy/ragtime swing (perfect for a grand hotel). Catchy enough to live in his head.
- **SFX:** coin *ching*, door *ding*, wrong-answer soft *buzz*, rising combo arpeggio, floor-clear fanfare, build-screen cha-ching.
- **Spoken numbers (optional but lovely):** a voice reads the sum ("seven plus five") and praises wins ("Nice!", "Speedy!") — supports his reading level and makes it feel alive.
- Mute toggle for parents' sanity. 🙂

---

## 12. Session structure — "one more go"

- A **floor** is short: ~**60–90 seconds**, roughly **6–10 doors** (plus hidden stashes if explored).
- **Floor flow:** clear maze → cash out → Build screen (spend coins, see hotel grow) → lift *ding* → next floor.
- **Instant restart**, no long load or punishment — the "one more go" feeling.
- **Menu button** (always visible, top-left) lets him pause, see stats, or save & exit anytime. Progress saves automatically to local storage.
- A session can be 2 floors or 10 — he decides when to stop.

---

## 13. Maze structure — doors + exploration

The maze is not a hallway; it's an actual maze where exploration is rewarded.

- **Core path:** doors leading forward (the "solve this sum, move on" loop).
- **Dead-end corridors:** some paths lead nowhere, but they contain **hidden coin stashes** (no math required, just find them).
  - This creates genuine exploration incentive — he's not just steered forward, he's discovering.
  - Stashes can be 20–50 bonus coins, rewarding curiosity.
- **Optional future:** occasional **golden door** with a bonus sum worth a big payout, or a **collectible** (lost luggage, pet) tied to personalization.

---

## 14. UX for a 7-year-old

- **Controls:** arrow keys only. Big, forgiving hitboxes on doors.
- **Audio:** 
  - Sums are **spoken aloud** by a clear, encouraging voice (e.g., "seven plus five").
  - **Mute button** (top-right, always visible) so parents can silence it anytime.
- **Pause:** spacebar freezes the game, shows current floor progress, big resume button. Easy for small hands.
- **Menu button** (top-left): pause, see stats, save & exit.
- **Words:** short and simple, always paired with an **icon or sound** so he's never stuck reading.
- **No dead-end confusion:** the path forward and the lift are always obvious.
- **No fail screens.** Worst case is "fewer coins," never "you lost."
- **Welcome by name** and his chosen colors → it's *his* game.

---

## 15. The "immortal retro game" principles, applied

A checklist mapping the fundamentals to our concrete choices:

| Principle | How we honor it |
|---|---|
| Core loop hooks in 10s | Drive → open door → coins → next. |
| Juice / game feel | Coin bursts, dings, combos, screen shake, fanfares (§9). |
| Instant readability | Huge digits, bold pixel art, obvious exits (§10). |
| Collection & growing pile | Coins, money counter, hotel empire (§7). |
| Flow (stretched, not crushed) | Adaptive math targeting ~80% success (§6). |
| Secrets & discovery | Hidden stashes, golden doors (§13). |
| Audio identity | Jazzy chiptune + punchy SFX he'll hum (§11). |
| Personality & theme | Bellhop mascot, glamorous hotel world (§4). |
| Visible mastery | Speed rating, combos, hotel stars (§16). |
| Short sessions / one-more-go | 60–90s floors, instant restart (§12). |
| Fairness | No game-over; wrong = retry; speed rewarded not feared (§8). |

---

## 16. Mastery — letting him *see* himself improve

A simple, friendly stats nook (the "Bellhop of the Year" board):

- **Speed rating:** average answer time → a fun rank (Trainee → Speedy Bellhop → Lightning Bellhop).
- **Best combo** ever.
- **Sums mastered** (a quiet tally of which facts he's nailing fast).
- **Hotel stars** and floors built.

The educational payload — *he's getting faster at addition* — shown as a score he's proud of.

---

## 17. Scope for the 2-hour build (priority order)

So we spend the time where it matters. Feature-level, not technical.

**MUST (the game is fun without anything else):**
- Maze floor (walls, corridors, dead-ends) he can explore with arrow keys.
- Sum-locked doors with 2–4 answer doors; correct opens, wrong buzzes + instant retry.
- Hidden coin stashes in dead-end corridors (exploration reward, no math required).
- Coins + animated counter with *juicy* burst + *ching* sound.
- One clearable floor → cash out → Build screen (spend coins on rooms).
- **Adaptive difficulty** (sums ramp via Tier 10 → 15 → 20 based on performance).
- Speed bonus (answer < 3 sec = double coins) + combo multiplier (×1.5, ×2.0, ×2.5 on streaks).
- **Spoken numbers** (voice reads the sum aloud).
- **Mute button** + **Pause** (spacebar).
- **Menu button** (pause, stats, save & exit).
- Looping music track + core SFX (ding, ching, buzz, fanfare).
- Local storage persistence (hotel, money, progress saved).

**SHOULD (makes it stick, if time allows):**
- 3–4 playable floors with escalating building prices.
- Hotel build screen shows visual growth (rooms + star rating).
- Floor-clear fanfare + money counter animation.

**COULD (polish if time remains):**
- Personalization (name, favorite color, pet).
- Stats / speed-rating board.
- Golden doors or bonus challenges.

**WON'T (this version):**
- Enemies / lives / hazards.
- Subtraction or multiplication (addition only).
- Multiplayer / online anything.

---

## 18. Open decisions (small, can answer anytime)

- **Title:** *Grand Hotel Gold* · *Coin Hotel* · *Bellhop Bonanza* · *Sum Hotel* · his own idea?
- **His name** (for "Welcome, ___!").
- **His favorite color** (bellhop uniform + hotel accent).
- **A favorite animal** (optional hotel pet/companion to collect).
- **Voice on or off** by default?
- Any **specific sums he finds hard** right now? We can weight the problem generator to drill those.

---

## 19. North star

> When he answers `8 + 7` in half a second just to grab the combo and watch the
> chandelier get fancier — and asks for "one more floor" — we've built the right game.
