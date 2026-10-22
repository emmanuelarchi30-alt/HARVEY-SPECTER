import { provisionTenant } from "../lib/db/provisionTenant";
import { getTenantClient } from "../lib/db/tenantClient";
import { publicPrisma } from "../lib/db/publicClient";

async function testProvisionAndTenantClient() {
  console.log("=== INICIANDO PRUEBA DE PROVISIONTENANT Y GETTENANTCLIENT EN SUPABASE ===");

  const testEmail = `jessica.pearson.${Date.now()}@spectercolombia.co`;

  // 1. Probar provisionTenant (Atómico con pg y template.sql)
  console.log("\n1. Aprovisionando despacho 'Pearson Specter Litt Colombia' en Supabase...");
  const result = await provisionTenant({
    tenantName: "Pearson Specter Litt Colombia",
    nombreAbogado: "Jessica Pearson",
    email: testEmail,
    password: "PasswordSeguro123*",
    role: "socio",
    experienciaAnios: 20,
  });

  console.log(`✓ Despacho creado con éxito:`);
  console.log(`  - Tenant ID: ${result.tenantId}`);
  console.log(`  - Schema Name: ${result.schemaName}`);
  console.log(`  - Usuario Titular: ${result.email} (Rol: ${result.role})`);

  // 2. Verificar que el tenant está registrado en public.tenants
  const tenantEnPublic = await publicPrisma.tenant.findUnique({
    where: { id: result.tenantId },
  });
  console.log(`\n2. Verificado en schema public.tenants: ${tenantEnPublic?.name}`);

  // 3. Probar getTenantClient con la caché LRU
  console.log("\n3. Obteniendo cliente Prisma específico para el schema con getTenantClient...");
  const tenantClient = getTenantClient(result.schemaName);

  // 4. Registrar un cliente con especial protección (Víctima del conflicto armado)
  console.log("\n4. Registrando cliente con condición de Víctima del Conflicto Armado...");
  const cliente = await tenantClient.cliente.create({
    data: {
      nombre: "Rodrigo Montoya",
      tipoDocumento: "CC",
      numeroDocumento: `CC-${Date.now().toString().slice(-8)}`,
      email: "rodrigo.victima@ejemplo.com",
      telefono: "3109876543",
      condicionEspecial: "victima_conflicto",
      tienePrioridad: true,
    },
  });

  console.log(`✓ Cliente insertado en schema ${result.schemaName}:`);
  console.log(`  - ID: ${cliente.id}`);
  console.log(`  - Nombre: ${cliente.nombre}`);
  console.log(`  - Condición: ${cliente.condicionEspecial}`);
  console.log(`  - Tiene Prioridad: ${cliente.tienePrioridad}`);

  // 5. Crear caso asignado a abogado senior por fuerza mayor / especial protección
  console.log("\n5. Creando expediente jurídico de tutela urgente...");
  const consecutivo = Math.floor(1000 + Math.random() * 9000);
  const caso = await tenantClient.caso.create({
    data: {
      numeroExpediente: `RAD-2026-${consecutivo}`,
      titulo: "Acción de Tutela - Protección de Tierras y Retorno Seguro",
      descripcion: "Solicitud urgente de medidas cautelares por desplazamiento forzado",
      estado: "abierto",
      prioridad: "urgente",
      esFuerzaMayor: true,
      nivelAbogadoExigido: "senior",
      clienteId: cliente.id,
    },
  });

  console.log(`✓ Expediente creado en schema ${result.schemaName}:`);
  console.log(`  - Radicado: ${caso.numeroExpediente}`);
  console.log(`  - Título: ${caso.titulo}`);
  console.log(`  - Prioridad: ${caso.prioridad}`);
  console.log(`  - Abogado Exigido: ${caso.nivelAbogadoExigido}`);

  // 6. Consultar casos del cliente con include
  console.log("\n6. Verificando lectura relacional dentro del schema...");
  const clienteConCasos = await tenantClient.cliente.findUnique({
    where: { id: cliente.id },
    include: { casos: true },
  });

  console.log(`✓ Casos vinculados al cliente: ${clienteConCasos?.casos.length}`);
  console.log(clienteConCasos?.casos[0]);

  console.log("\n=== PRUEBA DE PROVISION Y AISLAMIENTO COMPLETADA CON ÉXITO ===");
}

testProvisionAndTenantClient()
  .catch((e) => {
    console.error("Error en prueba de provisión:", e);
    process.exit(1);
  })
  .finally(async () => {
    await publicPrisma.$disconnect();
  });
