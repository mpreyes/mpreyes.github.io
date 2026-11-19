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
export function mountTown(svg: SVGSVGElement, onArrive: (p: Place) => void, onLeave: () => void) {
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
    pix(MOUNTAIN, MOUNTAIN_C, 440, 100, 10, root);
    pix(MOUNTAIN, MOUNTAIN_C, 790, 120, 8, root);
    pix(MOUNTAIN, MOUNTAIN_C, 580, 60, 13, root);
    el('rect', { x: 690, y: 190, width: 12, height: 94, fill: '#9FD3E8', stroke: K, 'stroke-width': 2 }, root);
    for (let i = 0; i < 5; i++) el('rect', { x: 693, y: 196 + i * 18, width: 6, height: 7, fill: '#fff' }, root);
    shark();
  }

  const onLand = (x: number, y: number) => inside(shore, x, y);

  function grassAndFlowers(n: number) {
    for (let i = 0; i < n; i++) {
      const x = 20 + rnd() * 1240, y = 120 + rnd() * 600;
      if (!onLand(x, y) || !onLand(x, y + 14)) continue;
      if (PLACES.some((p) => Math.hypot(p.x + 40 - x, p.y + 30 - y) < 120) || Math.hypot(CENTER.x - x, CENTER.y - y) < 70) continue;
      const r = rnd();
      if (r < 0.55) el('path', { d: `M${x} ${y} l3 -7 l3 7 l3 -6 l3 6`, fill: 'none', stroke: '#3F7F3A', 'stroke-width': 2, 'stroke-linejoin': 'round' }, root);
      else if (r < 0.95) el('circle', { cx: x, cy: y, r: 3, fill: ['#F77FA1', '#F2B84B', '#fff'][i % 3], stroke: K, 'stroke-width': 1 }, root);
      else el('ellipse', { cx: x, cy: y, rx: 7, ry: 4, fill: '#cfc3a6', stroke: K, 'stroke-width': 1.2 }, root);
    }
  }

  // a shark fin, just chilling in the water
  function shark() {
    const g = el('g', { transform: 'translate(-6 470)' }, root);
    const bob = el('g', {}, g);
    el('path', { d: 'M-26 6 q12 -4 26 0 q14 4 26 0', fill: 'none', stroke: '#fff', 'stroke-width': 3, 'stroke-linecap': 'round' }, bob);
    el('path', { d: 'M-12 4 L4 -24 Q8 -10 14 4 Z', fill: '#6E7C8C', stroke: K, 'stroke-width': 2.5, 'stroke-linejoin': 'round' }, bob);
    el('path', { d: 'M2 -16 L6 -4', stroke: '#9AA8B6', 'stroke-width': 2 }, bob);
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
      field = el<SVGGElement>('g', { class: 'lift' }, fieldLink);
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
    const clusters: [number, number, number][] = [[200, 400, 14], [1080, 440, 12], [300, 230, 6], [1000, 240, 6], [600, 690, 10], [760, 690, 8], [160, 560, 6], [1120, 560, 6]];
    clusters.forEach(([cx, cy, n]) => { for (let i = 0; i < n; i++) spots.push([cx + (rnd() - 0.5) * 120, cy + (rnd() - 0.5) * 90]); });
    spots.forEach((s) => { s[0] = wx(s[0]); });
    spots.sort((a, b) => a[1] - b[1]).forEach(([x, y], i) => {
      if (PLACES.some((p) => p.box && x > p.box.l - 40 && x < p.box.r + 10 && y > p.box.t - 70 && y < p.box.b + 30)) return;
      if (x > 420 && x < 960 && y < 300) return; // keep the mountains and lake clear
      if (!(onLand(x + 16, y + 28) && onLand(x - 10, y) && onLand(x + 42, y))) return;
      const pine = i % 3 === 0;
      pix(pine ? PINE : TREE, pine ? PINE_C : TREE_C, x, y, 4, layer);
    });
  }

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
  const roads: Record<string, SVGPathElement> = {};
  let walker: SVGGElement, flip: SVGGElement, standing: SVGGElement, stepping: SVGGElement;
  let at: string | null = null;
  let walking = false;

  function drawWalker() {
    walker = el<SVGGElement>('g', { 'aria-hidden': 'true' }, root);
    el('ellipse', { cx: 0, cy: 2, rx: 26, ry: 6, fill: '#000', opacity: 0.15 }, walker);
    flip = el<SVGGElement>('g', {}, walker);
    standing = pix(ME, ME_C, -32, -80, 4, flip);
    stepping = pix(ME_STEP, ME_C, -32, -80, 4, flip);
    stepping.style.display = 'none';
    moveTo(CENTER.x, CENTER.y);
  }
  const moveTo = (x: number, y: number) => walker.setAttribute('transform', `translate(${x} ${y})`);

  function walkAlong(road: SVGPathElement, backwards: boolean): Promise<void> {
    return new Promise((done) => {
      const L = road.getTotalLength();
      if (reduced) { const p = road.getPointAtLength(backwards ? 0 : L); moveTo(p.x, p.y); return done(); }
      const dur = (L / 170) * 1000, t0 = performance.now();
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

  /** Walk to a spot (back through the middle if she's somewhere else), then do the thing there. */
  async function go(id: string, then: () => Promise<void> | void) {
    if (walking) return;
    walking = true;
    onLeave();
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
  roads.lake = el<SVGPathElement>('path', { d: `M${CENTER.x} ${CENTER.y} Q${CENTER.x - 30} ${CENTER.y - 40} ${LAKE_SHORE.x} ${LAKE_SHORE.y}`, fill: 'none' }, roadLayer);
  roads.carrot = el<SVGPathElement>('path', { d: `M${CENTER.x} ${CENTER.y} Q${(CENTER.x + digSpot.x) / 2} ${CENTER.y + 10} ${digSpot.x} ${digSpot.y}`, fill: 'none' }, roadLayer);
  const swimClip = el('clipPath', { id: 'swimClip' }, svg.querySelector('defs')!);
  el('rect', { x: -40, y: -90, width: 80, height: 58 }, swimClip);
  compass();
  drawWalker();

  return { walkTo };
}
