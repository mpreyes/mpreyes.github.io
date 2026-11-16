import { useState } from 'react';
import { VIDEOS } from '../../data';
import { sfx } from '../../sound';

export default function VideoScreen() {
  const [i, setI] = useState(0);
  const v = VIDEOS[i];
  const flip = (d: number) => { sfx.select(); setI((i + d + VIDEOS.length) % VIDEOS.length); };
  return (
    <div className="screen-pad videos">
      <div className="video-head">
        <span className="screen-heading" style={{ color: v.color }}>CH {String(i + 1).padStart(2, '0')} · {v.title}</span>
        <span className="screen-note">{v.kind}</span>
      </div>
      <div className="video-frame">
        <iframe
          key={v.embed}
          src={v.embed}
          title={v.title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
      <div className="video-controls">
        <button className="btn-solid" onClick={() => flip(-1)} aria-label="Previous channel">&lt; CH</button>
        <div className="dots" aria-hidden="true">
          {VIDEOS.map((_, n) => <span key={n} className={n === i ? 'on' : ''} />)}
        </div>
        <button className="btn-solid" onClick={() => flip(1)} aria-label="Next channel">CH &gt;</button>
      </div>
    </div>
  );
}
