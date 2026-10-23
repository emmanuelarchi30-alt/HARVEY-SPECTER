import { z } from "zod";

export const registerSchema = z.object({
  tenantName: z
    .string()
    .min(3, "El nombre del despacho debe tener al menos 3 caracteres")
    .max(100, "El nombre del despacho no puede exceder 100 caracteres"),
  nombre: z
    .string()
    .min(2, "El nombre completo del abogado debe tener al menos 2 caracteres")
    .max(100),
  email: z
    .string()
    .email("Ingrese un correo electrónico válido")
    .toLowerCase()
    .trim(),
  password: z
    .string()
    .min(8, "La contraseña debe tener al menos 8 caracteres")
    .max(100, "La contraseña no puede exceder 100 caracteres"),
  cedula: z.string().optional().default("1020304050"),
  role: z
    .enum(["socio", "senior", "junior", "admin"])
    .default("socio"),
  experienciaAnios: z
    .number()
    .int()
    .min(0, "Los años de experiencia deben ser 0 o más")
    .max(60, "Los años de experiencia no pueden exceder 60")
    .default(5),
});

export type RegisterInput = z.infer<typeof registerSchema>;

export const loginSchema = z.object({
  email: z
    .string()
    .min(2, "Ingrese su correo institucional, cédula o usuario")
    .toLowerCase()
    .trim(),
  password: z.string().min(1, "La contraseña es requerida"),
});

export type LoginInput = z.infer<typeof loginSchema>;
