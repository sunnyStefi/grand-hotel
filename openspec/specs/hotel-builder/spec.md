# Hotel Builder

## Purpose

Defines the Build screen experience: the floor-clear cash-out sequence, room and floor purchases, hotel star rating, floor progression, and localStorage persistence.

---

## Requirements

### Requirement: Floor-clear triggers cash-out sequence
When all `DOOR_JUNCTION` cells on a floor are resolved and the player enters the `LIFT` cell, the system SHALL transition to a cash-out animation followed by the Build screen. The floor-clear fanfare plays during this transition.

#### Scenario: Floor clear initiates cash-out
- **WHEN** the bellhop enters the `LIFT` cell and all junctions on the current floor are resolved
- **THEN** the game loop pauses, the floor-clear fanfare plays, and the money counter animates rolling up the total earned this floor

#### Scenario: Build screen opens after cash-out
- **WHEN** the cash-out animation completes
- **THEN** the Build screen is shown, displaying the current hotel, available rooms/floors to purchase, and the player's total coin balance

### Requirement: Room purchase
The Build screen SHALL display available room upgrades with their coin cost. The player buys a room by clicking or pressing a designated key on the highlighted item. Rooms are purchased in order; each room must be bought before the next is available.

Room costs (in order):
- Room 1: 200 coins
- Room 2: 300 coins
- Room 3: 350 coins

#### Scenario: Room purchased when balance sufficient
- **WHEN** the player selects a room upgrade and the current balance is ≥ the room's cost
- **THEN** the coin cost is deducted from the balance, the room is marked built, the hotel visual updates, and a cha-ching sound plays

#### Scenario: Room purchase blocked when balance insufficient
- **WHEN** the player selects a room upgrade and the current balance is less than the room's cost
- **THEN** no coins are deducted, the item visually shakes or flashes, and a soft error sound plays

#### Scenario: Next room locked until previous is purchased
- **WHEN** Room N has not been purchased
- **THEN** Room N+1 is shown as locked (grayed out, cost visible but not selectable)

### Requirement: Floor purchase
After all three rooms on the current floor are built, a new hotel floor becomes purchasable for 1,000 coins. Purchasing it adds a visible new floor to the hotel visual.

#### Scenario: New floor becomes available after all rooms built
- **WHEN** all rooms on the current hotel floor are purchased
- **THEN** a "Build Floor 2" (or next floor number) option appears with a cost of 1,000 coins

#### Scenario: New floor purchased
- **WHEN** the player purchases a new hotel floor and the balance is sufficient
- **THEN** 1,000 coins are deducted, the hotel visual gains a new floor, and the star rating is recalculated

### Requirement: Hotel star rating
The hotel SHALL display a star rating (1–3 stars) based on the number of rooms and floors built.

Rating thresholds:
- ⭐ (1 star): 1–2 rooms built
- ⭐⭐ (2 stars): 3 rooms OR first new floor built
- ⭐⭐⭐ (3 stars): 2+ floors built

#### Scenario: Star rating updates after purchase
- **WHEN** a room or floor purchase crosses a rating threshold
- **THEN** the star display updates immediately and a brief sparkle animation plays

### Requirement: Continue to next maze floor
After visiting the Build screen, the player SHALL be able to proceed to the next maze floor. The next floor's maze template is selected (cycling through available templates), and the math difficulty tier carries over from the previous floor.

#### Scenario: Player advances to next floor
- **WHEN** the player selects "Next Floor" (or presses the designated key) on the Build screen
- **THEN** the next maze floor loads, the bellhop spawns at the start position, and the game loop resumes

#### Scenario: Difficulty tier persists across floors
- **WHEN** the player advances to the next floor
- **THEN** the math engine's active tier is the same as it was at the end of the previous floor

### Requirement: Persistence via localStorage
All player state SHALL be saved to `localStorage['grand-hotel-save']` as a JSON object after each Build screen visit. On page load, saved state is restored if present.

Persisted fields: `{ hotel: { rooms, floors, stars }, money, highestFloor, difficulty: { tier, recentAnswers }, stats: { bestCombo, fastestAnswer } }`

#### Scenario: State saves after floor clear
- **WHEN** the Build screen is displayed after a floor clear
- **THEN** the current state is serialised and written to `localStorage['grand-hotel-save']`

#### Scenario: State restores on page load
- **WHEN** the game page loads and `localStorage['grand-hotel-save']` contains valid JSON
- **THEN** the hotel, money, progress, and difficulty are restored from the saved state

#### Scenario: Missing save starts fresh
- **WHEN** the game page loads and `localStorage['grand-hotel-save']` is absent or unparseable
- **THEN** the game initialises with default state (empty hotel, 0 coins, TIER_10) without error
