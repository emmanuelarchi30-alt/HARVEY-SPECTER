import { redirect } from "next/navigation";
import { connection } from "next/server";
import Link from "next/link";
import { getSession } from "@/lib/auth/getSession";
import { publicPrisma } from "@/lib/db/publicClient";
import { LogoutButton } from "./LogoutButton";
import { 
  Scale, 
  LayoutDashboard, 
  Users, 
  Briefcase, 
  GraduationCap, 
  BookOpen, 
  ShieldCheck 
} from "lucide-react";
import { FluidGlassBackground } from "@/components/ui/FluidGlassBackground";

export const instant = false;

export default async function PanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await connection();
  const session = await getSession();

  if (!session) {
    redirect("/login");
  }

  // Obtenemos los datos del despacho desde el schema public
  const tenant = await publicPrisma.tenant.findUnique({
    where: { id: session.tenantId },
  });

  return (
    <div className="min-h-screen text-slate-100 flex flex-col font-sans relative">
      <FluidGlassBackground />

      {/* Barra de navegación superior Fluid Glass */}
      <header className="border-b border-white/[0.08] fluid-glass sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <Link href="/panel/dashboard" className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-500/20 to-amber-600/10 border border-amber-500/40 text-amber-400 flex items-center justify-center shadow-lg shadow-amber-950/40">
                <Scale className="w-5 h-5 text-amber-400" />
              </div>
              <div>
                <span className="font-serif font-bold text-white tracking-tight block text-sm leading-tight">
                  {tenant?.name || "Specter & Asociados"}
                </span>
                <span className="text-[10px] text-amber-400/90 font-semibold uppercase tracking-wider block">
                  Firma Jurídica Colombiana
                </span>
              </div>
            </Link>

            <nav className="hidden md:flex items-center space-x-1 pl-4 border-l border-white/10 text-xs font-medium">
              <Link
                href="/panel/dashboard"
                className="text-slate-300 hover:text-white px-3 py-2 rounded-lg hover:bg-white/[0.04] transition flex items-center space-x-1.5"
              >
                <LayoutDashboard className="w-3.5 h-3.5 text-slate-400" />
                <span>Dashboard</span>
              </Link>
              <Link
                href="/panel/clientes"
                className="text-slate-400 hover:text-white px-3 py-2 rounded-lg hover:bg-white/[0.04] transition flex items-center space-x-1.5"
              >
                <Users className="w-3.5 h-3.5 text-slate-400" />
                <span>Clientes</span>
              </Link>
              <Link
                href="/panel/casos"
                className="text-slate-400 hover:text-white px-3 py-2 rounded-lg hover:bg-white/[0.04] transition flex items-center space-x-1.5"
              >
                <Briefcase className="w-3.5 h-3.5 text-slate-400" />
                <span>Expedientes</span>
              </Link>
              <Link
                href="/panel/abogados"
                className="text-slate-400 hover:text-white px-3 py-2 rounded-lg hover:bg-white/[0.04] transition flex items-center space-x-1.5"
              >
                <GraduationCap className="w-3.5 h-3.5 text-amber-400" />
                <span>Equipo Jurídico</span>
              </Link>
              <Link
                href="/constitucion"
                target="_blank"
                className="text-amber-400 hover:text-amber-300 px-3 py-2 rounded-lg hover:bg-amber-500/10 transition flex items-center space-x-1.5"
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Constitución 1991</span>
              </Link>
            </nav>
          </div>

          <div className="flex items-center space-x-4">
            {/* Indicador de Reserva Legal & Secreto Profesional */}
            <div className="hidden lg:flex items-center space-x-2 px-3 py-1 rounded-full fluid-glass-pill text-emerald-400 text-xs">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Reserva Legal & Secreto Profesional</span>
            </div>

            {/* Perfil del Abogado */}
            <div className="text-right hidden sm:block">
              <p className="text-xs font-semibold text-white leading-tight">
                {session.nombre || session.email}
              </p>
              <p className="text-[10px] text-amber-400 uppercase tracking-wider font-semibold">
                {session.role === "socio"
                  ? "Socio Director Titular"
                  : session.role === "senior"
                  ? "Abogado Senior de Litigio"
                  : session.role === "junior"
                  ? "Abogado Asociado"
                  : "Administrador de Firma"}
              </p>
            </div>

            <LogoutButton />
          </div>
        </div>
      </header>

      {/* Contenido principal de la página */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>

      <footer className="border-t border-white/[0.08] fluid-glass py-4 text-center text-xs text-slate-500">
        Specter & Asociados • Sistema de Gestión Jurídica y Tutelas Constitucionales • República de Colombia
      </footer>
    </div>
  );
}
