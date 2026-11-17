// My melodies, from MIDI. Notes are [MIDI note, length in beats]. At 120 bpm one beat is 0.5s.
export const BEAT = 0.5;

// The desk keyboard: each click plays the next note, then it loops. (CF_Tones_Ah_A4_Falsetto_5.mid)
// Every note, original octave, held exactly as long as in the MIDI (until the next note starts), at 130 bpm.
const DESK_BPM = 130;
const TPB = 96; // MIDI ticks per beat
const DESK_TICKS: [number, number][] = [
  [43, 386], [45, 378], [48, 292], [50, 49], [48, 94], [43, 141], [55, 52], [53, 47],
  [57, 145], [55, 24], [53, 24], [50, 288], [48, 384], [50, 288], [53, 97], [55, 480],
];
// stored in this file's BEAT units (120 bpm), so every melody shares one clock
export const DESK_MELODY: [number, number][] = DESK_TICKS.map(([n, t]) => [n, ((t / TPB) * 120) / DESK_BPM]);

// The TV knobs: a call (higher.mid) and its response (higher_2.mid), played in rhythm at 130 bpm.
// Each note is [start tick, length in ticks, MIDI note].
export type Phrase = [number, number, number][];
export const CALL: Phrase = [
  [192, 45, 59], [287, 141, 59], [422, 108, 62], [526, 57, 59], [572, 112, 66], [669, 96, 64], [763, 51, 62], [807, 112, 64],
  [913, 105, 59], [1726, 60, 62], [1821, 93, 64], [1960, 73, 64], [2055, 61, 62], [2203, 98, 66], [2295, 60, 64], [2375, 106, 62],
  [2496, 69, 59],
];
export const RESPONSE: Phrase = [
  [200, 45, 59], [287, 141, 59], [422, 108, 62], [526, 57, 59], [572, 112, 66], [669, 96, 64], [763, 51, 62], [807, 112, 64],
  [913, 105, 59], [1728, 60, 62], [1821, 93, 64], [1960, 73, 64], [2055, 85, 64], [2104, 98, 62], [2196, 98, 64], [2295, 60, 66],
  [2350, 107, 64], [2448, 141, 59],
];
/** seconds per MIDI tick at the songs' 130 bpm */
export const TICK = 60 / DESK_BPM / TPB;

// The solar system: each tap on the sun plays the next 8-note phrase while the planets take a lap. (MIDI_Audio.mid)
export const SPACE_MELODY: [number, number][] = [
  [62, 0.5], [60, 0.5], [62, 0.5], [60, 0.5], [62, 0.5], [65, 0.5], [61, 0.5], [60, 0.5],
  [62, 0.5], [60, 0.5], [62, 0.5], [60, 0.5], [62, 0.5], [67, 0.5], [61, 0.5], [60, 0.5],
  [62, 0.5], [60, 0.5], [62, 0.5], [60, 0.5], [62, 0.5], [65, 0.5], [61, 0.5], [60, 0.5],
  [62, 0.5], [60, 0.5], [55, 0.5], [55, 0.5], [58, 1], [58, 1],
];
export const PHRASE = 8;

export const noteHz = (n: number) => 440 * 2 ** ((n - 69) / 12);

/** which of `keys` keyboard keys lights up for a note in a melody (low notes on the left) */
export function keyFor(melody: [number, number][], n: number, keys: number) {
  const notes = melody.map(([m]) => m);
  const lo = Math.min(...notes);
  const hi = Math.max(...notes);
  return Math.round(((n - lo) / (hi - lo || 1)) * (keys - 1));
}
