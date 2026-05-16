import { PrismaLibSql } from "@prisma/adapter-libsql";
import { PrismaClient } from "@/prisma/generated/prisma/client";

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient | undefined };

function createPrismaClient() {
  const url = process.env.DATABASE_URL ?? "file:./prisma/dev.db";
  const authToken =
    process.env.LIBSQL_AUTH_TOKEN?.trim() ||
    process.env.TURSO_AUTH_TOKEN?.trim();
  // Turso (libsql://) reikalauja auth token; lokaliai file: — ne.
  const adapter = new PrismaLibSql(authToken ? { url, authToken } : { url });
  return new PrismaClient({ adapter });
}

// Gamyboje kešuojame vieną instanciją; kūrimo režime visada nauja,
// kad prisma generate po schemos keitimo nepaliktų pasenusio kliento.
export const prisma =
  process.env.NODE_ENV === "production"
    ? (globalForPrisma.prisma ??= createPrismaClient())
    : createPrismaClient();
