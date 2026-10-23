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
import ProfileCard from "@/components/ui/ProfileCard";

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

  const FOTOS_MAP: Record<string, { avatarUrl: string; handle: string; backdropColor: string }> = {
    harvey: {
      avatarUrl: "https://static.wikia.nocookie.net/suits/images/d/da/S8_Harvey_Specter.jpg/revision/latest?cb=20180731195449",
      handle: "harveyspecter",
      backdropColor: "#1e1b4b"
    },
    jessica: {
      avatarUrl: "https://static.wikia.nocookie.net/suits/images/c/c4/Jessica_Pearson_%28Pearson%29.jpg/revision/latest?cb=20190902222249",
      handle: "jessicapearson",
      backdropColor: "#3b0764"
    },
    mike: {
      avatarUrl: "https://static.wikia.nocookie.net/suits/images/c/c2/Mike_Ross_%285x7%29.png/revision/latest?cb=20190903001426",
      handle: "mikeross",
      backdropColor: "#0f172a"
    },
    louis: {
      avatarUrl: "https://static.wikia.nocookie.net/suits/images/f/f1/S8_Louis_Litt.jpg/revision/latest?cb=20180731195639",
      handle: "louislitt",
      backdropColor: "#1c1917"
    },
    donna: {
      avatarUrl: "https://static.wikia.nocookie.net/suits/images/9/97/S8_Donna_Paulsen.jpg/revision/latest?cb=20180731195347",
      handle: "donnapaulsen",
      backdropColor: "#2e1065"
    },
    rachel: {
      avatarUrl: "https://static.wikia.nocookie.net/suits/images/9/92/Meghan_Markle_as_Rachel_Zane.png/revision/latest?cb=20191003130401",
      handle: "rachelzane",
      backdropColor: "#14532d"
    }
  };

  const EQUIPO_SPECTER_DEFAULT = [
    {
      id: "harvey-specter-01",
      nombre: "Harvey Specter",
      email: "harvey.specter@specterlaw.co",
      role: "socio",
      experienciaAnios: 15,
      casosAsignadosCount: 12,
      avatarUrl: "https://static.wikia.nocookie.net/suits/images/d/da/S8_Harvey_Specter.jpg/revision/latest?cb=20180731195449",
      handle: "harveyspecter",
      status: "En Audiencia Tribunal",
      statusColor: "#22c55e",
      backdropColor: "#1e1b4b"
    },
    {
      id: "jessica-pearson-02",
      nombre: "Jessica Pearson",
      email: "jessica.pearson@specterlaw.co",
      role: "socio",
      experienciaAnios: 20,
      casosAsignadosCount: 8,
      avatarUrl: "https://static.wikia.nocookie.net/suits/images/c/c4/Jessica_Pearson_%28Pearson%29.jpg/revision/latest?cb=20190902222249",
      handle: "jessicapearson",
      status: "Gabinete Directivo",
      statusColor: "#f59e0b",
      backdropColor: "#3b0764"
    },
    {
      id: "mike-ross-03",
      nombre: "Mike Ross",
      email: "mike.ross@specterlaw.co",
      role: "senior",
      experienciaAnios: 8,
      casosAsignadosCount: 19,
      avatarUrl: "https://static.wikia.nocookie.net/suits/images/c/c2/Mike_Ross_%285x7%29.png/revision/latest?cb=20190903001426",
      handle: "mikeross",
      status: "Fast Track (<12h)",
      statusColor: "#38bdf8",
      backdropColor: "#0f172a"
    },
    {
      id: "louis-litt-04",
      nombre: "Louis Litt",
      email: "louis.litt@specterlaw.co",
      role: "socio",
      experienciaAnios: 14,
      casosAsignadosCount: 15,
      avatarUrl: "https://static.wikia.nocookie.net/suits/images/f/f1/S8_Louis_Litt.jpg/revision/latest?cb=20180731195639",
      handle: "louislitt",
      status: "Revisión Financiera",
      statusColor: "#eab308",
      backdropColor: "#1c1917"
    },
    {
      id: "donna-paulsen-05",
      nombre: "Donna Paulsen",
      email: "donna.paulsen@specterlaw.co",
      role: "socio",
      experienciaAnios: 12,
      casosAsignadosCount: 22,
      avatarUrl: "https://static.wikia.nocookie.net/suits/images/9/97/S8_Donna_Paulsen.jpg/revision/latest?cb=20180731195347",
      handle: "donnapaulsen",
      status: "Operaciones & Triage",
      statusColor: "#ec4899",
      backdropColor: "#2e1065"
    },
    {
      id: "rachel-zane-06",
      nombre: "Rachel Zane",
      email: "rachel.zane@specterlaw.co",
      role: "asociado",
      experienciaAnios: 6,
      casosAsignadosCount: 11,
      avatarUrl: "https://static.wikia.nocookie.net/suits/images/9/92/Meghan_Markle_as_Rachel_Zane.png/revision/latest?cb=20191003130401",
      handle: "rachelzane",
      status: "Víctimas Ley 1448",
      statusColor: "#10b981",
      backdropColor: "#14532d"
    }
  ];

  const listaFinal = abogados.length > 0
    ? abogados.map((a) => {
        const k = (a.nombre || "").toLowerCase();
        const matched = Object.entries(FOTOS_MAP).find(([key]) => k.includes(key))?.[1] || {
          avatarUrl: "https://static.wikia.nocookie.net/suits/images/d/da/S8_Harvey_Specter.jpg/revision/latest?cb=20180731195449",
          handle: (a.nombre || "abogado").toLowerCase().replace(/[^a-z0-9]/g, ""),
          backdropColor: "#1e1b4b"
        };
        const esMayor = a.role === "socio" || a.role === "senior" || a.experienciaAnios >= 8;
        return {
          id: a.id,
          nombre: a.nombre || a.email,
          title: esMayor ? "Abogado Mayor • Socio Titular" : "Abogado Menor • Asociado",
          handle: matched.handle,
          status: `${a.casosAsignadosCount} caso(s) en curso`,
          statusColor: esMayor ? "#f59e0b" : "#38bdf8",
          avatarUrl: matched.avatarUrl,
          backdropColor: matched.backdropColor,
          holo: esMayor ? 0.9 : 0.75
        };
      })
    : EQUIPO_SPECTER_DEFAULT.map((a) => ({
        id: a.id,
        nombre: a.nombre,
        title: a.role === "socio" ? "Abogado Mayor • Socio Titular" : "Abogado Senior • Litigio Especial",
        handle: a.handle,
        status: a.status,
        statusColor: a.statusColor,
        avatarUrl: a.avatarUrl,
        backdropColor: a.backdropColor,
        holo: 0.85
      }));

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

      {/* Credenciales 3D Holográficas con ProfileCard de React Bits */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-serif font-bold text-white">
            Credenciales de Litigantes en Sala de Audiencias
          </h2>
          <span className="text-xs text-amber-400 font-mono">
            {listaFinal.length} Litigantes Acreditados
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center">
          {listaFinal.map((abg) => (
            <ProfileCard
              key={abg.id}
              name={abg.nombre}
              title={abg.title}
              handle={abg.handle}
              status={abg.status}
              statusColor={abg.statusColor}
              contactText="Ver Expedientes"
              avatarUrl={abg.avatarUrl}
              miniAvatarUrl={abg.avatarUrl}
              backdropColor={abg.backdropColor}
              holo={abg.holo}
              glare={0.6}
              tiltStrength={14}
              parallax={8}
              theme="dark"
            />
          ))}
        </div>
      </div>
    </div>
  );
}
