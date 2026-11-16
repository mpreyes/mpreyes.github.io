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

export const sfx = {
  insert: () => { blip(220, 0.06); blip(330, 0.06, 'square', 0.06, 0.07); blip(660, 0.1, 'square', 0.05, 0.14); },
  eject: () => { blip(500, 0.06); blip(250, 0.1, 'square', 0.05, 0.07); },
  select: () => blip(880, 0.05, 'square', 0.04),
  note: () => {
    const notes = [261.63, 293.66, 329.63, 392, 440, 523.25];
    blip(notes[Math.floor(Math.random() * notes.length)], 0.35, 'triangle', 0.12);
  },
  crunch: () => { blip(120, 0.05, 'sawtooth', 0.05); blip(90, 0.05, 'sawtooth', 0.05, 0.06); },
  dunk: () => { blip(600, 0.08, 'sine', 0.08); blip(300, 0.2, 'sine', 0.07, 0.08); },
  sip: () => blip(180, 0.15, 'sine', 0.06),
};
