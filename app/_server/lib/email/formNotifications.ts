import nodemailer from 'nodemailer';
import { ENVIRONMENT } from '../config/environment';
import { getCompanyBranding, getCompanySender } from '../utils/branding';
import { logger } from '../utils/logger';

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function createTransporter() {
  const e = getCompanyBranding('crelyst').email;
  if (!e.host || !e.from || !e.password) {
    return null;
  }
  return nodemailer.createTransport({
    port: e.port || 465,
    host: e.host,
    auth: { user: e.from, pass: e.password },
    secure: true,
  });
}

/**
 * Notify site owner of a public form submission (direct SMTP).
 */
export async function notifyFormSubmission(options: {
  formLabel: string;
  fields: Record<string, string>;
}): Promise<void> {
  const transporter = createTransporter();
  if (!transporter) {
    logger.warn('SMTP not configured; skipping form notification email');
    return;
  }

  const branding = getCompanyBranding('crelyst');
  const to = branding.email.defaultTo || ENVIRONMENT.EMAIL.TO;
  if (!to) {
    logger.warn('No recipient for form notification (defaultTo / TO_EMAIL)');
    return;
  }

  const rows = Object.entries(options.fields)
    .map(
      ([k, v]) =>
        `<tr><td style="padding:8px;border:1px solid #eee;"><strong>${escapeHtml(k)}</strong></td><td style="padding:8px;border:1px solid #eee;">${escapeHtml(v)}</td></tr>`
    )
    .join('');

  const html = `<p>New <strong>${escapeHtml(options.formLabel)}</strong> from your website.</p><table style="border-collapse:collapse;width:100%;max-width:560px;">${rows}</table>`;

  await transporter.sendMail({
    from: getCompanySender('crelyst'),
    to,
    subject: `[${ENVIRONMENT.APP.NAME}] ${options.formLabel}`,
    html,
  });
}
