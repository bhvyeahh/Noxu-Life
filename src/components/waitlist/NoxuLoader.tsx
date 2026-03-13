"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";

export function NoxuLoader({ onComplete }: { onComplete: () => void }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const xRef = useRef<HTMLSpanElement>(null);
  
  const nRef = useRef<HTMLSpanElement>(null);
  const oRef = useRef<HTMLSpanElement>(null);
  const uRef = useRef<HTMLSpanElement>(null);
  const dotRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    document.body.style.overflow = "hidden";

    let ctx = gsap.context(() => {
      const tl = gsap.timeline({
        onComplete: () => {
          document.body.style.overflow = "auto";
          onComplete();
        },
      });

      tl.fromTo(
        textRef.current,
        { opacity: 0, scale: 0.8, filter: "blur(10px)" },
        { opacity: 1, scale: 1, filter: "blur(0px)", duration: 1, ease: "expo.out" }
      )
      .to(xRef.current, { 
        textShadow: "0px 0px 40px rgba(207,92,54,0.8)", 
        duration: 0.5, 
        yoyo: true, 
        repeat: 1 
      }, "+=0.2")
      .to([nRef.current, oRef.current], { x: -50, opacity: 0, duration: 0.8, ease: "power3.inOut" }, "split")
      .to([uRef.current, dotRef.current], { x: 50, opacity: 0, duration: 0.8, ease: "power3.inOut" }, "split")
      .to(xRef.current, { 
        scale: 150, 
        opacity: 0, 
        duration: 1.2, 
        ease: "power4.inOut" 
      }, "split+=0.2")
      .to(containerRef.current, { 
        opacity: 0, 
        duration: 0.6, 
        ease: "power2.out" 
      }, "-=0.6");
    }, containerRef);

    return () => {
      ctx.revert();
      document.body.style.overflow = "auto";
    };
  }, [onComplete]);

  return (
    <div ref={containerRef} className="fixed inset-0 z-[999] flex items-center justify-center bg-[#030303]">
      <div ref={textRef} className="text-5xl sm:text-7xl font-black tracking-tighter text-white flex items-center select-none">
        <span ref={nRef} className="inline-block">N</span>
        <span ref={oRef} className="inline-block">O</span>
        <span ref={xRef} className="relative z-10 text-transparent bg-clip-text bg-gradient-to-br from-[#CF5C36] via-[#E36940] to-[#EFC88B] mx-[2px] inline-block origin-center transform-gpu will-change-transform">
          X
          <span className="absolute inset-0 bg-[#CF5C36] blur-[10px] opacity-50 mix-blend-screen -z-10"></span>
        </span>
        <span ref={uRef} className="inline-block">U</span>
        <span ref={dotRef} className="text-[#CF5C36] ml-[2px] inline-block">.</span>
      </div>
    </div>
  );
}