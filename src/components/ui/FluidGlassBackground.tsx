"use client";

import React from "react";
import { useTheme } from "@/context/ThemeContext";

export function FluidGlassBackground() {
  const { theme } = useTheme();
  const isLight = theme === "light";

  return (
    <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden transition-colors duration-700">
      {/* Dynamic Ambient Background Canvas */}
      <div 
        className={`absolute inset-0 transition-colors duration-700 ${
          isLight 
            ? "bg-[#f8fafc]" 
            : "bg-[#030712]"
        }`} 
      />

      {/* Morphing Liquid Blob 1 (Soft Crystal Ice Sky) */}
      <div 
        className={`absolute -top-[10%] -left-[10%] w-[550px] h-[550px] sm:w-[800px] sm:h-[800px] rounded-full blur-3xl animate-liquid-morph transition-all duration-700 ${
          isLight
            ? "bg-gradient-to-br from-sky-200/40 via-sky-100/25 to-transparent"
            : "bg-gradient-to-br from-amber-600/10 via-amber-700/5 to-transparent"
        }`}
      />

      {/* Morphing Liquid Blob 2 (Soft Champagne Gold Refraction) */}
      <div 
        className={`absolute top-[30%] -right-[15%] w-[500px] h-[500px] sm:w-[750px] sm:h-[750px] rounded-full blur-3xl animate-liquid-morph-secondary transition-all duration-700 ${
          isLight
            ? "bg-gradient-to-bl from-amber-200/35 via-orange-100/20 to-transparent"
            : "bg-gradient-to-bl from-emerald-600/10 via-teal-900/10 to-transparent"
        }`}
      />

      {/* Morphing Liquid Blob 3 (Ethereal Lilac / Iris Glow) */}
      <div 
        className={`absolute -bottom-[15%] left-[25%] w-[500px] h-[500px] sm:w-[850px] sm:h-[850px] rounded-full blur-3xl animate-liquid-morph transition-all duration-700 ${
          isLight
            ? "bg-gradient-to-t from-indigo-100/30 via-slate-100/20 to-transparent"
            : "bg-gradient-to-t from-indigo-950/20 via-blue-950/15 to-transparent"
        }`}
      />

      {/* Subtle Micro-Dot Technical Grid */}
      <div 
        className={`absolute inset-0 [background-size:24px_24px] transition-opacity duration-700 ${
          isLight
            ? "bg-[radial-gradient(rgba(100,116,139,0.12)_1px,transparent_1px)] opacity-70"
            : "bg-[radial-gradient(rgba(255,255,255,0.04)_1px,transparent_1px)] opacity-40"
        }`}
      />
    </div>
  );
}
