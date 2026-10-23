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
  CheckCircle2
} from "lucide-react";
import { FluidGlassBackground } from "@/components/ui/FluidGlassBackground";

export default function HomePage() {
  return (
    <div className="min-h-screen text-slate-100 flex flex-col font-sans relative">
      <FluidGlassBackground />

      {/* Navbar público con Fluid Glass */}
      <header className="border-b border-white/[0.08] fluid-glass sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-500/20 to-amber-600/10 border border-amber-500/40 text-amber-400 flex items-center justify-center shadow-lg shadow-amber-950/40">
              <Scale className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <span className="font-serif font-bold text-lg text-white tracking-tight block leading-tight">
                Specter & Asociados
              </span>
              <span className="text-[10px] text-amber-400 font-semibold tracking-wider uppercase block">
                Litigio de Élite • Colombia
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <Link
              href="/consultar-caso"
              className="text-xs font-medium px-3.5 py-2 rounded-xl fluid-glass-pill text-amber-300 hover:text-white transition flex items-center space-x-1.5"
            >
              <Search className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">Consultar mi Caso</span>
            </Link>
            <Link
              href="/constitucion"
              target="_blank"
              className="text-xs font-medium px-3.5 py-2 rounded-xl border border-amber-500/30 bg-amber-500/10 text-amber-400 hover:bg-amber-500/20 transition flex items-center space-x-1.5"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Constitución 1991</span>
            </Link>
            <Link
              href="/login"
              className="text-xs font-medium px-4 py-2 rounded-xl text-slate-300 hover:text-white transition"
            >
              Acceso Abogados
            </Link>
            <Link
              href="/register"
              className="text-xs font-semibold px-4 py-2 rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white transition shadow-lg shadow-amber-950/40"
            >
              Registrar Despacho
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section Fluid Glass */}
      <main className="flex-1 flex flex-col justify-center items-center px-4 py-16 sm:py-24 text-center max-w-5xl mx-auto space-y-10">
        <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full fluid-glass-pill text-amber-400 text-xs font-semibold uppercase tracking-wider animate-float-subtle">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>Plataforma SaaS Multitenant de Gestión Jurídica & Tutelas</span>
        </div>

        <div className="space-y-6 max-w-3xl mx-auto">
          <h1 className="text-4xl sm:text-6xl font-serif font-bold tracking-tight text-white leading-tight">
            Litigio Estratégico de Élite con{" "}
            <span className="bg-gradient-to-r from-amber-400 via-amber-200 to-amber-500 bg-clip-text text-transparent">
              Inteligencia Constitucional
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-300 leading-relaxed">
            Inspirada en el rigor procesal de las firmas más prestigiosas y adaptada íntegramente al ordenamiento constitucional colombiano. Asignación inteligente por IA: víctimas del conflicto armado y urgencias vitales son derivadas directamente a Abogados Mayores y Socios Directores.
          </p>
        </div>

        {/* Botones de Acción */}
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto justify-center">
          <Link
            href="/registro-cliente"
            className="px-7 py-3.5 rounded-2xl bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white font-semibold text-sm transition shadow-xl shadow-amber-950/50 flex items-center justify-center space-x-2.5"
          >
            <Scale className="w-4 h-4" />
            <span>Radicar Caso / Clientes (IA)</span>
          </Link>
          <Link
            href="/consultar-caso"
            className="px-7 py-3.5 rounded-2xl fluid-glass border border-white/10 hover:border-amber-500/40 text-amber-300 hover:text-white font-semibold text-sm transition flex items-center justify-center space-x-2.5 shadow-lg"
          >
            <Search className="w-4 h-4 text-amber-400" />
            <span>Consultar Estado de mi Radicado</span>
          </Link>
          <Link
            href="/constitucion"
            target="_blank"
            className="px-6 py-3.5 rounded-2xl bg-slate-900/60 hover:bg-slate-800 border border-white/10 text-slate-300 hover:text-white font-semibold text-sm transition flex items-center justify-center space-x-2"
          >
            <BookOpen className="w-4 h-4 text-amber-400" />
            <span>Constitución Política (1991)</span>
          </Link>
        </div>

        {/* Tarjetas de Pilares Jurídicos Fluid Glass */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left w-full pt-8">
          <div className="fluid-glass rounded-3xl p-6 sm:p-8 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/15 border border-amber-500/30 text-amber-400 flex items-center justify-center shadow-lg">
              <Sparkles className="w-6 h-6 text-amber-400" />
            </div>
            <h2 className="font-serif font-bold text-white text-lg">
              Triaje Inteligente & Ley de Víctimas
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              El motor de IA clasifica solicitudes al instante. Víctimas del conflicto (Ley 1448) y desplazados reciben prelación constitucional y asignación inmediata a un <strong>Abogado Mayor (Socio)</strong>.
            </p>
          </div>

          <div className="fluid-glass rounded-3xl p-6 sm:p-8 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center justify-center shadow-lg">
              <ShieldCheck className="w-6 h-6 text-emerald-400" />
            </div>
            <h2 className="font-serif font-bold text-white text-lg">
              Bóveda con Reserva Profesional
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Aislamiento estricto de expedientes. Cada firma opera en su propio compartimento de datos protegido, garantizando el secreto profesional y la confidencialidad de las pruebas.
            </p>
          </div>

          <div className="fluid-glass rounded-3xl p-6 sm:p-8 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-500/15 border border-blue-500/30 text-blue-400 flex items-center justify-center shadow-lg">
              <BookOpen className="w-6 h-6 text-blue-400" />
            </div>
            <h2 className="font-serif font-bold text-white text-lg">
              Constitución de 1991 Integrada
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
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
