import { useState } from 'react';
import type { Cart, CartId } from '../data';
import { CARTS } from '../data';

interface Props {
  cart: Cart | null;
  dragging: boolean;
  onDropCart: (id: CartId) => void;
  onEject: () => void;
}

export default function Deck({ cart, dragging, onDropCart, onEject }: Props) {
  const [over, setOver] = useState(false);
  return (
    <div
      className={`deck ${dragging ? 'is-dragging' : ''} ${over ? 'is-over' : ''}`}
      onDragOver={(e) => {
        if (e.dataTransfer.types.includes('application/x-madebit-cart')) { e.preventDefault(); setOver(true); }
      }}
      onDragLeave={() => setOver(false)}
      onDrop={(e) => {
        e.preventDefault();
        setOver(false);
        const id = e.dataTransfer.getData('application/x-madebit-cart') as CartId;
        if (CARTS.some((c) => c.id === id)) onDropCart(id);
      }}
    >
      <div className="slot" />
      {cart && (
        <div className="inserted" style={{ background: cart.color }} key={cart.id}>
          <span>{cart.label}</span>
        </div>
      )}
      <span className="led" style={{ background: cart ? cart.color : '#3a3a3a' }} />
      <button className="eject" onClick={onEject} disabled={!cart}>EJECT</button>
      <span className="deck-hint" aria-live="polite">
        {dragging ? 'drop it in the slot!' : ''}
      </span>
    </div>
  );
}
