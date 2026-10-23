import { connection } from "next/server";
import { getSession } from "@/lib/auth/getSession";
import { publicPrisma } from "@/lib/db/publicClient";
import { getTenantClient } from "@/lib/db/tenantClient";
import Link from "next/link";
import {
  Award,
  Scale,
  Briefcase,
  ShieldCheck,
  Mail,
  GraduationCap,
  Users,
  Sparkles,
  CheckCircle2,
  BookOpen
} from "lucide-react";

export const instant = false;

export default async function AbogadosPage() {
  await connection();
  const session = await getSession();

  let abogados: Array<{
    id: string;
    nombre: string | null;
    email: string;
    role: string;
    experienciaAnios: number;
    casosAsignadosCount: number;
  }> = [];

  let despachoNombre = "Specter & Asociados";

  if (session) {
    try {
      const tenant = await publicPrisma.tenant.findUnique({
        where: { id: session.tenantId },
        include: {
          users: {
            orderBy: { experienciaAnios: "desc" },
          },
        },
      });

      if (tenant) {
        despachoNombre = tenant.name;
        const tenantPrisma = getTenantClient(session.schemaName);

        // Contar casos asignados por abogado
        const conteos = await Promise.all(
          tenant.users.map(async (u) => {
            const count = await tenantPrisma.caso.count({
              where: { abogadoAsignadoId: u.id },
            });
            return { userId: u.id, count };
          })
        );

        const mapaConteos = new Map(conteos.map((c) => [c.userId, c.count]));

        abogados = tenant.users.map((u) => ({
          id: u.id,
          nombre: u.nombre,
          email: u.email,
          role: u.role,
          experienciaAnios: u.experienciaAnios,
          casosAsignadosCount: mapaConteos.get(u.id) || 0,
        }));
      }
    } catch (e) {
      console.error("Error al cargar abogados del despacho:", e);
    }
  }

  return (
    <div className="space-y-8">
      {/* Encabezado */}
      <div className="fluid-glass rounded-2xl p-6 sm:p-8 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold uppercase tracking-wider mb-2">
              <Users className="w-3.5 h-3.5" />
              <span>Cuerpo de Litigantes y Socios</span>
            </div>
            <h1 className="text-3xl font-serif font-bold text-white tracking-tight">
              Equipo Jurídico y Jerarquías de Litigio
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              Directorio de juristas de <strong>{despachoNombre}</strong> vinculados a las reglas de reparto y asignación automática por Inteligencia Artificial.
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <Link
              href="/panel/casos"
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold transition"
            >
              Ver Casos Asignados
            </Link>
            <Link
              href="/constitucion"
              target="_blank"
              className="px-4 py-2 border border-amber-500/40 bg-amber-500/10 text-amber-400 hover:bg-amber-500/20 rounded-xl text-xs font-semibold transition flex items-center space-x-1.5"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Constitución 1991</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Regla de Asignación por Inteligencia Artificial */}
      <div className="fluid-glass rounded-2xl p-6 border-amber-500/30 space-y-4">
        <div className="flex items-center space-x-2.5 text-amber-400">
          <Sparkles className="w-5 h-5 text-amber-400" />
          <h2 className="font-serif font-bold text-white text-lg">
            Criterios de Asignación Institucional (IA)
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-300">
          <div className="p-4 rounded-xl bg-slate-950/60 border border-white/[0.06] space-y-2">
            <div className="flex items-center space-x-2 text-rose-300 font-bold">
              <Award className="w-4 h-4 text-rose-400" />
              <span>Abogados Mayores (Socios Titulares / Seniors)</span>
            </div>
            <p className="leading-relaxed">
              Asignación forzosa en casos de <strong>Víctimas del Conflicto Armado (Ley 1448)</strong>, personas en <strong>Desplazamiento Forzado (Sentencia T-025)</strong> y acciones con <strong>Fuerza Mayor o Riesgo Vital</strong>. Exige más de 8 años de experiencia litigiosa para estructuración de medidas cautelares y tutelas ante la Corte Constitucional.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/60 border border-white/[0.06] space-y-2">
            <div className="flex items-center space-x-2 text-blue-300 font-bold">
              <Briefcase className="w-4 h-4 text-blue-400" />
              <span>Abogados Menores (Asociados / Juniors)</span>
            </div>
            <p className="leading-relaxed">
              Asignación en <strong>Trámites Ordinarios</strong> y solicitudes generales sin riesgo manifiesto. Garantizan el principio de celeridad procesal (Art. 209 C.P.) bajo la supervisión y control del socio director de la firma.
            </p>
          </div>
        </div>
      </div>

      {/* Tarjetas de Abogados */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {abogados.map((abg) => {
          const esMayor = abg.role === "socio" || abg.role === "senior" || abg.experienciaAnios >= 8;

          return (
            <div
              key={abg.id}
              className={`fluid-glass rounded-2xl p-6 space-y-5 transition-all duration-300 ${
                esMayor ? "border-amber-500/30" : "border-white/10"
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 border border-white/10 flex items-center justify-center text-amber-400 shadow-lg">
                  <Scale className="w-6 h-6 text-amber-400" />
                </div>

                <span
                  className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${
                    esMayor
                      ? "bg-amber-500/20 text-amber-300 border border-amber-500/40"
                      : "bg-blue-500/20 text-blue-300 border border-blue-500/40"
                  }`}
                >
                  {esMayor ? "Abogado Mayor" : "Abogado Menor"}
                </span>
              </div>

              <div>
                <h3 className="text-xl font-serif font-bold text-white tracking-tight">
                  {abg.nombre || abg.email}
                </h3>
                <p className="text-xs text-amber-400/90 font-medium capitalize mt-0.5">
                  {abg.role === "socio"
                    ? "Socio Director Titular"
                    : abg.role === "senior"
                    ? "Abogado Senior de Litigio"
                    : "Abogado Asociado / Menor"}
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950/70 border border-white/[0.06] space-y-2 text-xs">
                <div className="flex items-center justify-between text-slate-300">
                  <span className="flex items-center gap-1.5 text-slate-400">
                    <GraduationCap className="w-3.5 h-3.5 text-slate-500" />
                    Experiencia:
                  </span>
                  <strong className="text-white font-mono">{abg.experienciaAnios} años</strong>
                </div>

                <div className="flex items-center justify-between text-slate-300">
                  <span className="flex items-center gap-1.5 text-slate-400">
                    <Briefcase className="w-3.5 h-3.5 text-slate-500" />
                    Casos asignados:
                  </span>
                  <strong className="text-emerald-400 font-mono font-bold">
                    {abg.casosAsignadosCount} expediente(s)
                  </strong>
                </div>

                <div className="flex items-center justify-between text-slate-300 pt-1 border-t border-white/[0.05]">
                  <span className="flex items-center gap-1.5 text-slate-400">
                    <Mail className="w-3.5 h-3.5 text-slate-500" />
                    Contacto:
                  </span>
                  <span className="text-[11px] text-slate-400 font-mono truncate max-w-[160px]">
                    {abg.email}
                  </span>
                </div>
              </div>

              <div className="pt-1">
                <span className="inline-flex items-center gap-1.5 text-[11px] text-emerald-400 font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Habilitado para Reparto Procesal</span>
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
