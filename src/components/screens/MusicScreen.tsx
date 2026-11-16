import { useEffect, useState, type SyntheticEvent } from 'react';
import { RELEASES, trackUrl, type Release } from '../../data';
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

function position(r: Release, tall: boolean) {
  const [rx, ry] = ring(r.orbit - 1, tall);
  const a = (r.angle * Math.PI) / 180;
  const c = center(tall);
  const [dx, dy] = flip(rx * Math.cos(a), ry * Math.sin(a), tall);
  return { left: c.x + dx - r.size / 2, top: c.y + dy - r.size / 2 };
}

function Planet({ r, tall, onPick }: { r: Release; tall: boolean; onPick: () => void }) {
  return (
    <button
      className="planet"
      style={{ ...position(r, tall), width: r.size, height: r.size, background: r.color }}
      onClick={onPick}
      aria-label={`${r.name}, ${r.kind.toLowerCase()}`}
    >
      {r.art ? <img src={r.art} alt="" draggable={false} onError={hideBroken} /> : <span className="mystery">?</span>}
      {r.ring && <span className="ring" />}
      <span className="planet-tag">{r.name} · {r.year === 'soon' ? 'COMING SOON' : `${r.kind} · ${r.year}`}</span>
    </button>
  );
}

function System({ pick }: { pick: (id: string) => void }) {
  const tall = usePortrait();
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
        <span className="sun" style={{ left: c.x - 48, top: c.y - 48, width: 96, height: 96, fontSize: 8, letterSpacing: 0 }}>MADEBIT</span>
        <span className="screen-note" style={{ position: 'absolute', left: 24, bottom: 18 }}>inner rings: oldest · outer rings: newest</span>
        {RELEASES.map((r) => <Planet key={r.id} r={r} tall={tall} onPick={() => { sfx.select(); pick(r.id); }} />)}
      </div>
    </Stage>
  );
}

function ReleaseVideos({ videos }: { videos: NonNullable<Release['videos']> }) {
  const [i, setI] = useState(0);
  const v = videos[i];
  const flip = (d: number) => { sfx.select(); setI((i + d + videos.length) % videos.length); };
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      <span className="screen-note">sneak peeks · {i + 1}/{videos.length}</span>
      <div className="video-frame" style={{ minHeight: 0, aspectRatio: '16 / 9', flex: 'none' }}>
        <iframe key={v.embed} src={v.embed} title={v.title} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
      </div>
      <div className="video-controls">
        <button className="btn-solid" onClick={() => flip(-1)} aria-label="Previous video">&lt;</button>
        <span className="screen-copy" style={{ flex: 1, fontSize: 13 }}>{v.title}</span>
        <button className="btn-solid" onClick={() => flip(1)} aria-label="Next video">&gt;</button>
      </div>
    </div>
  );
}

// A release's page reads like liner notes: the cover and links, a line in my words, a little about it,
// the tracklist (each song links to its Bandcamp page), then any videos.
function ReleaseView({ r, back }: { r: Release; back: () => void }) {
  const links = LINK_LABELS.filter(([k]) => r.links[k]);
  const single = r.tracks.length === 1;
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
      {r.tracks.length > 0 && !single && (
        <section>
          <h3 className="liner-label">TRACKLIST</h3>
          <ol className="tracks">
            {r.tracks.map((t, i) => {
              const url = trackUrl(r, t);
              return (
                <li key={i}>
                  <a className="track" href={url} target="_blank" rel="noreferrer" aria-label={`${t} on Bandcamp`}>
                    <span className="track-n">{String(i + 1).padStart(2, '0')}</span>
                    <span className="track-title">{t}</span>
                    <span className="track-go" aria-hidden="true">LISTEN &gt;</span>
                  </a>
                </li>
              );
            })}
          </ol>
        </section>
      )}
      {r.tracks.length === 0 && <p className="screen-copy">Still being made. Check the MAILBOX cartridge to hear it first.</p>}
      {r.videos && r.videos.length > 0 && (
        <section>
          <h3 className="liner-label">VIDEOS</h3>
          <ReleaseVideos videos={r.videos} />
        </section>
      )}
    </div>
  );
}

export default function MusicScreen() {
  const [sel, setSel] = useState<string | null>(null);
  const r = RELEASES.find((x) => x.id === sel);
  return r ? <ReleaseView r={r} back={() => setSel(null)} /> : <System pick={setSel} />;
}
