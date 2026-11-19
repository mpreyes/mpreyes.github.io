// On tall, narrow screens (phones) the map zooms in to the island's full height,
// you swipe or tap the arrows to look left and right, and the view follows her as she walks.
const W = 1440, H = 800;
const MIN_X = 40, MAX_X = 1400; // the island plus its sea, in map units
const START_X = 720; // the town square

export function mountCamera(svg: SVGSVGElement, left: HTMLButtonElement, right: HTMLButtonElement) {
  let on = false;
  let viewW = W;
  let x = 0; // left edge of the view, in map units
  let target = 0;
  let raf = 0;

  const clamp = (v: number) => Math.max(MIN_X, Math.min(MAX_X - viewW, v));
  const apply = () => {
    svg.setAttribute('viewBox', on ? `${x.toFixed(1)} 0 ${viewW.toFixed(1)} ${H}` : `0 0 ${W} ${H}`);
    left.hidden = !on || x <= MIN_X + 4;
    right.hidden = !on || x >= MAX_X - viewW - 4;
  };
  const tick = () => {
    x += (target - x) * 0.14;
    if (Math.abs(target - x) < 0.5) { x = target; raf = 0; apply(); return; }
    apply();
    raf = requestAnimationFrame(tick);
  };
  const glide = (to: number) => { target = clamp(to); if (!raf) raf = requestAnimationFrame(tick); };

  function fit() {
    const r = svg.getBoundingClientRect();
    if (!r.width || !r.height) return;
    const mid = on ? x + viewW / 2 : START_X;
    on = r.width / r.height < 1.2; // the whole island would be too small to tap
    viewW = on ? Math.min(MAX_X - MIN_X, (H * r.width) / r.height) : W;
    x = target = clamp(mid - viewW / 2);
    apply();
  }
  new ResizeObserver(fit).observe(svg);
  fit();

  // swipe to pan; a drag never counts as a tap on whatever it started on
  let down: { px: number; x: number } | null = null;
  let dragged = false;
  svg.addEventListener('pointerdown', (e) => {
    if (!on) return;
    down = { px: e.clientX, x: target };
    dragged = false;
  });
  addEventListener('pointermove', (e) => {
    if (!down) return;
    const dx = e.clientX - down.px;
    if (Math.abs(dx) > 8) dragged = true;
    if (!dragged) return;
    const scale = viewW / svg.getBoundingClientRect().width;
    x = target = clamp(down.x - dx * scale);
    apply();
  });
  addEventListener('pointerup', () => { down = null; });
  addEventListener('pointercancel', () => { down = null; });
  svg.addEventListener('click', (e) => {
    if (dragged) { e.preventDefault(); e.stopPropagation(); dragged = false; }
  }, true);

  left.addEventListener('click', () => glide(target - viewW * 0.6));
  right.addEventListener('click', () => glide(target + viewW * 0.6));

  return {
    // she's walking: keep her in the middle of the view
    follow(px: number) { if (on && !down) glide(px - viewW / 2); },
  };
}
