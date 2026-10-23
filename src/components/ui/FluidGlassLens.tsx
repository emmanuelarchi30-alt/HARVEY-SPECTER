"use client";

import React, { useRef, useState } from "react";
import { Sparkles, Eye } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";

interface FluidGlassLensProps {
  className?: string;
  label?: string;
  badge?: string;
  children?: React.ReactNode;
}

/**
 * FluidGlassLens - Componente de Cristal Líquido de Apple iOS 18 / VisionOS
 * Proporciona refracción óptica, curvatura especular, dispersión cromática y seguimiento
 * fluido del cursor con física de refracción sobre el material translúcido.
 */
export function FluidGlassLens({
  className = "",
  label = "Bóveda de Cristal Líquido Procesal",
  badge = "Apple iOS 18 • Liquid Glass",
  children,
}: FluidGlassLensProps) {
  const { theme } = useTheme();
  const cardRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });
  const [isHovered, setIsHovered] = useState(false);

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setMousePos({ x, y });
  }

  const isLight = theme === "light";

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setMousePos({ x: 50, y: 50 });
      }}
      className={`relative rounded-[32px] p-6 sm:p-9 transition-all duration-500 overflow-hidden ${
        isLight
          ? "bg-white/65 border border-white/90 shadow-[0_20px_50px_rgba(0,0,0,0.06),inset_0_1.5px_1.5px_rgba(255,255,255,0.95)] backdrop-blur-[32px] text-slate-900"
          : "bg-slate-900/65 border border-white/14 shadow-[0_25px_60px_rgba(0,0,0,0.5),inset_0_1px_1px_rgba(255,255,255,0.2)] backdrop-blur-[32px] text-slate-100"
      } ${className}`}
      style={{
        boxShadow: isHovered
          ? isLight
            ? "0 25px 60px -10px rgba(217, 119, 6, 0.15), inset 0 2px 4px 0 rgba(255, 255, 255, 1)"
            : "0 25px 60px -10px rgba(245, 158, 11, 0.25), inset 0 1px 2px 0 rgba(255, 255, 255, 0.25)"
          : undefined,
      }}
    >
      {/* Reflejo especular superior continuo estilo iPhone */}
      <div 
        className="pointer-events-none absolute top-0 left-0 right-0 h-[1.5px] z-10"
        style={{
          background: isLight
            ? "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.9) 30%, rgba(255,255,255,1) 50%, rgba(255,255,255,0.9) 70%, transparent 100%)"
            : "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.3) 30%, rgba(255,255,255,0.6) 50%, rgba(255,255,255,0.3) 70%, transparent 100%)",
        }}
      />

      {/* Lente Refractiva React Bits (Sigue el cursor) */}
      <div
        className="pointer-events-none absolute -inset-px transition-opacity duration-300"
        style={{
          opacity: isHovered ? 1 : 0.45,
          background: `radial-gradient(650px circle at ${mousePos.x}% ${mousePos.y}%, ${
            isLight
              ? "rgba(217, 119, 6, 0.12), rgba(14, 165, 233, 0.08), transparent 70%"
              : "rgba(245, 158, 11, 0.18), rgba(16, 185, 129, 0.12), transparent 70%"
          })`,
        }}
      />

      {/* Brillo especular y borde iridiscente */}
      <div
        className="pointer-events-none absolute inset-0 rounded-[32px] transition-opacity duration-300"
        style={{
          background: `radial-gradient(300px circle at ${mousePos.x}% ${mousePos.y}%, ${
            isLight ? "rgba(255, 255, 255, 0.8)" : "rgba(255, 255, 255, 0.14)"
          }, transparent 80%)`,
        }}
      />

      {/* Cabecera del Cristal con Insignia Apple */}
      <div className="relative z-10 flex items-center justify-between mb-5 flex-wrap gap-2">
        <div 
          className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider backdrop-blur-md border shadow-sm transition-all duration-300"
          style={{
            background: isLight ? "rgba(245, 158, 11, 0.12)" : "rgba(245, 158, 11, 0.18)",
            borderColor: isLight ? "rgba(245, 158, 11, 0.35)" : "rgba(245, 158, 11, 0.4)",
            color: isLight ? "#b45309" : "#fbbf24",
          }}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>{badge}</span>
        </div>

        <span className="text-[11px] font-mono tracking-tight flex items-center gap-1.5 opacity-75 font-semibold">
          <Eye className="w-3.5 h-3.5 text-amber-500" />
          <span>{label}</span>
        </span>
      </div>

      {/* Contenido en relieve vítreo */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}
