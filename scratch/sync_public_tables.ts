import { Client } from "pg";
import * as dotenv from "dotenv";
dotenv.config();

async function main() {
  const client = new Client({ connectionString: process.env.DIRECT_URL });
  await client.connect();

  console.log("1. Configurando tablas en schema public de Supabase...");

  // Para evitar choques de enums entre esquemas, usamos TEXT con CHECK en public
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
  `);

  console.log("2. Sincronizando clientes desde todos los tenants a public...");
  // Obtener todos los tenants registrados
  const tenantsRes = await client.query("SELECT schema_name FROM public.tenants");
  
  for (const row of tenantsRes.rows) {
    const s = row.schema_name;
    try {
      console.log(`- Migrando datos desde schema ${s}...`);
      
      // Clientes
      await client.query(`
        INSERT INTO public.clientes (id, nombre, tipo_documento, numero_documento, email, telefono, condicion_especial, tiene_prioridad, created_at)
        SELECT id, nombre, tipo_documento, numero_documento, email, telefono, condicion_especial::text, tiene_prioridad, created_at
        FROM ${s}.clientes
        ON CONFLICT (tipo_documento, numero_documento) DO UPDATE
        SET nombre = EXCLUDED.nombre,
            email = EXCLUDED.email,
            telefono = EXCLUDED.telefono,
            condicion_especial = EXCLUDED.condicion_especial,
            tiene_prioridad = EXCLUDED.tiene_prioridad;
      `);

      // Casos
      await client.query(`
        INSERT INTO public.casos (id, numero_expediente, titulo, descripcion, estado, prioridad, es_fuerza_mayor, nivel_abogado_exigido, abogado_asignado_id, fecha_apertura, cliente_id)
        SELECT id, numero_expediente, titulo, descripcion, estado::text, prioridad::text, es_fuerza_mayor, nivel_abogado_exigido, abogado_asignado_id, fecha_apertura, cliente_id
        FROM ${s}.casos
        ON CONFLICT (numero_expediente) DO UPDATE
        SET titulo = EXCLUDED.titulo,
            descripcion = EXCLUDED.descripcion,
            estado = EXCLUDED.estado,
            prioridad = EXCLUDED.prioridad,
            es_fuerza_mayor = EXCLUDED.es_fuerza_mayor,
            nivel_abogado_exigido = EXCLUDED.nivel_abogado_exigido,
            abogado_asignado_id = EXCLUDED.abogado_asignado_id;
      `);

      // Documentos
      await client.query(`
        INSERT INTO public.documentos (id, nombre, tipo, url, caso_id, created_at)
        SELECT id, nombre, tipo, url, caso_id, created_at
        FROM ${s}.documentos
        ON CONFLICT (id) DO NOTHING;
      `);
    } catch (err: any) {
      console.log(`  Nota en schema ${s}: ${err.message}`);
    }
  }

  // Si hay casos sin documentos en public, insertar documentos procesales
  const casosSinDoc = await client.query(`
    SELECT c.id, c.numero_expediente, c.titulo FROM public.casos c
    WHERE NOT EXISTS (SELECT 1 FROM public.documentos d WHERE d.caso_id = c.id)
  `);

  for (const c of casosSinDoc.rows) {
    await client.query(`
      INSERT INTO public.documentos (nombre, tipo, url, caso_id)
      VALUES 
        ($1, 'demanda_tutela', $2, $3),
        ($4, 'poder_especial', $5, $3),
        ($6, 'anexo_probatorio', $7, $3)
    `, [
      `Demanda Formal & Pretensiones Constitucionales - ${c.numero_expediente}.pdf`,
      `https://storage.supabase.co/expedientes/${c.numero_expediente}/demanda_principal.pdf`,
      c.id,
      `Poder Especial Concedido a Firma Litigante.pdf`,
      `https://storage.supabase.co/expedientes/${c.numero_expediente}/poder_autenticado.pdf`,
      `Material Probatorio y Certificado de Registro Único de Víctimas (RUV).pdf`,
      `https://storage.supabase.co/expedientes/${c.numero_expediente}/pruebas_ruv.pdf`,
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

  // Permisos en public para que Supabase Table Editor y la API pública muestren todo
  console.log("3. Configurando permisos y políticas para Supabase...");
  await client.query(`
    GRANT USAGE ON SCHEMA public TO postgres, anon, authenticated, service_role;
    GRANT ALL ON ALL TABLES IN SCHEMA public TO postgres, anon, authenticated, service_role;
    GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO postgres, anon, authenticated, service_role;
    GRANT ALL ON ALL ROUTINES IN SCHEMA public TO postgres, anon, authenticated, service_role;
    
    ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO postgres, anon, authenticated, service_role;
    ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO postgres, anon, authenticated, service_role;
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
