"use client";

import React from "react";
import { useTheme } from "@/context/ThemeContext";

export function FluidGlassBackground() {
  const { theme } = useTheme();
  const isLight = theme === "light";

  return (
    <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden transition-colors duration-700">
      {/* Dynamic Ambient Background Mesh */}
      <div 
        className={`absolute inset-0 transition-colors duration-700 ${
          isLight 
            ? "bg-gradient-to-br from-slate-50 via-amber-50/40 to-slate-100 opacity-100" 
            : "bg-[#030712] opacity-95"
        }`} 
      />

      {/* Morphing Liquid Blob 1 (Amber / Gold Legal Light) */}
      <div 
        className={`absolute -top-[10%] -left-[10%] w-[500px] h-[500px] sm:w-[750px] sm:h-[750px] rounded-full blur-3xl animate-liquid-morph transition-all duration-700 ${
          isLight
            ? "bg-gradient-to-br from-amber-400/25 via-amber-300/20 to-transparent"
            : "bg-gradient-to-br from-amber-500/15 via-amber-600/10 to-transparent"
        }`}
      />

      {/* Morphing Liquid Blob 2 (Emerald / Constitution Light) */}
      <div 
        className={`absolute top-[35%] -right-[15%] w-[450px] h-[450px] sm:w-[700px] sm:h-[700px] rounded-full blur-3xl animate-liquid-morph-secondary transition-all duration-700 ${
          isLight
            ? "bg-gradient-to-bl from-emerald-400/25 via-teal-300/20 to-transparent"
            : "bg-gradient-to-bl from-emerald-500/15 via-teal-600/10 to-transparent"
        }`}
      />

      {/* Morphing Liquid Blob 3 (Deep Sapphire / Sky Light) */}
      <div 
        className={`absolute -bottom-[15%] left-[25%] w-[500px] h-[500px] sm:w-[800px] sm:h-[800px] rounded-full blur-3xl animate-liquid-morph transition-all duration-700 ${
          isLight
            ? "bg-gradient-to-t from-sky-300/20 via-indigo-200/20 to-transparent"
            : "bg-gradient-to-t from-indigo-900/20 via-blue-900/10 to-transparent"
        }`}
      />

      {/* Subtle Micro-Noise / Ambient Grid */}
      <div 
        className={`absolute inset-0 [background-size:24px_24px] transition-opacity duration-700 ${
          isLight
            ? "bg-[radial-gradient(rgba(15,23,42,0.06)_1px,transparent_1px)] opacity-60"
            : "bg-[radial-gradient(rgba(255,255,255,0.03)_1px,transparent_1px)] opacity-40"
        }`}
      />
    </div>
  );
}
