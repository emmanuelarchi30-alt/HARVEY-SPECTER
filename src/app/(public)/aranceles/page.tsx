"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Scale,
  Zap,
  ShieldCheck,
  Clock,
  Award,
  CreditCard,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  BookOpen,
  DollarSign,
  Sparkles
} from "lucide-react";
import { FluidGlassBackground } from "@/components/ui/FluidGlassBackground";
import { HeaderControls } from "@/components/ui/HeaderControls";
import { SpecularButton } from "@/components/ui/SpecularButton";
import { useLanguage } from "@/context/LanguageContext";
import { useTheme } from "@/context/ThemeContext";

interface PlanArancel {
  id: string;
  nombre: string;
  subtitulo: string;
  precio: number;
  precioTexto: string;
  tiempoEstudio: string;
  horas: number;
  nivelAbogado: string;
  esGratuito: boolean;
  esDestacado: boolean;
  beneficios: string[];
  medidaCautelar: boolean;
}

const PLANES_ARANCELES: PlanArancel[] = [
  {
    id: "amparo_victimas",
    nombre: "Amparo Constitucional & Víctimas",
    subtitulo: "Ley 1448 de 2011 y Sentencia T-025 de 2004",
    precio: 0,
    precioTexto: "$0 COP (Gratuito)",
    tiempoEstudio: "5 a 7 días hábiles",
    horas: 120,
    nivelAbogado: "Abogado Mayor (Socio Titular / Senior)",
    esGratuito: true,
    esDestacado: false,
    beneficios: [
      "Exención total de honorarios (Amparo de pobreza Art. 13 C.P.)",
      "Asignación automática a Abogado Mayor con más de 12 años de experiencia",
      "Interposición de Acción de Tutela ante Juez Constitucional",
      "Representación integral ante la Unidad para las Víctimas (RUV)",
    ],
    medidaCautelar: true,
  },
  {
    id: "ordinario",
    nombre: "Trámite Ordinario / Asesoría",
    subtitulo: "Derechos de Petición y Procesos Civiles",
    precio: 350000,
    precioTexto: "$350.000 COP",
    tiempoEstudio: "48 horas hábiles",
    horas: 48,
    nivelAbogado: "Abogado Menor (Asociado)",
    esGratuito: false,
    esDestacado: false,
    beneficios: [
      "Estudio preliminar de viabilidad jurídica",
      "Elaboración técnica de Derecho de Petición (Art. 23 C.P.)",
      "Asignación a Abogado Asociado bajo supervisión de la firma",
      "Seguimiento procesal en línea",
    ],
    medidaCautelar: false,
  },
  {
    id: "urgente",
    nombre: "Litigio Preferente Urgente",
    subtitulo: "Acciones de Tutela y Reclamaciones en Salud",
    precio: 850000,
    precioTexto: "$850.000 COP",
    tiempoEstudio: "24 horas hábiles",
    horas: 24,
    nivelAbogado: "Abogado Senior de Litigio",
    esGratuito: false,
    esDestacado: false,
    beneficios: [
      "Tiempo de estudio acelerado a 24 horas",
      "Redacción perentoria de Acción de Tutela (Art. 86 C.P.)",
      "Asignación a Abogado Senior con más de 8 años de experiencia",
      "Solicitud de requerimiento judicial prioritario",
    ],
    medidaCautelar: false,
  },
  {
    id: "fast_track",
    nombre: "Fast Track • Medida Cautelar Inmediata",
    subtitulo: "Máxima Prioridad con Tiempo de Estudio Ultra-Corto",
    precio: 2500000,
    precioTexto: "$2.500.000 COP",
    tiempoEstudio: "Menos de 6 a 12 HORAS",
    horas: 12,
    nivelAbogado: "Socio Director Titular (Abogado Mayor)",
    esGratuito: false,
    esDestacado: true,
    beneficios: [
      "Tiempo de estudio ultra-corto (Entrega en menos de 12 horas)",
      "Asignación exclusiva y directa del Socio Director de la firma",
      "Solicitud formal de Medida Provisional Previa (Dec. 2591/91 Art. 7)",
      "Atención telefónica directa 24/7 con el Socio Titular",
      "Radicación en el primer reparto judicial disponible del día",
    ],
    medidaCautelar: true,
  },
];

export default function ArancelesPage() {
  const { t } = useLanguage();
  const { theme } = useTheme();
  const isLight = theme === "light";

  const [planSeleccionado, setPlanSeleccionado] = useState<PlanArancel | null>(null);
  const [pasoPago, setPasoPago] = useState<"seleccion" | "formulario" | "exitoso">("seleccion");
  const [metodoPago, setMetodoPago] = useState("PSE");
  const [nombreTitular, setNombreTitular] = useState("");
  const [cedulaTitular, setCedulaTitular] = useState("");
  const [referenciaPago, setReferenciaPago] = useState("");

  function iniciarPago(plan: PlanArancel) {
    setPlanSeleccionado(plan);
    setPasoPago("formulario");
  }

  function procesarSimulacionPago(e: React.FormEvent) {
    e.preventDefault();
    const ref = `PAG-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`;
    setReferenciaPago(ref);
    setPasoPago("exitoso");
  }

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
                Aranceles & Tiempos de Estudio
              </span>
              <span className="text-[10px] text-amber-400 font-semibold tracking-wider uppercase">
                Prelación Procesal & Honorarios Judiciales
              </span>
            </div>
          </Link>

          <div className="flex items-center space-x-3">
            <HeaderControls />
            <Link
              href="/consultar-caso"
              className="text-xs text-slate-300 hover:text-white font-medium flex items-center space-x-1 px-3 py-1.5 rounded-xl border border-white/10 fluid-glass-pill transition"
            >
              <span>Consultar Radicado</span>
            </Link>
            <Link
              href="/"
              className="text-xs text-slate-400 hover:text-white transition"
            >
              ← Inicio
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full fluid-glass-pill text-amber-400 text-xs font-semibold uppercase tracking-wider">
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span>Regla de Celeridad: A Mayor Arancel, Menor Tiempo de Estudio</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-serif font-bold text-white tracking-tight">
            Tarifas de Litigio & Tiempos de Respuesta
          </h1>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Elija la modalidad que mejor se adapte a su urgencia jurídica. Los casos de especial protección (víctimas del conflicto armado) son 100% gratuitos por mandato constitucional. Los casos <strong>Fast Track (Pago Grande)</strong> son estudiados en menos de 12 horas con solicitud de medida cautelar provisional.
          </p>
        </div>

        {/* Cuadrícula de Planes Fluid Glass */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {PLANES_ARANCELES.map((plan) => (
            <div
              key={plan.id}
              className={`fluid-glass rounded-3xl p-6 sm:p-7 flex flex-col justify-between space-y-6 transition-all duration-300 relative ${
                plan.esDestacado
                  ? "border-amber-500/60 shadow-2xl shadow-amber-950/40 ring-2 ring-amber-500/30"
                  : plan.esGratuito
                  ? "border-emerald-500/40"
                  : "border-white/10"
              }`}
            >
              {plan.esDestacado && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 text-[10px] font-black uppercase tracking-wider shadow-lg flex items-center space-x-1">
                  <Zap className="w-3 h-3 fill-slate-950" />
                  <span>Respuesta en Menos de 12 Horas</span>
                </div>
              )}

              {plan.esGratuito && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-emerald-600 text-white text-[10px] font-bold uppercase tracking-wider shadow-lg">
                  Amparo Ley 1448 de 2011
                </div>
              )}

              <div className="space-y-4 pt-2">
                <div>
                  <h3 className="font-serif font-bold text-white text-xl">
                    {plan.nombre}
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">{plan.subtitulo}</p>
                </div>

                <div className="pt-2 border-t border-white/[0.08]">
                  <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold block">
                    Arancel Oficial
                  </span>
                  <div className="text-2xl sm:text-3xl font-mono font-bold text-amber-400">
                    {plan.precioTexto}
                  </div>
                </div>

                {/* Tiempo de Estudio Destacado */}
                <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-white/[0.08] space-y-1">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 flex items-center gap-1.5">
                    <Clock className="w-3 h-3 text-amber-400" />
                    Tiempo de Estudio Procesal:
                  </span>
                  <p className="text-sm font-bold text-white">
                    {plan.tiempoEstudio}
                  </p>
                </div>

                {/* Jerarquía de Abogado Asignado */}
                <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.05] space-y-1 text-xs">
                  <span className="text-[10px] uppercase font-semibold text-slate-400 flex items-center gap-1">
                    <Award className="w-3 h-3 text-amber-400" />
                    Nivel del Abogado:
                  </span>
                  <p className="font-medium text-amber-300/90 leading-tight">
                    {plan.nivelAbogado}
                  </p>
                </div>

                {/* Beneficios */}
                <ul className="space-y-2 text-xs text-slate-300 pt-2">
                  {plan.beneficios.map((b, i) => (
                    <li key={i} className="flex items-start space-x-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-4 border-t border-white/[0.08] flex justify-center">
                {plan.esGratuito ? (
                  <SpecularButton
                    href="/registro-cliente"
                    size="md"
                    radius={16}
                    tint="#10b981"
                    tintOpacity={0.18}
                    textColor={isLight ? "#065f46" : "#a7f3d0"}
                    lineColor="#10b981"
                    baseColor={isLight ? "#d1fae5" : "#064e3b"}
                    intensity={1.1}
                    idleIntensity={0.35}
                    followMouse
                    className="w-full"
                  >
                    <span>Radicar Caso con Amparo Gratuito</span>
                    <ArrowRight className="w-3.5 h-3.5 text-emerald-400" />
                  </SpecularButton>
                ) : (
                  <SpecularButton
                    onClick={() => iniciarPago(plan)}
                    size="md"
                    radius={16}
                    tint={plan.esDestacado ? (isLight ? "#ef4444" : "#f43f5e") : (isLight ? "#f59e0b" : "#ffffff")}
                    tintOpacity={plan.esDestacado ? 0.22 : (isLight ? 0.16 : 0.08)}
                    textColor={plan.esDestacado ? (isLight ? "#991b1b" : "#ffe4e6") : (isLight ? "#92400e" : "#fef3c7")}
                    lineColor={plan.esDestacado ? "#f43f5e" : (isLight ? "#d97706" : "#f59e0b")}
                    baseColor={plan.esDestacado ? (isLight ? "#fee2e2" : "#881337") : (isLight ? "#fef3c7" : "#525252")}
                    intensity={1.2}
                    idleIntensity={0.4}
                    shineSize={12}
                    shineFade={36}
                    thickness={1.4}
                    glow={1.2}
                    followMouse
                    className="w-full"
                  >
                    <CreditCard className="w-3.5 h-3.5 text-amber-500" />
                    <span>Contratar {plan.nombre}</span>
                  </SpecularButton>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Modal de Pago / Pasarela Simulada */}
        {planSeleccionado && pasoPago === "formulario" && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <div className="fluid-glass rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-6 border-amber-500/40 shadow-2xl">
              <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
                <div>
                  <span className="text-xs uppercase tracking-wider font-semibold text-amber-400">
                    Pasarela de Pago de Arancel Procesal
                  </span>
                  <h2 className="text-xl font-serif font-bold text-white mt-0.5">
                    {planSeleccionado.nombre}
                  </h2>
                </div>
                <button
                  onClick={() => setPlanSeleccionado(null)}
                  className="w-8 h-8 rounded-full bg-white/[0.05] border border-white/10 text-slate-400 hover:text-white flex items-center justify-center cursor-pointer text-sm"
                >
                  ✕
                </button>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950/70 border border-white/[0.08] space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-400">Arancel a Cancelar:</span>
                  <strong className="text-amber-400 font-mono text-sm">
                    {planSeleccionado.precioTexto}
                  </strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Tiempo de Estudio Garantizado:</span>
                  <strong className="text-white">{planSeleccionado.tiempoEstudio}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Abogado Responsable:</span>
                  <strong className="text-emerald-400">{planSeleccionado.nivelAbogado}</strong>
                </div>
              </div>

              <form onSubmit={procesarSimulacionPago} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                    Método de Pago
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {["PSE", "Bancolombia", "Tarjeta"].map((m) => (
                      <button
                        key={m}
                        type="button"
                        onClick={() => setMetodoPago(m)}
                        className={`py-2 px-3 rounded-xl text-xs font-semibold transition border cursor-pointer ${
                          metodoPago === m
                            ? "bg-amber-500 text-slate-950 border-amber-400"
                            : "bg-white/[0.04] text-slate-300 border-white/10 hover:bg-white/[0.08]"
                        }`}
                      >
                        {m}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                    Nombre Completo del Pagador / Accionante
                  </label>
                  <input
                    type="text"
                    required
                    value={nombreTitular}
                    onChange={(e) => setNombreTitular(e.target.value)}
                    placeholder="Ej. Rodrigo Montoya"
                    className="w-full px-4 py-2.5 ios-input text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                    Cédula o NIT
                  </label>
                  <input
                    type="text"
                    required
                    value={cedulaTitular}
                    onChange={(e) => setCedulaTitular(e.target.value)}
                    placeholder="Ej. 71234567"
                    className="w-full px-4 py-2.5 ios-input text-sm"
                  />
                </div>

                <div className="pt-2 flex justify-center">
                  <SpecularButton
                    type="submit"
                    size="md"
                    radius={16}
                    tint="#10b981"
                    tintOpacity={0.2}
                    textColor="#ffffff"
                    lineColor="#10b981"
                    baseColor="#064e3b"
                    intensity={1.2}
                    idleIntensity={0.4}
                    followMouse
                    className="w-full"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Confirmar Pago de {planSeleccionado.precioTexto}</span>
                  </SpecularButton>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal de Pago Exitoso con Comprobante */}
        {planSeleccionado && pasoPago === "exitoso" && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <div className="fluid-glass rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-5 border-emerald-500/50 shadow-2xl text-center">
              <div className="w-14 h-14 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 mx-auto flex items-center justify-center shadow-lg">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div>
                <h2 className="text-2xl font-serif font-bold text-white">
                  ¡Pago Confirmado Exitosamente!
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Su arancel ha sido recaudado y el orden de prelación ha sido asignado.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950/80 border border-white/10 text-left space-y-2 text-xs">
                <p>
                  <strong className="text-slate-400">Referencia de Pago:</strong>{" "}
                  <span className="font-mono font-bold text-amber-400">{referenciaPago}</span>
                </p>
                <p>
                  <strong className="text-slate-400">Modalidad Contratada:</strong>{" "}
                  <span className="text-white">{planSeleccionado.nombre}</span>
                </p>
                <p>
                  <strong className="text-slate-400">Tiempo de Estudio Máximo:</strong>{" "}
                  <span className="text-emerald-400 font-bold">{planSeleccionado.tiempoEstudio}</span>
                </p>
                <p>
                  <strong className="text-slate-400">Abogado Titular Asignado:</strong>{" "}
                  <span className="text-white font-semibold">{planSeleccionado.nivelAbogado}</span>
                </p>
              </div>

              <div className="space-y-3 pt-2 flex flex-col items-center">
                <SpecularButton
                  href="/registro-cliente"
                  size="md"
                  radius={16}
                  tint="#f59e0b"
                  tintOpacity={0.2}
                  textColor="#fef3c7"
                  lineColor="#d97706"
                  baseColor="#525252"
                  intensity={1.2}
                  idleIntensity={0.4}
                  followMouse
                  className="w-full"
                >
                  <Scale className="w-4 h-4 text-amber-500" />
                  <span>Proceder a Radicar Expediente con este Plan</span>
                </SpecularButton>

                <SpecularButton
                  onClick={() => {
                    setPlanSeleccionado(null);
                    setPasoPago("seleccion");
                  }}
                  size="sm"
                  radius={14}
                  tint="#ffffff"
                  tintOpacity={0.06}
                  textColor="#f5f5f5"
                  lineColor="#94a3b8"
                  baseColor="#525252"
                  intensity={1}
                  idleIntensity={0.3}
                  followMouse
                  className="w-full"
                >
                  <span>Cerrar Comprobante</span>
                </SpecularButton>
              </div>
            </div>
          </div>
        )}
      </main>

      <footer className="border-t border-white/[0.08] fluid-glass py-6 text-center text-xs text-slate-500">
        Aranceles Procesales • Colegio de Abogados y Tarifas Legales de Colombia
      </footer>
    </div>
  );
}
