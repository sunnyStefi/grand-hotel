## ADDED Requirements

### Requirement: Base coin award
Every correct answer SHALL award 15 base coins before any multipliers are applied.

#### Scenario: Correct answer awards base coins
- **WHEN** the player selects the correct answer door
- **THEN** 15 coins are added to the pending award for that door before speed bonus and combo multiplier are applied

#### Scenario: Wrong answer awards no coins
- **WHEN** the player selects an incorrect answer door
- **THEN** no coins are added to the player's balance and the combo multiplier is reset to ×1.0

### Requirement: Speed bonus
If the correct answer is given within 3 seconds of the junction becoming active, an additional 15 coins SHALL be added before the combo multiplier is applied (total base before multiplier: 30 coins).

#### Scenario: Fast correct answer earns speed bonus
- **WHEN** the player selects the correct answer and elapsed time since junction display is less than 3000 ms
- **THEN** 15 bonus coins are added to the award (total pre-multiplier: 30)

#### Scenario: Slow correct answer earns no speed bonus
- **WHEN** the player selects the correct answer and elapsed time is 3000 ms or greater
- **THEN** only the 15 base coins apply (no speed bonus)

### Requirement: Combo multiplier
The system SHALL track a consecutive-correct-answer streak. The streak multiplier is applied to the total coin award (base + speed bonus) for each correct answer.

Multiplier table:
- Streak 0–1: ×1.0
- Streak 2: ×1.5
- Streak 3: ×2.0
- Streak 4+: ×2.5

The streak increments by 1 on each correct answer and resets to 0 on each wrong answer.

#### Scenario: No streak applies ×1.0
- **WHEN** the current streak is 0 or 1 and the player answers correctly
- **THEN** the coin award equals (base + speed bonus) × 1.0, rounded to the nearest integer

#### Scenario: Streak of 2 applies ×1.5
- **WHEN** the current streak is 2 and the player answers correctly
- **THEN** the coin award equals (base + speed bonus) × 1.5, rounded to the nearest integer

#### Scenario: Streak of 3 applies ×2.0
- **WHEN** the current streak is 3 and the player answers correctly
- **THEN** the coin award equals (base + speed bonus) × 2.0, rounded to the nearest integer

#### Scenario: Streak of 4+ applies ×2.5
- **WHEN** the current streak is 4 or more and the player answers correctly
- **THEN** the coin award equals (base + speed bonus) × 2.5, rounded to the nearest integer

#### Scenario: Wrong answer resets combo
- **WHEN** the player selects an incorrect answer door
- **THEN** the streak counter resets to 0 and the multiplier returns to ×1.0 for the next correct answer

### Requirement: Coin burst animation
When coins are awarded, the system SHALL display a particle burst: 6–10 coin sprites flying from the door outward and arcing toward the money counter. The animation plays in full even if overlapping with a subsequent door event.

#### Scenario: Correct answer triggers coin burst
- **WHEN** the player selects the correct answer door
- **THEN** 6–10 coin particles spawn at the door's canvas position and animate outward within 600 ms

#### Scenario: Coins arc toward counter
- **WHEN** coin particles finish their outward arc
- **THEN** they fly toward the money counter's canvas position before disappearing

### Requirement: Rolling money counter
The on-screen money counter SHALL animate from its current value to the new value over 400 ms whenever coins are added, displaying intermediate integer values as it rolls.

#### Scenario: Counter rolls up on award
- **WHEN** coins are added to the player's balance
- **THEN** the counter display increments at a rate proportional to the award amount, reaching the final value in approximately 400 ms

#### Scenario: Counter shows correct final value
- **WHEN** the rolling animation completes
- **THEN** the counter displays the exact new balance

### Requirement: Combo visual indicator
The HUD SHALL display the current streak multiplier when the streak is 2 or higher. The indicator grows in size or brightness as the streak increases.

#### Scenario: Multiplier shown at streak ≥ 2
- **WHEN** the current streak is 2 or more
- **THEN** the combo label (e.g. "×1.5 COMBO") is visible on the HUD

#### Scenario: Multiplier hidden at streak < 2
- **WHEN** the current streak is 0 or 1
- **THEN** no combo indicator is shown on the HUD
