import { Client } from "pg";
import fs from "fs";
import path from "path";
import bcrypt from "bcryptjs";

const DIRECT_URL = process.env.DIRECT_URL;
if (!DIRECT_URL) {
  throw new Error("DIRECT_URL no está configurada en .env");
}

async function seed() {
  console.log("Conectando a Supabase PostgreSQL...");
  const client = new Client({ connectionString: DIRECT_URL });
  await client.connect();

  try {
    const templatePath = path.join(process.cwd(), "prisma/tenant/template.sql");
    const templateSql = fs.readFileSync(templatePath, "utf-8");
    const hash = await bcrypt.hash("Password123*", 10);

    // 1. Asegurar firmas en public.tenants
    const firmas = [
      {
        id: "tnt_specter_colombia",
        name: "Specter & Asociados Colombia",
        schemaName: "tenant_3a7da2f826f69c42", // schema activo principal
      },
      {
        id: "tnt_delaespriella",
        name: "De La Espriella Lawyers Enterprise",
        schemaName: "tenant_269a552df1c69c75", // segundo schema
      },
      {
        id: "tnt_defensoria",
        name: "Litigio Constitucional & Víctimas",
        schemaName: "tenant_defensoria_col",
      },
    ];

    const tenantIdMap = new Map<string, string>();

    for (const f of firmas) {
      const res = await client.query(
        `INSERT INTO public.tenants (id, name, schema_name, created_at)
         VALUES ($1, $2, $3, NOW())
         ON CONFLICT (schema_name) DO UPDATE SET name = $2
         RETURNING id`,
        [f.id, f.name, f.schemaName]
      );
      const actualId = res.rows[0].id;
      tenantIdMap.set(f.schemaName, actualId);
      console.log(`Firma asegurada: ${f.name} (id: ${actualId}, schema: ${f.schemaName})`);
    }

    const idSpecter = tenantIdMap.get("tenant_3a7da2f826f69c42")!;
    const idDelaespriella = tenantIdMap.get("tenant_269a552df1c69c75")!;
    const idDefensoria = tenantIdMap.get("tenant_defensoria_col")!;

    // 2. Asegurar Abogados en public.users
    const abogados = [
      // Specter & Asociados
      {
        id: "usr_harvey_specter",
        email: "harvey@specterlaw.co",
        nombre: "Harvey Specter",
        role: "socio",
        experienciaAnios: 18,
        tenantId: idSpecter,
      },
      {
        id: "usr_jessica_pearson",
        email: "jessica@specterlaw.co",
        nombre: "Jessica Pearson",
        role: "socio",
        experienciaAnios: 22,
        tenantId: idSpecter,
      },
      {
        id: "usr_mike_ross",
        email: "mike@specterlaw.co",
        nombre: "Mike Ross",
        role: "junior",
        experienciaAnios: 4,
        tenantId: idSpecter,
      },
      {
        id: "usr_rachel_zane",
        email: "rachel@specterlaw.co",
        nombre: "Rachel Zane",
        role: "junior",
        experienciaAnios: 5,
        tenantId: idSpecter,
      },
      // De La Espriella
      {
        id: "usr_abelardo",
        email: "abelardo@delaespriella.co",
        nombre: "Abelardo De La Espriella",
        role: "socio",
        experienciaAnios: 20,
        tenantId: idDelaespriella,
      },
      {
        id: "usr_andrea_morales",
        email: "andrea@delaespriella.co",
        nombre: "Andrea Morales",
        role: "junior",
        experienciaAnios: 3,
        tenantId: idDelaespriella,
      },
      // Defensoría Constitucional
      {
        id: "usr_jaime_castro",
        email: "jaime@defensoriaconstitucional.co",
        nombre: "Dr. Jaime Castro",
        role: "senior",
        experienciaAnios: 16,
        tenantId: idDefensoria,
      },
      {
        id: "usr_camila_rivera",
        email: "camila@defensoriaconstitucional.co",
        nombre: "Dra. Camila Rivera",
        role: "junior",
        experienciaAnios: 2,
        tenantId: idDefensoria,
      },
    ];

    for (const abg of abogados) {
      await client.query(
        `INSERT INTO public.users (id, email, password_hash, nombre, role, experiencia_anios, tenant_id, created_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())
         ON CONFLICT (email) DO UPDATE 
         SET nombre = $4, role = $5, experiencia_anios = $6, tenant_id = $7`,
        [abg.id, abg.email, hash, abg.nombre, abg.role, abg.experienciaAnios, abg.tenantId]
      );
      console.log(`Abogado asegurado: ${abg.nombre} (${abg.role}) en ${abg.tenantId}`);
    }

    // 3. Crear schemas de tenants y aplicar DDL
    for (const f of firmas) {
      console.log(`Aplicando DDL a schema ${f.schemaName}...`);
      await client.query(`CREATE SCHEMA IF NOT EXISTS "${f.schemaName}"`);
      await client.query(`SET LOCAL search_path TO "${f.schemaName}"`);

      // Aplicar template.sql separando por sentencias
      const statements = templateSql
        .split(";")
        .map((s) => s.trim())
        .filter((s) => s.length > 0);

      for (const st of statements) {
        try {
          await client.query(st);
        } catch (e: any) {
          // Ignorar si el tipo o tabla ya existe
          if (!e.message.includes("already exists")) {
            console.warn(`Aviso DDL en ${f.schemaName}:`, e.message);
          }
        }
      }
    }

    // 4. Poblar Clientes y Casos en el schema principal (Specter & Asociados)
    const schemaSpecter = "tenant_3a7da2f826f69c42";
    await client.query(`SET LOCAL search_path TO "${schemaSpecter}"`);

    const clientesData = [
      {
        id: "cli_maria_delahoz",
        nombre: "María de la Hoz Urtado",
        tipoDocumento: "CC",
        numeroDocumento: "1020304050",
        email: "maria.delahoz@gmail.com",
        telefono: "3001234567",
        condicionEspecial: "victima_conflicto",
        tienePrioridad: true,
      },
      {
        id: "cli_rodrigo_montoya",
        nombre: "Rodrigo Montoya",
        tipoDocumento: "CC",
        numeroDocumento: "71234567",
        email: "rodrigo.montoya@gmail.com",
        telefono: "3119876543",
        condicionEspecial: "desplazado",
        tienePrioridad: true,
      },
      {
        id: "cli_maria_gomez",
        nombre: "María Elena Gómez",
        tipoDocumento: "CC",
        numeroDocumento: "52890123",
        email: "maria.gomez@hotmail.com",
        telefono: "3204567890",
        condicionEspecial: "madre_cabeza_familia",
        tienePrioridad: true,
      },
      {
        id: "cli_carlos_ramirez",
        nombre: "Carlos Eduardo Ramírez",
        tipoDocumento: "CC",
        numeroDocumento: "80123987",
        email: "carlos.ramirez@empresa.com",
        telefono: "3156781234",
        condicionEspecial: "ninguna",
        tienePrioridad: false,
      },
    ];

    for (const c of clientesData) {
      await client.query(
        `INSERT INTO "${schemaSpecter}".clientes (id, nombre, tipo_documento, numero_documento, email, telefono, condicion_especial, tiene_prioridad, created_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW())
         ON CONFLICT (tipo_documento, numero_documento) DO UPDATE
         SET nombre = $2, email = $5, telefono = $6, condicion_especial = $7, tiene_prioridad = $8`,
        [c.id, c.nombre, c.tipoDocumento, c.numeroDocumento, c.email, c.telefono, c.condicionEspecial, c.tienePrioridad]
      );
      console.log(`Cliente registrado: ${c.nombre} (${c.tipoDocumento} ${c.numeroDocumento})`);
    }

    const casosData = [
      {
        id: "caso_rad_7658",
        numeroExpediente: "RAD-2026-7658",
        titulo: "Petición Financiera y Reparación Integral - Banco Davivienda",
        descripcion: "Solicitud de levantamiento de retención en la fuente por concepto de indemnización administrativa de víctima del conflicto.\n\n[DICTAMEN IA Y FUNDAMENTACIÓN CONSTITUCIONAL]:\nDIAGNÓSTICO IA: El accionante ostenta la condición de Víctima del Conflicto Armado Interno. Bajo el mandato del Artículo 13 Superior (debilidad manifiesta) y la jurisprudencia unificada de la Corte Constitucional, se activa de forma automática el deber de especial diligencia y protección reforzada. Se asigna al Abogado Mayor con más alta experiencia para la estructuración de la Acción de Tutela o reparación integral directa.\n• Normas Superiores: Arts. 13, 86, 93 C.P.\n• Precedente: Ley 1448 de 2011 (Ley de Víctimas) y Sentencia T-025 de 2004\n• Asignación: Jessica Pearson (Abogado Mayor (Socio/Senior))",
        estado: "abierto",
        prioridad: "urgente",
        esFuerzaMayor: true,
        nivelAbogadoExigido: "senior",
        abogadoAsignadoId: "usr_jessica_pearson",
        clienteId: "cli_maria_delahoz",
      },
      {
        id: "caso_rad_8994",
        numeroExpediente: "RAD-2026-8994",
        titulo: "Auxilio Obligatorio de Transporte y Negación de Ayuda a Víctima",
        descripcion: "Negación injustificada de auxilio reglamentario alegando cupos agotados sin considerar condición prioritaria de víctima del conflicto armado.\n\n[DICTAMEN IA Y FUNDAMENTACIÓN CONSTITUCIONAL]:\nDIAGNÓSTICO IA: Vulneración al derecho a la igualdad real y no discriminación (Art. 13 C.P.). Se asigna a Abogado Mayor para la interposición inmediata de Acción de Tutela con solicitud de cumplimiento preferente.\n• Normas Superiores: Arts. 13, 29, 86 C.P.\n• Precedente: Ley 1448 de 2011\n• Asignación: Harvey Specter (Abogado Mayor (Socio Titular))",
        estado: "en_curso",
        prioridad: "urgente",
        esFuerzaMayor: true,
        nivelAbogadoExigido: "senior",
        abogadoAsignadoId: "usr_harvey_specter",
        clienteId: "cli_maria_delahoz",
      },
      {
        id: "caso_rad_7561",
        numeroExpediente: "RAD-2026-7561",
        titulo: "Acción de Tutela - Protección de Tierras y Retorno Seguro",
        descripcion: "Solicitud urgente de medidas cautelares por desplazamiento forzado y restitución de predio rural.\n\n[DICTAMEN IA Y FUNDAMENTACIÓN CONSTITUCIONAL]:\nDIAGNÓSTICO IA: Estado de Cosas Inconstitucional reconocido por la Corte Constitucional en Sentencia T-025 de 2004. Requiere amparo inmediato de derechos a la vida digna, territorio y seguridad.\n• Normas Superiores: Arts. 11, 13, 86 C.P.\n• Precedente: Sentencia T-025 de 2004\n• Asignación: Harvey Specter (Abogado Mayor (Socio Titular))",
        estado: "abierto",
        prioridad: "urgente",
        esFuerzaMayor: true,
        nivelAbogadoExigido: "senior",
        abogadoAsignadoId: "usr_harvey_specter",
        clienteId: "cli_rodrigo_montoya",
      },
      {
        id: "caso_rad_1044",
        numeroExpediente: "RAD-2026-1044",
        titulo: "Acción de Tutela Urgente - Cirugía Cardiovascular Inmediata EPS Sanitas",
        descripcion: "Riesgo vital inminente por negación de procedimiento quirúrgico y stent coronario a madre cabeza de familia.\n\n[DICTAMEN IA Y FUNDAMENTACIÓN CONSTITUCIONAL]:\nDIAGNÓSTICO IA: Caso con presunción de Fuerza Mayor y riesgo inminente a derechos fundamentales inalienables (Art. 11 vida, Art. 49 salud). El sistema asigna inmediatamente a un Abogado Mayor para interponer la Acción de Tutela con solicitud de medida provisional perentoria antes de 24 horas.\n• Normas Superiores: Arts. 11, 49, 86 C.P.\n• Precedente: Sentencia T-760 de 2008\n• Asignación: Jessica Pearson (Abogado Mayor (Socio/Senior))",
        estado: "abierto",
        prioridad: "urgente",
        esFuerzaMayor: true,
        nivelAbogadoExigido: "senior",
        abogadoAsignadoId: "usr_jessica_pearson",
        clienteId: "cli_maria_gomez",
      },
      {
        id: "caso_rad_3022",
        numeroExpediente: "RAD-2026-3022",
        titulo: "Proceso Ordinario de Restitución de Inmueble y Cobro de Cánones",
        descripcion: "Controversia civil sobre incumplimiento contractual de contrato de arrendamiento urbano.\n\n[DICTAMEN IA Y FUNDAMENTACIÓN CONSTITUCIONAL]:\nDIAGNÓSTICO IA: Caso de naturaleza ordinaria o trámite regular. No se detectan vulneraciones a sujetos de especial protección ni riesgo vital. Conforme a los principios de celeridad y eficiencia (Art. 209), el expediente se asigna a un Abogado Menor (Asociado/Junior) bajo supervisión de la firma.\n• Normas Superiores: Arts. 29, 209 C.P.\n• Precedente: Código General del Proceso\n• Asignación: Mike Ross (Abogado Menor (Asociado))",
        estado: "abierto",
        prioridad: "media",
        esFuerzaMayor: false,
        nivelAbogadoExigido: "junior",
        abogadoAsignadoId: "usr_mike_ross",
        clienteId: "cli_carlos_ramirez",
      },
    ];

    for (const caso of casosData) {
      await client.query(
        `INSERT INTO "${schemaSpecter}".casos (id, numero_expediente, titulo, descripcion, estado, prioridad, es_fuerza_mayor, nivel_abogado_exigido, abogado_asignado_id, cliente_id, fecha_apertura)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, NOW())
         ON CONFLICT (numero_expediente) DO UPDATE
         SET titulo = $3, descripcion = $4, estado = $5, prioridad = $6, es_fuerza_mayor = $7, nivel_abogado_exigido = $8, abogado_asignado_id = $9, cliente_id = $10`,
        [caso.id, caso.numeroExpediente, caso.titulo, caso.descripcion, caso.estado, caso.prioridad, caso.esFuerzaMayor, caso.nivelAbogadoExigido, caso.abogadoAsignadoId, caso.clienteId]
      );
      console.log(`Caso radicado: ${caso.numeroExpediente} -> ${caso.titulo} (Abogado: ${caso.abogadoAsignadoId})`);
    }

    console.log("¡SEED EN SUPABASE POSTGRESQL COMPLETADO EXITOSAMENTE!");
  } finally {
    await client.end();
  }
}

seed().catch(console.error);
