// Makes small web copies of the full-size cover art in img/music-artwork.
// Output goes to public/ (git-ignored) so the originals stay the source of truth.
// Also copies the favicon and CNAME (custom domain) into public/ so they ship with the build.
import sharp from 'sharp';
import { mkdir, access, copyFile, writeFile } from 'node:fs/promises';

const SRC = 'img/music-artwork';
const OUT = 'public/art';
const covers = {
  'An Alien Among Us - Album Cover.png': 'alien',
  'Virtual Reality Art Final.png': 'virtual-reality',
  'outdoorMeditationsArt.png': 'outdoor-meditations',
  'the mellow art 4.png': 'the-mellow',
  'new age cover art 3000x3000.png': 'new-age',
};

await mkdir(OUT, { recursive: true });
for (const [file, name] of Object.entries(covers)) {
  const out = `${OUT}/${name}.jpg`;
  try { await access(out); continue; } catch {}
  await sharp(`${SRC}/${file}`).resize(600, 600, { fit: 'cover' }).jpeg({ quality: 82 }).toFile(out);
  console.log('art:', out);
}

await copyFile('img/favicon.svg', 'public/favicon.svg');
await copyFile('CNAME', 'public/CNAME');
// Press kit (EPK). Optional: only copied when madebit-epk.pdf is in the repo root.
try { await copyFile('madebit-epk.pdf', 'public/madebit-epk.pdf'); } catch {}

// Personal photos for THE DESK slideshow (same photos as the old site's desk)
await mkdir('public/gallery', { recursive: true });
for (const f of ['coffee_real', 'concert2', 'automata', 'reading', 'goals', 'icecream', 'me']) {
  const out = `public/gallery/${f}.jpg`;
  try { await access(out); continue; } catch {}
  await sharp(`img/carousel/${f}.jpg`).resize(1000, 1000, { fit: 'inside' }).jpeg({ quality: 80 }).toFile(out);
}

// ---------- search engines + link previews ----------
// Share card (1200x630): the sprite next to the logo. Drawn from the same pixel grid as src/components/Sprite.tsx.
const ROWS = [
  '.....PPPPPP.....', '....PHHHHHHP....', '...HHHHHHHHHH...', '..HHHHHHHHHHHH..', '.PPHSSSSSSSSHPP.',
  '.PPSSESSSSESSPP.', '.PPSSSSSSSSSSPP.', '..HSSSSMMSSSSH..', '..HHSSSSSSSSHH..', '..HHH.SSSS.HHH..',
  '...HTTTTTTTTH...', '..TTTTTTTTTTTT..', '.STTTTTTTTTTTTS.', '.STTTTTTTTTTTTS.', '..TTTTTTTTTTTT..',
  '...DDDDDDDDDD...', '...DDDD..DDDD...', '...DDDD..DDDD...', '...BBBB..BBBB...', '..BBBBB..BBBBB..',
];
const C = { H: '#2A1B1B', S: '#D39A72', E: '#F8F6EF', P: '#F77FA1', T: '#9DBE3D', D: '#187489', B: '#F8F6EF', M: '#8A4A3A' };
const px = 20;
const sprite = ROWS.flatMap((row, y) => [...row].map((ch, x) => (ch === '.' ? '' :
  `<rect x="${140 + x * px}" y="${115 + y * px}" width="${px}" height="${px}" fill="${C[ch]}"/>`))).join('');
const stars = [[80, 60], [1100, 90], [1040, 560], [620, 70], [560, 590], [1150, 330]]
  .map(([x, y]) => `<rect x="${x}" y="${y}" width="8" height="8" fill="#F8F6EF"/>`).join('');
const og = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630">
  <rect width="1200" height="630" fill="#0B140E"/>
  ${stars}${sprite}
  <text x="540" y="300" font-family="DejaVu Sans Mono, monospace" font-weight="700" font-size="120" fill="#A6C24A">MADEBIT</text>
  <text x="546" y="370" font-family="DejaVu Sans Mono, monospace" font-size="34" fill="#F2B84B">thumpy experimental pop</text>
  <text x="546" y="420" font-family="DejaVu Sans Mono, monospace" font-size="30" fill="#F8F6EF">Nashville, TN</text>
  <rect x="546" y="470" width="300" height="56" fill="#F77FA1"/>
  <text x="566" y="508" font-family="DejaVu Sans Mono, monospace" font-weight="700" font-size="28" fill="#111111">madebit.studio</text>
</svg>`;
await sharp(Buffer.from(og)).png().toFile('public/og.png');

const SITE = 'https://madebit.studio/';
await writeFile('public/robots.txt', `User-agent: *\nAllow: /\n\nSitemap: ${SITE}sitemap.xml\n`);
await writeFile('public/sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>${SITE}</loc><lastmod>${new Date().toISOString().slice(0, 10)}</lastmod><changefreq>monthly</changefreq><priority>1.0</priority></url>
</urlset>
`);
