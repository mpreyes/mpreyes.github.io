// Little chiptune sounds with the Web Audio API (no files to load), plus my own melodies,
// the same MIDI tunes as on madebit.studio.

let ctx: AudioContext | null = null;
const KEY = 'sound-off';
let muted = (() => { try { return localStorage.getItem(KEY) === '1'; } catch { return false; } })();

export const isMuted = () => muted;
export function setMuted(m: boolean) {
  muted = m;
  try { localStorage.setItem(KEY, m ? '1' : '0'); } catch { /* private mode */ }
}

function audio(): AudioContext | null {
  if (muted || typeof window === 'undefined') return null;
  if (!ctx) {
    const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
  }
  return ctx.state === 'running' ? ctx : null;
}

// Browsers (iPhones especially) keep audio off until a tap. Call this from the first tap.
export function unlockAudio() {
  if (!ctx) {
    const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AC) return;
    ctx = new AC();
  }
  const nav = navigator as Navigator & { audioSession?: { type: string } };
  if (nav.audioSession) nav.audioSession.type = 'playback';
  if (ctx.state !== 'running') void ctx.resume();
}

function tone(freq: number, dur: number, type: OscillatorType, vol: number, when = 0, slideTo?: number) {
  const a = audio();
  if (!a) return;
  const t = a.currentTime + when;
  const o = a.createOscillator();
  const g = a.createGain();
  o.type = type;
  o.frequency.setValueAtTime(freq, t);
  if (slideTo) o.frequency.exponentialRampToValueAtTime(slideTo, t + dur);
  g.gain.setValueAtTime(0.0001, t);
  g.gain.linearRampToValueAtTime(vol, t + 0.008);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  o.connect(g).connect(a.destination);
  o.start(t);
  o.stop(t + dur + 0.02);
}

function noise(dur: number, vol: number, filterHz: number, when = 0) {
  const a = audio();
  if (!a) return;
  const t = a.currentTime + when;
  const buf = a.createBuffer(1, Math.ceil(a.sampleRate * dur), a.sampleRate);
  const d = buf.getChannelData(0);
  for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
  const src = a.createBufferSource();
  src.buffer = buf;
  const f = a.createBiquadFilter();
  f.type = 'lowpass';
  f.frequency.setValueAtTime(filterHz, t);
  const g = a.createGain();
  g.gain.setValueAtTime(vol, t);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  src.connect(f).connect(g).connect(a.destination);
  src.start(t);
}

const hz = (n: number) => 440 * 2 ** ((n - 69) / 12);

// ---------- my melodies (MIDI note, length in beats) ----------
// Akta's string lights: the lights tune (Analog_Lab_V_5.mid)
const LIGHTS: [number, number][] = [[62, 0.5], [65, 0.5], [62, 0.5], [60, 0.5], [62, 0.5], [57, 0.5], [60, 0.5], [62, 0.5], [62, 0.5], [65, 0.5], [62, 0.5], [60, 0.5], [62, 0.5], [57, 1.5]];
// M.A.S.H.: the first phrase of the space tune (MIDI_Audio.mid)
const SPACE: [number, number][] = [[62, 0.5], [60, 0.5], [62, 0.5], [60, 0.5], [62, 0.5], [65, 0.5], [61, 0.5], [60, 1]];
// madebit: the call from higher.mid
const CALL: [number, number][] = [[59, 0.47], [59, 1.47], [62, 1.1], [59, 0.6], [66, 1.17], [64, 1], [62, 0.53], [64, 1.17], [59, 1.1]];
// the farm: the start of the desk keyboard tune (CF_Tones_Ah_A4_Falsetto_5.mid)
const DESK: [number, number][] = [[43, 1.9], [45, 1.8], [48, 1.4], [50, 0.3], [48, 0.5], [43, 0.7]];

let melodyEnd = 0;
function melody(notes: [number, number][], beat: number, type: OscillatorType, vol: number) {
  const a = audio();
  if (!a) return;
  let t = Math.max(0.02, melodyEnd - a.currentTime);
  for (const [n, len] of notes) {
    tone(hz(n), Math.max(0.1, len * beat * 0.95), type, vol, t);
    t += len * beat;
  }
  melodyEnd = a.currentTime + t;
}

export const sfx = {
  /** one footstep; alternates feet */
  step(left: boolean) { tone(left ? 150 : 170, 0.05, 'triangle', 0.05); },
  /** a little tune when she arrives somewhere */
  arrive(id: string) {
    if (id === 'akta') melody(LIGHTS, 0.22, 'square', 0.035);
    else if (id === 'mash') melody(SPACE, 0.25, 'square', 0.035);
    else if (id === 'madebit') melody(CALL, 0.28, 'triangle', 0.09);
    else if (id === 'farm') melody(DESK.map(([n, l]) => [n + 12, l] as [number, number]), 0.22, 'triangle', 0.08);
  },
  splash() { noise(0.45, 0.25, 1800); tone(500, 0.25, 'sine', 0.08, 0, 140); },
  bloop() { tone(300 + Math.random() * 200, 0.12, 'sine', 0.06, 0, 700); },
  dig() { noise(0.12, 0.2, 600); tone(110, 0.1, 'triangle', 0.08); },
  water() { for (let i = 0; i < 8; i++) tone(900 + Math.random() * 600, 0.05, 'sine', 0.03, i * 0.06); },
  click(on: boolean) { tone(on ? 1400 : 900, 0.03, 'square', 0.04); },
  page() { noise(0.12, 0.06, 4000); },
  coin() { tone(hz(83), 0.07, 'square', 0.04); tone(hz(88), 0.25, 'square', 0.04, 0.07); },
  squeak() { tone(1800, 0.06, 'square', 0.025, 0, 2400); tone(2000, 0.06, 'square', 0.025, 0.09, 2600); },
  plink() { tone(hz(84), 0.12, 'triangle', 0.06); },
  nope() { tone(220, 0.12, 'square', 0.04); tone(180, 0.18, 'square', 0.04, 0.13); },
  wish() { melody([[72, 1.6], [74, 1.6]], 0.4, 'triangle', 0.08); [79, 84, 88, 91].forEach((n, i) => tone(hz(n), 0.3, 'sine', 0.04, i * 0.15)); },
  chomp() { tone(220, 0.08, 'square', 0.05); tone(160, 0.1, 'square', 0.05, 0.1); },
  fanfare() { [[67, 0], [72, 0.12], [76, 0.24], [79, 0.36], [84, 0.5]].forEach(([n, t]) => tone(hz(n), n === 84 ? 0.5 : 0.14, 'square', 0.04, t)); },
  pop() { [72, 76, 79, 84].forEach((n, i) => tone(hz(n), 0.12, 'square', 0.04, i * 0.07)); },
};
