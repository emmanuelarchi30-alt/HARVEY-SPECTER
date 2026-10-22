import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Navbar público */}
      <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="w-8 h-8 rounded bg-amber-500/20 border border-amber-500/40 text-amber-400 font-serif font-bold flex items-center justify-center text-lg">
              §
            </span>
            <span className="font-serif font-bold text-lg text-white tracking-tight">
              Specter & Asociados
            </span>
            <span className="hidden sm:inline-block ml-2 px-2 py-0.5 rounded text-[10px] font-semibold uppercase bg-amber-500/10 text-amber-400 border border-amber-500/30">
              Colombia
            </span>
          </div>

          <div className="flex items-center space-x-3">
            <Link
              href="/registro-cliente"
              className="text-xs sm:text-sm font-medium px-3.5 py-1.5 rounded-lg bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 hover:bg-emerald-900/80 transition flex items-center space-x-1"
            >
              <span>⚖️</span>
              <span>Radicar Caso / Clientes</span>
            </Link>
            <Link
              href="/login"
              className="text-xs sm:text-sm font-medium px-4 py-2 rounded-lg text-slate-300 hover:text-white transition"
            >
              Iniciar Sesión
            </Link>
            <Link
              href="/register"
              className="text-xs sm:text-sm font-medium px-4 py-2 rounded-lg bg-amber-600 hover:bg-amber-500 text-white transition shadow-lg shadow-amber-900/20"
            >
              Registrar Despacho
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col justify-center items-center px-4 py-16 sm:py-24 text-center max-w-4xl mx-auto">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-slate-400 text-xs mb-8">
          <span className="w-2 h-2 rounded-full bg-amber-400"></span>
          <span>Plataforma SaaS Multitenant para Firmas de Abogados</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-serif font-bold tracking-tight text-white mb-6 leading-tight">
          Gestión Jurídica de Élite con{" "}
          <span className="bg-gradient-to-r from-amber-400 via-amber-200 to-amber-500 bg-clip-text text-transparent">
            Aislamiento Estricto
          </span>
        </h1>

        <p className="text-lg sm:text-xl text-slate-400 max-w-2xl mb-10 leading-relaxed">
          Inspirada en los más altos estándares de litigio y adaptada al ordenamiento jurídico colombiano. Cada firma dispone de su propio schema PostgreSQL independiente, garantizando confidencialidad absoluta de expedientes, clientes y pruebas.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <Link
            href="/registro-cliente"
            className="px-8 py-3.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-base transition shadow-xl shadow-emerald-950/40 text-center"
          >
            ⚖️ Soy Cliente: Radicar Caso / Asesoría
          </Link>
          <Link
            href="/register"
            className="px-8 py-3.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-white font-medium text-base transition shadow-xl shadow-amber-900/30 text-center"
          >
            Constituir Firma Legal
          </Link>
          <Link
            href="/login"
            className="px-8 py-3.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white font-medium text-base transition text-center"
          >
            Acceder como Abogado
          </Link>
        </div>

        {/* Características del Dominio Colombiano & Suits */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-20 text-left w-full">
          <div className="bg-slate-900/50 border border-slate-800/80 rounded-xl p-6">
            <div className="w-10 h-10 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-lg mb-4">
              🏛️
            </div>
            <h2 className="font-serif font-bold text-white text-lg mb-2">
              Schema-per-Tenant
            </h2>
            <p className="text-sm text-slate-400">
              Cero riesgo de fuga de datos. Cada despacho opera en su propio schema aislado (<code className="text-amber-400">tenant_xxx</code>) en PostgreSQL.
            </p>
          </div>

          <div className="bg-slate-900/50 border border-slate-800/80 rounded-xl p-6">
            <div className="w-10 h-10 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-lg mb-4">
              ⚖️
            </div>
            <h2 className="font-serif font-bold text-white text-lg mb-2">
              Jerarquías & Fuerza Mayor
            </h2>
            <p className="text-sm text-slate-400">
              Asignación inteligente de expedientes. Casos complejos y de fuerza mayor son derivados prioritariamente a socios y abogados Senior.
            </p>
          </div>

          <div className="bg-slate-900/50 border border-slate-800/80 rounded-xl p-6">
            <div className="w-10 h-10 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-lg mb-4">
              🕊️
            </div>
            <h2 className="font-serif font-bold text-white text-lg mb-2">
              Especial Protección
            </h2>
            <p className="text-sm text-slate-400">
              Priorización automática para accionantes víctimas del conflicto armado, personas desplazadas y población vulnerable (Ley 1448).
            </p>
          </div>
        </div>
      </main>

      <footer className="border-t border-slate-800 py-6 text-center text-xs text-slate-500">
        Specter & Asociados • Plataforma Jurídica Multitenant • Colombia
      </footer>
    </div>
  );
}
