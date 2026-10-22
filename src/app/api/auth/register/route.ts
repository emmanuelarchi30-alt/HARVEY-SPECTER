import { NextRequest } from "next/server";
import bcrypt from "bcryptjs";
import { publicPrisma } from "@/lib/db/publicClient";
import { registerSchema } from "@/lib/validation/auth";
import {
  generateTenantSchemaName,
  isValidSchemaName,
  signAuthToken,
} from "@/lib/auth/jwt";
import { setAuthCookie } from "@/lib/auth/cookies";
import { apiError, apiResponse } from "@/lib/http";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validation = registerSchema.safeParse(body);

    if (!validation.success) {
      return apiError(
        "Datos de registro inválidos",
        400,
        validation.error.flatten().fieldErrors
      );
    }

    const { tenantName, nombre, email, password, role, experienciaAnios } =
      validation.data;

    // Verificar si el correo ya existe en el schema público
    const existingUser = await publicPrisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return apiError(
        "El correo electrónico ya está registrado en la plataforma",
        409
      );
    }

    // Generar y validar nombre de schema seguro para el nuevo tenant
    const schemaName = generateTenantSchemaName();
    if (!isValidSchemaName(schemaName)) {
      return apiError("Error al generar identificador de schema para el despacho", 500);
    }

    // Hashear contraseña con bcrypt
    const passwordHash = await bcrypt.hash(password, 10);

    // Crear Tenant y Usuario Administrador en el schema public dentro de una transacción
    const { tenant, user } = await publicPrisma.$transaction(async (tx) => {
      const createdTenant = await tx.tenant.create({
        data: {
          name: tenantName,
          schemaName,
        },
      });

      const createdUser = await tx.user.create({
        data: {
          email,
          passwordHash,
          nombre,
          role,
          experienciaAnios,
          tenantId: createdTenant.id,
        },
      });

      return { tenant: createdTenant, user: createdUser };
    });

    // Firmar JWT con datos esenciales del tenant y usuario
    const token = await signAuthToken({
      userId: user.id,
      email: user.email,
      nombre: user.nombre || "",
      role: user.role,
      tenantId: tenant.id,
      schemaName: tenant.schemaName,
    });

    const response = apiResponse(
      {
        message: "Despacho y abogado administrador registrados exitosamente",
        user: {
          id: user.id,
          email: user.email,
          nombre: user.nombre,
          role: user.role,
          experienciaAnios: user.experienciaAnios,
        },
        tenant: {
          id: tenant.id,
          name: tenant.name,
          schemaName: tenant.schemaName,
        },
      },
      201
    );

    // Inyectar cookie httpOnly
    setAuthCookie(response, token);

    return response;
  } catch (error) {
    console.error("Error en /api/auth/register:", error);
    return apiError("Error interno al procesar el registro", 500);
  }
}
