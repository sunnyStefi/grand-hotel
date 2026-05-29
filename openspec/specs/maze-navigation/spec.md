# Maze Navigation

## Purpose

Defines the maze grid structure, player movement, special cell interactions (stash, lift), and pause behaviour for Grand Hotel Gold.

---

## Requirements

### Requirement: Grid maze representation
The maze SHALL be represented as a 2D array of typed cells. Valid cell types are: `WALL`, `FLOOR`, `DOOR_JUNCTION`, `STASH`, and `LIFT`. Each floor uses a static hand-crafted template. The logical grid is 20 × 11 cells rendered on a 320 × 180 canvas (16 px per cell).

#### Scenario: Wall blocks movement
- **WHEN** the bellhop attempts to move into a `WALL` cell
- **THEN** the bellhop's position does not change and no sound plays

#### Scenario: Floor allows movement
- **WHEN** the bellhop attempts to move into a `FLOOR` cell
- **THEN** the bellhop's position updates to that cell on the next frame

#### Scenario: Door junction reached
- **WHEN** the bellhop moves into a `DOOR_JUNCTION` cell
- **THEN** the math-engine generates a sum, 2–4 answer doors are rendered at adjacent cells, and movement is paused until a door is selected

### Requirement: Arrow-key navigation
The player SHALL control the bellhop using the four arrow keys. Holding a key moves the bellhop continuously at a fixed speed (4 cells per second). The bellhop faces the current direction of travel.

#### Scenario: Single key press moves bellhop
- **WHEN** an arrow key is pressed and the adjacent cell in that direction is not `WALL`
- **THEN** the bellhop begins moving toward that cell

#### Scenario: Movement blocked at wall
- **WHEN** an arrow key is pressed and the adjacent cell in that direction is `WALL`
- **THEN** the bellhop does not move and remains at its current position

#### Scenario: Direction change mid-movement
- **WHEN** a different arrow key is pressed while the bellhop is moving
- **THEN** the bellhop changes direction at the next cell boundary (no sub-cell turning)

### Requirement: Dead-end coin stash discovery
`STASH` cells contain a fixed coin amount (20–50 coins). No math problem is required; coins are awarded automatically on entry.

#### Scenario: Bellhop enters stash cell
- **WHEN** the bellhop moves into a `STASH` cell
- **THEN** the stash coins are added to the player's balance, a coin burst animation plays, and the cell converts to `FLOOR` (stash is consumed)

#### Scenario: Already-collected stash
- **WHEN** the bellhop re-enters a cell that was previously a `STASH`
- **THEN** no coins are awarded (cell is now `FLOOR`)

### Requirement: Lift exit availability
The `LIFT` cell represents the exit to the next floor. It is always rendered visibly (distinct color + "UP" label). It becomes passable only after all `DOOR_JUNCTION` cells on the floor have been resolved (correct answer given).

#### Scenario: Lift locked while doors remain
- **WHEN** the bellhop moves into the `LIFT` cell and at least one `DOOR_JUNCTION` has not been resolved
- **THEN** the bellhop is blocked, and a brief visual indicator ("more doors ahead") is shown

#### Scenario: Lift passable after all doors cleared
- **WHEN** the bellhop moves into the `LIFT` cell and all `DOOR_JUNCTION` cells have been resolved
- **THEN** the floor-clear sequence begins (fanfare, cash-out, build screen)

### Requirement: Pause behavior
Pressing `Spacebar` SHALL pause the game loop. While paused, the canvas dims and a "PAUSED — press Space to resume" overlay is shown. Arrow keys have no effect while paused.

#### Scenario: Spacebar pauses game
- **WHEN** the player presses `Spacebar` during active play
- **THEN** the game loop stops updating, the canvas dims, and the pause overlay is visible

#### Scenario: Spacebar resumes game
- **WHEN** the player presses `Spacebar` while the game is paused
- **THEN** the game loop resumes and the overlay is hidden
