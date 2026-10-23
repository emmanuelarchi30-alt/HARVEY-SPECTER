"use client";

import React from "react";
import { useTheme } from "@/context/ThemeContext";

export function FluidGlassBackground() {
  const { theme } = useTheme();
  const isLight = theme === "light";

  return (
    <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden transition-colors duration-700">
      {/* Apple Wallpaper Ambient Canvas */}
      <div 
        className={`absolute inset-0 transition-colors duration-700 ${
          isLight 
            ? "bg-[#f5f7fb]" 
            : "bg-[#080c16]"
        }`} 
      />

      {/* Apple iOS Light Orb 1 (Electric Cobalt / Azure Sky Refraction) */}
      <div 
        className={`absolute -top-[12%] -left-[10%] w-[550px] h-[550px] sm:w-[920px] sm:h-[920px] rounded-full blur-[120px] animate-liquid-morph transition-all duration-700 ${
          isLight
            ? "bg-gradient-to-br from-blue-400/40 via-sky-300/30 to-transparent"
            : "bg-gradient-to-br from-blue-600/35 via-indigo-600/25 to-transparent"
        }`}
      />

      {/* Apple iOS Light Orb 2 (Sunset Gold / Legal Amber Core) */}
      <div 
        className={`absolute top-[26%] -right-[12%] w-[500px] h-[500px] sm:w-[880px] sm:h-[880px] rounded-full blur-[120px] animate-liquid-morph-secondary transition-all duration-700 ${
          isLight
            ? "bg-gradient-to-bl from-amber-400/40 via-orange-300/25 to-transparent"
            : "bg-gradient-to-bl from-amber-500/35 via-yellow-600/20 to-transparent"
        }`}
      />

      {/* Apple iOS Light Orb 3 (VisionOS Iris / Lavender Glow) */}
      <div 
        className={`absolute -bottom-[16%] left-[18%] w-[500px] h-[500px] sm:w-[960px] sm:h-[960px] rounded-full blur-[130px] animate-liquid-morph transition-all duration-700 ${
          isLight
            ? "bg-gradient-to-t from-violet-300/35 via-indigo-200/25 to-transparent"
            : "bg-gradient-to-t from-purple-700/30 via-indigo-900/25 to-transparent"
        }`}
      />

      {/* Apple iOS Light Orb 4 (Colombian Emerald / Mint Seal Accent) */}
      <div 
        className={`absolute top-[52%] -left-[8%] w-[400px] h-[400px] sm:w-[680px] sm:h-[680px] rounded-full blur-[115px] animate-liquid-morph-secondary transition-all duration-700 ${
          isLight
            ? "bg-gradient-to-tr from-emerald-400/25 via-teal-300/15 to-transparent"
            : "bg-gradient-to-tr from-teal-500/25 via-emerald-600/15 to-transparent"
        }`}
      />

      {/* Apple Retina Micro-Grid / Technical Optical Texture */}
      <div 
        className={`absolute inset-0 [background-size:24px_24px] transition-opacity duration-700 ${
          isLight
            ? "bg-[radial-gradient(rgba(100,116,139,0.14)_1px,transparent_1px)] opacity-60"
            : "bg-[radial-gradient(rgba(255,255,255,0.06)_1px,transparent_1px)] opacity-40"
        }`}
      />
    </div>
  );
}
