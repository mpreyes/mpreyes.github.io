import { useEffect, useRef } from 'react';
import Sprite from './Sprite';
import { sfx } from '../sound';

// The little me on the desk. Grab her by the head, swing her around, let go and she flops back down.
// Drawn in three pieces (head, body, legs) that swing on springs so she dangles like a ragdoll.
const W = 48; // sprite width in scene px (3px per pixel-art cell)
const SCENE_W = 700;
const REST_Y = 270; // where her head sits when she's standing on the desk
const START_X = 520;
const GRAVITY = 0.9;

const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));

export default function Ragdoll({ onLand }: { onLand?: (hard: boolean) => void }) {
  const root = useRef<HTMLDivElement>(null);
  const body = useRef<HTMLDivElement>(null);
  const legs = useRef<HTMLDivElement>(null);
  const s = useRef({
    x: START_X, y: REST_Y, vx: 0, vy: 0,
    held: false, grabDx: 0, grabDy: 0, px: 0, py: 0, airborne: false,
    a1: 0, v1: 0, a2: 0, v2: 0, // body + legs angles (deg) and their spin
  });
  const onLandRef = useRef(onLand);
  onLandRef.current = onLand;

  useEffect(() => {
    let raf = 0;
    const tick = () => {
      const st = s.current;
      if (st.held) {
        const nx = st.px - st.grabDx;
        const ny = st.py - st.grabDy;
        st.vx = nx - st.x;
        st.vy = ny - st.y;
        st.x = nx;
        st.y = ny;
      } else if (st.airborne || st.y < REST_Y) {
        st.vy += GRAVITY;
        st.x += st.vx;
        st.y += st.vy;
        st.vx *= 0.985;
        if (st.x < 0 || st.x > SCENE_W - W) { st.x = clamp(st.x, 0, SCENE_W - W); st.vx *= -0.5; }
        if (st.y >= REST_Y) {
          const hit = st.vy;
          st.y = REST_Y;
          st.vy = -hit * 0.3;
          st.vx *= 0.6;
          st.v1 += st.vx * 2;
          if (hit > 4) sfx.thud(Math.min(1, hit / 20));
          if (Math.abs(st.vy) < 2) {
            st.vy = 0;
            st.airborne = false;
            onLandRef.current?.(hit > 18);
          }
        }
      }
      // Body swings opposite to the motion (she's held by the head), legs lag behind the body.
      const moving = st.held || st.airborne;
      const t1 = moving ? clamp(-st.vx * 4, -80, 80) : 0;
      st.v1 += (t1 - st.a1) * 0.12 - st.v1 * 0.14;
      st.a1 += st.v1;
      const t2 = st.a1 + (moving ? clamp(-st.vx * 2, -40, 40) : 0);
      st.v2 += (t2 - st.a2) * 0.18 - st.v2 * 0.16;
      st.a2 += st.v2;

      if (root.current) root.current.style.transform = `translate(${st.x}px, ${st.y}px)`;
      if (body.current) body.current.style.transform = `rotate(${st.a1}deg)`;
      if (legs.current) legs.current.style.transform = `rotate(${st.a2 - st.a1}deg)`;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  // pointer position in scene coordinates (the scene is scaled to fit the TV)
  const toScene = (e: React.PointerEvent) => {
    const scene = root.current?.offsetParent as HTMLElement | null;
    const r = scene?.getBoundingClientRect();
    if (!r) return { x: 0, y: 0 };
    const k = r.width / SCENE_W;
    return { x: (e.clientX - r.left) / k, y: (e.clientY - r.top) / k };
  };

  return (
    <div
      ref={root}
      className="ragdoll"
      role="button"
      aria-label="madebit: drag me around"
      onPointerDown={(e) => {
        e.currentTarget.setPointerCapture(e.pointerId);
        const p = toScene(e);
        const st = s.current;
        st.held = true;
        st.airborne = true;
        st.px = p.x;
        st.py = p.y;
        st.grabDx = W / 2; // hold her by the head
        st.grabDy = 8;
        root.current?.classList.add('held');
        sfx.lift();
      }}
      onPointerMove={(e) => {
        const st = s.current;
        if (!st.held) return;
        const p = toScene(e);
        st.px = clamp(p.x, W / 2, SCENE_W - W / 2);
        st.py = clamp(p.y, 30, REST_Y + 8);
      }}
      onPointerUp={() => { s.current.held = false; root.current?.classList.remove('held'); }}
      onPointerCancel={() => { s.current.held = false; root.current?.classList.remove('held'); }}
    >
      <span className="desk-tag">grab me</span>
      <Sprite size={W} rows={[0, 10]} />
      <div ref={body} className="rd-body" style={{ marginTop: -1 }}>
        <Sprite size={W} rows={[10, 15]} />
        <div ref={legs} className="rd-legs" style={{ marginTop: -1 }}>
          <Sprite size={W} rows={[15, 20]} />
        </div>
      </div>
    </div>
  );
}
