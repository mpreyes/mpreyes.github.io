import { useEffect } from 'react';
import { sfx } from '../sound';

// The penpal letter from the old site's "Me" section, in a little retro OS window.
export const PENPAL_LETTER = [
  "Hey its me, i make thumpy music :) Thanks for listening to my music! I really appreciate you and hope that you're doing well.",
  "If you sign up for my mailing list and send me an email, there's a 99% chance that I'll respond to you because I really like writing letters and learning about other people's stories through writing.",
  'Do you know of this old site back in the day called penpal world? You bet I was a member, hahaha. I loved writing to my penpals from all around the world and i hope i can write to you too.',
];

export default function LetterWindow({ onClose, onSignUp }: { onClose: () => void; onSignUp: () => void }) {
  useEffect(() => {
    sfx.paper();
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') { e.stopPropagation(); onClose(); } };
    window.addEventListener('keydown', onKey, true);
    return () => window.removeEventListener('keydown', onKey, true);
  }, [onClose]);

  return (
    <div className="letter-backdrop" onClick={onClose}>
      <div className="letter-win" role="dialog" aria-modal="true" aria-label="A letter from madebit" onClick={(e) => e.stopPropagation()}>
        <div className="letter-bar">
          <span>letter_to_you.txt</span>
          <button onClick={onClose} aria-label="Close letter">X</button>
        </div>
        <div className="letter-body">
          {PENPAL_LETTER.map((p, i) => <p key={i}>{p}</p>)}
          <p className="letter-sign">xo, madelyn</p>
        </div>
        <div className="letter-foot">
          <button className="btn-solid" onClick={onSignUp}>WRITE ME BACK &gt;</button>
        </div>
      </div>
    </div>
  );
}
