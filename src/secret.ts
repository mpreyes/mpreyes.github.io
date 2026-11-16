import { useEffect, useState } from 'react';

// The hidden song: drop secret-song.mp3 (or .wav) into public/ and it shows up behind the
// sun's supernova and in the desk drawer (once you've played the tune on the string lights).
const SECRET_FILES = ['secret-song.mp3', 'secret-song.wav'];

let found: Promise<string | null> | null = null;
function findSecret() {
  found ??= (async () => {
    for (const f of SECRET_FILES) {
      try {
        const res = await fetch(f, { method: 'HEAD' });
        if (res.ok && !(res.headers.get('content-type') ?? '').includes('text/html')) return f;
      } catch { /* not there */ }
    }
    return null;
  })();
  return found;
}

export function useSecretSong() {
  const [url, setUrl] = useState<string | null>(null);
  useEffect(() => {
    let on = true;
    void findSecret().then((f) => { if (on) setUrl(f); });
    return () => { on = false; };
  }, []);
  return url;
}
