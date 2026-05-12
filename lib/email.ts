import { Resend } from "resend";

import { env } from "@/lib/env";

let _resend: Resend | null = null;

function getResend(): Resend {
  if (!_resend) {
    _resend = new Resend(env.RESEND_API_KEY);
  }
  return _resend;
}

export async function sendWaitlistConfirmation({
  to,
  role,
  neighborhood,
}: {
  to: string;
  role: "homeowner" | "tradesperson";
  neighborhood?: string | null;
}) {
  const subject =
    role === "homeowner"
      ? "You're on the Stoop waitlist"
      : "Welcome — let's get you verified for Stoop";

  const html =
    role === "homeowner"
      ? renderHomeownerHtml({ neighborhood })
      : renderTradespersonHtml({ neighborhood });

  const text =
    role === "homeowner"
      ? renderHomeownerText({ neighborhood })
      : renderTradespersonText({ neighborhood });

  return getResend().emails.send({
    from: env.EMAIL_FROM,
    to,
    subject,
    html,
    text,
    replyTo: "hello@stoop.app",
  });
}

function renderHomeownerHtml({ neighborhood }: { neighborhood?: string | null }) {
  const where = neighborhood ? ` in <strong>${escape(neighborhood)}</strong>` : "";
  return wrap(`
    <h1 style="margin:0 0 16px;font-family:Georgia,serif;font-size:28px;color:#1a1a18;">
      You&rsquo;re on the stoop.
    </h1>
    <p>Thanks for joining the Stoop waitlist${where}.</p>
    <p>We&rsquo;re launching block by block, starting in Brooklyn brownstone neighborhoods.
    We&rsquo;ll email you the moment Stoop opens up in your area.</p>
    <p>In the meantime: tell a neighbor. We move faster when blocks come together.</p>
    <p style="color:#686860;font-size:14px;margin-top:32px;">
      &mdash; The Stoop team
    </p>
  `);
}

function renderHomeownerText({
  neighborhood,
}: {
  neighborhood?: string | null;
}) {
  const where = neighborhood ? ` in ${neighborhood}` : "";
  return [
    `You're on the stoop.`,
    ``,
    `Thanks for joining the Stoop waitlist${where}.`,
    `We're launching block by block, starting in Brooklyn brownstone neighborhoods.`,
    `We'll email you the moment Stoop opens up in your area.`,
    ``,
    `In the meantime: tell a neighbor. We move faster when blocks come together.`,
    ``,
    `— The Stoop team`,
  ].join("\n");
}

function renderTradespersonHtml({
  neighborhood,
}: {
  neighborhood?: string | null;
}) {
  const where = neighborhood ? ` working in <strong>${escape(neighborhood)}</strong>` : "";
  return wrap(`
    <h1 style="margin:0 0 16px;font-family:Georgia,serif;font-size:28px;color:#1a1a18;">
      Welcome to Stoop.
    </h1>
    <p>Thanks for applying to be a Stoop pro${where}.</p>
    <p>A real person from our team will reach out within a few days to verify your
    license, insurance, and business details. Once you&rsquo;re verified, you can
    start bidding on jobs in your area &mdash; for free.</p>
    <p>If you want to fast-track, reply to this email with:</p>
    <ul>
      <li>Your business name and primary trade(s)</li>
      <li>License # and issuing state</li>
      <li>Insurance carrier</li>
      <li>A photo or two of recent work</li>
    </ul>
    <p style="color:#686860;font-size:14px;margin-top:32px;">
      &mdash; The Stoop team
    </p>
  `);
}

function renderTradespersonText({
  neighborhood,
}: {
  neighborhood?: string | null;
}) {
  const where = neighborhood ? ` working in ${neighborhood}` : "";
  return [
    `Welcome to Stoop.`,
    ``,
    `Thanks for applying to be a Stoop pro${where}.`,
    `A real person from our team will reach out within a few days to verify your`,
    `license, insurance, and business details. Once you're verified, you can`,
    `start bidding on jobs in your area — for free.`,
    ``,
    `Want to fast-track? Reply with:`,
    `  - Business name and primary trade(s)`,
    `  - License # and issuing state`,
    `  - Insurance carrier`,
    `  - A photo or two of recent work`,
    ``,
    `— The Stoop team`,
  ].join("\n");
}

function wrap(inner: string) {
  return `<!doctype html><html><body style="margin:0;padding:0;background:#fdfaf5;font-family:-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;color:#1a1a18;">
    <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="padding:32px 16px;">
      <tr>
        <td align="center">
          <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="max-width:560px;background:#fdfaf5;border:1px solid #e6e6e3;border-radius:16px;padding:32px;">
            <tr>
              <td style="padding-bottom:16px;font-family:Georgia,serif;font-size:18px;font-weight:600;color:#c24f37;">
                Stoop
              </td>
            </tr>
            <tr>
              <td style="font-size:16px;line-height:1.6;">
                ${inner}
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body></html>`;
}

function escape(s: string) {
  return s.replace(/[&<>"']/g, (c) => {
    switch (c) {
      case "&":
        return "&amp;";
      case "<":
        return "&lt;";
      case ">":
        return "&gt;";
      case '"':
        return "&quot;";
      case "'":
        return "&#39;";
      default:
        return c;
    }
  });
}
