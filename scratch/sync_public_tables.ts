import { Client } from "pg";
import * as dotenv from "dotenv";
dotenv.config();

async function main() {
  const client = new Client({ connectionString: process.env.DIRECT_URL });
  await client.connect();

  console.log("1. Configurando tablas y columnas en schema public de Supabase...");

  // Agregar columnas password_plana y cedula a public.users si no existen
  await client.query(`
    ALTER TABLE public.users ADD COLUMN IF NOT EXISTS password_plana TEXT;
    ALTER TABLE public.users ADD COLUMN IF NOT EXISTS cedula TEXT;
  `);

  // Actualizar contraseñas y cédulas de los abogados existentes
  await client.query(`
    UPDATE public.users SET password_plana = 'Harvey2026*', cedula = '80192834' WHERE email = 'harvey.specter@specterlaw.co';
    UPDATE public.users SET password_plana = 'Jessica2026*', cedula = '52893120' WHERE email = 'jessica.pearson@specterlaw.co';
    UPDATE public.users SET password_plana = 'MikeRoss2026*', cedula = '1018273645' WHERE email = 'mike.ross@specterlaw.co';
    UPDATE public.users SET password_plana = 'Rachel2026*', cedula = '1020495821' WHERE email = 'rachel.zane@specterlaw.co';
    UPDATE public.users SET password_plana = 'Abelardo2026*', cedula = '79823412' WHERE email = 'abelardo@delaespriella.co';
    UPDATE public.users SET password_plana = 'Andrea2026*', cedula = '1032849182' WHERE email = 'andrea.morales@delaespriella.co';
    UPDATE public.users SET password_plana = 'JaimeCastro2026*', cedula = '19283746' WHERE email = 'jaime.castro@defensoria-victimas.org';
    UPDATE public.users SET password_plana = 'Camila2026*', cedula = '1019283745' WHERE email = 'camila.rivera@defensoria-victimas.org';
    UPDATE public.users SET password_plana = 'Socio2026*' WHERE password_plana IS NULL;
    UPDATE public.users SET cedula = '1020304050' WHERE cedula IS NULL;
  `);

  // Crear o alterar tablas en public a tipo TEXT para máxima compatibilidad
  await client.query(`
    CREATE TABLE IF NOT EXISTS public.clientes (
      id TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
      nombre TEXT NOT NULL,
      tipo_documento TEXT NOT NULL,
      numero_documento TEXT NOT NULL,
      email TEXT,
      telefono TEXT,
      condicion_especial TEXT DEFAULT 'ninguna',
      tiene_prioridad BOOLEAN DEFAULT false,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      CONSTRAINT uq_public_cliente UNIQUE (tipo_documento, numero_documento)
    );

    CREATE TABLE IF NOT EXISTS public.casos (
      id TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
      numero_expediente TEXT UNIQUE NOT NULL,
      titulo TEXT NOT NULL,
      descripcion TEXT,
      estado TEXT DEFAULT 'abierto',
      prioridad TEXT DEFAULT 'media',
      es_fuerza_mayor BOOLEAN DEFAULT false,
      nivel_abogado_exigido TEXT DEFAULT 'junior',
      abogado_asignado_id TEXT,
      fecha_apertura TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      cliente_id TEXT NOT NULL REFERENCES public.clientes(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS public.documentos (
      id TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
      nombre TEXT NOT NULL,
      tipo TEXT NOT NULL,
      url TEXT NOT NULL,
      caso_id TEXT NOT NULL REFERENCES public.casos(id) ON DELETE CASCADE,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );

    -- Asegurar tipo TEXT para que ningún enum bloquee inserciones
    ALTER TABLE public.clientes ALTER COLUMN condicion_especial TYPE TEXT USING condicion_especial::text;
    ALTER TABLE public.casos ALTER COLUMN estado TYPE TEXT USING estado::text;
    ALTER TABLE public.casos ALTER COLUMN prioridad TYPE TEXT USING prioridad::text;
  `);

  console.log("2. Insertando clientes directos en public...");
  // Insertar clientes completos
  const clientesData = [
    {
      id: "cli_maria_delahoz",
      nombre: "María de la Hoz Urtado",
      tipo_documento: "CC",
      numero_documento: "1020304050",
      email: "maria.delahoz@correo.co",
      telefono: "3104567890",
      condicion_especial: "victima_conflicto",
      tiene_prioridad: true,
    },
    {
      id: "cli_carlos_ramirez",
      nombre: "Carlos Eduardo Ramírez",
      tipo_documento: "CC",
      numero_documento: "80123987",
      email: "carlos.ramirez@empresa.com",
      telefono: "3001234567",
      condicion_especial: "ninguna",
      tiene_prioridad: false,
    },
    {
      id: "cli_rodrigo_montoya",
      nombre: "Rodrigo Montoya Restrepo",
      tipo_documento: "CC",
      numero_documento: "71234567",
      email: "rodrigo.montoya@tierras.org",
      telefono: "3158901234",
      condicion_especial: "desplazado",
      tiene_prioridad: true,
    },
    {
      id: "cli_maria_elena",
      nombre: "María Elena Gómez",
      tipo_documento: "CC",
      numero_documento: "52890123",
      email: "maria.gomez@victimas.gov.co",
      telefono: "3209876543",
      condicion_especial: "victima_conflicto",
      tiene_prioridad: true,
    },
    {
      id: "cli_ana_lucia_velez",
      nombre: "Ana Lucía Vélez Osorio",
      tipo_documento: "CC",
      numero_documento: "43987123",
      email: "ana.velez@salud.co",
      telefono: "3127654321",
      condicion_especial: "madre_cabeza_familia",
      tiene_prioridad: true,
    },
  ];

  for (const c of clientesData) {
    await client.query(`
      INSERT INTO public.clientes (id, nombre, tipo_documento, numero_documento, email, telefono, condicion_especial, tiene_prioridad)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      ON CONFLICT (tipo_documento, numero_documento) DO UPDATE
      SET nombre = EXCLUDED.nombre,
          email = EXCLUDED.email,
          telefono = EXCLUDED.telefono,
          condicion_especial = EXCLUDED.condicion_especial,
          tiene_prioridad = EXCLUDED.tiene_prioridad;
    `, [c.id, c.nombre, c.tipo_documento, c.numero_documento, c.email, c.telefono, c.condicion_especial, c.tiene_prioridad]);
  }

  console.log("3. Insertando casos y radicados directos en public...");
  // Obtener IDs de abogados reales
  const harvey = await client.query("SELECT id FROM public.users WHERE email = 'harvey.specter@specterlaw.co' LIMIT 1");
  const jessica = await client.query("SELECT id FROM public.users WHERE email = 'jessica.pearson@specterlaw.co' LIMIT 1");
  const mike = await client.query("SELECT id FROM public.users WHERE email = 'mike.ross@specterlaw.co' LIMIT 1");

  const harveyId = harvey.rows[0]?.id || null;
  const jessicaId = jessica.rows[0]?.id || null;
  const mikeId = mike.rows[0]?.id || null;

  const casosData = [
    {
      id: "cas_rad_7658",
      numero_expediente: "RAD-2026-7658",
      titulo: "Acción de Tutela por Derecho Fundamental a la Salud y Medicamentos de Alto Costo",
      descripcion: "[DICTAMEN IA Y FUNDAMENTACIÓN CONSTITUCIONAL]: Especial Protección Constitucional bajo Art. 13 y Art. 49 C.P. Asignación obligatoria a Abogado Mayor (Socia Titular Dra. Jessica Pearson). Precedente: Sentencia T-760/08.",
      estado: "en_curso",
      prioridad: "urgente",
      es_fuerza_mayor: true,
      nivel_abogado_exigido: "senior",
      abogado_asignado_id: jessicaId,
      cliente_id: "cli_maria_delahoz",
    },
    {
      id: "cas_rad_8994",
      numero_expediente: "RAD-2026-8994",
      titulo: "Demanda de Reparación Directa y Medidas Cautelares Urgentes",
      descripcion: "[FAST TRACK • PAGO GRANDE CONTRATADO]: Tiempo de estudio en menos de 12 horas garantizado. Asignación inmediata del Socio Director Harvey Specter.",
      estado: "abierto",
      prioridad: "urgente",
      es_fuerza_mayor: true,
      nivel_abogado_exigido: "senior",
      abogado_asignado_id: harveyId,
      cliente_id: "cli_maria_delahoz",
    },
    {
      id: "cas_rad_7561",
      numero_expediente: "RAD-2026-7561",
      titulo: "Restitución de Tierras y Desplazamiento Forzado - Sentencia T-025",
      descripcion: "[DICTAMEN CONSTITUCIONAL]: Amparo de especial protección a desplazados. Precedente: T-025 de 2004 (Estado de Cosas Inconstitucional). Asignado a Harvey Specter.",
      estado: "en_curso",
      prioridad: "urgente",
      es_fuerza_mayor: false,
      nivel_abogado_exigido: "senior",
      abogado_asignado_id: harveyId,
      cliente_id: "cli_rodrigo_montoya",
    },
    {
      id: "cas_rad_3022",
      numero_expediente: "RAD-2026-3022",
      titulo: "Derecho de Petición y Asesoría Societaria Ordinaria",
      descripcion: "Trámite Ordinario asignado a Abogado Asociado Mike Ross.",
      estado: "abierto",
      prioridad: "media",
      es_fuerza_mayor: false,
      nivel_abogado_exigido: "junior",
      abogado_asignado_id: mikeId,
      cliente_id: "cli_carlos_ramirez",
    },
    {
      id: "cas_rad_1044",
      numero_expediente: "RAD-2026-1044",
      titulo: "Indemnización Administrativa Ley 1448 de 2011 (Víctimas)",
      descripcion: "Reclamación ante la Unidad para las Víctimas amparada por Ley 1448. Asignada a Socio Titular.",
      estado: "en_curso",
      prioridad: "urgente",
      es_fuerza_mayor: false,
      nivel_abogado_exigido: "senior",
      abogado_asignado_id: jessicaId,
      cliente_id: "cli_maria_elena",
    },
  ];

  for (const caso of casosData) {
    await client.query(`
      INSERT INTO public.casos (id, numero_expediente, titulo, descripcion, estado, prioridad, es_fuerza_mayor, nivel_abogado_exigido, abogado_asignado_id, cliente_id)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      ON CONFLICT (numero_expediente) DO UPDATE
      SET titulo = EXCLUDED.titulo,
          descripcion = EXCLUDED.descripcion,
          estado = EXCLUDED.estado,
          prioridad = EXCLUDED.prioridad,
          es_fuerza_mayor = EXCLUDED.es_fuerza_mayor,
          nivel_abogado_exigido = EXCLUDED.nivel_abogado_exigido,
          abogado_asignado_id = EXCLUDED.abogado_asignado_id;
    `, [caso.id, caso.numero_expediente, caso.titulo, caso.descripcion, caso.estado, caso.prioridad, caso.es_fuerza_mayor, caso.nivel_abogado_exigido, caso.abogado_asignado_id, caso.cliente_id]);
  }

  console.log("4. Insertando documentos legales en public.documentos...");
  for (const caso of casosData) {
    await client.query(`
      INSERT INTO public.documentos (id, nombre, tipo, url, caso_id)
      VALUES 
        (gen_random_uuid(), $1, 'demanda_tutela', $2, $3),
        (gen_random_uuid(), $4, 'poder_especial', $5, $3)
      ON CONFLICT DO NOTHING;
    `, [
      `Demanda Formal & Pretensiones Constitucionales - ${caso.numero_expediente}.pdf`,
      `https://storage.supabase.co/expedientes/${caso.numero_expediente}/demanda_principal.pdf`,
      caso.id,
      `Poder Especial Concedido a Firma Litigante - ${caso.numero_expediente}.pdf`,
      `https://storage.supabase.co/expedientes/${caso.numero_expediente}/poder_autenticado.pdf`,
    ]);
  }

  // Poblar idempotency_keys
  await client.query(`
    INSERT INTO public.idempotency_keys (id, scope, key, endpoint, request_hash, status, response_code, created_at, expires_at)
    VALUES 
      (gen_random_uuid(), 'anon', 'key_radicacion_7658', '/api/clientes/registro-publico', 'hash_sha256_7658', 'completed', 201, NOW() - interval '2 hours', NOW() + interval '22 hours'),
      (gen_random_uuid(), 'anon', 'key_radicacion_8994', '/api/clientes/registro-publico', 'hash_sha256_8994', 'completed', 201, NOW() - interval '1 hour', NOW() + interval '23 hours'),
      (gen_random_uuid(), 'anon', 'key_radicacion_7561', '/api/clientes/registro-publico', 'hash_sha256_7561', 'completed', 201, NOW() - interval '30 minutes', NOW() + interval '23 hours')
    ON CONFLICT DO NOTHING;
  `);

  // Poblar rate_limit_hits
  await client.query(`
    INSERT INTO public.rate_limit_hits (bucket, created_at)
    VALUES 
      ('login:ip:186.84.90.12', NOW() - interval '15 minutes'),
      ('consulta:ip:186.84.90.12', NOW() - interval '10 minutes'),
      ('radicacion:ip:190.158.20.4', NOW() - interval '5 minutes'),
      ('radicacion:ip:181.134.12.88', NOW() - interval '1 minute');
  `);

  console.log("5. Otorgando permisos en public a roles de Supabase...");
  await client.query(`
    GRANT USAGE ON SCHEMA public TO postgres, anon, authenticated, service_role;
    GRANT ALL ON ALL TABLES IN SCHEMA public TO postgres, anon, authenticated, service_role;
    GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO postgres, anon, authenticated, service_role;
    GRANT ALL ON ALL ROUTINES IN SCHEMA public TO postgres, anon, authenticated, service_role;
  `);

  console.log("\n================ RECUENTO COMPLETO EN SUPABASE ================");
  const tables = [
    "tenants",
    "users",
    "clientes",
    "casos",
    "documentos",
    "idempotency_keys",
    "rate_limit_hits",
  ];
  for (const t of tables) {
    const res = await client.query(`SELECT count(*) FROM public.${t}`);
    console.log(`TABLA public.${t.padEnd(18)} : ${res.rows[0].count} registros cargados`);
  }
  console.log("===============================================================");

  await client.end();
}

main().catch(console.error);
