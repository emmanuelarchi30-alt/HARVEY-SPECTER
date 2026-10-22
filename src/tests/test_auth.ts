import bcrypt from "bcryptjs";
import { publicPrisma } from "../lib/db/publicClient";
import {
  generateTenantSchemaName,
  isValidSchemaName,
  signAuthToken,
  verifyAuthToken,
} from "../lib/auth/jwt";
import type { AuthSession } from "../lib/auth/jwt";

async function runAuthTests() {
  console.log("=== INICIANDO PRUEBAS DE AUTENTICACIÓN Y RESOLUCIÓN DE TENANT ===");

  // 1. Probar validación y generación segura de schema names
  console.log("\n1. Verificando generador y regex de nombres de schema:");
  const testSchema = generateTenantSchemaName();
  console.log(`- Schema generado: ${testSchema}`);
  console.log(`- Es válido: ${isValidSchemaName(testSchema)}`);
  console.log(`- Inyección SQL "tenant_test; DROP TABLE users;": ${isValidSchemaName("tenant_test; DROP TABLE users;")}`);
  console.log(`- Schema arbitrario "public": ${isValidSchemaName("public")}`);

  if (!isValidSchemaName(testSchema) || isValidSchemaName("tenant_test; DROP TABLE users;") || isValidSchemaName("public")) {
    throw new Error("Fallo en la validación de seguridad de schemaName");
  }

  // 2. Limpiar usuario anterior si existe
  const testEmail = "harvey.specter@spectercolombia.co";
  const existing = await publicPrisma.user.findUnique({ where: { email: testEmail } });
  if (existing) {
    await publicPrisma.user.delete({ where: { id: existing.id } });
    await publicPrisma.tenant.delete({ where: { id: existing.tenantId } });
  }

  // 3. Registrar Tenant (Firma Legal) y Usuario Administrador (Harvey Specter)
  console.log("\n2. Registrando nueva firma 'Specter & Asociados Colombia':");
  const passwordHash = await bcrypt.hash("harveyPassword123", 10);
  const schemaName = generateTenantSchemaName();

  const { tenant, user } = await publicPrisma.$transaction(async (tx) => {
    const t = await tx.tenant.create({
      data: {
        name: "Specter & Asociados Colombia",
        schemaName,
      },
    });

    const u = await tx.user.create({
      data: {
        email: testEmail,
        passwordHash,
        nombre: "Harvey Specter",
        role: "socio",
        experienciaAnios: 15,
        tenantId: t.id,
      },
    });

    return { tenant: t, user: u };
  });

  console.log(`✓ Despacho registrado con ID: ${tenant.id}, Schema: ${tenant.schemaName}`);
  console.log(`✓ Usuario creado con ID: ${user.id}, Rol: ${user.role}, Años Exp: ${user.experienciaAnios}`);

  // 4. Firmar y verificar JWT
  console.log("\n3. Firmando token JWT con la información de sesión y resolución de tenant:");
  const sessionData: AuthSession = {
    userId: user.id,
    email: user.email,
    nombre: user.nombre || "",
    role: user.role,
    tenantId: tenant.id,
    schemaName: tenant.schemaName,
  };

  const token = await signAuthToken(sessionData);
  console.log(`✓ Token JWT generado (longitud: ${token.length} caracteres)`);

  const verified = await verifyAuthToken(token);
  console.log("\n4. Verificando token JWT decodificado por el servidor:");
  console.log(verified);

  if (!verified || verified.schemaName !== tenant.schemaName || verified.userId !== user.id) {
    throw new Error("El token JWT verificado no coincide con los datos del tenant");
  }
  console.log("✓ Tenant y Schema resueltos correctamente a partir del JWT.");

  // 5. Probar autenticación con contraseña correcta e incorrecta
  console.log("\n5. Verificando validación de contraseñas con bcrypt:");
  const validPass = await bcrypt.compare("harveyPassword123", user.passwordHash);
  const wrongPass = await bcrypt.compare("contraseñaIncorrecta", user.passwordHash);

  console.log(`- Contraseña correcta aceptada: ${validPass}`);
  console.log(`- Contraseña errónea rechazada: ${!wrongPass}`);

  if (!validPass || wrongPass) {
    throw new Error("Fallo en la validación de hash bcrypt");
  }

  console.log("\n=== TODAS LAS PRUEBAS DE PASO 2 PASARON CON ÉXITO ===");
}

runAuthTests()
  .catch((e) => {
    console.error("Error en pruebas:", e);
    process.exit(1);
  })
  .finally(async () => {
    await publicPrisma.$disconnect();
  });
