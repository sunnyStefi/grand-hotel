let ctx = null;
let sfxGain = null;
let musicEl = null;
let muted = false;

const buffers = {};

function getCtx() {
  if (!ctx) {
    ctx = new (window.AudioContext || window.webkitAudioContext)();
    sfxGain = ctx.createGain();
    sfxGain.gain.value = 1;
    sfxGain.connect(ctx.destination);
  }
  return ctx;
}

// Synthesise SFX with Web Audio (no external files needed)
function makeDing() {
  return _makeTone([880, 1100], [0.3, 0.1], 'sine');
}
function makeChing() {
  return _makeTone([1400, 1800, 2200], [0.15, 0.08, 0.05], 'triangle');
}
function makeBuzz() {
  return _makeTone([200, 150], [0.3, 0.1], 'sawtooth');
}
function makeCombo() {
  return _makeTone([660, 880, 1100, 1320], [0.08, 0.08, 0.08, 0.12], 'sine');
}
function makeFanfare() {
  return _makeTone([523, 659, 784, 1047], [0.2, 0.2, 0.2, 0.4], 'square');
}
function makeCashout() {
  return _makeTone([392, 523, 659, 784, 1047], [0.1, 0.1, 0.1, 0.1, 0.3], 'sine');
}
function makeSad() {
  return _makeTone([400, 300, 200, 100], [0.15, 0.15, 0.15, 0.2], 'sawtooth');
}

function _makeTone(freqs, durations, type) {
  const ac = getCtx();
  const total = durations.reduce((a, b) => a + b, 0);
  const buf = ac.createBuffer(1, ac.sampleRate * total, ac.sampleRate);
  const data = buf.getChannelData(0);
  let offset = 0;
  freqs.forEach((freq, i) => {
    const len = Math.floor(ac.sampleRate * durations[i]);
    for (let j = 0; j < len; j++) {
      const t = j / ac.sampleRate;
      const env = Math.max(0, 1 - j / len);
      if (type === 'sine')     data[offset + j] = Math.sin(2 * Math.PI * freq * t) * env * 0.4;
      if (type === 'triangle') data[offset + j] = (2 / Math.PI) * Math.asin(Math.sin(2 * Math.PI * freq * t)) * env * 0.3;
      if (type === 'sawtooth') data[offset + j] = ((freq * t % 1) * 2 - 1) * env * 0.25;
      if (type === 'square')   data[offset + j] = Math.sign(Math.sin(2 * Math.PI * freq * t)) * env * 0.2;
    }
    offset += len;
  });
  return buf;
}

export function initAudio() {
  const ac = getCtx();
  buffers.ding    = makeDing();
  buffers.ching   = makeChing();
  buffers.buzz    = makeBuzz();
  buffers.combo   = makeCombo();
  buffers.fanfare = makeFanfare();
  buffers.cashout = makeCashout();
  buffers.sad     = makeSad();

  // Music — load MP3 background loop
  startMusic();
}

function startMusic() {
  if (musicEl) return;
  const audio = new Audio('assets/audio/Grand Hotel Gold.mp3');
  audio.loop = true;
  audio.volume = 0.3;
  audio.play().catch(() => {});
  musicEl = audio;
}

export function playSfx(name) {
  if (muted) return;
  const buf = buffers[name];
  if (!buf) return;
  const ac = getCtx();
  if (ac.state === 'suspended') ac.resume();
  const src = ac.createBufferSource();
  src.buffer = buf;
  src.connect(sfxGain);
  src.start();
}

export function setMuted(m) {
  muted = m;
  if (sfxGain) sfxGain.gain.value = m ? 0 : 1;
  if (musicEl) musicEl.volume = m ? 0 : 0.3;
}

export function isMuted() { return muted; }
