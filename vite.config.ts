import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import { readdirSync } from 'node:fs';
import { BIO, BIO_SHORT, STATEMENT, EPK_URL, EMAIL, RELEASES, SOCIALS, SPOTIFY_ARTIST, BANDCAMP } from './src/data';
import { EXTRA_PROFILES, FANS_OF, GENRES, KEYWORDS, OG_IMAGE, SEO_DESCRIPTION, SEO_TITLE, SITE_URL } from './src/seo';

// The press kit only shows up once a madebit-epk*.pdf is in the repo root (see scripts/build-art.mjs).
const HAS_EPK = readdirSync('.').some((f) => /^madebit-epk.*\.pdf$/i.test(f));

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

// Fills index.html with everything search engines need: meta tags, structured data
// (so Google knows this is a musician and what she's released), and a plain-text copy
// of the site for crawlers and screen readers. React replaces that copy when the app loads.
function seo(): Plugin {
  return {
    name: 'madebit-seo',
    transformIndexHtml(html) {
      const out = RELEASES.filter((r) => r.kind !== 'COMING SOON');
      const sameAs = [...SOCIALS.filter((s) => s.url.startsWith('http')).map((s) => s.url), ...EXTRA_PROFILES];
      const ld = {
        '@context': 'https://schema.org',
        '@type': 'MusicGroup',
        '@id': `${SITE_URL}#madebit`,
        name: 'madebit',
        alternateName: 'Madelyn Reyes',
        url: SITE_URL,
        image: OG_IMAGE,
        description: BIO_SHORT,
        genre: GENRES,
        foundingLocation: { '@type': 'Place', name: 'Nashville, Tennessee' },
        member: { '@type': 'Person', name: 'Madelyn Reyes', jobTitle: 'Singer, songwriter and producer' },
        email: `mailto:${EMAIL}`,
        sameAs,
        album: out.map((r) => ({
          '@type': 'MusicAlbum',
          name: r.name,
          albumReleaseType: r.kind === 'SINGLE' ? 'https://schema.org/SingleRelease' : r.kind === 'EP' ? 'https://schema.org/EPRelease' : 'https://schema.org/AlbumRelease',
          ...(r.date ? { datePublished: r.date } : { datePublished: r.year }),
          ...(r.art?.startsWith('http') ? { image: r.art } : r.art && !r.art.startsWith('data:') ? { image: SITE_URL + r.art } : {}),
          url: r.links.bandcamp !== BANDCAMP && r.links.bandcamp ? r.links.bandcamp : r.links.spotify,
          numTracks: r.tracks.length,
          track: r.tracks.map((t, i) => ({ '@type': 'MusicRecording', name: t, position: i + 1 })),
        })),
      };

      const head = [
        `<title>${esc(SEO_TITLE)}</title>`,
        `<meta name="description" content="${esc(SEO_DESCRIPTION)}" />`,
        `<meta name="keywords" content="${esc(KEYWORDS.join(', '))}" />`,
        `<meta name="author" content="Madelyn Reyes" />`,
        `<link rel="canonical" href="${SITE_URL}" />`,
        `<meta property="og:type" content="music.musician" />`,
        `<meta property="og:site_name" content="madebit" />`,
        `<meta property="og:title" content="${esc(SEO_TITLE)}" />`,
        `<meta property="og:description" content="${esc(SEO_DESCRIPTION)}" />`,
        `<meta property="og:url" content="${SITE_URL}" />`,
        `<meta property="og:image" content="${OG_IMAGE}" />`,
        `<meta property="og:image:width" content="1200" />`,
        `<meta property="og:image:height" content="630" />`,
        `<meta property="og:image:alt" content="madebit: a pixel sprite of Madelyn next to the madebit logo" />`,
        `<meta name="twitter:card" content="summary_large_image" />`,
        `<meta name="twitter:title" content="${esc(SEO_TITLE)}" />`,
        `<meta name="twitter:description" content="${esc(SEO_DESCRIPTION)}" />`,
        `<meta name="twitter:image" content="${OG_IMAGE}" />`,
        `<script type="application/ld+json">${JSON.stringify(ld).replace(/</g, '\\u003c')}</script>`,
      ].join('\n    ');

      const li = (r: (typeof RELEASES)[number]) => {
        const link = r.links.bandcamp ?? r.links.spotify;
        const label = `${esc(r.name)} (${r.kind === 'COMING SOON' ? 'coming soon' : `${r.kind.toLowerCase()}, ${r.year}`})`;
        const tracks = r.tracks.length > 1 ? `: ${r.tracks.map(esc).join(', ')}` : '';
        return `<li>${link ? `<a href="${link}">${label}</a>` : label}${tracks}</li>`;
      };
      const body = `<div class="seo-copy">
        <h1>madebit</h1>
        ${BIO.map((p) => `<p>${esc(p)}</p>`).join('')}
        <p>Experimental, sample-based alt pop and dance music from Nashville, Tennessee. For fans of ${FANS_OF.map(esc).join(', ')}.</p>
        <h2>In her words</h2>
        ${STATEMENT.map((p) => `<p>${esc(p)}</p>`).join('')}
        ${HAS_EPK ? `<p><a href="${EPK_URL}">Download the madebit press kit (EPK)</a></p>` : ''}
        <h2>Music</h2>
        <ul>${RELEASES.map(li).join('')}</ul>
        <h2>Listen and buy</h2>
        <ul>
          <li><a href="${SPOTIFY_ARTIST}">madebit on Spotify</a></li>
          <li><a href="${BANDCAMP}">Buy madebit music on Bandcamp</a></li>
          ${SOCIALS.filter((s) => s.icon !== 'spotify' && s.icon !== 'bandcamp').map((s) => `<li><a href="${s.url}">${esc(s.name)}</a></li>`).join('')}
        </ul>
      </div>`;

      return html
        .replace(/<title>[\s\S]*?<\/title>\s*/, '')
        .replace(/<meta name="description"[^>]*>\s*/, '')
        .replace(/<meta property="og:[^>]*>\s*/g, '')
        .replace('</head>', `    ${head}\n  </head>`)
        .replace('<div id="root"></div>', `<div id="root">${body}</div>`);
    },
  };
}

export default defineConfig({
  plugins: [react(), seo()],
  define: { __HAS_EPK__: JSON.stringify(HAS_EPK) },
  base: './',
});
