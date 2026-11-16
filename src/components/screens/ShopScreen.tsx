import { BANDCAMP, MERCH, type MerchItem } from '../../data';

function Thumb({ item }: { item: MerchItem }) {
  return (
    <span className={`thumb thumb-${item.shape}`} style={{ background: item.color }}>
      {item.shape === 'tee' && <span className="tee" />}
      {item.shape === 'stickers' && (<><span className="sticker-a" /><span className="sticker-b" /></>)}
      {item.shape === 'tape' && <span className="tape"><span /><span /></span>}
      {item.shape === 'pack' && <span className="pack">INST +<br />ACAP<br />PACK</span>}
    </span>
  );
}

export default function ShopScreen() {
  return (
    <div className="screen-pad shop">
      <h2 className="screen-heading big pink">ITEM SHOP</h2>
      <ul className="merch">
        {MERCH.map((m) => (
          <li key={m.name}>
            <a href={m.url} target="_blank" rel="noreferrer" className="merch-item">
              <Thumb item={m} />
              <span className="merch-name">{m.name}</span>
              <span className="merch-price">{m.price}</span>
            </a>
          </li>
        ))}
      </ul>
      <div className="shop-foot">
        <span className="screen-note">checkout + shipping handled by bandcamp</span>
        <a className="pill pill-lime" href={BANDCAMP} target="_blank" rel="noreferrer">SHOP ON BANDCAMP</a>
      </div>
    </div>
  );
}
