"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Scale, Search, Lock, Mail, ArrowLeft, ShieldCheck, AlertCircle } from "lucide-react";
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
            isLight ? "border-amber-400 bg-amber-50/60" : "border-amber-500/40"
          }`}
        >
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-600 dark:text-amber-400 text-xs font-semibold uppercase tracking-wider">
            <Search className="w-3.5 h-3.5 text-amber-500" />
            <span>¿Eres Cliente o Accionante?</span>
          </div>
          <p className={`text-xs ${isLight ? "text-slate-600" : "text-slate-300"}`}>
            Si radicaste una solicitud o tutela, no requieres contraseña de abogado. Consulta tu expediente directamente con tu radicado oficial y cédula.
          </p>
          <div className="flex justify-center pt-1">
            <SpecularButton
              href="/consultar-caso"
              size="sm"
              radius={14}
              tint={isLight ? "#f59e0b" : "#ffffff"}
              tintOpacity={isLight ? 0.16 : 0.08}
              textColor={isLight ? "#92400e" : "#fef3c7"}
              lineColor={isLight ? "#d97706" : "#f59e0b"}
              baseColor={isLight ? "#fef3c7" : "#525252"}
              intensity={1.1}
              idleIntensity={0.35}
              followMouse
              className="w-full"
            >
              <Search className="w-4 h-4 text-amber-500" />
              <span>Consultar Estado de mi Caso / Petición</span>
            </SpecularButton>
          </div>
        </div>

        {/* Formulario de Acceso para Abogados */}
        <div className="fluid-glass rounded-[28px] p-8 sm:p-10 shadow-2xl space-y-6">
          <div className="text-center space-y-2">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500/20 to-amber-600/10 border border-amber-500/40 text-amber-500 mb-2 shadow-lg shadow-amber-950/20">
              <Scale className="w-6 h-6 text-amber-500" />
            </div>
            <h1
              className={`text-2xl font-serif font-bold tracking-tight ${
                isLight ? "text-slate-900" : "text-white"
              }`}
            >
              Acceso a la Firma Jurídica
            </h1>
            <p className={`text-xs ${isLight ? "text-slate-500" : "text-slate-400"}`}>
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
                className={`block text-xs font-semibold uppercase tracking-wider mb-1.5 ${
                  isLight ? "text-slate-700" : "text-slate-300"
                }`}
              >
                Correo Institucional
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="harvey.specter@specterlaw.co"
                  className="w-full pl-10 pr-4 py-2.5 ios-input text-sm"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className={`block text-xs font-semibold uppercase tracking-wider mb-1.5 ${
                  isLight ? "text-slate-700" : "text-slate-300"
                }`}
              >
                Contraseña de Acceso
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
                <input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 ios-input text-sm"
                />
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
                textColor={isLight ? "#92400e" : "#fef3c7"}
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

          <div className="pt-4 border-t border-white/[0.08] text-center space-y-2">
            <p className={`text-xs ${isLight ? "text-slate-600" : "text-slate-400"}`}>
              ¿Deseas constituir una nueva firma legal?{" "}
              <Link
                href="/register"
                className="text-amber-500 hover:text-amber-600 font-semibold transition"
              >
                Registrar Despacho
              </Link>
            </p>
            <div>
              <Link
                href="/"
                className={`inline-flex items-center space-x-1 text-xs transition ${
                  isLight ? "text-slate-500 hover:text-slate-800" : "text-slate-500 hover:text-slate-300"
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
