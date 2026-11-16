import { useEffect, type CSSProperties } from 'react';
import { createPortal } from 'react-dom';
import type { Photo } from '../data';

const btn: CSSProperties = {
  background: '#F8F6EF', color: '#111', border: 0, fontFamily: "'Press Start 2P', monospace",
  fontSize: 10, minWidth: 44, minHeight: 44, padding: '0 12px', cursor: 'pointer',
};

// Full-screen photo slideshow, like the one on the old site's desk.
export default function Lightbox({ photos, index, onIndex, onClose }: {
  photos: Photo[];
  index: number;
  onIndex: (i: number) => void;
  onClose: () => void;
}) {
  const n = photos.length;
  const go = (d: number) => onIndex((index + d + n) % n);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { e.stopPropagation(); onClose(); }
      if (e.key === 'ArrowRight') go(1);
      if (e.key === 'ArrowLeft') go(-1);
    };
    window.addEventListener('keydown', onKey, true);
    return () => window.removeEventListener('keydown', onKey, true);
  });

  const p = photos[index];
  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Photos"
      onClick={onClose}
      style={{ position: 'fixed', inset: 0, zIndex: 100, background: 'rgba(11,20,14,.94)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 14, padding: 16 }}
    >
      <div onClick={(e) => e.stopPropagation()} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14, maxWidth: '100%' }}>
        <img src={p.src} alt={p.caption} style={{ maxHeight: '72vh', maxWidth: 'min(92vw, 520px)', objectFit: 'contain', background: '#F8F6EF', padding: 8, boxShadow: '6px 6px 0 #000' }} />
        <p style={{ margin: 0, fontFamily: "'Space Mono', monospace", fontSize: 15, color: '#F8F6EF', textAlign: 'center', maxWidth: 520 }}>{p.caption}</p>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button style={btn} onClick={() => go(-1)} aria-label="Previous photo">&lt;</button>
          <span style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 10, color: '#9DBE3D' }}>{index + 1}/{n}</span>
          <button style={btn} onClick={() => go(1)} aria-label="Next photo">&gt;</button>
          <button style={{ ...btn, marginLeft: 12 }} onClick={onClose} aria-label="Close photos">X</button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
