export interface ArticuloConstitucional {
  numero: number;
  titulo: string;
  capitulo: string;
  epigrafe?: string;
  contenido: string;
  relevanciaLegal: "fundamental" | "social" | "colectivo" | "proteccion" | "institucional";
  palabrasClave: string[];
  concordancias?: string[];
}

export const PREAMBULO_CONSTITUCION = `EL PUEBLO DE COLOMBIA, en ejercicio de su poder soberano, representado por sus delegatarios a la Asamblea Nacional Constituyente, invocando la protección de Dios, y con el fin de fortalecer la unidad de la Nación y asegurar a sus integrantes la vida, la convivencia, el trabajo, la justicia, la igualdad, el conocimiento, la libertad y la paz, dentro de un marco jurídico, democrático y participativo que garantice un orden político, económico y social justo, y comprometido a impulsar la integración de la comunidad latinoamericana decreta, sanciona y promulga la siguiente CONSTITUCION POLITICA DE COLOMBIA.`;

export const ARTICULOS_CONSTITUCION: ArticuloConstitucional[] = [
  {
    numero: 1,
    titulo: "Título I: De los Principios Fundamentales",
    capitulo: "Principios Fundamentales",
    epigrafe: "Estado Social de Derecho y Dignidad Humana",
    contenido:
      "Colombia es un Estado social de derecho, organizado en forma de República unitaria, descentralizada, con autonomía de sus entidades territoriales, democrática, participativa y pluralista, fundada en el respeto de la dignidad humana, en el trabajo y la solidaridad de las personas que la integran y en la prevalencia del interés general.",
    relevanciaLegal: "fundamental",
    palabrasClave: ["estado social de derecho", "dignidad humana", "solidaridad", "interes general"],
  },
  {
    numero: 2,
    titulo: "Título I: De los Principios Fundamentales",
    capitulo: "Principios Fundamentales",
    epigrafe: "Fines Esenciales del Estado",
    contenido:
      "Son fines esenciales del Estado: servir a la comunidad, promover la prosperidad general y garantizar la efectividad de los principios, derechos y deberes consagrados en la Constitución; facilitar la participación de todos en las decisiones que los afectan y en la vida económica, política, administrativa y cultural de la Nación; defender la independencia nacional, mantener la integridad territorial y asegurar la convivencia pacífica y la vigencia de un orden justo.\n\nLas autoridades de la República están instituidas para proteger a todas las personas residentes en Colombia, en su vida, honra, bienes, creencias, y demás derechos y libertades, y para asegurar el cumplimiento de los deberes sociales del Estado y de los particulares.",
    relevanciaLegal: "fundamental",
    palabrasClave: ["fines del estado", "convivencia pacifica", "orden justo", "proteccion a las personas"],
  },
  {
    numero: 4,
    titulo: "Título I: De los Principios Fundamentales",
    capitulo: "Principios Fundamentales",
    epigrafe: "Supremacía Constitucional",
    contenido:
      "La Constitución es norma de normas. En todo caso de incompatibilidad entre la Constitución y la ley u otra norma jurídica, se aplicarán las disposiciones constitucionales. Es deber de los nacionales y de los extranjeros en Colombia acatar la Constitución y las leyes, y respetar y obedecer a las autoridades.",
    relevanciaLegal: "fundamental",
    palabrasClave: ["norma de normas", "supremacia", "incompatibilidad", "excepcion de inconstitucionalidad"],
  },
  {
    numero: 11,
    titulo: "Título II: De los Derechos, las Garantías y los Deberes",
    capitulo: "Capítulo 1: De los Derechos Fundamentales",
    epigrafe: "Derecho a la Vida",
    contenido:
      "El derecho a la vida es inviolable. No habrá pena de muerte.",
    relevanciaLegal: "fundamental",
    palabrasClave: ["vida", "inviolable", "salud", "riesgo vital"],
  },
  {
    numero: 12,
    titulo: "Título II: De los Derechos, las Garantías y los Deberes",
    capitulo: "Capítulo 1: De los Derechos Fundamentales",
    epigrafe: "Prohibición de Desaparición Forzada y Torturas",
    contenido:
      "Nadie será sometido a desaparición forzada, a torturas ni a tratos o penas crueles, inhumanos o degradantes.",
    relevanciaLegal: "fundamental",
    palabrasClave: ["desaparicion forzada", "tortura", "tratos crueles", "conflicto armado", "victimas"],
  },
  {
    numero: 13,
    titulo: "Título II: De los Derechos, las Garantías y los Deberes",
    capitulo: "Capítulo 1: De los Derechos Fundamentales",
    epigrafe: "Derecho a la Igualdad y Especial Protección Constitucional",
    contenido:
      "Todas las personas nacen libres e iguales ante la ley, recibirán la misma protección y trato de las autoridades y gozarán de los mismos derechos, libertades y oportunidades sin ninguna discriminación por razones de sexo, raza, origen nacional o familiar, lengua, religión, opinión política o filosófica.\n\nEl Estado promoverá las condiciones para que la igualdad sea real y efectiva y adoptará medidas en favor de grupos discriminados o marginados.\n\nEl Estado protegerá especialmente a aquellas personas que por su condición económica, física o mental, se encuentren en circunstancia de debilidad manifiesta y sancionará los abusos o maltratos que contra ellas se cometan.",
    relevanciaLegal: "fundamental",
    palabrasClave: ["igualdad", "no discriminacion", "debilidad manifiesta", "especial proteccion", "victimas", "desplazados"],
  },
  {
    numero: 14,
    titulo: "Título II: De los Derechos, las Garantías y los Deberes",
    capitulo: "Capítulo 1: De los Derechos Fundamentales",
    epigrafe: "Personalidad Jurídica",
    contenido:
      "Toda persona tiene derecho al reconocimiento de su personalidad jurídica.",
    relevanciaLegal: "fundamental",
    palabrasClave: ["personalidad juridica", "identidad", "registro civil"],
  },
  {
    numero: 15,
    titulo: "Título II: De los Derechos, las Garantías y los Deberes",
    capitulo: "Capítulo 1: De los Derechos Fundamentales",
    epigrafe: "Habeas Data, Intimidad y Buen Nombre",
    contenido:
      "Todas las personas tienen derecho a su intimidad personal y familiar y a su buen nombre, y el Estado debe respetarlos y hacerlos respetar. De igual modo, tienen derecho a conocer, actualizar y rectificar las informaciones que se hayan recogido sobre ellas en bancos de datos y en archivos de entidades públicas y privadas.\n\nEn la recolección, tratamiento y circulación de datos se respetarán la libertad y demás garantías consagradas en la Constitución. La correspondencia y demás formas de comunicación privada son inviolables.",
    relevanciaLegal: "fundamental",
    palabrasClave: ["habeas data", "intimidad", "buen nombre", "datos personales"],
  },
  {
    numero: 16,
    titulo: "Título II: De los Derechos, las Garantías y los Deberes",
    capitulo: "Capítulo 1: De los Derechos Fundamentales",
    epigrafe: "Libre Desarrollo de la Personalidad",
    contenido:
      "Todas las personas tienen derecho al libre desarrollo de su personalidad sin más limitaciones que las que imponen los derechos de los demás y el orden jurídico.",
    relevanciaLegal: "fundamental",
    palabrasClave: ["libre desarrollo", "autonomia", "personalidad"],
  },
  {
    numero: 21,
    titulo: "Título II: De los Derechos, las Garantías y los Deberes",
    capitulo: "Capítulo 1: De los Derechos Fundamentales",
    epigrafe: "Derecho a la Honra",
    contenido:
      "Se garantiza el derecho a la honra. La ley señalará la forma de su protección.",
    relevanciaLegal: "fundamental",
    palabrasClave: ["honra", "reputacion", "injuria", "calumnia"],
  },
  {
    numero: 22,
    titulo: "Título II: De los Derechos, las Garantías y los Deberes",
    capitulo: "Capítulo 1: De los Derechos Fundamentales",
    epigrafe: "Derecho a la Paz",
    contenido:
      "La paz es un derecho y un deber de obligatorio cumplimiento.",
    relevanciaLegal: "fundamental",
    palabrasClave: ["paz", "conflicto armado", "convivencia"],
  },
  {
    numero: 23,
    titulo: "Título II: De los Derechos, las Garantías y los Deberes",
    capitulo: "Capítulo 1: De los Derechos Fundamentales",
    epigrafe: "Derecho de Petición",
    contenido:
      "Toda persona tiene derecho a presentar peticiones respetuosas a las autoridades por motivos de interés general o particular y a obtener pronta resolución. El legislador podrá reglamentar su ejercicio ante organizaciones privadas para garantizar los derechos fundamentales.",
    relevanciaLegal: "fundamental",
    palabrasClave: ["derecho de peticion", "autoridades", "pronta resolucion", "tutela"],
  },
  {
    numero: 25,
    titulo: "Título II: De los Derechos, las Garantías y los Deberes",
    capitulo: "Capítulo 1: De los Derechos Fundamentales",
    epigrafe: "Derecho al Trabajo",
    contenido:
      "El trabajo es un derecho y una obligación social y goza, en todas sus modalidades, de la especial protección del Estado. Toda persona tiene derecho a un trabajo en condiciones dignas y justas.",
    relevanciaLegal: "fundamental",
    palabrasClave: ["trabajo", "estabilidad laboral", "condiciones dignas", "salario"],
  },
  {
    numero: 28,
    titulo: "Título II: De los Derechos, las Garantías y los Deberes",
    capitulo: "Capítulo 1: De los Derechos Fundamentales",
    epigrafe: "Libertad Individual y Mandamiento Judicial Escrito",
    contenido:
      "Toda persona es libre. Nadie puede ser molestado en su persona o familia, ni reducido a prisión o arresto, ni detenido, ni su domicilio registrado, sino en virtud de mandamiento escrito de autoridad judicial competente, con las formalidades legales y por motivo previamente definido en la ley. La persona detenida preventivamente será puesta a disposición del juez competente dentro de las treinta y seis horas siguientes.",
    relevanciaLegal: "fundamental",
    palabrasClave: ["libertad", "captura ilegal", "domicilio", "36 horas", "retencion"],
  },
  {
    numero: 29,
    titulo: "Título II: De los Derechos, las Garantías y los Deberes",
    capitulo: "Capítulo 1: De los Derechos Fundamentales",
    epigrafe: "El Debido Proceso",
    contenido:
      "El debido proceso se aplicará a toda clase de actuaciones judiciales y administrativas.\n\nNadie podrá ser juzgado sino conforme a leyes preexistentes al acto que se le imputa, ante juez o tribunal competente y con observancia de la plenitud de las formas propias de cada juicio.\n\nEn materia penal, la ley permisiva o favorable, aun cuando sea posterior, se aplicará de preferencia a la restrictiva o desfavorable.\n\nToda persona se presume inocente mientras no se la haya declarado judicialmente culpable. Quien sea sindicado tiene derecho a la defensa y a la asistencia de un abogado escogido por él, o de oficio, durante la investigación y el juzgamiento; a un debido proceso público sin dilaciones injustificadas; a presentar pruebas y a controvertir las que se alleguen en su contra; a impugnar la sentencia condenatoria, y a no ser juzgado dos veces por el mismo hecho.\n\nEs nula, de pleno derecho, la prueba obtenida con violación del debido proceso.",
    relevanciaLegal: "fundamental",
    palabrasClave: ["debido proceso", "presuncion de inocencia", "defensa tecnica", "nulidad", "non bis in idem"],
  },
  {
    numero: 30,
    titulo: "Título II: De los Derechos, las Garantías y los Deberes",
    capitulo: "Capítulo 1: De los Derechos Fundamentales",
    epigrafe: "Habeas Corpus",
    contenido:
      "Quien estuviere privado de su libertad, y creyere estarlo ilegalmente, tiene derecho a invocar ante cualquier autoridad judicial, en todo tiempo, por sí o por interpuesta persona, el Habeas Corpus, el cual debe resolverse en el término de treinta y seis horas.",
    relevanciaLegal: "fundamental",
    palabrasClave: ["habeas corpus", "libertad", "privacion ilegal", "36 horas"],
  },
  {
    numero: 43,
    titulo: "Título II: De los Derechos, las Garantías y los Deberes",
    capitulo: "Capítulo 2: De los Derechos Sociales, Económicos y Culturales",
    epigrafe: "Protección a la Mujer y a la Madre Cabeza de Familia",
    contenido:
      "La mujer y el hombre tienen iguales derechos y oportunidades. La mujer no podrá ser sometida a ninguna clase de discriminación. Durante el embarazo y después del parto gozará de especial asistencia y protección del Estado, y recibirá de este subsidio alimentario si entonces estuviere desempleada o desamparada.\n\nEl Estado apoyará de manera especial a la mujer cabeza de familia.",
    relevanciaLegal: "social",
    palabrasClave: ["madre cabeza de familia", "mujer", "igualdad de genero", "especial proteccion"],
  },
  {
    numero: 44,
    titulo: "Título II: De los Derechos, las Garantías y los Deberes",
    capitulo: "Capítulo 2: De los Derechos Sociales, Económicos y Culturales",
    epigrafe: "Derechos Prevalentes de los Niños",
    contenido:
      "Son derechos fundamentales de los niños: la vida, la integridad física, la salud y la seguridad social, la alimentación equilibrada, su nombre y nacionalidad, tener una familia y no ser separados de ella, el cuidado y amor, la educación y la cultura, la recreación y la libre expresión de su opinión... Los derechos de los niños prevalecen sobre los derechos de los demás.",
    relevanciaLegal: "social",
    palabrasClave: ["niños", "interes superior", "derechos prevalentes", "familia"],
  },
  {
    numero: 46,
    titulo: "Título II: De los Derechos, las Garantías y los Deberes",
    capitulo: "Capítulo 2: De los Derechos Sociales, Económicos y Culturales",
    epigrafe: "Protección a la Tercera Edad",
    contenido:
      "El Estado, la sociedad y la familia concurrirán para la protección y la asistencia de las personas de la tercera edad y promoverán su integración a la vida activa y comunitaria. El Estado les garantizará los servicios de la seguridad social integral y el subsidio alimentario en caso de indigencia.",
    relevanciaLegal: "social",
    palabrasClave: ["tercera edad", "adulto mayor", "pension", "asistencia social"],
  },
  {
    numero: 48,
    titulo: "Título II: De los Derechos, las Garantías y los Deberes",
    capitulo: "Capítulo 2: De los Derechos Sociales, Económicos y Culturales",
    epigrafe: "Seguridad Social Integral",
    contenido:
      "La Seguridad Social es un servicio público de carácter obligatorio que se prestará bajo la dirección, coordinación y control del Estado, en sujeción a los principios de eficiencia, universalidad y solidaridad, en los términos que establezca la Ley. Se garantiza a todos los habitantes el derecho irrenunciable a la Seguridad Social.",
    relevanciaLegal: "social",
    palabrasClave: ["seguridad social", "pension", "solidaridad", "jubilacion"],
  },
  {
    numero: 49,
    titulo: "Título II: De los Derechos, las Garantías y los Deberes",
    capitulo: "Capítulo 2: De los Derechos Sociales, Económicos y Culturales",
    epigrafe: "Derecho a la Salud y Saneamiento Ambiental",
    contenido:
      "La atención de la salud y el saneamiento ambiental son servicios públicos a cargo del Estado. Se garantiza a todas las personas el acceso a los servicios de promoción, protección y recuperación de la salud.\n\nCorresponde al Estado organizar, dirigir y reglamentar la prestación de servicios de salud a los habitantes y de saneamiento ambiental conforme a los principios de eficiencia, universalidad y solidaridad.",
    relevanciaLegal: "social",
    palabrasClave: ["salud", "medicamentos", "tutela eps", "tratamiento medico", "vida digna"],
  },
  {
    numero: 53,
    titulo: "Título II: De los Derechos, las Garantías y los Deberes",
    capitulo: "Capítulo 2: De los Derechos Sociales, Económicos y Culturales",
    epigrafe: "Estatuto del Trabajo y Principios Mínimos Fundamentales",
    contenido:
      "El Congreso expedirá el estatuto del trabajo. La ley correspondiente tendrá en cuenta por lo menos los siguientes principios mínimos fundamentales:\nIgualdad de oportunidades para los trabajadores; remuneración mínima vital y móvil, proporcional a la cantidad y calidad de trabajo; estabilidad en el empleo; irrenunciabilidad a los beneficios mínimos establecidos en normas laborales; facultades para transigir y conciliar sobre derechos inciertos y discutibles; situación más favorable al trabajador en caso de duda en la aplicación e interpretación de las fuentes formales de derecho (in dubio pro operario); primacía de la realidad sobre formalidades establecidas por los sujetos de las relaciones laborales; garantía a la seguridad social...",
    relevanciaLegal: "social",
    palabrasClave: ["estatuto del trabajo", "primacia de la realidad", "estabilidad laboral reforzada", "in dubio pro operario"],
  },
  {
    numero: 86,
    titulo: "Título II: De los Derechos, las Garantías y los Deberes",
    capitulo: "Capítulo 4: De la Protección y Aplicación de los Derechos",
    epigrafe: "La Acción de Tutela (Mecanismo Constitucional Supremo)",
    contenido:
      "Toda persona tendrá acción de tutela para reclamar ante los jueces, en todo momento y lugar, mediante un procedimiento preferente y sumario, por sí misma o por quien actúe a su nombre, la protección inmediata de sus derechos constitucionales fundamentales, cuando quiera que éstos resulten vulnerados o amenazados por la acción o la omisión de cualquier autoridad pública.\n\nLa protección consistirá en una orden para que aquél respecto de quien se solicita la tutela, actúe o se abstenga de hacerlo. El fallo, que será de inmediato cumplimiento, podrá impugnarse ante el juez competente y, en todo caso, éste lo remitirá a la Corte Constitucional para su eventual revisión.\n\nEsta acción sólo procederá cuando el afectado no disponga de otro medio de defensa judicial, salvo que aquella se utilice como mecanismo transitorio para evitar un perjuicio irremediable.\n\nEn ningún caso podrán transcurrir más de diez días entre la solicitud de tutela y su resolución.",
    relevanciaLegal: "proteccion",
    palabrasClave: ["accion de tutela", "amparo", "derechos fundamentales", "perjuicio irremediable", "diez dias", "inmediato cumplimiento"],
  },
  {
    numero: 87,
    titulo: "Título II: De los Derechos, las Garantías y los Deberes",
    capitulo: "Capítulo 4: De la Protección y Aplicación de los Derechos",
    epigrafe: "Acción de Cumplimiento",
    contenido:
      "Toda persona podrá acudir ante la autoridad judicial para hacer efectivo el cumplimiento de una ley o un acto administrativo. En caso de prosperar la acción, la sentencia ordenará a la autoridad renuente el cumplimiento del deber omitido.",
    relevanciaLegal: "proteccion",
    palabrasClave: ["accion de cumplimiento", "acto administrativo", "deber omitido", "ley"],
  },
  {
    numero: 88,
    titulo: "Título II: De los Derechos, las Garantías y los Deberes",
    capitulo: "Capítulo 4: De la Protección y Aplicación de los Derechos",
    epigrafe: "Acciones Populares y de Grupo",
    contenido:
      "La ley regulará las acciones populares para la protección de los derechos e intereses colectivos, relacionados con el patrimonio, el espacio, la seguridad y la salubridad públicos, la moral administrativa, el ambiente, la libre competencia económica y otros de similar naturaleza que se definen en ella. También regulará las acciones originadas en los daños ocasionados a un número plural de personas (acciones de grupo).",
    relevanciaLegal: "colectivo",
    palabrasClave: ["acciones populares", "acciones de grupo", "derechos colectivos", "medio ambiente", "moral administrativa"],
  },
  {
    numero: 90,
    titulo: "Título II: De los Derechos, las Garantías y los Deberes",
    capitulo: "Capítulo 4: De la Protección y Aplicación de los Derechos",
    epigrafe: "Responsabilidad Patrimonial del Estado",
    contenido:
      "El Estado responderá patrimonialmente por los daños antijurídicos que le sean imputables, causados por la acción o la omisión de las autoridades públicas.\n\nEn el evento de ser condenado el Estado a la reparación patrimonial de uno de tales daños, que haya sido consecuencia de la conducta dolosa o gravemente culposa de un agente suyo, aquel deberá repetir contra éste.",
    relevanciaLegal: "proteccion",
    palabrasClave: ["responsabilidad del estado", "daño antijuridico", "reparacion directa", "accion de repeticion"],
  },
  {
    numero: 93,
    titulo: "Título II: De los Derechos, las Garantías y los Deberes",
    capitulo: "Capítulo 4: De la Protección y Aplicación de los Derechos",
    epigrafe: "Bloque de Constitucionalidad y Tratados Internacionales de DDHH",
    contenido:
      "Los tratados y convenios internacionales ratificados por el Congreso, que reconocen los derechos humanos y que prohiben su limitación en los estados de excepción, prevalecen en el orden interno. Los derechos y deberes consagrados en esta Carta, se interpretarán de conformidad con los tratados internacionales sobre derechos humanos ratificados por Colombia.",
    relevanciaLegal: "proteccion",
    palabrasClave: ["bloque de constitucionalidad", "derechos humanos", "tratados internacionales", "corte interamericana", "dih"],
  },
  {
    numero: 228,
    titulo: "Título VIII: De la Rama Judicial",
    capitulo: "Capítulo 1: De las Disposiciones Generales",
    epigrafe: "Administración de Justicia y Prevalencia del Derecho Sustancial",
    contenido:
      "La Administración de Justicia es función pública. Sus decisiones son independientes. Las actuaciones serán públicas y permanentes con las excepciones que establezca la ley y en ellas prevalecerá el derecho sustancial. Los términos procesales se observarán con diligencia y su incumplimiento será sancionado. Su funcionamiento será desconcentrado y autónomo.",
    relevanciaLegal: "institucional",
    palabrasClave: ["administracion de justicia", "prevalencia derecho sustancial", "independencia judicial", "celeridad"],
  },
  {
    numero: 229,
    titulo: "Título VIII: De la Rama Judicial",
    capitulo: "Capítulo 1: De las Disposiciones Generales",
    epigrafe: "Acceso a la Administración de Justicia",
    contenido:
      "Se garantiza el derecho de toda persona para acceder a la administración de justicia. La ley indicará en qué casos podrá hacerlo sin la representación de abogado.",
    relevanciaLegal: "institucional",
    palabrasClave: ["acceso a la justicia", "tutela sin abogado", "defensa publica"],
  },
  {
    numero: 241,
    titulo: "Título VIII: De la Rama Judicial",
    capitulo: "Capítulo 4: De la Jurisdicción Constitucional",
    epigrafe: "Funciones de la Corte Constitucional",
    contenido:
      "A la Corte Constitucional se le confía la guarda de la integridad y supremacía de la Constitución, en los estrictos y precisos términos de este artículo. Entre sus funciones principales: Revisar, en la forma que determine la ley, las decisiones judiciales relacionadas con la acción de tutela de los derechos constitucionales (numeral 9).",
    relevanciaLegal: "institucional",
    palabrasClave: ["corte constitucional", "guarda de la constitucion", "revision de tutelas", "precedente constitucional"],
  },
];
