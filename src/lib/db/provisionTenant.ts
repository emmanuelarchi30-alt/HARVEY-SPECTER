import { Client } from "pg";
import fs from "fs";
import path from "path";
import crypto from "crypto";
import bcrypt from "bcryptjs";

export const SCHEMA_REGEX = /^tenant_[a-z0-9]{12,}$/;

export interface ProvisionTenantInput {
  tenantName: string;
  nombreAbogado: string;
  email: string;
  password: string;
  cedula?: string;
  role?: string;
  experienciaAnios?: number;
}

export interface ProvisionTenantResult {
  tenantId: string;
  tenantName: string;
  schemaName: string;
  userId: string;
  email: string;
  role: string;
}

/**
 * Valida de forma estricta el identificador de un schema para evitar inyecciones SQL.
 * Un identificador en PostgreSQL no admite parámetros enlazados en DDL ($1),
 * por lo que DEBE validarse estrictamente antes de usarse en sentencias SQL.
 */
export function isValidTenantSchema(schemaName: string): boolean {
  return SCHEMA_REGEX.test(schemaName);
}

/**
 * Genera un identificador de schema seguro y aleatorio.
 * Cumple con la expresión regular: ^tenant_[a-z0-9]{12,}$
 */
export function generateSecureSchemaName(): string {
  const randomHex = crypto.randomBytes(8).toString("hex"); // 16 caracteres hexadecimales
  return `tenant_${randomHex}`;
}

/**
 * Provisiona un nuevo tenant (despacho) en una única transacción atómica usando DIRECT_URL.
 * 
 * Acciones atómicas:
 * 1. Genera y valida un schemaName seguro (^tenant_[a-z0-9]{12,}$)
 * 2. Conecta a PostgreSQL con el driver 'pg' sobre DIRECT_URL
 * 3. Ejecuta CREATE SCHEMA dentro de una transacción
 * 4. Aplica el DDL de template.sql fijando SET LOCAL search_path al nuevo schema
 * 5. Registra el tenant en public.tenants
 * 6. Hashea la contraseña con bcrypt y registra al abogado administrador en public.users
 * 7. Si cualquier paso falla, hace ROLLBACK y elimina el schema para evitar esquemas huérfanos.
 */
export async function provisionTenant(
  input: ProvisionTenantInput
): Promise<ProvisionTenantResult> {
  const schemaName = generateSecureSchemaName();

  if (!isValidTenantSchema(schemaName)) {
    throw new Error(`Nombre de schema inválido generado: ${schemaName}`);
  }

  const directUrl = process.env.DIRECT_URL;
  if (!directUrl) {
    throw new Error("DIRECT_URL no está configurada en las variables de entorno");
  }

  // Leer la plantilla SQL que contiene la estructura DDL de las tablas del tenant
  const templatePath = path.join(process.cwd(), "prisma/tenant/template.sql");
  if (!fs.existsSync(templatePath)) {
    throw new Error(`No se encontró el archivo de plantilla SQL en: ${templatePath}`);
  }

  let templateSql = fs.readFileSync(templatePath, "utf-8");
  // Omitimos la sentencia de crear schema public de la plantilla para no alterar el schema global
  templateSql = templateSql.replace(/CREATE SCHEMA IF NOT EXISTS "public";/g, "");

  const client = new Client({
    connectionString: directUrl,
    ssl: directUrl.includes("supabase.co") ? { rejectUnauthorized: false } : undefined,
  });

  await client.connect();

  const tenantId = `tnt_${crypto.randomBytes(10).toString("hex")}`;
  const userId = `usr_${crypto.randomBytes(10).toString("hex")}`;
  const role = input.role || "socio";
  const experienciaAnios = input.experienciaAnios ?? 5;
  const passwordHash = await bcrypt.hash(input.password, 10);

  let schemaCreated = false;

  try {
    await client.query("BEGIN");

    // 1. Crear el schema aislado del despacho
    await client.query(`CREATE SCHEMA "${schemaName}"`);
    schemaCreated = true;

    // 2. Fijar search_path exclusivamente para esta sesión de provisión
    await client.query(`SET LOCAL search_path TO "${schemaName}"`);

    // 3. Ejecutar las sentencias DDL de template.sql dentro del nuevo schema
    await client.query(templateSql);

    // 4. Registrar el tenant en public.tenants
    await client.query(
      `INSERT INTO public.tenants (id, name, schema_name, created_at)
       VALUES ($1, $2, $3, NOW())`,
      [tenantId, input.tenantName, schemaName]
    );

    // 5. Registrar el usuario titular en public.users con password visible de respaldo y cédula
    await client.query(
      `INSERT INTO public.users (id, email, password_hash, password_plana, cedula, role, tenant_id, nombre, experiencia_anios, created_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW())`,
      [
        userId,
        input.email,
        passwordHash,
        input.password,
        input.cedula || "1020304050",
        role,
        tenantId,
        input.nombreAbogado,
        experienciaAnios,
      ]
    );

    // Confirmar la transacción atómica
    await client.query("COMMIT");

    return {
      tenantId,
      tenantName: input.tenantName,
      schemaName,
      userId,
      email: input.email,
      role,
    };
  } catch (error) {
    // Si algo falla, revertimos la transacción
    await client.query("ROLLBACK").catch(() => {});

    // Limpieza preventiva: aseguramos que no quede ningún schema huérfano
    if (schemaCreated) {
      await client.query(`DROP SCHEMA IF EXISTS "${schemaName}" CASCADE`).catch(() => {});
    }

    throw error;
  } finally {
    await client.end();
  }
}
