/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Job } from 'bullmq';
import nodemailer from 'nodemailer';
import { render } from '@react-email/render';
import { type JSX } from 'react';
import { OTPCode } from '../templates/OTP';
import { logger } from '../../lib/utils/logger';
import { ENVIRONMENT } from '../../lib/config/environment';
import { JOB_TYPE } from '../../lib/types/queues';
import { ChangePasswordLink } from '../templates/ResetPassword';
import { NotificationEmail } from '../templates/NotificationEmail';
import { InviteAdmin } from '../templates/InviteAdmin';
import { validateCompany, getCompanyBranding, getCompanySender } from '../../lib/utils/branding';
import { createEmailLog, updateEmailStatus } from '../../lib/utils/emailTracking';
import { updateNotificationEmailDelivery } from '../../lib/utils/notificationEmailDelivery';
import { EmailLog } from '../../models/emailLog';

const TEMPLATES: Partial<
  Record<
    JOB_TYPE,
    {
      subject: string;
      template: (data: any) => JSX.Element;
    }
  >
> = {
  verificationCode: {
    subject: 'Account verification code',
    template: OTPCode,
  },
  resetPassword: {
    subject: 'Your password has been reset',
    template: ChangePasswordLink,
  },
  notificationEmail: {
    subject: 'You have a new notification',
    template: NotificationEmail,
  },
  inviteAdmin: {
    subject: 'Your Invitation to Company Name Admin Dashboard',
    template: InviteAdmin,
  },
};

export const sendEmail = async (job: Job) => {
  const { type, to, company } = job.data;
  const notificationId = job.data.notificationId as string | undefined;
  const jobId = job.id?.toString();

  // Validate company
  if (!company || !validateCompany(company)) {
    logger.error(`Invalid company: ${company}`, { jobId: job.id, type, to, company });
    throw new Error(
      `Invalid company: ${company}. Company must be one of: ${ENVIRONMENT.COMPANIES ? Object.keys(ENVIRONMENT.COMPANIES).join(', ') : 'none configured'}`
    );
  }

  // Get company branding
  const branding = getCompanyBranding(company);
  const senderName = getCompanySender(company);

  // Get template options
  const options = TEMPLATES[type as JOB_TYPE];

  logger.info(`Processing email job: ${job.id} of type ${type}`, { to, type, company });

  if (!options) {
    logger.error(`No email template found for ${type}`);
    return;
  }

  const subject = job.data.subject ?? options.subject;

  // Check if this is a retry/resend
  const existingEmailLogId = (job.data as any).emailLogId as string | undefined;
  const attemptNumber = job.attemptsMade || 0;
  let emailLogId: string | undefined;
  let existingEmailLog = null;

  try {
    // Priority 1: Manual resend with explicit emailLogId
    if (existingEmailLogId) {
      existingEmailLog = await EmailLog.findById(existingEmailLogId);
      if (existingEmailLog) {
        emailLogId = existingEmailLogId;
        logger.info(`Found email log for manual resend`, {
          emailLogId,
          jobId: job.id,
        });
      }
    }

    // Priority 2: BullMQ auto-retry - find existing email log by jobId
    // Note: BullMQ keeps the same job.id across retries
    if (!existingEmailLog) {
      existingEmailLog = await EmailLog.findOne({ jobId: String(job.id) });
      if (existingEmailLog) {
        emailLogId = existingEmailLog._id.toString();
        logger.info(`Found email log for auto-retry`, {
          emailLogId,
          jobId: job.id,
          attemptNumber,
        });
      }
    }

    // Update existing email log if found
    if (existingEmailLog && emailLogId) {
      // Increment retryCount - this is a retry (either manual resend or auto-retry)
      const newRetryCount = (existingEmailLog.retryCount || 0) + 1;
      await updateEmailStatus(
        { _id: emailLogId },
        {
          status: 'pending',
          jobId: String(job.id), // Update jobId in case it changed (shouldn't for BullMQ retries, but might for manual resends)
          retryCount: newRetryCount,
          error: undefined,
          metadata: {
            ...(existingEmailLog.metadata || {}),
            company,
            type,
            jobData: job.data,
            lastRetryAt: new Date(),
            ...(attemptNumber > 0 && { attemptNumber }),
          },
        }
      );
      logger.info(`Updated existing email log for retry`, {
        emailLogId,
        jobId: job.id,
        retryCount: newRetryCount,
        isManualResend: !!existingEmailLogId,
        attemptNumber,
      });
    } else {
      // Create new email log record if not found
      const emailLog = await createEmailLog({
        jobId: String(job.id),
        company,
        type: type as JOB_TYPE,
        to,
        from: branding.email.from,
        subject,
        provider: 'smtp',
        metadata: {
          company,
          type,
          // Store full job data for resending capability
          jobData: job.data,
        },
      });
      emailLogId = emailLog._id.toString();
      logger.info(`Created new email log`, {
        emailLogId,
        jobId: job.id,
        attemptNumber,
      });
    }
  } catch (logError) {
    logger.error(`Failed to create/update email log record`, { jobId: job.id, error: logError });
    // Continue with email sending even if log creation fails
  }

  try {
    // Get company-specific email configuration
    const companyEmail = branding.email;
    console.log('Company email data: ', companyEmail);

    const transporter = nodemailer.createTransport({
      port: companyEmail.port || 465,
      host: companyEmail.host,
      auth: {
        user: companyEmail.from,
        pass: companyEmail.password,
      },
      secure: true,
    });

    // Pass branding to template
    const templateData = {
      ...job.data,
      branding,
    };

    const htmlContent = await render(options.template(templateData));

    const mailOptions = {
      from: senderName,
      to: to,
      subject,
      html: htmlContent,
    };

    if (notificationId) {
      await updateNotificationEmailDelivery(notificationId, {
        status: 'queued',
        jobId: jobId ?? undefined,
        lastAttemptAt: new Date(),
        statusReason: null,
      });
    }

    const info = await transporter.sendMail(mailOptions);
    logger.info(`Successfully sent ${type} email to ${to}`, {
      jobId: job.id,
      type,
      to,
      company,
      messageId: info.messageId,
    });

    const sentAt = new Date();

    if (notificationId) {
      await updateNotificationEmailDelivery(notificationId, {
        status: 'sent',
        jobId: jobId ?? undefined,
        lastAttemptAt: sentAt,
        lastSentAt: sentAt,
        lastError: null,
        statusReason: null,
      });
    }

    // Update email log status to 'sent' with messageId, clear error, and store HTML content
    if (emailLogId) {
      try {
        await updateEmailStatus(
          { _id: emailLogId },
          {
            status: 'sent',
            sentAt: new Date(),
            messageId: info.messageId,
            error: null, // Clear error field when email is sent successfully
            htmlContent, // Store HTML content of the email
          }
        );
      } catch (updateError) {
        logger.error(`Failed to update email log status to sent`, {
          emailLogId,
          jobId: job.id,
          error: updateError,
        });
      }
    }
  } catch (error: any) {
    logger.error(`Failed to send ${type} email to ${to}`, {
      jobId: job.id,
      type,
      to,
      company,
      error,
    });

    const failedAt = new Date();

    if (notificationId) {
      await updateNotificationEmailDelivery(notificationId, {
        status: 'failed',
        jobId: jobId ?? undefined,
        lastAttemptAt: failedAt,
        lastError: error?.message || String(error),
        statusReason: 'sendFailed',
      });
    }

    // Update email log status to 'failed'
    if (emailLogId) {
      try {
        await updateEmailStatus(
          { _id: emailLogId },
          {
            status: 'failed',
            error: error?.message || String(error),
          }
        );
      } catch (updateError) {
        logger.error(`Failed to update email log status to failed`, {
          emailLogId,
          jobId: job.id,
          error: updateError,
        });
      }
    }

    throw error;
  }
};
