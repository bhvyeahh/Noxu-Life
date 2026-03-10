'use client';

import { useEffect, useRef } from 'react';

type InteractiveGradientBackgroundProps = {
  className?: string;
  children?: React.ReactNode;
  /** 0..1.5 strength */
  intensity?: number;
  /** enable pointer interaction */
  interactive?: boolean;
  /** initial offset in px */
  initialOffset?: { x?: number; y?: number };
  /** force dark mode look */
  dark?: boolean;
};

export function InteractiveGradientBackground({
  className = '',
  children,
  intensity = 1,
  interactive = true,
  initialOffset,
  dark = false, // Keep this false in your Waitlist component!
}: InteractiveGradientBackgroundProps) {
  const ref = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);
  const pendingRef = useRef<PointerEvent | Touch | null>(null);

  const schedule = () => {
    if (rafRef.current) return;
    rafRef.current = requestAnimationFrame(() => {
      rafRef.current = null;
      const host = ref.current;
      const ev = pendingRef.current;
      if (!host || !ev) return;
      const rect = host.getBoundingClientRect();
      const px = ('clientX' in ev ? ev.clientX : 0) - rect.left - rect.width / 2;
      const py = ('clientY' in ev ? ev.clientY : 0) - rect.top - rect.height / 2;

      const prefersReduced =
        typeof window !== 'undefined' &&
        window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

      // Reduced intensity slightly so the movement feels smoother and less erratic
      const k = prefersReduced ? 0.1 : intensity * 0.8;

      host.style.setProperty('--posX', String(px * k));
      host.style.setProperty('--posY', String(py * k));
    });
  };

  useEffect(() => {
    const host = ref.current;
    if (!host) return;

    // set initial vars
    host.style.setProperty('--posX', String(initialOffset?.x ?? 0));
    host.style.setProperty('--posY', String(initialOffset?.y ?? 0));

    if (!interactive) return;

    const onPointer = (e: PointerEvent) => {
      pendingRef.current = e;
      schedule();
    };
    const onTouch = (e: TouchEvent) => {
      if (!e.touches.length) return;
      pendingRef.current = e.touches[0];
      schedule();
    };
    const reset = () => {
      host.style.setProperty('--posX', '0');
      host.style.setProperty('--posY', '0');
    };

    host.addEventListener('pointermove', onPointer, { passive: true });
    host.addEventListener('touchmove', onTouch, { passive: true });
    host.addEventListener('pointerleave', reset);
    host.addEventListener('touchend', reset);
    host.addEventListener('touchcancel', reset);

    return () => {
      host.removeEventListener('pointermove', onPointer);
      host.removeEventListener('touchmove', onTouch);
      host.removeEventListener('pointerleave', reset);
      host.removeEventListener('touchend', reset);
      host.removeEventListener('touchcancel', reset);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [interactive, intensity, initialOffset?.x, initialOffset?.y]);

  return (
    <div
      ref={ref}
      aria-label="Interactive gradient background"
      role="img"
      className={className}
      style={{
        position: 'relative',
        width: '100%',
        minHeight: '100vh',
        overflow: 'hidden',
        backgroundColor: '#030303', // Solid dark background base for maximum performance
        // CSS vars default
        // @ts-ignore
        '--posX': '0',
        '--posY': '0',
      }}
    >
      {/* Light layer (VIBRANT GLOW - HIGH PERFORMANCE) */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          opacity: dark ? 0 : 1,
          transition: 'opacity 0.5s ease',
          // REMOVED: filter: blur() and mix-blend-mode. 
          // INSTEAD: We use native radial fades (rgba to transparent) which are hardware accelerated and buttery smooth.
          background: `
            radial-gradient(circle 800px at calc(20% + var(--posX)*1.5px) calc(20% + var(--posY)*1.5px), rgba(0, 150, 255, 0.25) 0%, transparent 100%),
            radial-gradient(circle 900px at calc(80% - var(--posX)*1px) calc(10% - var(--posY)*1px), rgba(239, 200, 139, 0.25) 0%, transparent 100%),
            radial-gradient(circle 800px at calc(20% + var(--posX)*0.8px) calc(80% + var(--posY)*0.8px), rgba(255, 50, 50, 0.25) 0%, transparent 100%),
            radial-gradient(circle 1000px at calc(80% - var(--posX)*0.5px) calc(90% - var(--posY)*0.5px), rgba(120, 0, 255, 0.2) 0%, transparent 100%)
          `,
        }}
      />
      
      {/* Dark layer (Optimized just in case you ever switch to dark={true}) */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          opacity: dark ? 1 : 0,
          transition: 'opacity 0.5s ease',
          background: `
            radial-gradient(circle 800px at calc(50% + var(--posX)*1.5px) calc(50% + var(--posY)*1.5px), rgba(207, 92, 54, 0.15) 0%, transparent 100%),
            radial-gradient(circle 800px at calc(80% - var(--posX)*0.8px) calc(20% - var(--posY)*0.8px), rgba(239, 200, 139, 0.1) 0%, transparent 100%)
          `,
        }}
      />

      {/* Content */}
      {children ? (
        <div style={{ position: 'relative', zIndex: 1, minHeight: '100vh', width: '100%' }}>{children}</div>
      ) : null}
    </div>
  );
}