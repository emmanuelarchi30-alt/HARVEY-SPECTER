"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Scale, Search, Lock, Mail, ArrowLeft, ShieldCheck, AlertCircle, Eye, EyeOff, Sparkles, UserCheck } from "lucide-react";
import { FluidGlassBackground } from "@/components/ui/FluidGlassBackground";
import { HeaderControls } from "@/components/ui/HeaderControls";
import { SpecularButton } from "@/components/ui/SpecularButton";
import { useTheme } from "@/context/ThemeContext";

export default function LoginPage() {
  const router = useRouter();
  const { theme } = useTheme();
  const isLight = theme === "light";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Error al iniciar sesión");
      }

      router.push("/panel/dashboard");
      router.refresh();
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Ocurrió un error inesperado al iniciar sesión");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <main
      className={`min-h-screen flex flex-col justify-center items-center px-4 py-12 relative transition-colors duration-300 ${
        isLight ? "text-slate-800" : "text-slate-100"
      }`}
    >
      <FluidGlassBackground />

      {/* Control flotante superior */}
      <div className="absolute top-5 right-5 z-50">
        <HeaderControls />
      </div>

      <div className="w-full max-w-md space-y-6 relative z-10">
        {/* Banner para Clientes / Accionantes */}
        <div
          className={`fluid-glass rounded-2xl p-5 border text-center space-y-2.5 shadow-xl ${
            isLight ? "border-amber-300 bg-amber-50/80 text-slate-900" : "border-amber-500/40"
          }`}
        >
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-800 dark:text-amber-400 text-xs font-bold uppercase tracking-wider">
            <Search className="w-3.5 h-3.5 text-amber-600 dark:text-amber-500" />
            <span>¿Eres Cliente o Accionante?</span>
          </div>
          <p className={`text-xs ${isLight ? "text-slate-800 font-medium" : "text-slate-300"}`}>
            Si radicaste una solicitud o tutela, no requieres contraseña de abogado. Consulta tu expediente directamente con tu radicado oficial y cédula.
          </p>
          <div className="flex justify-center pt-1">
            <SpecularButton
              href="/consultar-caso"
              size="sm"
              radius={14}
              tint={isLight ? "#f59e0b" : "#ffffff"}
              tintOpacity={isLight ? 0.16 : 0.08}
              textColor={isLight ? "#78350f" : "#fef3c7"}
              lineColor={isLight ? "#d97706" : "#f59e0b"}
              baseColor={isLight ? "#fef3c7" : "#525252"}
              intensity={1.1}
              idleIntensity={0.35}
              followMouse
              className="w-full"
            >
              <Search className="w-4 h-4 text-amber-600 dark:text-amber-500" />
              <span>Consultar Estado de mi Caso / Petición</span>
            </SpecularButton>
          </div>
        </div>

        {/* Formulario de Acceso para Abogados */}
        <div className="fluid-glass rounded-[28px] p-8 sm:p-10 shadow-2xl space-y-6">
          <div className="text-center space-y-2">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500/20 to-amber-600/10 border border-amber-500/40 text-amber-600 dark:text-amber-500 mb-2 shadow-lg shadow-amber-950/20">
              <Scale className="w-6 h-6 text-amber-600 dark:text-amber-500" />
            </div>
            <h1
              className={`text-2xl font-serif font-bold tracking-tight ${
                isLight ? "text-slate-950" : "text-white"
              }`}
            >
              Acceso a la Firma Jurídica
            </h1>
            <p className={`text-xs ${isLight ? "text-slate-700 font-medium" : "text-slate-400"}`}>
              Portal exclusivo para Abogados Litigantes y Socios
            </p>
          </div>

          {error && (
            <div className="p-4 rounded-xl bg-rose-950/40 border border-rose-800/60 text-rose-300 text-xs flex items-start space-x-2.5">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className={`block text-xs font-bold uppercase tracking-wider mb-1.5 ${
                  isLight ? "text-slate-900" : "text-slate-300"
                }`}
              >
                Correo Institucional o Cédula
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
                <input
                  id="email"
                  type="text"
                  autoComplete="username"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="harvey@specterlaw.co o Cédula (ej. 80192834)"
                  className="w-full pl-10 pr-4 py-2.5 ios-input text-sm"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label
                  htmlFor="password"
                  className={`block text-xs font-bold uppercase tracking-wider ${
                    isLight ? "text-slate-900" : "text-slate-300"
                  }`}
                >
                  Contraseña de Acceso
                </label>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className={`text-[11px] font-semibold flex items-center space-x-1 ${isLight ? "text-amber-700 hover:text-amber-800" : "text-amber-400 hover:text-amber-300"}`}
                >
                  {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  <span>{showPassword ? "Ocultar" : "Mostrar"}</span>
                </button>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-2.5 ios-input text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-slate-400 hover:text-slate-200"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="pt-2 flex justify-center">
              <SpecularButton
                type="submit"
                disabled={loading}
                size="md"
                radius={16}
                tint={isLight ? "#f59e0b" : "#ffffff"}
                tintOpacity={isLight ? 0.2 : 0.08}
                textColor={isLight ? "#78350f" : "#fef3c7"}
                lineColor={isLight ? "#d97706" : "#f59e0b"}
                baseColor={isLight ? "#fef3c7" : "#525252"}
                intensity={1.25}
                idleIntensity={0.4}
                shineSize={12}
                shineFade={36}
                thickness={1.4}
                glow={1.2}
                followMouse
                proximity={250}
                className="w-full"
              >
                <Scale className="w-4 h-4 text-amber-500" />
                <span>{loading ? "Verificando credenciales..." : "Ingresar al Despacho"}</span>
              </SpecularButton>
            </div>
          </form>

          {/* Cuentas de Acceso Rápido / Demo Partners */}
          <div className="pt-2 border-t border-white/[0.08] space-y-2.5">
            <div className={`flex items-center space-x-1.5 text-[11px] font-bold uppercase tracking-wider ${isLight ? "text-amber-800" : "text-amber-400"}`}>
              <Sparkles className="w-3.5 h-3.5" />
              <span>Cuentas de Acceso Rápido (1-Clic)</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-left">
              <button
                type="button"
                onClick={() => {
                  setEmail("harvey@specterlaw.co");
                  setPassword("Harvey2026*");
                  setError(null);
                }}
                className={`p-2.5 rounded-xl border text-left transition ${
                  isLight
                    ? "bg-white hover:bg-amber-50/90 border-slate-300 hover:border-amber-500 shadow-sm"
                    : "bg-white/[0.04] hover:bg-white/[0.08] border-white/[0.08] hover:border-amber-500/40"
                }`}
              >
                <div className={`text-xs font-bold ${isLight ? "text-amber-800" : "text-amber-400"}`}>Harvey Specter</div>
                <div className={`text-[10px] font-medium truncate ${isLight ? "text-slate-700" : "text-slate-400"}`}>harvey@specterlaw.co</div>
                <div className={`text-[10px] font-mono font-semibold ${isLight ? "text-emerald-700" : "text-emerald-400"}`}>Harvey2026*</div>
              </button>

              <button
                type="button"
                onClick={() => {
                  setEmail("jessica@specterlaw.co");
                  setPassword("Jessica2026*");
                  setError(null);
                }}
                className={`p-2.5 rounded-xl border text-left transition ${
                  isLight
                    ? "bg-white hover:bg-amber-50/90 border-slate-300 hover:border-amber-500 shadow-sm"
                    : "bg-white/[0.04] hover:bg-white/[0.08] border-white/[0.08] hover:border-amber-500/40"
                }`}
              >
                <div className={`text-xs font-bold ${isLight ? "text-amber-800" : "text-amber-400"}`}>Jessica Pearson</div>
                <div className={`text-[10px] font-medium truncate ${isLight ? "text-slate-700" : "text-slate-400"}`}>C.C. 52893120</div>
                <div className={`text-[10px] font-mono font-semibold ${isLight ? "text-emerald-700" : "text-emerald-400"}`}>Jessica2026*</div>
              </button>

              <button
                type="button"
                onClick={() => {
                  setEmail("mike@specterlaw.co");
                  setPassword("MikeRoss2026*");
                  setError(null);
                }}
                className={`p-2.5 rounded-xl border text-left transition ${
                  isLight
                    ? "bg-white hover:bg-amber-50/90 border-slate-300 hover:border-amber-500 shadow-sm"
                    : "bg-white/[0.04] hover:bg-white/[0.08] border-white/[0.08] hover:border-amber-500/40"
                }`}
              >
                <div className={`text-xs font-bold ${isLight ? "text-amber-800" : "text-amber-400"}`}>Mike Ross</div>
                <div className={`text-[10px] font-medium truncate ${isLight ? "text-slate-700" : "text-slate-400"}`}>mike@specterlaw.co</div>
                <div className={`text-[10px] font-mono font-semibold ${isLight ? "text-emerald-700" : "text-emerald-400"}`}>MikeRoss2026*</div>
              </button>

              <button
                type="button"
                onClick={() => {
                  setEmail("rachel@specterlaw.co");
                  setPassword("Rachel2026*");
                  setError(null);
                }}
                className={`p-2.5 rounded-xl border text-left transition ${
                  isLight
                    ? "bg-white hover:bg-amber-50/90 border-slate-300 hover:border-amber-500 shadow-sm"
                    : "bg-white/[0.04] hover:bg-white/[0.08] border-white/[0.08] hover:border-amber-500/40"
                }`}
              >
                <div className={`text-xs font-bold ${isLight ? "text-amber-800" : "text-amber-400"}`}>Rachel Zane</div>
                <div className={`text-[10px] font-medium truncate ${isLight ? "text-slate-700" : "text-slate-400"}`}>rachel@specterlaw.co</div>
                <div className={`text-[10px] font-mono font-semibold ${isLight ? "text-emerald-700" : "text-emerald-400"}`}>Rachel2026*</div>
              </button>
            </div>
          </div>

          <div className="pt-4 border-t border-white/[0.08] text-center space-y-2">
            <p className={`text-xs ${isLight ? "text-slate-800 font-medium" : "text-slate-400"}`}>
              ¿Deseas constituir una nueva firma legal?{" "}
              <Link
                href="/register"
                className={`${isLight ? "text-amber-800 hover:text-amber-900" : "text-amber-400 hover:text-amber-300"} font-bold transition`}
              >
                Registrar Despacho
              </Link>
            </p>
            <div>
              <Link
                href="/"
                className={`inline-flex items-center space-x-1 text-xs transition ${
                  isLight ? "text-slate-700 hover:text-slate-950 font-medium" : "text-slate-400 hover:text-slate-200"
                }`}
              >
                <ArrowLeft className="w-3 h-3" />
                <span>Volver al inicio</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
