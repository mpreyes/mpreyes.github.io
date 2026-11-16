// madebit, the pixel version. 16x20 grid, one rect per run of color.
const ROWS = [
  '.....PPPPPP.....',
  '....PHHHHHHP....',
  '...HHHHHHHHHH...',
  '..HHHHHHHHHHHH..',
  '.PPHSSSSSSSSHPP.',
  '.PPSSESSSSESSPP.',
  '.PPSSSSSSSSSSPP.',
  '..HSSSSMMSSSSH..',
  '..HHSSSSSSSSHH..',
  '..HHH.SSSS.HHH..',
  '...HTTTTTTTTH...',
  '..TTTTTTTTTTTT..',
  '.STTTTTTTTTTTTS.',
  '.STTTTTTTTTTTTS.',
  '..TTTTTTTTTTTT..',
  '...DDDDDDDDDD...',
  '...DDDD..DDDD...',
  '...DDDD..DDDD...',
  '...BBBB..BBBB...',
  '..BBBBB..BBBBB..',
];
const COLORS: Record<string, string> = {
  H: '#2A1B1B', S: '#D39A72', E: '#111111', P: '#F77FA1', T: '#9DBE3D', D: '#187489', B: '#111111', M: '#8A4A3A',
};
const RECTS = ROWS.flatMap((row, y) => {
  const out: { x: number; y: number; w: number; c: string }[] = [];
  let x = 0;
  while (x < row.length) {
    const ch = row[x];
    if (ch === '.') { x++; continue; }
    let n = 1;
    while (row[x + n] === ch) n++;
    out.push({ x, y, w: n, c: COLORS[ch] });
    x += n;
  }
  return out;
});

export default function Sprite({ size = 64, className }: { size?: number; className?: string }) {
  return (
    <svg className={className} width={size} height={(size * 20) / 16} viewBox="0 0 16 20" shapeRendering="crispEdges" aria-hidden="true">
      {RECTS.map((r, i) => <rect key={i} x={r.x} y={r.y} width={r.w} height={1} fill={r.c} />)}
    </svg>
  );
}
