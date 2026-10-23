import { publicPrisma } from "./publicClient";

let hasSynced = false;

/**
 * Garantiza que las tablas `clientes`, `casos` y `documentos` existan y estén pobladas
 * directamente en el schema `public` de Supabase, para que aparezcan en el Table Editor
 * junto a `tenants` y `users`.
 */
export async function asegurarTablasEnPublic() {
  if (hasSynced) return;

  try {
    // 1. Crear tablas en schema public si no existen
    await publicPrisma.$executeRawUnsafe(`
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

    // 2. Sincronizar desde los schemas de cada tenant
    const tenants = await publicPrisma.tenant.findMany({
      select: { schemaName: true },
    });

    for (const t of tenants) {
      try {
        await publicPrisma.$executeRawUnsafe(`
          INSERT INTO public.clientes (id, nombre, tipo_documento, numero_documento, email, telefono, condicion_especial, tiene_prioridad, created_at)
          SELECT id, nombre, tipo_documento, numero_documento, email, telefono, condicion_especial::text, tiene_prioridad, created_at
          FROM "${t.schemaName}".clientes
          ON CONFLICT (tipo_documento, numero_documento) DO UPDATE
          SET nombre = EXCLUDED.nombre,
              email = EXCLUDED.email,
              telefono = EXCLUDED.telefono,
              condicion_especial = EXCLUDED.condicion_especial,
              tiene_prioridad = EXCLUDED.tiene_prioridad;
        `);

        await publicPrisma.$executeRawUnsafe(`
          INSERT INTO public.casos (id, numero_expediente, titulo, descripcion, estado, prioridad, es_fuerza_mayor, nivel_abogado_exigido, abogado_asignado_id, fecha_apertura, cliente_id)
          SELECT id, numero_expediente, titulo, descripcion, estado::text, prioridad::text, es_fuerza_mayor, nivel_abogado_exigido, abogado_asignado_id, fecha_apertura, cliente_id
          FROM "${t.schemaName}".casos
          ON CONFLICT (numero_expediente) DO UPDATE
          SET titulo = EXCLUDED.titulo,
              descripcion = EXCLUDED.descripcion,
              estado = EXCLUDED.estado,
              prioridad = EXCLUDED.prioridad,
              es_fuerza_mayor = EXCLUDED.es_fuerza_mayor,
              nivel_abogado_exigido = EXCLUDED.nivel_abogado_exigido,
              abogado_asignado_id = EXCLUDED.abogado_asignado_id;
        `);
      } catch (e) {
        // Esquema aún sin tablas o vacío
      }
    }

    // 3. Crear documentos procesales en public para casos que no tengan
    await publicPrisma.$executeRawUnsafe(`
      INSERT INTO public.documentos (nombre, tipo, url, caso_id)
      SELECT 
        'Demanda de Tutela y Dictamen Constitucional - ' || c.numero_expediente || '.pdf',
        'demanda_tutela',
        'https://storage.supabase.co/expedientes/' || c.numero_expediente || '/demanda.pdf',
        c.id
      FROM public.casos c
      WHERE NOT EXISTS (SELECT 1 FROM public.documentos d WHERE d.caso_id = c.id);
    `);

    // 4. Garantizar permisos en schema public para Supabase Table Editor
    await publicPrisma.$executeRawUnsafe(`
      GRANT USAGE ON SCHEMA public TO postgres, anon, authenticated, service_role;
      GRANT ALL ON ALL TABLES IN SCHEMA public TO postgres, anon, authenticated, service_role;
      GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO postgres, anon, authenticated, service_role;
    `);

    hasSynced = true;
  } catch (err) {
    console.warn("Aviso en asegurarTablasEnPublic:", err);
  }
}
