// What search engines and link previews see. Edit the words here; the build puts them into index.html.
export const SITE_URL = 'https://madebit.studio/';
export const OG_IMAGE = `${SITE_URL}og.png`;

export const SEO_TITLE = 'madebit | Nashville experimental pop & dance music by Madelyn Reyes';
export const SEO_DESCRIPTION =
  'madebit is the sample-based experimental pop project of Nashville singer, songwriter and producer Madelyn Reyes. ' +
  'Thumpy, glitchy dance pop and indie electronic music. Stream it, buy it on Bandcamp, and say hi.';

// Other official profiles that aren't in the socials bar (search engines use these to confirm it's you).
export const EXTRA_PROFILES = ['https://linktr.ee/madebit'];

export const GENRES = ['Experimental pop', 'Dance pop', 'Indie electronic', 'Alt pop', 'Indie pop', 'Electronic'];

// "For fans of": for search engines only (keywords + the hidden text copy), not shown on the site.
export const FANS_OF = ['Grimes', 'Flume', 'Yaeji', 'Caroline Polachek', 'Magdalena Bay', 'Charli XCX', 'PinkPantheress', 'Kero Kero Bonito', 'Kyary Pamyu Pamyu'];

export const KEYWORDS = [
  // who
  'madebit', 'madebit music', 'Madelyn Reyes', 'Madelyn Reyes music', 'madebit Nashville',
  // what
  'experimental pop', 'sample-based pop', 'sampled pop', 'dance pop', 'alt pop', 'indie pop', 'indie electronic',
  'electronic pop', 'electropop', 'synth pop', 'hyperpop', 'bedroom pop', 'glitch pop', 'global bass', 'thumpy music',
  // where
  'Nashville', 'Nashville musician', 'Nashville indie artist', 'Nashville electronic music', 'Nashville pop artist',
  'Nashville producer', 'Tennessee indie music',
  // how
  'independent artist', 'indie artist', 'independent musician', 'female producer', 'woman producer',
  'singer-songwriter', 'self-produced', 'bedroom producer', 'new music', 'underground pop',
  // sounds like
  ...FANS_OF.map((a) => `for fans of ${a}`), 'artists like Flume', 'artists like Yaeji', 'artists like Magdalena Bay',
  'experimental pop artists', 'experimental alt pop', 'alt pop artists',
  // releases
  'An Alien Among Us', 'CMYK EP', "A Mechanic's Guide to Throwing a Dance Party", 'The Duality of Man',
  'blue_screen.mp3', 'demons in me closet', 'frustrated!!', 'Outdoor Meditations',
];
