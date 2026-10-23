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
  UserCheck,
} from "lucide-react";
import { FluidGlassBackground } from "@/components/ui/FluidGlassBackground";
import { HeaderControls } from "@/components/ui/HeaderControls";
import { useTheme } from "@/context/ThemeContext";

export default function RegisterPage() {
  const router = useRouter();
  const { theme } = useTheme();
  const isLight = theme === "light";

  const [tenantName, setTenantName] = useState("");
  const [nombre, setNombre] = useState("");
  const [cedula, setCedula] = useState("");
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
          cedula,
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
    <main
      className={`min-h-screen flex flex-col justify-center items-center px-4 py-12 relative transition-colors duration-300 ${
        isLight ? "text-slate-800" : "text-slate-100"
      }`}
    >
      <FluidGlassBackground />

      <div className="absolute top-5 right-5 z-50">
        <HeaderControls />
      </div>

      <div className="w-full max-w-lg fluid-glass rounded-3xl p-8 sm:p-10 shadow-2xl space-y-6 relative z-10">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500/20 to-amber-600/10 border border-amber-500/40 text-amber-500 mb-2 shadow-lg shadow-amber-950/20">
            <Scale className="w-6 h-6 text-amber-500" />
          </div>
          <h1
            className={`text-2xl sm:text-3xl font-serif font-bold tracking-tight ${
              isLight ? "text-slate-900" : "text-white"
            }`}
          >
            Constitución de Firma Jurídica
          </h1>
          <p className={`text-xs ${isLight ? "text-slate-500" : "text-slate-400"}`}>
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
              className={`block text-xs font-semibold uppercase tracking-wider mb-1.5 ${
                isLight ? "text-slate-700" : "text-slate-300"
              }`}
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
                placeholder="Ej. De La Espriella Lawyers / Castro & Asociados"
                className={`w-full pl-10 pr-4 py-2.5 border rounded-xl placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500/50 text-sm transition font-sans ${
                  isLight
                    ? "bg-white/90 border-slate-200 text-slate-900"
                    : "bg-slate-950/70 border-white/10 text-white"
                }`}
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="nombre"
              className={`block text-xs font-semibold uppercase tracking-wider mb-1.5 ${
                isLight ? "text-slate-700" : "text-slate-300"
              }`}
            >
              Nombre del Abogado Fundador / Titular
            </label>
            <div className="relative">
              <UserCheck className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
              <input
                id="nombre"
                type="text"
                required
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                placeholder="Ej. Dr. Harvey Specter"
                className={`w-full pl-10 pr-4 py-2.5 border rounded-xl placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500/50 text-sm transition font-sans ${
                  isLight
                    ? "bg-white/90 border-slate-200 text-slate-900"
                    : "bg-slate-950/70 border-white/10 text-white"
                }`}
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="cedula"
              className={`block text-xs font-semibold uppercase tracking-wider mb-1.5 ${
                isLight ? "text-slate-700" : "text-slate-300"
              }`}
            >
              Cédula o Documento de Identidad del Abogado
            </label>
            <div className="relative">
              <UserCheck className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
              <input
                id="cedula"
                type="text"
                required
                value={cedula}
                onChange={(e) => setCedula(e.target.value)}
                placeholder="Ej. 80192834"
                className={`w-full pl-10 pr-4 py-2.5 border rounded-xl placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500/50 text-sm transition font-sans ${
                  isLight
                    ? "bg-white/90 border-slate-200 text-slate-900"
                    : "bg-slate-950/70 border-white/10 text-white"
                }`}
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="email"
              className={`block text-xs font-semibold uppercase tracking-wider mb-1.5 ${
                isLight ? "text-slate-700" : "text-slate-300"
              }`}
            >
              Correo Electrónico Institucional
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="fundador@firma.co"
                className={`w-full pl-10 pr-4 py-2.5 border rounded-xl placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500/50 text-sm transition font-sans ${
                  isLight
                    ? "bg-white/90 border-slate-200 text-slate-900"
                    : "bg-slate-950/70 border-white/10 text-white"
                }`}
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
              <Lock className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
              <input
                id="password"
                type="password"
                required
                minLength={8}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Mínimo 8 caracteres"
                className={`w-full pl-10 pr-4 py-2.5 border rounded-xl placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500/50 text-sm transition font-sans ${
                  isLight
                    ? "bg-white/90 border-slate-200 text-slate-900"
                    : "bg-slate-950/70 border-white/10 text-white"
                }`}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="role"
                className={`block text-xs font-semibold uppercase tracking-wider mb-1.5 ${
                  isLight ? "text-slate-700" : "text-slate-300"
                }`}
              >
                Jerarquía Legal
              </label>
              <select
                id="role"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className={`w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/50 text-sm transition ${
                  isLight
                    ? "bg-white/90 border-slate-200 text-slate-900"
                    : "bg-slate-950/70 border-white/10 text-white"
                }`}
              >
                <option value="socio" className={isLight ? "text-slate-900" : "text-white"}>Socio Director (Abogado Mayor)</option>
                <option value="senior" className={isLight ? "text-slate-900" : "text-white"}>Abogado Senior (Abogado Mayor)</option>
                <option value="junior" className={isLight ? "text-slate-900" : "text-white"}>Abogado Asociado (Menor)</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="experienciaAnios"
                className={`block text-xs font-semibold uppercase tracking-wider mb-1.5 ${
                  isLight ? "text-slate-700" : "text-slate-300"
                }`}
              >
                Años de Experiencia
              </label>
              <div className="relative">
                <GraduationCap className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
                <input
                  id="experienciaAnios"
                  type="number"
                  min={1}
                  max={50}
                  required
                  value={experienciaAnios}
                  onChange={(e) => setExperienciaAnios(Number(e.target.value))}
                  className={`w-full pl-10 pr-4 py-2.5 border rounded-xl placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500/50 text-sm transition font-sans ${
                    isLight
                      ? "bg-white/90 border-slate-200 text-slate-900"
                      : "bg-slate-950/70 border-white/10 text-white"
                  }`}
                />
              </div>
            </div>
          </div>

          <div
            className={`p-3.5 rounded-xl border text-xs space-y-1 ${
              isLight ? "bg-amber-50/70 border-amber-200 text-slate-700" : "bg-slate-950/40 border-white/[0.06] text-slate-300"
            }`}
          >
            <p className="flex items-center gap-1.5 text-amber-500 font-semibold">
              <ShieldCheck className="w-4 h-4" />
              Aislamiento Multitenant de Esquema PostgreSQL
            </p>
            <p className={isLight ? "text-slate-600" : "text-slate-400"}>
              Al registrarse, se ejecutará una transacción DDL con <code>CREATE SCHEMA</code> dedicado y plantillas SQL para sus clientes, casos y documentos protegidos.
            </p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white font-semibold text-sm rounded-xl shadow-lg shadow-amber-950/40 transition duration-150 disabled:opacity-50 cursor-pointer flex items-center justify-center space-x-2"
          >
            <Building2 className="w-4 h-4" />
            <span>
              {loading
                ? "Aprovisionando schema y base de datos..."
                : "Aprovisionar Firma & Iniciar Litigio"}
            </span>
          </button>
        </form>

        <div className="pt-4 border-t border-white/[0.08] text-center space-y-2">
          <p className={`text-xs ${isLight ? "text-slate-600" : "text-slate-400"}`}>
            ¿Tu firma ya está constituida?{" "}
            <Link
              href="/login"
              className="text-amber-500 hover:text-amber-600 font-semibold transition"
            >
              Ingresar al Despacho
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
    </main>
  );
}
