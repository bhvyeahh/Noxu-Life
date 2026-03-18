'use client';

import React from 'react';

type InteractiveGradientBackgroundProps = {
  className?: string;
  children?: React.ReactNode;
  intensity?: number;
  interactive?: boolean; 
  initialOffset?: { x?: number; y?: number };
  dark?: boolean;
};

export function InteractiveGradientBackground({
  className = '',
  children,
}: InteractiveGradientBackgroundProps) {
  
  return (
    <div className={`relative w-full min-h-screen bg-[#030303] overflow-hidden ${className}`}>
      
      {/* THE PREMIUM DOTTED GRID + TOP GLOW
        Why it's fast: No blur() filters. Pure CSS background drawing.
      */}
      <div 
        className="absolute inset-0 z-0 pointer-events-none"
        style={{
          // Layer 1: The subtle orange top glow
          // Layer 2: The classic SaaS dot grid (Changed from white to a subtle thematic warm/copper tint)
          backgroundImage: `
            radial-gradient(circle at 50% -20%, rgba(224, 79, 31, 0.15), transparent 60%),
            radial-gradient(circle, rgba(224, 79, 31, 0.15) 1.5px, transparent 1.5px)
          `,
          backgroundSize: '100% 100%, 32px 32px',
          backgroundPosition: '0 0, center center',
          // Fades the dots out at the edges (Vignette effect) so it doesn't look like cheap wallpaper
          maskImage: 'radial-gradient(ellipse at center, black 30%, transparent 90%)',
          WebkitMaskImage: 'radial-gradient(ellipse at center, black 30%, transparent 90%)',
        }}
      />

      {/* Content */}
      {children ? (
        <div className="relative z-10 min-h-screen w-full">{children}</div>
      ) : null}
    </div>
  );
}