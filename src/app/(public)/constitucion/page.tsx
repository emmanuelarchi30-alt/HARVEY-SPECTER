"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  ARTICULOS_CONSTITUCION,
  PREAMBULO_CONSTITUCION,
  ArticuloConstitucional,
} from "@/lib/data/constitucion";
import {
  BookOpen,
  Search,
  Scale,
  ArrowLeft,
  ShieldCheck,
  CheckCircle2,
  FileText,
  Sparkles
} from "lucide-react";
import { FluidGlassBackground } from "@/components/ui/FluidGlassBackground";

export default function ConstitucionPage() {
  const [busqueda, setBusqueda] = useState("");
  const [filtroCategoria, setFiltroCategoria] = useState<string>("todos");
  const [articuloSeleccionado, setArticuloSeleccionado] =
    useState<ArticuloConstitucional | null>(null);

  const articulosFiltrados = useMemo(() => {
    return ARTICULOS_CONSTITUCION.filter((art) => {
      const coincideCategoria =
        filtroCategoria === "todos" || art.relevanciaLegal === filtroCategoria;

      const termino = busqueda.toLowerCase().trim();
      const coincideBusqueda =
        !termino ||
        art.numero.toString() === termino ||
        art.epigrafe?.toLowerCase().includes(termino) ||
        art.contenido.toLowerCase().includes(termino) ||
        art.palabrasClave.some((p) => p.toLowerCase().includes(termino));

      return coincideCategoria && coincideBusqueda;
    });
  }, [busqueda, filtroCategoria]);

  return (
    <div className="min-h-screen text-slate-100 flex flex-col font-sans relative">
      <FluidGlassBackground />

      {/* Header Fluid Glass */}
      <header className="border-b border-white/[0.08] fluid-glass sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-500/20 to-amber-600/10 border border-amber-500/40 text-amber-400 flex items-center justify-center shadow-lg shadow-amber-950/40">
              <Scale className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <span className="font-serif font-bold text-lg text-white tracking-tight block leading-tight">
                Constitución Política de 1991
              </span>
              <span className="text-[10px] text-amber-400 font-semibold tracking-wider uppercase block">
                República de Colombia • Visor Oficial
              </span>
            </div>
          </Link>

          <div className="flex items-center space-x-3">
            <Link
              href="/consultar-caso"
              className="text-xs font-medium px-3 py-1.5 rounded-xl border border-white/10 fluid-glass-pill text-amber-300 hover:text-white transition flex items-center space-x-1"
            >
              <Search className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">Consultar mi Radicado</span>
            </Link>
            <Link
              href="/registro-cliente"
              className="text-xs font-semibold px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white transition flex items-center space-x-1.5 shadow-md shadow-amber-950/40"
            >
              <Scale className="w-3.5 h-3.5" />
              <span>Radicar Caso (IA)</span>
            </Link>
            <Link
              href="/"
              className="text-xs text-slate-400 hover:text-white transition flex items-center space-x-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Inicio</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        {/* Banner Hero */}
        <div className="fluid-glass rounded-3xl p-8 sm:p-10 space-y-4">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full fluid-glass-pill text-amber-400 text-xs font-semibold uppercase tracking-wider">
            <BookOpen className="w-3.5 h-3.5 text-amber-400" />
            <span>Norma de Normas • Artículo 4 C.P.</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-serif font-bold text-white tracking-tight leading-tight">
            Constitución Política de Colombia (1991)
          </h1>

          <p className="text-slate-300 text-sm sm:text-base max-w-3xl leading-relaxed">
            Visor interactivo con articulado fundamental, bloque de constitucionalidad, precedentes vinculantes de la Corte Constitucional y fundamentos de especial protección a víctimas del conflicto armado (Ley 1448 de 2011 y Sentencia T-025 de 2004).
          </p>

          <div className="pt-2 text-xs text-slate-400 border-t border-white/[0.08] italic">
            &ldquo;{PREAMBULO_CONSTITUCION}&rdquo;
          </div>
        </div>

        {/* Buscador y Filtros Fluid Glass */}
        <div className="fluid-glass rounded-2xl p-6 space-y-4 shadow-xl">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
              <input
                type="text"
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                placeholder="Buscar por artículo (ej. 86), término (ej. tutela, vida, debido proceso)..."
                className="w-full pl-10 pr-4 py-2.5 bg-slate-950/70 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 text-sm"
              />
            </div>

            <div className="flex gap-2 flex-wrap">
              <button
                onClick={() => setFiltroCategoria("todos")}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
                  filtroCategoria === "todos"
                    ? "bg-amber-500 text-slate-950 shadow-md"
                    : "bg-white/[0.04] text-slate-300 hover:text-white border border-white/10"
                }`}
              >
                Todos ({ARTICULOS_CONSTITUCION.length})
              </button>
              <button
                onClick={() => setFiltroCategoria("fundamental")}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
                  filtroCategoria === "fundamental"
                    ? "bg-amber-500 text-slate-950 shadow-md"
                    : "bg-white/[0.04] text-slate-300 hover:text-white border border-white/10"
                }`}
              >
                Derechos Fundamentales
              </button>
              <button
                onClick={() => setFiltroCategoria("proteccion")}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
                  filtroCategoria === "proteccion"
                    ? "bg-amber-500 text-slate-950 shadow-md"
                    : "bg-white/[0.04] text-slate-300 hover:text-white border border-white/10"
                }`}
              >
                Especial Protección & Víctimas
              </button>
              <button
                onClick={() => setFiltroCategoria("institucional")}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
                  filtroCategoria === "institucional"
                    ? "bg-amber-500 text-slate-950 shadow-md"
                    : "bg-white/[0.04] text-slate-300 hover:text-white border border-white/10"
                }`}
              >
                Mecanismos & Debido Proceso
              </button>
            </div>
          </div>
        </div>

        {/* Cuadrícula de Artículos Fluid Glass */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {articulosFiltrados.map((art) => (
            <div
              key={art.numero}
              onClick={() => setArticuloSeleccionado(art)}
              className="fluid-glass rounded-2xl p-6 space-y-3 cursor-pointer group hover:border-amber-500/40"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono font-bold text-amber-400 text-sm group-hover:text-amber-300">
                  Artículo {art.numero}
                </span>
                <span className="text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded-full bg-white/[0.05] border border-white/10 text-slate-400">
                  {art.relevanciaLegal.replace("_", " ")}
                </span>
              </div>

              {art.epigrafe && (
                <h3 className="font-serif font-bold text-white text-base">
                  {art.epigrafe}
                </h3>
              )}

              <p className="text-xs text-slate-300 line-clamp-3 leading-relaxed">
                {art.contenido}
              </p>

              {art.palabrasClave && art.palabrasClave.length > 0 && (
                <div className="pt-2 text-[11px] text-amber-400/80 font-mono truncate">
                  Descriptores: {art.palabrasClave.join(" • ")}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Modal de Detalle de Artículo Fluid Glass */}
        {articuloSeleccionado && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <div className="fluid-glass rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-5 border-amber-500/50 shadow-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
                <div>
                  <span className="font-mono font-bold text-amber-400 text-lg">
                    Artículo {articuloSeleccionado.numero} de la Constitución
                  </span>
                  {articuloSeleccionado.epigrafe && (
                    <h2 className="text-xl font-serif font-bold text-white mt-1">
                      {articuloSeleccionado.epigrafe}
                    </h2>
                  )}
                </div>
                <button
                  onClick={() => setArticuloSeleccionado(null)}
                  className="w-8 h-8 rounded-full bg-white/[0.05] border border-white/10 text-slate-400 hover:text-white flex items-center justify-center text-sm cursor-pointer"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-4 text-sm text-slate-200 leading-relaxed font-sans bg-slate-950/60 p-5 rounded-2xl border border-white/[0.06]">
                <p>{articuloSeleccionado.contenido}</p>
              </div>

              {articuloSeleccionado.palabrasClave && (
                <div className="p-4 rounded-xl bg-slate-950/40 border border-white/[0.06] text-xs space-y-1">
                  <strong className="text-amber-400 block font-semibold">
                    Descriptores Jurídicos & Temas Relacionados:
                  </strong>
                  <p className="text-slate-300">
                    {articuloSeleccionado.palabrasClave.join(" • ")}
                  </p>
                </div>
              )}

              <div className="flex justify-end pt-2">
                <button
                  onClick={() => setArticuloSeleccionado(null)}
                  className="px-5 py-2.5 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white rounded-xl text-xs font-semibold transition cursor-pointer shadow-lg"
                >
                  Cerrar Artículo
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      <footer className="border-t border-white/[0.08] fluid-glass py-6 text-center text-xs text-slate-500">
        Constitución Política de Colombia (1991) • Sistema Jurídico Specter & Asociados
      </footer>
    </div>
  );
}
