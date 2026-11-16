import { useCallback, useEffect, useState } from 'react';
import { CARTS, type CartId } from './data';
import { sfx } from './sound';
import Tv from './components/Tv';
import Deck from './components/Deck';
import Shelf from './components/Shelf';
import Socials from './components/Socials';

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
    <div className="room">
      <header className="top">
        <h1 className="logo">MADEBIT</h1>
      </header>
      <main className="layout">
        <section className="console-col" aria-label="The console">
          <Tv on={on} go={insert} />
          <Deck cart={cart} dragging={dragging} onDropCart={(id) => { setDragging(false); insert(id); }} onEject={() => insert(null)} />
        </section>
        <Shelf on={on} onPick={(id) => insert(id === on ? null : id)} onDragChange={setDragging} />
      </main>
      <footer className="floor">
        <Socials />
      </footer>
    </div>
  );
}
