import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    // Generate veikia ir be Turso; produkcijoje Vercel nustato DATABASE_URL.
    url: process.env.DATABASE_URL ?? "file:./prisma/dev.db",
  },
});
