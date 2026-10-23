import { z } from "zod";

export const tipoDocumentoEnum = z.enum([
  "CC", // Cédula de Ciudadanía
  "CE", // Cédula de Extranjería
  "TI", // Tarjeta de Identidad
  "Pasaporte",
  "PPT", // Permiso por Protección Temporal (población migrante)
]);

export const condicionEspecialEnum = z.enum([
  "ninguna",
  "victima_conflicto", // Ley 1448 de Víctimas
  "desplazado", // Población en desplazamiento forzado
  "migrante", // Migrantes / refugiados
  "madre_cabeza_familia",
  "adulto_mayor",
  "otro",
]);

export const registroClientePublicoSchema = z.object({
  nombre: z
    .string()
    .min(3, "El nombre completo debe tener al menos 3 caracteres")
    .max(100),
  tipoDocumento: tipoDocumentoEnum,
  numeroDocumento: z
    .string()
    .min(4, "El número de documento debe tener al menos 4 caracteres")
    .max(30),
  email: z.string().email("Correo electrónico inválido").optional().or(z.literal("")),
  telefono: z.string().min(7, "Teléfono inválido").optional().or(z.literal("")),
  condicionEspecial: condicionEspecialEnum.default("ninguna"),
  tituloCaso: z
    .string()
    .min(5, "El asunto o pretensión debe tener al menos 5 caracteres")
    .max(150),
  descripcion: z.string().optional(),
  esFuerzaMayor: z.boolean().default(false),
  modalidadArancel: z.enum(["amparo_victimas", "ordinario", "urgente", "fast_track"]).default("amparo_victimas"),
  tenantId: z.string().optional(), // ID del despacho al que acude
});

export type RegistroClientePublicoInput = z.infer<
  typeof registroClientePublicoSchema
>;
