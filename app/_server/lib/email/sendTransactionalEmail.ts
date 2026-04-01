/* eslint-disable @typescript-eslint/no-explicit-any */
import nodemailer from 'nodemailer';
import React from 'react';
import { nanoid } from 'nanoid';
import { ENVIRONMENT } from '../config/environment';
import type { JobData, JOB_TYPE, NotificationEmailJobData } from '../types/queues';
import { getCompanyBranding, getCompanySender, validateCompany } from '../utils/branding';
import type { CompanyKey } from '../types/constants';
import { createEmailLog, updateEmailStatus } from '../utils/emailTracking';
import { updateNotificationEmailDelivery } from '../utils/notificationEmailDelivery';
import { logger } from '../utils/logger';
import { renderEmailComponent } from './renderEmail';

const EMAIL_TYPES = new Set<JOB_TYPE>([
  'verificationCode',
  'resetPassword',
  'notificationEmail',
  'inviteAdmin',
]);

type EmailJobPayload = Extract<
  JobData,
  | { type: 'verificationCode' }
  | { type: 'resetPassword' }
  | { type: 'notificationEmail' }
  | { type: 'inviteAdmin' }
>;

function isEmailPayload(data: JobData): data is EmailJobPayload {
  return EMAIL_TYPES.has(data.type as JOB_TYPE);
}

async function loadTemplates() {
  const [{ OTPCode }, { ChangePasswordLink }, { NotificationEmail }, { InviteAdmin }] =
    await Promise.all([
      import('./templates/OTP'),
      import('./templates/ResetPassword'),
      import('./templates/NotificationEmail'),
      import('./templates/InviteAdmin'),
    ]);

  return {
    verificationCode: { subject: 'Account verification code', template: OTPCode },
    resetPassword: { subject: 'Your password has been reset', template: ChangePasswordLink },
    notificationEmail: { subject: 'You have a new notification', template: NotificationEmail },
    inviteAdmin: {
      subject: 'Your invitation to the admin dashboard',
      template: InviteAdmin,
    },
  } as const;
}

function resolveCompanyKey(data: JobData): CompanyKey {
  const key = (data as { company?: CompanyKey }).company ?? 'crelyst';
  if (!validateCompany(key)) {
    throw new Error(
      `Invalid company: ${key}. Expected one of: ${Object.keys(ENVIRONMENT.COMPANIES).join(', ')}`
    );
  }
  return key;
}

/**
 * Send a transactional email immediately (SMTP). No queue.
 */
export async function sendTransactionalEmail(data: JobData): Promise<void> {
  if (!isEmailPayload(data)) {
    logger.warn('sendTransactionalEmail: unsupported type', { type: (data as JobData).type });
    return;
  }

  const company = resolveCompanyKey(data);
  const { type, to } = data;
  const notificationId =
    type === 'notificationEmail' ? (data as { notificationId?: string }).notificationId : undefined;

  const jobId = nanoid();
  const templates = await loadTemplates();
  type TemplateMap = typeof templates;
  const entry = templates[type as keyof TemplateMap];
  if (!entry) {
    logger.error('No template for email type', { type });
    return;
  }

  const subject =
    type === 'notificationEmail' && (data as NotificationEmailJobData).subject
      ? (data as NotificationEmailJobData).subject!
      : entry.subject;

  const branding = getCompanyBranding(company);
  const senderName = getCompanySender(company);
  const companyEmail = branding.email;

  const emailLog = await createEmailLog({
    jobId,
    company,
    type,
    to,
    from: companyEmail.from,
    subject,
    provider: 'smtp',
    metadata: { type, company, jobData: data },
  });
  const emailLogId = emailLog._id;

  const Template = entry.template;
  const templateData = Object.assign({}, data, { branding });
  const templateComponent = React.createElement(Template as React.FC<any>, templateData);

  let htmlContent: string;
  try {
    htmlContent = await renderEmailComponent(templateComponent);
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    logger.error('Email render failed', { jobId, error: e });
    await updateEmailStatus({ _id: emailLogId }, { status: 'failed', error: msg });
    throw e;
  }

  const transporter = nodemailer.createTransport({
    port: companyEmail.port || 465,
    host: companyEmail.host,
    auth: { user: companyEmail.from, pass: companyEmail.password },
    secure: true,
  });

  try {
    const info = await transporter.sendMail({
      from: senderName,
      to,
      subject,
      html: htmlContent,
    });

    const sentAt = new Date();
    if (notificationId) {
      await updateNotificationEmailDelivery(notificationId, {
        status: 'sent',
        jobId,
        lastAttemptAt: sentAt,
        lastSentAt: sentAt,
        lastError: null,
        statusReason: null,
      });
    }

    await updateEmailStatus(
      { _id: emailLogId },
      {
        status: 'sent',
        sentAt,
        messageId: info.messageId,
        error: null,
        htmlContent,
      }
    );
    logger.info('Transactional email sent', { jobId, type, to, company });
  } catch (error: unknown) {
    const errMsg = error instanceof Error ? error.message : String(error);
    const failedAt = new Date();
    if (notificationId) {
      await updateNotificationEmailDelivery(notificationId, {
        status: 'failed',
        jobId,
        lastAttemptAt: failedAt,
        lastError: errMsg,
        statusReason: 'sendFailed',
      });
    }
    await updateEmailStatus({ _id: emailLogId }, { status: 'failed', error: errMsg });
    logger.error('Transactional email failed', { jobId, type, to, error });
    throw error;
  }
}
