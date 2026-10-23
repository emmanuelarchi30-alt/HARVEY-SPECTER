"use client";

import Link from "next/link";
import {
  Scale,
  Search,
  Building2,
  Sparkles,
  ShieldCheck,
  BookOpen,
  Award,
  Users,
  ArrowRight,
  Zap,
  CreditCard,
  CheckCircle2
} from "lucide-react";
import { BackgroundVideo } from "@/components/ui/BackgroundVideo";
import { FluidGlassLens } from "@/components/ui/FluidGlassLens";
import { PublicNavbar } from "@/components/ui/PublicNavbar";
import { SpecularButton } from "@/components/ui/SpecularButton";
import ChromaGrid, { type ChromaItem } from "@/components/ui/ChromaGrid";
import ProfileCard from "@/components/ui/ProfileCard";
import Lightfall from "@/components/ui/Lightfall";
import { useLanguage } from "@/context/LanguageContext";
import { useTheme } from "@/context/ThemeContext";

export default function HomePage() {
  const { t } = useLanguage();
  const { theme } = useTheme();
  const isLight = theme === "light";

  const abogadosEquipo = [
    {
      name: "Harvey Specter",
      title: "Socio Director • Litigio de Alto Impacto",
      handle: "harveyspecter",
      status: "En Audiencia Tribunal",
      statusColor: "#22c55e",
      contactText: "Solicitar Caso",
      avatarUrl: "https://static.wikia.nocookie.net/suits/images/d/da/S8_Harvey_Specter.jpg/revision/latest?cb=20180731195449",
      miniAvatarUrl: "https://static.wikia.nocookie.net/suits/images/d/da/S8_Harvey_Specter.jpg/revision/latest?cb=20180731195449",
      backdropColor: "#1e1b4b",
      holo: 0.85,
      glare: 0.6,
      tiltStrength: 14,
      parallax: 8
    },
    {
      name: "Jessica Pearson",
      title: "Socia Fundadora • Casación & Consejo de Estado",
      handle: "jessicapearson",
      status: "Gabinete Directivo",
      statusColor: "#f59e0b",
      contactText: "Agendar Consulta",
      avatarUrl: "https://static.wikia.nocookie.net/suits/images/c/c4/Jessica_Pearson_%28Pearson%29.jpg/revision/latest?cb=20190902222249",
      miniAvatarUrl: "https://static.wikia.nocookie.net/suits/images/c/c4/Jessica_Pearson_%28Pearson%29.jpg/revision/latest?cb=20190902222249",
      backdropColor: "#3b0764",
      holo: 0.8,
      glare: 0.55,
      tiltStrength: 12,
      parallax: 8
    },
    {
      name: "Mike Ross",
      title: "Abogado Senior • Memoria Eidética & Tutelas",
      handle: "mikeross",
      status: "Fast Track Activo (<12h)",
      statusColor: "#38bdf8",
      contactText: "Radicar con IA",
      avatarUrl: "https://static.wikia.nocookie.net/suits/images/c/c2/Mike_Ross_%285x7%29.png/revision/latest?cb=20190903001426",
      miniAvatarUrl: "https://static.wikia.nocookie.net/suits/images/c/c2/Mike_Ross_%285x7%29.png/revision/latest?cb=20190903001426",
      backdropColor: "#0f172a",
      holo: 0.9,
      glare: 0.65,
      tiltStrength: 15,
      parallax: 10
    },
    {
      name: "Louis Litt",
      title: "Socio Titular • Derecho Financiero & Arbitraje",
      handle: "louislitt",
      status: "Revisión Procesal",
      statusColor: "#eab308",
      contactText: "Consultar Dictamen",
      avatarUrl: "https://static.wikia.nocookie.net/suits/images/f/f1/S8_Louis_Litt.jpg/revision/latest?cb=20180731195639",
      miniAvatarUrl: "https://static.wikia.nocookie.net/suits/images/f/f1/S8_Louis_Litt.jpg/revision/latest?cb=20180731195639",
      backdropColor: "#1c1917",
      holo: 0.75,
      glare: 0.5,
      tiltStrength: 12,
      parallax: 7
    },
    {
      name: "Donna Paulsen",
      title: "Directora de Operaciones • COO de la Firma",
      handle: "donnapaulsen",
      status: "Atención Inmediata",
      statusColor: "#ec4899",
      contactText: "Contactar",
      avatarUrl: "https://static.wikia.nocookie.net/suits/images/9/97/S8_Donna_Paulsen.jpg/revision/latest?cb=20180731195347",
      miniAvatarUrl: "https://static.wikia.nocookie.net/suits/images/9/97/S8_Donna_Paulsen.jpg/revision/latest?cb=20180731195347",
      backdropColor: "#2e1065",
      holo: 0.85,
      glare: 0.6,
      tiltStrength: 14,
      parallax: 8
    },
    {
      name: "Rachel Zane",
      title: "Abogada Especialista • Víctimas Ley 1448",
      handle: "rachelzane",
      status: "Defensoría Activa",
      statusColor: "#10b981",
      contactText: "Amparo Gratuito",
      avatarUrl: "https://static.wikia.nocookie.net/suits/images/9/92/Meghan_Markle_as_Rachel_Zane.png/revision/latest?cb=20191003130401",
      miniAvatarUrl: "https://static.wikia.nocookie.net/suits/images/9/92/Meghan_Markle_as_Rachel_Zane.png/revision/latest?cb=20191003130401",
      backdropColor: "#14532d",
      holo: 0.8,
      glare: 0.55,
      tiltStrength: 13,
      parallax: 8
    }
  ];

  const legalChromaItems: ChromaItem[] = [
    {
      image: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=800&q=80&auto=format&fit=crop",
      title: "Acción de Tutela & Vía de Hecho",
      subtitle: "Amparo Constitucional Inmediato • Art. 86 C.P.",
      accent: "#f59e0b",
      url: "/registro-cliente"
    },
    {
      image: "https://images.unsplash.com/photo-1505664194779-8beaceb93744?w=800&q=80&auto=format&fit=crop",
      title: "Ley 1448 de 2011 • Víctimas",
      subtitle: "Prelación Gratuita • Socio Mayor Titular",
      accent: "#10b981",
      url: "/registro-cliente"
    },
    {
      image: "https://images.unsplash.com/photo-1450133064473-71024230f91b?w=800&q=80&auto=format&fit=crop",
      title: "Fast Track Procesal (Menos de 12h)",
      subtitle: "Tiempo de Estudio Reducido & Medida Cautelar",
      accent: "#0ea5e9",
      url: "/aranceles"
    },
    {
      image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80&auto=format&fit=crop",
      title: "Litigio Corporativo & Arbitraje",
      subtitle: "Cámaras de Comercio & Alta Complejidad",
      accent: "#8b5cf6",
      url: "/consultar-caso"
    },
    {
      image: "https://images.unsplash.com/photo-1521791136064-7986c2920216?w=800&q=80&auto=format&fit=crop",
      title: "Constitución de 1991 Integrada",
      subtitle: "Bloque de Constitucionalidad & Jurisprudencia",
      accent: "#ec4899",
      url: "/constitucion"
    },
    {
      image: "https://images.unsplash.com/photo-1575517111478-7f6afd0973db?w=800&q=80&auto=format&fit=crop",
      title: "Bóveda & Aislamiento Multitenant",
      subtitle: "Secreto Profesional & Cifrado de Evidencia",
      accent: "#d97706",
      url: "/login"
    }
  ];

  return (
    <div className="min-h-screen flex flex-col font-sans relative">
      <BackgroundVideo src="/videos/fondo-inicio.mp4" />

      {/* Navbar público con PillNav de React Bits */}
      <PublicNavbar />

      {/* Hero Section */}
      <main className="flex-1 flex flex-col justify-center items-center px-4 py-16 sm:py-24 text-center max-w-5xl mx-auto space-y-10 relative">
        {/* Rayos celestiales de justicia interactivos con React Bits Lightfall (WebGL2) */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-6xl h-[680px] pointer-events-none -z-10 overflow-hidden opacity-60">
          <Lightfall
            colors={isLight ? ['#d97706', '#f59e0b', '#38bdf8', '#cbd5e1'] : ['#f59e0b', '#fbbf24', '#38bdf8', '#ffffff']}
            backgroundColor={isLight ? "#f1f5f9" : "#080c16"}
            speed={0.25}
            streakCount={3}
            streakWidth={0.8}
            streakLength={1.2}
            twinkle={0.3}
            backgroundGlow={0.14}
            headGlow={0.65}
            bloom={0.35}
            mouseInteraction={true}
            holdToWarp={true}
            intro={true}
            fade={0.45}
            lightMode={isLight}
          />
        </div>

        <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full fluid-glass-pill text-amber-600 dark:text-amber-400 text-xs font-semibold uppercase tracking-wider animate-float-subtle">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          <span>{t.hero_tag}</span>
        </div>

        <div className="space-y-6 max-w-3xl mx-auto">
          <h1 className={`text-4xl sm:text-6xl font-serif font-bold tracking-tight leading-tight ${isLight ? "text-slate-900" : "text-white"}`}>
            {t.hero_title_1}{" "}
            <span className="bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600 bg-clip-text text-transparent">
              {t.hero_title_highlight}
            </span>
          </h1>

          <p className={`text-base sm:text-lg leading-relaxed ${isLight ? "text-slate-600" : "text-slate-300"}`}>
            {t.hero_desc}
          </p>
        </div>

        {/* Botones de Acción con React Bits SpecularButton (WebGL Liquid Light) */}
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto justify-center items-center">
          <SpecularButton
            href="/registro-cliente"
            size="lg"
            radius={18}
            tint={isLight ? "#f59e0b" : "#ffffff"}
            tintOpacity={isLight ? 0.18 : 0.06}
            textColor={isLight ? "#92400e" : "#fef3c7"}
            lineColor={isLight ? "#d97706" : "#f59e0b"}
            baseColor={isLight ? "#fef3c7" : "#525252"}
            intensity={1.2}
            idleIntensity={0.4}
            shineSize={12}
            shineFade={36}
            thickness={1.4}
            glow={1.2}
            followMouse
            proximity={280}
          >
            <Scale className="w-4 h-4 text-amber-500" />
            <span>{t.btn_file_case}</span>
          </SpecularButton>

          <SpecularButton
            href="/consultar-caso"
            size="lg"
            radius={18}
            tint={isLight ? "#ffffff" : "#ffffff"}
            tintOpacity={isLight ? 0.12 : 0.05}
            textColor={isLight ? "#0f172a" : "#f5f5f5"}
            lineColor={isLight ? "#d97706" : "#ffffff"}
            baseColor={isLight ? "#e2e8f0" : "#525252"}
            intensity={1}
            idleIntensity={0.35}
            shineSize={10}
            shineFade={34}
            thickness={1.2}
            glow={0.9}
            followMouse
            proximity={250}
          >
            <Search className="w-4 h-4 text-amber-500" />
            <span>{t.btn_track_case}</span>
          </SpecularButton>

          <SpecularButton
            href="/aranceles"
            size="lg"
            radius={18}
            tint={isLight ? "#ffffff" : "#ffffff"}
            tintOpacity={isLight ? 0.12 : 0.05}
            textColor={isLight ? "#0f172a" : "#f5f5f5"}
            lineColor={isLight ? "#0ea5e9" : "#38bdf8"}
            baseColor={isLight ? "#e2e8f0" : "#525252"}
            intensity={1}
            idleIntensity={0.35}
            shineSize={10}
            shineFade={34}
            thickness={1.2}
            glow={0.9}
            followMouse
            proximity={250}
          >
            <Zap className="w-4 h-4 text-amber-500" />
            <span>{t.nav_pricing}</span>
          </SpecularButton>
        </div>

        {/* Lente Refractiva React Bits Pure Fluid Glass */}
        <div className="w-full max-w-4xl text-left pt-6">
          <FluidGlassLens
            badge="React Bits • Interactive Fluid Glass"
            label="Refracción Dinámica & Triage Automático"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
              <div className="space-y-3">
                <h3 className={`text-2xl font-serif font-bold ${isLight ? "text-slate-900" : "text-white"}`}>
                  Garantía Procesal con Asignación por Jerarquía
                </h3>
                <p className={`text-xs sm:text-sm leading-relaxed ${isLight ? "text-slate-600" : "text-slate-300"}`}>
                  El cristal líquido refracta la información en tiempo real. Cuando un ciudadano es acreditado como víctima del conflicto armado o sujeto en debilidad manifiesta (Art. 13 C.P.), la plataforma activa una alerta constitucional prioritaria y delega el caso de forma obligatoria a un <strong>Abogado Mayor (Socio Titular)</strong>.
                </p>
                <div className="flex items-center space-x-3 pt-1">
                  <span className="inline-flex items-center space-x-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-semibold">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Ley 1448 de 2011 Integrada</span>
                  </span>
                  <span className="inline-flex items-center space-x-1.5 text-xs text-amber-600 dark:text-amber-400 font-semibold">
                    <Zap className="w-4 h-4" />
                    <span>Fast Track en 12h</span>
                  </span>
                </div>
              </div>

              <div className={`p-5 rounded-2xl border space-y-2.5 ${isLight ? "bg-amber-50/70 border-amber-200" : "bg-slate-950/70 border-amber-500/30"}`}>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                    Regla de Celeridad Procesal
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-600 dark:text-amber-300 font-bold">
                    Fast Track
                  </span>
                </div>
                <p className={`text-xs leading-relaxed ${isLight ? "text-slate-700" : "text-slate-300"}`}>
                  <strong>Un pago grande representa un tiempo de estudio más corto:</strong> Nuestra modalidad Fast Track garantiza respuesta en menos de 12 horas con solicitud de medida cautelar previa ante juez constitucional.
                </p>
                <Link
                  href="/aranceles"
                  className="inline-flex items-center space-x-1 text-xs text-amber-600 dark:text-amber-400 font-bold hover:underline pt-1"
                >
                  <span>Ver tabla comparativa de aranceles</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </FluidGlassLens>
        </div>

        {/* Tarjetas de Pilares Jurídicos */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left w-full pt-4">
          <div className="fluid-glass rounded-3xl p-6 sm:p-8 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/15 border border-amber-500/30 text-amber-500 flex items-center justify-center shadow-lg">
              <Sparkles className="w-6 h-6 text-amber-500" />
            </div>
            <h2 className={`font-serif font-bold text-lg ${isLight ? "text-slate-900" : "text-white"}`}>
              Triaje IA & Ley de Víctimas
            </h2>
            <p className={`text-xs sm:text-sm leading-relaxed ${isLight ? "text-slate-600" : "text-slate-300"}`}>
              Clasificación instantánea bajo el Artículo 13 de la Constitución. Víctimas del conflicto armado reciben prelación máxima y asignación inmediata a un <strong>Abogado Mayor</strong>.
            </p>
          </div>

          <div className="fluid-glass rounded-3xl p-6 sm:p-8 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-500 flex items-center justify-center shadow-lg">
              <ShieldCheck className="w-6 h-6 text-emerald-500" />
            </div>
            <h2 className={`font-serif font-bold text-lg ${isLight ? "text-slate-900" : "text-white"}`}>
              Bóveda con Reserva Profesional
            </h2>
            <p className={`text-xs sm:text-sm leading-relaxed ${isLight ? "text-slate-600" : "text-slate-300"}`}>
              Aislamiento estricto de expedientes. Cada firma opera en su propio compartimento de datos protegido, garantizando el secreto profesional y la confidencialidad de las pruebas.
            </p>
          </div>

          <div className="fluid-glass rounded-3xl p-6 sm:p-8 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-500/15 border border-blue-500/30 text-blue-500 flex items-center justify-center shadow-lg">
              <BookOpen className="w-6 h-6 text-blue-500" />
            </div>
            <h2 className={`font-serif font-bold text-lg ${isLight ? "text-slate-900" : "text-white"}`}>
              Constitución de 1991 Integrada
            </h2>
            <p className={`text-xs sm:text-sm leading-relaxed ${isLight ? "text-slate-600" : "text-slate-300"}`}>
              Consulta en tiempo real del bloque de constitucionalidad (Arts. 11, 13, 29, 86, 93) para la fundamentación jurídica de acciones de tutela y derechos de petición.
            </p>
          </div>
        </div>

        {/* Sección ChromaGrid de React Bits: Práctica Jurídica & Especialidades */}
        <section className="w-full space-y-6 pt-10 text-left">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/25 text-amber-500 text-[11px] font-bold uppercase tracking-wider mb-2">
                <Sparkles className="w-3.5 h-3.5" />
                <span>React Bits • Interactive Chroma Grid</span>
              </div>
              <h2 className={`text-2xl sm:text-3xl font-serif font-bold ${isLight ? "text-slate-900" : "text-white"}`}>
                Áreas de Práctica & Especialidades Procesales
              </h2>
              <p className={`text-xs sm:text-sm mt-1 max-w-2xl ${isLight ? "text-slate-600" : "text-slate-400"}`}>
                Pasa el cursor sobre la cuadrícula cromática para revelar con luz focalizada (spotlight) cada área procesal y consultar la fundamentación legal correspondiente.
              </p>
            </div>
          </div>

          <ChromaGrid
            items={legalChromaItems}
            columns={3}
            radius={280}
            softness={0.65}
            damping={0.4}
            glow={0.6}
            borderGlow={1}
            frame={true}
            theme={isLight ? "light" : "dark"}
          />
        </section>

        {/* Sección ProfileCard de React Bits: Cuerpo de Abogados & Socios Titulares */}
        <section className="w-full space-y-8 pt-12 pb-6 text-left">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/25 text-amber-500 text-[11px] font-bold uppercase tracking-wider mb-2">
                <Users className="w-3.5 h-3.5" />
                <span>React Bits • 3D Holographic Profile Cards</span>
              </div>
              <h2 className={`text-2xl sm:text-3xl font-serif font-bold ${isLight ? "text-slate-900" : "text-white"}`}>
                Cuerpo de Abogados & Socios Titulares
              </h2>
              <p className={`text-xs sm:text-sm mt-1 max-w-2xl ${isLight ? "text-slate-600" : "text-slate-400"}`}>
                Conoce a nuestros litigantes de alto impacto. Pasa el cursor sobre cada credencial para interactuar con la refracción holográfica tridimensional, inclinación física y contactar directamente a cada especialista.
              </p>
            </div>

            <Link
              href="/registro-cliente"
              className="inline-flex items-center space-x-1.5 text-xs text-amber-500 font-bold hover:underline"
            >
              <span>Solicitar asignación de abogado</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center">
            {abogadosEquipo.map((abogado, idx) => (
              <ProfileCard
                key={idx}
                name={abogado.name}
                title={abogado.title}
                handle={abogado.handle}
                status={abogado.status}
                statusColor={abogado.statusColor}
                contactText={abogado.contactText}
                avatarUrl={abogado.avatarUrl}
                miniAvatarUrl={abogado.miniAvatarUrl}
                backdropColor={abogado.backdropColor}
                holo={abogado.holo}
                glare={abogado.glare}
                tiltStrength={abogado.tiltStrength}
                parallax={abogado.parallax}
                theme={isLight ? "light" : "dark"}
                onContactClick={() => {
                  window.location.href = `/registro-cliente?abogado=${encodeURIComponent(abogado.name)}`;
                }}
              />
            ))}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/[0.08] fluid-glass py-6 text-center text-xs text-slate-500">
        Specter & Asociados • Plataforma Jurídica Multitenant • República de Colombia
      </footer>
    </div>
  );
}
