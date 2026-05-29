# Audio

## Purpose

Defines all audio behaviour for Grand Hotel Gold: looping background music, game-event sound effects, spoken math sums, and the mute toggle.

---

## Requirements

### Requirement: Looping background music
The game SHALL play a looping chiptune music track (`assets/audio/music-loop.mp3`) from the moment the game loads. The loop SHALL be seamless (no audible gap at the loop point). Music plays at a default volume of 0.4 (40% of maximum).

#### Scenario: Music starts on page load
- **WHEN** the game page finishes loading
- **THEN** the background music begins playing in a loop

#### Scenario: Music loops without gap
- **WHEN** the music track reaches its end
- **THEN** it restarts immediately with no audible pause or click

### Requirement: Sound effects on game events
The system SHALL play a distinct SFX for each of the following game events. SFX are triggered via Web Audio API to allow rapid overlapping playback.

| Event | SFX file | Description |
|---|---|---|
| Correct door opened | `sfx-ding.mp3` | Short bell chime |
| Coin collected / burst | `sfx-ching.mp3` | Bright coin sparkle |
| Wrong answer | `sfx-buzz.mp3` | Soft descending tone |
| Combo tick (streak ≥ 2) | `sfx-combo.mp3` | Rising arpeggio note |
| Floor clear | `sfx-fanfare.mp3` | Short triumphant fanfare |
| Room/floor purchased | `sfx-cashout.mp3` | Cash register cha-ching |

#### Scenario: Correct door triggers ding
- **WHEN** the player selects the correct answer door
- **THEN** `sfx-ding.mp3` plays once at full volume

#### Scenario: Wrong answer triggers buzz
- **WHEN** the player selects an incorrect answer door
- **THEN** `sfx-buzz.mp3` plays once; no ding plays

#### Scenario: Coin burst triggers ching
- **WHEN** the coin burst animation begins
- **THEN** `sfx-ching.mp3` plays once per burst event (not once per coin particle)

#### Scenario: Combo tick plays on streak ≥ 2
- **WHEN** the streak counter reaches 2 or increases above 2
- **THEN** `sfx-combo.mp3` plays once at the moment the new streak value is set

#### Scenario: Floor clear plays fanfare
- **WHEN** the floor-clear sequence begins
- **THEN** `sfx-fanfare.mp3` plays once; music volume ducks to 0.2 for the duration of the fanfare

#### Scenario: Purchase plays cha-ching
- **WHEN** the player successfully purchases a room or floor in the Build screen
- **THEN** `sfx-cashout.mp3` plays once

### Requirement: Spoken sum on junction display
When a door junction becomes active, the system SHALL read the sum aloud using `window.speechSynthesis`. The utterance format is "[operand A] plus [operand B]" (e.g. "seven plus five"). If the API is unavailable, the system degrades gracefully with no error shown.

#### Scenario: Sum is spoken on junction activation
- **WHEN** a door junction becomes active and `window.speechSynthesis` is available
- **THEN** an utterance of the form "[a] plus [b]" is spoken in the browser's default voice

#### Scenario: Speech API unavailable degrades gracefully
- **WHEN** `window.speechSynthesis` is undefined or throws
- **THEN** the game continues without spoken audio; no error is shown to the player

#### Scenario: Muting cancels pending speech
- **WHEN** the player activates the mute toggle while a sum is being spoken
- **THEN** `speechSynthesis.cancel()` is called immediately, cutting off the utterance

### Requirement: Mute toggle
A mute button SHALL always be visible in the top-right corner of the canvas. Activating it silences all audio (music, SFX, and speech). The mute state persists for the current browser session (not saved to localStorage).

#### Scenario: Mute button silences all audio
- **WHEN** the player clicks or activates the mute button
- **THEN** music volume is set to 0, SFX gain is set to 0, and any active speech is cancelled

#### Scenario: Unmute restores audio
- **WHEN** the player activates the mute button while muted
- **THEN** music volume returns to 0.4, SFX gain returns to 1.0, and speech resumes on the next junction

#### Scenario: Mute button visible at all times
- **WHEN** the game is in any state (playing, paused, Build screen, floor clear)
- **THEN** the mute button is rendered in the top-right corner of the canvas and responds to input
