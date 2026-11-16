// Everything content-related lives here, so updating the site means editing this file.
// Lines marked TODO are placeholders to swap for the real thing.

export const BANDCAMP = 'https://madebit.bandcamp.com/';
export const EMAIL = 'madebitmusic@gmail.com';
export const MAILCHIMP_ACTION =
  'https://madebit.us14.list-manage.com/subscribe/post?u=d920d41bcce61aef97158baf6&id=c3491fafe2';
// Mailchimp's hidden bot-trap field name for this list
export const MAILCHIMP_HONEYPOT = 'b_d920d41bcce61aef97158baf6_c3491fafe2';

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

export const RELEASES: Release[] = [
  {
    id: 'alien',
    name: 'An Alien Among Us',
    kind: 'ALBUM',
    art: 'art/alien.jpg',
    color: '#9DBE3D',
    size: 86,
    x: 500,
    y: 80,
    ring: true,
    // TODO: full track list
    tracks: ['Space', 'Moon Dance', 'A Sound Is Born (Evolution of Self)', '[TRACK]', '[TRACK]'],
    links: { bandcamp: BANDCAMP, spotify: 'https://ffm.to/02kneyp.OWE' },
    bonus: true,
  },
  {
    id: 'virtual-reality',
    name: 'Virtual Reality',
    kind: 'SINGLE',
    art: 'art/virtual-reality.jpg',
    color: '#F77FA1',
    size: 54,
    x: 150,
    y: 110,
    tracks: ['Virtual Reality'],
    links: { spotify: 'https://open.spotify.com/track/4xOajNHxhbgVr0tzHNfXbz', bandcamp: BANDCAMP },
    bonus: true,
  },
  {
    id: 'outdoor-meditations',
    name: 'Outdoor Meditations',
    kind: 'SINGLE',
    art: 'art/outdoor-meditations.jpg',
    color: '#93C78E',
    size: 60,
    x: 110,
    y: 320,
    tracks: ['Outdoor Meditations'],
    links: { spotify: 'https://open.spotify.com/track/2rOCE7SdGMy69cy4tJkX0W', bandcamp: BANDCAMP },
    bonus: true,
  },
  {
    id: 'the-mellow',
    name: 'The Mellow',
    kind: 'SINGLE',
    art: 'art/the-mellow.jpg',
    color: '#F4A9A8',
    size: 48,
    x: 420,
    y: 360,
    tracks: ['The Mellow'],
    links: { soundcloud: 'https://soundcloud.com/madebitmusic/new-age/s-2go3WNpP0uf', bandcamp: BANDCAMP },
    bonus: true,
  },
  {
    id: 'next',
    name: '???',
    kind: 'COMING SOON',
    color: '#187489',
    size: 64,
    x: 590,
    y: 330,
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
  { name: 'Spotify', url: 'https://open.spotify.com/track/4xOajNHxhbgVr0tzHNfXbz', icon: 'spotify' }, // TODO: artist page
  // TODO: { name: 'Apple Music', url: '', icon: 'applemusic' },
  { name: 'Bandcamp', url: BANDCAMP, icon: 'bandcamp' },
  { name: 'SoundCloud', url: 'https://soundcloud.com/madebitmusic', icon: 'soundcloud' },
  { name: 'X', url: 'https://twitter.com/madebitmusic', icon: 'x' },
  { name: 'Email', url: `mailto:${EMAIL}`, icon: 'email' },
];
