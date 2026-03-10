"use client";

import { ReactLenis } from "@studio-freight/react-lenis";

export function SmoothScrolling({ children }: { children: React.ReactNode }) {
  return (
    <ReactLenis 
      root 
      options={{ 
        // 0.1 is the sweet spot. Snappy enough to feel instantly responsive, but smooth enough to feel premium.
        lerp: 0.05, 
        
        smoothWheel: true, 
        
        // Normalizes mouse wheel speed across different brands of mice (Logitech vs Apple Magic Mouse)
        wheelMultiplier: 1, 

        // CRITICAL FOR MOBILE: Never hijack touch events. Let iOS and Android use their native butter-smooth momentum scrolling.
        syncTouch: false,
        // smoothTouch: false,
      }}
    >
      {children as any}
    </ReactLenis>
  );
}