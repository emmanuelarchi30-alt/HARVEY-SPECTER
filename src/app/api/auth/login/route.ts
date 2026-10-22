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

    const { email, password } = validation.data;

    // Buscar el usuario e incluir el despacho (tenant) asociado
    const user = await publicPrisma.user.findUnique({
      where: { email },
      include: {
        tenant: true,
      },
    });

    if (!user) {
      return apiError("Credenciales inválidas", 401);
    }

    // Verificar contraseña con bcrypt
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
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
