"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Scale,
  Building2,
  ShieldCheck,
  Lock,
  Mail,
  GraduationCap,
  ArrowLeft,
  AlertCircle,
  UserCheck
} from "lucide-react";
import { FluidGlassBackground } from "@/components/ui/FluidGlassBackground";

export default function RegisterPage() {
  const router = useRouter();
  const [tenantName, setTenantName] = useState("");
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("socio");
  const [experienciaAnios, setExperienciaAnios] = useState(8);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tenantName,
          nombre,
          email,
          password,
          role,
          experienciaAnios: Number(experienciaAnios),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Error al registrar el despacho");
      }

      router.push("/panel/dashboard");
      router.refresh();
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Ocurrió un error inesperado al constituir la firma");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen text-slate-100 flex flex-col justify-center items-center px-4 py-12 relative">
      <FluidGlassBackground />

      <div className="w-full max-w-lg fluid-glass rounded-3xl p-8 sm:p-10 shadow-2xl space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500/20 to-amber-600/10 border border-amber-500/40 text-amber-400 mb-2 shadow-lg shadow-amber-950/40">
            <Scale className="w-6 h-6 text-amber-400" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold tracking-tight text-white">
            Constitución de Firma Jurídica
          </h1>
          <p className="text-xs text-slate-400">
            Aprovisiona tu despacho con bóveda aislada y reglas automáticas de litigio
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
              htmlFor="tenantName"
              className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5"
            >
              Nombre Oficial de la Firma / Despacho
            </label>
            <div className="relative">
              <Building2 className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
              <input
                id="tenantName"
                type="text"
                required
                value={tenantName}
                onChange={(e) => setTenantName(e.target.value)}
                placeholder="Ej. Specter & Litt Abogados Colombia"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-950/70 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 text-sm transition"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="nombre"
                className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5"
              >
                Abogado Titular Fundador
              </label>
              <div className="relative">
                <UserCheck className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
                <input
                  id="nombre"
                  type="text"
                  required
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  placeholder="Ej. Harvey Specter"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-950/70 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 text-sm transition"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="role"
                className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5"
              >
                Jerarquía Legal
              </label>
              <select
                id="role"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-950/70 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50 text-sm transition font-sans"
              >
                <option value="socio">Socio Director (Abogado Mayor)</option>
                <option value="senior">Abogado Senior (Litigio)</option>
                <option value="junior">Abogado Menor (Asociado)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="experienciaAnios"
                className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5"
              >
                Años de Litigio / Práctica
              </label>
              <div className="relative">
                <GraduationCap className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
                <input
                  id="experienciaAnios"
                  type="number"
                  min="0"
                  max="60"
                  required
                  value={experienciaAnios}
                  onChange={(e) => setExperienciaAnios(Number(e.target.value))}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-950/70 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50 text-sm transition font-mono"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5"
              >
                Correo Institucional
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="harvey@specterlaw.co"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-950/70 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 text-sm transition"
                />
              </div>
            </div>
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5"
            >
              Contraseña de Acceso (mínimo 8 caracteres)
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
              <input
                id="password"
                type="password"
                required
                minLength={8}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-950/70 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 text-sm transition"
              />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white font-semibold text-sm rounded-xl shadow-xl shadow-amber-950/40 transition duration-150 disabled:opacity-50 cursor-pointer flex items-center justify-center space-x-2"
            >
              <Scale className="w-4 h-4" />
              <span>{loading ? "Aprovisionando Bóveda..." : "Constituir Firma Jurídica"}</span>
            </button>
          </div>
        </form>

        <div className="pt-4 border-t border-white/[0.08] text-center space-y-2">
          <p className="text-xs text-slate-400">
            ¿Ya tienes un despacho registrado?{" "}
            <Link
              href="/login"
              className="text-amber-400 hover:text-amber-300 font-semibold transition"
            >
              Iniciar Sesión
            </Link>
          </p>
          <div>
            <Link
              href="/"
              className="inline-flex items-center space-x-1 text-xs text-slate-500 hover:text-slate-300 transition"
            >
              <ArrowLeft className="w-3 h-3" />
              <span>Volver al inicio</span>
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
