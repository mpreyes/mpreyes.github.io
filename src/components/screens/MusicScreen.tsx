import { useState } from 'react';
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

function Planet({ r, onPick }: { r: Release; onPick: () => void }) {
  return (
    <button
      className="planet"
      style={{ left: r.x, top: r.y, width: r.size, height: r.size, background: r.color }}
      onClick={onPick}
      aria-label={`${r.name}, ${r.kind.toLowerCase()}`}
    >
      {r.art ? <img src={r.art} alt="" draggable={false} /> : <span className="mystery">?</span>}
      {r.ring && <span className="ring" />}
      <span className="planet-tag">{r.name} · {r.kind}</span>
    </button>
  );
}

function System({ pick }: { pick: (id: string) => void }) {
  return (
    <Stage w={700} h={470}>
      <div className="system">
        <span className="screen-heading" style={{ position: 'absolute', left: 24, top: 22 }}>THE MADEBIT SYSTEM</span>
        <span className="screen-note" style={{ position: 'absolute', right: 24, top: 22 }}>pick a planet</span>
        {[[60, 340], [620, 90], [600, 420], [110, 60], [300, 430], [660, 250]].map(([x, y], i) => (
          <span key={i} className={`star ${i % 2 ? 'twinkle' : ''}`} style={{ left: x, top: y }} />
        ))}
        <span className="orbit" style={{ width: 200, height: 200 }} />
        <span className="orbit" style={{ width: 380, height: 340 }} />
        <span className="orbit" style={{ width: 600, height: 440 }} />
        <span className="sun">MB</span>
        {RELEASES.map((r) => <Planet key={r.id} r={r} onPick={() => { sfx.select(); pick(r.id); }} />)}
      </div>
    </Stage>
  );
}

function ReleaseView({ r, back }: { r: Release; back: () => void }) {
  const links = LINK_LABELS.filter(([k]) => r.links[k]);
  return (
    <div className="screen-pad release">
      <button className="btn-outline" onClick={back}>&lt; BACK TO SYSTEM</button>
      <div className="release-head">
        <div className="release-art" style={{ background: r.color }}>
          {r.art ? <img src={r.art} alt={`${r.name} cover art`} /> : <span className="mystery">?</span>}
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
      {r.bonus && <p className="screen-note">instrumentals + a cappellas are name-your-price on bandcamp</p>}
    </div>
  );
}

export default function MusicScreen() {
  const [sel, setSel] = useState<string | null>(null);
  const r = RELEASES.find((x) => x.id === sel);
  return r ? <ReleaseView r={r} back={() => setSel(null)} /> : <System pick={setSel} />;
}
