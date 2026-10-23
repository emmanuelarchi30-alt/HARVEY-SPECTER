"use client";

import React from "react";
import { Sun, Moon, Languages } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";
import { useLanguage } from "@/context/LanguageContext";

export function HeaderControls() {
  const { theme, toggleTheme } = useTheme();
  const { language, toggleLanguage } = useLanguage();

  const isLight = theme === "light";

  return (
    <div className="flex items-center space-x-2">
      {/* Botón de Traductor (Español / English) */}
      <button
        onClick={toggleLanguage}
        title={language === "es" ? "Switch to English" : "Cambiar a Español"}
        className="px-2.5 py-1.5 rounded-xl border transition-all duration-200 flex items-center space-x-1.5 text-xs font-semibold cursor-pointer shadow-sm"
        style={{
          background: isLight ? "rgba(255, 255, 255, 0.7)" : "rgba(255, 255, 255, 0.05)",
          borderColor: isLight ? "rgba(226, 232, 240, 0.8)" : "rgba(255, 255, 255, 0.1)",
          color: isLight ? "#0f172a" : "#f1f5f9",
        }}
      >
        <Languages className="w-3.5 h-3.5 text-amber-500" />
        <span className="uppercase font-mono text-[11px]">{language}</span>
      </button>

      {/* Botón de Modo Claro / Modo Oscuro */}
      <button
        onClick={toggleTheme}
        title={isLight ? "Activar Modo Oscuro" : "Activar Modo Claro"}
        className="p-1.5 rounded-xl border transition-all duration-200 cursor-pointer shadow-sm flex items-center justify-center"
        style={{
          background: isLight ? "rgba(255, 255, 255, 0.7)" : "rgba(255, 255, 255, 0.05)",
          borderColor: isLight ? "rgba(226, 232, 240, 0.8)" : "rgba(255, 255, 255, 0.1)",
          color: isLight ? "#b45309" : "#fbbf24",
        }}
      >
        {isLight ? (
          <Moon className="w-4 h-4 text-slate-700" />
        ) : (
          <Sun className="w-4 h-4 text-amber-400" />
        )}
      </button>
    </div>
  );
}
