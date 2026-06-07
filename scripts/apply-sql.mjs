/**
 * Apply a raw .sql migration file to the database in DATABASE_URL.
 *
 * We use this instead of `drizzle-kit push` because drizzle-kit can't introspect
 * our PostGIS `geography` columns, and our migrations also carry RLS policies,
 * triggers, generated columns, and feed functions that drizzle-kit won't emit.
 *
 *   node scripts/apply-sql.mjs drizzle/0001_blind_bidding_marketplace.sql
 */
import { config } from "dotenv";
import postgres from "postgres";
import { readFileSync } from "fs";

config({ path: ".env.local" });

const file = process.argv[2];
if (!file) {
  console.error("usage: node scripts/apply-sql.mjs <path-to.sql>");
  process.exit(1);
}

const sql = postgres(process.env.DATABASE_URL, {
  prepare: false,
  max: 1,
  ssl: "require",
});

const script = readFileSync(file, "utf8");

try {
  const q = sql.unsafe(script);
  await (typeof q.simple === "function" ? q.simple() : q);
  console.log(`APPLIED ${file}`);
} catch (e) {
  console.error(`FAILED ${file}:`, e.message);
  if (e.position) console.error("  at position", e.position);
  if (e.hint) console.error("  hint:", e.hint);
  process.exitCode = 1;
} finally {
  await sql.end();
}
