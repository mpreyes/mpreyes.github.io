// Finds the kicks in a song ahead of time, then fires onBeat in sync while it plays,
// so the little me on the desk dances in time.
//
// How: decode the MP3, low-pass it (just the kick + bass), measure loudness every 10 ms,
// and mark the moments it suddenly jumps (onsets). Keep at most one every ~0.4 s so she
// dances on the beat instead of every hi-hat.
export interface Beat { t: number; strength: number }

export async function findBeats(url: string): Promise<Beat[]> {
  const AC = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!AC || typeof OfflineAudioContext === 'undefined') return [];
  const bytes = await (await fetch(url)).arrayBuffer();
  const ctx = new AC();
  const song = await ctx.decodeAudioData(bytes);
  void ctx.close();

  const sr = 22050;
  const off = new OfflineAudioContext(1, Math.ceil(song.duration * sr), sr);
  const src = off.createBufferSource();
  src.buffer = song;
  const lp = off.createBiquadFilter();
  lp.type = 'lowpass';
  lp.frequency.value = 150;
  src.connect(lp).connect(off.destination);
  src.start();
  const low = (await off.startRendering()).getChannelData(0);

  const hop = Math.floor(sr * 0.01); // 10 ms
  const n = Math.floor(low.length / hop);
  const env = new Float32Array(n);
  for (let i = 0; i < n; i++) {
    let sum = 0;
    for (let j = i * hop; j < (i + 1) * hop; j++) sum += low[j] * low[j];
    env[i] = Math.sqrt(sum / hop);
  }
  const flux = new Float32Array(n);
  for (let i = 1; i < n; i++) flux[i] = Math.max(0, env[i] - env[i - 1]);

  // adaptive threshold: twice the average jump over the surrounding half second
  const W = 50;
  const prefix = new Float32Array(n + 1);
  for (let i = 0; i < n; i++) prefix[i + 1] = prefix[i] + flux[i];
  let max = 0;
  for (let i = 0; i < n; i++) max = Math.max(max, flux[i]);

  const beats: Beat[] = [];
  let lastIdx = -Infinity;
  for (let i = 1; i < n - 1; i++) {
    const a = Math.max(0, i - W / 2);
    const b = Math.min(n, i + W / 2);
    const th = ((prefix[b] - prefix[a]) / (b - a)) * 2 + 1e-4;
    const peak = flux[i] > th && flux[i] >= flux[i - 1] && flux[i] >= flux[i + 1];
    if (peak && i - lastIdx >= 40) {
      beats.push({ t: i * 0.01, strength: max ? Math.min(1, (flux[i] / max) * 2.5) : 0.5 });
      lastIdx = i;
    }
  }
  return beats;
}

export interface BeatFollower { start: () => void; stop: () => void }

/** Fires onBeat whenever the audio's playhead passes the next beat. */
export function followBeats(el: HTMLAudioElement, beats: Beat[], onBeat: (strength: number) => void): BeatFollower {
  let raf = 0;
  let i = 0;
  const loop = () => {
    const now = el.currentTime;
    while (i < beats.length && beats[i].t <= now) {
      if (now - beats[i].t < 0.15) onBeat(beats[i].strength); // skip stale beats after a seek
      i++;
    }
    raf = requestAnimationFrame(loop);
  };
  return {
    start: () => {
      i = beats.findIndex((b) => b.t >= el.currentTime);
      if (i < 0) i = beats.length;
      cancelAnimationFrame(raf);
      loop();
    },
    stop: () => { cancelAnimationFrame(raf); raf = 0; },
  };
}
