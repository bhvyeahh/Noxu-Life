"use client";

import { ReactLenis } from "@studio-freight/react-lenis";

export function SmoothScrolling({ children }: { children: React.ReactNode }) {
  return (
    <ReactLenis 
      root 
      options={{ 
        lerp: 0.05, // Controls the "butter" factor (lower is smoother, but slower)
        duration: 1.5, // Time it takes to complete the scroll animation
        smoothWheel: true, 
      }}
    >
      {children as any}
    </ReactLenis>
  );
}