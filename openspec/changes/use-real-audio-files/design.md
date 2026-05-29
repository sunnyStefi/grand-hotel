## Context

`src/audio.js` currently generates all sound in-browser: six SFX are synthesized using oscillators/buffers via Web Audio API, and background music is a hand-coded procedural chiptune loop. Six real MP3 files are now available in `assets/audio/`. The public API (`initAudio`, `playSfx`, `speakSum`, `setMuted`, `isMuted`) must not change — callers in `game.js` and `renderer.js` depend on it.

## Goals / Non-Goals

**Goals:**
- Load all six MP3 files at startup and play them as AudioBuffers (SFX) or via HTMLAudioElement (music)
- Remove every synthesis function and the procedural chiptune loop
- Keep the existing public API surface identical (no callers change)
- Gracefully degrade if a file fails to load (synthesized fallback is removed; silence is acceptable)

**Non-Goals:**
- Changing speech synthesis (`speakSum`)
- Changing mute toggle logic
- Renaming the files in `assets/audio/`
- Adding volume controls beyond what already exists

## Decisions

### Decision 1: SFX via `fetch` + `decodeAudioData` into AudioBuffers

Same pattern as the current `buffers` map — swap out synthesized buffer creation for network-fetched buffers. Allows rapid overlapping playback (same `AudioBufferSourceNode` pattern) with no structural change to `playSfx`.

_Alternative considered_: HTMLAudioElement per SFX — simpler but doesn't allow overlapping playback (two coins in quick succession would cut the first one off).

### Decision 2: Music via `HTMLAudioElement` with `loop = true`

`Grand Hotel Gold.mp3` is 2.4 MB. Decoding it into an AudioBuffer would consume ~30 MB of RAM. An `<audio>` element streams and loops natively. Connect it to the AudioContext via `createMediaElementSource` so the existing `sfxGain` path can mute it alongside SFX.

_Alternative considered_: AudioBufferSource loop — works but wastes memory for a large music file.

### Decision 3: `Floor Clear.mp3` covers both `fanfare` and `cashout` slots

Only one file maps to two internal event names. Both `buffers.fanfare` and `buffers.cashout` will reference the same decoded AudioBuffer. This is the simplest approach given the available assets.

### Decision 4: Non-blocking init with `Promise.allSettled`

Fetch all six files in parallel; failed fetches resolve to `null` (slot stays empty, `playSfx` silently no-ops on null buffer). The game never fails to start due to a missing audio file.

## Risks / Trade-offs

- **Autoplay policy**: AudioContext may start suspended on user-gesture-required browsers. `getCtx()` already calls `ac.resume()` inside `playSfx` — same pattern covers the new code. → No additional mitigation needed.
- **First-interaction latency**: Music starts after `initAudio()` resolves (fetches complete). On slow connections the first few seconds may be silent. → Acceptable for a local dev game; no CDN or preload header needed.
- **File not found**: If the server isn't running, all fetches fail silently. → `initAudio` logs a console warning per file; game remains playable (silent).
