import { NextRequest, NextResponse } from "next/server";
import { publicPrisma } from "@/lib/db/publicClient";
import { getTenantClient } from "@/lib/db/tenantClient";
import { apiError, apiResponse } from "@/lib/http";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const radicado = typeof body.radicado === "string" ? body.radicado.trim() : "";
    const numeroDocumento = typeof body.numeroDocumento === "string" ? body.numeroDocumento.trim() : "";

    if (!radicado || !numeroDocumento) {
      return apiError(
        "Por estrictas razones de reserva procesal y confidencialidad legal, es obligatorio suministrar tanto el Número de Radicado como el Número de Cédula o Documento de Identidad.",
        400
      );
    }

    // 1. Obtener todos los despachos registrados
    const tenants = await publicPrisma.tenant.findMany({
      include: {
        users: {
          select: {
            id: true,
            nombre: true,
            email: true,
            role: true,
            experienciaAnios: true,
          },
        },
      },
    });

    const resultados: Array<{
      despacho: { id: string; name: string };
      caso: {
        id: string;
        numeroExpediente: string;
        titulo: string;
        descripcion: string | null;
        estado: string;
        prioridad: string;
        esFuerzaMayor: boolean;
        nivelAbogadoExigido: string;
        fechaApertura: Date;
      };
      cliente: {
        id: string;
        nombre: string;
        tipoDocumento: string;
        numeroDocumento: string;
        condicionEspecial: string;
        tienePrioridad: boolean;
      };
      abogadoAsignado: {
        id: string;
        nombre: string;
        email: string;
        role: string;
        experienciaAnios: number;
        categoria: string;
      };
    }> = [];

    // 2. Buscar en cada schema de tenant de forma aislada
    for (const t of tenants) {
      try {
        const tenantPrisma = getTenantClient(t.schemaName);

        const casos = await tenantPrisma.caso.findMany({
          where: {
            numeroExpediente: { equals: radicado, mode: "insensitive" },
            cliente: {
              numeroDocumento: { equals: numeroDocumento },
            },
          },
          include: {
            cliente: true,
          },
          orderBy: { fechaApertura: "desc" },
        });

        for (const c of casos) {
          // Resolver el abogado asignado
          let abogadoUser = t.users.find((u) => u.id === c.abogadoAsignadoId);
          if (!abogadoUser && t.users.length > 0) {
            // Si no tiene asignado específico, tomar el abogado titular
            abogadoUser = t.users[0];
          }

          const esSenior = c.nivelAbogadoExigido === "senior" || (abogadoUser && abogadoUser.experienciaAnios >= 8);

          const abogadoInfo = abogadoUser
            ? {
                id: abogadoUser.id,
                nombre: abogadoUser.nombre || abogadoUser.email,
                email: abogadoUser.email,
                role: abogadoUser.role,
                experienciaAnios: abogadoUser.experienciaAnios,
                categoria: esSenior ? "Abogado Mayor (Socio Titular / Senior)" : "Abogado Menor (Asociado)",
              }
            : {
                id: "abg_titular",
                nombre: esSenior ? "Harvey Specter (Socio Director)" : "Mike Ross (Abogado Asociado)",
                email: "litigio@specterlaw.co",
                role: esSenior ? "socio" : "junior",
                experienciaAnios: esSenior ? 15 : 3,
                categoria: esSenior ? "Abogado Mayor (Socio Titular / Senior)" : "Abogado Menor (Asociado)",
              };

          resultados.push({
            despacho: { id: t.id, name: t.name },
            caso: {
              id: c.id,
              numeroExpediente: c.numeroExpediente,
              titulo: c.titulo,
              descripcion: c.descripcion,
              estado: c.estado,
              prioridad: c.prioridad,
              esFuerzaMayor: c.esFuerzaMayor,
              nivelAbogadoExigido: c.nivelAbogadoExigido,
              fechaApertura: c.fechaApertura,
            },
            cliente: {
              id: c.cliente.id,
              nombre: c.cliente.nombre,
              tipoDocumento: c.cliente.tipoDocumento,
              numeroDocumento: c.cliente.numeroDocumento,
              condicionEspecial: c.cliente.condicionEspecial,
              tienePrioridad: c.cliente.tienePrioridad,
            },
            abogadoAsignado: abogadoInfo,
          });
        }
      } catch (err) {
        console.error(`Error buscando en schema ${t.schemaName}:`, err);
      }
    }

    // Si no se encontró en schemas de tenant, buscar en public.casos como respaldo
    if (resultados.length === 0) {
      try {
        const publicResults = await publicPrisma.$queryRawUnsafe<any[]>(
          `SELECT c.*, cl.nombre as cliente_nombre, cl.tipo_documento, cl.numero_documento, cl.condicion_especial, cl.tiene_prioridad
           FROM public.casos c
           JOIN public.clientes cl ON c.cliente_id = cl.id
           WHERE LOWER(c.numero_expediente) = LOWER($1) AND cl.numero_documento = $2
           LIMIT 1`,
          radicado,
          numeroDocumento
        );

        if (publicResults.length > 0) {
          const c = publicResults[0];
          resultados.push({
            despacho: { id: "specter_col", name: "Specter & Asociados Colombia" },
            caso: {
              id: c.id,
              numeroExpediente: c.numero_expediente,
              titulo: c.titulo,
              descripcion: c.descripcion,
              estado: c.estado,
              prioridad: c.prioridad,
              esFuerzaMayor: c.es_fuerza_mayor,
              nivelAbogadoExigido: c.nivel_abogado_exigido,
              fechaApertura: c.fecha_apertura,
            },
            cliente: {
              id: c.cliente_id,
              nombre: c.cliente_nombre,
              tipoDocumento: c.tipo_documento,
              numeroDocumento: c.numero_documento,
              condicionEspecial: c.condicion_especial,
              tienePrioridad: c.tiene_prioridad,
            },
            abogadoAsignado: {
              id: "abg_titular",
              nombre: "Harvey Specter (Socio Director)",
              email: "harvey.specter@specterlaw.co",
              role: "socio",
              experienciaAnios: 18,
              categoria: "Abogado Mayor (Socio Titular / Senior)",
            },
          });
        }
      } catch (errPublic) {
        // Continuar
      }
    }

    if (resultados.length === 0) {
      return apiError(
        "No se encontró ningún expediente con los datos suministrados. Verifique el número de radicado o documento.",
        404
      );
    }

    return apiResponse({ expediente: resultados[0], totalCoincidencias: resultados.length });
  } catch (error) {
    console.error("Error al consultar caso público:", error);
    return apiError(
      error instanceof Error ? error.message : "Error al consultar el expediente",
      500
    );
  }
}
