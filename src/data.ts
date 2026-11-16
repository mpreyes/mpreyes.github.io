// Everything content-related lives here, so updating the site means editing this file.
// Lines marked TODO are placeholders to swap for the real thing.
import { VOL2_COVER } from './covers';

const yt = (id: string) => `https://www.youtube-nocookie.com/embed/${id}`;

export const BANDCAMP = 'https://madebit.bandcamp.com/';
export const EMAIL = 'madebitmusic@gmail.com';
export const MAILCHIMP_ACTION =
  'https://madebit.us14.list-manage.com/subscribe/post?u=d920d41bcce61aef97158baf6&id=c3491fafe2';
// Mailchimp's hidden bot-trap field name for this list
export const MAILCHIMP_HONEYPOT = 'b_d920d41bcce61aef97158baf6_c3491fafe2';

// Bio + artist statement, from the 2027 EPK.
export const BIO_SHORT = 'Madebit is the experimental pop & dance project of songwriter & producer Madelyn Reyes.';
export const BIO = [
  'Madebit is the experimental pop & dance project of songwriter & producer Madelyn Reyes. Based out of Nashville, TN, ' +
    'she enjoys layering synthesizer sounds with world influences paired with catchy pop hooks & lyrics that read like poetry.',
  "She released her debut album AN ALIEN AMONG US in 2023, and continues the party with A MECHANIC'S GUIDE TO THROWING A DANCE PARTY " +
    'VOL 1 & 2, released Nov 2024 and coming Dec 2026.',
];
export const STATEMENT = [
  "I'm really inspired by those crazy but fearless artists who stand at the helm of their recordings: those who take on the challenge of " +
    'writing, producing, and performing an album for the sheer joy of artistic expression. Those that have a burning passion to carry out ' +
    'a specific vision and a desire to prove that they can do it themselves.',
  'Much in the way that a captivating fiction writer can take you on a fantastic journey & transport you into other worlds, I want people ' +
    'to see this body of work as an exploration of new sounds, compelling stories, and sincere emotions that invite people to escape the ' +
    'mundane and immerse themselves in a world of sonic experimentation.',
];
// Press kit PDF. Lives at img/press/madebit-epk.pdf; the build copies it to the site root.
export const EPK_URL = 'madebit-epk.pdf';

export type CartId = 'music' | 'videos' | 'shop' | 'mailbox' | 'about' | 'desk';

export interface Cart {
  id: CartId;
  label: string;
  sub: string;
  code: string;
  color: string;
}

export const CARTS: Cart[] = [
  { id: 'music', label: 'MUSIC', sub: 'the madebit system', code: 'MB-01', color: '#9DBE3D' },
  { id: 'videos', label: 'VIDEOS', sub: 'flip the channels', code: 'MB-02', color: '#F2B84B' },
  { id: 'shop', label: 'ITEM SHOP', sub: 'merch + bonus packs', code: 'MB-03', color: '#F77FA1' },
  { id: 'mailbox', label: 'MAILBOX', sub: 'letters from me', code: 'MB-04', color: '#93C78E' },
  { id: 'about', label: 'PLAYER 1', sub: 'who is madebit', code: 'MB-05', color: '#F4A9A8' },
  { id: 'desk', label: 'THE DESK', sub: 'where it all happens', code: 'MB-06', color: '#F8F6EF' },
];

export interface StreamLinks {
  spotify?: string;
  apple?: string;
  bandcamp?: string;
  soundcloud?: string;
  youtube?: string;
}

export interface Release {
  id: string;
  name: string;
  kind: 'ALBUM' | 'EP' | 'SINGLE' | 'COMING SOON';
  art?: string;
  color: string;
  /** release year; shown on hover */
  year: string;
  /** full release date (YYYY-MM-DD), used for search engines */
  date?: string;
  /** planet size in px */
  size: number;
  /** which ring it orbits: 1 = closest to the sun (oldest) ... 4 = outermost (newest / coming soon) */
  orbit: 1 | 2 | 3 | 4;
  /** where on that ring, in degrees (0 = right, 90 = bottom) */
  angle: number;
  ring?: boolean;
  tracks: string[];
  links: StreamLinks;
  /** a line in my own words, shown as a pull quote on the release's page */
  quote?: string;
  /** 1-2 sentences about the release */
  about?: string;
  /** Spotify track ids, in tracklist order */
  spotifyTracks?: string[];
  /** a color per track (tracklist order), hidden until you press REVEAL */
  trackColors?: string[];
  /** credits, shown under the tracklist */
  credits?: string;
  /** tracks that only live on the album page on Bandcamp (no page of their own) */
  albumOnlyTracks?: string[];
  /** a work-in-progress song bank: [emoji, working title, status marks] */
  songBank?: [string, string, string][];
  /** a moodboard for the world of the release (e.g. a Pinterest board) */
  moodboard?: string;
  /** videos shown on the release's page; `vertical` for YouTube Shorts */
  videos?: { title: string; embed: string; vertical?: boolean }[];
}

export const SPOTIFY_ARTIST = 'https://open.spotify.com/artist/2gEqHMtzOfyjc8hZLsEVbF';
const album = (id: string) => `https://open.spotify.com/album/${id}`;
// Bandcamp cover art (700px). Bandcamp is where people buy, so its art is the source of truth.
const bcArt = (id: string) => `https://f4.bcbits.com/img/${id}_16.jpg`;

// Singles already on an album or EP are listed under that release, not as their own planet.
// Planets are chronological: inner rings are the oldest releases, outer rings the newest.
export const RELEASES: Release[] = [
  {
    id: 'alien',
    name: 'An Alien Among Us',
    kind: 'ALBUM',
    art: 'art/alien.jpg',
    color: '#9DBE3D',
    year: '2023',
    size: 86,
    orbit: 2,
    angle: 300,
    ring: true,
    tracks: [
      'Space',
      'An Alien Among Us',
      'Sandy Beaches',
      'Moon Dance',
      'Bring It Out',
      'Intermission (I do what i want)',
      'An Ode To Those Who Lead But Do Not Follow',
      'A Sound is Born (Evolution of Self)',
      "I Won't Repeat Myself (Come Sail Away)",
      'Persimmon Spritz',
      'I Wanna Get Away',
      'Where The Sidewalk Never Ends',
    ],
    links: { spotify: album('48VsV9PYq9b6APVSaEue4S'), bandcamp: `${BANDCAMP}album/an-alien-among-us` },
    spotifyTracks: ['77Wr7WmavTIl9Uuf2dmG9z', '05Nwoyz47GcVphTfIkeTbu', '7xeFWp89dST5b2A4vRoVjP', '5w9xy0k8SPBngYrbWL6FPO', '4TZ5htwwwDwYsckZzHvJSj', '0dfy7w78BuTsZkjVZnC9K0',
      '3PJj3cB8ARLEKbN0zNuaaU', '1lExcixYRMv6BrMY7P53aO', '6MQcYujKDnPLqtSFULdhzE', '6L1VipbVTCxuyXRWBbzTod', '3Ms22MsmqOYYB7vU34MwtD', '6jz84GysSFdcky5YFXrWKR'],
    quote: 'How do you take the feelings of being an outsider and turn them into ways you can connect with other people?',
    credits: 'My debut album, written and produced by me. Mixed by Graham Bechler, Rob Rox and Mark Yardley, and mastered by Stuart Hawkes at Metropolis Studios.',
    videos: [{ title: 'A Sound is Born (Evolution of Self), official audio', embed: yt('AZYzyCN0Qxs') }],
  },
  {
    id: 'mechanics-guide-1',
    name: "A Mechanic's Guide to Throwing a Dance Party, Vol. 1",
    kind: 'EP',
    art: bcArt('a0498343934'),
    color: '#F2B84B',
    year: '2024',
    date: '2024-11-01',
    size: 62,
    orbit: 2,
    angle: 140,
    tracks: ['Deep Down', 'Time Goes On (Silence is Golden)', 'Quest for Self', 'Be my only love'],
    links: { spotify: album('194XpkdJMTSBHrodsNGWtg'), bandcamp: `${BANDCAMP}album/a-mechanics-guide-to-throwing-a-dance-party-vol-1` },
    spotifyTracks: ['09UDno3HC3yIfYchVoyiCx', '3D865L2fhGUS1tt1AulAyR', '1xtfUG12RkcN1J9cpqIlsI', '1mjEQ1cn4r3SiSmINGSw6V'],
    about: 'My foray into dance music and a sincere attempt to convey what I think.',
    albumOnlyTracks: ['Quest for Self', 'Be my only love'],
    videos: [
      { title: 'Deep Down, lyric video', embed: yt('kaOrPX5qenc') },
      { title: 'Time Goes On (Silence is Golden), lyric video', embed: yt('LAgotYv-3wE') },
    ],
  },
  {
    id: 'cmyk',
    name: 'CMYK',
    kind: 'EP',
    art: bcArt('a1577032062'),
    color: '#F77FA1',
    year: '2022',
    date: '2022-09-26',
    size: 58,
    orbit: 1,
    angle: 20,
    tracks: ['Virtual Reality', 'The Mellow', 'Something', 'Island Vibes'],
    links: { spotify: album('2tgtUERWbhirxISb20Lk8Q'), bandcamp: `${BANDCAMP}album/cmyk` },
    spotifyTracks: ['1HDXrAdUoY2FVbAlS1JZlY', '0RDmeaU0AZAi3WTKGUelwL', '7gGCdmj4OmzTqEUJKe7mk5', '50puonQ21y24vQwpKarvCd'],
    about: 'Not quite synesthesia, but each song has its own color. Can you guess which is which?',
    // Virtual Reality = K (black), The Mellow = cyan, Something = yellow, Island Vibes = magenta
    trackColors: ['#111111', '#00AEEF', '#FFE600', '#EC008C'],
    videos: [{ title: 'Something, a sneak peek', embed: yt('oXdbSLHQndw'), vertical: true }],
  },
  {
    id: 'outdoor-meditations',
    name: 'Outdoor Meditations',
    kind: 'SINGLE',
    art: 'art/outdoor-meditations.jpg',
    color: '#93C78E',
    year: '2022',
    date: '2022-02-09',
    size: 46,
    orbit: 1,
    angle: 200,
    tracks: ['Outdoor Meditations'],
    links: { spotify: album('7cGrEtPfouq3ZOUdi6XOmu'), bandcamp: `${BANDCAMP}track/outdoor-meditations` },
    spotifyTracks: ['2rOCE7SdGMy69cy4tJkX0W'],
    about: 'World bass!! My first real song :)',
  },
  {
    id: 'demons',
    name: 'demons in me closet (eek)',
    kind: 'SINGLE',
    art: bcArt('a2720416291'),
    color: '#C8332D',
    year: '2025',
    date: '2025-08-09',
    size: 41,
    orbit: 3,
    angle: 230,
    tracks: ['demons in me closet (eek)'],
    links: { spotify: album('2wfK3YcXYsZ4YLchyaUT4I'), bandcamp: `${BANDCAMP}track/demons-in-me-closet-eek` },
    spotifyTracks: ['7EEcXDFcRvTf3RdaTT90Lz'],
    about: "Unfortunately, I didn't have a better photo for the cover than a mirror selfie in front of my closet.",
  },
  {
    id: 'blue-screen',
    name: 'blue_screen.mp3',
    kind: 'SINGLE',
    art: bcArt('a4206067042'),
    color: '#187489',
    year: '2025',
    date: '2025-10-01',
    size: 41,
    orbit: 3,
    angle: 345,
    tracks: ['blue_screen.mp3'],
    links: { spotify: album('48KA494GY09hortwvIwciz'), bandcamp: `${BANDCAMP}track/blue-screen` },
    spotifyTracks: ['4UbU7eYWOPv20E7Tb9FyL0'],
    about: 'Sometimes there are so many miscommunications that you forget what the argument was even about. There is something almost beautiful in that.',
    videos: [{ title: "it's a weary road", embed: yt('86G_2TdoWT4'), vertical: true }],
  },
  {
    id: 'frustrated',
    name: 'frustrated!!',
    kind: 'SINGLE',
    art: bcArt('a3187858009'),
    color: '#F4A9A8',
    year: '2026',
    date: '2026-02-25',
    size: 41,
    orbit: 3,
    angle: 75,
    tracks: ['frustrated!!'],
    links: { spotify: album('4SdXq0SMnBPL6XiuDNiKcV'), bandcamp: `${BANDCAMP}track/frustrated` },
    spotifyTracks: ['23Lh9QyC67SA0s0UiPIUUF'],
    about: 'A song about being stuck. I know you know about this.',
  },
  {
    id: 'mechanics-guide-2',
    name: "A Mechanic's Guide to Throwing a Dance Party, Vol. 2",
    kind: 'COMING SOON',
    art: VOL2_COVER,
    color: '#C8332D',
    year: 'soon',
    size: 54,
    orbit: 4,
    angle: 20,
    tracks: [],
    links: {},
    about: "I can't ride a skateboard, but this EP makes me want to learn.",
    videos: [
      { title: 'this song feels like watching your empire crumble in slow motion', embed: yt('X6Nzc_Phf-o') },
      { title: 'this song feels like dissolving into storm lightning at 3am', embed: yt('qs2VUvBR4Zk') },
      { title: 'this song feels like flying downhill on wheels through the city at night', embed: yt('W0ts9-97jlM') },
    ],
  },
  {
    id: 'duality-of-man',
    name: 'The Duality of Man',
    kind: 'COMING SOON',
    color: '#2E4A36',
    year: 'soon',
    size: 76,
    orbit: 4,
    angle: 205,
    ring: true,
    tracks: [],
    links: {},
    about: "We're full of contradictions, and so wonderfully multi-faceted. We think one way and act another. We dream about doing things we may never get to.",
    moodboard: 'https://www.pinterest.com/reyesmadelynmr/dualityofman/',
    // straight from my Notion. ⭐ i like this song · 💙 making the album · 🟧 vocals recorded · 🟩 done
    songBank: [
      ['🎮', 'a time apart (a sticky situation)', '⭐'],
      ['🪔', 'a cozy bar in mars', '⭐'],
      ['🕐', 'a beate (FRUSTRATED!.mp3)', '🟩'],
      ['💾', 'and the world turns another page (on fear)', '🟧'],
      ['🌞', 'sun', '🟧'],
      ['💄', "kiss me (i'll go down with you)", '🟧'],
      ['📄', "i don't know people", '💙 (MUST FINISH)'],
      ['🕯️', 'match girl', '💙'],
      ['🪬', 'dont gotta be bad (no air)', '💙'],
      ['🌘', '6 pain (let it all float away)', '💙'],
      ['🛬', 'fools gold (eons together)', '🟧'],
      ['🥉', 'talk about it', '💙'],
      ['🌖', 'change for other people (HYPE HYPE HYPE)', '🟧'],
      ['🗺️', 'dont say ur lonely - i know', '💙'],
      ['🏃‍♀️', 'running', '💙'],
      ['📄', 'raincoat', '⭐'],
      ['📄', 'i always come back to', ''],
      ['🫧', 'something new', ''],
      ['📄', 'bleeds another one', ''],
      ['📄', 'dry my tears', ''],
      ['📄', 'bright lights', ''],
      ['📄', 'derivative', ''],
      ['📄', 'eeoeeeeoeoeeoeoee', ''],
      ['📄', 'i love the sunshine and i love the rain', ''],
      ['📄', 'girl takes her dog to the gym', ''],
      ['📄', 'a new pancake', ''],
    ],
  },
];

// Hidden things on THE DESK. TODO: swap these placeholders for the real thing.
export const DESK_SECRETS = {
  /** the back of the "finish the album!!" sticky note */
  stickyBack: ['finish the album!!', '(your to-do list or lyric scraps go here)'],
  /** crumpled drafts in the trash can: one pops out per click */
  trash: ['(a lyric that got cut)', '(another line that didn\'t make it)', '(a verse you rewrote 4 times)'],
  /** voice memos and demos in the drawer. Put the audio in public/memos/ and list it here. */
  drawer: [] as { title: string; src: string }[],
};

// Photos pinned on THE DESK. Click one to open the slideshow.
// The first three show on the wall (two polaroids and the postcard). Captions are from the old site.
export interface Photo {
  src: string;
  caption: string;
}
export const GALLERY: Photo[] = [
  { src: 'gallery/coffee_real.jpg', caption: 'I like coffee. This is a cuban.' },
  { src: 'gallery/concert2.jpg', caption: 'The Foo Fighters concert I went to.' },
  { src: 'gallery/me.jpg', caption: 'Bonus pic.' },
  { src: 'gallery/automata.jpg', caption: 'My work is very important to me. I always draw on the board, though.' },
  { src: 'gallery/reading.jpg', caption: 'I only read great literature.' },
  { src: 'gallery/goals.jpg', caption: "I've got everything planned out..." },
  { src: 'gallery/icecream.jpg', caption: 'My parents enable my sweet tooth.' },
];

export interface Video {
  title: string;
  kind: string;
  /** a YouTube embed URL */
  embed: string;
  color: string;
}

export const VIDEOS: Video[] = [
  { title: "You didn't find this video. The SAUCE chose YOU", kind: 'madebit', embed: yt('9Fl2xFhMAUg'), color: '#9DBE3D' },
  { title: 'You On Kazoo!', kind: 'favorites', embed: 'https://www.youtube-nocookie.com/embed/cRpdIrq7Rbo?start=11&end=58', color: '#93C78E' },
  { title: 'kid dancing at the club, 1997', kind: 'favorites', embed: yt('3eRBFkxgG7g'), color: '#F4A9A8' },
];

export interface MerchItem {
  name: string;
  /** small line under the name, e.g. "digital album" */
  kind: string;
  price: string;
  /** shell color of the little cartridge */
  color: string;
  /** cover art shown as the cartridge label */
  art?: string;
  url: string;
}

const bc = (path: string) => `${BANDCAMP}${path}`;

// Each item links straight to its Bandcamp page. Add new merch here as it goes up on Bandcamp.
export const MERCH: MerchItem[] = [
  { name: 'frustrated!!', kind: 'digital single', price: '$1.50+', color: '#F4A9A8', art: bcArt('a3187858009'), url: bc('track/frustrated') },
  { name: 'blue_screen.mp3', kind: 'digital single', price: '$1.50+', color: '#187489', art: bcArt('a4206067042'), url: bc('track/blue-screen') },
  { name: 'demons in me closet (eek)', kind: 'digital single', price: '$1.50+', color: '#C8332D', art: bcArt('a2720416291'), url: bc('track/demons-in-me-closet-eek') },
  { name: "A Mechanic's Guide to Throwing a Dance Party, Vol. 1", kind: 'digital EP', price: '$7+', color: '#F2B84B', art: bcArt('a0498343934'), url: bc('album/a-mechanics-guide-to-throwing-a-dance-party-vol-1') },
  { name: 'An Alien Among Us', kind: 'digital album', price: '$7+', color: '#9DBE3D', art: 'art/alien.jpg', url: bc('album/an-alien-among-us') },
  { name: 'CMYK', kind: 'digital EP', price: '$4+', color: '#F77FA1', art: bcArt('a1577032062'), url: bc('album/cmyk') },
  { name: 'Outdoor Meditations', kind: 'digital single', price: '$1.50+', color: '#93C78E', art: 'art/outdoor-meditations.jpg', url: bc('track/outdoor-meditations') },
];

export interface Social {
  name: string;
  url: string;
  icon: 'instagram' | 'tiktok' | 'youtube' | 'spotify' | 'applemusic' | 'bandcamp' | 'soundcloud' | 'x' | 'email';
}

export const SOCIALS: Social[] = [
  { name: 'Instagram', url: 'https://www.instagram.com/madebit/', icon: 'instagram' },
  { name: 'TikTok', url: 'https://www.tiktok.com/@madebitmusic', icon: 'tiktok' },
  { name: 'YouTube', url: 'https://www.youtube.com/channel/UCIvz8TjpKD7LWEfOBxW4vFw', icon: 'youtube' },
  { name: 'Spotify', url: SPOTIFY_ARTIST, icon: 'spotify' },
  // TODO: { name: 'Apple Music', url: '', icon: 'applemusic' },
  { name: 'Bandcamp', url: BANDCAMP, icon: 'bandcamp' },
  { name: 'SoundCloud', url: 'https://soundcloud.com/madebitmusic', icon: 'soundcloud' },
  { name: 'X', url: 'https://twitter.com/madebitmusic', icon: 'x' },
  { name: 'Email', url: `mailto:${EMAIL}`, icon: 'email' },
];

// A track's own Spotify page, if we have it.
export function spotifyTrackUrl(r: Release, i: number): string | undefined {
  const id = r.spotifyTracks?.[i];
  return id ? `https://open.spotify.com/track/${id}` : undefined;
}

// A track's own Bandcamp page (falls back to the release's page when it doesn't have one).
export function trackUrl(r: Release, title: string): string | undefined {
  if (!r.links.bandcamp) return undefined;
  if (r.tracks.length === 1 || r.albumOnlyTracks?.includes(title)) return r.links.bandcamp;
  const slug = title.toLowerCase().replace(/['’]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  return `${BANDCAMP}track/${slug}`;
}
