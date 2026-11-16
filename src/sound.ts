// Tiny chiptune bleeps with the Web Audio API. No files to load.
let ctx: AudioContext | null = null;

function audio(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!ctx) {
    const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
  }
  return ctx;
}

export function blip(freq = 440, dur = 0.12, type: OscillatorType = 'square', vol = 0.06, when = 0) {
  const a = audio();
  if (!a) return;
  const t = a.currentTime + when;
  const o = a.createOscillator();
  const g = a.createGain();
  o.type = type;
  o.frequency.setValueAtTime(freq, t);
  g.gain.setValueAtTime(vol, t);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  o.connect(g).connect(a.destination);
  o.start(t);
  o.stop(t + dur + 0.02);
}

// A short burst of filtered noise, for crunchy sounds.
function crunchBurst(when: number, dur = 0.07, freq = 1800, vol = 0.18) {
  const a = audio();
  if (!a) return;
  const t = a.currentTime + when;
  const len = Math.floor(a.sampleRate * dur);
  const buf = a.createBuffer(1, len, a.sampleRate);
  const data = buf.getChannelData(0);
  for (let i = 0; i < len; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / len);
  const src = a.createBufferSource();
  src.buffer = buf;
  const bp = a.createBiquadFilter();
  bp.type = 'bandpass';
  bp.frequency.value = freq;
  bp.Q.value = 0.9;
  const g = a.createGain();
  g.gain.setValueAtTime(vol, t);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  src.connect(bp).connect(g).connect(a.destination);
  src.start(t);
}

export const sfx = {
  insert: () => { blip(220, 0.06); blip(330, 0.06, 'square', 0.06, 0.07); blip(660, 0.1, 'square', 0.05, 0.14); },
  eject: () => { blip(500, 0.06); blip(250, 0.1, 'square', 0.05, 0.07); },
  select: () => blip(880, 0.05, 'square', 0.04),
  note: () => {
    const notes = [261.63, 293.66, 329.63, 392, 440, 523.25];
    blip(notes[Math.floor(Math.random() * notes.length)], 0.35, 'triangle', 0.12);
  },
  crunch: () => { blip(120, 0.05, 'sawtooth', 0.05); blip(90, 0.05, 'sawtooth', 0.05, 0.06); },
  // nom nom nom: a few crunchy bites with a little chew in between
  munch: () => {
    [0, 0.2, 0.4, 0.62].forEach((w, i) => {
      crunchBurst(w + Math.random() * 0.03, 0.06 + Math.random() * 0.04, 1200 + Math.random() * 1600, 0.16 - i * 0.025);
      blip(140 - i * 10, 0.05, 'triangle', 0.04, w + 0.05);
    });
  },
  // picking a cartridge up off the shelf
  grab: () => { crunchBurst(0, 0.03, 3200, 0.12); blip(520, 0.04, 'square', 0.04, 0.01); },
  // plastic sliding while you carry it
  slide: () => {
    const a = audio();
    if (!a) return;
    const t = a.currentTime;
    const len = Math.floor(a.sampleRate * 0.35);
    const buf = a.createBuffer(1, len, a.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
    const src = a.createBufferSource();
    src.buffer = buf;
    const bp = a.createBiquadFilter();
    bp.type = 'bandpass';
    bp.Q.value = 2;
    bp.frequency.setValueAtTime(700, t);
    bp.frequency.linearRampToValueAtTime(1600, t + 0.35);
    const g = a.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.linearRampToValueAtTime(0.07, t + 0.08);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.35);
    src.connect(bp).connect(g).connect(a.destination);
    src.start(t);
  },
  // sprite: picked up, landed
  lift: () => { blip(400, 0.06, 'square', 0.05); blip(800, 0.08, 'square', 0.04, 0.05); },
  thud: (power = 1) => { blip(110, 0.12, 'triangle', 0.08 * power); crunchBurst(0, 0.05, 500, 0.08 * power); },
  // a tiny dance tune
  dance: () => {
    const tune = [392, 523.25, 659.25, 523.25, 587.33, 698.46, 659.25, 523.25];
    tune.forEach((f, i) => blip(f, 0.14, 'square', 0.05, i * 0.18));
    [0, 0.36, 0.72, 1.08].forEach((w) => blip(98, 0.1, 'triangle', 0.1, w));
  },
  // little me: ricochet, slurp, letter unfolding
  boing: () => { blip(300 + Math.random() * 300, 0.08, 'square', 0.04); },
  slurp: () => { [0, 0.08, 0.16, 0.26].forEach((w, i) => crunchBurst(w, 0.09, 500 + i * 150, 0.1)); blip(220, 0.25, 'sine', 0.05, 0.3); },
  paper: () => { crunchBurst(0, 0.12, 4000, 0.06); crunchBurst(0.1, 0.1, 3000, 0.05); },
  dunk: () => { blip(600, 0.08, 'sine', 0.08); blip(300, 0.2, 'sine', 0.07, 0.08); },
  sip: () => blip(180, 0.15, 'sine', 0.06),
};
