import { getSession } from "@/lib/auth/getSession";
import { publicPrisma } from "@/lib/db/publicClient";
import { apiError, apiResponse } from "@/lib/http";

export async function GET() {
  try {
    const session = await getSession();

    if (!session) {
      return apiError("No autenticado", 401);
    }

    const user = await publicPrisma.user.findUnique({
      where: { id: session.userId },
      include: {
        tenant: true,
      },
    });

    if (!user) {
      return apiError("Usuario no encontrado", 404);
    }

    return apiResponse({
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
  } catch (error) {
    console.error("Error en /api/auth/me:", error);
    return apiError("Error al obtener sesión del usuario", 500);
  }
}
