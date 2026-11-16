// My melody for the desk keyboard: each click plays the next note, then it loops.
// From MIDI_Audio.mid: [MIDI note, length in 8th notes].
export const MELODY: [number, number][] = [
  [62, 1], [60, 1], [62, 1], [60, 1], [62, 1], [65, 1], [61, 1], [60, 1],
  [62, 1], [60, 1], [62, 1], [60, 1], [62, 1], [67, 1], [61, 1], [60, 1],
  [62, 1], [60, 1], [62, 1], [60, 1], [62, 1], [65, 1], [61, 1], [60, 1],
  [62, 1], [60, 1], [55, 1], [55, 1], [58, 2], [58, 2],
];

const LOW = Math.min(...MELODY.map(([n]) => n));
const HIGH = Math.max(...MELODY.map(([n]) => n));

export const noteHz = (n: number) => 440 * 2 ** ((n - 69) / 12);

/** which of the desk keyboard's `keys` keys lights up for a note (low notes on the left) */
export const keyFor = (n: number, keys: number) => Math.round(((n - LOW) / (HIGH - LOW || 1)) * (keys - 1));
