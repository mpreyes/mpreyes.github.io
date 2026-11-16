// Everything content-related lives here, so updating the site means editing this file.
// Lines marked TODO are placeholders to swap for the real thing.

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
  /** planet size and position inside the 700x470 solar-system scene */
  size: number;
  x: number;
  y: number;
  ring?: boolean;
  tracks: string[];
  links: StreamLinks;
  /** offer instrumental + a cappella downloads for each track */
  bonus?: boolean;
}

export const SPOTIFY_ARTIST = 'https://open.spotify.com/artist/2gEqHMtzOfyjc8hZLsEVbF';
const album = (id: string) => `https://open.spotify.com/album/${id}`;
// Spotify cover art. To self-host instead, drop the file in img/music-artwork and point art at it.
const cover = (id: string) => `https://i.scdn.co/image/${id}`;

// Singles already on an album or EP are listed under that release, not as their own planet.
export const RELEASES: Release[] = [
  {
    id: 'alien',
    name: 'An Alien Among Us',
    kind: 'ALBUM',
    art: 'art/alien.jpg',
    color: '#9DBE3D',
    size: 86,
    x: 500,
    y: 66,
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
    links: { spotify: album('48VsV9PYq9b6APVSaEue4S'), bandcamp: BANDCAMP },
    bonus: true,
  },
  {
    id: 'mechanics-guide-1',
    name: "A Mechanic's Guide to Throwing a Dance Party",
    kind: 'EP',
    art: cover('ab67616d0000b2730b386e4668bd4c694d5221cc'),
    color: '#F2B84B',
    size: 64,
    x: 420,
    y: 352,
    tracks: ['Deep Down', 'Time Goes On (Silence is Golden)', 'Quest for Self', 'Be my only love'],
    links: { spotify: album('194XpkdJMTSBHrodsNGWtg'), bandcamp: BANDCAMP },
    bonus: true,
  },
  {
    id: 'cmyk',
    name: 'CMYK',
    kind: 'EP',
    art: cover('ab67616d0000b2739c76d13c16e2f0759a58e78d'),
    color: '#F77FA1',
    size: 62,
    x: 120,
    y: 300,
    tracks: ['Virtual Reality', 'The Mellow', 'Something', 'Island Vibes'],
    links: { spotify: album('2tgtUERWbhirxISb20Lk8Q'), bandcamp: BANDCAMP },
    bonus: true,
  },
  {
    id: 'outdoor-meditations',
    name: 'Outdoor Meditations',
    kind: 'SINGLE',
    art: 'art/outdoor-meditations.jpg',
    color: '#93C78E',
    size: 44,
    x: 250,
    y: 92,
    tracks: ['Outdoor Meditations'],
    links: { spotify: album('7cGrEtPfouq3ZOUdi6XOmu'), bandcamp: BANDCAMP },
    bonus: true,
  },
  {
    id: 'demons',
    name: 'demons in me closet (eek)',
    kind: 'SINGLE',
    art: cover('ab67616d0000b273215ba75ddda9a91bb076ffbd'),
    color: '#C8332D',
    size: 40,
    x: 40,
    y: 196,
    tracks: ['demons in me closet (eek)'],
    links: { spotify: album('2wfK3YcXYsZ4YLchyaUT4I'), bandcamp: BANDCAMP },
    bonus: true,
  },
  {
    id: 'blue-screen',
    name: 'blue_screen.mp3',
    kind: 'SINGLE',
    art: cover('ab67616d0000b273b7cc1266220fb4b87d2df250'),
    color: '#187489',
    size: 40,
    x: 630,
    y: 196,
    tracks: ['blue_screen.mp3'],
    links: { spotify: album('48KA494GY09hortwvIwciz'), bandcamp: BANDCAMP },
    bonus: true,
  },
  {
    id: 'frustrated',
    name: 'frustrated!!',
    kind: 'SINGLE',
    art: cover('ab67616d0000b273eaba6ee5150bdb1a09abb472'),
    color: '#F4A9A8',
    size: 40,
    x: 262,
    y: 392,
    tracks: ['frustrated!!'],
    links: { spotify: album('4SdXq0SMnBPL6XiuDNiKcV'), bandcamp: BANDCAMP },
    bonus: true,
  },
  {
    id: 'mechanics-guide-2',
    name: "A Mechanic's Guide to Throwing a Dance Party, Vol. 2",
    kind: 'COMING SOON',
    color: '#5E4B1C',
    size: 54,
    x: 590,
    y: 330,
    tracks: [],
    links: {},
  },
  {
    id: 'duality-of-man',
    name: 'The Duality of Man',
    kind: 'COMING SOON',
    color: '#2E4A36',
    size: 80,
    x: 80,
    y: 66,
    ring: true,
    tracks: [],
    links: {},
  },
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
  // TODO: swap these for your own videos. They're the "videos I like" from the old site.
  { title: 'Videos I like #1', kind: 'favorites', embed: 'https://www.youtube-nocookie.com/embed/cRpdIrq7Rbo?start=11&end=58', color: '#93C78E' },
  { title: 'Videos I like #2', kind: 'favorites', embed: 'https://www.youtube-nocookie.com/embed/X0dCrw6pvnE', color: '#F2B84B' },
  { title: 'Videos I like #3', kind: 'favorites', embed: 'https://www.youtube-nocookie.com/embed/3eRBFkxgG7g', color: '#F4A9A8' },
];

export interface MerchItem {
  name: string;
  price: string;
  color: string;
  shape: 'tee' | 'stickers' | 'tape' | 'pack';
  url: string;
}

// TODO: real items + prices once they're up on Bandcamp
export const MERCH: MerchItem[] = [
  { name: '[TEE]', price: '[PRICE]', color: '#F77FA1', shape: 'tee', url: BANDCAMP },
  { name: '[STICKERS]', price: '[PRICE]', color: '#F2B84B', shape: 'stickers', url: BANDCAMP },
  { name: '[CASSETTE]', price: '[PRICE]', color: '#187489', shape: 'tape', url: BANDCAMP },
  { name: 'Instrumental + a cappella pack', price: '[PRICE]', color: '#9DBE3D', shape: 'pack', url: BANDCAMP },
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
