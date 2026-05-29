# Math Engine

## Purpose

Defines the adaptive math system: three-tier difficulty, addition-problem generation, smart near-miss decoys, answer door feedback, and answer timing measurement.

---

## Requirements

### Requirement: Three-tier difficulty system
The math engine SHALL maintain a current difficulty tier. Valid tiers are `TIER_10` (sums ≤ 10), `TIER_15` (sums ≤ 15), and `TIER_20` (sums ≤ 20). The game starts at `TIER_10`. Tier transitions are evaluated after every 5 answers.

#### Scenario: Game starts at tier 10
- **WHEN** a new game session begins
- **THEN** the active tier is `TIER_10`

#### Scenario: Tier upgrades on fast correct streak
- **WHEN** the last 5 answers contain 3 or more correct AND the average answer time is under 3 seconds
- **THEN** the tier advances one level (TIER_10 → TIER_15, or TIER_15 → TIER_20)

#### Scenario: Tier downgrades on errors or slowness
- **WHEN** the last 5 answers contain 2 or more errors OR the average answer time exceeds 5 seconds
- **THEN** the tier drops one level (TIER_20 → TIER_15, or TIER_15 → TIER_10)

#### Scenario: Tier stays at boundary
- **WHEN** the tier is already `TIER_10` and downgrade conditions are met
- **THEN** the tier remains `TIER_10` (no underflow)

#### Scenario: Tier stays at ceiling
- **WHEN** the tier is already `TIER_20` and upgrade conditions are met
- **THEN** the tier remains `TIER_20` (no overflow)

### Requirement: Sum generation per tier
The engine SHALL generate a random addition problem (`a + b = ?`) where the sum falls within the active tier's range. Both operands SHALL be positive integers ≥ 1.

#### Scenario: Tier 10 sum is within range
- **WHEN** a sum is generated at `TIER_10`
- **THEN** `a + b` is between 2 and 10 (inclusive)

#### Scenario: Tier 15 sum is within range
- **WHEN** a sum is generated at `TIER_15`
- **THEN** `a + b` is between 11 and 15 (inclusive)

#### Scenario: Tier 20 sum is within range
- **WHEN** a sum is generated at `TIER_20`
- **THEN** `a + b` is between 16 and 20 (inclusive)

#### Scenario: Operands are positive
- **WHEN** any sum is generated
- **THEN** both `a` and `b` are integers ≥ 1

### Requirement: Smart decoy answer generation
Each door junction SHALL display 2–4 answer doors: one correct answer and 1–3 decoys. Decoys SHALL be near-misses: values within ±3 of the correct answer, all distinct, all positive.

#### Scenario: Correct answer is always present
- **WHEN** a door junction is rendered
- **THEN** exactly one door shows the arithmetically correct answer

#### Scenario: Decoys are near-misses
- **WHEN** a door junction is rendered with decoys
- **THEN** each decoy value is within ±3 of the correct answer, is not equal to the correct answer, is a positive integer, and no two decoys share the same value

#### Scenario: Decoy count matches door count
- **WHEN** a door junction is configured for N doors (2–4)
- **THEN** exactly N − 1 distinct decoy values are generated

### Requirement: Answer door selection and feedback
When the bellhop moves into an answer door:
- **Correct door:** door opens (converts to `FLOOR`), coin reward is calculated and awarded, answer recorded as correct with timestamp.
- **Wrong door:** door flashes red, bellhop is pushed back one cell, no coins lost, answer recorded as incorrect.

#### Scenario: Correct door opens the path
- **WHEN** the bellhop moves into the door showing the correct answer
- **THEN** the door converts to a passable `FLOOR` cell, the coin reward is applied, and the junction is marked resolved

#### Scenario: Wrong door bounces bellhop
- **WHEN** the bellhop moves into a door showing an incorrect answer
- **THEN** the bellhop is moved back to the cell it came from, the door flashes red, no coins are deducted, and the junction remains unresolved

#### Scenario: Retry after wrong answer
- **WHEN** the bellhop was bounced from a wrong door
- **THEN** the same sum and door set remain active; the player can immediately try another door

### Requirement: Answer timing measurement
The engine SHALL record the elapsed time (in milliseconds) between when a door junction is first rendered and when the player selects an answer (correct or incorrect). This timestamp is used for tier evaluation and speed-bonus calculation.

#### Scenario: Timer starts at junction display
- **WHEN** a door junction becomes active and doors are rendered
- **THEN** a timestamp is recorded

#### Scenario: Timer stops at answer selection
- **WHEN** the bellhop moves into any answer door
- **THEN** elapsed time since the junction became active is recorded against that answer
