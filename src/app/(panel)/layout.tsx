import { redirect } from "next/navigation";
import { connection } from "next/server";
import Link from "next/link";
import { getSession } from "@/lib/auth/getSession";
import { publicPrisma } from "@/lib/db/publicClient";
import { LogoutButton } from "./LogoutButton";

export const instant = false;

export default async function PanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await connection();
  // Verificación SSR obligatoria: Si no hay token válido en la cookie, no se renderiza el layout
  const session = await getSession();

  if (!session) {
    redirect("/login");
  }

  // Obtenemos los datos del despacho desde el schema public
  const tenant = await publicPrisma.tenant.findUnique({
    where: { id: session.tenantId },
  });

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Barra de navegación superior */}
      <header className="border-b border-slate-800 bg-slate-900/90 backdrop-blur sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <Link href="/panel/dashboard" className="flex items-center space-x-2">
              <span className="w-8 h-8 rounded bg-amber-500/20 border border-amber-500/40 text-amber-400 font-serif font-bold flex items-center justify-center text-lg">
                §
              </span>
              <div>
                <span className="font-serif font-bold text-white tracking-tight block text-sm leading-tight">
                  {tenant?.name || "Specter & Asociados"}
                </span>
                <span className="text-[10px] text-slate-400 uppercase tracking-wider block">
                  Firma Jurídica • Colombia
                </span>
              </div>
            </Link>

            <nav className="hidden md:flex items-center space-x-4 pl-4 border-l border-slate-800 text-sm">
              <Link
                href="/panel/dashboard"
                className="text-slate-300 hover:text-white px-2 py-1 transition"
              >
                Dashboard
              </Link>
              <Link
                href="/panel/clientes"
                className="text-slate-400 hover:text-white px-2 py-1 transition"
              >
                Clientes
              </Link>
              <Link
                href="/panel/casos"
                className="text-slate-400 hover:text-white px-2 py-1 transition"
              >
                Expedientes
              </Link>
            </nav>
          </div>

          <div className="flex items-center space-x-4">
            {/* Indicador de Aislamiento de Schema en PostgreSQL */}
            <div className="hidden sm:flex items-center space-x-2 px-2.5 py-1 rounded bg-slate-950 border border-emerald-500/30 text-emerald-400 text-xs font-mono">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>Schema: {session.schemaName}</span>
            </div>

            {/* Perfil del Abogado */}
            <div className="text-right hidden sm:block">
              <p className="text-xs font-medium text-white leading-tight">
                {session.nombre || session.email}
              </p>
              <p className="text-[10px] text-amber-400 uppercase tracking-wider font-semibold">
                {session.role === "socio"
                  ? "Socio Director"
                  : session.role === "senior"
                  ? "Abogado Senior"
                  : session.role === "junior"
                  ? "Abogado Asociado"
                  : "Administrador"}
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

      <footer className="border-t border-slate-800/80 py-4 text-center text-xs text-slate-500">
        Specter & Asociados SaaS • Multitenancy con PostgreSQL Schema-per-Tenant y JWT HttpOnly
      </footer>
    </div>
  );
}
