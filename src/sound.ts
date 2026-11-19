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
  live.push(o);
  o.onended = () => { const i = live.indexOf(o); if (i >= 0) live.splice(i, 1); };
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
// the whole lights song, every note (ticks at 96 per beat), for dancing
const LIGHTS_FULL: [number, number][] = ([[62, 48], [65, 48], [62, 47], [60, 49], [62, 47], [57, 47], [60, 50], [62, 47], [62, 48], [65, 48], [62, 47], [60, 49], [62, 48], [57, 143], [62, 48], [65, 48], [62, 48], [60, 48], [62, 48], [57, 47], [60, 49], [62, 48], [62, 48], [65, 48], [62, 47], [60, 49], [62, 48], [69, 143], [62, 48], [65, 48], [62, 48], [60, 48], [62, 48], [57, 47], [60, 49], [62, 48], [62, 48], [65, 48], [62, 47], [60, 49], [62, 48], [57, 148], [72, 389], [74, 378]] as [number, number][]).map(([n, t]) => [n, t / 96]);
const LIGHTS: [number, number][] = [[62, 0.5], [65, 0.5], [62, 0.5], [60, 0.5], [62, 0.5], [57, 0.5], [60, 0.5], [62, 0.5], [62, 0.5], [65, 0.5], [62, 0.5], [60, 0.5], [62, 0.5], [57, 1.5]];
// M.A.S.H.: the first phrase of the space tune (MIDI_Audio.mid)
const SPACE: [number, number][] = [[62, 0.5], [60, 0.5], [62, 0.5], [60, 0.5], [62, 0.5], [65, 0.5], [61, 0.5], [60, 1]];
// madebit: the call from higher.mid
// the desk piano tune from madebit.studio: [MIDI note, length in ticks at 96 per beat]
const PIANO: [number, number][] = [[43, 386], [45, 378], [48, 292], [50, 49], [48, 94], [43, 141], [55, 52], [53, 47], [57, 145], [55, 24], [53, 24], [50, 288], [48, 384], [50, 288], [53, 97], [55, 480]];
// the response from higher_2.mid
const RESPONSE: [number, number, number][] = [[1728, 60, 62], [1821, 93, 64], [1960, 73, 64], [2055, 85, 64], [2104, 98, 62], [2196, 98, 64], [2295, 60, 66], [2350, 107, 64], [2448, 141, 59]];
// [start tick, length in ticks, MIDI note], straight from the file, so the rests are kept
const CALL: [number, number, number][] = [[192, 45, 59], [287, 141, 59], [422, 108, 62], [526, 57, 59], [572, 112, 66], [669, 96, 64], [763, 51, 62], [807, 112, 64], [913, 105, 59]];
// the farm: the start of the desk keyboard tune (CF_Tones_Ah_A4_Falsetto_5.mid)
const DESK: [number, number][] = [[43, 1.9], [45, 1.8], [48, 1.4], [50, 0.3], [48, 0.5], [43, 0.7]];

let melodyEnd = 0;
const live: OscillatorNode[] = [];
function stopAll() { const a = ctx; if (!a) return; for (const o of live.splice(0)) { try { o.stop(a.currentTime + 0.02); } catch { /* already done */ } } melodyEnd = a.currentTime; }
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

/** A phrase timed by its MIDI start ticks (keeps the rests between notes). */
function ticks(notes: [number, number, number][], tick: number, type: OscillatorType, vol: number) {
  const a = audio();
  if (!a) return;
  const t0 = Math.max(0.02, melodyEnd - a.currentTime) - notes[0][0] * tick;
  for (const [start, len, n] of notes) tone(hz(n), Math.max(0.08, len * tick), type, vol, t0 + start * tick);
  const [s, l] = notes[notes.length - 1];
  melodyEnd = a.currentTime + t0 + (s + l) * tick;
}

export const sfx = {
  /** one footstep; alternates feet */
  step(left: boolean) { tone(left ? 150 : 170, 0.05, 'triangle', 0.05); },
  /** a little tune when she arrives somewhere */
  arrive(id: string) {
    if (id === 'akta') melody(LIGHTS, 0.22, 'square', 0.035);
    else if (id === 'mash') melody(SPACE, 0.25, 'square', 0.035);
    else if (id === 'madebit') ticks(CALL, 0.0032, 'triangle', 0.09);
    else if (id === 'farm') melody(DESK.map(([n, l]) => [n + 12, l] as [number, number]), 0.22, 'triangle', 0.08);
  },
  splash() { noise(0.45, 0.25, 1800); tone(500, 0.25, 'sine', 0.08, 0, 140); },
  bloop() { tone(300 + Math.random() * 200, 0.12, 'sine', 0.06, 0, 700); },
  dig() { noise(0.12, 0.2, 600); tone(110, 0.1, 'triangle', 0.08); },
  water() { for (let i = 0; i < 8; i++) tone(900 + Math.random() * 600, 0.05, 'sine', 0.03, i * 0.06); },
  click(on: boolean) { tone(on ? 1400 : 900, 0.03, 'square', 0.04); },
  page() { noise(0.12, 0.06, 4000); },
  typing() { for (let i = 0; i < 4; i++) tone(1800 + Math.random() * 400, 0.02, 'square', 0.015, i * 0.09 + Math.random() * 0.03); },
  bark() { tone(420, 0.09, 'square', 0.06, 0, 300); tone(460, 0.12, 'square', 0.06, 0.16, 320); },
  family() { melody([[67, 0.5], [71, 0.5], [74, 0.5], [79, 1.5]], 0.22, 'triangle', 0.08); },
  /** The whole lights song with a kick drum on every beat. Returns how long it lasts, in seconds. */
  danceLoop(): number {
    const beat = 0.36;
    const length = LIGHTS_FULL.reduce((t, [, l]) => t + l, 0) * beat;
    const a = audio();
    if (!a) return length;
    stopAll();
    melodyEnd = a.currentTime;
    melody(LIGHTS_FULL, beat, 'square', 0.035);
    for (let t = 0; t < length - 0.2; t += beat) tone(90, 0.1, 'sine', 0.12, t, 45);
    return length;
  },
  stopLoop() { stopAll(); },
  /** The desk keyboard melody from madebit.studio (CF_Tones_Ah_A4_Falsetto_5.mid), all 16 notes,
   *  each held at full volume for its exact MIDI length at 130 bpm, like the piano on the desk. */
  piano() {
    const a = audio();
    if (!a) return;
    const tick = 60 / 130 / 96;
    let t = Math.max(0.02, melodyEnd - a.currentTime);
    for (const [n, len] of PIANO) {
      const dur = Math.max(0.15, len * tick);
      const o = a.createOscillator();
      const g = a.createGain();
      const at = a.currentTime + t;
      const release = Math.min(0.08, dur / 4);
      o.type = 'triangle';
      o.frequency.setValueAtTime(hz(n), at);
      g.gain.setValueAtTime(0.0001, at);
      g.gain.linearRampToValueAtTime(0.16, at + 0.012);
      g.gain.setValueAtTime(0.16, at + dur - release);
      g.gain.linearRampToValueAtTime(0.0001, at + dur);
      o.connect(g).connect(a.destination);
      o.start(at);
      o.stop(at + dur + 0.02);
      live.push(o);
      t += dur;
    }
    melodyEnd = a.currentTime + t;
    return t;
  },
  /** The whole of higher.mid: the call, then the response. */
  higher() {
    const resp = RESPONSE.map(([st, l, n]) => [st - 560, l, n] as [number, number, number]);
    ticks(CALL.concat(resp), 0.0034, 'triangle', 0.09);
  },
  crunch() { noise(0.09, 0.25, 2500); tone(140, 0.05, 'square', 0.03); },
  tinkle() { noise(0.8, 0.05, 2500); },
  shutter() { noise(0.05, 0.25, 6000); noise(0.08, 0.2, 3000, 0.09); },
  coin() { tone(hz(83), 0.07, 'square', 0.04); tone(hz(88), 0.25, 'square', 0.04, 0.07); },
  squeak() { tone(1800, 0.06, 'square', 0.025, 0, 2400); tone(2000, 0.06, 'square', 0.025, 0.09, 2600); },
  plink() { tone(hz(84), 0.12, 'triangle', 0.06); },
  nope() { tone(220, 0.12, 'square', 0.04); tone(180, 0.18, 'square', 0.04, 0.13); },
  wish() { melody([[72, 1.6], [74, 1.6]], 0.4, 'triangle', 0.08); [79, 84, 88, 91].forEach((n, i) => tone(hz(n), 0.3, 'sine', 0.04, i * 0.15)); },
  chomp() { tone(220, 0.08, 'square', 0.05); tone(160, 0.1, 'square', 0.05, 0.1); },
  fanfare() { [[67, 0], [72, 0.12], [76, 0.24], [79, 0.36], [84, 0.5]].forEach(([n, t]) => tone(hz(n), n === 84 ? 0.5 : 0.14, 'square', 0.04, t)); },
  pop() { [72, 76, 79, 84].forEach((n, i) => tone(hz(n), 0.12, 'square', 0.04, i * 0.07)); },
};
