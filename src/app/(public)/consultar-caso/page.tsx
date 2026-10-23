"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  Search, 
  Scale, 
  ShieldCheck, 
  Clock, 
  Building2, 
  FileText, 
  ArrowLeft,
  Sparkles,
  Award,
  AlertCircle,
  CheckCircle2,
  BookOpen
} from "lucide-react";
import { FluidGlassBackground } from "@/components/ui/FluidGlassBackground";
import { HeaderControls } from "@/components/ui/HeaderControls";
import { useTheme } from "@/context/ThemeContext";
import { useLanguage } from "@/context/LanguageContext";

interface ExpedienteEncontrado {
  despacho: { id: string; name: string };
  caso: {
    id: string;
    numeroExpediente: string;
    titulo: string;
    descripcion: string | null;
    estado: string;
    prioridad: string;
    esFuerzaMayor: boolean;
    nivelAbogadoExigido: string;
    fechaApertura: string;
  };
  cliente: {
    id: string;
    nombre: string;
    tipoDocumento: string;
    numeroDocumento: string;
    condicionEspecial: string;
    tienePrioridad: boolean;
  };
  abogadoAsignado: {
    id: string;
    nombre: string;
    email: string;
    role: string;
    experienciaAnios: number;
    categoria: string;
  };
}

export default function ConsultarCasoPage() {
  const { theme } = useTheme();
  const { t } = useLanguage();
  const isLight = theme === "light";

  const [radicado, setRadicado] = useState("");
  const [numeroDocumento, setNumeroDocumento] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [expediente, setExpediente] = useState<ExpedienteEncontrado | null>(null);

  async function handleBuscar(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setExpediente(null);

    if (!radicado.trim() || !numeroDocumento.trim()) {
      setError("Por motivos de seguridad y reserva del sumario, es OBLIGATORIO suministrar tanto el Número de Radicado como su Cédula o Documento de Identidad.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/clientes/consulta-caso", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          radicado: radicado.trim(),
          numeroDocumento: numeroDocumento.trim(),
        }),
      });

      const json = await res.json();

      if (!res.ok) {
        throw new Error(json.error || "No se encontró ningún expediente.");
      }

      setExpediente(json.data.expediente);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Error al consultar el expediente.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={`min-h-screen flex flex-col font-sans relative ${isLight ? "text-slate-800" : "text-slate-100"}`}>
      <FluidGlassBackground />

      {/* Header con estilo Fluid Glass */}
      <header className="border-b border-white/[0.08] fluid-glass sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-500/20 to-amber-600/10 border border-amber-500/40 text-amber-500 flex items-center justify-center shadow-lg shadow-amber-950/20">
              <Scale className="w-5 h-5 text-amber-500" />
            </div>
            <div>
              <span className={`font-serif font-bold text-lg tracking-tight block leading-none ${isLight ? "text-slate-900" : "text-white"}`}>
                Portal del Ciudadano
              </span>
              <span className="text-[10px] text-amber-500 font-semibold tracking-wider uppercase">
                Consulta de Expedientes & Tutelas
              </span>
            </div>
          </Link>

          <div className="flex items-center space-x-3">
            <HeaderControls />
            <Link
              href="/aranceles"
              className="text-xs font-medium px-3 py-1.5 rounded-xl border border-white/10 fluid-glass-pill transition"
            >
              <span>Aranceles & Tiempos</span>
            </Link>
            <Link
              href="/constitucion"
              target="_blank"
              className="hidden sm:flex text-xs text-amber-500 font-medium items-center space-x-1.5 px-3 py-1.5 rounded-lg border border-amber-500/30 bg-amber-500/10 transition"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Constitución 1991</span>
            </Link>
            <Link
              href="/"
              className="text-xs text-slate-400 hover:text-white transition flex items-center space-x-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Volver</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Contenido Principal */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-12 space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full fluid-glass-pill text-amber-400 text-xs font-semibold uppercase tracking-wider">
            <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
            <span>Seguimiento Judicial en Línea</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-white tracking-tight">
            Consulte el Estado de su Proceso o Petición
          </h1>
          <p className={`text-sm ${isLight ? "text-slate-600" : "text-slate-400"}`}>
            Ingrese obligatoriamente <strong>AMBOS datos</strong>: su número de radicado oficial asignado (ej. <code className="text-amber-500 font-bold">RAD-2026-7658</code>) y su cédula o documento de identidad para verificar el abogado asignado y las actuaciones procesales.
          </p>
        </div>

        {/* Formulario de Búsqueda Fluid Glass */}
        <div className="fluid-glass rounded-2xl p-6 sm:p-8 shadow-2xl">
          <form onSubmit={handleBuscar} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                  Número de Radicado (Obligatorio)
                </label>
                <div className="relative">
                  <FileText className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
                  <input
                    type="text"
                    required
                    value={radicado}
                    onChange={(e) => setRadicado(e.target.value)}
                    placeholder="Ej. RAD-2026-7658"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-950/60 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                  Número de Documento / Cédula (Obligatorio)
                </label>
                <div className="relative">
                  <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
                  <input
                    type="text"
                    required
                    value={numeroDocumento}
                    onChange={(e) => setNumeroDocumento(e.target.value)}
                    placeholder="Ej. 1020304050"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-950/60 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 text-sm"
                  />
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
              <p className="text-xs text-slate-400">
                ¿No ha radicado aún?{" "}
                <Link href="/registro-cliente" className="text-amber-400 hover:underline">
                  Radicar Caso con Triaje IA aquí
                </Link>
              </p>

              <button
                type="submit"
                disabled={loading}
                className="w-full sm:w-auto px-6 py-2.5 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white font-medium text-sm rounded-xl shadow-lg shadow-amber-950/40 transition flex items-center justify-center space-x-2 disabled:opacity-50 cursor-pointer"
              >
                <Search className="w-4 h-4" />
                <span>{loading ? "Consultando expediente..." : "Consultar Expediente"}</span>
              </button>
            </div>
          </form>

          {error && (
            <div className="mt-6 p-4 rounded-xl bg-rose-950/40 border border-rose-800/60 text-rose-300 text-sm flex items-start space-x-3">
              <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-rose-200">No se encontró el expediente</p>
                <p className="text-xs text-rose-300/90 mt-0.5">{error}</p>
              </div>
            </div>
          )}
        </div>

        {/* Detalle del Expediente Encontrado */}
        {expediente && (
          <div className="fluid-glass rounded-2xl p-6 sm:p-8 space-y-6 shadow-2xl border-emerald-500/30">
            {/* Encabezado del caso */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/[0.08]">
              <div>
                <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold mb-2">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Expediente Localizado y Vigente</span>
                </div>
                <h2 className="text-2xl font-serif font-bold text-white tracking-tight">
                  {expediente.caso.titulo}
                </h2>
                <p className="text-xs text-slate-400 mt-1 flex items-center space-x-2">
                  <Clock className="w-3.5 h-3.5 text-slate-500" />
                  <span>
                    Radicado el {new Date(expediente.caso.fechaApertura).toLocaleDateString("es-CO", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                </p>
              </div>

              <div className="text-right">
                <span className="text-xs text-slate-400 block uppercase tracking-wider font-semibold">
                  Radicado Oficial
                </span>
                <span className="text-xl font-mono font-bold text-amber-400">
                  {expediente.caso.numeroExpediente}
                </span>
              </div>
            </div>

            {/* Tarjeta de Firma y Abogado Asignado */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Firma Receptora */}
              <div className="p-5 rounded-xl bg-slate-950/70 border border-white/[0.08] space-y-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <Building2 className="w-4 h-4 text-amber-400" />
                  Firma Jurídica Receptora
                </span>
                <p className="text-lg font-serif font-bold text-white">
                  {expediente.despacho.name}
                </p>
                <p className="text-xs text-slate-400">
                  Despacho Jurídico registrado bajo el sistema de multitenancy legal con reserva absoluta de sumario.
                </p>
              </div>

              {/* Abogado Asignado */}
              <div className="p-5 rounded-xl bg-slate-950/70 border border-amber-500/30 space-y-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-amber-400" />
                  Abogado Asignado por el Sistema IA
                </span>
                <p className="text-lg font-serif font-bold text-white flex items-center gap-2">
                  <span>⚖️ {expediente.abogadoAsignado.nombre}</span>
                </p>
                <p className="text-xs text-amber-300 font-medium">
                  {expediente.abogadoAsignado.categoria}
                </p>
                <p className="text-xs text-slate-400">
                  {expediente.abogadoAsignado.experienciaAnios} años de experiencia en litigio • Correo: {expediente.abogadoAsignado.email}
                </p>
              </div>
            </div>

            {/* Clasificación de Prioridad y Protección */}
            <div className="p-5 rounded-xl bg-slate-950/70 border border-white/[0.08] space-y-3">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <span className="text-xs uppercase tracking-wider font-semibold text-slate-400">
                  Condición del Poderdante / Accionante
                </span>
                <span
                  className={`text-xs font-bold uppercase px-2.5 py-0.5 rounded-full ${
                    expediente.cliente.tienePrioridad
                      ? "bg-rose-500/20 text-rose-300 border border-rose-500/40"
                      : "bg-slate-800 text-slate-300"
                  }`}
                >
                  {expediente.cliente.condicionEspecial.replace("_", " ")}
                </span>
              </div>

              <p className="text-sm text-slate-200">
                <strong>Accionante:</strong> {expediente.cliente.nombre} ({expediente.cliente.tipoDocumento} {expediente.cliente.numeroDocumento})
              </p>

              {expediente.caso.esFuerzaMayor && (
                <div className="p-3 rounded-lg bg-rose-950/40 border border-rose-800/40 text-rose-300 text-xs flex items-center space-x-2">
                  <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                  <span>
                    Caso clasificado como <strong>Fuerza Mayor / Riesgo Vital Inminente</strong>. Se encuentra bajo la supervisión directa del Socio Director de la firma.
                  </span>
                </div>
              )}
            </div>

            {/* Hechos y Dictamen Legal */}
            {expediente.caso.descripcion && (
              <div className="p-5 rounded-xl bg-slate-950/70 border border-white/[0.08] space-y-3">
                <span className="text-xs uppercase tracking-wider font-semibold text-slate-400 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  Hechos y Dictamen Constitucional de Inteligencia Artificial
                </span>
                <div className="text-xs text-slate-300 whitespace-pre-line leading-relaxed font-sans bg-slate-900/60 p-4 rounded-lg border border-white/[0.05]">
                  {expediente.caso.descripcion}
                </div>
              </div>
            )}

            {/* Acciones */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                onClick={() => window.print()}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-semibold transition cursor-pointer flex items-center justify-center space-x-2"
              >
                <FileText className="w-4 h-4" />
                <span>Imprimir / Descargar Certificado de Radicación</span>
              </button>
              <Link
                href="/constitucion"
                target="_blank"
                className="px-4 py-2 border border-amber-500/40 text-amber-400 hover:bg-amber-500/10 rounded-xl text-xs font-semibold transition text-center flex items-center justify-center space-x-2"
              >
                <BookOpen className="w-4 h-4" />
                <span>Consultar Artículos Constitucionales Invocados</span>
              </Link>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
