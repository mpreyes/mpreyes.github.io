import { MAILCHIMP_ACTION, MAILCHIMP_HONEYPOT } from '../../data';

export default function MailboxScreen() {
  return (
    <div className="screen-pad mailbox" style={{ justifyContent: 'flex-start' }}>
      <span className="envelope" aria-hidden="true" />
      <h2 className="screen-heading big mint">MAILBOX</h2>
      {/* the penpal letter from the old site's "Me" section */}
      <p className="screen-copy" style={{ maxWidth: 'none' }}>
        Hey its me, i make thumpy music :) Thanks for listening to my music! I really appreciate you and hope that you're doing well.
        If you sign up for my mailing list and send me an email, there's a 99% chance that I'll respond to you because I really like
        writing letters and learning about other people's stories through writing.
      </p>
      <p className="screen-copy" style={{ maxWidth: 'none' }}>
        Do you know of this old site back in the day called penpal world? You bet I was a member, hahaha. I loved writing to my
        penpals from all around the world and i hope i can write to you too.
      </p>
      <form action={MAILCHIMP_ACTION} method="post" target="_blank" className="mail-form">
        <label htmlFor="mce-EMAIL" className="eyebrow">EMAIL</label>
        <div className="mail-row">
          <input id="mce-EMAIL" type="email" name="EMAIL" required placeholder="you@email.com" autoComplete="email" />
          <button type="submit" className="btn-solid">SEND ME MAIL</button>
        </div>
        <div aria-hidden="true" style={{ position: 'absolute', left: -5000 }}>
          <input type="text" name={MAILCHIMP_HONEYPOT} tabIndex={-1} defaultValue="" />
        </div>
      </form>
    </div>
  );
}
