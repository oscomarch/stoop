/**
 * Centralized environment variable access with light validation.
 *
 * We intentionally do NOT throw at module load time so the marketing site
 * still builds without secrets configured (useful for previews / contributors
 * cloning the repo before having Supabase credentials). Instead, we throw
 * on first use of each variable.
 */

function required(name: string): string {
  const value = process.env[name];
  if (!value || value.length === 0) {
    throw new Error(
      `Missing required environment variable: ${name}. ` +
        `See .env.example for setup instructions.`
    );
  }
  return value;
}

function optional(name: string, fallback = ""): string {
  return process.env[name] ?? fallback;
}

export const env = {
  /** Public Supabase URL — safe to expose in the browser */
  get NEXT_PUBLIC_SUPABASE_URL() {
    return required("NEXT_PUBLIC_SUPABASE_URL");
  },
  /** Public Supabase anon key — safe to expose in the browser */
  get NEXT_PUBLIC_SUPABASE_ANON_KEY() {
    return required("NEXT_PUBLIC_SUPABASE_ANON_KEY");
  },
  /** Service-role Supabase key — server-only, never expose */
  get SUPABASE_SERVICE_ROLE_KEY() {
    return required("SUPABASE_SERVICE_ROLE_KEY");
  },
  /** Direct Postgres connection string for Drizzle */
  get DATABASE_URL() {
    return required("DATABASE_URL");
  },
  /** Resend API key for transactional email */
  get RESEND_API_KEY() {
    return required("RESEND_API_KEY");
  },
  /** Where to send waitlist confirmations from */
  get EMAIL_FROM() {
    return optional("EMAIL_FROM", "Stoop <hello@stoop.app>");
  },
  /** Public site URL — used in emails and OG */
  get NEXT_PUBLIC_SITE_URL() {
    return optional("NEXT_PUBLIC_SITE_URL", "http://localhost:3000");
  },
  /** Mapbox public token (browser-safe, scoped to your domain) */
  get NEXT_PUBLIC_MAPBOX_TOKEN() {
    return optional("NEXT_PUBLIC_MAPBOX_TOKEN");
  },
  /** PostHog public key */
  get NEXT_PUBLIC_POSTHOG_KEY() {
    return optional("NEXT_PUBLIC_POSTHOG_KEY");
  },
  get NEXT_PUBLIC_POSTHOG_HOST() {
    return optional("NEXT_PUBLIC_POSTHOG_HOST", "https://us.i.posthog.com");
  },
} as const;
