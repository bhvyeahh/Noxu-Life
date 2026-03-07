import React from "react";
import { cn } from "@/lib/utils";

// 1. SVG Filter for subtle glass distortion & noise (VisionOS style)
export const GlassFilter = () => (
  <svg className="fixed pointer-events-none w-0 h-0">
    <filter id="glass-distortion">
      <feTurbulence type="fractalNoise" baseFrequency="0.05" numOctaves="1" result="noise" />
      <feColorMatrix type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 0.05 0" in="noise" result="coloredNoise" />
      <feComposite operator="in" in="coloredNoise" in2="SourceGraphic" result="composite" />
      <feBlend mode="overlay" in="composite" in2="SourceGraphic" />
    </filter>
  </svg>
);

// 2. Base Glass Card/Panel wrapper
export const GlassEffect = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "relative overflow-hidden backdrop-blur-[12px] bg-white/[0.15] dark:bg-black/[0.15]",
          "border border-white/20 dark:border-white/10 rounded-[24px]",
          "shadow-[0_6px_20px_rgba(0,0,0,0.25)]",
          "before:absolute before:inset-0 before:rounded-[24px] before:pointer-events-none before:border-[0.5px] before:border-white/40 before:mix-blend-overlay",
          "transition-all duration-500 ease-[cubic-bezier(0.175,0.885,0.32,2.2)]",
          "hover:scale-[1.02] hover:rounded-[28px]",
          className
        )}
        {...props}
      >
        <div className="relative z-10 h-full w-full">{children}</div>
      </div>
    );
  }
);
GlassEffect.displayName = "GlassEffect";

// 3. Floating Glass Dock (Responsive: Bottom nav on mobile, floating center on desktop)
export const GlassDock = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "fixed z-50 flex items-center justify-center gap-2 p-2",
          "bottom-4 left-4 right-4 md:bottom-auto md:top-8 md:left-1/2 md:-translate-x-1/2 md:w-max",
          "backdrop-blur-[12px] bg-white/[0.20] dark:bg-black/[0.20]",
          "border border-white/20 dark:border-white/10 rounded-[32px]",
          "shadow-[0_8px_32px_rgba(0,0,0,0.3)]",
          "before:absolute before:inset-0 before:rounded-[32px] before:pointer-events-none before:border-[0.5px] before:border-white/40 before:mix-blend-overlay",
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);
GlassDock.displayName = "GlassDock";

// 4. Interactive Glass Button
export const GlassButton = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement>>(
  ({ className, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "relative flex items-center justify-center px-6 py-3",
          "backdrop-blur-[8px] bg-white/[0.25] dark:bg-white/[0.15] text-foreground font-medium",
          "border border-white/30 dark:border-white/20 rounded-[20px]",
          "shadow-[0_4px_12px_rgba(0,0,0,0.15)]",
          "transition-all duration-400 ease-[cubic-bezier(0.175,0.885,0.32,2.2)]",
          "hover:scale-105 hover:bg-white/[0.35] dark:hover:bg-white/[0.25] hover:shadow-[0_6px_16px_rgba(255,255,255,0.1)]",
          "active:scale-95 active:duration-150",
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);
GlassButton.displayName = "GlassButton";