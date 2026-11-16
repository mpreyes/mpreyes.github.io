import { CARTS, type CartId } from '../data';

interface Props {
  on: CartId | null;
  onPick: (id: CartId) => void;
  onDragChange: (dragging: boolean) => void;
}

export default function Shelf({ on, onPick, onDragChange }: Props) {
  return (
    <section className="shelf" aria-label="Cartridges">
      <p className="shelf-hint">
        <span className="hint-drag">DRAG ONE INTO THE CONSOLE</span>
        <span className="hint-tap">TAP A CARTRIDGE TO PLAY</span>
      </p>
      <ul className="carts">
        {CARTS.map((c) => (
          <li key={c.id}>
            <button
              className={`cart ${on === c.id ? 'is-in' : ''}`}
              style={{ background: c.color }}
              draggable
              onDragStart={(e) => {
                e.dataTransfer.setData('application/x-madebit-cart', c.id);
                e.dataTransfer.effectAllowed = 'move';
                onDragChange(true);
              }}
              onDragEnd={() => onDragChange(false)}
              onClick={() => onPick(c.id)}
              aria-pressed={on === c.id}
            >
              <span className="cart-label-sticker">{c.code}</span>
              <span className="cart-text">
                <span className="cart-name">{c.label}</span>
                <span className="cart-sub">{c.sub}</span>
              </span>
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
