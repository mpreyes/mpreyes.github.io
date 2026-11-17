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

// Phones (iPhones especially) keep Web Audio silent until the page "unlocks" it on a tap, and the
// ringer switch mutes it entirely unless a real media element has played. So on the first tap we
// resume the context, play a tiny silent clip, and ask for "playback" audio, then every bleep works.
// Returns true once sound is on, so the caller can stop listening.
let unlocked = false;
export async function unlockAudio(): Promise<boolean> {
  if (unlocked) return true;
  const nav = navigator as Navigator & { audioSession?: { type: string } };
  if (nav.audioSession) nav.audioSession.type = 'playback';
  const a = audio();
  try {
    // 0.05s of silence as a WAV, built in code so there's no file to load
    const n = 2205;
    const buf = new ArrayBuffer(44 + n * 2);
    const v = new DataView(buf);
    const str = (o: number, t: string) => { for (let i = 0; i < t.length; i++) v.setUint8(o + i, t.charCodeAt(i)); };
    str(0, 'RIFF'); v.setUint32(4, 36 + n * 2, true); str(8, 'WAVEfmt '); v.setUint32(16, 16, true);
    v.setUint16(20, 1, true); v.setUint16(22, 1, true); v.setUint32(24, 44100, true); v.setUint32(28, 88200, true);
    v.setUint16(32, 2, true); v.setUint16(34, 16, true); str(36, 'data'); v.setUint32(40, n * 2, true);
    const el = new Audio(URL.createObjectURL(new Blob([buf], { type: 'audio/wav' })));
    el.setAttribute('playsinline', '');
    // start both right away, while the browser still counts this as a tap
    const playing = el.play();
    const resumed = a && a.state !== 'running' ? a.resume() : Promise.resolve();
    await Promise.all([playing, resumed]);
    unlocked = true;
  } catch { /* not a tap the browser counts yet; try again on the next one */ }
  return unlocked;
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

// The desk keyboard: every note holds at full volume for exactly its length in the MIDI, like a held
// key. A click while a note is still holding doesn't cut it off; the next note waits its turn, so even
// fast clicking plays the melody in its real rhythm. Returns how many seconds until this note starts.
let keyFreeAt = 0;
export function keyNote(freq: number, seconds: number): number {
  const a = audio();
  if (!a) return 0;
  const now = a.currentTime;
  const t = Math.max(now + 0.01, keyFreeAt);
  const dur = Math.max(0.15, seconds);
  const release = Math.min(0.08, dur / 4);
  const o = a.createOscillator();
  const g = a.createGain();
  o.type = 'triangle';
  o.frequency.setValueAtTime(freq, t);
  g.gain.setValueAtTime(0.0001, t);
  g.gain.linearRampToValueAtTime(0.16, t + 0.012);
  g.gain.setValueAtTime(0.16, t + dur - release);
  g.gain.linearRampToValueAtTime(0.0001, t + dur);
  o.connect(g).connect(a.destination);
  o.start(t);
  o.stop(t + dur + 0.02);
  keyFreeAt = t + dur;
  return t - now;
}

// A whole phrase at once, in rhythm: [start tick, length in ticks, MIDI note], `tick` seconds per tick.
// Notes hold at full volume for their length. Returns how long the phrase lasts, in seconds.
export function phrase(notes: [number, number, number][], tick: number): number {
  const a = audio();
  if (!a || notes.length === 0) return 0;
  const t0 = a.currentTime + 0.05 - notes[0][0] * tick;
  let end = 0;
  for (const [start, len, n] of notes) {
    const t = t0 + start * tick;
    const dur = Math.max(0.08, len * tick);
    const o = a.createOscillator();
    const g = a.createGain();
    o.type = 'square';
    o.frequency.setValueAtTime(440 * 2 ** ((n - 69) / 12), t);
    g.gain.setValueAtTime(0.0001, t);
    g.gain.linearRampToValueAtTime(0.05, t + 0.01);
    g.gain.setValueAtTime(0.05, t + dur * 0.8);
    g.gain.linearRampToValueAtTime(0.0001, t + dur);
    o.connect(g).connect(a.destination);
    o.start(t);
    o.stop(t + dur + 0.02);
    end = Math.max(end, t + dur);
  }
  return end - a.currentTime;
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
  // the sun spinning
  whoosh: () => { crunchBurst(0, 0.35, 700, 0.07); blip(300, 0.3, 'sine', 0.05); blip(600, 0.25, 'sine', 0.03, 0.08); },
  // 5 taps on the sun: a rising rumble, then a bright burst
  supernova: () => {
    [0, 0.1, 0.2, 0.3, 0.4, 0.5].forEach((w, i) => blip(110 * 2 ** (i / 2), 0.14, 'square', 0.05, w));
    crunchBurst(0.65, 0.9, 400, 0.22);
    [523.25, 659.25, 783.99, 1046.5].forEach((f, i) => blip(f, 0.6, 'triangle', 0.08, 0.7 + i * 0.07));
  },
  // little twinkle for secrets found (a shooting star caught, the lights' tune played)
  sparkle: () => { [1318.5, 1568, 2093, 2637].forEach((f, i) => blip(f, 0.18, 'triangle', 0.05, i * 0.06)); },
  // crumpled paper
  crumple: () => { [0, 0.05, 0.11, 0.18].forEach((w) => crunchBurst(w, 0.05, 2500 + Math.random() * 2000, 0.09)); },
  // a drawer sliding
  drawer: () => { crunchBurst(0, 0.25, 300, 0.12); blip(90, 0.12, 'triangle', 0.06, 0.2); },
  // one note of a melody: a soft triangle with a quiet square an octave up (`beats` long, `when` seconds from now)
  melody: (hz: number, seconds = 0.4, when = 0) => {
    const dur = Math.min(1.6, Math.max(0.22, seconds));
    blip(hz, dur, 'triangle', 0.14, when);
    blip(hz * 2, dur * 0.5, 'square', 0.02, when);
  },
};
