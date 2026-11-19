import '@fontsource/press-start-2p';
import '@fontsource-variable/literata';
import './styles.css';
import { mountTown, onWalk } from './town';
import { mountCamera } from './camera';
import { isMuted, setMuted, unlockAudio } from './sound';

const svg = document.getElementById('map') as unknown as SVGSVGElement;
const card = document.getElementById('card')!;
const title = document.getElementById('card-title')!;
const sub = document.getElementById('card-sub')!;

const go = document.getElementById('card-go') as HTMLAnchorElement;
const coinsEl = document.getElementById('coins')!;

const cam = mountCamera(svg, document.getElementById('pan-left') as HTMLButtonElement, document.getElementById('pan-right') as HTMLButtonElement);
onWalk.at = (x) => cam.follow(x);

// Click a building -> she walks there -> this card opens -> VISIT takes you to the site.
mountTown(
  svg,
  (p) => {
    title.textContent = p.name;
    sub.textContent = p.sub;
    if (p.href) { go.href = p.href; go.textContent = 'VISIT ↗'; go.classList.remove('soon'); go.removeAttribute('aria-disabled'); }
    else { go.removeAttribute('href'); go.textContent = 'SOON'; go.classList.add('soon'); go.setAttribute('aria-disabled', 'true'); }
    card.hidden = false;
  },
  () => { card.hidden = true; },
  (n) => {
    try { localStorage.setItem('coins', String(n)); } catch { /* private mode */ }
    coinsEl.hidden = n <= 0;
    coinsEl.textContent = `COINS ${n}`;
  },
  (png) => {
    try { localStorage.setItem('family-photo', png); } catch { /* too big or private mode */ }
    showPhoto(png);
    photoBtn.animate?.([{ transform: 'scale(1.25)' }, { transform: 'scale(1)' }], { duration: 400 });
  },
);

// Sound: browsers only allow it after a tap, so switch it on with the first one.
const soundBtn = document.getElementById('sound') as HTMLButtonElement;
const showSound = () => { soundBtn.textContent = isMuted() ? 'SOUND OFF' : 'SOUND ON'; soundBtn.setAttribute('aria-pressed', String(!isMuted())); };
showSound();
soundBtn.addEventListener('click', () => { setMuted(!isMuted()); showSound(); unlockAudio(); });
addEventListener('pointerdown', () => unlockAudio(), { once: true });
addEventListener('keydown', () => unlockAudio(), { once: true });

// The family photo: once you've taken one, PHOTO up top shows it, with a button to save it.
const photoBtn = document.getElementById('photo') as HTMLButtonElement;
const dialog = document.getElementById('photo-dialog') as HTMLDialogElement;
const img = document.getElementById('photo-img') as HTMLImageElement;
const save = document.getElementById('photo-save') as HTMLAnchorElement;
function showPhoto(png: string) { img.src = png; save.href = png; photoBtn.hidden = false; }
try { const saved = localStorage.getItem('family-photo'); if (saved) showPhoto(saved); } catch { /* private mode */ }
photoBtn.addEventListener('click', () => dialog.showModal());
document.getElementById('photo-close')!.addEventListener('click', () => dialog.close());
dialog.addEventListener('click', (e) => { if (e.target === dialog) dialog.close(); });
