import { cookies } from "next/headers";
import { AUTH_COOKIE_NAME } from "./cookies";
import { verifyAuthToken, AuthSession } from "./jwt";

/**
 * Obtiene y valida la sesión actual a partir de la cookie httpOnly.
 * Compatible con Server Components, Server Actions y Route Handlers (Next.js 16).
 * 
 * Regla de Oro Multi-Tenant:
 * NUNCA se confía en el tenantId o schema enviado por el cliente en query o headers.
 * El tenant y el schema se resuelven exclusivamente de la sesión verificada criptográficamente en el JWT.
 */
export async function getSession(): Promise<AuthSession | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(AUTH_COOKIE_NAME)?.value;

    if (!token) {
      return null;
    }

    return await verifyAuthToken(token);
  } catch {
    return null;
  }
}

/**
 * Exige una sesión activa. Si no existe, lanza un error tipado para interceptar en handlers.
 */
export async function requireSession(): Promise<AuthSession> {
  const session = await getSession();
  if (!session) {
    throw new Error("UNAUTHORIZED");
  }
  return session;
}
