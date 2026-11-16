import { useCallback, useEffect, useLayoutEffect, useRef, useState, type ReactNode } from 'react';
import { CARTS, type CartId } from './data';
import { sfx } from './sound';
import Tv from './components/Tv';
import Deck from './components/Deck';
import Shelf from './components/Shelf';
import Socials from './components/Socials';

// On desktop the whole room is drawn at a fixed width and scaled to fit the window,
// like a game screen, so nothing ever scrolls. Phones keep the normal scrolling layout.
// The brown desk is the bottom ~30% of the room, so the TV looks like it's sitting on it.
const DESIGN_W = 1440;
const DESK_AT = 0.7; // desk edge, as a share of the room's height from the top
const MAX_SCALE = 1.2;
const desktopQuery = '(min-width: 961px)';

function FitRoom({ children }: { children: (ref: React.RefObject<HTMLDivElement>, floor: React.RefObject<HTMLElement>, style?: React.CSSProperties) => ReactNode }) {
  const room = useRef<HTMLDivElement>(null);
  const floor = useRef<HTMLElement>(null);
  const [desktop, setDesktop] = useState(() => window.matchMedia(desktopQuery).matches);
  const [fit, setFit] = useState({ s: 1, left: 0, top: 0, deskPx: 0 });

  useEffect(() => {
    const mq = window.matchMedia(desktopQuery);
    const on = () => setDesktop(mq.matches);
    mq.addEventListener('change', on);
    return () => mq.removeEventListener('change', on);
  }, []);

  useLayoutEffect(() => {
    if (!desktop) return;
    const el = room.current;
    if (!el) return;
    const update = () => {
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const h = el.offsetHeight;
      const s = Math.min(vw / DESIGN_W, vh / h, MAX_SCALE);
      const top = Math.max(0, vh - h * s);
      const deskPx = top + h * s * DESK_AT;
      setFit({ s, left: (vw - DESIGN_W * s) / 2, top, deskPx });
    };
    const ro = new ResizeObserver(update);
    ro.observe(el);
    window.addEventListener('resize', update);
    update();
    return () => { ro.disconnect(); window.removeEventListener('resize', update); };
  }, [desktop]);

  if (!desktop) return <>{children(room, floor)}</>;
  return (
    <div
      className="fit-outer"
      style={{ background: `linear-gradient(to bottom, var(--ink) ${fit.deskPx}px, #2A1B16 ${fit.deskPx}px, #2A1B16 ${fit.deskPx + 8 * fit.s}px, var(--floor) ${fit.deskPx + 8 * fit.s}px)` }}
    >
      {children(room, floor, { width: DESIGN_W, left: fit.left, top: fit.top, transform: `scale(${fit.s})` })}
    </div>
  );
}

export default function App() {
  const [on, setOn] = useState<CartId | null>(null);
  const [dragging, setDragging] = useState(false);

  const insert = useCallback((id: CartId | null) => {
    setOn((cur) => {
      if (id === cur) return cur;
      if (id) sfx.insert(); else sfx.eject();
      return id;
    });
  }, []);

  // Escape ejects, like a reset button
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') insert(null); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [insert]);

  const cart = CARTS.find((c) => c.id === on) ?? null;

  return (
    <FitRoom>{(room, floor, style) => (
    <div className="room" ref={room} style={style}>
      <header className="top">
        <h1 className="logo">MADEBIT</h1>
      </header>
      <main className="layout">
        {/* on desktop the socials sit on the desk, to the right of the TV */}
        <Socials className="socials-side" />
        <section className="console-col" aria-label="The console">
          <Tv on={on} go={insert} />
          <Deck cart={cart} dragging={dragging} onDropCart={(id) => { setDragging(false); insert(id); }} onEject={() => insert(null)} />
        </section>
        <Shelf on={on} onPick={(id) => insert(id === on ? null : id)} onDragChange={setDragging} />
      </main>
      <footer className="floor" ref={floor}>
        <Socials />
      </footer>
    </div>
    )}</FitRoom>
  );
}
