import "dotenv/config";
import { createClient } from "@libsql/client";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const url = process.env.DATABASE_URL;
const authToken =
  process.env.LIBSQL_AUTH_TOKEN?.trim() ||
  process.env.TURSO_AUTH_TOKEN?.trim();

if (!url?.startsWith("libsql://")) {
  console.error("DATABASE_URL turi būti libsql://... (Turso)");
  process.exit(1);
}
if (!authToken) {
  console.error("Trūksta LIBSQL_AUTH_TOKEN");
  process.exit(1);
}

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const sqlPath = join(root, "prisma", "turso-init.sql");
const sql = readFileSync(sqlPath, "utf8");

const client = createClient({ url, authToken });

const statements = sql
  .split(/;\s*\n/)
  .map((s) => s.replace(/^--.*\n/gm, "").trim())
  .filter((s) => s.length > 0);

for (const statement of statements) {
  await client.execute(statement);
  const preview = statement.split("\n")[0].slice(0, 60);
  console.log("OK:", preview);
}

console.log("\nLentelės sukurtos Turso DB.");
