import { useEffect, useRef, useState, type SyntheticEvent } from 'react';
import { RELEASES, spotifyTrackUrl, trackUrl, type Release } from '../../data';
import { sfx } from '../../sound';
import Stage from '../Stage';

const LINK_LABELS: [keyof Release['links'], string][] = [
  ['spotify', 'SPOTIFY'],
  ['apple', 'APPLE MUSIC'],
  ['bandcamp', 'BANDCAMP'],
  ['soundcloud', 'SOUNDCLOUD'],
  ['youtube', 'YOUTUBE'],
];

// If a cover can't load, fall back to the planet's color instead of a broken-image icon.
const hideBroken = (e: SyntheticEvent<HTMLImageElement>) => { e.currentTarget.style.display = 'none'; };

// The solar system is drawn in a 700x470 scene with the sun at its center.
const CENTER = { x: 350, y: 245 };
// Ring radii (x, y), innermost first. Inner rings hold the oldest releases.
const RINGS: [number, number][] = [[90, 90], [150, 120], [230, 165], [315, 205]];
// On an upright phone the rings are a little wider than a straight swap, so the system fills the screen.
const RINGS_TALL: [number, number][] = [[90, 96], [150, 140], [230, 180], [315, 212]];
const ring = (i: number, tall: boolean) => (tall ? RINGS_TALL : RINGS)[i];

// On a phone held upright the whole system is turned on its side (x and y swapped), so the orbits run tall.
const PORTRAIT = '(max-width: 960px) and (orientation: portrait)';
function usePortrait() {
  const [on, setOn] = useState(() => window.matchMedia(PORTRAIT).matches);
  useEffect(() => {
    const mq = window.matchMedia(PORTRAIT);
    const f = () => setOn(mq.matches);
    mq.addEventListener('change', f);
    return () => mq.removeEventListener('change', f);
  }, []);
  return on;
}

// Center of the scene and a point's offset from it, flipped when the phone is upright.
const center = (tall: boolean) => (tall ? { x: CENTER.y - 10, y: 375 } : CENTER);
const flip = (dx: number, dy: number, tall: boolean) => (tall ? [dy, dx] : [dx, dy]);

function position(r: Release, tall: boolean, lap = 0) {
  const [rx, ry] = ring(r.orbit - 1, tall);
  const a = ((r.angle + lap) * Math.PI) / 180;
  const c = center(tall);
  const [dx, dy] = flip(rx * Math.cos(a), ry * Math.sin(a), tall);
  return { left: c.x + dx - r.size / 2, top: c.y + dy - r.size / 2 };
}

function Planet({ r, tall, lap, onPick }: { r: Release; tall: boolean; lap: number; onPick: () => void }) {
  return (
    <button
      className="planet"
      style={{ ...position(r, tall, lap), width: r.size, height: r.size, background: r.color }}
      onClick={onPick}
      aria-label={`${r.name}, ${r.kind.toLowerCase()}`}
    >
      {r.art ? <img src={r.art} alt="" draggable={false} onError={hideBroken} /> : <span className="mystery">?</span>}
      {r.ring && <span className="ring" />}
      <span className="planet-tag">{r.name} · {r.year === 'soon' ? 'COMING SOON' : `${r.kind} · ${r.year}`}</span>
    </button>
  );
}

// The hidden song: drop secret-song.mp3 (or .wav) into public/ and it's waiting behind the supernova.
const SECRET_FILES = ['secret-song.mp3', 'secret-song.wav'];
function useSecretSong() {
  const [url, setUrl] = useState<string | null>(null);
  useEffect(() => {
    let on = true;
    (async () => {
      for (const f of SECRET_FILES) {
        try {
          const res = await fetch(f, { method: 'HEAD' });
          if (res.ok && !(res.headers.get('content-type') ?? '').includes('text/html')) { if (on) setUrl(f); return; }
        } catch { /* not there */ }
      }
    })();
    return () => { on = false; };
  }, []);
  return url;
}

// Tap the sun: it spins and every planet takes a lap. Tap it 5 times fast and it goes supernova.
function useSun() {
  const [lap, setLap] = useState(0);
  const [spins, setSpins] = useState(0);
  const [nova, setNova] = useState<'off' | 'boom' | 'secret'>('off');
  const taps = useRef<number[]>([]);
  const raf = useRef(0);
  useEffect(() => () => cancelAnimationFrame(raf.current), []);
  const tap = () => {
    if (nova !== 'off') return;
    const now = performance.now();
    taps.current = [...taps.current.filter((t) => now - t < 2500), now];
    if (taps.current.length >= 5) {
      taps.current = [];
      sfx.supernova();
      setNova('boom');
      window.setTimeout(() => setNova('secret'), 1400);
      return;
    }
    sfx.whoosh();
    setSpins((n) => n + 1);
    // one lap around the orbits, easing in and out
    cancelAnimationFrame(raf.current);
    const t0 = now;
    const DUR = 1600;
    const step = (t: number) => {
      const p = Math.min(1, (t - t0) / DUR);
      setLap(360 * (p < 0.5 ? 2 * p * p : 1 - (-2 * p + 2) ** 2 / 2));
      if (p < 1) raf.current = requestAnimationFrame(step);
      else setLap(0);
    };
    raf.current = requestAnimationFrame(step);
  };
  return { lap, spins, nova, tap, close: () => setNova('off') };
}

function System({ pick }: { pick: (id: string) => void }) {
  const tall = usePortrait();
  const sun = useSun();
  const secret = useSecretSong();
  const c = center(tall);
  const W = tall ? 470 : 700;
  const H = tall ? 740 : 470;
  const STARS = [[40, 300], [620, 70], [660, 420], [130, 40], [520, 450], [680, 150]];
  return (
    <Stage w={W} h={H}>
      <div className="system">
        <span className="screen-heading" style={{ position: 'absolute', left: 24, top: 22 }}>THE MADEBIT SYSTEM</span>
        <span className="screen-note" style={{ position: 'absolute', right: 24, top: tall ? 44 : 22 }}>pick a planet</span>
        {STARS.map(([x, y], i) => (
          <span key={i} className={`star ${i % 2 ? 'twinkle' : ''}`} style={tall ? { left: y, top: x } : { left: x, top: y }} />
        ))}
        {RINGS.map((_, i) => ring(i, tall)).map(([rx, ry], i) => (
          <span
            key={i}
            className="orbit"
            style={{ left: c.x, top: c.y, width: (tall ? ry : rx) * 2, height: (tall ? rx : ry) * 2, borderStyle: i === RINGS.length - 1 ? 'dotted' : 'dashed' }}
          />
        ))}
        <button
          className={`sun ${sun.nova === 'boom' ? 'nova' : ''}`}
          style={{ left: c.x - 48, top: c.y - 48, width: 96, height: 96, fontSize: 8, letterSpacing: 0, transform: `rotate(${sun.spins * 360}deg)` }}
          onClick={sun.tap}
          aria-label="the sun"
        >MADEBIT</button>
        <span className="screen-note" style={{ position: 'absolute', left: 24, bottom: 18 }}>inner rings: oldest · outer rings: newest</span>
        {RELEASES.map((r) => <Planet key={r.id} r={r} tall={tall} lap={sun.lap} onPick={() => { sfx.select(); pick(r.id); }} />)}
        {sun.nova === 'boom' && <span className="nova-flash" aria-hidden="true" />}
        {sun.nova === 'secret' && (
          <div className="secret-box" role="dialog" aria-label="you found a secret">
            <span className="screen-heading">YOU FOUND A SECRET</span>
            {secret ? (
              <>
                <p className="screen-copy">a song that isn't anywhere else. it's yours.</p>
                <a className="btn-solid" href={secret} download>DOWNLOAD IT</a>
              </>
            ) : (
              <p className="screen-copy">a hidden song lives here... it's not ready yet. come back soon.</p>
            )}
            <button className="btn-outline" onClick={sun.close}>BACK TO SPACE</button>
          </div>
        )}
      </div>
    </Stage>
  );
}

function ReleaseVideos({ videos, teasers }: { videos: NonNullable<Release['videos']>; teasers: boolean }) {
  const [i, setI] = useState(0);
  const v = videos[i];
  const flip = (d: number) => { sfx.select(); setI((i + d + videos.length) % videos.length); };
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {(teasers || videos.length > 1) && <span className="screen-note">{teasers ? 'sneak peeks · ' : ''}{i + 1}/{videos.length}</span>}
      <div
        className="video-frame"
        style={v.vertical
          ? { minHeight: 0, flex: 'none', aspectRatio: '9 / 16', width: 'min(100%, 240px)', alignSelf: 'center' }
          : { minHeight: 0, flex: 'none', aspectRatio: '16 / 9' }}
      >
        <iframe key={v.embed} src={v.embed} title={v.title} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
      </div>
      <div className="video-controls">
        {videos.length > 1 && <button className="btn-solid" onClick={() => flip(-1)} aria-label="Previous video">&lt;</button>}
        <span className="screen-copy" style={{ flex: 1, fontSize: 13, textAlign: videos.length > 1 ? undefined : 'center' }}>{v.title}</span>
        {videos.length > 1 && <button className="btn-solid" onClick={() => flip(1)} aria-label="Next video">&gt;</button>}
      </div>
    </div>
  );
}

// A release's page reads like liner notes: the cover and links, a line in my words, a little about it,
// the tracklist (each song links to its Bandcamp page), then any videos.
function ReleaseView({ r, back }: { r: Release; back: () => void }) {
  const links = LINK_LABELS.filter(([k]) => r.links[k]);
  const single = r.tracks.length === 1;
  const [revealed, setRevealed] = useState(false);
  return (
    <div className="screen-pad release">
      <button className="btn-outline" onClick={back}>&lt; BACK TO SYSTEM</button>
      <div className="release-head">
        <div className="release-art" style={{ background: r.color }}>
          {r.art ? <img src={r.art} alt={`${r.name} cover art`} onError={hideBroken} /> : <span className="mystery">?</span>}
        </div>
        <div className="release-meta">
          <span className="eyebrow">{r.kind}{r.year !== 'soon' ? ` · ${r.year}` : ''}</span>
          <h2 className="release-name">{r.name}</h2>
          {links.length > 0 && (
            <div className="pills">
              {links.map(([k, label]) => (
                <a key={k} className={`pill pill-${k}`} href={r.links[k]} target="_blank" rel="noreferrer">{label}</a>
              ))}
            </div>
          )}
        </div>
      </div>
      {r.quote && <blockquote className="liner-quote">{r.quote}</blockquote>}
      {r.about && <p className="screen-copy liner-about">{r.about}</p>}
      {r.tracks.length > 0 && (
        <section>
          <h3 className="liner-label">{single ? 'TRACK' : 'TRACKLIST'}</h3>
          <ol className="tracks">
            {r.tracks.map((t, i) => {
              const sp = spotifyTrackUrl(r, i);
              const bc = trackUrl(r, t);
              return (
                <li key={i} className="track">
                  <span className="track-n">{String(i + 1).padStart(2, '0')}</span>
                  {r.trackColors && (
                    <span
                      className={`track-dot ${revealed ? 'on' : ''}`}
                      style={revealed ? { background: r.trackColors[i], transitionDelay: `${i * 0.25}s` } : undefined}
                      aria-label={revealed ? `color ${r.trackColors[i]}` : 'color hidden'}
                    >{revealed ? '' : '?'}</span>
                  )}
                  <span className="track-title">{t}</span>
                  <span className="track-links">
                    {sp && <a className="track-go spotify" href={sp} target="_blank" rel="noreferrer" aria-label={`${t} on Spotify`}>SPOTIFY</a>}
                    {bc && <a className="track-go" href={bc} target="_blank" rel="noreferrer" aria-label={`${t} on Bandcamp`}>BANDCAMP</a>}
                  </span>
                </li>
              );
            })}
          </ol>
          {r.trackColors && !revealed && (
            <button className="btn-outline reveal-btn" onClick={() => { sfx.insert(); setRevealed(true); }}>REVEAL THE COLORS</button>
          )}
          {r.credits && <p className="screen-note liner-credits">{r.credits}</p>}
        </section>
      )}
      {r.tracks.length === 0 && <p className="screen-copy">Still being made. Check the MAILBOX cartridge to hear it first.</p>}
      {r.videos && r.videos.length > 0 && (
        <section>
          <h3 className="liner-label">VIDEOS</h3>
          <ReleaseVideos videos={r.videos} teasers={r.kind === 'COMING SOON'} />
        </section>
      )}
    </div>
  );
}

export default function MusicScreen() {
  const [sel, setSel] = useState<string | null>(null);
  const r = RELEASES.find((x) => x.id === sel);
  return r ? <ReleaseView key={r.id} r={r} back={() => setSel(null)} /> : <System pick={setSel} />;
}
