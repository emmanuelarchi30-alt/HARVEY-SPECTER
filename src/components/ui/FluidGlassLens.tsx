"use client";

import React, { useEffect, useRef, useState } from "react";
import { Sparkles, Eye, ShieldCheck } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";

interface FluidGlassLensProps {
  className?: string;
  label?: string;
  badge?: string;
  children?: React.ReactNode;
}

/**
 * FluidGlassLens - Componente de Cristal Líquido Puro inspirado en React Bits (reactbits.dev).
 * Proporciona refracción óptica, curvatura especular, dispersión cromática y seguimiento
 * fluido del cursor con física de amortiguación (lerp).
 */
export function FluidGlassLens({
  className = "",
  label = "Bóveda de Cristal Líquido Procesal",
  badge = "React Bits • Fluid Glass",
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
      className={`relative rounded-3xl p-6 sm:p-8 transition-all duration-500 overflow-hidden ${
        isLight
          ? "bg-white/70 border border-white/80 shadow-[0_20px_50px_rgba(0,0,0,0.06)] backdrop-blur-2xl text-slate-800"
          : "bg-slate-900/60 border border-white/10 shadow-[0_25px_60px_rgba(0,0,0,0.5)] backdrop-blur-2xl text-slate-100"
      } ${className}`}
      style={{
        boxShadow: isHovered
          ? isLight
            ? "0 25px 60px -10px rgba(245, 158, 11, 0.15), inset 0 2px 4px 0 rgba(255, 255, 255, 0.9)"
            : "0 25px 60px -10px rgba(245, 158, 11, 0.2), inset 0 1px 2px 0 rgba(255, 255, 255, 0.2)"
          : undefined,
      }}
    >
      {/* Lente Refractiva React Bits (Sigue el cursor) */}
      <div
        className="pointer-events-none absolute -inset-px transition-opacity duration-300"
        style={{
          opacity: isHovered ? 1 : 0.4,
          background: `radial-gradient(600px circle at ${mousePos.x}% ${mousePos.y}%, ${
            isLight
              ? "rgba(245, 158, 11, 0.12), rgba(16, 185, 129, 0.08), transparent 70%"
              : "rgba(245, 158, 11, 0.18), rgba(16, 185, 129, 0.12), transparent 70%"
          })`,
        }}
      />

      {/* Brillo especular y borde iridiscente */}
      <div
        className="pointer-events-none absolute inset-0 rounded-3xl transition-opacity duration-300"
        style={{
          background: `radial-gradient(280px circle at ${mousePos.x}% ${mousePos.y}%, ${
            isLight ? "rgba(255, 255, 255, 0.7)" : "rgba(255, 255, 255, 0.12)"
          }, transparent 80%)`,
        }}
      />

      {/* Cabecera del Cristal con Insignia */}
      <div className="relative z-10 flex items-center justify-between mb-4 flex-wrap gap-2">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider backdrop-blur-md border shadow-sm transition-colors duration-300"
          style={{
            background: isLight ? "rgba(245, 158, 11, 0.12)" : "rgba(245, 158, 11, 0.15)",
            borderColor: isLight ? "rgba(245, 158, 11, 0.3)" : "rgba(245, 158, 11, 0.4)",
            color: isLight ? "#b45309" : "#fbbf24",
          }}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>{badge}</span>
        </div>

        <span className="text-[11px] font-mono tracking-tight flex items-center gap-1 opacity-70">
          <Eye className="w-3.5 h-3.5 text-amber-500" />
          <span>{label}</span>
        </span>
      </div>

      {/* Contenido inyectado dentro del vidrio refractivo */}
      <div className="relative z-10">{children}</div>
    </div>
  );
}
