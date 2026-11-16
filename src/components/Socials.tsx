import { siInstagram, siTiktok, siYoutube, siSpotify, siApplemusic, siBandcamp, siSoundcloud, siX } from 'simple-icons';
import { SOCIALS, type Social } from '../data';

const PATHS: Record<Exclude<Social['icon'], 'email'>, string> = {
  instagram: siInstagram.path,
  tiktok: siTiktok.path,
  youtube: siYoutube.path,
  spotify: siSpotify.path,
  applemusic: siApplemusic.path,
  bandcamp: siBandcamp.path,
  soundcloud: siSoundcloud.path,
  x: siX.path,
};

function Icon({ icon }: { icon: Social['icon'] }) {
  if (icon === 'email') {
    return (
      <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <rect x="3" y="5" width="18" height="14" />
        <path d="M3 6l9 7 9-7" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true">
      <path d={PATHS[icon]} />
    </svg>
  );
}

export default function Socials() {
  return (
    <nav className="socials" aria-label="Socials and links">
      {SOCIALS.map((s) => (
        <a key={s.name} href={s.url} target="_blank" rel="noreferrer" aria-label={s.name} title={s.name} className="social">
          <Icon icon={s.icon} />
        </a>
      ))}
      <span className="copy">© madebit</span>
    </nav>
  );
}
