import type { CartId } from '../data';
import TitleScreen from './screens/TitleScreen';
import MusicScreen from './screens/MusicScreen';
import VideoScreen from './screens/VideoScreen';
import ShopScreen from './screens/ShopScreen';
import MailboxScreen from './screens/MailboxScreen';
import AboutScreen from './screens/AboutScreen';
import DeskScreen from './screens/DeskScreen';

export default function Tv({ on, go }: { on: CartId | null; go: (id: CartId) => void }) {
  return (
    <div className="tv">
      <div className="screen" key={on ?? 'title'}>
        <div className="screen-inner">
          {on === null && <TitleScreen />}
          {on === 'music' && <MusicScreen />}
          {on === 'videos' && <VideoScreen />}
          {on === 'shop' && <ShopScreen />}
          {on === 'mailbox' && <MailboxScreen />}
          {on === 'about' && <AboutScreen />}
          {on === 'desk' && <DeskScreen go={go} />}
        </div>
        <div className="scanlines" aria-hidden="true" />
      </div>
      <div className="tv-controls" aria-hidden="true">
        <span className="knob" />
        <span className="knob" />
        <span className="grille" />
        <span className="grille" />
        <span className="grille" />
      </div>
    </div>
  );
}
