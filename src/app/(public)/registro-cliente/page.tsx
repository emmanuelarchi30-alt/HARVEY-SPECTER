"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Scale,
  Building2,
  ShieldCheck,
  AlertTriangle,
  Sparkles,
  Award,
  BookOpen,
  ArrowLeft,
  CheckCircle2,
  UserCheck,
  Search,
  Users
} from "lucide-react";
import { FluidGlassBackground } from "@/components/ui/FluidGlassBackground";

interface DespachoPublico {
  id: string;
  name: string;
  totalAbogados: number;
  abogados: Array<{
    id: string;
    nombre: string;
    role: string;
    experienciaAnios: number;
  }>;
}

export default function RegistroClientePage() {
  const [nombre, setNombre] = useState("");
  const [tipoDocumento, setTipoDocumento] = useState("CC");
  const [numeroDocumento, setNumeroDocumento] = useState("");
  const [email, setEmail] = useState("");
  const [telefono, setTelefono] = useState("");
  const [condicionEspecial, setCondicionEspecial] = useState("ninguna");
  const [tituloCaso, setTituloCaso] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [esFuerzaMayor, setEsFuerzaMayor] = useState(false);

  // Lista de despachos y despacho seleccionado
  const [despachos, setDespachos] = useState<DespachoPublico[]>([]);
  const [despachoSeleccionadoId, setDespachoSeleccionadoId] = useState<string>("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resultado, setResultado] = useState<{
    radicado: string;
    despacho: string;
    prioridad: string;
    nivelAbogado: string;
    triajeIA?: {
      requiereAbogadoMayor: boolean;
      categoriaCaso: string;
      prioridad: string;
      nivelAbogadoExigido: string;
      abogadoAsignado: {
        nombre: string;
        categoria: string;
        experienciaAnios: number;
        email: string;
      };
      fundamentoConstitucional: {
        articulos: number[];
        precedente: string;
        dictamenJuridico: string;
      };
    };
  } | null>(null);

  // Cargar despachos disponibles al iniciar
  useEffect(() => {
    async function cargarDespachos() {
      try {
        const res = await fetch("/api/tenants/publicos");
        const json = await res.json();
        if (json.success && json.data.despachos.length > 0) {
          setDespachos(json.data.despachos);
          setDespachoSeleccionadoId(json.data.despachos[0].id);
        }
      } catch (err) {
        console.error("Error al cargar despachos:", err);
      }
    }
    cargarDespachos();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/clientes/registro-publico", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombre,
          tipoDocumento,
          numeroDocumento,
          email,
          telefono,
          condicionEspecial,
          tituloCaso,
          descripcion,
          esFuerzaMayor,
          tenantId: despachoSeleccionadoId || undefined,
        }),
      });

      const json = await res.json();

      if (!res.ok) {
        throw new Error(json.error || "Error al radicar la solicitud");
      }

      setResultado({
        radicado: json.data.radicado,
        despacho: json.data.despacho,
        prioridad: json.data.caso.prioridad,
        nivelAbogado: json.data.caso.nivelAbogadoExigido,
        triajeIA: json.data.triajeIA,
      });
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Ocurrió un error inesperado al procesar su solicitud");
      }
    } finally {
      setLoading(false);
    }
  }

  const despachoActivo = despachos.find((d) => d.id === despachoSeleccionadoId);

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
              <span className="font-serif font-bold text-lg text-white tracking-tight block leading-none">
                Specter & Asociados Colombia
              </span>
              <span className="text-[10px] text-amber-400 font-semibold tracking-wider uppercase">
                Atención Ciudadana & Litigio de Alto Impacto
              </span>
            </div>
          </Link>

          <div className="flex items-center space-x-3">
            <Link
              href="/consultar-caso"
              className="text-xs text-slate-300 hover:text-white font-medium flex items-center space-x-1.5 px-3 py-1.5 rounded-lg border border-white/10 fluid-glass-pill transition"
            >
              <Search className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">Consultar mi Caso</span>
            </Link>
            <Link
              href="/constitucion"
              target="_blank"
              className="text-xs text-amber-400 hover:text-amber-300 font-medium flex items-center space-x-1.5 px-3 py-1.5 rounded-lg border border-amber-500/30 bg-amber-500/10 transition"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Constitución 1991</span>
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
      <main className="flex-1 max-w-3xl w-full mx-auto px-4 py-12">
        <div className="fluid-glass rounded-3xl p-6 sm:p-10 shadow-2xl">
          <div className="mb-8">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full fluid-glass-pill text-amber-400 text-xs font-semibold uppercase tracking-wider mb-2">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
              <span>Mesa de Reparto & Litigio Estratégico</span>
            </div>
            <h1 className="text-3xl font-serif font-bold text-white tracking-tight">
              Radicación de Caso y Asignación Automatizada (IA)
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              Complete los hechos y pretensiones de su solicitud. El motor de Inteligencia Artificial evaluará su condición bajo el marco constitucional colombiano y le asignará un abogado con la jerarquía idónea.
            </p>
          </div>

          {resultado ? (
            <div className="p-8 rounded-2xl bg-slate-950/80 border border-emerald-500/40 text-left space-y-6">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center space-x-3 text-emerald-400">
                  <CheckCircle2 className="w-8 h-8 text-emerald-400" />
                  <div>
                    <h2 className="text-xl font-bold font-serif text-white">
                      ¡Expediente Radicado Exitosamente!
                    </h2>
                    <p className="text-xs text-slate-400">
                      Firma receptora asignada: <strong className="text-white">{resultado.despacho}</strong>
                    </p>
                  </div>
                </div>

                <div className="px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-bold shadow-lg">
                  {resultado.radicado}
                </div>
              </div>

              {/* Dictamen de la Inteligencia Artificial Jurídica */}
              {resultado.triajeIA && (
                <div
                  className={`p-6 rounded-2xl border space-y-4 ${
                    resultado.triajeIA.requiereAbogadoMayor
                      ? "bg-amber-950/20 border-amber-500/40 text-amber-200"
                      : "bg-slate-900/60 border-white/10 text-slate-300"
                  }`}
                >
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <span className="text-xs uppercase tracking-wider font-bold flex items-center gap-2 text-amber-400">
                      <Sparkles className="w-4 h-4 text-amber-400" />
                      Dictamen Jurídico Automatizado (IA)
                    </span>
                    <span
                      className={`text-[11px] font-bold uppercase px-3 py-1 rounded-full ${
                        resultado.triajeIA.requiereAbogadoMayor
                          ? "bg-rose-500/20 text-rose-300 border border-rose-500/40"
                          : "bg-blue-500/20 text-blue-300 border border-blue-500/40"
                      }`}
                    >
                      {resultado.triajeIA.requiereAbogadoMayor
                        ? "Especial Protección / Abogado Mayor"
                        : "Trámite Ordinario / Abogado Menor"}
                    </span>
                  </div>

                  {/* Asignación de Abogado por Jerarquía */}
                  <div className="p-4 rounded-xl bg-slate-950/90 border border-white/10 space-y-2">
                    <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider flex items-center gap-1.5">
                      <UserCheck className="w-3.5 h-3.5 text-amber-400" />
                      Abogado Asignado al Expediente:
                    </p>
                    <p className="text-lg font-serif font-bold text-white flex items-center gap-2">
                      <span>⚖️ {resultado.triajeIA.abogadoAsignado.nombre}</span>
                      <span className="text-xs font-sans font-normal px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                        {resultado.triajeIA.abogadoAsignado.categoria}
                      </span>
                    </p>
                    <p className="text-xs text-slate-400">
                      Experiencia procesal:{" "}
                      <strong className="text-slate-200">
                        {resultado.triajeIA.abogadoAsignado.experienciaAnios} años en litigio
                      </strong>{" "}
                      • Correo institucional: {resultado.triajeIA.abogadoAsignado.email}
                    </p>
                  </div>

                  {/* Fundamentación Constitucional Colombiana */}
                  <div className="space-y-2 text-xs">
                    <p className="text-slate-300 leading-relaxed font-medium">
                      {resultado.triajeIA.fundamentoConstitucional.dictamenJuridico}
                    </p>
                    <div className="flex items-center flex-wrap gap-2 pt-1">
                      <span className="text-slate-400">Artículos Superiores aplicados:</span>
                      {resultado.triajeIA.fundamentoConstitucional.articulos.map((art) => (
                        <Link
                          key={art}
                          href="/constitucion"
                          target="_blank"
                          className="px-2.5 py-1 rounded-lg bg-slate-800 text-amber-400 font-mono text-[11px] hover:bg-amber-500 hover:text-slate-950 transition font-bold"
                        >
                          Art. {art} C.P.
                        </Link>
                      ))}
                    </div>
                    <p className="text-slate-400 text-[11px]">
                      <strong>Precedente vinculante:</strong>{" "}
                      {resultado.triajeIA.fundamentoConstitucional.precedente}
                    </p>
                  </div>
                </div>
              )}

              <div className="text-xs text-slate-400 space-y-1">
                <p>
                  • Su expediente ha sido guardado con radicado oficial y garantía de secreto profesional y reserva legal.
                </p>
                <p>
                  • Podrá consultar el avance de su caso en cualquier momento desde el Portal del Ciudadano utilizando su número de radicado.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <Link
                  href="/consultar-caso"
                  className="px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-white rounded-xl text-xs font-semibold transition text-center flex items-center justify-center space-x-2 shadow-lg shadow-emerald-950/40"
                >
                  <Search className="w-4 h-4" />
                  <span>Consultar Estado de este Radicado</span>
                </Link>
                <button
                  onClick={() => setResultado(null)}
                  className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-semibold transition cursor-pointer"
                >
                  Radicar Otra Solicitud
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="p-4 rounded-xl bg-rose-950/50 border border-rose-800 text-rose-300 text-sm flex items-start space-x-3">
                  <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-rose-200">Error en el trámite</p>
                    <p className="text-xs text-rose-300/90 mt-0.5">{error}</p>
                  </div>
                </div>
              )}

              {/* Sección 0: Selección de Despacho Jurídico Destinatario */}
              <div className="space-y-3 pb-2 border-b border-white/[0.08]">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                    <Building2 className="w-4 h-4 text-amber-400" />
                    Firma Legal Receptora
                  </span>
                  <span className="text-[11px] text-slate-400">
                    {despachos.length} firma(s) disponible(s)
                  </span>
                </div>

                {despachos.length > 0 ? (
                  <div className="space-y-2">
                    <select
                      value={despachoSeleccionadoId}
                      onChange={(e) => setDespachoSeleccionadoId(e.target.value)}
                      className="w-full px-4 py-2.5 bg-slate-950/70 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50 text-sm font-medium"
                    >
                      {despachos.map((d) => (
                        <option key={d.id} value={d.id}>
                          {d.name} ({d.totalAbogados} abogados inscritos)
                        </option>
                      ))}
                    </select>

                    {despachoActivo && (
                      <div className="p-3.5 rounded-xl bg-slate-950/50 border border-white/[0.05] text-xs space-y-1">
                        <p className="text-slate-300 font-medium">
                          Despacho: <strong className="text-white">{despachoActivo.name}</strong>
                        </p>
                        <p className="text-slate-400">
                          Equipo disponible: {despachoActivo.abogados.map(a => `${a.nombre} (${a.role})`).join(", ") || "Abogados titulares de guardia"}
                        </p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="p-3 rounded-xl bg-slate-950/60 border border-white/10 text-xs text-slate-400">
                    Cargando firmas disponibles...
                  </div>
                )}
              </div>

              {/* Sección 1: Datos Personales */}
              <div className="space-y-4">
                <span className="text-xs font-semibold uppercase tracking-wider text-amber-400 block pb-1 border-b border-white/[0.08]">
                  1. Identificación del Cliente / Accionante
                </span>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Nombre Completo
                  </label>
                  <input
                    type="text"
                    required
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    placeholder="Ej. María Pérez Gómez"
                    className="w-full px-4 py-2.5 bg-slate-950/70 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 text-sm"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      Tipo de Documento
                    </label>
                    <select
                      value={tipoDocumento}
                      onChange={(e) => setTipoDocumento(e.target.value)}
                      className="w-full px-4 py-2.5 bg-slate-950/70 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50 text-sm"
                    >
                      <option value="CC">Cédula de Ciudadanía (CC)</option>
                      <option value="TI">Tarjeta de Identidad (TI)</option>
                      <option value="CE">Cédula de Extranjería (CE)</option>
                      <option value="PPT">Permiso por Protección Temporal (PPT - Migrante)</option>
                      <option value="Pasaporte">Pasaporte</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      Número de Documento
                    </label>
                    <input
                      type="text"
                      required
                      value={numeroDocumento}
                      onChange={(e) => setNumeroDocumento(e.target.value)}
                      placeholder="Ej. 1020304050"
                      className="w-full px-4 py-2.5 bg-slate-950/70 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 text-sm"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      Correo Electrónico (Opcional)
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="maria@ejemplo.com"
                      className="w-full px-4 py-2.5 bg-slate-950/70 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      Teléfono de Contacto
                    </label>
                    <input
                      type="tel"
                      value={telefono}
                      onChange={(e) => setTelefono(e.target.value)}
                      placeholder="300 123 4567"
                      className="w-full px-4 py-2.5 bg-slate-950/70 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 text-sm"
                    />
                  </div>
                </div>
              </div>

              {/* Sección 2: Condición Especial de Protección */}
              <div className="space-y-4 pt-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-amber-400 block pb-1 border-b border-white/[0.08]">
                  2. Condición de Especial Protección Constitucional
                </span>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    ¿Pertenece a alguna de estas poblaciones amparadas constitucionalmente?
                  </label>
                  <select
                    value={condicionEspecial}
                    onChange={(e) => setCondicionEspecial(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-950/70 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50 text-sm font-medium"
                  >
                    <option value="ninguna">Ninguna / Ciudadano General (Trámite Ordinario)</option>
                    <option value="victima_conflicto">
                      Víctima del Conflicto Armado Interno (Ley 1448 de 2011) — Asigna Abogado Mayor
                    </option>
                    <option value="desplazado">
                      Persona en Desplazamiento Forzado (Sentencia T-025) — Asigna Abogado Mayor
                    </option>
                    <option value="migrante">
                      Población Migrante o Refugiada en Estado de Vulnerabilidad
                    </option>
                    <option value="madre_cabeza_familia">
                      Madre Cabeza de Familia
                    </option>
                    <option value="adulto_mayor">
                      Adulto Mayor / Sujeto en Debilidad Manifiesta
                    </option>
                    <option value="otro">Otra Condición de Vulnerabilidad</option>
                  </select>
                  <p className="text-[11px] text-slate-400 mt-2">
                    ⚖️ Las víctimas del conflicto armado y personas en situación de desplazamiento forzado son clasificadas con <strong>Prioridad Urgente</strong> y la plataforma les asigna de forma obligatoria a un <strong>Abogado Mayor (Socio Titular o Senior)</strong>.
                  </p>
                </div>
              </div>

              {/* Sección 3: Datos del Caso */}
              <div className="space-y-4 pt-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-amber-400 block pb-1 border-b border-white/[0.08]">
                  3. Datos del Caso o Solicitud Jurídica
                </span>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Título o Asunto de la Petición
                  </label>
                  <input
                    type="text"
                    required
                    value={tituloCaso}
                    onChange={(e) => setTituloCaso(e.target.value)}
                    placeholder="Ej. Acción de Tutela por Derecho Fundamental a la Salud / Restitución"
                    className="w-full px-4 py-2.5 bg-slate-950/70 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Relato Sucinto de los Hechos
                  </label>
                  <textarea
                    rows={4}
                    value={descripcion}
                    onChange={(e) => setDescripcion(e.target.value)}
                    placeholder="Describa brevemente los hechos, entidades o personas involucradas y derechos vulnerados..."
                    className="w-full px-4 py-2.5 bg-slate-950/70 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 text-sm"
                  />
                </div>

                <div className="p-4 rounded-xl bg-slate-950/60 border border-white/10 flex items-start space-x-3">
                  <input
                    id="esFuerzaMayor"
                    type="checkbox"
                    checked={esFuerzaMayor}
                    onChange={(e) => setEsFuerzaMayor(e.target.checked)}
                    className="mt-1 h-4 w-4 rounded border-slate-700 text-amber-600 focus:ring-amber-500 cursor-pointer"
                  />
                  <label
                    htmlFor="esFuerzaMayor"
                    className="text-xs text-slate-300 cursor-pointer"
                  >
                    <strong className="text-white block font-medium">
                      ¿Es un caso de Fuerza Mayor o Riesgo Vital Inminente?
                    </strong>
                    Active esta casilla si existe peligro inminente e irremediable a la vida, salud o libertad personal. El sistema derivará el caso de inmediato a un Abogado Mayor.
                  </label>
                </div>
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 px-4 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white font-semibold text-sm rounded-xl shadow-xl shadow-amber-950/40 transition disabled:opacity-50 cursor-pointer flex items-center justify-center space-x-2"
                >
                  <Scale className="w-4 h-4" />
                  <span>
                    {loading
                      ? "Procesando triaje de IA y radicando caso..."
                      : "Radicar Caso ante la Firma Jurídica"}
                  </span>
                </button>
              </div>
            </form>
          )}
        </div>
      </main>
    </div>
  );
}
