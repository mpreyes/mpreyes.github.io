import '@fontsource/press-start-2p';
import '@fontsource-variable/literata';
import './styles.css';
import { mountTown } from './town';

const svg = document.getElementById('map') as unknown as SVGSVGElement;
const card = document.getElementById('card')!;
const title = document.getElementById('card-title')!;
const sub = document.getElementById('card-sub')!;

// She always walks to the spot first; then we head to the link.
// Places without a link yet (the farm) show a little "coming soon" card instead.
function visit(href: string) {
  if (window.top !== window) window.open(href, '_blank', 'noopener'); // inside a preview frame
  else location.assign(href);
}

mountTown(
  svg,
  (p) => {
    if (p.href) { setTimeout(() => visit(p.href), 250); return; }
    title.textContent = p.name;
    sub.textContent = p.sub;
    card.hidden = false;
  },
  () => { card.hidden = true; },
);
