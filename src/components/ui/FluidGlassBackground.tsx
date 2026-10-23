"use client";

import React from "react";
import { useTheme } from "@/context/ThemeContext";
import Ferrofluid from "./Ferrofluid";

export function FluidGlassBackground() {
  const { theme } = useTheme();
  const isLight = theme === "light";

  return (
    <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden transition-colors duration-700">
      {/* Apple Wallpaper Ambient Base Canvas */}
      <div 
        className={`absolute inset-0 transition-colors duration-700 ${
          isLight 
            ? "bg-[#f8fafc]" 
            : "bg-[#060810]"
        }`} 
      />

      {/* React Bits Ferrofluid Magnetic Liquid Simulation Layer */}
      <div className="absolute inset-0 opacity-40 dark:opacity-60 transition-opacity duration-700 pointer-events-auto">
        <Ferrofluid
          colors={
            isLight
              ? ['#d97706', '#0284c7', '#64748b']
              : ['#f59e0b', '#38bdf8', '#ffffff']
          }
          scale={1.8}
          spikeHeight={0.9}
          sharpness={2.3}
          tilt={44}
          fluidity={0.6}
          speed={0.4}
          magnetism={0.95}
          mouseInteraction={true}
          mouseStrength={1.2}
          mouseRadius={0.24}
          clickPulse={true}
          lightMode={isLight}
          transparent={true}
          opacity={isLight ? 0.38 : 0.65}
        />
      </div>

      {/* Apple iOS Light Orbs (Soft ambient lighting refractions) */}
      <div 
        className={`absolute -top-[12%] -left-[10%] w-[550px] h-[550px] sm:w-[920px] sm:h-[920px] rounded-full blur-[130px] animate-liquid-morph transition-all duration-700 pointer-events-none ${
          isLight
            ? "bg-gradient-to-br from-amber-300/25 via-sky-200/20 to-transparent"
            : "bg-gradient-to-br from-amber-500/20 via-blue-600/15 to-transparent"
        }`}
      />

      <div 
        className={`absolute top-[32%] -right-[12%] w-[500px] h-[500px] sm:w-[880px] sm:h-[880px] rounded-full blur-[130px] animate-liquid-morph-secondary transition-all duration-700 pointer-events-none ${
          isLight
            ? "bg-gradient-to-bl from-amber-200/30 via-orange-100/20 to-transparent"
            : "bg-gradient-to-bl from-amber-600/20 via-indigo-900/15 to-transparent"
        }`}
      />

      <div 
        className={`absolute -bottom-[16%] left-[18%] w-[500px] h-[500px] sm:w-[960px] sm:h-[960px] rounded-full blur-[130px] animate-liquid-morph transition-all duration-700 pointer-events-none ${
          isLight
            ? "bg-gradient-to-t from-violet-200/25 via-indigo-100/15 to-transparent"
            : "bg-gradient-to-t from-purple-700/20 via-indigo-900/15 to-transparent"
        }`}
      />

      {/* Apple Retina Micro-Grid / Technical Optical Texture */}
      <div 
        className={`absolute inset-0 [background-size:24px_24px] pointer-events-none transition-opacity duration-700 ${
          isLight
            ? "bg-[radial-gradient(rgba(15,23,42,0.06)_1px,transparent_1px)] opacity-50"
            : "bg-[radial-gradient(rgba(255,255,255,0.05)_1px,transparent_1px)] opacity-35"
        }`}
      />
    </div>
  );
}
