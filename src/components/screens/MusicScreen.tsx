import { useState, type SyntheticEvent } from 'react';
import { RELEASES, type Release } from '../../data';
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

function position(r: Release) {
  const [rx, ry] = RINGS[r.orbit - 1];
  const a = (r.angle * Math.PI) / 180;
  return { left: CENTER.x + rx * Math.cos(a) - r.size / 2, top: CENTER.y + ry * Math.sin(a) - r.size / 2 };
}

function Planet({ r, onPick }: { r: Release; onPick: () => void }) {
  return (
    <button
      className="planet"
      style={{ ...position(r), width: r.size, height: r.size, background: r.color }}
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
  return (
    <Stage w={700} h={470}>
      <div className="system">
        <span className="screen-heading" style={{ position: 'absolute', left: 24, top: 22 }}>THE MADEBIT SYSTEM</span>
        <span className="screen-note" style={{ position: 'absolute', right: 24, top: 22 }}>pick a planet</span>
        {[[40, 300], [620, 70], [660, 420], [130, 40], [520, 450], [680, 150]].map(([x, y], i) => (
          <span key={i} className={`star ${i % 2 ? 'twinkle' : ''}`} style={{ left: x, top: y }} />
        ))}
        {RINGS.map(([rx, ry], i) => (
          <span key={i} className="orbit" style={{ width: rx * 2, height: ry * 2, borderStyle: i === RINGS.length - 1 ? 'dotted' : 'dashed' }} />
        ))}
        <span className="sun" style={{ left: 302, top: 197, width: 96, height: 96, fontSize: 8, letterSpacing: 0 }}>MADEBIT</span>
        <span className="screen-note" style={{ position: 'absolute', left: 24, bottom: 18 }}>inner rings: oldest · outer rings: newest</span>
        {RELEASES.map((r) => <Planet key={r.id} r={r} onPick={() => { sfx.select(); pick(r.id); }} />)}
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

function ReleaseView({ r, back }: { r: Release; back: () => void }) {
  const links = LINK_LABELS.filter(([k]) => r.links[k]);
  return (
    <div className="screen-pad release">
      <button className="btn-outline" onClick={back}>&lt; BACK TO SYSTEM</button>
      <div className="release-head">
        <div className="release-art" style={{ background: r.color }}>
          {r.art ? <img src={r.art} alt={`${r.name} cover art`} onError={hideBroken} /> : <span className="mystery">?</span>}
        </div>
        <div className="release-meta">
          <span className="eyebrow">{r.kind}</span>
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
      {r.tracks.length > 0 ? (
        <ol className="tracks">
          {r.tracks.map((t, i) => (
            <li key={i} className="track">
              <span className="track-n">{String(i + 1).padStart(2, '0')}</span>
              <span className="track-title">{t}</span>
              {r.bonus && (
                <span className="track-bonus">
                  <a className="pill pill-ghost-gold" href={r.links.bandcamp} target="_blank" rel="noreferrer" title="Instrumental, name your price">INST $1+</a>
                  <a className="pill pill-ghost-pink" href={r.links.bandcamp} target="_blank" rel="noreferrer" title="A cappella, name your price">ACAP $1+</a>
                </span>
              )}
            </li>
          ))}
        </ol>
      ) : (
        <p className="screen-copy">Still being made. Check the MAILBOX cartridge to hear it first.</p>
      )}
      {r.videos && r.videos.length > 0 && <ReleaseVideos videos={r.videos} />}
      {r.bonus && <p className="screen-note">instrumentals + a cappellas are name-your-price on bandcamp</p>}
    </div>
  );
}

export default function MusicScreen() {
  const [sel, setSel] = useState<string | null>(null);
  const r = RELEASES.find((x) => x.id === sel);
  return r ? <ReleaseView r={r} back={() => setSel(null)} /> : <System pick={setSel} />;
}
