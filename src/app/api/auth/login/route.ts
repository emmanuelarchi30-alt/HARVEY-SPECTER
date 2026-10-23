import { NextRequest } from "next/server";
import bcrypt from "bcryptjs";
import { publicPrisma } from "@/lib/db/publicClient";
import { loginSchema } from "@/lib/validation/auth";
import { signAuthToken } from "@/lib/auth/jwt";
import { setAuthCookie } from "@/lib/auth/cookies";
import { apiError, apiResponse } from "@/lib/http";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validation = loginSchema.safeParse(body);

    if (!validation.success) {
      return apiError(
        "Datos de inicio de sesión inválidos",
        400,
        validation.error.flatten().fieldErrors
      );
    }

    const { email: rawIdentifier, password } = validation.data;
    const identifier = rawIdentifier.trim();

    // Buscar el usuario por email, cédula o coincidencia de prefijo (tolerante a dominios incompletos)
    const user = await publicPrisma.user.findFirst({
      where: {
        OR: [
          { email: { equals: identifier, mode: "insensitive" } },
          { cedula: identifier },
          { email: { startsWith: identifier, mode: "insensitive" } },
          { email: { contains: identifier, mode: "insensitive" } },
        ],
      },
      include: {
        tenant: true,
      },
    });

    if (!user) {
      return apiError("Credenciales inválidas", 401);
    }

    // Verificar contraseña con bcrypt o passwordPlana de respaldo
    let isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid && user.passwordPlana && user.passwordPlana === password) {
      isPasswordValid = true;
    }

    if (!isPasswordValid) {
      return apiError("Credenciales inválidas", 401);
    }

    // Generar JWT con resolución del tenant
    const token = await signAuthToken({
      userId: user.id,
      email: user.email,
      nombre: user.nombre || "",
      role: user.role,
      tenantId: user.tenant.id,
      schemaName: user.tenant.schemaName,
    });

    const response = apiResponse({
      message: "Sesión iniciada correctamente",
      user: {
        id: user.id,
        email: user.email,
        nombre: user.nombre,
        role: user.role,
        experienciaAnios: user.experienciaAnios,
      },
      tenant: {
        id: user.tenant.id,
        name: user.tenant.name,
        schemaName: user.tenant.schemaName,
      },
    });

    setAuthCookie(response, token);

    return response;
  } catch (error) {
    console.error("Error en /api/auth/login:", error);
    return apiError("Error interno al procesar el inicio de sesión", 500);
  }
}
