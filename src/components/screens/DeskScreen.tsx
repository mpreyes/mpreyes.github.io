import { useEffect, useRef, useState, type ReactNode, type CSSProperties, type ButtonHTMLAttributes } from 'react';
import type { CartId } from '../../data';
import { sfx } from '../../sound';
import Sprite from '../Sprite';
import Stage from '../Stage';

type Cookie = 'fresh' | 'soggy' | 'eaten';
const LIGHTS = Array.from({ length: 14 }, (_, i) => ({
  x: 20 + i * 48,
  y: 20 + (i % 2) * 4,
  c: ['#F2B84B', '#F77FA1', '#9DBE3D', '#93C78E'][i % 4],
  twinkle: i % 3 === 0,
}));

function Obj({ label, onClick, className = '', style, children, ...rest }: {
  label: string;
  onClick?: () => void;
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
} & ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button className={`desk-obj ${className}`} style={style} onClick={onClick} aria-label={label} {...rest}>
      {children}
      <span className="desk-tag">{label.split(':')[0]}</span>
    </button>
  );
}

export default function DeskScreen({ go }: { go: (id: CartId) => void }) {
  const [cookies, setCookies] = useState<Cookie[]>(['fresh', 'fresh', 'fresh']);
  const [held, setHeld] = useState<number | null>(null); // cookie picked up (tap or drag)
  const [dunking, setDunking] = useState(false);
  const [sips, setSips] = useState(0);
  const [toast, setToast] = useState<string | null>(null);
  const timers = useRef<number[]>([]);

  useEffect(() => () => timers.current.forEach(clearTimeout), []);
  const later = (fn: () => void, ms: number) => { timers.current.push(window.setTimeout(fn, ms)); };
  const say = (t: string) => setToast(t);

  const dunk = (i: number) => {
    if (cookies[i] === 'eaten') return;
    sfx.dunk();
    setHeld(null);
    setDunking(true);
    say('dunk!');
    setCookies((c) => c.map((s, n) => (n === i ? 'soggy' : s)));
    later(() => { setDunking(false); say('perfectly soggy. click it to eat'); }, 1100);
  };

  const sip = () => {
    if (held !== null) { dunk(held); return; }
    sfx.sip();
    const n = sips + 1;
    if (n >= 4) {
      say('all gone. refilled.');
      setSips(4);
      later(() => setSips(0), 700);
    } else {
      setSips(n);
      say(['sip. warm & fuzzy', 'sip. still hot', 'sip. that hits'][n - 1]);
    }
  };

  const tapCookie = (i: number) => {
    const st = cookies[i];
    if (st === 'soggy' || held === i) {
      sfx.crunch();
      setHeld(null);
      setCookies((c) => c.map((s, n) => (n === i ? 'eaten' : s)));
      say(st === 'soggy' ? 'mmm. soggy perfection' : 'crunch. try dunking one next time');
      return;
    }
    sfx.select();
    setHeld(i);
    say('now drop it in the mug (or tap me again to eat)');
  };

  const allGone = cookies.every((c) => c === 'eaten');
  const coffeeH = Math.max(4, 14 - Math.min(sips, 3) * 3);

  return (
    <Stage w={700} h={470}>
      <div className="desk">
        <span className="screen-heading desk-title">MY DESK · click around</span>
        <span className="wire" />
        {LIGHTS.map((l, i) => (
          <span key={i} className={`bulb ${l.twinkle ? 'twinkle' : ''}`} style={{ left: l.x, top: l.y, background: l.c }} />
        ))}

        <div className="postcard">
          <span className="pc-pic"><span /><i /></span>
          <span className="pc-stamp" />
          <span className="pc-text">GREETINGS<br />FROM SPACE</span>
          <span className="tape-strip" />
        </div>

        <div className="cork">
          <span className="polaroid p1"><span /></span>
          <Obj label="about me: polaroid" className="polaroid p2" onClick={() => go('about')}>
            <span className="polaroid-pic"><Sprite size={28} /></span>
          </Obj>
          <span className="polaroid p3"><span /></span>
          <Obj label="mailbox: pinned letter" className="pinned-letter" onClick={() => go('mailbox')} />
          <span className="note-card">tour dates: [TBD]</span>
          <span className="pin" style={{ left: 112, top: 2, background: '#C8332D' }} />
          <span className="pin" style={{ left: 30, top: 8, background: '#F2B84B' }} />
          <span className="pin" style={{ left: 190, top: 10, background: '#187489' }} />
        </div>

        <div className="window"><span className="moon" /><span className="wstar" style={{ left: 24, top: 28 }} /><span className="wstar" style={{ left: 66, top: 70 }} /><span className="mullion" /></div>
        <span className="sticky">finish the album!!</span>

        <span className="desktop-surface" />
        <span className="desk-leg" style={{ left: 60 }} />
        <span className="desk-leg" style={{ right: 60 }} />

        <Obj label="videos: speaker" className="speaker" onClick={() => go('videos')}>
          <span className="cone small" /><span className="cone big" />
        </Obj>

        <div
          className="mug-zone"
          onDragOver={(e) => { if (e.dataTransfer.types.includes('application/x-madebit-cookie')) e.preventDefault(); }}
          onDrop={(e) => { e.preventDefault(); const i = Number(e.dataTransfer.getData('application/x-madebit-cookie')); if (!Number.isNaN(i)) dunk(i); }}
        >
          {sips < 3 && (<><span className="steam" /><span className="steam s2" /></>)}
          <Obj label="sip: coffee" className={`mug ${held !== null ? 'is-target' : ''}`} onClick={sip}>
            <span className="mug-body" />
            <span className="mug-handle" />
            <span className="mug-coffee" style={{ height: coffeeH, top: 14 + (14 - coffeeH) }} />
            <span className="mug-mark">MB</span>
          </Obj>
          {dunking && <span className="dunking-cookie" />}
        </div>

        <Obj label="music: laptop" className="laptop" onClick={() => go('music')}>
          <span className="lid"><span className="bars"><i className="bob" /><i /><i className="bob" /><i /><i className="bob" /></span></span>
          <span className="base" />
        </Obj>

        <Sprite size={48} className="desk-sprite" />

        <Obj label="item shop: headphones" className="headphones" onClick={() => go('shop')}>
          <span className="band" /><span className="cup l" /><span className="cup r" />
        </Obj>

        <span className="plate" />
        {cookies.map((st, i) =>
          st === 'eaten' ? null : (
            <Obj
              key={i}
              label={st === 'soggy' ? 'eat me: soggy cookie' : 'dunk me: cookie'}
              className={`cookie ${st} ${held === i ? 'held' : ''}`}
              style={{ left: 586 + i * 24, top: 292 - (i % 2) * 6 }}
              onClick={() => tapCookie(i)}
              draggable
              onDragStart={(e) => { e.dataTransfer.setData('application/x-madebit-cookie', String(i)); setHeld(i); }}
              onDragEnd={() => setHeld((h) => (h === i ? null : h))}
            >
              <span className="chip" style={{ left: 8, top: 8 }} /><span className="chip" style={{ left: 18, top: 16 }} />
            </Obj>
          ),
        )}
        {allGone && (
          <Obj label="bake more: cookies" className="more" onClick={() => { setCookies(['fresh', 'fresh', 'fresh']); say('fresh batch!'); }}>more?</Obj>
        )}

        <Obj label="play me: keyboard" className="keys" onClick={() => { sfx.note(); say('you played a note. thumpy.'); }}>
          {Array.from({ length: 10 }, (_, i) => <i key={i} />)}
        </Obj>

        <span className="tip">tip: dunk a cookie</span>
        {toast && <div className="toast" role="status">{toast}</div>}
      </div>
    </Stage>
  );
}
