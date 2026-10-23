"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

export type Language = "es" | "en";

export interface Translations {
  nav_home: string;
  nav_consult: string;
  nav_register_case: string;
  nav_constitution: string;
  nav_pricing: string;
  nav_lawyer_access: string;
  nav_register_firm: string;
  hero_tag: string;
  hero_title_1: string;
  hero_title_highlight: string;
  hero_desc: string;
  btn_file_case: string;
  btn_track_case: string;
  btn_constitution: string;
  badge_ai: string;
  lbl_lawyer_mayor: string;
  lbl_lawyer_menor: string;
  lbl_victim_conflict: string;
  lbl_displaced: string;
  lbl_urgent_priority: string;
  lbl_study_time: string;
  lbl_fast_track: string;
}

const translationsMap: Record<Language, Translations> = {
  es: {
    nav_home: "Inicio",
    nav_consult: "Consultar mi Caso",
    nav_register_case: "Radicar Caso con IA",
    nav_constitution: "Constitución 1991",
    nav_pricing: "Aranceles & Tiempos",
    nav_lawyer_access: "Acceso Abogados",
    nav_register_firm: "Registrar Despacho",
    hero_tag: "Plataforma SaaS Multitenant de Gestión Jurídica & Tutelas",
    hero_title_1: "Litigio Estratégico de Élite con",
    hero_title_highlight: "Inteligencia Constitucional",
    hero_desc:
      "Inspirada en el rigor procesal de las firmas más prestigiosas y adaptada íntegramente al ordenamiento constitucional colombiano. Asignación inteligente por IA: víctimas del conflicto armado y urgencias vitales son derivadas directamente a Abogados Mayores y Socios Directores.",
    btn_file_case: "Radicar Caso / Clientes (IA)",
    btn_track_case: "Consultar Estado de mi Radicado",
    btn_constitution: "Constitución Política (1991)",
    badge_ai: "Dictamen Jurídico Automatizado (IA)",
    lbl_lawyer_mayor: "Abogado Mayor (Socio Titular / Senior)",
    lbl_lawyer_menor: "Abogado Menor (Asociado)",
    lbl_victim_conflict: "Víctima del Conflicto Armado (Ley 1448)",
    lbl_displaced: "Desplazamiento Forzado (Sentencia T-025)",
    lbl_urgent_priority: "Prioridad Urgente",
    lbl_study_time: "Tiempo de Estudio",
    lbl_fast_track: "Despacho Inmediato (Fast Track)",
  },
  en: {
    nav_home: "Home",
    nav_consult: "Track My Case",
    nav_register_case: "File Case with AI",
    nav_constitution: "Constitution 1991",
    nav_pricing: "Legal Fees & Deadlines",
    nav_lawyer_access: "Lawyer Login",
    nav_register_firm: "Register Firm",
    hero_tag: "Multitenant SaaS Platform for Law Firms & Constitutional Injunctions",
    hero_title_1: "Elite Strategic Litigation with",
    hero_title_highlight: "Constitutional Intelligence",
    hero_desc:
      "Inspired by the procedural rigor of top-tier law firms and fully compliant with Colombian constitutional law. AI-driven triage: armed conflict victims and emergency writs of protection are automatically assigned to Senior Partners.",
    btn_file_case: "File Case / Citizen Intake (AI)",
    btn_track_case: "Track My Official Docket",
    btn_constitution: "Political Constitution (1991)",
    badge_ai: "Automated Legal Diagnosis (AI)",
    lbl_lawyer_mayor: "Senior Partner (Lead Counsel)",
    lbl_lawyer_menor: "Associate Lawyer (Junior Counsel)",
    lbl_victim_conflict: "Armed Conflict Victim (Law 1448)",
    lbl_displaced: "Forced Displaced Citizen (Ruling T-025)",
    lbl_urgent_priority: "Urgent Priority",
    lbl_study_time: "Study & Review Time",
    lbl_fast_track: "Fast Track Expedited Review",
  },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  t: Translations;
}

const LanguageContext = createContext<LanguageContextType>({
  language: "es",
  setLanguage: () => {},
  toggleLanguage: () => {},
  t: translationsMap.es,
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>("es");

  useEffect(() => {
    const saved = (localStorage.getItem("despacho_lang") as Language) || "es";
    setLanguageState(saved);
  }, []);

  function setLanguage(lang: Language) {
    setLanguageState(lang);
    localStorage.setItem("despacho_lang", lang);
  }

  function toggleLanguage() {
    const next: Language = language === "es" ? "en" : "es";
    setLanguage(next);
  }

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        toggleLanguage,
        t: translationsMap[language] || translationsMap.es,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
