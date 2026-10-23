import { connection } from "next/server";
import { getSession } from "@/lib/auth/getSession";
import { publicPrisma } from "@/lib/db/publicClient";
import { getTenantClient } from "@/lib/db/tenantClient";
import Link from "next/link";
import { Briefcase, Scale, Plus, Award, AlertCircle, Clock, UserCheck } from "lucide-react";

export const instant = false;

export default async function CasosPage() {
  await connection();
  const session = await getSession();

  let casos: Array<{
    id: string;
    numeroExpediente: string;
    titulo: string;
    descripcion: string | null;
    estado: string;
    prioridad: string;
    esFuerzaMayor: boolean;
    nivelAbogadoExigido: string;
    abogadoAsignadoId: string | null;
    fechaApertura: Date;
    cliente: {
      nombre: string;
      condicionEspecial: string;
    };
  }> = [];

  let usuariosMap = new Map<string, { nombre: string; role: string; experienciaAnios: number }>();

  if (session) {
    try {
      const [tenantUsers, tenantPrisma] = await Promise.all([
        publicPrisma.user.findMany({
          where: { tenantId: session.tenantId },
          select: { id: true, nombre: true, email: true, role: true, experienciaAnios: true },
        }),
        getTenantClient(session.schemaName),
      ]);

      tenantUsers.forEach((u) => {
        usuariosMap.set(u.id, {
          nombre: u.nombre || u.email,
          role: u.role,
          experienciaAnios: u.experienciaAnios,
        });
      });

      casos = await tenantPrisma.caso.findMany({
        orderBy: { fechaApertura: "desc" },
        include: {
          cliente: {
            select: {
              nombre: true,
              condicionEspecial: true,
            },
          },
        },
      });
    } catch (e) {
      console.error("Error al cargar casos del tenant:", e);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold uppercase tracking-wider mb-2">
            <Briefcase className="w-3.5 h-3.5" />
            <span>Expedientes & Acciones Judiciales</span>
          </div>
          <h1 className="text-3xl font-serif font-bold text-white tracking-tight">
            Expedientes y Procesos Judiciales
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Gestión litigiosa con asignación por Inteligencia Artificial y prelación constitucional
          </p>
        </div>

        <Link
          href="/registro-cliente"
          className="inline-flex items-center justify-center px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white text-xs font-semibold transition shadow-lg shadow-amber-950/40 space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Radicar Caso con Triaje IA</span>
        </Link>
      </div>

      <div className="fluid-glass rounded-2xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-slate-950/80 text-xs uppercase tracking-wider text-slate-400 border-b border-white/[0.08]">
              <tr>
                <th className="px-6 py-4">Radicado / Expediente</th>
                <th className="px-6 py-4">Asunto / Petición</th>
                <th className="px-6 py-4">Poderdante</th>
                <th className="px-6 py-4">Prioridad</th>
                <th className="px-6 py-4">Abogado Asignado (IA)</th>
                <th className="px-6 py-4">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.06]">
              {casos.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-16 text-center text-slate-500">
                    <Scale className="w-10 h-10 text-slate-600 mx-auto mb-3" />
                    <p className="text-base font-serif text-slate-400 mb-1">
                      No hay expedientes activos en este despacho aún.
                    </p>
                    <p className="text-xs text-slate-500 max-w-sm mx-auto">
                      Los casos radicados desde el portal ciudadano dirigidos a esta firma se registrarán aquí automáticamente.
                    </p>
                  </td>
                </tr>
              ) : (
                casos.map((caso) => {
                  const abogado = caso.abogadoAsignadoId ? usuariosMap.get(caso.abogadoAsignadoId) : null;
                  const esSenior = caso.nivelAbogadoExigido === "senior" || (abogado && abogado.experienciaAnios >= 8);

                  return (
                    <tr key={caso.id} className="hover:bg-white/[0.03] transition">
                      <td className="px-6 py-4 font-mono font-bold text-amber-400 text-xs">
                        {caso.numeroExpediente}
                      </td>
                      <td className="px-6 py-4 max-w-xs">
                        <p className="font-medium text-white line-clamp-1">{caso.titulo}</p>
                        {caso.esFuerzaMayor && (
                          <span className="inline-flex items-center gap-1 mt-1 text-[10px] font-bold uppercase tracking-wider text-rose-300 bg-rose-950/60 border border-rose-800/60 px-2 py-0.5 rounded-full">
                            <AlertCircle className="w-3 h-3 text-rose-400" />
                            <span>Fuerza Mayor / Urgente</span>
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-white text-xs font-medium">{caso.cliente.nombre}</p>
                        <p className="text-[10px] text-slate-400 capitalize">
                          {caso.cliente.condicionEspecial.replace("_", " ")}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase ${
                            caso.prioridad === "urgente"
                              ? "bg-rose-500/20 text-rose-300 border border-rose-500/40"
                              : caso.prioridad === "alta"
                              ? "bg-amber-500/20 text-amber-300 border border-amber-500/40"
                              : "bg-slate-800 text-slate-300"
                          }`}
                        >
                          {caso.prioridad}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-xs">
                        {abogado ? (
                          <div>
                            <p className="font-semibold text-white flex items-center gap-1.5">
                              <UserCheck className="w-3.5 h-3.5 text-amber-400" />
                              <span>{abogado.nombre}</span>
                            </p>
                            <span className="text-[10px] text-amber-400/90 font-medium">
                              {esSenior ? "Abogado Mayor (Socio/Senior)" : "Abogado Menor (Asociado)"}
                            </span>
                          </div>
                        ) : (
                          <span className="text-slate-400 font-mono text-[11px]">
                            {esSenior ? "Abogado Mayor Titular" : "Abogado Menor (Asociado)"}
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-2.5 py-1 rounded-full text-xs capitalize bg-white/[0.05] border border-white/10 text-slate-300">
                          {caso.estado.replace("_", " ")}
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
