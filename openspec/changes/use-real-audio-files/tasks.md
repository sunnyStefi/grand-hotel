## 1. Remove synthesized audio

- [ ] 1.1 Delete all synthesis functions from `src/audio.js`: `_makeTone`, `makeDing`, `makeChing`, `makeBuzz`, `makeCombo`, `makeFanfare`, `makeCashout`
- [ ] 1.2 Delete the `startMusic` procedural chiptune function and its oscillator-based loop

## 2. Implement MP3 loading

- [ ] 2.1 Add a `loadBuffer(path)` helper that fetches an MP3, decodes it with `AudioContext.decodeAudioData`, and returns the buffer (or `null` on failure with a `console.warn`)
- [ ] 2.2 In `initAudio`, call `Promise.allSettled` to fetch all five SFX files in parallel and populate `buffers.ding`, `buffers.ching`, `buffers.buzz`, `buffers.combo`, `buffers.fanfare`, `buffers.cashout` (fanfare and cashout share the same buffer from `Floor Clear.mp3`)

## 3. Implement music via HTMLAudioElement

- [ ] 3.1 Create an `<audio>` element with `src="assets/audio/Grand Hotel Gold.mp3"`, `loop=true`, and volume `0.4`; connect it to the AudioContext via `createMediaElementSource` → `sfxGain` → `destination`
- [ ] 3.2 Call `.play()` on the element after `initAudio` resolves (handle the returned Promise to swallow autoplay-policy rejections)

## 4. Wire mute toggle to music element

- [ ] 4.1 Update `setMuted` to set the `<audio>` element's `volume` to `0` when muted and `0.4` when unmuted (in addition to existing `sfxGain` logic)

## 5. Verify

- [ ] 5.1 Open the game in a browser, confirm background music plays on load
- [ ] 5.2 Walk into a correct door — `Door Open Ding.mp3` plays
- [ ] 5.3 Walk into a wrong door — `Wrong Answer.mp3` plays
- [ ] 5.4 Clear a floor — `Floor Clear.mp3` plays
- [ ] 5.5 Build a room in the build screen — `Floor Clear.mp3` plays
- [ ] 5.6 Build a combo streak of 2+ — `Combo build.mp3` plays on each tick
- [ ] 5.7 Collect coins — `Coin Collect.mp3` plays on burst
- [ ] 5.8 Click mute — music and all SFX go silent; click again — audio resumes
