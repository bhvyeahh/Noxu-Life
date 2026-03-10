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
  
  // Track where the mouse is (target) vs where the gradient is (current)
  const targetPos = useRef({ x: 0, y: 0 });
  const currentPos = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const host = ref.current;
    if (!host) return;

    // Set initial static positions
    host.style.setProperty('--posX', String(initialOffset?.x ?? 0));
    host.style.setProperty('--posY', String(initialOffset?.y ?? 0));

    if (!interactive) return;

    // Detect if the user is on a touch device (mobile/tablet)
    const isTouchDevice = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);

    // If on mobile, exit early. No event listeners, no animation loops. Peak performance.
    if (isTouchDevice) return;

    const onPointerMove = (e: PointerEvent) => {
      // Ignore any accidental touch events on hybrid devices
      if (e.pointerType === 'touch') return;

      const rect = host.getBoundingClientRect();
      // Calculate where the mouse is relative to the center of the screen
      targetPos.current.x = e.clientX - rect.left - rect.width / 2;
      targetPos.current.y = e.clientY - rect.top - rect.height / 2;
    };

    const onPointerLeave = () => {
      // Gently return to center when mouse leaves the screen
      targetPos.current.x = 0;
      targetPos.current.y = 0;
    };

    // The Physics Engine (Buttery Smooth Lerping)
    const renderLoop = () => {
      const prefersReduced = typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
      const k = prefersReduced ? 0.1 : intensity * 0.8;

      // Lerp math: Move the current position 6% towards the target position every frame.
      // This creates the ultra-smooth, fluid trailing effect with zero lag.
      currentPos.current.x += (targetPos.current.x - currentPos.current.x) * 0.06;
      currentPos.current.y += (targetPos.current.y - currentPos.current.y) * 0.06;

      // Apply the physics to the CSS variables
      host.style.setProperty('--posX', String(currentPos.current.x * k));
      host.style.setProperty('--posY', String(currentPos.current.y * k));

      // Loop infinitely
      rafRef.current = requestAnimationFrame(renderLoop);
    };

    // Attach listeners
    host.addEventListener('pointermove', onPointerMove, { passive: true });
    host.addEventListener('pointerleave', onPointerLeave);

    // Kick off the continuous smooth render loop
    rafRef.current = requestAnimationFrame(renderLoop);

    // Cleanup on unmount
    return () => {
      host.removeEventListener('pointermove', onPointerMove);
      host.removeEventListener('pointerleave', onPointerLeave);
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
          background: `
            radial-gradient(circle 800px at calc(20% + var(--posX)*1.5px) calc(20% + var(--posY)*1.5px), rgba(0, 150, 255, 0.25) 0%, transparent 100%),
            radial-gradient(circle 900px at calc(80% - var(--posX)*1px) calc(10% - var(--posY)*1px), rgba(239, 200, 139, 0.25) 0%, transparent 100%),
            radial-gradient(circle 800px at calc(20% + var(--posX)*0.8px) calc(80% + var(--posY)*0.8px), rgba(255, 50, 50, 0.25) 0%, transparent 100%),
            radial-gradient(circle 1000px at calc(80% - var(--posX)*0.5px) calc(90% - var(--posY)*0.5px), rgba(120, 0, 255, 0.2) 0%, transparent 100%)
          `,
        }}
      />
      
      {/* Dark layer */}
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