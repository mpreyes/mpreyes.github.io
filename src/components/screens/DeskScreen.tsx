import { useEffect, useRef, useState, type ReactNode, type CSSProperties, type ButtonHTMLAttributes } from 'react';
import { DESK_SECRETS, GALLERY, type CartId } from '../../data';
import Lightbox from '../Lightbox';
import { sfx } from '../../sound';
import Sprite from '../Sprite';
import Ragdoll, { type RagdollHandle } from '../Ragdoll';
import LetterWindow from '../LetterWindow';
import Stage from '../Stage';
import { findBeats, followBeats, type BeatFollower } from '../../beat';
import { BEAT, DESK_MELODY, keyFor, noteHz } from '../../melody';
import { useSecretSong } from '../../secret';

type Cookie = 'fresh' | 'soggy' | 'eaten';
const TRACK_URL = 'speaker.mp3';
const TRACK_TITLE = 'phoney phonky business';
// The string lights are notes (a G scale, low to high). Play the start of the keyboard melody on them
// and they go rainbow, and the hidden song shows up in the drawer.
const BULB_NOTES = [55, 57, 60, 62, 65, 67, 69, 72, 74, 77, 79, 81, 84, 86];
const LIGHTS_TUNE = DESK_MELODY.slice(0, 5).map(([n]) => n);
const LIGHTS = Array.from({ length: 14 }, (_, i) => ({
  x: 20 + i * 48,
  y: 20 + (i % 2) * 4,
  c: ['#F2B84B', '#F77FA1', '#9DBE3D', '#93C78E'][i % 4],
  twinkle: i % 3 === 0,
}));

// A pinned photo: shows a thumbnail and opens the slideshow at that photo.
function Pinned({ i, className, open }: { i: number; className: string; open: (i: number) => void }) {
  const p = GALLERY[i];
  if (!p) return <span className={`polaroid ${className}`}><span /></span>;
  return (
    <button className={`desk-obj polaroid ${className}`} onClick={() => open(i)} aria-label={`photo: ${p.caption}`}>
      <img src={p.src} alt="" style={{ width: '100%', height: 40, objectFit: 'cover', display: 'block' }} />
      <span className="desk-tag">photos</span>
    </button>
  );
}

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
  const [photo, setPhoto] = useState<number | null>(null);
  const [letter, setLetter] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [step, setStep] = useState(0); // next note of the melody
  const [lit, setLit] = useState<number | null>(null); // keyboard key that's lit up
  const [glow, setGlow] = useState<number | null>(null); // string light that's glowing
  const [rainbow, setRainbow] = useState(false); // played the tune on the lights
  const played = useRef<number[]>([]);
  const [day, setDay] = useState(false);
  const [star, setStar] = useState(0); // bumps to send a shooting star across the window
  const [paper, setPaper] = useState<{ title: string; lines: string[] } | null>(null);
  const [drawer, setDrawer] = useState(false);
  const trashIdx = useRef(0);
  const secret = useSecretSong();
  const timers = useRef<number[]>([]);
  const me = useRef<RagdollHandle>(null);
  const track = useRef<HTMLAudioElement | null>(null);
  const beats = useRef<BeatFollower | null>(null);

  useEffect(() => () => { timers.current.forEach(clearTimeout); track.current?.pause(); beats.current?.stop(); }, []);
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
      sfx.munch();
      setHeld(null);
      setCookies((c) => c.map((s, n) => (n === i ? 'eaten' : s)));
      say(st === 'soggy' ? 'mmm. soggy perfection' : 'crunch. try dunking one next time');
      return;
    }
    sfx.select();
    setHeld(i);
    say('dunk it in the mug, or feed it to me!');
  };

  // feed the little me a cookie (dragged onto her, or picked up and then tap her)
  const feed = (i?: number) => {
    const n = i ?? held;
    if (n === null || cookies[n] === 'eaten') return;
    const soggy = cookies[n] === 'soggy';
    sfx.munch();
    setHeld(null);
    setCookies((c) => c.map((st, k) => (k === n ? 'eaten' : st)));
    me.current?.hop();
    say(soggy ? 'nom nom. soggy is her favorite' : 'nom nom nom');
  };

  // dropped the little me: if she lands in the mug, she drinks the coffee and gets the zoomies
  const dropped = (cx: number, cy: number) => {
    const inMug = cx > 54 && cx < 150 && cy > 220 && cy < 340;
    if (!inMug) return;
    if (sips >= 3) { say("the cup's empty! sip it to refill"); return; }
    sfx.slurp();
    setSips((n) => n + 1);
    me.current?.zoomies();
    say('she drank the coffee. uh oh.');
  };

  // the speaker plays a song (once there's an MP3 in the repo), otherwise opens MUSIC
  const speaker = () => {
    if (!__HAS_TRACK__) { go('music'); return; }
    if (!track.current) {
      track.current = new Audio(TRACK_URL);
      const el = track.current;
      el.addEventListener('ended', () => { setPlaying(false); beats.current?.stop(); });
      // the little me dances to the song's kicks (found once, in the background)
      findBeats(TRACK_URL)
        .then((list) => {
          beats.current = followBeats(el, list, (strength) => me.current?.beat(strength));
          if (!el.paused) beats.current.start();
        })
        .catch(() => {});
    }
    if (playing) { track.current.pause(); beats.current?.stop(); setPlaying(false); say('paused'); }
    else { void track.current.play(); beats.current?.start(); setPlaying(true); say(`now playing: ${TRACK_TITLE}`); }
  };

  // each click on the keyboard plays the next note of my melody, and lights its key
  const KEYS = 10;
  const playNote = () => {
    const [note, beats] = DESK_MELODY[step];
    sfx.melody(noteHz(note), beats * BEAT);
    const k = keyFor(DESK_MELODY, note, KEYS);
    setLit(k);
    later(() => setLit((cur) => (cur === k ? null : cur)), 220);
    const next = (step + 1) % DESK_MELODY.length;
    setStep(next);
    if (step === 0) say('that\'s my melody! keep clicking');
    else if (next === 0) say('that\'s the whole thing. again!');
  };

  // string lights: each bulb is a note
  const playBulb = (i: number) => {
    const n = BULB_NOTES[i];
    sfx.melody(noteHz(n), 0.35);
    setGlow(i);
    later(() => setGlow((g) => (g === i ? null : g)), 250);
    played.current = [...played.current, n].slice(-LIGHTS_TUNE.length);
    if (!rainbow && played.current.join() === LIGHTS_TUNE.join()) {
      setRainbow(true);
      later(() => { sfx.sparkle(); say('the lights know that tune... check the drawer'); }, 400);
    }
  };

  // the moon: flip night and day. At night a shooting star goes by now and then.
  useEffect(() => {
    if (day) return;
    const id = window.setInterval(() => setStar((n) => n + 1), 9000);
    return () => clearInterval(id);
  }, [day]);
  const catchStar = () => { sfx.sparkle(); setStar(0); say('you caught a shooting star. make a wish!'); };

  const openTrash = () => {
    sfx.crumple();
    const line = DESK_SECRETS.trash[trashIdx.current % DESK_SECRETS.trash.length];
    trashIdx.current += 1;
    setPaper({ title: 'crumpled_draft.txt', lines: [line] });
  };

  const allGone = cookies.every((c) => c === 'eaten');
  const coffeeH = Math.max(6, 32 - Math.min(sips, 3) * 8);

  return (
    <Stage w={700} h={470} pan>
      <div className={`desk ${day ? 'day' : ''}`}>
        <span className="wire" />
        {LIGHTS.map((l, i) => (
          <button
            key={i}
            className={`bulb ${l.twinkle ? 'twinkle' : ''} ${glow === i ? 'glow' : ''} ${rainbow ? 'rainbow' : ''}`}
            style={{ left: l.x, top: l.y, background: rainbow ? undefined : l.c, animationDelay: rainbow ? `${i * -0.12}s` : undefined }}
            onClick={() => playBulb(i)}
            aria-label={`string light ${i + 1}`}
          />
        ))}

        <div className="postcard">
          {GALLERY[2] ? (
            <button className="pc-pic desk-obj" onClick={() => setPhoto(2)} aria-label={`photo: ${GALLERY[2].caption}`} style={{ padding: 0, border: 0 }}>
              <img src={GALLERY[2].src} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
            </button>
          ) : (
            <span className="pc-pic"><span /><i /></span>
          )}
          <span className="pc-stamp" />
          <span className="pc-text">GREETINGS<br />FROM SPACE</span>
          <span className="tape-strip" />
        </div>

        <div className="cork">
          <Pinned i={0} className="p1" open={setPhoto} />
          <Obj label="about me: polaroid" className="polaroid p2" onClick={() => go('about')}>
            <span className="polaroid-pic"><Sprite size={28} /></span>
          </Obj>
          <Pinned i={1} className="p3" open={setPhoto} />
          <Obj label="read me: pinned letter" className="pinned-letter" onClick={() => setLetter(true)} />
          <span className="note-card">tour dates: [TBD]</span>
          <span className="pin" style={{ left: 112, top: 2, background: '#C8332D' }} />
          <span className="pin" style={{ left: 30, top: 8, background: '#F2B84B' }} />
          <span className="pin" style={{ left: 190, top: 10, background: '#187489' }} />
        </div>

        <div className={`window ${day ? 'day' : ''}`}>
          <button className="moon" onClick={() => { sfx.select(); setDay((d) => !d); say(day ? 'goodnight' : 'good morning!'); }} aria-label={day ? 'the sun: make it night' : 'the moon: make it day'} />
          <span className="wstar" style={{ left: 24, top: 28 }} /><span className="wstar" style={{ left: 66, top: 70 }} />
          {!day && star > 0 && <button key={star} className="shooting-star" onClick={catchStar} aria-label="a shooting star" />}
          <span className="mullion" />
        </div>
        <Obj
          label="flip me: sticky note"
          className="sticky"
          onClick={() => { sfx.paper(); setPaper({ title: 'sticky_note_back.txt', lines: DESK_SECRETS.stickyBack }); }}
        >finish the album!!</Obj>

        <span className="desktop-surface" />
        <span className="desk-leg" style={{ left: 60 }} />
        <span className="desk-leg" style={{ right: 60 }} />

        {/* a stereo pair: either one plays/pauses the song */}
        {(['l', 'r'] as const).map((side) => (
          <Obj key={side} label={__HAS_TRACK__ ? (playing ? 'pause: speaker' : 'play: speaker') : 'music: speaker'} className={`speaker ${side} ${playing ? 'playing' : ''}`} onClick={speaker}>
            <span className="cone small" /><span className="cone big" />
          </Obj>
        ))}

        <div
          className="mug-zone"
          onDragOver={(e) => { if (e.dataTransfer.types.includes('application/x-madebit-cookie')) e.preventDefault(); }}
          onDrop={(e) => { e.preventDefault(); const i = Number(e.dataTransfer.getData('application/x-madebit-cookie')); if (!Number.isNaN(i)) dunk(i); }}
        >
          {sips < 3 && (<><span className="steam" /><span className="steam s2" /></>)}
          <Obj label="sip: coffee" className={`mug ${held !== null ? 'is-target' : ''}`} onClick={sip}>
            <span className="mug-body" />
            <span className="mug-handle" />
            <span className="mug-coffee" style={{ height: coffeeH, top: 40 - coffeeH }} />
          </Obj>
          {dunking && <span className="dunking-cookie" />}
        </div>

        <Obj label="videos: laptop" className="laptop" onClick={() => go('videos')}>
          <span className="lid"><span className="bars"><i className="bob" /><i /><i className="bob" /><i /><i className="bob" /></span></span>
          <span className="base" />
        </Obj>

        <Ragdoll
          ref={me}
          feedReady={held !== null}
          onFeed={feed}
          onRelease={dropped}
          onLand={(hard) => { if (hard) say('oof'); }}
          onCrash={() => say('...and the caffeine crash')}
        />

        {/* a drawer under the desk: voice memos, demos (and the hidden song, once the lights' tune is played) */}
        <Obj label="open me: drawer" className={`drawer ${drawer ? 'open' : ''}`} onClick={() => { sfx.drawer(); setDrawer((o) => !o); }}>
          <span className="drawer-knob" />
        </Obj>
        {drawer && (
          <div className="drawer-tray">
            {DESK_SECRETS.drawer.map((m) => (
              <a key={m.src} className="memo" href={m.src} target="_blank" rel="noreferrer">▶ {m.title}</a>
            ))}
            {rainbow && (secret
              ? <a className="memo secret" href={secret} download>★ secret song (yours to keep)</a>
              : <span className="memo secret">★ a secret song goes here soon</span>)}
            {DESK_SECRETS.drawer.length === 0 && !rainbow && <span className="memo empty">nothing in here yet... (some old voice memos soon)</span>}
          </div>
        )}

        <Obj label="dig in: trash" className="trash" onClick={openTrash}>
          <span className="trash-lid" /><span className="trash-can" /><span className="trash-paper" />
        </Obj>

        {/* headphones hang on a hook under the desk */}
        <span className="desk-hook" aria-hidden="true" />
        <Obj label="item shop: headphones" className="headphones hung" onClick={() => go('shop')}>
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

        <Obj label="play me: keyboard" className="keys" onClick={playNote}>
          {Array.from({ length: KEYS }, (_, i) => <i key={i} className={lit === i ? 'lit' : undefined} />)}
        </Obj>

        {toast && <div className="toast" role="status">{toast}</div>}
        {paper && (
          <div className="letter-backdrop" onClick={() => setPaper(null)}>
            <div className="letter-win paper-win" role="dialog" aria-label={paper.title} onClick={(e) => e.stopPropagation()}>
              <div className="letter-bar"><span>{paper.title}</span><button onClick={() => setPaper(null)} aria-label="Close">X</button></div>
              <div className="letter-body">{paper.lines.map((l, i) => <p key={i}>{l}</p>)}</div>
            </div>
          </div>
        )}
        {letter && <LetterWindow onClose={() => setLetter(false)} onSignUp={() => { setLetter(false); go('mailbox'); }} />}
      </div>
      {photo !== null && <Lightbox photos={GALLERY} index={photo} onIndex={setPhoto} onClose={() => setPhoto(null)} />}
    </Stage>
  );
}
