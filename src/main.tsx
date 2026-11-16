import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '@fontsource/press-start-2p';
import '@fontsource/space-mono/400.css';
import '@fontsource/space-mono/700.css';
import './styles.css';
import './extras.css';
import App from './App';
import { unlockAudio } from './sound';

// turn sound on with the first tap or key press (phones won't play anything before that)
const UNLOCK_EVENTS = ['pointerup', 'touchend', 'click', 'keydown'] as const;
const unlock = () => {
  void unlockAudio().then((on) => { if (on) UNLOCK_EVENTS.forEach((ev) => window.removeEventListener(ev, unlock, true)); });
};
UNLOCK_EVENTS.forEach((ev) => window.addEventListener(ev, unlock, true));

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
