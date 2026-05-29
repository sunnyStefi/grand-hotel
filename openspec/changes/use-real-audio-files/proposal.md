## Why

All audio in the game is currently synthesized at runtime via Web Audio API, but real recorded MP3 files now exist in `assets/audio/` that cover every SFX and the background music. Replacing the synthesized audio with these files will make the game sound polished and memorable, as originally intended.

## What Changes

- Remove all synthesis functions (`_makeTone`, `makeDing`, `makeChing`, `makeBuzz`, `makeCombo`, `makeFanfare`, `makeCashout`) and the procedural chiptune loop from `src/audio.js`
- Load real MP3 files at init time using `fetch` + `AudioContext.decodeAudioData` for SFX playback via `AudioBufferSourceNode`
- Use an `<audio>` element (or `AudioBufferSourceNode` loop) for the background music track `Grand Hotel Gold.mp3`
- Map actual asset filenames to their logical SFX roles:
  | Asset file | SFX role |
  |---|---|
  | `Grand Hotel Gold.mp3` | background music loop |
  | `Door Open Ding.mp3` | ding (correct door) |
  | `Coin Collect.mp3` | ching (coin burst) |
  | `Wrong Answer.mp3` | buzz (wrong answer) |
  | `Combo build.mp3` | combo (streak tick) |
  | `Floor Clear.mp3` | fanfare + cashout (floor clear & purchase) |
- Keep `speakSum`, `setMuted`, `isMuted` public API unchanged
- Keep the mute toggle behaviour unchanged

## Capabilities

### New Capabilities

_(none)_

### Modified Capabilities

- `audio`: File paths change from spec-named stubs (`sfx-ding.mp3`, `music-loop.mp3`, etc.) to actual asset filenames (`Door Open Ding.mp3`, `Grand Hotel Gold.mp3`, etc.). The `sfx-fanfare` and `sfx-cashout` roles are both served by `Floor Clear.mp3`.

## Impact

- `src/audio.js` — full rewrite of the audio loading and playback internals; public API surface (`initAudio`, `playSfx`, `speakSum`, `setMuted`, `isMuted`) stays the same so no other files change.
