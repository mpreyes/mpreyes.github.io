import Sprite from '../Sprite';
import { BIO_LETTER, BIO_SHORT, EMAIL } from '../../data';

export default function AboutScreen() {
  return (
    <div className="screen-pad about" style={{ justifyContent: 'flex-start', padding: 28 }}>
      <h2 className="screen-heading big gold">PLAYER 1</h2>
      <div className="about-row">
        <Sprite size={80} className="bob" />
        <dl className="stats">
          <dt>CLASS</dt><dd>singer / songwriter / producer</dd>
          <dt>SPECIAL MOVE</dt><dd>thumpy music</dd>
          <dt>STATS</dt><dd>curious 99 · silly 99</dd>
        </dl>
      </div>
      <p className="screen-copy" style={{ maxWidth: 'none' }}>{BIO_LETTER}</p>
      <p className="screen-note">{BIO_SHORT}</p>
      <a className="screen-link" href={`mailto:${EMAIL}`}>{EMAIL}</a>
    </div>
  );
}
