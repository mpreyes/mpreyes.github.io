import { useEffect, useRef, useState, type CSSProperties } from 'react';
import Sprite from '../Sprite';
import { sfx } from '../../sound';
import { BIO, EMAIL, EPK_URL, STATEMENT } from '../../data';

const quote: CSSProperties = { margin: 0, padding: '12px 0 12px 16px', borderLeft: '4px solid var(--pink)', display: 'flex', flexDirection: 'column', gap: 8 };
const quoteLine: CSSProperties = { margin: 0, fontSize: 13, lineHeight: 1.6, fontStyle: 'italic', color: '#D8D2C4' };

export default function AboutScreen() {
  const [dancing, setDancing] = useState(false);
  const timer = useRef<number>();
  useEffect(() => () => clearTimeout(timer.current), []);
  const dance = () => {
    sfx.dance();
    setDancing(true);
    clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setDancing(false), 1500);
  };
  return (
    <div className="screen-pad about" style={{ justifyContent: 'flex-start', padding: 28 }}>
      <h2 className="screen-heading big gold">PLAYER 1</h2>
      <div className="about-row">
        <button className={`dance-btn ${dancing ? 'dancing' : ''}`} onClick={dance} aria-label="Make madebit dance" title="click me">
          <Sprite size={80} className={dancing ? '' : 'bob'} />
        </button>
        <dl className="stats">
          <dt>CLASS</dt><dd>songwriter / producer</dd>
          <dt>HOME BASE</dt><dd>Nashville, TN</dd>
          <dt>SPECIAL MOVE</dt><dd>thumpy music</dd>
          <dt>STATS</dt><dd>curious 99 · silly 99</dd>
        </dl>
      </div>
      {BIO.map((p, i) => <p key={i} className="screen-copy" style={{ maxWidth: 'none' }}>{p}</p>)}
      <blockquote style={quote}>
        <span className="eyebrow">IN MY WORDS</span>
        {STATEMENT.map((p, i) => <p key={i} style={quoteLine}>{p}</p>)}
      </blockquote>
      <div className="pills">
        {__HAS_EPK__ && <a className="pill pill-lime" href={EPK_URL} download>DOWNLOAD PRESS KIT</a>}
        <a className="pill pill-bandcamp" href={`mailto:${EMAIL}`}>EMAIL ME</a>
      </div>
    </div>
  );
}
