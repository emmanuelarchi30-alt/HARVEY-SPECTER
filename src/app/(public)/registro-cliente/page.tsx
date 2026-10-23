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
  Users,
  Zap,
  Clock,
  CreditCard,
} from "lucide-react";
import { FluidGlassBackground } from "@/components/ui/FluidGlassBackground";
import { PublicNavbar } from "@/components/ui/PublicNavbar";
import { SpecularButton } from "@/components/ui/SpecularButton";
import { useTheme } from "@/context/ThemeContext";
import { useLanguage } from "@/context/LanguageContext";

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
  const { theme } = useTheme();
  const { t } = useLanguage();
  const isLight = theme === "light";

  const [nombre, setNombre] = useState("");
  const [tipoDocumento, setTipoDocumento] = useState("CC");
  const [numeroDocumento, setNumeroDocumento] = useState("");
  const [email, setEmail] = useState("");
  const [telefono, setTelefono] = useState("");
  const [condicionEspecial, setCondicionEspecial] = useState("ninguna");
  const [modalidadArancel, setModalidadArancel] = useState<
    "amparo_victimas" | "ordinario" | "urgente" | "fast_track"
  >("ordinario");
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
    modalidadArancel: string;
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

  function handleCondicionChange(nuevaCondicion: string) {
    setCondicionEspecial(nuevaCondicion);
    if (nuevaCondicion === "victima_conflicto" || nuevaCondicion === "desplazado") {
      setModalidadArancel("amparo_victimas");
    } else if (modalidadArancel === "amparo_victimas") {
      setModalidadArancel("ordinario");
    }
  }

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
          modalidadArancel,
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
        modalidadArancel,
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
    <div
      className={`min-h-screen flex flex-col font-sans relative transition-colors duration-300 ${
        isLight ? "text-slate-800" : "text-slate-100"
      }`}
    >
      <FluidGlassBackground />

      {/* Header con PillNav de React Bits */}
      <PublicNavbar />

      {/* Main Content */}
      <main className="flex-1 max-w-3xl w-full mx-auto px-4 py-12">
        <div className="fluid-glass rounded-3xl p-6 sm:p-10 shadow-2xl">
          <div className="mb-8">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full fluid-glass-pill text-amber-500 text-xs font-semibold uppercase tracking-wider mb-2">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-500" />
              <span>Mesa de Reparto & Litigio Estratégico</span>
            </div>
            <h1
              className={`text-3xl font-serif font-bold tracking-tight ${
                isLight ? "text-slate-900" : "text-white"
              }`}
            >
              Radicación de Caso y Asignación Automatizada (IA)
            </h1>
            <p className={`text-sm mt-1 ${isLight ? "text-slate-600" : "text-slate-400"}`}>
              Complete los hechos y pretensiones de su solicitud. El motor de Inteligencia Artificial evaluará su condición bajo el marco constitucional colombiano y le asignará un abogado con la jerarquía idónea.
            </p>
          </div>

          {resultado ? (
            <div
              className={`p-8 rounded-2xl border text-left space-y-6 ${
                isLight
                  ? "bg-emerald-50/70 border-emerald-300 shadow-xl"
                  : "bg-slate-950/80 border-emerald-500/40"
              }`}
            >
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center space-x-3 text-emerald-600 dark:text-emerald-400">
                  <CheckCircle2 className="w-8 h-8 text-emerald-500" />
                  <div>
                    <h2
                      className={`text-xl font-bold font-serif ${
                        isLight ? "text-slate-900" : "text-white"
                      }`}
                    >
                      ¡Expediente Radicado Exitosamente!
                    </h2>
                    <p className={`text-xs ${isLight ? "text-slate-600" : "text-slate-400"}`}>
                      Firma receptora asignada:{" "}
                      <strong className={isLight ? "text-slate-900" : "text-white"}>
                        {resultado.despacho}
                      </strong>
                    </p>
                  </div>
                </div>

                <div className="px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-mono font-bold shadow-lg">
                  {resultado.radicado}
                </div>
              </div>

              {/* Dictamen de la Inteligencia Artificial Jurídica */}
              {resultado.triajeIA && (
                <div
                  className={`p-6 rounded-2xl border space-y-4 ${
                    resultado.triajeIA.requiereAbogadoMayor
                      ? isLight
                        ? "bg-amber-100/60 border-amber-300 text-amber-950"
                        : "bg-amber-950/20 border-amber-500/40 text-amber-200"
                      : isLight
                      ? "bg-blue-50/70 border-blue-200 text-slate-800"
                      : "bg-slate-900/60 border-white/10 text-slate-300"
                  }`}
                >
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <span className="text-xs uppercase tracking-wider font-bold flex items-center gap-2 text-amber-600 dark:text-amber-400">
                      <Sparkles className="w-4 h-4 text-amber-500" />
                      Dictamen Jurídico Automatizado (IA)
                    </span>
                    <span
                      className={`text-[11px] font-bold uppercase px-3 py-1 rounded-full ${
                        resultado.triajeIA.requiereAbogadoMayor
                          ? "bg-rose-500/20 text-rose-700 dark:text-rose-300 border border-rose-500/40"
                          : "bg-blue-500/20 text-blue-700 dark:text-blue-300 border border-blue-500/40"
                      }`}
                    >
                      {resultado.triajeIA.requiereAbogadoMayor
                        ? "Especial Protección / Abogado Mayor"
                        : "Trámite Ordinario / Abogado Menor"}
                    </span>
                  </div>

                  {/* Asignación de Abogado por Jerarquía */}
                  <div
                    className={`p-4 rounded-xl border space-y-2 ${
                      isLight
                        ? "bg-white/90 border-slate-200 shadow-sm"
                        : "bg-slate-950/90 border-white/10"
                    }`}
                  >
                    <p className={`text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5 ${isLight ? "text-slate-500" : "text-slate-400"}`}>
                      <UserCheck className="w-3.5 h-3.5 text-amber-500" />
                      Abogado Asignado al Expediente:
                    </p>
                    <p
                      className={`text-lg font-serif font-bold flex items-center gap-2 ${
                        isLight ? "text-slate-900" : "text-white"
                      }`}
                    >
                      <span>⚖️ {resultado.triajeIA.abogadoAsignado.nombre}</span>
                      <span className="text-xs font-sans font-normal px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-500/30">
                        {resultado.triajeIA.abogadoAsignado.categoria}
                      </span>
                    </p>
                    <p className={`text-xs ${isLight ? "text-slate-600" : "text-slate-400"}`}>
                      Experiencia procesal:{" "}
                      <strong className={isLight ? "text-slate-800" : "text-slate-200"}>
                        {resultado.triajeIA.abogadoAsignado.experienciaAnios} años en litigio
                      </strong>{" "}
                      • Correo institucional: {resultado.triajeIA.abogadoAsignado.email}
                    </p>
                  </div>

                  {/* Fundamentación Constitucional Colombiana */}
                  <div className="space-y-2 text-xs">
                    <p
                      className={`leading-relaxed font-medium ${
                        isLight ? "text-slate-700" : "text-slate-300"
                      }`}
                    >
                      {resultado.triajeIA.fundamentoConstitucional.dictamenJuridico}
                    </p>
                    <div className="flex items-center flex-wrap gap-2 pt-1">
                      <span className={isLight ? "text-slate-500" : "text-slate-400"}>
                        Artículos Superiores aplicados:
                      </span>
                      {resultado.triajeIA.fundamentoConstitucional.articulos.map((art) => (
                        <Link
                          key={art}
                          href="/constitucion"
                          target="_blank"
                          className={`px-2.5 py-1 rounded-lg font-mono text-[11px] font-bold transition ${
                            isLight
                              ? "bg-amber-100 text-amber-800 hover:bg-amber-200"
                              : "bg-slate-800 text-amber-400 hover:bg-amber-500 hover:text-slate-950"
                          }`}
                        >
                          Art. {art} C.P.
                        </Link>
                      ))}
                    </div>
                    <p className={`text-[11px] ${isLight ? "text-slate-600" : "text-slate-400"}`}>
                      <strong>Precedente vinculante:</strong>{" "}
                      {resultado.triajeIA.fundamentoConstitucional.precedente}
                    </p>
                  </div>
                </div>
              )}

              <div className={`text-xs space-y-1 ${isLight ? "text-slate-600" : "text-slate-400"}`}>
                <p>
                  • Su expediente ha sido guardado con radicado oficial y garantía de secreto profesional y reserva legal.
                </p>
                <p>
                  • <strong>Importante:</strong> Para consultar el expediente en el Portal del Ciudadano, debe suministrar tanto su número de radicado (<strong>{resultado.radicado}</strong>) como su cédula o documento registrado.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <SpecularButton
                  href="/consultar-caso"
                  size="md"
                  radius={16}
                  tint="#10b981"
                  tintOpacity={0.16}
                  textColor={isLight ? "#065f46" : "#a7f3d0"}
                  lineColor="#10b981"
                  baseColor={isLight ? "#d1fae5" : "#064e3b"}
                  intensity={1.1}
                  idleIntensity={0.35}
                  followMouse
                >
                  <Search className="w-4 h-4 text-emerald-500" />
                  <span>Consultar Estado de este Radicado</span>
                </SpecularButton>

                <SpecularButton
                  onClick={() => setResultado(null)}
                  size="md"
                  radius={16}
                  tint={isLight ? "#ffffff" : "#ffffff"}
                  tintOpacity={isLight ? 0.08 : 0.04}
                  textColor={isLight ? "#0f172a" : "#f5f5f5"}
                  lineColor={isLight ? "#94a3b8" : "#ffffff"}
                  baseColor={isLight ? "#e2e8f0" : "#525252"}
                  intensity={1}
                  idleIntensity={0.3}
                  followMouse
                >
                  <span>Radicar Otra Solicitud</span>
                </SpecularButton>
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
                  <span className="text-xs font-semibold uppercase tracking-wider text-amber-500 flex items-center gap-1.5">
                    <Building2 className="w-4 h-4 text-amber-500" />
                    Firma Legal Receptora
                  </span>
                  <span className={`text-[11px] ${isLight ? "text-slate-500" : "text-slate-400"}`}>
                    {despachos.length} firma(s) disponible(s)
                  </span>
                </div>

                {despachos.length > 0 ? (
                  <div className="space-y-2">
                    <select
                      value={despachoSeleccionadoId}
                      onChange={(e) => setDespachoSeleccionadoId(e.target.value)}
                      className="w-full px-4 py-2.5 ios-input text-sm font-medium"
                    >
                      {despachos.map((d) => (
                        <option key={d.id} value={d.id} className={isLight ? "text-slate-900" : "text-white"}>
                          {d.name} ({d.totalAbogados} abogados inscritos)
                        </option>
                      ))}
                    </select>

                    {despachoActivo && (
                      <div
                        className={`p-3.5 rounded-xl border text-xs space-y-1 ${
                          isLight
                            ? "bg-slate-50 border-slate-200"
                            : "bg-slate-950/50 border-white/[0.05]"
                        }`}
                      >
                        <p className={isLight ? "text-slate-700 font-medium" : "text-slate-300 font-medium"}>
                          Despacho:{" "}
                          <strong className={isLight ? "text-slate-900" : "text-white"}>
                            {despachoActivo.name}
                          </strong>
                        </p>
                        <p className={isLight ? "text-slate-500" : "text-slate-400"}>
                          Equipo disponible:{" "}
                          {despachoActivo.abogados.map((a) => `${a.nombre} (${a.role})`).join(", ") ||
                            "Abogados titulares de guardia"}
                        </p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div
                    className={`p-3 rounded-xl border text-xs ${
                      isLight
                        ? "bg-slate-50 border-slate-200 text-slate-500"
                        : "bg-slate-950/60 border-white/10 text-slate-400"
                    }`}
                  >
                    Cargando firmas disponibles...
                  </div>
                )}
              </div>

              {/* Sección 1: Datos Personales */}
              <div className="space-y-4">
                <span className="text-xs font-semibold uppercase tracking-wider text-amber-500 block pb-1 border-b border-white/[0.08]">
                  1. Identificación del Cliente / Accionante
                </span>

                <div>
                  <label
                    className={`block text-xs font-medium mb-1 ${
                      isLight ? "text-slate-700" : "text-slate-300"
                    }`}
                  >
                    Nombre Completo
                  </label>
                  <input
                    type="text"
                    required
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    placeholder="Ej. María Pérez Gómez"
                    className="w-full px-4 py-2.5 ios-input text-sm"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label
                      className={`block text-xs font-medium mb-1 ${
                        isLight ? "text-slate-700" : "text-slate-300"
                      }`}
                    >
                      Tipo de Documento
                    </label>
                    <select
                      value={tipoDocumento}
                      onChange={(e) => setTipoDocumento(e.target.value)}
                      className="w-full px-4 py-2.5 ios-input text-sm"
                    >
                      <option value="CC" className={isLight ? "text-slate-900" : "text-white"}>Cédula de Ciudadanía (CC)</option>
                      <option value="TI" className={isLight ? "text-slate-900" : "text-white"}>Tarjeta de Identidad (TI)</option>
                      <option value="CE" className={isLight ? "text-slate-900" : "text-white"}>Cédula de Extranjería (CE)</option>
                      <option value="PPT" className={isLight ? "text-slate-900" : "text-white"}>Permiso por Protección Temporal (PPT - Migrante)</option>
                      <option value="Pasaporte" className={isLight ? "text-slate-900" : "text-white"}>Pasaporte</option>
                    </select>
                  </div>

                  <div>
                    <label
                      className={`block text-xs font-medium mb-1 ${
                        isLight ? "text-slate-700" : "text-slate-300"
                      }`}
                    >
                      Número de Documento
                    </label>
                    <input
                      type="text"
                      required
                      value={numeroDocumento}
                      onChange={(e) => setNumeroDocumento(e.target.value)}
                      placeholder="Ej. 1020304050"
                      className="w-full px-4 py-2.5 ios-input text-sm"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label
                      className={`block text-xs font-medium mb-1 ${
                        isLight ? "text-slate-700" : "text-slate-300"
                      }`}
                    >
                      Correo Electrónico (Opcional)
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="maria@ejemplo.com"
                      className="w-full px-4 py-2.5 ios-input text-sm"
                    />
                  </div>

                  <div>
                    <label
                      className={`block text-xs font-medium mb-1 ${
                        isLight ? "text-slate-700" : "text-slate-300"
                      }`}
                    >
                      Teléfono de Contacto
                    </label>
                    <input
                      type="tel"
                      value={telefono}
                      onChange={(e) => setTelefono(e.target.value)}
                      placeholder="300 123 4567"
                      className="w-full px-4 py-2.5 ios-input text-sm"
                    />
                  </div>
                </div>
              </div>

              {/* Sección 2: Condición Especial de Protección */}
              <div className="space-y-4 pt-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-amber-500 block pb-1 border-b border-white/[0.08]">
                  2. Condición de Especial Protección Constitucional
                </span>

                <div>
                  <label
                    className={`block text-xs font-medium mb-1.5 ${
                      isLight ? "text-slate-700" : "text-slate-300"
                    }`}
                  >
                    ¿Pertenece a alguna de estas poblaciones amparadas constitucionalmente?
                  </label>
                  <select
                    value={condicionEspecial}
                    onChange={(e) => handleCondicionChange(e.target.value)}
                    className="w-full px-4 py-3 ios-input text-sm font-medium"
                  >
                    <option value="ninguna" className={isLight ? "text-slate-900" : "text-white"}>Ninguna / Ciudadano General (Trámite Ordinario)</option>
                    <option value="victima_conflicto" className={isLight ? "text-slate-900" : "text-white"}>
                      Víctima del Conflicto Armado Interno (Ley 1448 de 2011) — Asigna Abogado Mayor
                    </option>
                    <option value="desplazado" className={isLight ? "text-slate-900" : "text-white"}>
                      Persona en Desplazamiento Forzado (Sentencia T-025) — Asigna Abogado Mayor
                    </option>
                    <option value="migrante" className={isLight ? "text-slate-900" : "text-white"}>
                      Población Migrante o Refugiada en Estado de Vulnerabilidad
                    </option>
                    <option value="madre_cabeza_familia" className={isLight ? "text-slate-900" : "text-white"}>
                      Madre Cabeza de Familia
                    </option>
                    <option value="adulto_mayor" className={isLight ? "text-slate-900" : "text-white"}>
                      Adulto Mayor / Sujeto en Debilidad Manifiesta
                    </option>
                    <option value="otro" className={isLight ? "text-slate-900" : "text-white"}>Otra Condición de Vulnerabilidad</option>
                  </select>
                  <p className={`text-[11px] mt-2 ${isLight ? "text-slate-600" : "text-slate-400"}`}>
                    ⚖️ Las víctimas del conflicto armado y personas en situación de desplazamiento forzado son clasificadas con <strong>Prioridad Urgente</strong> y la plataforma les asigna de forma obligatoria a un <strong>Abogado Mayor (Socio Titular o Senior)</strong> con arancel gratuito garantizado.
                  </p>
                </div>
              </div>

              {/* Sección 3: Modalidad de Arancel y Tiempo de Estudio Procesal */}
              <div className="space-y-4 pt-2">
                <div className="flex items-center justify-between pb-1 border-b border-white/[0.08]">
                  <span className="text-xs font-semibold uppercase tracking-wider text-amber-500 flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-amber-500" />
                    3. Modalidad de Arancel & Tiempo de Estudio Procesal
                  </span>
                  <Link
                    href="/aranceles"
                    target="_blank"
                    className="text-[11px] text-amber-500 hover:underline flex items-center gap-1"
                  >
                    <span>Ver tabla completa</span>
                    <ArrowLeft className="w-3 h-3 rotate-180" />
                  </Link>
                </div>

                <p className={`text-xs ${isLight ? "text-slate-600" : "text-slate-400"}`}>
                  El tiempo de estudio y radicación de medidas cautelares varía según la modalidad seleccionada. <strong>Un pago prioritario o Fast Track otorga tiempo de estudio en menos de 12 horas con asignación inmediata de Socio Titular.</strong>
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  {/* Tarjeta 1: Amparo Constitucional Ley 1448 */}
                  <label
                    className={`p-4 rounded-xl border cursor-pointer transition flex flex-col justify-between ${
                      modalidadArancel === "amparo_victimas"
                        ? "border-emerald-500 bg-emerald-500/10 ring-2 ring-emerald-500/40"
                        : isLight
                        ? "border-slate-200 bg-white/70 hover:bg-slate-100/70"
                        : "border-white/10 bg-slate-950/60 hover:bg-slate-900/60"
                    }`}
                  >
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                          🕊️ Amparo Ley 1448
                        </span>
                        <input
                          type="radio"
                          name="modalidadArancel"
                          value="amparo_victimas"
                          checked={modalidadArancel === "amparo_victimas"}
                          onChange={() => setModalidadArancel("amparo_victimas")}
                          className="text-emerald-600 focus:ring-emerald-500"
                        />
                      </div>
                      <p className={`text-sm font-bold ${isLight ? "text-slate-900" : "text-white"}`}>
                        $0 COP <span className="text-xs font-normal text-emerald-600 dark:text-emerald-400">(Exento de Arancel)</span>
                      </p>
                      <p className={`text-xs ${isLight ? "text-slate-600" : "text-slate-400"}`}>
                        • Tiempo de estudio: <strong>5 días hábiles</strong>
                        <br />
                        • Asignación: <strong>Abogado Mayor Garantizado</strong>
                      </p>
                    </div>
                  </label>

                  {/* Tarjeta 2: Trámite Ordinario */}
                  <label
                    className={`p-4 rounded-xl border cursor-pointer transition flex flex-col justify-between ${
                      modalidadArancel === "ordinario"
                        ? "border-blue-500 bg-blue-500/10 ring-2 ring-blue-500/40"
                        : isLight
                        ? "border-slate-200 bg-white/70 hover:bg-slate-100/70"
                        : "border-white/10 bg-slate-950/60 hover:bg-slate-900/60"
                    }`}
                  >
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 flex items-center gap-1.5">
                          ⚖️ Ordinario
                        </span>
                        <input
                          type="radio"
                          name="modalidadArancel"
                          value="ordinario"
                          checked={modalidadArancel === "ordinario"}
                          onChange={() => setModalidadArancel("ordinario")}
                          className="text-blue-600 focus:ring-blue-500"
                        />
                      </div>
                      <p className={`text-sm font-bold ${isLight ? "text-slate-900" : "text-white"}`}>
                        $350.000 COP
                      </p>
                      <p className={`text-xs ${isLight ? "text-slate-600" : "text-slate-400"}`}>
                        • Tiempo de estudio: <strong>48 horas hábiles</strong>
                        <br />
                        • Asignación: <strong>Abogado Asociado / Menor</strong>
                      </p>
                    </div>
                  </label>

                  {/* Tarjeta 3: Litigio Preferente */}
                  <label
                    className={`p-4 rounded-xl border cursor-pointer transition flex flex-col justify-between ${
                      modalidadArancel === "urgente"
                        ? "border-amber-500 bg-amber-500/10 ring-2 ring-amber-500/40"
                        : isLight
                        ? "border-slate-200 bg-white/70 hover:bg-slate-100/70"
                        : "border-white/10 bg-slate-950/60 hover:bg-slate-900/60"
                    }`}
                  >
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 flex items-center gap-1.5">
                          ⚡ Preferente
                        </span>
                        <input
                          type="radio"
                          name="modalidadArancel"
                          value="urgente"
                          checked={modalidadArancel === "urgente"}
                          onChange={() => setModalidadArancel("urgente")}
                          className="text-amber-600 focus:ring-amber-500"
                        />
                      </div>
                      <p className={`text-sm font-bold ${isLight ? "text-slate-900" : "text-white"}`}>
                        $850.000 COP
                      </p>
                      <p className={`text-xs ${isLight ? "text-slate-600" : "text-slate-400"}`}>
                        • Tiempo de estudio: <strong>24 horas hábiles</strong>
                        <br />
                        • Asignación: <strong>Abogado Senior</strong>
                      </p>
                    </div>
                  </label>

                  {/* Tarjeta 4: Fast Track / Pago Grande (< 12 horas) */}
                  <label
                    className={`p-4 rounded-xl border cursor-pointer transition flex flex-col justify-between relative overflow-hidden ${
                      modalidadArancel === "fast_track"
                        ? "border-rose-500 bg-rose-500/15 ring-2 ring-rose-500/50"
                        : isLight
                        ? "border-rose-200 bg-rose-50/50 hover:bg-rose-100/50"
                        : "border-rose-500/30 bg-slate-950/70 hover:bg-rose-950/30"
                    }`}
                  >
                    <div className="absolute top-0 right-0 bg-rose-600 text-[9px] uppercase font-bold tracking-wider text-white px-2 py-0.5 rounded-bl-lg">
                      Ultra Rápido
                    </div>
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400 flex items-center gap-1.5">
                          🚀 Fast Track
                        </span>
                        <input
                          type="radio"
                          name="modalidadArancel"
                          value="fast_track"
                          checked={modalidadArancel === "fast_track"}
                          onChange={() => setModalidadArancel("fast_track")}
                          className="text-rose-600 focus:ring-rose-500"
                        />
                      </div>
                      <p className={`text-sm font-bold ${isLight ? "text-slate-900" : "text-white"}`}>
                        $2.500.000 COP <span className="text-[10px] text-rose-500 font-semibold">(Pago Grande)</span>
                      </p>
                      <p className={`text-xs ${isLight ? "text-slate-700" : "text-slate-300"}`}>
                        • Tiempo de estudio: <strong className="text-rose-600 dark:text-rose-400">&lt; 12 Horas Garantizadas</strong>
                        <br />
                        • <strong>Medida Cautelar Inmediata</strong> + Socio Titular
                      </p>
                    </div>
                  </label>
                </div>
              </div>

              {/* Sección 4: Datos del Caso */}
              <div className="space-y-4 pt-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-amber-500 block pb-1 border-b border-white/[0.08]">
                  4. Datos del Caso o Solicitud Jurídica
                </span>

                <div>
                  <label
                    className={`block text-xs font-medium mb-1 ${
                      isLight ? "text-slate-700" : "text-slate-300"
                    }`}
                  >
                    Título o Asunto de la Petición
                  </label>
                  <input
                    type="text"
                    required
                    value={tituloCaso}
                    onChange={(e) => setTituloCaso(e.target.value)}
                    placeholder="Ej. Acción de Tutela por Derecho Fundamental a la Salud / Restitución"
                    className="w-full px-4 py-2.5 ios-input text-sm"
                  />
                </div>

                <div>
                  <label
                    className={`block text-xs font-medium mb-1 ${
                      isLight ? "text-slate-700" : "text-slate-300"
                    }`}
                  >
                    Relato Sucinto de los Hechos
                  </label>
                  <textarea
                    rows={4}
                    value={descripcion}
                    onChange={(e) => setDescripcion(e.target.value)}
                    placeholder="Describa brevemente los hechos, entidades o personas involucradas y derechos vulnerados..."
                    className="w-full px-4 py-2.5 ios-input text-sm"
                  />
                </div>

                <div
                  className={`p-4 rounded-xl border flex items-start space-x-3 ${
                    isLight
                      ? "bg-amber-50/60 border-amber-200"
                      : "bg-slate-950/60 border-white/10"
                  }`}
                >
                  <input
                    id="esFuerzaMayor"
                    type="checkbox"
                    checked={esFuerzaMayor}
                    onChange={(e) => setEsFuerzaMayor(e.target.checked)}
                    className="mt-1 h-4 w-4 rounded border-slate-700 text-amber-600 focus:ring-amber-500 cursor-pointer"
                  />
                  <label
                    htmlFor="esFuerzaMayor"
                    className={`text-xs cursor-pointer ${
                      isLight ? "text-slate-700" : "text-slate-300"
                    }`}
                  >
                    <strong className={`block font-medium ${isLight ? "text-slate-900" : "text-white"}`}>
                      ¿Es un caso de Fuerza Mayor o Riesgo Vital Inminente?
                    </strong>
                    Active esta casilla si existe peligro inminente e irremediable a la vida, salud o libertad personal. El sistema derivará el caso de inmediato a un Abogado Mayor.
                  </label>
                </div>
              </div>

              <div className="pt-4 flex justify-center">
                <SpecularButton
                  type="submit"
                  disabled={loading}
                  size="lg"
                  radius={18}
                  tint={isLight ? "#f59e0b" : "#ffffff"}
                  tintOpacity={isLight ? 0.2 : 0.08}
                  textColor={isLight ? "#92400e" : "#fef3c7"}
                  lineColor={isLight ? "#d97706" : "#f59e0b"}
                  baseColor={isLight ? "#fef3c7" : "#525252"}
                  intensity={1.25}
                  idleIntensity={0.4}
                  shineSize={12}
                  shineFade={36}
                  thickness={1.4}
                  glow={1.2}
                  followMouse
                  proximity={280}
                  className="w-full"
                >
                  <Scale className="w-4 h-4 text-amber-500" />
                  <span>
                    {loading
                      ? "Procesando triaje de IA y radicando caso..."
                      : "Radicar Caso ante la Firma Jurídica"}
                  </span>
                </SpecularButton>
              </div>
            </form>
          )}
        </div>
      </main>
    </div>
  );
}
