"use client";

import { useState } from "react";
import Link from "next/link";

export default function RegistroClientePage() {
  const [nombre, setNombre] = useState("");
  const [tipoDocumento, setTipoDocumento] = useState("CC");
  const [numeroDocumento, setNumeroDocumento] = useState("");
  const [email, setEmail] = useState("");
  const [telefono, setTelefono] = useState("");
  const [condicionEspecial, setCondicionEspecial] = useState("ninguna");
  const [tituloCaso, setTituloCaso] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [esFuerzaMayor, setEsFuerzaMayor] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resultado, setResultado] = useState<{
    radicado: string;
    despacho: string;
    prioridad: string;
    nivelAbogado: string;
  } | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/clientes/registro-publico", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombre,
          tipoDocumento,
          numeroDocumento,
          email,
          telefono,
          condicionEspecial,
          tituloCaso,
          descripcion,
          esFuerzaMayor,
        }),
      });

      const json = await res.json();

      if (!res.ok) {
        throw new Error(json.error || "Error al radicar la solicitud");
      }

      setResultado({
        radicado: json.data.radicado,
        despacho: json.data.despacho,
        prioridad: json.data.caso.prioridad,
        nivelAbogado: json.data.caso.nivelAbogadoExigido,
      });
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Ocurrió un error inesperado al procesar su solicitud");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <span className="w-8 h-8 rounded bg-amber-500/20 border border-amber-500/40 text-amber-400 font-serif font-bold flex items-center justify-center text-lg">
              §
            </span>
            <span className="font-serif font-bold text-lg text-white tracking-tight">
              Specter & Asociados Colombia
            </span>
          </Link>

          <Link
            href="/"
            className="text-xs sm:text-sm text-slate-400 hover:text-white transition"
          >
            ← Volver al Inicio
          </Link>
        </div>
      </header>

      <main className="flex-1 max-w-3xl w-full mx-auto px-4 py-12">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-10 shadow-2xl">
          <div className="mb-8">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold uppercase tracking-wider mb-2">
              <span>Atención Ciudadana y Víctimas</span>
            </div>
            <h1 className="text-3xl font-serif font-bold text-white tracking-tight">
              Registro de Cliente y Radicación de Caso
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              Complete sus datos para solicitar representación legal. La plataforma asigna prioridad preferencial a víctimas del conflicto y casos urgentes.
            </p>
          </div>

          {resultado ? (
            <div className="p-8 rounded-xl bg-slate-950 border border-emerald-500/40 text-left space-y-4">
              <div className="flex items-center space-x-3 text-emerald-400">
                <span className="text-3xl">✓</span>
                <h2 className="text-xl font-bold font-serif text-white">
                  ¡Caso Radicado Exitosamente!
                </h2>
              </div>

              <div className="bg-slate-900 p-4 rounded-lg border border-slate-800 space-y-2 text-sm">
                <p>
                  <strong className="text-slate-300">Número de Radicado:</strong>{" "}
                  <span className="font-mono font-bold text-emerald-400 text-base">
                    {resultado.radicado}
                  </span>
                </p>
                <p>
                  <strong className="text-slate-300">Firma Asignada:</strong>{" "}
                  <span className="text-white">{resultado.despacho}</span>
                </p>
                <p>
                  <strong className="text-slate-300">Nivel de Prioridad:</strong>{" "}
                  <span className="capitalize px-2 py-0.5 rounded text-xs font-semibold bg-amber-500/20 text-amber-400 border border-amber-500/30">
                    {resultado.prioridad}
                  </span>
                </p>
                <p>
                  <strong className="text-slate-300">Equipo Jurídico Exigido:</strong>{" "}
                  <span className="text-white font-semibold">
                    {resultado.nivelAbogado === "senior"
                      ? "Abogado Senior / Socio Titular (Alta Experiencia)"
                      : "Abogado Asociado"}
                  </span>
                </p>
              </div>

              <p className="text-xs text-slate-400">
                Guarde su número de radicado. Un abogado de la firma revisará su caso de acuerdo con el orden de prelación.
              </p>

              <button
                onClick={() => setResultado(null)}
                className="mt-4 px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-lg text-sm font-medium transition cursor-pointer"
              >
                Radicar Otro Caso
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="p-4 rounded-lg bg-rose-950/50 border border-rose-800 text-rose-300 text-sm">
                  {error}
                </div>
              )}

              {/* Sección 1: Datos Personales */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-amber-400 border-b border-slate-800 pb-2">
                  1. Identificación del Cliente / Accionante
                </h3>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Nombre Completo
                  </label>
                  <input
                    type="text"
                    required
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    placeholder="Ej. María Pérez Gómez"
                    className="w-full px-4 py-2 bg-slate-950 border border-slate-750 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 text-sm"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      Tipo de Documento
                    </label>
                    <select
                      value={tipoDocumento}
                      onChange={(e) => setTipoDocumento(e.target.value)}
                      className="w-full px-4 py-2 bg-slate-950 border border-slate-750 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50 text-sm"
                    >
                      <option value="CC">Cédula de Ciudadanía (CC)</option>
                      <option value="TI">Tarjeta de Identidad (TI)</option>
                      <option value="CE">Cédula de Extranjería (CE)</option>
                      <option value="PPT">Permiso por Protección Temporal (PPT - Migrante)</option>
                      <option value="Pasaporte">Pasaporte</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      Número de Documento
                    </label>
                    <input
                      type="text"
                      required
                      value={numeroDocumento}
                      onChange={(e) => setNumeroDocumento(e.target.value)}
                      placeholder="Ej. 1020304050"
                      className="w-full px-4 py-2 bg-slate-950 border border-slate-750 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 text-sm"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      Correo Electrónico (Opcional)
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="maria@ejemplo.com"
                      className="w-full px-4 py-2 bg-slate-950 border border-slate-750 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      Teléfono de Contacto
                    </label>
                    <input
                      type="tel"
                      value={telefono}
                      onChange={(e) => setTelefono(e.target.value)}
                      placeholder="300 123 4567"
                      className="w-full px-4 py-2 bg-slate-950 border border-slate-750 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 text-sm"
                    />
                  </div>
                </div>
              </div>

              {/* Sección 2: Condición Especial de Protección */}
              <div className="space-y-4 pt-4">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-amber-400 border-b border-slate-800 pb-2">
                  2. Condición de Especial Protección Constitucional
                </h3>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    ¿Pertenece o representa a alguna de estas poblaciones?
                  </label>
                  <select
                    value={condicionEspecial}
                    onChange={(e) => setCondicionEspecial(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-950 border border-slate-750 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50 text-sm"
                  >
                    <option value="ninguna">Ninguna / Ciudadano General</option>
                    <option value="victima_conflicto">
                      Víctima del Conflicto Armado (Ley 1448 de 2011) — Prioridad Máxima
                    </option>
                    <option value="desplazado">
                      Persona en Situación de Desplazamiento Forzado — Prioridad Máxima
                    </option>
                    <option value="migrante">
                      Población Migrante o Refugiada
                    </option>
                    <option value="madre_cabeza_familia">
                      Madre Cabeza de Familia
                    </option>
                    <option value="adulto_mayor">
                      Adulto Mayor / Sujeto de Especial Protección
                    </option>
                    <option value="otro">Otra Condición de Vulnerabilidad</option>
                  </select>
                  <p className="text-[11px] text-slate-400 mt-1.5">
                    Las víctimas del conflicto y desplazados son catalogados con <strong>Prioridad Urgente</strong> y sus expedientes se remiten directamente a los abogados de mayor experiencia de la firma.
                  </p>
                </div>
              </div>

              {/* Sección 3: Datos del Caso / Pretensión */}
              <div className="space-y-4 pt-4">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-amber-400 border-b border-slate-800 pb-2">
                  3. Datos del Caso o Solicitud Jurídica
                </h3>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Título o Asunto de la Petición
                  </label>
                  <input
                    type="text"
                    required
                    value={tituloCaso}
                    onChange={(e) => setTituloCaso(e.target.value)}
                    placeholder="Ej. Acción de Tutela por Derecho Fundamental a la Salud"
                    className="w-full px-4 py-2 bg-slate-950 border border-slate-750 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Relato Sucinto de los Hechos
                  </label>
                  <textarea
                    rows={4}
                    value={descripcion}
                    onChange={(e) => setDescripcion(e.target.value)}
                    placeholder="Describa brevemente la situación, entidades involucradas y derechos vulnerados..."
                    className="w-full px-4 py-2 bg-slate-950 border border-slate-750 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 text-sm"
                  />
                </div>

                <div className="p-4 rounded-lg bg-slate-950 border border-slate-800 flex items-start space-x-3">
                  <input
                    id="esFuerzaMayor"
                    type="checkbox"
                    checked={esFuerzaMayor}
                    onChange={(e) => setEsFuerzaMayor(e.target.checked)}
                    className="mt-1 h-4 w-4 rounded border-slate-700 text-amber-600 focus:ring-amber-500 cursor-pointer"
                  />
                  <label
                    htmlFor="esFuerzaMayor"
                    className="text-xs text-slate-300 cursor-pointer"
                  >
                    <strong className="text-white block">
                      ¿Es un caso de Fuerza Mayor o Riesgo Vital Inminente?
                    </strong>
                    Marque esta casilla si existe riesgo irreparable a la vida, integridad o libertad. Esto obligará al sistema a remitir el caso a un abogado Senior o Socio Director.
                  </label>
                </div>
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 px-4 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white font-medium text-sm rounded-lg shadow-lg shadow-amber-900/30 transition disabled:opacity-50 cursor-pointer"
                >
                  {loading
                    ? "Registrando cliente y radicando caso..."
                    : "Radicar Caso ante la Firma Jurídica"}
                </button>
              </div>
            </form>
          )}
        </div>
      </main>
    </div>
  );
}
