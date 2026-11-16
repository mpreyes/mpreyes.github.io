import Sprite from '../Sprite';

export default function TitleScreen() {
  return (
    <div className="title-screen">
      <span className="title-logo">MADEBIT</span>
      <Sprite size={80} className="bob" />
      <span className="blink press">INSERT A CARTRIDGE</span>
    </div>
  );
}
