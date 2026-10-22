import { PrismaClient } from "../../generated/public-client/index.js";

declare global {
  // Evita múltiples instancias en desarrollo debido a Fast Refresh de Next.js
  // eslint-disable-next-line no-var
  var globalPrismaPublic: PrismaClient | undefined;
}

export const publicPrisma =
  globalThis.globalPrismaPublic ??
  new PrismaClient({
    log:
      process.env.NODE_ENV === "development"
        ? ["query", "error", "warn"]
        : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalThis.globalPrismaPublic = publicPrisma;
}
