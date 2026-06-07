/**
 * Print a quick inventory of the database in DATABASE_URL: tables + row counts,
 * RLS status, policy counts, marketplace functions, storage buckets, and which
 * tables are published to Realtime. Read-only.
 *
 *   node scripts/inspect-db.mjs
 */
import { config } from "dotenv";
import postgres from "postgres";

config({ path: ".env.local" });

const sql = postgres(process.env.DATABASE_URL, {
  prepare: false,
  max: 1,
  ssl: "require",
});

try {
  const tables = await sql`
    select table_name from information_schema.tables
    where table_schema = 'public' order by table_name`;
  console.log("TABLES:", tables.map((t) => t.table_name).join(", "));

  const exts = await sql`select extname from pg_extension order by extname`;
  console.log("EXTENSIONS:", exts.map((e) => e.extname).join(", "));

  for (const t of tables) {
    const name = t.table_name;
    try {
      const [{ count }] = await sql`select count(*)::int as count from ${sql(name)}`;
      const [row] = await sql`
        select relrowsecurity from pg_class
        where relname = ${name} and relnamespace = 'public'::regnamespace`;
      console.log(`ROWS ${name}: ${count}  (rls=${row?.relrowsecurity})`);
    } catch (e) {
      console.log(`ROWS ${name}: error ${e.message}`);
    }
  }

  const policies = await sql`
    select tablename, count(*)::int as n from pg_policies
    where schemaname = 'public' group by tablename order by tablename`;
  console.log("POLICIES:", policies.length === 0 ? "(none)" : "");
  for (const p of policies) console.log(`  ${p.tablename}: ${p.n}`);

  const fns = await sql`
    select proname from pg_proc
    where pronamespace = 'public'::regnamespace
      and proname in ('get_job_feed','get_neighborhood_feed','enforce_bid_rules',
                      'close_job_when_full','close_expired_bid_windows',
                      'recompute_contractor_stats','set_updated_at')
    order by proname`;
  console.log("FUNCTIONS:", fns.map((f) => f.proname).join(", "));

  const buckets = await sql`select id, public from storage.buckets order by id`;
  console.log("BUCKETS:", buckets.map((b) => `${b.id}(${b.public ? "public" : "private"})`).join(", "));

  const realtime = await sql`
    select tablename from pg_publication_tables where pubname = 'supabase_realtime' order by tablename`;
  console.log("REALTIME:", realtime.map((r) => r.tablename).join(", "));
} finally {
  await sql.end();
}
