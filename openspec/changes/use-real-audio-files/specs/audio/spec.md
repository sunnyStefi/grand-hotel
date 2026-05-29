## MODIFIED Requirements

### Requirement: Looping background music
The game SHALL play a looping background music track (`assets/audio/Grand Hotel Gold.mp3`) from the moment the game loads. The loop SHALL be seamless (no audible gap at the loop point). Music plays at a default volume of 0.4 (40% of maximum). Music is loaded and played via an `HTMLAudioElement` with `loop = true`, connected to the AudioContext via `createMediaElementSource`.

#### Scenario: Music starts on page load
- **WHEN** the game page finishes loading and `initAudio()` resolves
- **THEN** `Grand Hotel Gold.mp3` begins playing in a loop

#### Scenario: Music loops without gap
- **WHEN** the music track reaches its end
- **THEN** it restarts immediately with no audible pause or click

### Requirement: Sound effects on game events
The system SHALL play a distinct SFX for each of the following game events. SFX are loaded at startup via `fetch` + `AudioContext.decodeAudioData` and played via `AudioBufferSourceNode` to allow rapid overlapping playback.

| Event | Asset file | SFX role |
|---|---|---|
| Correct door opened | `assets/audio/Door Open Ding.mp3` | ding |
| Coin collected / burst | `assets/audio/Coin Collect.mp3` | ching |
| Wrong answer | `assets/audio/Wrong Answer.mp3` | buzz |
| Combo tick (streak ≥ 2) | `assets/audio/Combo build.mp3` | combo |
| Floor clear | `assets/audio/Floor Clear.mp3` | fanfare |
| Room/floor purchased | `assets/audio/Floor Clear.mp3` | cashout |

#### Scenario: Correct door triggers ding
- **WHEN** the player selects the correct answer door
- **THEN** `Door Open Ding.mp3` plays once at full SFX volume

#### Scenario: Wrong answer triggers buzz
- **WHEN** the player selects an incorrect answer door
- **THEN** `Wrong Answer.mp3` plays once; no ding plays

#### Scenario: Coin burst triggers ching
- **WHEN** the coin burst animation begins
- **THEN** `Coin Collect.mp3` plays once per burst event (not once per coin particle)

#### Scenario: Combo tick plays on streak ≥ 2
- **WHEN** the streak counter reaches 2 or increases above 2
- **THEN** `Combo build.mp3` plays once at the moment the new streak value is set

#### Scenario: Floor clear plays fanfare
- **WHEN** the floor-clear sequence begins
- **THEN** `Floor Clear.mp3` plays once; music volume ducks to 0.2 for the duration

#### Scenario: Purchase plays cashout sound
- **WHEN** the player successfully purchases a room or floor in the Build screen
- **THEN** `Floor Clear.mp3` plays once

#### Scenario: Missing audio file degrades gracefully
- **WHEN** a fetch for an audio file fails (file not found, server down)
- **THEN** the corresponding SFX slot remains empty; `playSfx` is a no-op for that event; the game continues normally
