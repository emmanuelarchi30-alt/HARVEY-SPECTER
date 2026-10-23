import { connection } from "next/server";
import { getSession } from "@/lib/auth/getSession";
import { getTenantClient } from "@/lib/db/tenantClient";
import Link from "next/link";
import { Users, UserCheck, Plus, ShieldAlert, Scale, Phone, Mail } from "lucide-react";

export const instant = false;

export default async function ClientesPage() {
  await connection();
  const session = await getSession();

  let clientes: Array<{
    id: string;
    nombre: string;
    tipoDocumento: string;
    numeroDocumento: string;
    email: string | null;
    telefono: string | null;
    condicionEspecial: string;
    tienePrioridad: boolean;
    _count: { casos: number };
  }> = [];

  if (session) {
    try {
      const tenantPrisma = getTenantClient(session.schemaName);
      clientes = await tenantPrisma.cliente.findMany({
        orderBy: { createdAt: "desc" },
        include: {
          _count: {
            select: { casos: true },
          },
        },
      });
    } catch (e) {
      console.error("Error al cargar clientes del tenant:", e);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold uppercase tracking-wider mb-2">
            <Users className="w-3.5 h-3.5" />
            <span>Poderdantes & Representados</span>
          </div>
          <h1 className="text-3xl font-serif font-bold text-white tracking-tight">
            Directorio de Clientes y Accionantes
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Gestión jurídica con amparo de confidencialidad, reserva del sumario y secreto profesional
          </p>
        </div>

        <Link
          href="/registro-cliente"
          className="inline-flex items-center justify-center px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white text-xs font-semibold transition shadow-lg shadow-amber-950/40 space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Radicar Caso / Cliente con IA</span>
        </Link>
      </div>

      <div className="fluid-glass rounded-2xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-slate-950/80 text-xs uppercase tracking-wider text-slate-400 border-b border-white/[0.08]">
              <tr>
                <th className="px-6 py-4">Cliente / Accionante</th>
                <th className="px-6 py-4">Documento</th>
                <th className="px-6 py-4">Condición de Protección</th>
                <th className="px-6 py-4">Prioridad</th>
                <th className="px-6 py-4">Expedientes</th>
                <th className="px-6 py-4">Contacto</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.06]">
              {clientes.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-16 text-center text-slate-500">
                    <Scale className="w-10 h-10 text-slate-600 mx-auto mb-3" />
                    <p className="text-base font-serif text-slate-400 mb-1">
                      No hay clientes registrados en este despacho aún.
                    </p>
                    <p className="text-xs text-slate-500 max-w-sm mx-auto">
                      Los clientes que radiquen solicitudes dirigidas a esta firma aparecerán aquí automáticamente con su abogado asignado.
                    </p>
                  </td>
                </tr>
              ) : (
                clientes.map((c) => (
                  <tr key={c.id} className="hover:bg-white/[0.03] transition">
                    <td className="px-6 py-4 font-medium text-white">
                      {c.nombre}
                    </td>
                    <td className="px-6 py-4 font-mono text-xs text-slate-300">
                      {c.tipoDocumento} {c.numeroDocumento}
                    </td>
                    <td className="px-6 py-4">
                      {c.condicionEspecial === "victima_conflicto" ? (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-500/20 text-rose-300 border border-rose-500/40">
                          Víctima Conflicto (Ley 1448)
                        </span>
                      ) : c.condicionEspecial === "desplazado" ? (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                          Desplazamiento Forzado
                        </span>
                      ) : c.condicionEspecial === "migrante" ? (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-500/20 text-blue-300 border border-blue-500/40">
                          Población Migrante
                        </span>
                      ) : (
                        <span className="text-slate-400 capitalize">
                          {c.condicionEspecial.replace("_", " ")}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {c.tienePrioridad ? (
                        <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-500/20 text-amber-400 border border-amber-500/40">
                          ALTA PRIORIDAD
                        </span>
                      ) : (
                        <span className="text-slate-500 text-xs">Ordinaria</span>
                      )}
                    </td>
                    <td className="px-6 py-4 font-semibold text-white">
                      {c._count.casos} expediente(s)
                    </td>
                    <td className="px-6 py-4 text-xs text-slate-400 space-y-0.5">
                      {c.telefono && (
                        <div className="flex items-center space-x-1.5 text-slate-300">
                          <Phone className="w-3 h-3 text-slate-500" />
                          <span>{c.telefono}</span>
                        </div>
                      )}
                      {c.email && (
                        <div className="flex items-center space-x-1.5 text-slate-400">
                          <Mail className="w-3 h-3 text-slate-500" />
                          <span>{c.email}</span>
                        </div>
                      )}
                      {!c.telefono && !c.email && "Sin contacto registrado"}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
