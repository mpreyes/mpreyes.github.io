import type { SyntheticEvent } from 'react';
import { BANDCAMP, MERCH, type MerchItem } from '../../data';
import { sfx } from '../../sound';

const hideBroken = (e: SyntheticEvent<HTMLImageElement>) => { e.currentTarget.style.visibility = 'hidden'; };

// Each item is a little cartridge with the cover art as its label.
function Cart({ item, n }: { item: MerchItem; n: number }) {
  return (
    <span className="shop-cart" style={{ background: item.color }}>
      <span className="shop-cart-grip" />
      <span className="shop-cart-label">
        {item.art && <img src={item.art} alt="" loading="lazy" onError={hideBroken} />}
      </span>
      <span className="shop-cart-code">MB-{String(n + 1).padStart(2, '0')}</span>
    </span>
  );
}

export default function ShopScreen() {
  return (
    <div className="screen-pad shop">
      <div className="video-head">
        <h2 className="screen-heading big pink">ITEM SHOP</h2>
        <span className="screen-note">pick one up on bandcamp</span>
      </div>
      <ul className="merch">
        {MERCH.map((m, i) => (
          <li key={m.url + m.name}>
            <a href={m.url} target="_blank" rel="noreferrer" className="merch-item" onClick={() => sfx.select()}>
              <Cart item={m} n={i} />
              <span className="merch-name">{m.name}</span>
              <span className="merch-row">
                <span className="merch-kind">{m.kind}</span>
                <span className="merch-price">{m.price}</span>
              </span>
              <span className="merch-buy">BUY &gt;</span>
            </a>
          </li>
        ))}
      </ul>
      <div className="shop-foot">
        <span className="screen-note">name your price · checkout handled by bandcamp</span>
        <a className="pill pill-lime" href={BANDCAMP} target="_blank" rel="noreferrer">ALL ON BANDCAMP</a>
      </div>
    </div>
  );
}
