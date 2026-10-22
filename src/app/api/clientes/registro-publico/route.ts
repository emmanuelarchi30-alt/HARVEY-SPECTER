import { NextRequest } from "next/server";
import { publicPrisma } from "@/lib/db/publicClient";
import { getTenantClient } from "@/lib/db/tenantClient";
import { registroClientePublicoSchema } from "@/lib/validation/cliente";
import { apiError, apiResponse } from "@/lib/http";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validation = registroClientePublicoSchema.safeParse(body);

    if (!validation.success) {
      return apiError(
        "Datos de registro de cliente y caso inválidos",
        400,
        validation.error.flatten().fieldErrors
      );
    }

    const data = validation.data;

    // 1. Resolver el despacho (tenant) destinatario
    let tenant = null;
    if (data.tenantId) {
      tenant = await publicPrisma.tenant.findUnique({
        where: { id: data.tenantId },
      });
    }

    // Si no se especifica tenant, asignar a la primera firma registrada (ej. Specter & Asociados)
    if (!tenant) {
      tenant = await publicPrisma.tenant.findFirst({
        orderBy: { createdAt: "asc" },
      });
    }

    if (!tenant) {
      return apiError(
        "No hay ninguna firma legal disponible en el sistema para recibir el caso",
        404
      );
    }

    // 2. Obtener cliente Prisma exclusivo para el schema aislado del despacho
    const tenantPrisma = getTenantClient(tenant.schemaName);

    // 3. Reglas de Negocio: Prioridad y Nivel de Abogado Exigido
    const esVulnerable = data.condicionEspecial !== "ninguna";
    const esAltaVulnerabilidad =
      data.condicionEspecial === "victima_conflicto" ||
      data.condicionEspecial === "desplazado";

    const tienePrioridad = esVulnerable || data.esFuerzaMayor;

    // Asignación de prioridad
    let prioridad: "baja" | "media" | "alta" | "urgente" = "media";
    let nivelAbogadoExigido: "junior" | "senior" | "socio" = "junior";

    if (data.esFuerzaMayor || esAltaVulnerabilidad) {
      prioridad = "urgente";
      nivelAbogadoExigido = "senior"; // Harvey Specter / Abogado con alta experiencia
    } else if (esVulnerable) {
      prioridad = "alta";
      nivelAbogadoExigido = "senior";
    }

    // Generar número de expediente único oficial
    const consecutivo = Math.floor(1000 + Math.random() * 9000);
    const anio = new Date().getFullYear();
    const numeroExpediente = `RAD-${anio}-${consecutivo}`;

    // 4. Persistir Cliente y Caso dentro del schema aislado del tenant
    const { cliente, caso } = await tenantPrisma.$transaction(async (tx) => {
      // Registrar o actualizar datos del cliente/accionante
      const clienteCreado = await tx.cliente.upsert({
        where: {
          tipoDocumento_numeroDocumento: {
            tipoDocumento: data.tipoDocumento,
            numeroDocumento: data.numeroDocumento,
          },
        },
        update: {
          nombre: data.nombre,
          email: data.email || null,
          telefono: data.telefono || null,
          condicionEspecial: data.condicionEspecial,
          tienePrioridad,
        },
        create: {
          nombre: data.nombre,
          tipoDocumento: data.tipoDocumento,
          numeroDocumento: data.numeroDocumento,
          email: data.email || null,
          telefono: data.telefono || null,
          condicionEspecial: data.condicionEspecial,
          tienePrioridad,
        },
      });

      // Crear el expediente del caso vinculado al cliente
      const casoCreado = await tx.caso.create({
        data: {
          numeroExpediente,
          titulo: data.tituloCaso,
          descripcion: data.descripcion || null,
          estado: "abierto",
          prioridad,
          esFuerzaMayor: data.esFuerzaMayor,
          nivelAbogadoExigido,
          clienteId: clienteCreado.id,
        },
      });

      return { cliente: clienteCreado, caso: casoCreado };
    });

    return apiResponse(
      {
        mensaje: "Solicitud y expediente radicados exitosamente",
        radicado: caso.numeroExpediente,
        despacho: tenant.name,
        schema: tenant.schemaName,
        cliente: {
          id: cliente.id,
          nombre: cliente.nombre,
          documento: `${cliente.tipoDocumento} ${cliente.numeroDocumento}`,
          condicionEspecial: cliente.condicionEspecial,
          tienePrioridad: cliente.tienePrioridad,
        },
        caso: {
          id: caso.id,
          numeroExpediente: caso.numeroExpediente,
          titulo: caso.titulo,
          prioridad: caso.prioridad,
          esFuerzaMayor: caso.esFuerzaMayor,
          nivelAbogadoExigido: caso.nivelAbogadoExigido,
          fechaApertura: caso.fechaApertura,
        },
      },
      201
    );
  } catch (error) {
    console.error("Error en registro público de cliente:", error);
    return apiError(
      error instanceof Error ? error.message : "Error al procesar la solicitud",
      500
    );
  }
}
