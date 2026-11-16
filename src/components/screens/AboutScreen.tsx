import Sprite from '../Sprite';
import { EMAIL } from '../../data';

export default function AboutScreen() {
  return (
    <div className="screen-pad about">
      <h2 className="screen-heading big gold">PLAYER 1</h2>
      <div className="about-row">
        <Sprite size={80} className="bob" />
        <dl className="stats">
          <dt>CLASS</dt><dd>singer / songwriter / producer</dd>
          <dt>SPECIAL MOVE</dt><dd>thumpy music</dd>
          <dt>STATS</dt><dd>curious 99 · silly 99</dd>
          <dt>BIO</dt><dd>[SHORT BIO]</dd>
        </dl>
      </div>
      <a className="screen-link" href={`mailto:${EMAIL}`}>{EMAIL}</a>
    </div>
  );
}
