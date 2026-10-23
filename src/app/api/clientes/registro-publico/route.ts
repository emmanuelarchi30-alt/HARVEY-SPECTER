import { NextRequest } from "next/server";
import { publicPrisma } from "@/lib/db/publicClient";
import { getTenantClient } from "@/lib/db/tenantClient";
import { registroClientePublicoSchema } from "@/lib/validation/cliente";
import { apiError, apiResponse } from "@/lib/http";
import { ejecutarTriajeLegalIA } from "@/lib/ai/triageLegal";

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

    // 2. Obtener abogados registrados en la firma para la asignación por IA
    const abogadosFirm = await publicPrisma.user.findMany({
      where: { tenantId: tenant.id },
      select: {
        id: true,
        nombre: true,
        email: true,
        role: true,
        experienciaAnios: true,
      },
    });

    // 3. Ejecutar Motor de IA para Triaje Jurídico y Asignación Constitucional
    const dictamenIA = ejecutarTriajeLegalIA({
      nombreCliente: data.nombre,
      tipoDocumento: data.tipoDocumento,
      numeroDocumento: data.numeroDocumento,
      condicionEspecial: data.condicionEspecial,
      tituloCaso: data.tituloCaso,
      descripcion: data.descripcion,
      esFuerzaMayor: data.esFuerzaMayor,
      abogados: abogadosFirm.map((u) => ({
        id: u.id,
        nombre: u.nombre,
        email: u.email,
        role: u.role,
        experienciaAnios: u.experienciaAnios,
      })),
    });

    // Si seleccionó Fast Track (Pago Grande), se exige Abogado Mayor y tiempo de estudio ultra-corto
    if (data.modalidadArancel === "fast_track") {
      dictamenIA.requiereAbogadoMayor = true;
      dictamenIA.prioridad = "urgente";
      dictamenIA.nivelAbogadoExigido = "senior";
      dictamenIA.fundamentoConstitucional.dictamenJuridico =
        `[FAST TRACK • PAGO GRANDE CONTRATADO]: Modalidad prioritaria con tiempo de estudio garantizado en menos de 12 horas. Asignación inmediata del Socio Director de la firma para estructuración de Medida Cautelar Provisional Previa (Dec. 2591/91 Art. 7).\n\n` +
        dictamenIA.fundamentoConstitucional.dictamenJuridico;
    }

    // 4. Obtener cliente Prisma exclusivo para el schema aislado del despacho
    const tenantPrisma = getTenantClient(tenant.schemaName);

    // Generar número de radicado oficial único
    const consecutivo = Math.floor(1000 + Math.random() * 9000);
    const anio = new Date().getFullYear();
    const numeroExpediente = `RAD-${anio}-${consecutivo}`;

    const arancelTexto =
      data.modalidadArancel === "fast_track"
        ? "Fast Track ($2.500.000 COP) • Tiempo de Estudio: Menos de 12 Horas"
        : data.modalidadArancel === "urgente"
        ? "Litigio Preferente ($850.000 COP) • Tiempo de Estudio: 24 Horas"
        : data.modalidadArancel === "ordinario"
        ? "Trámite Ordinario ($350.000 COP) • Tiempo de Estudio: 48 Horas"
        : "Amparo Constitucional Gratuito ($0 COP) • Ley 1448 de 2011";

    const textoDictamen = `\n\n[DICTAMEN IA Y FUNDAMENTACIÓN CONSTITUCIONAL]:\n${dictamenIA.fundamentoConstitucional.dictamenJuridico}\n• Modalidad Contratada: ${arancelTexto}\n• Normas Superiores: Arts. ${dictamenIA.fundamentoConstitucional.articulos.join(", ")} C.P.\n• Precedente: ${dictamenIA.fundamentoConstitucional.precedente}\n• Asignación: ${dictamenIA.abogadoAsignado.nombre} (${dictamenIA.abogadoAsignado.categoria})`;

    // 5. Persistir Cliente y Caso dentro del schema aislado del tenant
    const { cliente, caso } = await tenantPrisma.$transaction(async (tx) => {
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
          tienePrioridad: dictamenIA.requiereAbogadoMayor,
        },
        create: {
          nombre: data.nombre,
          tipoDocumento: data.tipoDocumento,
          numeroDocumento: data.numeroDocumento,
          email: data.email || null,
          telefono: data.telefono || null,
          condicionEspecial: data.condicionEspecial,
          tienePrioridad: dictamenIA.requiereAbogadoMayor,
        },
      });

      const casoCreado = await tx.caso.create({
        data: {
          numeroExpediente,
          titulo: data.tituloCaso,
          descripcion: data.descripcion ? `${data.descripcion}${textoDictamen}` : textoDictamen.trim(),
          estado: "abierto",
          prioridad: dictamenIA.prioridad,
          esFuerzaMayor: data.esFuerzaMayor,
          nivelAbogadoExigido: dictamenIA.nivelAbogadoExigido,
          abogadoAsignadoId: dictamenIA.abogadoAsignado.id,
          clienteId: clienteCreado.id,
        },
      });

      return { cliente: clienteCreado, caso: casoCreado };
    });

    // 6. Reflejar en schema public para que aparezca inmediatamente en el Table Editor de Supabase
    try {
      await publicPrisma.$executeRawUnsafe(
        `INSERT INTO public.clientes (id, nombre, tipo_documento, numero_documento, email, telefono, condicion_especial, tiene_prioridad)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
         ON CONFLICT (tipo_documento, numero_documento) DO UPDATE
         SET nombre = EXCLUDED.nombre,
             email = EXCLUDED.email,
             telefono = EXCLUDED.telefono,
             condicion_especial = EXCLUDED.condicion_especial,
             tiene_prioridad = EXCLUDED.tiene_prioridad`,
        cliente.id,
        cliente.nombre,
        cliente.tipoDocumento,
        cliente.numeroDocumento,
        cliente.email,
        cliente.telefono,
        cliente.condicionEspecial,
        cliente.tienePrioridad
      );

      await publicPrisma.$executeRawUnsafe(
        `INSERT INTO public.casos (id, numero_expediente, titulo, descripcion, estado, prioridad, es_fuerza_mayor, nivel_abogado_exigido, abogado_asignado_id, cliente_id)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
         ON CONFLICT (numero_expediente) DO UPDATE
         SET titulo = EXCLUDED.titulo,
             descripcion = EXCLUDED.descripcion,
             estado = EXCLUDED.estado,
             prioridad = EXCLUDED.prioridad,
             es_fuerza_mayor = EXCLUDED.es_fuerza_mayor,
             nivel_abogado_exigido = EXCLUDED.nivel_abogado_exigido,
             abogado_asignado_id = EXCLUDED.abogado_asignado_id`,
        caso.id,
        caso.numeroExpediente,
        caso.titulo,
        caso.descripcion,
        caso.estado,
        caso.prioridad,
        caso.esFuerzaMayor,
        caso.nivelAbogadoExigido,
        caso.abogadoAsignadoId,
        cliente.id
      );

      await publicPrisma.$executeRawUnsafe(
        `INSERT INTO public.documentos (nombre, tipo, url, caso_id)
         VALUES ($1, 'demanda_tutela', $2, $3)`,
        `Demanda de Tutela y Dictamen Constitucional - ${caso.numeroExpediente}.pdf`,
        `https://storage.supabase.co/expedientes/${caso.numeroExpediente}/demanda.pdf`,
        caso.id
      );
    } catch (mirrorErr) {
      console.warn("Aviso en espejo public de Supabase:", mirrorErr);
    }

    return apiResponse(
      {
        mensaje: "Solicitud y expediente radicados exitosamente con asignación jurídica automatizada",
        radicado: caso.numeroExpediente,
        despacho: tenant.name,
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
          abogadoAsignadoId: caso.abogadoAsignadoId,
          fechaApertura: caso.fechaApertura,
        },
        triajeIA: dictamenIA,
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
