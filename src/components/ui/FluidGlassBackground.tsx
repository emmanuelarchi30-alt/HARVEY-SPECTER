"use client";

import React from "react";

export function FluidGlassBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
      {/* Dynamic Ambient Background Mesh */}
      <div className="absolute inset-0 bg-[#030712] opacity-95" />

      {/* Morphing Liquid Blob 1 (Amber / Gold Legal Light) */}
      <div 
        className="absolute -top-[10%] -left-[10%] w-[500px] h-[500px] sm:w-[700px] sm:h-[700px] rounded-full bg-gradient-to-br from-amber-500/15 via-amber-600/10 to-transparent blur-3xl animate-liquid-morph"
      />

      {/* Morphing Liquid Blob 2 (Emerald / Constitution Light) */}
      <div 
        className="absolute top-[35%] -right-[15%] w-[450px] h-[450px] sm:w-[650px] sm:h-[650px] rounded-full bg-gradient-to-bl from-emerald-500/15 via-teal-600/10 to-transparent blur-3xl animate-liquid-morph-secondary"
      />

      {/* Morphing Liquid Blob 3 (Deep Indigo / Sovereign Law Light) */}
      <div 
        className="absolute -bottom-[15%] left-[25%] w-[500px] h-[500px] sm:w-[750px] sm:h-[750px] rounded-full bg-gradient-to-t from-indigo-900/20 via-blue-900/10 to-transparent blur-3xl animate-liquid-morph"
      />

      {/* Subtle Micro-Noise / Ambient Grid */}
      <div 
        className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.03)_1px,transparent_1px)] [background-size:24px_24px] opacity-40"
      />
    </div>
  );
}
