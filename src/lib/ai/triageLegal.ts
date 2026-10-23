export interface AbogadoCandidato {
  id: string;
  nombre: string | null;
  email: string;
  role: string;
  experienciaAnios: number;
}

export interface EntradaTriajeIA {
  nombreCliente: string;
  tipoDocumento: string;
  numeroDocumento: string;
  condicionEspecial: string;
  tituloCaso: string;
  descripcion?: string | null;
  esFuerzaMayor: boolean;
  abogados: AbogadoCandidato[];
}

export interface DictamenTriajeIA {
  requiereAbogadoMayor: boolean;
  categoriaCaso: "ESPECIAL_PROTECCION_VULNERABLE" | "FUERZA_MAYOR_URGENTE" | "TRAMITE_ORDINARIO";
  prioridad: "baja" | "media" | "alta" | "urgente";
  nivelAbogadoExigido: "senior" | "junior";
  abogadoAsignado: {
    id: string;
    nombre: string;
    role: string;
    experienciaAnios: number;
    email: string;
    categoria: "Abogado Mayor (Socio/Senior)" | "Abogado Menor (Asociado/Junior)";
  };
  fundamentoConstitucional: {
    articulos: number[];
    precedente: string;
    dictamenJuridico: string;
  };
}

/**
 * Motor de Inteligencia Artificial para Triaje Jurídico y Asignación Automatizada de Abogados.
 * 
 * Regla Jurídica Primaria:
 * 1. Si el cliente es Víctima del Conflicto Armado (Ley 1448 de 2011), persona en Desplazamiento Forzado,
 *    o su caso involucra Fuerza Mayor / Tutela Urgente:
 *    -> El sistema IA asigna AUTOMÁTICAMENTE a un "Abogado Mayor" (Socio Director o Abogado Senior con mayor experiencia).
 * 2. Si el caso es de naturaleza común u ordinaria sin vulnerabilidad manifiesta:
 *    -> El sistema IA asigna AUTOMÁTICAMENTE a un "Abogado Menor" (Abogado Junior o Asociado).
 */
export function ejecutarTriajeLegalIA(entrada: EntradaTriajeIA): DictamenTriajeIA {
  const { condicionEspecial, tituloCaso, descripcion, esFuerzaMayor, abogados } = entrada;

  const textoCompleto = `${tituloCaso} ${descripcion || ""}`.toLowerCase();

  // Detección de patrones de alto riesgo o violación constitucional
  const esVictimaConflicto = condicionEspecial === "victima_conflicto";
  const esDesplazado = condicionEspecial === "desplazado";
  const esPoblacionVulnerable =
    esVictimaConflicto ||
    esDesplazado ||
    condicionEspecial === "madre_cabeza_familia" ||
    condicionEspecial === "adulto_mayor" ||
    condicionEspecial === "migrante";

  const contieneTerminosGraves =
    textoCompleto.includes("amenaza") ||
    textoCompleto.includes("despojo") ||
    textoCompleto.includes("vida") ||
    textoCompleto.includes("cirugia") ||
    textoCompleto.includes("medicamento") ||
    textoCompleto.includes("desalojo") ||
    textoCompleto.includes("tortura") ||
    textoCompleto.includes("violencia");

  // Decisión de la IA
  const requiereMayor =
    esVictimaConflicto || esDesplazado || esFuerzaMayor || contieneTerminosGraves;

  // Clasificación de abogados en Mayores y Menores
  const abogadosOrdenadosPorExp = [...abogados].sort(
    (a, b) => b.experienciaAnios - a.experienciaAnios
  );

  const abogadosMayores = abogadosOrdenadosPorExp.filter(
    (abg) => abg.role === "socio" || abg.role === "senior" || abg.experienciaAnios >= 8
  );

  const abogadosMenores = [...abogadosOrdenadosPorExp].reverse().filter(
    (abg) => abg.role === "junior" || abg.role === "asociado" || abg.experienciaAnios < 8
  );

  let abogadoSeleccionado: AbogadoCandidato;
  let categoriaAbogado: "Abogado Mayor (Socio/Senior)" | "Abogado Menor (Asociado/Junior)";

  if (requiereMayor) {
    // Asignar al abogado mayor con mayor experiencia en la firma
    abogadoSeleccionado =
      abogadosMayores.length > 0 ? abogadosMayores[0] : abogadosOrdenadosPorExp[0];
    categoriaAbogado = "Abogado Mayor (Socio/Senior)";
  } else {
    // Asignar al abogado menor
    abogadoSeleccionado =
      abogadosMenores.length > 0
        ? abogadosMenores[0]
        : abogadosOrdenadosPorExp[abogadosOrdenadosPorExp.length - 1];
    categoriaAbogado = "Abogado Menor (Asociado/Junior)";
  }

  // Si no hay ningún abogado registrado, generamos una referencia de guardia
  if (!abogadoSeleccionado) {
    abogadoSeleccionado = {
      id: "abg_titular_defecto",
      nombre: requiereMayor ? "Harvey Specter (Socio Director)" : "Mike Ross (Abogado Asociado)",
      email: "litigio@specterlaw.co",
      role: requiereMayor ? "socio" : "junior",
      experienciaAnios: requiereMayor ? 15 : 2,
    };
  }

  // Generar fundamentación constitucional y jurisprudencial colombiana
  if (esVictimaConflicto) {
    return {
      requiereAbogadoMayor: true,
      categoriaCaso: "ESPECIAL_PROTECCION_VULNERABLE",
      prioridad: "urgente",
      nivelAbogadoExigido: "senior",
      abogadoAsignado: {
        ...abogadoSeleccionado,
        nombre: abogadoSeleccionado.nombre || abogadoSeleccionado.email,
        categoria: "Abogado Mayor (Socio/Senior)",
      },
      fundamentoConstitucional: {
        articulos: [13, 86, 93],
        precedente: "Ley 1448 de 2011 (Ley de Víctimas) y Sentencia T-025 de 2004",
        dictamenJuridico:
          "DIAGNÓSTICO IA: El accionante ostenta la condición de Víctima del Conflicto Armado Interno. Bajo el mandato del Artículo 13 Superior (debilidad manifiesta) y la jurisprudencia unificada de la Corte Constitucional, se activa de forma automática el deber de especial diligencia y protección reforzada. Se asigna al Abogado Mayor con más alta experiencia para la estructuración de la Acción de Tutela o reparación integral directa.",
      },
    };
  }

  if (esDesplazado) {
    return {
      requiereAbogadoMayor: true,
      categoriaCaso: "ESPECIAL_PROTECCION_VULNERABLE",
      prioridad: "urgente",
      nivelAbogadoExigido: "senior",
      abogadoAsignado: {
        ...abogadoSeleccionado,
        nombre: abogadoSeleccionado.nombre || abogadoSeleccionado.email,
        categoria: "Abogado Mayor (Socio/Senior)",
      },
      fundamentoConstitucional: {
        articulos: [11, 13, 28, 86],
        precedente: "Sentencia T-025 de 2004 (Estado de Cosas Inconstitucional)",
        dictamenJuridico:
          "DIAGNÓSTICO IA: Caso clasificado con gravedad manifiesta debido a desplazamiento forzado. La Corte Constitucional reconoció un Estado de Cosas Inconstitucional que exige medidas urgentes de restablecimiento de derechos. Se delega directamente a un Abogado Mayor de la firma para solicitar medidas cautelares inmediatas.",
      },
    };
  }

  if (esFuerzaMayor || contieneTerminosGraves) {
    return {
      requiereAbogadoMayor: true,
      categoriaCaso: "FUERZA_MAYOR_URGENTE",
      prioridad: "urgente",
      nivelAbogadoExigido: "senior",
      abogadoAsignado: {
        ...abogadoSeleccionado,
        nombre: abogadoSeleccionado.nombre || abogadoSeleccionado.email,
        categoria: "Abogado Mayor (Socio/Senior)",
      },
      fundamentoConstitucional: {
        articulos: [11, 49, 86],
        precedente: "Artículo 86 de la Constitución (Amparo preferente y sumario)",
        dictamenJuridico:
          "DIAGNÓSTICO IA: Caso con presunción de Fuerza Mayor y riesgo inminente a derechos fundamentales inalienables (Art. 11 vida, Art. 49 salud). El sistema asigna inmediatamente a un Abogado Mayor para interponer la Acción de Tutela con solicitud de medida provisional perentoria antes de 24 horas.",
      },
    };
  }

  // Caso ordinario
  return {
    requiereAbogadoMayor: false,
    categoriaCaso: "TRAMITE_ORDINARIO",
    prioridad: "media",
    nivelAbogadoExigido: "junior",
    abogadoAsignado: {
      ...abogadoSeleccionado,
      nombre: abogadoSeleccionado.nombre || abogadoSeleccionado.email,
      categoria: "Abogado Menor (Asociado/Junior)",
    },
    fundamentoConstitucional: {
      articulos: [29, 209, 228],
      precedente: "Artículo 29 de la Constitución (Garantía General del Debido Proceso)",
      dictamenJuridico:
        "DIAGNÓSTICO IA: Caso de naturaleza ordinaria o trámite regular. No se detectan vulneraciones a sujetos de especial protección ni riesgo vital. Conforme a los principios de celeridad y eficiencia (Art. 209), el expediente se asigna a un Abogado Menor (Asociado/Junior) bajo supervisión de la firma.",
    },
  };
}
