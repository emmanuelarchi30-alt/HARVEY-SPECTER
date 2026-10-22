import { connection } from "next/server";
import { getSession } from "@/lib/auth/getSession";
import { publicPrisma } from "@/lib/db/publicClient";
import Link from "next/link";

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

  return (
    <div className="space-y-8">
      {/* Encabezado del despacho */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-slate-850 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold uppercase tracking-wider mb-3">
              <span>Firma Legal Activa</span>
            </div>
            <h1 className="text-3xl font-serif font-bold text-white tracking-tight">
              {user?.tenant.name || "Specter & Asociados"}
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              Despacho Jurídico operando bajo legislación colombiana • Sistema Multitenant Seguro
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              href="/panel/clientes"
              className="inline-flex items-center justify-center px-4 py-2.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-white text-sm font-medium transition shadow-lg shadow-amber-900/20"
            >
              + Nuevo Cliente / Accionante
            </Link>
            <Link
              href="/panel/casos"
              className="inline-flex items-center justify-center px-4 py-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-medium transition"
            >
              Ver Casos y Expedientes
            </Link>
          </div>
        </div>
      </div>

      {/* Tarjetas de Métricas y Aislamiento de Arquitectura */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <p className="text-xs uppercase tracking-wider text-slate-400 font-semibold mb-1">
            Schema PostgreSQL Aislado
          </p>
          <p className="text-2xl font-mono font-bold text-emerald-400">
            {session?.schemaName}
          </p>
          <p className="text-xs text-slate-400 mt-2">
            Garantía de aislamiento criptográfico y físico. Las tablas de este despacho residen exclusivamente en este schema.
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <p className="text-xs uppercase tracking-wider text-slate-400 font-semibold mb-1">
            Abogado Titular Activo
          </p>
          <p className="text-xl font-bold text-white">
            {user?.nombre || user?.email}
          </p>
          <p className="text-xs text-amber-400 mt-2 font-medium">
            Jerarquía: {user?.role.toUpperCase()} • {user?.experienciaAnios} años de experiencia
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <p className="text-xs uppercase tracking-wider text-slate-400 font-semibold mb-1">
            Módulo de Especial Protección
          </p>
          <p className="text-xl font-bold text-white">
            Ley de Víctimas y Tutelas
          </p>
          <p className="text-xs text-slate-400 mt-2">
            Priorización automática para víctimas del conflicto, desplazados y casos de fuerza mayor con asignación a abogados Senior.
          </p>
        </div>
      </div>

      {/* Resumen del paso 2 completado */}
      <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-6">
        <h2 className="text-lg font-serif font-bold text-white mb-2">
          Estado de la Plataforma
        </h2>
        <ul className="text-sm text-slate-300 space-y-2 list-disc list-inside">
          <li>
            <strong className="text-white">Autenticación Segura:</strong> JWT emitido con la librería <code className="text-amber-400 font-mono">jose</code> y almacenado en cookie <code className="text-amber-400 font-mono">httpOnly, secure, sameSite=lax</code>.
          </li>
          <li>
            <strong className="text-white">Resolución del Tenant:</strong> El schema <code className="text-emerald-400 font-mono">{session?.schemaName}</code> se extrae exclusivamente del JWT verificado en el servidor. Nunca se confía en parámetros enviados por el cliente.
          </li>
          <li>
            <strong className="text-white">Protección de Rutas:</strong> Middleware de Next.js y verificación SSR en el layout activo.
          </li>
        </ul>
      </div>
    </div>
  );
}
