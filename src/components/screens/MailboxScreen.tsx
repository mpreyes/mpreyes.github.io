import { useRef, useState } from 'react';
import { MAILCHIMP_ACTION, MAILCHIMP_HONEYPOT } from '../../data';
import LetterWindow from '../LetterWindow';

export default function MailboxScreen() {
  const [open, setOpen] = useState(false);
  const email = useRef<HTMLInputElement>(null);
  return (
    <div className="screen-pad mailbox" style={{ position: 'relative' }}>
      <button className={`envelope-btn ${open ? 'open' : ''}`} onClick={() => setOpen(true)} aria-label="Open the letter">
        <span className="envelope" aria-hidden="true" />
        <span className="envelope-hint">open me</span>
      </button>
      <h2 className="screen-heading big mint">MAILBOX</h2>
      <p className="screen-copy">I write letters sometimes: new music first, behind the scenes, random thoughts. Want one?</p>
      <form action={MAILCHIMP_ACTION} method="post" target="_blank" className="mail-form">
        <label htmlFor="mce-EMAIL" className="eyebrow">EMAIL</label>
        <div className="mail-row">
          <input ref={email} id="mce-EMAIL" type="email" name="EMAIL" required placeholder="you@email.com" autoComplete="email" />
          <button type="submit" className="btn-solid">SEND ME MAIL</button>
        </div>
        <div aria-hidden="true" style={{ position: 'absolute', left: -5000 }}>
          <input type="text" name={MAILCHIMP_HONEYPOT} tabIndex={-1} defaultValue="" />
        </div>
      </form>
      {open && <LetterWindow onClose={() => setOpen(false)} onSignUp={() => { setOpen(false); email.current?.focus(); }} />}
    </div>
  );
}
