import { SignJWT, jwtVerify } from "jose";

export interface AuthSession {
  userId: string;
  email: string;
  nombre: string;
  role: string;
  tenantId: string;
  schemaName: string;
}

const JWT_SECRET =
  process.env.JWT_SECRET || "despacho-super-secret-jwt-key-min-32-chars-2026";
const SECRET_BYTES = new TextEncoder().encode(JWT_SECRET);
const TOKEN_EXPIRATION = "7d"; // 7 días de validez para sesión

/**
 * Firma un token JWT con la información de sesión y resolución del tenant.
 */
export async function signAuthToken(payload: AuthSession): Promise<string> {
  return await new SignJWT({
    sub: payload.userId,
    email: payload.email,
    nombre: payload.nombre,
    role: payload.role,
    tenantId: payload.tenantId,
    schemaName: payload.schemaName,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(TOKEN_EXPIRATION)
    .sign(SECRET_BYTES);
}

/**
 * Verifica y decodifica un token JWT usando `jose` (compatible con Edge y Node.js).
 */
export async function verifyAuthToken(
  token: string
): Promise<AuthSession | null> {
  try {
    const { payload } = await jwtVerify(token, SECRET_BYTES);

    if (
      !payload.sub ||
      !payload.email ||
      !payload.tenantId ||
      !payload.schemaName
    ) {
      return null;
    }

    return {
      userId: String(payload.sub),
      email: String(payload.email),
      nombre: String(payload.nombre || ""),
      role: String(payload.role || "junior"),
      tenantId: String(payload.tenantId),
      schemaName: String(payload.schemaName),
    };
  } catch {
    return null;
  }
}

/**
 * Valida de forma estricta que un nombre de schema PostgreSQL sea seguro.
 * Solo permite minúsculas, números y guión bajo, empezando por "tenant_".
 */
export function isValidSchemaName(schemaName: string): boolean {
  const schemaRegex = /^tenant_[a-z0-9_]{3,30}$/;
  return schemaRegex.test(schemaName);
}

/**
 * Genera un nombre de schema seguro y determinista a partir de un prefijo aleatorio.
 * Ejemplo: "tenant_c8f2a1b9"
 */
export function generateTenantSchemaName(): string {
  const randomSuffix = Math.random().toString(36).substring(2, 10);
  return `tenant_${randomSuffix}`;
}
