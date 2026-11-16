// Makes small web copies of the full-size cover art in img/music-artwork.
// Output goes to public/ (git-ignored) so the originals stay the source of truth.
// Also copies the favicon and CNAME (custom domain) into public/ so they ship with the build.
import sharp from 'sharp';
import { mkdir, access, copyFile } from 'node:fs/promises';

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

// Personal photos for THE DESK slideshow (same photos as the old site's desk)
await mkdir('public/gallery', { recursive: true });
for (const f of ['coffee_real', 'concert2', 'automata', 'reading', 'goals', 'icecream', 'me']) {
  const out = `public/gallery/${f}.jpg`;
  try { await access(out); continue; } catch {}
  await sharp(`img/carousel/${f}.jpg`).resize(1000, 1000, { fit: 'inside' }).jpeg({ quality: 80 }).toFile(out);
}
