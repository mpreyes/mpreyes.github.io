import { useState } from 'react';
import type { CartId } from '../data';
import { CALL, RESPONSE, TICK } from '../melody';
import { phrase } from '../sound';
import TitleScreen from './screens/TitleScreen';
import MusicScreen from './screens/MusicScreen';
import VideoScreen from './screens/VideoScreen';
import ShopScreen from './screens/ShopScreen';
import MailboxScreen from './screens/MailboxScreen';
import AboutScreen from './screens/AboutScreen';
import DeskScreen from './screens/DeskScreen';

// The TV's two knobs are a call and a response: turn the first, it asks; turn the second, it answers.
const KNOBS = [
  { label: 'turn the top knob', notes: CALL },
  { label: 'turn the bottom knob', notes: RESPONSE },
];

export default function Tv({ on, go }: { on: CartId | null; go: (id: CartId) => void }) {
  const [turning, setTurning] = useState<number | null>(null);
  const [turns, setTurns] = useState([0, 0]);
  const turn = (i: number) => {
    if (turning !== null) return;
    const secs = phrase(KNOBS[i].notes, TICK);
    setTurning(i);
    setTurns((t) => t.map((n, k) => (k === i ? n + 1 : n)));
    window.setTimeout(() => setTurning(null), Math.max(300, secs * 1000));
  };
  return (
    <div className="tv">
      {/* rabbit ears, only drawn on phones */}
      <span className="antenna" aria-hidden="true"><i /><i /></span>
      <div className="screen" key={on ?? 'title'}>
        <div className="screen-inner">
          {on === null && <TitleScreen />}
          {on === 'music' && <MusicScreen />}
          {on === 'videos' && <VideoScreen />}
          {on === 'shop' && <ShopScreen />}
          {on === 'mailbox' && <MailboxScreen />}
          {on === 'about' && <AboutScreen />}
          {on === 'desk' && <DeskScreen go={go} />}
        </div>
        <div className="scanlines" aria-hidden="true" />
      </div>
      <div className="tv-controls">
        {KNOBS.map((k, i) => (
          <button
            key={i}
            className={`knob ${turning === i ? 'turning' : ''}`}
            style={{ transform: `rotate(${turns[i] * 120}deg)` }}
            onClick={() => turn(i)}
            aria-label={k.label}
          />
        ))}
        <span className="grille" aria-hidden="true" />
        <span className="grille" aria-hidden="true" />
        <span className="grille" aria-hidden="true" />
      </div>
    </div>
  );
}
