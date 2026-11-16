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

// From the old site's "Me" section
export const BIO_SHORT = 'Madebit is the experimental pop/dance project of singer, songwriter, & producer Madelyn Reyes.';
export const BIO_LETTER =
  "Hey its me, i make thumpy music :) Thanks for listening to my music! I really appreciate you and hope that you're doing well. " +
  "If you sign up for my mailing list and send me an email, there's a 99% chance that I'll respond to you because I really like writing letters and learning about other people's stories through writing. " +
  'Do you know of this old site back in the day called penpal world? You bet I was a member, hahaha. ' +
  'I loved writing to my penpals from all around the world and i hope i can write to you too.';

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
  /** offer instrumental + a cappella downloads for each track */
  bonus?: boolean;
  /** videos shown on the release's screen (e.g. teasers for a coming-soon release) */
  videos?: { title: string; embed: string }[];
}

export const SPOTIFY_ARTIST = 'https://open.spotify.com/artist/2gEqHMtzOfyjc8hZLsEVbF';
const album = (id: string) => `https://open.spotify.com/album/${id}`;
// Spotify cover art. To self-host instead, drop the file in img/music-artwork and point art at it.
const cover = (id: string) => `https://i.scdn.co/image/${id}`;
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
    bonus: true,
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
    bonus: true,
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
    bonus: true,
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
    bonus: true,
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
    bonus: true,
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
    bonus: true,
  },
  {
    id: 'frustrated',
    name: 'frustrated!!',
    kind: 'SINGLE',
    art: cover('ab67616d0000b273eaba6ee5150bdb1a09abb472'),
    color: '#F4A9A8',
    year: '2026',
    size: 41,
    orbit: 3,
    angle: 75,
    tracks: ['frustrated!!'],
    links: { spotify: album('4SdXq0SMnBPL6XiuDNiKcV'), bandcamp: BANDCAMP },
    bonus: true,
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
  },
];

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
  {
    title: 'Latest uploads',
    kind: 'my channel',
    embed: 'https://www.youtube-nocookie.com/embed/videoseries?list=UUIvz8TjpKD7LWEfOBxW4vFw',
    color: '#F77FA1',
  },
  { title: "You didn't find this video. The SAUCE chose YOU", kind: 'madebit', embed: yt('9Fl2xFhMAUg'), color: '#9DBE3D' },
  // TODO: swap these for your own videos. They're the "videos I like" from the old site.
  { title: 'Videos I like #1', kind: 'favorites', embed: 'https://www.youtube-nocookie.com/embed/cRpdIrq7Rbo?start=11&end=58', color: '#93C78E' },
  { title: 'Videos I like #2', kind: 'favorites', embed: 'https://www.youtube-nocookie.com/embed/X0dCrw6pvnE', color: '#F2B84B' },
  { title: 'Videos I like #3', kind: 'favorites', embed: 'https://www.youtube-nocookie.com/embed/3eRBFkxgG7g', color: '#F4A9A8' },
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
