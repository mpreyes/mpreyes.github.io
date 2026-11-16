import { useLayoutEffect, useRef, useState, type ReactNode } from 'react';

// Draws a fixed-size scene (like the solar system or the desk) and scales it to fit its box.
// With `pan`, a scene that's wider than its box fills the height instead and scrolls sideways
// (used for the desk on phones, so everything stays big enough to tap).
export default function Stage({ w, h, pan = false, children }: { w: number; h: number; pan?: boolean; children: ReactNode }) {
  const box = useRef<HTMLDivElement>(null);
  const [fit, setFit] = useState({ scale: 1, panning: false });
  useLayoutEffect(() => {
    const el = box.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      const contain = Math.min(width / w, height / h);
      const panning = pan && height / h > contain * 1.15;
      setFit({ scale: panning ? height / h : contain, panning });
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, [w, h, pan]);

  // start a panning scene centered
  useLayoutEffect(() => {
    const el = box.current;
    if (el && fit.panning) el.scrollLeft = (el.scrollWidth - el.clientWidth) / 2;
  }, [fit.panning]);

  // one tree for both modes, so switching never remounts the scene
  return (
    <div ref={box} className={`stage-box ${fit.panning ? 'panning' : ''}`}>
      <div style={fit.panning ? { width: w * fit.scale, height: '100%', position: 'relative' } : { position: 'absolute', inset: 0 }}>
        <div
          className="stage"
          style={fit.panning
            ? { width: w, height: h, left: 0, top: 0, transformOrigin: 'top left', transform: `scale(${fit.scale})` }
            : { width: w, height: h, transform: `translate(-50%, -50%) scale(${fit.scale})` }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
