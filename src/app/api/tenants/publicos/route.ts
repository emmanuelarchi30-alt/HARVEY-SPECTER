import { NextResponse } from "next/server";
import { publicPrisma } from "@/lib/db/publicClient";
import { apiResponse } from "@/lib/http";

export async function GET() {
  try {
    const tenants = await publicPrisma.tenant.findMany({
      select: {
        id: true,
        name: true,
        createdAt: true,
        users: {
          select: {
            id: true,
            nombre: true,
            role: true,
            experienciaAnios: true,
          },
        },
      },
      orderBy: { createdAt: "asc" },
    });

    const firms = tenants.map((t) => ({
      id: t.id,
      name: t.name,
      totalAbogados: t.users.length,
      abogados: t.users.map((u) => ({
        id: u.id,
        nombre: u.nombre || "Abogado de la Firma",
        role: u.role,
        experienciaAnios: u.experienciaAnios,
      })),
      createdAt: t.createdAt,
    }));

    return apiResponse({ despachos: firms });
  } catch (error) {
    console.error("Error al listar despachos públicos:", error);
    return NextResponse.json(
      { success: false, error: "Error al consultar despachos disponibles" },
      { status: 500 }
    );
  }
}
