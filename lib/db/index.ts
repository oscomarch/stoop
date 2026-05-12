import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import { env } from "@/lib/env";
import * as schema from "./schema";

/**
 * Postgres + Drizzle client.
 *
 * In dev, we cache the underlying connection on globalThis to avoid blowing
 * through connection limits when Next.js HMR remounts modules.
 */
declare global {
  // eslint-disable-next-line no-var
  var __stoopPg: ReturnType<typeof postgres> | undefined;
}

function makeClient() {
  const pg = globalThis.__stoopPg ??
    postgres(env.DATABASE_URL, {
      max: 10,
      prepare: false, // Supabase pooler requires prepare=false
    });

  if (process.env.NODE_ENV !== "production") {
    globalThis.__stoopPg = pg;
  }

  return drizzle(pg, { schema });
}

export const db = makeClient();
export { schema };
