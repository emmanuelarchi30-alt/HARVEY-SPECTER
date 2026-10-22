import { PrismaClient } from "@/generated/tenant-client";
import { isValidTenantSchema } from "./provisionTenant";

declare global {
  // eslint-disable-next-line no-var
  var globalTenantClientsCache: Map<string, PrismaClient> | undefined;
}

const MAX_CLIENTS = 20;

// Caché LRU de clientes Prisma por tenant
const tenantClientsCache =
  globalThis.globalTenantClientsCache ?? new Map<string, PrismaClient>();

if (process.env.NODE_ENV !== "production") {
  globalThis.globalTenantClientsCache = tenantClientsCache;
}

/**
 * Retorna un PrismaClient configurado exclusivamente para el schema de PostgreSQL del tenant.
 * 
 * ¿Por qué esta solución y NO search_path?
 * Prisma compila sus consultas calificando explícitamente el nombre del schema (ej. "tenant_xxx"."casos").
 * Por ende, ejecutar `SET search_path` o `set_config` se ignora por completo.
 * 
 * La solución segura y de alto rendimiento consiste en instanciar un PrismaClient con la URL
 * calificada con ?schema=tenant_xxx y &connection_limit=1 para el pooler,
 * almacenándolo en una caché LRU con límite estricto para no saturar las conexiones.
 */
export function getTenantClient(schemaName: string): PrismaClient {
  // 1. Validación estricta del nombre del schema
  if (!isValidTenantSchema(schemaName)) {
    throw new Error(
      `Identificador de schema de tenant inválido: ${schemaName}. Debe cumplir ^tenant_[a-z0-9]{12,}$`
    );
  }

  // 2. Si ya está en la caché LRU, refrescar posición (mover al final) y retornar
  if (tenantClientsCache.has(schemaName)) {
    const client = tenantClientsCache.get(schemaName)!;
    tenantClientsCache.delete(schemaName);
    tenantClientsCache.set(schemaName, client);
    return client;
  }

  // 3. Desalojar el cliente más antiguo si se alcanza el límite
  if (tenantClientsCache.size >= MAX_CLIENTS) {
    const oldestSchema = tenantClientsCache.keys().next().value;
    if (oldestSchema) {
      const oldestClient = tenantClientsCache.get(oldestSchema);
      tenantClientsCache.delete(oldestSchema);
      if (oldestClient) {
        oldestClient.$disconnect().catch((err: unknown) => {
          console.error(`Error al desconectar cliente LRU de ${oldestSchema}:`, err);
        });
      }
    }
  }

  // 4. Construir la URL del datasource con el schema del tenant y límite de conexión
  const baseUrl = process.env.DATABASE_URL;
  if (!baseUrl) {
    throw new Error("DATABASE_URL no está configurada");
  }

  const url = new URL(baseUrl);
  url.searchParams.set("schema", schemaName);
  url.searchParams.set("connection_limit", "1");
  const tenantDatasourceUrl = url.toString();

  // 5. Instanciar PrismaClient para el tenant
  const newClient = new PrismaClient({
    datasources: {
      db: {
        url: tenantDatasourceUrl,
      },
    },
    log:
      process.env.NODE_ENV === "development"
        ? ["query", "error", "warn"]
        : ["error"],
  });

  tenantClientsCache.set(schemaName, newClient);
  return newClient;
}
