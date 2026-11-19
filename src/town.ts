import { sfx } from './sound';

// Madelyn's Town: a little island map drawn in SVG. Click a place and pixel-me
// walks there along the road, then a card offers a link out.

type Pt = { x: number; y: number };
type Box = { l: number; r: number; t: number; b: number };
type Place = {
  id: 'akta' | 'mash' | 'madebit' | 'farm';
  name: string;
  sub: string;
  href: string;
  x: number;
  y: number;
  door: Pt;
  box?: Box;
};
type Palette = Record<string, string>;

const NS = 'http://www.w3.org/2000/svg';
const K = '#111';
const W = 1440;
const SHIFT = 80; // the island's old 1280 layout, centred in the wider canvas
const WIDE = 1.15; // how much wider the island is than it was
const H = 800;
const CENTER: Pt = { x: 640, y: 420 };
const BIG = 1.5; // buildings are drawn small and scaled up
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

export const PLACES: Place[] = [
  { id: 'akta', name: 'AKTA', sub: 'singles events in Nashville', href: 'https://aktadating.com', x: 285, y: 270, door: { x: 0, y: 0 } },
  { id: 'mash', name: 'M.A.S.H.', sub: 'a fortune telling story game', href: 'https://mpreyes.github.io/mash-adventure-web/', x: 960, y: 250, door: { x: 0, y: 0 } },
  { id: 'madebit', name: 'MADEBIT', sub: 'my music', href: 'https://madebit.studio', x: 318, y: 580, door: { x: 0, y: 0 } },
  { id: 'farm', name: 'THE FARM', sub: 'coming soon', href: '', x: 905, y: 560, door: { x: 0, y: 0 } },
];

// ---------- pixel art (one letter per pixel, '.' is empty) ----------
const ME = ['.....PPPPPP.....', '....PHHHHHHP....', '...HHHHHHHHHH...', '..HHHHHHHHHHHH..', '.PPHSSSSSSSSHPP.', '.PPSSESSSSESSPP.', '.PPSSSSSSSSSSPP.', '..HSSSSMMSSSSH..', '..HHSSSSSSSSHH..', '..HHH.SSSS.HHH..', '...HTTTTTTTTH...', '..TTTTTTTTTTTT..', '.STTTTTTTTTTTTS.', '.STTTTTTTTTTTTS.', '..TTTTTTTTTTTT..', '...DDDDDDDDDD...', '...DDDD..DDDD...', '...DDDD..DDDD...', '...BBBB..BBBB...', '..BBBBB..BBBBB..'];
const ME_SIT = ['.....PPPPPP.....', '....PHHHHHHP....', '...HHHHHHHHHH...', '..HHHHHHHHHHHH..', '.PPHSSSSSSSSHPP.', '.PPSSESSSSESSPP.', '.PPSSSSSSSSSSPP.', '..HSSSSMMSSSSH..', '..HHSSSSSSSSHH..', '..HHH.SSSS.HHH..', '...HTTTTTTTTH...', '..TTTTTTTTTTTT..', '.STTTTTTTTTTTTS.', '.STTTTTTTTTTTTS.', '..TTTTTTTTTTTT..', '...DDDDDDDDDDDD.', '...DDDDDDDDDDDDD', '............BBB'];
const ME_STEP = ME.slice(0, 15).concat(['...DDDDDDDDDD...', '....DDDD.DDDD...', '...DDDD...DDD...', '...BBBB...BBB...', '..BBBBB...BBBB..']);
const ME_C: Palette = { H: '#2A1B1B', S: '#D39A72', E: K, P: '#F77FA1', T: '#9DBE3D', D: '#187489', B: K, M: '#8A4A3A' };
const AKTA = ['....KKKKKKKK....', '...KPPPPPPPPK...', '..KPPPPPPPPPPK..', '.KKKKKKKKKKKKKK.', '.KCCCCCCCCCCCCK.', '.KCKKKKCCRRCRCK.', '.KCKWWKCCRRRRCK.', '.KCKWWKCCCRRCCK.', '.KCKKKKCCCCCCCK.', '.KCCCCCKKKKCCCK.', '.KCCCCCKYYKCCCK.', '.KCCCCCKYYKCCCK.', '.KKKKKKKKKKKKKK.'];
const AKTA_C: Palette = { K, P: '#F77FA1', C: '#F8F6EF', R: '#C8332D', W: '#9FD3E8', Y: '#F2B84B' };
const TENT = ['.......K........', '......KYK.......', '.....KPYPK......', '....KPPYPPK.....', '...KPPYYYPPK....', '..KPPPYKYPPPK...', '.KPPPYKKKYPPPK..', 'KPPPPYKKKYPPPPK.', 'KKKKKKKKKKKKKKK.'];
const TENT_C: Palette = { K, Y: '#F2B84B', P: '#796AD8' };
const STUDIO = ['KKKKKKKKKKKKKK', 'KGGGGGGGGGGGGK', 'KGKKKKKKKKKKGK', 'KGKWWWWWWWWKGK', 'KGKWKKKWWKWKGK', 'KGKWWWWWWWWKGK', 'KGKKKKKKKKKKGK', 'KGGGGGGGGGGGGK', 'KGGKKKGGGGGGGK', 'KGGKYKGGGNNGGK', 'KGGKKKGGGNNGGK', 'KKKKKKKKKKKKKK'];
const STUDIO_C: Palette = { K, G: '#93C78E', W: '#F8F6EF', Y: '#F2B84B', N: '#187489' };
const BARN = ['......KKKK......', '....KKRRRRKK....', '..KKRRRRRRRRKK..', '.KRRRRWWWWRRRRK.', 'KRRRRRWKKWRRRRRK', 'KRRRRRWWWWRRRRRK', 'KRRWWWWWWWWWWRRK', 'KRRWKRRRRRRKWRRK', 'KRRWRKRRRRKRWRRK', 'KRRWRRKRRKRRWRRK', 'KRRWRRRKKRRRWRRK', 'KKKKKKKKKKKKKKKK'];
const BARN_C: Palette = { K, R: '#C8332D', W: '#F8F6EF' };
const NOTE = ['...KKK', '...K.K', '...K..', 'KKKK..', 'KKKK..', '.KK...'];
const TREE = ['..KKKK..', '.KGGGGK.', 'KGGLGGGK', 'KGGGGLGK', '.KGGGGK.', '..KBBK..', '...BB...'];
const TREE_C: Palette = { K, G: '#5E9A4A', L: '#86C06A', B: '#8A4A3A' };
const PINE = ['...KK...', '..KGGK..', '..KGGK..', '.KGGLGK.', '.KGLGGK.', 'KGGGGGLK', 'KKKBBKKK', '...BB...'];
const PINE_C: Palette = { K, G: '#2F6B3A', L: '#3F8A4A', B: '#8A4A3A' };
const CARROT = ['.G..G.', '..GG..', '.GGGG.', '.OOOO.', '.OKOO.', '..OO..', '..OK..', '...O..'];
const CARROT_C: Palette = { G: '#4E9A3A', O: '#F28C28', K: '#C9661A' };
const GREENHOUSE = ['.....KKKKKKKK.....', '...KKBBKBBKBBKK...', '..KBBBBKBBKBBBBK..', '.KBBBBBKBBKBBBBBK.', 'KKKKKKKKKKKKKKKKKK', 'KBBBBKBBBBBKBBBBBK', 'KBPBBKBGGBBKBBPBBK', 'KGGGBKBGGGBKBGGGBK', 'KGGGGKBKKKBKGGGGGK', 'KGGGGKBKDKBKGGGGGK', 'KKKKKKKKKKKKKKKKKK'];
const GREENHOUSE_C: Palette = { K, B: '#CFEFF7', G: '#5E9A4A', P: '#F77FA1', D: '#F2B84B' };
const FLOWER = ['.P.', 'PYP', '.P.', '.G.', 'GG.'];
const LAMP = ['.KKK.', 'KYYYK', 'KYYYK', '.KKK.', '..K..', '..K..', '..K..', '..K..', '..K..', '..K..', '..K..', '..K..', '..K..', '..K..', '..K..', '..K..', '..K..', '..K..', '..K..', '..K..', '.KKK.', 'KKKKK'];
const BENCH = ['KKKKKKKKKKKKKKKKKK', 'KWWWWWWWWWWWWWWWWK', 'KKKKKKKKKKKKKKKKKK', '.K..............K.', 'KKKKKKKKKKKKKKKKKK', 'KWWWWWWWWWWWWWWWWK', 'KKKKKKKKKKKKKKKKKK', '.K..............K.', '.K..............K.'];
const WELL = ['...KKKKKK...', '..KRRRRRRK..', '.KRRRRRRRRK.', 'KKKKKKKKKKKK', '.KK......KK.', '.KK..K...KK.', '.KK..K...KK.', '.KK..B...KK.', 'KKKKKKKKKKKK', 'KSSKSSKSSKSK', 'KSKSSKSSKSSK', 'KKKKKKKKKKKK'];
const WELL_C: Palette = { K, R: '#C8332D', B: '#8A4A3A', S: '#B9B4A6' };
const LUNA = ['..........K.K.', '.........KBKBK', 'KK......KBBBBK', 'KBK.....KBWEWK', '.KBKKKKKBBWWWK', '..KBBBBBBBWWNK', '..KBBBBBBWWWK.', '..KWWWWWWWWK..', '..KWK.KWKKWK..', '..KK..KK.KK...'];
const LUNA_PEE = ['..........K.K.', '.........KBKBK', 'KK......KBBBBK', 'KBK.....KBWEWK', '.KBKKKKKBBWWWK', '.KKBBBBBBBWWNK', 'KWKBBBBBBWWWK.', 'KW.WWWWWWWWK..', '.....KWKKWK...', '.....KK.KK....'];
const LUNA_STEP = LUNA.slice(0, 8).concat(['.KWK..KWK.KWK.', '.KK...KK..KK..']);
const LUNA_C: Palette = { K, B: '#8A5A3A', W: '#F3EBDD', E: '#5FA9CC', N: K };
const LAPTOP = ['KKKKKKKKKKKKKK', 'KDDDDDDDDDDDDK', 'KDGGGDDDDDDDDK', 'KDDPPPPPDDDDDK', 'KDDDGGGGDDDDDK', 'KDYYDDDDDDDDDK', 'SLLLLLLLLLLLLS', '.LLLLLLLLLLLL.'];
const LAPTOP_2 = ['KKKKKKKKKKKKKK', 'KDDPPPPDDDDDDK', 'KDDDGGGGGDDDDK', 'KDYYYDDDDDDDDK', 'KDGGGDDDDDDDDK', 'KDDPPPPPPDDDDK', 'SLLLLLLLLLLLLS', '.LLLLLLLLLLLL.'];
const LAPTOP_C: Palette = { K, D: '#1E2A38', G: '#93C78E', P: '#F77FA1', Y: '#F2B84B', L: '#B9C2CC', S: '#D39A72' };
const BOOMBOX = ['....KKKKKK....', '...K......K...', 'KKKKKKKKKKKKKK', 'KRRRRRRRRRRRRK', 'KRKKKRYYRKKKRK', 'KRKWKRRRRKWKRK', 'KRKKKRYYRKKKRK', 'KRRRRRRRRRRRRK', 'KKKKKKKKKKKKKK'];
const CASA = [
  '.......KKKKKKKKK.......', '.....KKRRRRRRRRRKK.....', '...KKRRRRRRRRRRRRRKK...', '.KKRRRRRRRRRRRRRRRRRKK.', 'KKKKKKKKKKKKKKKKKKKKKKK',
  // upstairs
  'KGGGGGGGGGGGGGGGGGGGGGK', 'KGKKKKGGGGGGGGGGKKKKGGK', 'KGKWWKGGGGKKKGGGKWWKGGK', 'KGKWWKGGGGKWKGGGKWWKGGK', 'KGKKKKGGGGKKKGGGKKKKGGK', 'KGPPPPGGGGGGGGGGPPPPGGK',
  'KKKKKKKKKKKKKKKKKKKKKKK',
  // downstairs
  'KGGGGGGGGGGGGGGGGGGGGGK', 'KGKKKKGGGGKKKGGGKKKKGGK', 'KGKWWKGGGGKYKGGGKWWKGGK', 'KGKWWKGGGGKYKGGGKWWKGGK', 'KGKKKKGGGGKYKGGGKKKKGGK', 'KGGPPGGGGGKYKGGGGPPGGGK', 'KGGGGGGGGGKYKGGGGGGGGGK', 'KKKKKKKKKKKKKKKKKKKKKKK'];
const CASA_C: Palette = { K, R: '#C8332D', G: '#7DC07A', W: '#9FD3E8', Y: '#B98B5E', P: '#F77FA1' };
// family members are drawn the same size as her (same body), with their own hair and shirts
const BODY = ['...HTTTTTTTTH...', '..TTTTTTTTTTTT..', '.STTTTTTTTTTTTS.', '.STTTTTTTTTTTTS.', '..TTTTTTTTTTTT..', '...DDDDDDDDDD...', '...DDDD..DDDD...', '...DDDD..DDDD...', '...BBBB..BBBB...', '..BBBBB..BBBBB..'];
// a camera on a tripod, lens pointing left at the family
const CAMERA = ['..KKK.....', 'KKKKKKKKKK', 'KLKGGGGGRK', 'KLLKGGGGGK', 'KLKGGGGGGK', 'KKKKKKKKKK', '....KK....', '...K..K...', '..K....K..', '.K......K.', 'K........K'];
const LONG_HAIR = ['.....HHHHHH.....', '....HHHHHHHH....', '...HHHHHHHHHH...', '..HHHHHHHHHHHH..', '..HHSSSSSSSSHH..', '..HSSESSSSESSH..', '..HSSSSSSSSSSH..', '..HSSSSMMSSSSH..', '..HHSSSSSSSSHH..', '..HHH.SSSS.HHH..'].concat(BODY);
const TALL = (rows: string[]) => rows.slice(0, 12).concat([rows[12]], rows.slice(12, 16), [rows[16], rows[16]], rows.slice(17));
const SHORT_HAIR = ['.....HHHHHH.....', '....HHHHHHHH....', '...HHHHHHHHHH...', '...HHHHHHHHHH...', '...HSSSSSSSSH...', '...SSESSSSESS...', '...SSSSSSSSSS...', '...SSSSMMSSSS...', '....SSSSSSSS....', '......SSSS......'].concat(BODY.map((r, i) => (i === 0 ? '....TTTTTTTT....' : r)));
const HEART = ['.KK.KK.', 'KPPKPPK', 'KPPPPPK', '.KPPPK.', '..KPK..', '...K...'];
// an open book held up in front of her: two white pages with lines, pink cover underneath
const BOOK = ['SPPPPPPPKPPPPPPPS', 'PWLLLLLWKWLLLLLWP', 'PWWWWWWWKWWWWWWWP', 'PWLLLLWWKWLLLLWWP', 'PWWWWWWWKWWWWWWWP', 'PWLLLLLWKWLLLLLWP', 'PWWWWWWWKWWWWWWWP', '.PPPPPPP.PPPPPPP.'];
const BOOK_C: Palette = { K: '#C9B9A6', W: '#FFFDF5', L: '#B9C2CC', P: '#C8332D', S: '#D39A72' };
const BOOK_TURN = ['SPPPPPPPKPPPPPPPS', 'PWLLLLLWKWLLLLLWP', 'PWWWWWWWKWWWWWWWP', 'PWLLLLWWKWWLLLWWP', 'PWWWWWWWKPWWWWWP.', 'PWLLLLLWK.PWLLWP.', 'PWWWWWWWK..PWWWP.', '.PPPPPPP.....PP..'];
const SQUIRREL = ['.....KK.', '....KBBK', 'KK.KBBBK', 'KBKBBBK.', '.KBBBBK.', '..K.K...'];
const NUT = ['.KK.', 'KCCK', 'KNNK', 'KNNK', '.KK.'];
const COIN = ['.KKK.', 'KYYYK', 'KYWYK', 'KYYYK', '.KKK.'];
const SHARK = ['.......KK.......', '......KGGK......', 'K....KGGGGKKKKK.', 'KGKKKGGGGGGGGEGK', 'KGGGGGGGGGGGGGGK', 'KGKKWWWWWWWWWKK.', 'K...KKKKKKKKK...'];
const SHARK_C: Palette = { K, G: '#6E7C8C', W: '#E8EEF2', E: '#fff' };
const MOUNTAIN = ['.........KK.........', '........KWWK........', '.......KWWWWK.......', '......KWWKWWWK......', '.....KGWKGKWWGK.....', '....KGGKGGGKGGGK....', '...KGGGGGDGGGGGGK...', '..KGGDGGGGGGGDGGGK..', '.KGGGGGGDGGGGGGGGGK.', 'KGGGGGGGGGGGGGDGGGGK'];
const MOUNTAIN_C: Palette = { K, W: '#FFFFFF', G: '#8E9AAE', D: '#6F7B90' };

// ---------- helpers ----------
function el<T extends SVGElement = SVGElement>(tag: string, attrs: Record<string, string | number> = {}, parent?: Element): T {
  const e = document.createElementNS(NS, tag) as T;
  for (const k in attrs) e.setAttribute(k, String(attrs[k]));
  parent?.appendChild(e);
  return e;
}
function pix(rows: string[], cols: Palette, x: number, y: number, s: number, parent: Element): SVGGElement {
  const g = el<SVGGElement>('g', { 'shape-rendering': 'crispEdges' }, parent);
  rows.forEach((row, j) => {
    let i = 0;
    while (i < row.length) {
      const ch = row[i];
      if (ch === '.') { i++; continue; }
      let n = 1;
      while (row[i + n] === ch) n++;
      el('rect', { x: x + i * s, y: y + j * s, width: n * s, height: s, fill: cols[ch] }, g);
      i += n;
    }
  });
  return g;
}
let seed = 7;
const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;

/** A wobbly closed outline around (cx, cy), with optional bays cut into it. */
function coast(cx: number, cy: number, rx: number, ry: number, wob: number, n = 64, bays: { a: number; depth: number; w: number }[] = []): string {
  return smooth(coastPoints(cx, cy, rx, ry, wob, n, bays));
}
function coastPoints(cx: number, cy: number, rx: number, ry: number, wob: number, n = 64, bays: { a: number; depth: number; w: number }[] = []): [number, number][] {
  const pts: [number, number][] = [];
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2;
    let r = 1 + wob * (Math.sin(a * 3 + 1.3) * 0.5 + Math.sin(a * 5 + 0.4) * 0.3 + Math.sin(a * 9) * 0.15);
    for (const b of bays) { const d = Math.atan2(Math.sin(a - b.a), Math.cos(a - b.a)); r -= b.depth * Math.exp(-(d * d) / (2 * b.w * b.w)); }
    pts.push([cx + Math.cos(a) * rx * r, cy + Math.sin(a) * ry * r]);
  }
  return pts;
}
/** Point-in-polygon (works even before the page is drawn, unlike isPointInFill). */
function inside(pts: [number, number][], x: number, y: number) {
  let hit = false;
  for (let i = 0, j = pts.length - 1; i < pts.length; j = i++) {
    const [xi, yi] = pts[i], [xj, yj] = pts[j];
    if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) hit = !hit;
  }
  return hit;
}
function smooth(p: [number, number][]): string {
  let d = `M${p[0][0].toFixed(1)} ${p[0][1].toFixed(1)}`;
  for (let i = 0; i < p.length; i++) {
    const p0 = p[(i - 1 + p.length) % p.length], p1 = p[i], p2 = p[(i + 1) % p.length], p3 = p[(i + 2) % p.length];
    d += ` C${(p1[0] + (p2[0] - p0[0]) / 6).toFixed(1)} ${(p1[1] + (p2[1] - p0[1]) / 6).toFixed(1)} ${(p2[0] - (p3[0] - p1[0]) / 6).toFixed(1)} ${(p2[1] - (p3[1] - p1[1]) / 6).toFixed(1)} ${p2[0].toFixed(1)} ${p2[1].toFixed(1)}`;
  }
  return d + 'Z';
}
/** The road from the middle of the island to a building's door. */
function roadPath(p: Place): string {
  const mx = (CENTER.x + p.door.x) / 2;
  const my = (CENTER.y + p.door.y) / 2 + (p.door.y < CENTER.y ? -30 : 30);
  return `M${CENTER.x} ${CENTER.y} Q${mx} ${my} ${p.door.x} ${p.door.y}`;
}

/** The area each building's art covers before scaling (matches building() below). */
function artBounds(p: Place) {
  const [l, t, r, b] = {
    akta: [p.x - 46, p.y - 38, p.x + 146, p.y + 58],
    mash: [p.x - 60, p.y - 50, p.x + 52, p.y + 53],
    madebit: [p.x - 40, p.y - 88, p.x + 122, p.y + 24],
    farm: [p.x - 130, p.y - 85, p.x + 68, p.y + 58],
  }[p.id];
  return { x: l, y: t, width: r - l, height: b - t };
}

// ---------- the map ----------
export function mountTown(svg: SVGSVGElement, onArrive: (p: Place) => void, onLeave: () => void, onCoins: (n: number) => void = () => {}, onPhoto: (png: string) => void = () => {}) {
  const ISLAND = { cx: 640, cy: 420, rx: 520 * WIDE, ry: 330 };
  let root!: SVGGElement;
  const wx = (x: number) => 640 + (x - 640) * WIDE; // spread an x out to the wider island
  let shore: [number, number][] = [];

  function paper() {
    const defs = el('defs', {}, svg);
    const small = el('pattern', { id: 'g', width: 24, height: 24, patternUnits: 'userSpaceOnUse' }, defs);
    el('path', { d: 'M24 0H0V24', fill: 'none', stroke: '#cfdbe7' }, small);
    const big = el('pattern', { id: 'G', width: 120, height: 120, patternUnits: 'userSpaceOnUse' }, defs);
    el('path', { d: 'M120 0H0V120', fill: 'none', stroke: '#b8c9da', 'stroke-width': 1.5 }, big);
    // the graph paper itself is the page background (styles.css), so it runs edge to edge
    root = el<SVGGElement>('g', { transform: `translate(${SHIFT} 0)` }, svg);
  }

  function island() {
    seed = 11;
    shore = coastPoints(ISLAND.cx, ISLAND.cy, ISLAND.rx, ISLAND.ry, 0.09, 72, [{ a: 0.55, depth: 0.22, w: 0.18 }, { a: 3.6, depth: 0.12, w: 0.14 }]);
    const main = smooth(shore);
    // the sea, deep at the edge, with little wave marks
    el('path', { d: main, fill: 'none', stroke: '#BFE3F2', 'stroke-width': 150, 'stroke-linejoin': 'round' }, root);
    el('path', { d: main, fill: 'none', stroke: '#9CD2EA', 'stroke-width': 80, 'stroke-linejoin': 'round' }, root);
    el('path', { d: main, fill: 'none', stroke: '#E3F4FA', 'stroke-width': 26, 'stroke-linejoin': 'round' }, root);
    seed = 4;
    for (let i = 0; i < 26; i++) {
      const a = rnd() * Math.PI * 2, r = 1.12 + rnd() * 0.08;
      const x = ISLAND.cx + Math.cos(a) * ISLAND.rx * r, y = ISLAND.cy + Math.sin(a) * ISLAND.ry * r;
      el('path', { d: `M${x} ${y} q5 -5 10 0 q5 5 10 0`, fill: 'none', stroke: '#5FA9CC', 'stroke-width': 2, 'stroke-linecap': 'round' }, root);
    }
    // beach rim, then lush green, kept inside the island
    el('path', { d: main, fill: '#EBDDB0', stroke: K, 'stroke-width': 3 }, root);
    const inset = 'translate(640 420) scale(.955) translate(-640 -420)';
    const clip = el('clipPath', { id: 'islandClip' }, svg.querySelector('defs')!);
    el('path', { d: main, transform: inset }, clip);
    const greens = el('g', { 'clip-path': 'url(#islandClip)' }, root);
    el('path', { d: main, fill: '#8CC56E', transform: inset }, greens);
    const patches: [number, number, number, number, string][] = [[420, 330, 230, 140, '#9DD07E'], [880, 340, 220, 130, '#7DB860'], [520, 580, 240, 110, '#7DB860'], [880, 580, 190, 100, '#9DD07E'], [640, 430, 160, 90, '#A9D88A'], [260, 470, 110, 160, '#76B25A'], [1050, 430, 90, 150, '#76B25A']];
    patches.forEach(([x, y, rx, ry, c], i) => { seed = 30 + i; el('path', { d: coast(wx(x), y, rx * WIDE, ry, 0.2, 28), fill: c, opacity: 0.85 }, greens); });
    seed = 99;
    grassAndFlowers(220);
    // mountains up north, with a waterfall into a little lake
    seed = 61;
    const lake = el<SVGAElement>('a', { href: '#', class: 'spot', 'aria-label': 'Go for a swim in the lake' }, root);
    el('path', { d: coast(640, 300, 70, 30, 0.15, 24), fill: '#7FC4E4', stroke: K, 'stroke-width': 2.5 }, lake);
    [[610, 300, 18], [668, 310, 8]].forEach(([x, y]) => el('path', { d: `M${x} ${y} q8 -4 16 0`, fill: 'none', stroke: '#fff', 'stroke-width': 2 }, lake));
    lake.addEventListener('click', (e) => { e.preventDefault(); go('lake', swim); });
    const peaks = el<SVGAElement>('a', { href: '#', class: 'spot', 'aria-label': 'Climb the mountain' }, root);
    pix(MOUNTAIN, MOUNTAIN_C, 440, 100, 10, peaks);
    pix(MOUNTAIN, MOUNTAIN_C, 790, 120, 8, peaks);
    pix(MOUNTAIN, MOUNTAIN_C, 580, 60, 13, peaks);
    peaks.addEventListener('click', (e) => { e.preventDefault(); go('mountain', summit); });
    el('rect', { x: 690, y: 190, width: 12, height: 94, fill: '#9FD3E8', stroke: K, 'stroke-width': 2 }, root);
    for (let i = 0; i < 5; i++) el('rect', { x: 693, y: 196 + i * 18, width: 6, height: 7, fill: '#fff' }, root);
    shark();
  }

  const onLand = (x: number, y: number) => inside(shore, x, y);

  function grassAndFlowers(n: number) {
    for (let i = 0; i < n; i++) {
      const x = 20 + rnd() * 1240, y = 120 + rnd() * 600;
      if (!onLand(x, y) || !onLand(x, y + 14)) continue;
      if (PLACES.some((p) => Math.hypot(p.x + 40 - x, p.y + 30 - y) < 120) || Math.hypot(CENTER.x - x, CENTER.y - y) < 90 || (x > 520 && x < 780 && y > 440 && y < 620)) continue;
      const r = rnd();
      if (r < 0.55) el('path', { d: `M${x} ${y} l3 -7 l3 7 l3 -6 l3 6`, fill: 'none', stroke: '#3F7F3A', 'stroke-width': 2, 'stroke-linejoin': 'round' }, root);
      else if (r < 0.95) el('circle', { cx: x, cy: y, r: 3, fill: ['#F77FA1', '#F2B84B', '#fff'][i % 3], stroke: K, 'stroke-width': 1 }, root);
      else el('ellipse', { cx: x, cy: y, rx: 7, ry: 4, fill: '#cfc3a6', stroke: K, 'stroke-width': 1.2 }, root);
    }
  }

  // a shark fin, just chilling in the water
  // a shark fin, just chilling in the water. Click him and he jumps.
  function shark() {
    const link = el<SVGAElement>('a', { href: '#', class: 'spot', 'aria-label': 'Say hi to the shark' }, root);
    const g = el('g', { transform: 'translate(-6 470)' }, link);
    const bob = el('g', {}, g);
    const fin = el('g', {}, bob);
    el('path', { d: 'M-26 6 q12 -4 26 0 q14 4 26 0', fill: 'none', stroke: '#fff', 'stroke-width': 3, 'stroke-linecap': 'round' }, fin);
    el('path', { d: 'M-12 4 L4 -24 Q8 -10 14 4 Z', fill: '#6E7C8C', stroke: K, 'stroke-width': 2.5, 'stroke-linejoin': 'round' }, fin);
    el('path', { d: 'M2 -16 L6 -4', stroke: '#9AA8B6', 'stroke-width': 2 }, fin);
    el('rect', { x: -40, y: -40, width: 80, height: 60, fill: 'transparent' }, g); // easier to click
    let leaping = false;
    link.addEventListener('click', async (e) => {
      e.preventDefault();
      if (leaping) return;
      leaping = true;
      fin.style.display = 'none';
      sfx.splash();
      const body = el<SVGGElement>('g', {}, g);
      pix(SHARK, SHARK_C, -40, -18, 5, body);
      const t0 = performance.now(), dur = reduced ? 300 : 1300;
      let chomped = false;
      await new Promise<void>((done) => {
        const frame = (now: number) => {
          const t = Math.min(1, (now - t0) / dur);
          if (t > 0.5 && !chomped) { sfx.chomp(); chomped = true; }
          body.setAttribute('transform', `translate(${-30 + 60 * t} ${-130 * 4 * t * (1 - t)}) rotate(${-40 + 80 * t})`);
          if (t < 1) requestAnimationFrame(frame); else done();
        };
        requestAnimationFrame(frame);
      });
      body.remove();
      sfx.splash();
      fin.style.display = '';
      leaping = false;
    });
    if (reduced) return;
    const t0 = performance.now();
    const tick = (now: number) => {
      const t = (now - t0) / 1000;
      bob.setAttribute('transform', `translate(${Math.sin(t * 0.6) * 6} ${Math.sin(t * 1.4) * 2.5})`);
      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }

  function sign(parent: Element, x: number, y: number, text: string) {
    const w = text.length * 11 + 30;
    el('rect', { x: x - w / 2 + 4, y: y + 4, width: w, height: 34, fill: K }, parent);
    el('rect', { class: 'signbox', x: x - w / 2, y, width: w, height: 34, fill: '#F8F6EF', stroke: K, 'stroke-width': 3 }, parent);
    el('path', { d: `M${x - 8} ${y + 34} L${x} ${y + 47} L${x + 8} ${y + 34}`, fill: '#F8F6EF', stroke: K, 'stroke-width': 3 }, parent);
    const t = el('text', { x, y: y + 23, 'text-anchor': 'middle', 'font-family': "'Press Start 2P', monospace", 'font-size': 12, fill: K }, parent);
    t.textContent = text;
  }

  function building(p: Place) {
    const link = el<SVGAElement>('a', { href: '#', class: 'spot', 'aria-label': `Walk to ${p.name}` }, root);
    const lift = el('g', { class: 'lift' }, link);
    const g = el<SVGGElement>('g', {}, lift);
    if (p.id === 'akta') {
      for (const px of [p.x - 44, p.x + 136]) {
        el('rect', { x: px, y: p.y - 34, width: 8, height: 92, fill: '#8A4A3A', stroke: K, 'stroke-width': 2 }, g);
        el('rect', { x: px - 2, y: p.y - 38, width: 12, height: 6, fill: '#F2B84B', stroke: K, 'stroke-width': 2 }, g);
      }
      el('path', { d: `M${p.x - 40} ${p.y - 30} Q${p.x + 50} ${p.y} ${p.x + 140} ${p.y - 30}`, fill: 'none', stroke: K, 'stroke-width': 2 }, g);
      for (let i = 1; i < 8; i++) {
        const t = i / 8, bx = p.x - 40 + 180 * t, by = p.y - 30 + 60 * t * (1 - t);
        el('circle', { cx: bx, cy: by + 3, r: 5, fill: ['#F2B84B', '#F77FA1', '#9FD3E8'][i % 3], stroke: K, 'stroke-width': 1.5 }, g);
      }
      pix(AKTA, AKTA_C, p.x, p.y - 20, 6, g);
    } else if (p.id === 'mash') {
      pix(TENT, TENT_C, p.x - 60, p.y - 10, 7, g);
      [[0, 0], [30, -14], [58, 4]].forEach(([dx, dy]) => el('path', { d: `M${p.x - 30 + dx} ${p.y - 30 + dy}l2 4 4 2-4 2-2 4-2-4-4-2 4-2z`, fill: '#F2B84B', stroke: K }, g));
    } else if (p.id === 'madebit') {
      pix(STUDIO, STUDIO_C, p.x - 40, p.y - 60, 7, g);
      pix(NOTE, { K: '#187489' }, p.x + 70, p.y - 70, 4, g);
      pix(NOTE, { K: '#187489' }, p.x + 104, p.y - 88, 3, g);
    } else {
      pix(BARN, BARN_C, p.x - 130, p.y - 14, 6, g);
      const fieldLink = el<SVGAElement>('a', { href: '#', class: 'spot', 'aria-label': 'Dig up a carrot' }, root);
      // the hover lift goes on a wrapper: a CSS transform on the scaled group would undo its scale
      field = el<SVGGElement>('g', {}, el('g', { class: 'lift' }, fieldLink));
      for (let i = 0; i < 5; i++) {
        el('rect', { x: p.x - 42, y: p.y - 80 + i * 14, width: 110, height: 7, fill: '#7A5A3A' }, field);
        for (let j = 0; j < 8; j++) el('rect', { x: p.x - 38 + j * 14, y: p.y - 85 + i * 14, width: 6, height: 6, fill: '#5E9A4A' }, field);
      }
      fieldLink.addEventListener('click', (e) => { e.preventDefault(); go('carrot', dig); });
    }
    // scale the art up from its bottom centre, then hang the sign above it.
    // (Bounds are worked out from the art itself, not getBBox, which reads 0
    // when the page loads hidden, e.g. in a background tab or an iframe.)
    const bb = artBounds(p), cx = bb.x + bb.width / 2, by = bb.y + bb.height;
    const grow = `translate(${cx} ${by}) scale(${BIG}) translate(${-cx} ${-by})`;
    g.setAttribute('transform', grow);
    if (p.id === 'farm' && field) {
      field.setAttribute('transform', grow);
      // she digs at the front edge of the field
      const fx = p.x + 13, fy = p.y - 10;
      digSpot = { x: cx + (fx - cx) * BIG, y: by + (fy - by) * BIG };
    }
    const top = by - bb.height * BIG;
    sign(lift, cx, top - 52, p.name);
    p.box = { l: cx - (bb.width * BIG) / 2, r: cx + (bb.width * BIG) / 2, t: top, b: by };
    p.door = { x: cx - (p.id === 'farm' ? bb.width * 0.27 * BIG : 0), y: by + 26 };
    link.addEventListener('click', (e) => { e.preventDefault(); walkTo(p); });
  }

  function trees(layer: Element) {
    const spots: [number, number][] = [[220, 330], [250, 380], [600, 190], [1060, 420], [1090, 460], [300, 650], [740, 660], [780, 680], [520, 680], [190, 480], [1100, 300], [700, 560]];
    seed = 77;
    const clusters: [number, number, number][] = [[200, 400, 14], [1080, 440, 12], [300, 230, 6], [1000, 240, 6], [600, 690, 10], [760, 690, 8], [160, 560, 7], [1120, 560, 7], [430, 690, 6]];
    clusters.forEach(([cx, cy, n]) => { for (let i = 0; i < n; i++) spots.push([cx + (rnd() - 0.5) * 170, cy + (rnd() - 0.5) * 110]); });
    spots.forEach((s) => { s[0] = wx(s[0]); });
    spots.sort((a, b) => a[1] - b[1]).forEach(([x, y], i) => {
      if (PLACES.some((p) => p.box && x > p.box.l - 64 && x < p.box.r + 10 && y > p.box.t - 90 && y < p.box.b + 20)) return;
      if (x > 700 && x < 860 && y > 230 && y < 360) return; // the wishing well
      if (x > 1060 && x < 1200 && y > 230 && y < 370) return; // Luna's tree
      if (x > 960 && x < 1110 && y > 190 && y < 330) return; // a little space beside the tent
      if (x > 330 && x < 790 && y > 500 && y < 740) return; // the family's house and the photo spot
      if (x > 400 && x < 960 && y < 310) return; // keep the mountains and lake clear
      if (x > 470 && x < 800 && y > 360 && y < 640) return; // and the town centre
      if (!(onLand(x + 32, y + 60) && onLand(x - 10, y) && onLand(x + 74, y))) return;
      const pine = i % 3 === 0;
      const tree = pix(pine ? PINE : TREE, pine ? PINE_C : TREE_C, x, y, 8, layer);
      if (i % 3 === 1) { // only some trees have something in them
        tree.classList.add('tree');
        tree.addEventListener('click', () => shakeTree(tree, x, y));
      }
    });
  }

  // Tap a tree: it shakes, and out comes a squirrel, a nut, or (sometimes) a coin.
  function shakeTree(tree: SVGGElement, x: number, y: number) {
    tree.animate?.([{ transform: 'translateX(0)' }, { transform: 'translateX(-3px)' }, { transform: 'translateX(3px)' }, { transform: 'translateX(0)' }], { duration: 240 });
    const r = Math.random();
    if (r < 0.35) coinFrom(x + 24, y + 10);
    else if (r < 0.7) squirrelFrom(x + 50, y + 40);
    else nutFrom(x + 28, y + 30);
  }
  function animateBits(node: SVGElement, dur: number, at: (t: number) => string, end?: () => void) {
    const t0 = performance.now();
    const f = (now: number) => {
      const t = Math.min(1, (now - t0) / (reduced ? Math.min(dur, 300) : dur));
      node.setAttribute('transform', at(t));
      if (t < 1) requestAnimationFrame(f); else { node.remove(); end?.(); }
    };
    requestAnimationFrame(f);
  }
  function squirrelFrom(x: number, y: number) {
    sfx.squeak();
    const s = el<SVGGElement>('g', {}, root);
    pix(SQUIRREL, { K, B: '#A0522D' }, -16, -24, 4, s);
    const dir = Math.random() < 0.5 ? -1 : 1;
    animateBits(s, 1400, (t) => `translate(${x + dir * t * 160} ${y + (t < 0.15 ? -t * 60 : -9 + Math.abs(Math.sin(t * 20)) * -6)}) scale(${-dir} 1)`);
  }
  function nutFrom(x: number, y: number) {
    const n = el<SVGGElement>('g', {}, root);
    pix(NUT, { K, C: '#6B4226', N: '#C8873F' }, -8, -10, 4, n);
    animateBits(n, 900, (t) => `translate(${x + t * 14} ${y + Math.min(1, t * 1.6) ** 2 * 60 - (t > 0.62 ? Math.sin((t - 0.62) * 8) * 12 : 0)})`);
    setTimeout(() => sfx.plink(), reduced ? 100 : 560);
  }
  function coinFrom(x: number, y: number) {
    sfx.coin();
    const c = el<SVGGElement>('g', {}, root);
    pix(COIN, { K, Y: '#F2B84B', W: '#fff' }, -10, -10, 4, c);
    animateBits(c, 900, (t) => `translate(${x} ${y - t * 60}) scale(${Math.cos(t * 18)} 1)`, () => onCoins(++coins));
  }
  let coins = (() => { try { return Number(localStorage.getItem('coins')) || 0; } catch { return 0; } })();
  setTimeout(() => onCoins(coins));

  function compass() {
    const c = el('g', { transform: 'translate(1290 80)', 'aria-hidden': 'true' }, root);
    el('circle', { r: 34, fill: '#F8F6EF', stroke: K, 'stroke-width': 3 }, c);
    el('path', { d: 'M0 -28 L7 0 L0 28 L-7 0Z', fill: '#C8332D', stroke: K, 'stroke-width': 2 }, c);
    el('path', { d: 'M-28 0 L0 -6 L28 0 L0 6Z', fill: '#F8F6EF', stroke: K, 'stroke-width': 2 }, c);
  }

  // ---------- pixel me ----------
  let field: SVGGElement | null = null;
  let digSpot: Pt = { x: 0, y: 0 };
  const LAKE_SHORE: Pt = { x: 640, y: 345 };
  const PEAK: Pt = { x: 705, y: 92 };
  const LUNA_TREE: Pt = { x: 1150, y: 340 }; // bottom middle of Luna's favorite pine, east of the tent
  const BOOMBOX_AT: Pt = { x: CENTER.x - 92, y: CENTER.y + 40 }; // bottom left of the boombox, on the plaza
  const DANCE_AT: Pt = { x: CENTER.x + 6, y: CENTER.y + 8 }; // people dance in the town centre
  const CASA_DOOR: Pt = { x: 490, y: 716 }; // the family's green house, south shore
  // mom, dad, Carlos, Steven, Robert
  const personArt = (f: (typeof FAMILY)[number]) => (f.long ? LONG_HAIR : f.tall ? TALL(SHORT_HAIR) : SHORT_HAIR);
  const personColors = (f: (typeof FAMILY)[number]): Palette => ({ H: f.hair, S: '#D39A72', E: K, M: '#8A4A3A', T: f.shirt, D: '#2B3A4A', B: K });
  const FAM_X = [-104, -52, 52, 104, 156]; // mom, dad | her | Carlos, Steven, Robert
  const FAMILY = [{ hair: '#2A1B1B', shirt: '#F77FA1', long: true, tall: false }, { hair: '#4A4A4A', shirt: '#5FA9CC', long: false, tall: false }, { hair: '#2A1B1B', shirt: '#93C78E', long: false, tall: true }, { hair: '#2A1B1B', shirt: '#F2B84B', long: false, tall: true }, { hair: '#3B2A1B', shirt: '#796AD8', long: false, tall: false }];
  const BENCH_AT: Pt = { x: 742, y: 446 }; // bottom middle of the bench, east side of the plaza
  const WELL_AT: Pt = { x: 806, y: 338 }; // bottom middle of the well, between the lake and the tent
  const GH_DOOR: Pt = { x: 640, y: 580 };
  const GH_STAND: Pt = { x: 548, y: 586 }; // she stands beside the greenhouse, not in front of it
  const roads: Record<string, SVGPathElement> = {};
  let walker: SVGGElement, flip: SVGGElement, standing: SVGGElement, stepping: SVGGElement, seated: SVGGElement, pageA: SVGGElement, pageB: SVGGElement, codeA: SVGGElement, codeB: SVGGElement;
  let reading: number | undefined;
  let at: string | null = null;
  let walking = false;

  function drawWalker() {
    walker = el<SVGGElement>('g', { 'aria-hidden': 'true' }, root);
    el('ellipse', { cx: 0, cy: 2, rx: 26, ry: 6, fill: '#000', opacity: 0.15 }, walker);
    flip = el<SVGGElement>('g', {}, walker);
    standing = pix(ME, ME_C, -32, -80, 4, flip);
    stepping = pix(ME_STEP, ME_C, -32, -80, 4, flip);
    stepping.style.display = 'none';
    seated = pix(ME_SIT, ME_C, -32, -72, 4, flip);
    pageA = pix(BOOK, BOOK_C, -26, -42, 3, seated);
    pageB = pix(BOOK_TURN, BOOK_C, -26, -42, 3, seated);
    pageB.style.display = 'none';
    codeA = pix(LAPTOP, LAPTOP_C, -21, -40, 3, seated);
    codeB = pix(LAPTOP_2, LAPTOP_C, -21, -40, 3, seated);
    codeA.style.display = 'none';
    codeB.style.display = 'none';
    seated.style.display = 'none';
    moveTo(CENTER.x, CENTER.y);
  }
  const pos: Pt = { x: CENTER.x, y: CENTER.y };
  const moveTo = (x: number, y: number) => { pos.x = x; pos.y = y; walker.setAttribute('transform', `translate(${x} ${y})`); };

  function walkAlong(road: SVGPathElement, backwards: boolean): Promise<void> {
    const speed = road === roads.mountain ? 120 : 170;
    return new Promise((done) => {
      const L = road.getTotalLength();
      if (reduced) { const p = road.getPointAtLength(backwards ? 0 : L); moveTo(p.x, p.y); return done(); }
      const dur = (L / speed) * 1000, t0 = performance.now();
      let lastX: number | null = null;
      let lastAlt = false;
      const step = (now: number) => {
        const t = Math.min(1, (now - t0) / dur);
        const p = road.getPointAtLength(backwards ? L * (1 - t) : L * t);
        if (lastX !== null && Math.abs(p.x - lastX) > 0.2) flip.setAttribute('transform', p.x < lastX ? 'scale(-1 1)' : '');
        lastX = p.x;
        const alt = Math.floor(now / 140) % 2 === 1;
        if (alt !== lastAlt) { sfx.step(alt); lastAlt = alt; }
        standing.style.display = alt ? 'none' : '';
        stepping.style.display = alt ? '' : 'none';
        moveTo(p.x, p.y - (alt ? 2 : 0));
        if (t < 1) requestAnimationFrame(step);
        else { standing.style.display = ''; stepping.style.display = 'none'; moveTo(p.x, p.y); done(); }
      };
      requestAnimationFrame(step);
    });
  }

  // ---------- Luna, the brown husky ----------
  function drawLuna() {
    const link = el<SVGAElement>('a', { href: '#', class: 'spot', 'aria-label': 'Pet Luna' }, root);
    const luna = el<SVGGElement>('g', {}, link);
    const face = el<SVGGElement>('g', {}, luna);
    const a = pix(LUNA, LUNA_C, -21, -30, 3, face);
    const b = pix(LUNA_STEP, LUNA_C, -21, -30, 3, face);
    const pee = pix(LUNA_PEE, LUNA_C, -21, -30, 3, face);
    b.style.display = 'none';
    pee.style.display = 'none';
    link.addEventListener('click', (e) => {
      e.preventDefault();
      sfx.bark();
      const h = el<SVGGElement>('g', {}, root);
      pix(HEART, { P: '#F77FA1', K }, -10, -8, 3, h);
      animateBits(h, 1200, (t) => `translate(${lx} ${ly - 40 - t * 60})`);
    });
    let lx = CENTER.x - 50, ly = CENTER.y + 10, faceLeft = false;
    lunaAt = () => ({ x: lx, y: ly });
    const tick = (now: number) => {
      // where she wants to be: just behind Madelyn, or waiting on the shore / at the foot of the mountain
      let tx = pos.x + (flip.getAttribute('transform') ? 46 : -46), ty = pos.y + 8;
      if (at === 'lake' && !walking) { tx = LAKE_SHORE.x + 60; ty = LAKE_SHORE.y + 10; }
      if (pos.y < 250) { tx = 600; ty = 250; } // she won't climb
      if (lunaGoal) { tx = lunaGoal.x; ty = lunaGoal.y; }
      if (lunaParty) { tx = DANCE_AT.x + 52; ty = DANCE_AT.y + 4 - (Math.floor(now / 360) % 2 ? 10 : 0); }
      const dx = tx - lx, dy = ty - ly, d = Math.hypot(dx, dy);
      const moving = d > 3;
      if (moving) { const k = Math.min(1, (reduced ? 1 : 0.06)); lx += dx * k; ly += dy * k; if (Math.abs(dx) > 1) faceLeft = dx < 0; }
      const step = moving && Math.floor(now / 120) % 2 === 1;
      a.style.display = step || lunaPeeing ? 'none' : '';
      b.style.display = step && !lunaPeeing ? '' : 'none';
      pee.style.display = lunaPeeing ? '' : 'none';
      face.setAttribute('transform', faceLeft ? 'scale(-1 1)' : '');
      luna.setAttribute('transform', `translate(${lx} ${ly})`);
      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }

  /** Walk to a spot (back through the middle if she's somewhere else), then do the thing there. */
  async function go(id: string, then: () => Promise<void> | void) {
    if (walking) return;
    if (id === 'bench' && sitting) { swapReading(); return; }
    walking = true;
    onLeave();
    standUp();
    stopDancing();
    if (at !== id) {
      if (at) await walkAlong(roads[at], true);
      await walkAlong(roads[id], false);
      at = id;
    }
    await then();
    walking = false;
  }
  const walkTo = (p: Place) => go(p.id, () => { sfx.arrive(p.id); onArrive(p); });
  const wait = (ms: number) => new Promise((r) => setTimeout(r, reduced ? Math.min(ms, 400) : ms));

  /** Hop into the lake, paddle around a bit, climb back out. */
  async function swim() {
    const shadow = walker.firstElementChild as SVGElement;
    shadow.style.display = 'none';
    flip.setAttribute('clip-path', 'url(#swimClip)'); // only her head and shoulders above water
    const rings = el<SVGGElement>('g', {}, walker);
    const r1 = el('ellipse', { cx: 0, cy: -30, rx: 22, ry: 6, fill: 'none', stroke: '#fff', 'stroke-width': 2 }, rings);
    const r2 = el('ellipse', { cx: 0, cy: -30, rx: 34, ry: 9, fill: 'none', stroke: '#fff', 'stroke-width': 1.5, opacity: 0.6 }, rings);
    sfx.splash();
    const t0 = performance.now(), dur = reduced ? 600 : 4200;
    let lastBloop = 0;
    await new Promise<void>((done) => {
      const frame = (now: number) => {
        const t = (now - t0) / 1000;
        const x = 640 + Math.sin(t * 1.3) * 34, y = 336 + Math.sin(t * 5) * 1.5;
        flip.setAttribute('transform', Math.cos(t * 1.3) < 0 ? 'scale(-1 1)' : '');
        moveTo(x, y);
        r1.setAttribute('rx', String(22 + Math.sin(t * 4) * 3));
        r2.setAttribute('rx', String(34 + Math.sin(t * 4 + 1) * 4));
        if (now - lastBloop > 900) { sfx.bloop(); lastBloop = now; }
        if (now - t0 < dur) requestAnimationFrame(frame); else done();
      };
      requestAnimationFrame(frame);
    });
    sfx.splash();
    rings.remove();
    flip.removeAttribute('clip-path');
    flip.removeAttribute('transform');
    shadow.style.display = '';
    moveTo(LAKE_SHORE.x, LAKE_SHORE.y);
  }

  /** Water the plants: a little rain, and a new flower blooms by the greenhouse. */
  const BLOOMS: Pt[] = [{ x: 700, y: 576 }, { x: 610, y: 604 }, { x: 680, y: 606 }, { x: 645, y: 612 }, { x: 702, y: 548 }, { x: 580, y: 610 }];
  let bloomed = 0;
  async function water() {
    sfx.water();
    for (let i = 0; i < 10; i++) {
      const drop = el('rect', { x: GH_DOOR.x - 50 + Math.random() * 100, y: GH_DOOR.y - 150, width: 3, height: 7, fill: '#5FA9CC' }, root);
      const t0 = performance.now() + i * 60;
      const fall = (now: number) => {
        const t = Math.max(0, (now - t0) / 1000);
        drop.setAttribute('transform', `translate(0 ${t * 220})`);
        if (t < 0.45) requestAnimationFrame(fall); else drop.remove();
      };
      requestAnimationFrame(fall);
    }
    await wait(700);
    if (bloomed < BLOOMS.length) {
      const b = BLOOMS[bloomed++];
      const f = pix(FLOWER, { P: ['#F77FA1', '#F2B84B', '#796AD8'][bloomed % 3], Y: '#fff', G: '#4E9A3A' }, b.x, b.y - 20, 4, root);
      f.style.transformOrigin = `${b.x + 6}px ${b.y}px`;
      f.animate?.([{ transform: 'scale(0)' }, { transform: 'scale(1.2)' }, { transform: 'scale(1)' }], { duration: reduced ? 1 : 400 });
    }
    sfx.pop();
    await wait(300);
  }

  /** Sit down on the bench and stay there until you send her somewhere else. */
  let sitting = false;
  async function sit() {
    standing.style.display = 'none';
    stepping.style.display = 'none';
    seated.style.display = '';
    flip.removeAttribute('transform');
    moveTo(BENCH_AT.x, BENCH_AT.y - 6);
    sitting = true;
    onLaptop = false;
    startReading();
  }
  // Sitting: she reads (a page turns now and then) or codes on her laptop. Click the bench again to switch.
  let onLaptop = false;
  function startReading() {
    clearInterval(reading);
    pageA.style.display = onLaptop ? 'none' : '';
    pageB.style.display = 'none';
    codeA.style.display = onLaptop ? '' : 'none';
    codeB.style.display = 'none';
    if (onLaptop) sfx.typing(); else sfx.page();
    if (reduced) return;
    let flipFlop = false;
    reading = window.setInterval(() => {
      if (onLaptop) {
        flipFlop = !flipFlop;
        codeA.style.display = flipFlop ? 'none' : '';
        codeB.style.display = flipFlop ? '' : 'none';
        sfx.typing();
      } else {
        pageA.style.display = 'none'; pageB.style.display = '';
        sfx.page();
        setTimeout(() => { pageA.style.display = ''; pageB.style.display = 'none'; }, 260);
      }
    }, onLaptop ? 700 : 3200);
  }
  function swapReading() { onLaptop = !onLaptop; startReading(); }
  function standUp() {
    if (!sitting) return;
    sitting = false;
    clearInterval(reading);
    seated.style.display = 'none';
    standing.style.display = '';
    moveTo(BENCH_AT.x, BENCH_AT.y + 8);
  }

  /** Dance by the boombox: she bounces side to side while the music plays. Luna joins in. */
  let dancing: number | undefined;
  let danceEnd: number | undefined;
  async function dance() {
    const songLength = sfx.danceLoop();
    let beat = 0;
    lunaParty = true;
    danceFloor.style.display = '';
    lightFloor();
    dancing = window.setInterval(() => {
      beat++;
      if (beat % 2 === 0) lightFloor();
      flip.setAttribute('transform', beat % 2 ? 'scale(-1 1)' : '');
      standing.style.display = beat % 4 < 2 ? '' : 'none';
      stepping.style.display = beat % 4 < 2 ? 'none' : '';
      moveTo(DANCE_AT.x + (beat % 2 ? 6 : -6), DANCE_AT.y - (beat % 2 ? 8 : 0));
      if (beat % 2 === 0) floatNote(BOOMBOX_AT.x + 30, BOOMBOX_AT.y - 40);
    }, reduced ? 1000 : 360);
    danceEnd = window.setTimeout(stopDancing, songLength * 1000 + 300); // dance until the song ends
  }
  function stopDancing() {
    if (dancing === undefined) return;
    clearInterval(dancing);
    clearTimeout(danceEnd);
    dancing = undefined;
    lunaParty = false;
    danceFloor.style.display = 'none';
    sfx.stopLoop();
    flip.removeAttribute('transform');
    standing.style.display = '';
    stepping.style.display = 'none';
    moveTo(DANCE_AT.x, DANCE_AT.y);
  }
  function floatNote(x: number, y: number) {
    const n = el<SVGGElement>('g', {}, root);
    pix(NOTE, { K: ['#187489', '#F77FA1', '#796AD8'][Math.floor(Math.random() * 3)] }, -6, -12, 3, n);
    const dx = (Math.random() - 0.5) * 40;
    animateBits(n, 1200, (t) => `translate(${x + dx * t} ${y - t * 70})`);
  }

  /** Visit the family: they come out and wave. */
  async function visitFamily() {
    sfx.family();
    const out = el<SVGGElement>('g', {}, root);
    FAMILY.forEach((f, i) => {
      const g = el<SVGGElement>('g', {}, out);
      const art = personArt(f);
      pix(art, personColors(f), CASA_DOOR.x + FAM_X[i] - 32, CASA_DOOR.y - art.length * 4 + 8, 4, g); // shoulder to shoulder with her
      g.animate?.([{ transform: 'translateY(6px)', opacity: 0 }, { transform: 'translateY(0)', opacity: 1 }], { duration: 300, delay: i * 150, fill: 'both' });
    });
    for (let i = 0; i < 5; i++) {
      const h = el<SVGGElement>('g', {}, root);
      pix(HEART, { P: '#F77FA1', K }, -10, -8, 3, h);
      setTimeout(() => animateBits(h, 1600, (t) => `translate(${CASA_DOOR.x + FAM_X[i] + Math.sin(t * 8) * 5} ${CASA_DOOR.y - 50 - t * 90})`), i * 250);
    }
    say('¡hola familia!', CASA_DOOR.x, CASA_DOOR.y - 176);
    await wait(1500);
    // everyone holds still... say cheese!
    lunaGoal = { x: CASA_DOOR.x + FAM_X[0] - 50, y: CASA_DOOR.y + 6 }; // Luna joins the end of the row
    // a little camera on a tripod pops up and takes the picture
    const cam = el<SVGGElement>('g', {}, root);
    pix(CAMERA, { K, G: '#6F7B90', L: '#9FD3E8', R: '#C8332D', B: '#8A4A3A' }, CASA_DOOR.x + 216, CASA_DOOR.y - 82, 6, cam);
    cam.animate?.([{ opacity: 0, transform: 'translateY(10px)' }, { opacity: 1, transform: 'translateY(0)' }], { duration: 300, fill: 'both' });
    say('say cheese!', CASA_DOOR.x, CASA_DOOR.y - 176);
    await wait(900);
    const blink = el('circle', { cx: CASA_DOOR.x + 226, cy: CASA_DOOR.y - 64, r: 22, fill: '#fff', opacity: 0.95 }, root);
    setTimeout(() => blink.remove(), 220);
    flash();
    sfx.shutter();
    onPhoto(familyPhoto());
    await wait(1400);
    out.remove();
    cam.remove();
    lunaGoal = null;
  }

  function flash() {
    const f = el('rect', { x: -SHIFT, y: 0, width: W, height: H, fill: '#fff' }, root);
    f.animate?.([{ opacity: 0.9 }, { opacity: 0 }], { duration: 450 });
    setTimeout(() => f.remove(), 450);
  }

  /** Draws the family photo (the house, the five of them, her and Luna) as a little polaroid, returns a PNG. */
  function familyPhoto(): string {
    const c = document.createElement('canvas');
    c.width = 560; c.height = 460;
    const g = c.getContext('2d')!;
    const px = (rows: string[], cols: Palette, x: number, y: number, s: number) =>
      rows.forEach((row, j) => [...row].forEach((ch, i) => { if (ch !== '.' && cols[ch]) { g.fillStyle = cols[ch]; g.fillRect(x + i * s, y + j * s, s, s); } }));
    // polaroid frame
    g.fillStyle = '#FFFFFF'; g.fillRect(0, 0, 560, 460);
    g.strokeStyle = K; g.lineWidth = 4; g.strokeRect(2, 2, 556, 456);
    // the picture: sky, grass, the house, everyone in a row
    g.fillStyle = '#BFE3F2'; g.fillRect(24, 24, 512, 220);
    g.fillStyle = '#8CC56E'; g.fillRect(24, 244, 512, 116);
    g.strokeRect(24, 24, 512, 336);
    px(CASA, CASA_C, 280 - 92, 60, 8);
    const feet = 340;
    FAMILY.forEach((f, i) => { const art = personArt(f); px(art, personColors(f), 232 + FAM_X[i] - 20, feet - art.length * 4, 4); });
    px(ME, ME_C, 212, feet - 80, 4);
    px(LUNA, LUNA_C, 232 + FAM_X[0] - 20 - 52, feet - 30, 3); // Luna sits at the end of the row, next to mom
    // caption
    g.fillStyle = K;
    g.font = "16px 'Press Start 2P', monospace";
    g.textAlign = 'center';
    g.fillText('la familia', 280, 400);
    g.font = "18px 'Literata Variable', Georgia, serif";
    g.fillText(new Date().toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' }), 280, 432);
    return c.toDataURL('image/png');
  }

  /** At Luna's tree: half the time she pees on it, half the time a squirrel jumps out and she chases it. */
  async function lunaTime() {
    const base = { x: LUNA_TREE.x - 30, y: LUNA_TREE.y + 10 };
    lunaGoal = base;
    await lunaArrives();
    await wait(200);
    if (Math.random() < 0.5) {
      lunaPeeing = true;
      sfx.tinkle();
      await wait(900);
      const puddle = el('ellipse', { cx: base.x - 18, cy: base.y + 4, rx: 4, ry: 2, fill: '#F2D24B', opacity: 0.8 }, root);
      puddle.animate?.([{ transform: 'scale(0.3)' }, { transform: 'scale(1.6)' }], { duration: 900, fill: 'forwards' });
      await wait(1200);
      lunaPeeing = false;
      say('luna!!', base.x, base.y - 60);
      setTimeout(() => puddle.remove(), 6000);
      await wait(800);
    } else {
      sfx.squeak();
      const sq = el<SVGGElement>('g', {}, root);
      pix(SQUIRREL, { K, B: '#A0522D' }, -16, -24, 4, sq);
      const t0 = performance.now(), dur = reduced ? 600 : 2600;
      sfx.bark();
      await new Promise<void>((done) => {
        const run = (now: number) => {
          const t = Math.min(1, (now - t0) / dur);
          // the squirrel zigzags off around the field with Luna right behind
          const sx = base.x + 20 + Math.sin(t * 6) * 70 + t * 40, sy = base.y + 30 + t * 120 + Math.cos(t * 9) * 20;
          sq.setAttribute('transform', `translate(${sx} ${sy - Math.abs(Math.sin(t * 30)) * 6}) scale(${Math.cos(t * 6) > 0 ? -1 : 1} 1)`);
          lunaGoal = { x: sx - 30, y: sy + 8 };
          if (t < 1) requestAnimationFrame(run); else done();
        };
        requestAnimationFrame(run);
      });
      // up a tree and gone
      sq.remove();
      say('it got away', lunaGoal.x, lunaGoal.y - 50);
      await wait(900);
    }
    lunaGoal = null;
  }

  /** Toss a coin in the well and make a wish. No coins? Go shake some trees. */
  async function wish() {
    if (coins <= 0) {
      say('no coins! try the trees', WELL_AT.x, WELL_AT.y - 100);
      sfx.nope();
      await wait(1400);
      return;
    }
    onCoins(--coins);
    const c = el<SVGGElement>('g', {}, root);
    pix(COIN, { K, Y: '#F2B84B', W: '#fff' }, -10, -10, 4, c);
    sfx.coin();
    await new Promise<void>((done) => animateBits(c, 600, (t) => `translate(${WELL_AT.x - 50 + t * 50} ${WELL_AT.y - 70 - Math.sin(t * Math.PI) * 50 + t * 30})`, done));
    sfx.plink();
    await wait(300);
    sparkles();
    wishes++;
    try { localStorage.setItem('wishes', String(wishes)); } catch { /* private mode */ }
    if (wishes % WISHES_FOR_SONG === 0) {
      // every third coin: the well plays my piano melody
      const secs = sfx.piano() ?? 8; // the piano melody from madebit.studio
      for (let i = 0; i < Math.round(secs / 0.45); i++) setTimeout(() => { sparkles(); floatNote(WELL_AT.x, WELL_AT.y - 60); }, i * 450);
      say('♪ a song for you ♪', WELL_AT.x, WELL_AT.y - 110);
      await wait(Math.min(4500, secs * 1000));
    } else {
      sfx.wish();
      const left = WISHES_FOR_SONG - (wishes % WISHES_FOR_SONG);
      say(`${left} more for a song`, WELL_AT.x, WELL_AT.y - 110);
      await wait(1200);
    }
  }
  // a wish: sparkles burst out of the well and little hearts float up
  function sparkles() {
    const x0 = WELL_AT.x, y0 = WELL_AT.y - 50;
    for (let i = 0; i < 12; i++) {
      const star = el('path', { d: 'M0 -7l2 5 5 2-5 2-2 5-2-5-5-2 5-2z', fill: ['#F2B84B', '#F77FA1', '#fff'][i % 3], stroke: K, 'stroke-width': 1 }, root);
      const a = -Math.PI / 2 + (Math.random() - 0.5) * 2.2, v = 70 + Math.random() * 60;
      animateBits(star, 1100, (t) => `translate(${x0 + Math.cos(a) * v * t} ${y0 + Math.sin(a) * v * t + 40 * t * t}) scale(${1 - t * 0.7})`);
    }
    for (let i = 0; i < 3; i++) {
      const h = el<SVGGElement>('g', {}, root);
      pix(HEART, { P: '#F77FA1', K }, -10, -8, 4, h);
      const dx = (i - 1) * 26;
      setTimeout(() => animateBits(h, 1800, (t) => `translate(${x0 + dx + Math.sin(t * 8) * 6} ${y0 - t * 120}) scale(${1 - t * 0.4})`), i * 200);
    }
  }
  function say(text: string, x: number, y: number) {
    const g = el('g', {}, root);
    const w = text.length * 9 + 24;
    el('rect', { x: x - w / 2, y: y - 24, width: w, height: 32, fill: '#F8F6EF', stroke: K, 'stroke-width': 2 }, g);
    const t = el('text', { x, y: y - 4, 'text-anchor': 'middle', 'font-family': "'Press Start 2P', monospace", 'font-size': 9, fill: K }, g);
    t.textContent = text;
    setTimeout(() => g.remove(), 1800);
  }

  /** At the top: plant a flag (once) and celebrate. */
  let flagged = false;
  async function summit() {
    sfx.fanfare();
    if (!flagged) {
      flagged = true;
      const f = el('g', {}, root);
      el('rect', { x: PEAK.x + 22, y: PEAK.y - 70, width: 4, height: 64, fill: K }, f);
      el('path', { d: `M${PEAK.x + 26} ${PEAK.y - 70} L${PEAK.x + 60} ${PEAK.y - 60} L${PEAK.x + 26} ${PEAK.y - 50} Z`, fill: '#F77FA1', stroke: K, 'stroke-width': 2 }, f);
    }
    // a little hop of joy
    for (let i = 0; i < 2; i++) { moveTo(PEAK.x, PEAK.y - 10); await wait(160); moveTo(PEAK.x, PEAK.y); await wait(200); }
  }

  /** Dig, dig, dig... a carrot! */
  async function dig() {
    for (let i = 0; i < 3; i++) {
      moveTo(digSpot.x, digSpot.y + 4);
      sfx.dig();
      dirt(digSpot.x + 18, digSpot.y);
      await wait(220);
      moveTo(digSpot.x, digSpot.y);
      await wait(260);
    }
    sfx.pop();
    const carrot = pix(CARROT, CARROT_C, digSpot.x + 34, digSpot.y - 96, 4, root);
    const label = el('text', { x: digSpot.x + 46, y: digSpot.y - 104, 'text-anchor': 'middle', 'font-family': "'Press Start 2P', monospace", 'font-size': 11, fill: K }, root);
    carrots++;
    label.textContent = carrots === 1 ? '+1 CARROT' : `${carrots} CARROTS`;
    await wait(1600);
    carrot.remove();
    label.remove();
  }
  let carrots = 0;
  let lunaParty = false;
  let lunaGoal: Pt | null = null; // when set, Luna goes here instead of following
  let lunaPeeing = false;
  let lunaAt: () => Pt = () => CENTER;
  async function lunaArrives(timeout = 4000) {
    const t0 = performance.now();
    while (lunaGoal && Math.hypot(lunaAt().x - lunaGoal.x, lunaAt().y - lunaGoal.y) > 6 && performance.now() - t0 < timeout) await wait(80);
  }
  const WISHES_FOR_SONG = 3;
  let wishes = (() => { try { return Number(localStorage.getItem('wishes')) || 0; } catch { return 0; } })();
  let danceFloor: SVGGElement;
  const tiles: SVGElement[] = [];
  const FLOOR = ['#F77FA1', '#F2B84B', '#93C78E', '#5FA9CC', '#796AD8', '#F8F6EF'];
  const lightFloor = () => tiles.forEach((t) => t.setAttribute('fill', FLOOR[Math.floor(Math.random() * FLOOR.length)]));
  function dirt(x: number, y: number) {
    for (let i = 0; i < 5; i++) {
      const bit = el('rect', { x, y, width: 5, height: 5, fill: '#7A5A3A' }, root);
      const vx = (Math.random() - 0.5) * 60, vy = -40 - Math.random() * 40, t0 = performance.now();
      const fly = (now: number) => {
        const t = (now - t0) / 1000;
        bit.setAttribute('transform', `translate(${vx * t} ${vy * t + 260 * t * t})`);
        if (t < 0.45) requestAnimationFrame(fly); else bit.remove();
      };
      requestAnimationFrame(fly);
    }
  }

  // ---------- draw everything, back to front ----------
  paper();
  island();
  const roadLayer = el('g', {}, root);
  const treeLayer = el('g', {}, root);
  PLACES.forEach(building); // works out each door and footprint
  trees(treeLayer);
  PLACES.forEach((p) => {
    el('path', { d: roadPath(p), fill: 'none', stroke: '#E8D7A8', 'stroke-width': 26, 'stroke-linecap': 'round' }, roadLayer);
    roads[p.id] = el<SVGPathElement>('path', { d: roadPath(p), fill: 'none', stroke: '#B99E6B', 'stroke-width': 3, 'stroke-dasharray': '2 12', 'stroke-linecap': 'round' }, roadLayer);
  });
  // ---------- Luna's tree: take her there and she pees on it or chases a squirrel ----------
  const lunaTree = el<SVGAElement>('a', { href: '#', class: 'spot', 'aria-label': "Take Luna to her favorite tree" }, root);
  pix(PINE, PINE_C, LUNA_TREE.x - 32, LUNA_TREE.y - 64, 8, el('g', { class: 'lift' }, lunaTree));
  lunaTree.addEventListener('click', (e) => { e.preventDefault(); go('lunatree', lunaTime); });
  roads.lunatree = el<SVGPathElement>('path', { d: `M${CENTER.x} ${CENTER.y} Q${LUNA_TREE.x - 80} ${CENTER.y - 20} ${LUNA_TREE.x - 70} ${LUNA_TREE.y + 14}`, fill: 'none' }, roadLayer);

  // ---------- town centre ----------
  seed = 88;
  el('ellipse', { cx: CENTER.x, cy: CENTER.y + 4, rx: 74, ry: 40, fill: '#E2D6B6', stroke: '#C9B98F', 'stroke-width': 2 }, roadLayer);
  for (let i = 0; i < 40; i++) {
    const a = rnd() * Math.PI * 2, r = Math.sqrt(rnd());
    el('rect', { x: CENTER.x + Math.cos(a) * 64 * r - 4, y: CENTER.y + 4 + Math.sin(a) * 32 * r - 2, width: 8, height: 5, rx: 2, fill: '#CDBF9A' }, roadLayer);
  }
  const lamp = el<SVGAElement>('a', { href: '#', class: 'spot', 'aria-label': 'Switch the lamp on or off' }, root);
  const lx = CENTER.x - 112 + 12, ly = CENTER.y - 92 + 10; // middle of the lantern
  const glow = el('circle', { cx: lx, cy: ly, r: 46, fill: '#F2B84B', opacity: 0.28 }, lamp);
  const lampOn = pix(LAMP, { K, Y: '#F2B84B' }, CENTER.x - 112, CENTER.y - 92, 5, lamp);
  const lampOff = pix(LAMP, { K, Y: '#6F7B90' }, CENTER.x - 112, CENTER.y - 92, 5, lamp);
  let lit = true;
  const showLamp = () => { glow.style.display = lit ? '' : 'none'; lampOn.style.display = lit ? '' : 'none'; lampOff.style.display = lit ? 'none' : ''; lamp.setAttribute('aria-pressed', String(lit)); };
  showLamp();
  lamp.addEventListener('click', (e) => { e.preventDefault(); lit = !lit; showLamp(); sfx.click(lit); });
  const bench = el<SVGAElement>('a', { href: '#', class: 'spot', 'aria-label': 'Sit on the bench' }, root);
  pix(BENCH, { K, W: '#B98B5E' }, BENCH_AT.x - 36, BENCH_AT.y - 36, 4, el('g', { class: 'lift' }, bench));
  bench.addEventListener('click', (e) => { e.preventDefault(); go('bench', sit); });
  const well = el<SVGAElement>('a', { href: '#', class: 'spot', 'aria-label': 'Toss a coin in the wishing well' }, root);
  pix(WELL, WELL_C, WELL_AT.x - 36, WELL_AT.y - 72, 6, el('g', { class: 'lift' }, well));
  well.addEventListener('click', (e) => { e.preventDefault(); go('well', wish); });
  roads.bench = el<SVGPathElement>('path', { d: `M${CENTER.x} ${CENTER.y} Q${BENCH_AT.x - 50} ${BENCH_AT.y + 14} ${BENCH_AT.x} ${BENCH_AT.y + 8}`, fill: 'none' }, roadLayer);
  roads.well = el<SVGPathElement>('path', { d: `M${CENTER.x} ${CENTER.y} Q${WELL_AT.x - 60} ${CENTER.y - 10} ${WELL_AT.x - 56} ${WELL_AT.y + 6}`, fill: 'none' }, roadLayer);
  const gh = el<SVGAElement>('a', { href: '#', class: 'spot', 'aria-label': 'Water the plants in the greenhouse' }, root);
  pix(GREENHOUSE, GREENHOUSE_C, GH_DOOR.x - 63, GH_DOOR.y - 77, 7, el('g', { class: 'lift' }, gh));
  gh.addEventListener('click', (e) => { e.preventDefault(); go('greenhouse', water); });
  roads.greenhouse = el<SVGPathElement>('path', { d: `M${CENTER.x} ${CENTER.y} Q${GH_STAND.x + 20} ${CENTER.y + 50} ${GH_STAND.x} ${GH_STAND.y}`, fill: 'none' }, roadLayer);

  // up the left side of the big mountain in little switchbacks
  roads.mountain = el<SVGPathElement>('path', { d: `M${CENTER.x} ${CENTER.y} C560 400 535 300 596 205 L632 165 L652 150 L670 122 L688 104 L${PEAK.x} ${PEAK.y}`, fill: 'none' }, roadLayer);
  roads.lake = el<SVGPathElement>('path', { d: `M${CENTER.x} ${CENTER.y} Q${CENTER.x - 30} ${CENTER.y - 40} ${LAKE_SHORE.x} ${LAKE_SHORE.y}`, fill: 'none' }, roadLayer);
  roads.carrot = el<SVGPathElement>('path', { d: `M${CENTER.x} ${CENTER.y} Q${(CENTER.x + digSpot.x) / 2} ${CENTER.y + 10} ${digSpot.x} ${digSpot.y}`, fill: 'none' }, roadLayer);
  const swimClip = el('clipPath', { id: 'swimClip' }, svg.querySelector('defs')!);
  el('rect', { x: -40, y: -90, width: 80, height: 58 }, swimClip);
  // ---------- boombox on the plaza: turning it on lights up the dance floor ----------
  const floorClip = el('clipPath', { id: 'plazaClip' }, svg.querySelector('defs')!);
  el('ellipse', { cx: CENTER.x, cy: CENTER.y + 4, rx: 74, ry: 40 }, floorClip);
  danceFloor = el<SVGGElement>('g', { 'clip-path': 'url(#plazaClip)', style: 'display:none' }, roadLayer);
  for (let i = 0; i < 7; i++) for (let j = 0; j < 5; j++)
    tiles.push(el('rect', { x: CENTER.x - 84 + i * 24, y: CENTER.y - 36 + j * 17, width: 24, height: 17, fill: '#F77FA1', stroke: K, 'stroke-width': 1 }, danceFloor));
  const boombox = el<SVGAElement>('a', { href: '#', class: 'spot', 'aria-label': 'Dance' }, root);
  pix(BOOMBOX, { K, R: '#796AD8', Y: '#F2B84B', W: '#F8F6EF' }, BOOMBOX_AT.x, BOOMBOX_AT.y - 36, 4, el('g', { class: 'lift' }, boombox));
  boombox.addEventListener('click', (e) => { e.preventDefault(); go('dance', dance); });
  roads.dance = el<SVGPathElement>('path', { d: `M${CENTER.x} ${CENTER.y} L${DANCE_AT.x} ${DANCE_AT.y}`, fill: 'none' }, roadLayer);

  // ---------- the family's green house ----------
  const casa = el<SVGAElement>('a', { href: '#', class: 'spot', 'aria-label': 'Visit the family' }, root);
  pix(CASA, CASA_C, CASA_DOOR.x - 92, CASA_DOOR.y - 160, 8, el('g', { class: 'lift' }, casa)); // two stories, like home
  casa.addEventListener('click', (e) => { e.preventDefault(); go('casa', visitFamily); });
  roads.casa = el<SVGPathElement>('path', { d: `M${CENTER.x} ${CENTER.y} Q${CASA_DOOR.x + 60} ${CENTER.y + 160} ${CASA_DOOR.x} ${CASA_DOOR.y + 8}`, fill: 'none' }, roadLayer);

  compass();
  drawLuna();
  drawWalker();

  return { walkTo };
}
