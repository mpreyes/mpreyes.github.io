// Listens to an <audio> element and calls onBeat on each kick/bass hit,
// so things on the desk can dance in time with the song.
export interface BeatTracker {
  start: () => void;
  stop: () => void;
}

export function trackBeats(el: HTMLAudioElement, onBeat: (strength: number) => void): BeatTracker | null {
  const AC = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!AC) return null;
  const ctx = new AC();
  const analyser = ctx.createAnalyser();
  analyser.fftSize = 1024;
  analyser.smoothingTimeConstant = 0.6;
  // the song plays through the analyser so we can hear it and measure it
  ctx.createMediaElementSource(el).connect(analyser);
  analyser.connect(ctx.destination);

  const bins = new Uint8Array(analyser.frequencyBinCount);
  let avg = 0;
  let last = 0;
  let raf = 0;
  const loop = () => {
    analyser.getByteFrequencyData(bins);
    // bass energy: roughly 40 to 260 Hz
    let e = 0;
    for (let i = 1; i < 7; i++) e += bins[i];
    e /= 6;
    const now = performance.now();
    if (e > avg * 1.15 && e > 110 && now - last > 260) {
      last = now;
      onBeat(Math.min(1, e / 255));
    }
    avg = avg * 0.9 + e * 0.1;
    raf = requestAnimationFrame(loop);
  };
  return {
    start: () => { void ctx.resume(); if (!raf) loop(); },
    stop: () => { cancelAnimationFrame(raf); raf = 0; },
  };
}
