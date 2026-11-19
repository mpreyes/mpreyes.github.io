import '@fontsource/press-start-2p';
import '@fontsource-variable/literata';
import './styles.css';
import { mountTown } from './town';

const svg = document.getElementById('map') as unknown as SVGSVGElement;
const card = document.getElementById('card')!;
const title = document.getElementById('card-title')!;
const sub = document.getElementById('card-sub')!;

const go = document.getElementById('card-go') as HTMLAnchorElement;

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
);
