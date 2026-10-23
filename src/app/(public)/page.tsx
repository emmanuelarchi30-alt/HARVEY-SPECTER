"use client";

import Link from "next/link";
import {
  Scale,
  Search,
  Building2,
  Sparkles,
  ShieldCheck,
  BookOpen,
  Award,
  Users,
  ArrowRight,
  Zap,
  CreditCard,
  CheckCircle2
} from "lucide-react";
import { FluidGlassBackground } from "@/components/ui/FluidGlassBackground";
import { FluidGlassLens } from "@/components/ui/FluidGlassLens";
import { HeaderControls } from "@/components/ui/HeaderControls";
import { useLanguage } from "@/context/LanguageContext";
import { useTheme } from "@/context/ThemeContext";

export default function HomePage() {
  const { t } = useLanguage();
  const { theme } = useTheme();
  const isLight = theme === "light";

  return (
    <div className="min-h-screen flex flex-col font-sans relative">
      <FluidGlassBackground />

      {/* Navbar público con Fluid Glass */}
      <header className="border-b border-white/[0.08] fluid-glass sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-500/20 to-amber-600/10 border border-amber-500/40 text-amber-500 flex items-center justify-center shadow-lg shadow-amber-950/20">
              <Scale className="w-5 h-5 text-amber-500" />
            </div>
            <div>
              <span className={`font-serif font-bold text-lg tracking-tight block leading-tight ${isLight ? "text-slate-900" : "text-white"}`}>
                Specter & Asociados
              </span>
              <span className="text-[10px] text-amber-500 font-semibold tracking-wider uppercase block">
                Litigio de Élite • Colombia
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-2.5">
            {/* Controles de Modo Claro/Oscuro y Traductor */}
            <HeaderControls />

            <Link
              href="/consultar-caso"
              className="hidden sm:flex text-xs font-medium px-3 py-1.5 rounded-xl fluid-glass-pill transition items-center space-x-1.5"
            >
              <Search className="w-3.5 h-3.5 text-amber-500" />
              <span>{t.nav_consult}</span>
            </Link>

            <Link
              href="/aranceles"
              className="hidden md:flex text-xs font-medium px-3 py-1.5 rounded-xl border border-white/10 fluid-glass-pill transition items-center space-x-1.5"
            >
              <Zap className="w-3.5 h-3.5 text-amber-500" />
              <span>{t.nav_pricing}</span>
            </Link>

            <Link
              href="/constitucion"
              target="_blank"
              className="hidden lg:flex text-xs font-medium px-3 py-1.5 rounded-xl border border-amber-500/30 bg-amber-500/10 text-amber-500 transition items-center space-x-1.5"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>{t.nav_constitution}</span>
            </Link>

            <Link
              href="/login"
              className="text-xs font-medium px-3 py-1.5 rounded-xl transition hover:opacity-80"
            >
              {t.nav_lawyer_access}
            </Link>

            <Link
              href="/register"
              className="text-xs font-semibold px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white transition shadow-md shadow-amber-950/30"
            >
              {t.nav_register_firm}
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col justify-center items-center px-4 py-16 sm:py-24 text-center max-w-5xl mx-auto space-y-10">
        <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full fluid-glass-pill text-amber-600 dark:text-amber-400 text-xs font-semibold uppercase tracking-wider animate-float-subtle">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          <span>{t.hero_tag}</span>
        </div>

        <div className="space-y-6 max-w-3xl mx-auto">
          <h1 className={`text-4xl sm:text-6xl font-serif font-bold tracking-tight leading-tight ${isLight ? "text-slate-900" : "text-white"}`}>
            {t.hero_title_1}{" "}
            <span className="bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600 bg-clip-text text-transparent">
              {t.hero_title_highlight}
            </span>
          </h1>

          <p className={`text-base sm:text-lg leading-relaxed ${isLight ? "text-slate-600" : "text-slate-300"}`}>
            {t.hero_desc}
          </p>
        </div>

        {/* Botones de Acción */}
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto justify-center">
          <Link
            href="/registro-cliente"
            className="px-7 py-3.5 rounded-2xl bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white font-semibold text-sm transition shadow-xl shadow-amber-950/40 flex items-center justify-center space-x-2.5"
          >
            <Scale className="w-4 h-4" />
            <span>{t.btn_file_case}</span>
          </Link>
          <Link
            href="/consultar-caso"
            className="px-7 py-3.5 rounded-2xl fluid-glass border border-white/20 hover:border-amber-500/50 text-amber-600 dark:text-amber-300 font-semibold text-sm transition flex items-center justify-center space-x-2.5 shadow-lg"
          >
            <Search className="w-4 h-4 text-amber-500" />
            <span>{t.btn_track_case}</span>
          </Link>
          <Link
            href="/aranceles"
            className="px-6 py-3.5 rounded-2xl fluid-glass border border-white/20 hover:border-amber-500/50 font-semibold text-sm transition flex items-center justify-center space-x-2 shadow-lg"
          >
            <Zap className="w-4 h-4 text-amber-500" />
            <span>{t.nav_pricing}</span>
          </Link>
        </div>

        {/* Lente Refractiva React Bits Pure Fluid Glass */}
        <div className="w-full max-w-4xl text-left pt-6">
          <FluidGlassLens
            badge="React Bits • Interactive Fluid Glass"
            label="Refracción Dinámica & Triage Automático"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
              <div className="space-y-3">
                <h3 className={`text-2xl font-serif font-bold ${isLight ? "text-slate-900" : "text-white"}`}>
                  Garantía Procesal con Asignación por Jerarquía
                </h3>
                <p className={`text-xs sm:text-sm leading-relaxed ${isLight ? "text-slate-600" : "text-slate-300"}`}>
                  El cristal líquido refracta la información en tiempo real. Cuando un ciudadano es acreditado como víctima del conflicto armado o sujeto en debilidad manifiesta (Art. 13 C.P.), la plataforma activa una alerta constitucional prioritaria y delega el caso de forma obligatoria a un <strong>Abogado Mayor (Socio Titular)</strong>.
                </p>
                <div className="flex items-center space-x-3 pt-1">
                  <span className="inline-flex items-center space-x-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-semibold">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Ley 1448 de 2011 Integrada</span>
                  </span>
                  <span className="inline-flex items-center space-x-1.5 text-xs text-amber-600 dark:text-amber-400 font-semibold">
                    <Zap className="w-4 h-4" />
                    <span>Fast Track en 12h</span>
                  </span>
                </div>
              </div>

              <div className={`p-5 rounded-2xl border space-y-2.5 ${isLight ? "bg-amber-50/70 border-amber-200" : "bg-slate-950/70 border-amber-500/30"}`}>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                    Regla de Celeridad Procesal
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-600 dark:text-amber-300 font-bold">
                    Fast Track
                  </span>
                </div>
                <p className={`text-xs leading-relaxed ${isLight ? "text-slate-700" : "text-slate-300"}`}>
                  <strong>Un pago grande representa un tiempo de estudio más corto:</strong> Nuestra modalidad Fast Track garantiza respuesta en menos de 12 horas con solicitud de medida cautelar previa ante juez constitucional.
                </p>
                <Link
                  href="/aranceles"
                  className="inline-flex items-center space-x-1 text-xs text-amber-600 dark:text-amber-400 font-bold hover:underline pt-1"
                >
                  <span>Ver tabla comparativa de aranceles</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </FluidGlassLens>
        </div>

        {/* Tarjetas de Pilares Jurídicos */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left w-full pt-4">
          <div className="fluid-glass rounded-3xl p-6 sm:p-8 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/15 border border-amber-500/30 text-amber-500 flex items-center justify-center shadow-lg">
              <Sparkles className="w-6 h-6 text-amber-500" />
            </div>
            <h2 className={`font-serif font-bold text-lg ${isLight ? "text-slate-900" : "text-white"}`}>
              Triaje IA & Ley de Víctimas
            </h2>
            <p className={`text-xs sm:text-sm leading-relaxed ${isLight ? "text-slate-600" : "text-slate-300"}`}>
              Clasificación instantánea bajo el Artículo 13 de la Constitución. Víctimas del conflicto armado reciben prelación máxima y asignación inmediata a un <strong>Abogado Mayor</strong>.
            </p>
          </div>

          <div className="fluid-glass rounded-3xl p-6 sm:p-8 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-500 flex items-center justify-center shadow-lg">
              <ShieldCheck className="w-6 h-6 text-emerald-500" />
            </div>
            <h2 className={`font-serif font-bold text-lg ${isLight ? "text-slate-900" : "text-white"}`}>
              Bóveda con Reserva Profesional
            </h2>
            <p className={`text-xs sm:text-sm leading-relaxed ${isLight ? "text-slate-600" : "text-slate-300"}`}>
              Aislamiento estricto de expedientes. Cada firma opera en su propio compartimento de datos protegido, garantizando el secreto profesional y la confidencialidad de las pruebas.
            </p>
          </div>

          <div className="fluid-glass rounded-3xl p-6 sm:p-8 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-500/15 border border-blue-500/30 text-blue-500 flex items-center justify-center shadow-lg">
              <BookOpen className="w-6 h-6 text-blue-500" />
            </div>
            <h2 className={`font-serif font-bold text-lg ${isLight ? "text-slate-900" : "text-white"}`}>
              Constitución de 1991 Integrada
            </h2>
            <p className={`text-xs sm:text-sm leading-relaxed ${isLight ? "text-slate-600" : "text-slate-300"}`}>
              Consulta en tiempo real del bloque de constitucionalidad (Arts. 11, 13, 29, 86, 93) para la fundamentación jurídica de acciones de tutela y derechos de petición.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/[0.08] fluid-glass py-6 text-center text-xs text-slate-500">
        Specter & Asociados • Plataforma Jurídica Multitenant • República de Colombia
      </footer>
    </div>
  );
}
