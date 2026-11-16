import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import Sprite from './Sprite';
import { sfx } from '../sound';

// The little me on the desk. Grab her by the head, swing her around, let go and she flops back down.
// Drawn in three pieces (head, body, legs) that swing on springs so she dangles like a ragdoll.
// Feed her cookies; dunk her in the coffee and she gets the zoomies.
const W = 48; // sprite width in scene px (3px per pixel-art cell)
const SCENE_W = 700;
const REST_Y = 270; // where her head sits when she's standing on the desk
const TOP_Y = 24; // ceiling (just under the string lights)
const START_X = 520;
const GRAVITY = 0.9;
const COOKIE = 'application/x-madebit-cookie';

const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));

export interface RagdollHandle {
  /** happy little hop with a heart */
  hop: () => void;
  /** caffeinated: bounce off the walls for a few seconds */
  zoomies: () => void;
  /** a beat in the song: a little dance hop, swaying side to side */
  beat: (strength: number) => void;
}

interface Props {
  /** let go of her; cx/cy is her body's center in scene px */
  onRelease?: (cx: number, cy: number) => void;
  /** a cookie is picked up, so tapping her feeds her instead of grabbing her */
  feedReady?: boolean;
  /** fed: index of the cookie if it was dragged onto her */
  onFeed?: (cookie?: number) => void;
  onLand?: (hard: boolean) => void;
  onCrash?: () => void;
}

const Ragdoll = forwardRef<RagdollHandle, Props>(function Ragdoll({ onRelease, feedReady, onFeed, onLand, onCrash }, ref) {
  const root = useRef<HTMLDivElement>(null);
  const body = useRef<HTMLDivElement>(null);
  const legs = useRef<HTMLDivElement>(null);
  const [hearts, setHearts] = useState<number[]>([]);
  const s = useRef({
    x: START_X, y: REST_Y, vx: 0, vy: 0,
    held: false, grabDx: 0, grabDy: 0, px: 0, py: 0, airborne: false,
    a1: 0, v1: 0, a2: 0, v2: 0, // body + legs angles (deg) and their spin
    wiredUntil: 0, wiredLevel: 0, lastBoing: 0, sway: 1,
  });
  const cb = useRef({ onLand, onCrash });
  cb.current = { onLand, onCrash };

  useImperativeHandle(ref, () => ({
    hop: () => {
      const st = s.current;
      if (st.held) return;
      st.airborne = true;
      st.vy = -9;
      setHearts((h) => [...h, Date.now()]);
      window.setTimeout(() => setHearts((h) => h.slice(1)), 900);
    },
    zoomies: () => {
      const st = s.current;
      st.wiredLevel = Math.min(st.wiredLevel + 1, 3);
      st.wiredUntil = performance.now() + 5000;
      st.airborne = true;
      const sp = 10 + st.wiredLevel * 4;
      const a = Math.random() * Math.PI * 2;
      st.vx = Math.cos(a) * sp;
      st.vy = -Math.abs(Math.sin(a) * sp) - 4;
      root.current?.classList.add('wired');
    },
    beat: (strength) => {
      const st = s.current;
      if (st.held || st.airborne || performance.now() < st.wiredUntil) return;
      st.airborne = true;
      st.vy = -(3 + strength * 4);
      st.sway = -st.sway;
      st.v1 += st.sway * (6 + strength * 8);
    },
  }));

  useEffect(() => {
    let raf = 0;
    const tick = () => {
      const st = s.current;
      const now = performance.now();
      const wired = now < st.wiredUntil;
      if (!wired && st.wiredLevel > 0) {
        // the crash: caffeine wears off and she drops
        st.wiredLevel = 0;
        root.current?.classList.remove('wired');
        st.vx *= 0.3;
        st.vy = 2;
        cb.current.onCrash?.();
      }
      if (st.held) {
        const nx = st.px - st.grabDx;
        const ny = st.py - st.grabDy;
        st.vx = nx - st.x;
        st.vy = ny - st.y;
        st.x = nx;
        st.y = ny;
      } else if (wired) {
        // no gravity, keep her speed up, bounce off every wall
        const sp = 10 + st.wiredLevel * 4;
        const cur = Math.hypot(st.vx, st.vy) || 1;
        st.vx = (st.vx / cur) * sp;
        st.vy = (st.vy / cur) * sp;
        st.x += st.vx;
        st.y += st.vy;
        let hit = false;
        if (st.x < 0 || st.x > SCENE_W - W) { st.x = clamp(st.x, 0, SCENE_W - W); st.vx *= -1; st.vy += (Math.random() - 0.5) * 4; hit = true; }
        if (st.y < TOP_Y || st.y > REST_Y) { st.y = clamp(st.y, TOP_Y, REST_Y); st.vy *= -1; st.vx += (Math.random() - 0.5) * 4; hit = true; }
        if (hit && now - st.lastBoing > 90) { st.lastBoing = now; sfx.boing(); }
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
            cb.current.onLand?.(hit > 18);
          }
        }
      }
      // Body swings opposite to the motion (she's held by the head), legs lag behind the body.
      const moving = st.held || st.airborne || wired;
      const jitter = wired ? (Math.random() - 0.5) * 30 : 0;
      const t1 = moving ? clamp(-st.vx * 4, -80, 80) + jitter : 0;
      st.v1 += (t1 - st.a1) * 0.12 - st.v1 * 0.14;
      st.a1 += st.v1;
      const t2 = st.a1 + (moving ? clamp(-st.vx * 2, -40, 40) : 0);
      st.v2 += (t2 - st.a2) * 0.18 - st.v2 * 0.16;
      st.a2 += st.v2;

      const shake = wired ? `translate(${(Math.random() - 0.5) * 3}px, ${(Math.random() - 0.5) * 3}px)` : '';
      if (root.current) root.current.style.transform = `translate(${st.x}px, ${st.y}px) ${shake}`;
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

  const letGo = () => {
    const st = s.current;
    if (!st.held) return;
    st.held = false;
    root.current?.classList.remove('held');
    onRelease?.(st.x + W / 2, st.y + 38);
  };

  return (
    <div
      ref={root}
      className="ragdoll"
      role="button"
      aria-label={feedReady ? 'madebit: feed me the cookie' : 'madebit: drag me around'}
      onPointerDown={(e) => {
        if (feedReady) { onFeed?.(); return; }
        e.currentTarget.setPointerCapture(e.pointerId);
        const p = toScene(e);
        const st = s.current;
        st.held = true;
        st.airborne = true;
        st.wiredUntil = 0;
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
      onPointerUp={letGo}
      onPointerCancel={letGo}
      onDragOver={(e) => { if (e.dataTransfer.types.includes(COOKIE)) e.preventDefault(); }}
      onDrop={(e) => {
        e.preventDefault();
        const i = Number(e.dataTransfer.getData(COOKIE));
        if (!Number.isNaN(i)) onFeed?.(i);
      }}
    >
      <span className="desk-tag">{feedReady ? 'feed me!' : 'grab me'}</span>
      {hearts.map((k) => <span key={k} className="rd-heart" aria-hidden="true">♥</span>)}
      <Sprite size={W} rows={[0, 10]} />
      <div ref={body} className="rd-body" style={{ marginTop: -1 }}>
        <Sprite size={W} rows={[10, 15]} />
        <div ref={legs} className="rd-legs" style={{ marginTop: -1 }}>
          <Sprite size={W} rows={[15, 20]} />
        </div>
      </div>
    </div>
  );
});

export default Ragdoll;
