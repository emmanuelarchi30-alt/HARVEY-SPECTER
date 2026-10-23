import { NextRequest } from "next/server";
import { registerSchema } from "@/lib/validation/auth";
import { provisionTenant } from "@/lib/db/provisionTenant";
import { signAuthToken } from "@/lib/auth/jwt";
import { setAuthCookie } from "@/lib/auth/cookies";
import { apiError, apiResponse } from "@/lib/http";
import { publicPrisma } from "@/lib/db/publicClient";

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

    const { tenantName, nombre, email, password, role, experienciaAnios, cedula } =
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

    // Aprovisionar nuevo tenant con su schema y tablas mediante una transacción atómica DDL
    const provisioned = await provisionTenant({
      tenantName,
      nombreAbogado: nombre,
      email,
      password,
      cedula,
      role,
      experienciaAnios,
    });

    // Firmar JWT con los datos de sesión y resolución de tenant
    const token = await signAuthToken({
      userId: provisioned.userId,
      email: provisioned.email,
      nombre,
      role: provisioned.role,
      tenantId: provisioned.tenantId,
      schemaName: provisioned.schemaName,
    });

    const response = apiResponse(
      {
        message: "Despacho jurídico y schema aprovisionados exitosamente",
        user: {
          id: provisioned.userId,
          email: provisioned.email,
          nombre,
          role: provisioned.role,
          experienciaAnios,
        },
        tenant: {
          id: provisioned.tenantId,
          name: provisioned.tenantName,
          schemaName: provisioned.schemaName,
        },
      },
      201
    );

    // Inyectar cookie httpOnly con el token JWT
    setAuthCookie(response, token);

    return response;
  } catch (error) {
    console.error("Error en /api/auth/register:", error);
    return apiError(
      error instanceof Error ? error.message : "Error al aprovisionar el despacho",
      500
    );
  }
}
