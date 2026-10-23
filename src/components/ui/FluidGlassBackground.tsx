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
      <div className="absolute inset-0 opacity-85 dark:opacity-95 transition-opacity duration-700 pointer-events-auto">
        <Ferrofluid
          colors={
            isLight
              ? ['#ffffff', '#d97706', '#0284c7']
              : ['#ffffff', '#f59e0b', '#38bdf8']
          }
          scale={1.6}
          spikeHeight={1.0}
          sharpness={2.5}
          tilt={48}
          fluidity={0.5}
          speed={0.5}
          magnetism={1.1}
          mouseInteraction={true}
          mouseStrength={1.3}
          mouseRadius={0.22}
          clickPulse={true}
          lightMode={isLight}
          transparent={true}
          opacity={isLight ? 0.8 : 0.95}
        />
      </div>

      {/* Apple iOS Subtle Accent Glow (Behind the fluid) */}
      <div 
        className={`absolute -top-[12%] -left-[10%] w-[550px] h-[550px] sm:w-[800px] sm:h-[800px] rounded-full blur-[140px] transition-all duration-700 pointer-events-none opacity-20 dark:opacity-25 ${
          isLight
            ? "bg-gradient-to-br from-amber-400 via-sky-300 to-transparent"
            : "bg-gradient-to-br from-amber-500 via-blue-600 to-transparent"
        }`}
      />

      <div 
        className={`absolute top-[40%] -right-[10%] w-[500px] h-[500px] sm:w-[750px] sm:h-[750px] rounded-full blur-[140px] transition-all duration-700 pointer-events-none opacity-15 dark:opacity-20 ${
          isLight
            ? "bg-gradient-to-bl from-amber-300 via-indigo-200 to-transparent"
            : "bg-gradient-to-bl from-amber-600 via-indigo-900 to-transparent"
        }`}
      />
    </div>
  );
}
