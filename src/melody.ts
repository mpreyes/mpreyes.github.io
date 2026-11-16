// My melodies, from MIDI. Notes are [MIDI note, length in beats]. At 120 bpm one beat is 0.5s.
export const BEAT = 0.5;

// The desk keyboard: each click plays the next note, then it loops. (CF_Tones_Ah_A4_Falsetto_5.mid, up an octave)
export const DESK_MELODY: [number, number][] = [
  [55, 4], [57, 4], [60, 3], [62, 0.5], [60, 1.25], [55, 1.5], [67, 0.5], [65, 0.5],
  [69, 1.5], [67, 0.5], [65, 0.5], [62, 3], [60, 4], [62, 3], [65, 1], [67, 5],
];

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
