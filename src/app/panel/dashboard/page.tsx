import { connection } from "next/server";
import { getSession } from "@/lib/auth/getSession";
import { publicPrisma } from "@/lib/db/publicClient";
import { getTenantClient } from "@/lib/db/tenantClient";
import Link from "next/link";
import {
  Scale,
  Users,
  Briefcase,
  Award,
  BookOpen,
  Sparkles,
  ShieldAlert,
  ArrowRight,
  GraduationCap
} from "lucide-react";

export const instant = false;

export default async function DashboardPage() {
  await connection();
  const session = await getSession();

  const user = session
    ? await publicPrisma.user.findUnique({
        where: { id: session.userId },
        include: { tenant: true },
      })
    : null;

  let totalClientes = 0;
  let clientesPrioritarios = 0;
  let totalCasos = 0;
  let casosUrgentes = 0;
  let casosSenior = 0;

  if (session) {
    try {
      const tenantPrisma = getTenantClient(session.schemaName);
      [
        totalClientes,
        clientesPrioritarios,
        totalCasos,
        casosUrgentes,
        casosSenior,
      ] = await Promise.all([
        tenantPrisma.cliente.count(),
        tenantPrisma.cliente.count({ where: { tienePrioridad: true } }),
        tenantPrisma.caso.count(),
        tenantPrisma.caso.count({ where: { prioridad: "urgente" } }),
        tenantPrisma.caso.count({ where: { nivelAbogadoExigido: "senior" } }),
      ]);
    } catch (e) {
      console.error("Error al calcular estadísticas jurídicas del despacho:", e);
    }
  }

  return (
    <div className="space-y-8">
      {/* Encabezado del despacho con Fluid Glass */}
      <div className="fluid-glass rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full fluid-glass-pill text-amber-400 text-xs font-semibold uppercase tracking-wider mb-3">
              <Scale className="w-3.5 h-3.5 text-amber-400" />
              <span>Mesa de Litigio y Control Constitucional</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-serif font-bold text-white tracking-tight">
              {user?.tenant.name || "Specter & Asociados"}
            </h1>
            <p className="text-slate-400 text-sm mt-1 max-w-xl">
              Firma Jurídica Colombiana • Litigio de Alto Impacto, Tutelas y Asignación Automatizada con Inteligencia Artificial.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/constitucion"
              target="_blank"
              className="inline-flex items-center justify-center px-4 py-2.5 rounded-xl border border-amber-500/40 bg-amber-500/10 text-amber-300 hover:bg-amber-500/20 text-xs font-semibold transition space-x-2"
            >
              <BookOpen className="w-4 h-4" />
              <span>Constitución 1991</span>
            </Link>
            <Link
              href="/registro-cliente"
              className="inline-flex items-center justify-center px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white text-xs font-semibold transition shadow-lg shadow-amber-950/40 space-x-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>Radicar Caso con Triaje IA</span>
            </Link>
            <Link
              href="/panel/abogados"
              className="inline-flex items-center justify-center px-4 py-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition space-x-2"
            >
              <GraduationCap className="w-4 h-4" />
              <span>Equipo Jurídico</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Tarjetas de Indicadores Litigiosos Fluid Glass */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="fluid-glass rounded-2xl p-6 space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs uppercase tracking-wider font-semibold">Expedientes Activos</span>
            <Briefcase className="w-4 h-4 text-slate-400" />
          </div>
          <p className="text-3xl font-serif font-bold text-white">
            {totalCasos}
          </p>
          <p className="text-xs text-slate-400">
            Procesos y acciones constitucionales radicados.
          </p>
        </div>

        <div className="fluid-glass rounded-2xl p-6 space-y-2 border-rose-500/30">
          <div className="flex items-center justify-between text-rose-400">
            <span className="text-xs uppercase tracking-wider font-semibold">Litigios Urgentes</span>
            <ShieldAlert className="w-4 h-4 text-rose-400" />
          </div>
          <p className="text-3xl font-serif font-bold text-rose-400">
            {casosUrgentes}
          </p>
          <p className="text-xs text-slate-400">
            Fuerza mayor o tutela con riesgo inminente (Art. 86).
          </p>
        </div>

        <div className="fluid-glass rounded-2xl p-6 space-y-2 border-amber-500/30">
          <div className="flex items-center justify-between text-amber-400">
            <span className="text-xs uppercase tracking-wider font-semibold">Sujetos de Especial Protección</span>
            <Users className="w-4 h-4 text-amber-400" />
          </div>
          <p className="text-3xl font-serif font-bold text-amber-400">
            {clientesPrioritarios}
          </p>
          <p className="text-xs text-slate-400">
            Víctimas del conflicto armado y desplazados (Ley 1448).
          </p>
        </div>

        <div className="fluid-glass rounded-2xl p-6 space-y-2 border-emerald-500/30">
          <div className="flex items-center justify-between text-emerald-400">
            <span className="text-xs uppercase tracking-wider font-semibold">Asignados a Abogado Mayor</span>
            <Award className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-3xl font-serif font-bold text-emerald-400">
            {casosSenior}
          </p>
          <p className="text-xs text-slate-400">
            Litigios prioritarios delegados a Socios y Seniors.
          </p>
        </div>
      </div>

      {/* Panel Explicativo del Motor de Inteligencia Artificial Jurídica */}
      <div className="fluid-glass rounded-3xl p-6 sm:p-8 space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-2 border-b border-white/[0.08] pb-5">
          <div className="flex items-center space-x-3.5">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center">
              <Scale className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <h2 className="text-lg font-serif font-bold text-white">
                Inteligencia Artificial de Triaje Jurídico y Asignación Constitucional
              </h2>
              <p className="text-xs text-slate-400">
                Garantía de prelación procesal conforme a la Carta Magna de 1991 y precedentes de la Corte Constitucional
              </p>
            </div>
          </div>

          <span className="px-3.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold flex items-center space-x-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>Motor IA Operativo</span>
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
          <div className="p-5 rounded-2xl bg-slate-950/70 border border-white/[0.06] space-y-3">
            <div className="flex items-center space-x-2 text-rose-300 font-serif font-bold text-base">
              <Award className="w-5 h-5 text-rose-400" />
              <h3>Casos Prioritarios: Asignación a Abogado Mayor</h3>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              En aplicación del <strong>Artículo 13 de la Constitución Política</strong> (principio de igualdad real para sujetos en debilidad manifiesta) y la <strong>Ley 1448 de 2011</strong> (Ley de Víctimas y Restitución de Tierras), la plataforma clasifica de inmediato el caso con <span className="text-rose-400 font-semibold">Prioridad Urgente</span> y asigna forzosamente a un <strong>Abogado Mayor (Socio Titular o Senior)</strong> con más de 8 años de experiencia para la radicación inmediata de la Acción de Tutela.
            </p>
            <div className="pt-2 text-[11px] text-slate-400 border-t border-white/[0.05]">
              <strong className="text-slate-300">Precedente rector:</strong> Sentencia T-025 de 2004 (Estado de Cosas Inconstitucional en materia de desplazamiento forzado).
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-slate-950/70 border border-white/[0.06] space-y-3">
            <div className="flex items-center space-x-2 text-blue-300 font-serif font-bold text-base">
              <Briefcase className="w-5 h-5 text-blue-400" />
              <h3>Casos Ordinarios: Asignación a Abogado Menor</h3>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              En aquellos asuntos donde no concurren circunstancias de vulnerabilidad extrema, fuerza mayor ni riesgo inminente a derechos inalienables, la plataforma aplica los principios de <strong>celeridad, economía procesal y eficacia (Art. 209 C.P.)</strong>, asignando el caso a un <strong>Abogado Menor (Asociado o Junior)</strong> bajo la supervisión de la firma, optimizando los tiempos de respuesta procesal.
            </p>
            <div className="pt-2 text-[11px] text-slate-400 border-t border-white/[0.05]">
              <strong className="text-slate-300">Garantía rectora:</strong> Artículo 29 de la Constitución Política (Debido Proceso y Derecho de Defensa Técnica).
            </div>
          </div>
        </div>

        {/* Artículos Constitucionales Fundamentales */}
        <div className="pt-4 border-t border-white/[0.08]">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs uppercase tracking-wider text-amber-400 font-bold flex items-center gap-1.5">
              <BookOpen className="w-4 h-4 text-amber-400" />
              Bloque de Constitucionalidad Integrado
            </h3>
            <Link
              href="/constitucion"
              target="_blank"
              className="text-xs text-slate-400 hover:text-amber-300 transition flex items-center space-x-1"
            >
              <span>Abrir Visor Constitucional Completo</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <Link
              href="/constitucion"
              target="_blank"
              className="p-3.5 rounded-xl bg-slate-950/70 border border-white/[0.06] hover:border-amber-500/50 transition block group"
            >
              <span className="font-mono font-bold text-amber-400 block mb-1 group-hover:text-amber-300">Art. 11 C.P.</span>
              <span className="text-slate-300">Derecho Fundamental a la Vida e Integridad Personal</span>
            </Link>

            <Link
              href="/constitucion"
              target="_blank"
              className="p-3.5 rounded-xl bg-slate-950/70 border border-white/[0.06] hover:border-amber-500/50 transition block group"
            >
              <span className="font-mono font-bold text-amber-400 block mb-1 group-hover:text-amber-300">Art. 13 C.P.</span>
              <span className="text-slate-300">Igualdad Real y Protección Reforzada a Víctimas</span>
            </Link>

            <Link
              href="/constitucion"
              target="_blank"
              className="p-3.5 rounded-xl bg-slate-950/70 border border-white/[0.06] hover:border-amber-500/50 transition block group"
            >
              <span className="font-mono font-bold text-amber-400 block mb-1 group-hover:text-amber-300">Art. 29 C.P.</span>
              <span className="text-slate-300">Garantía del Debido Proceso y Defensa Técnica</span>
            </Link>

            <Link
              href="/constitucion"
              target="_blank"
              className="p-3.5 rounded-xl bg-slate-950/70 border border-white/[0.06] hover:border-amber-500/50 transition block group"
            >
              <span className="font-mono font-bold text-amber-400 block mb-1 group-hover:text-amber-300">Art. 86 C.P.</span>
              <span className="text-slate-300">Acción de Tutela para Protección Inmediata</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
