import { z } from 'zod';
import { Timestamp } from 'firebase-admin/firestore';
import { AppError } from '../../lib/utils/appError';
import { sendResponse } from '../../lib/utils/appResponse';
import { logger } from '../../lib/utils/logger';
import { updateEmailStatus, getEmailLog } from '../../lib/utils/emailTracking';
import { findEmailLogsByRecipientSince } from '../../lib/firestore/collections';
import type { EmailStatus } from '../../lib/types/constants';
import type { RouteHandler } from '../../lib/api/routeHandler';
import { validateBody } from '../../lib/api/validateBody';
import { assertWebhookSecretConfigured } from '../../lib/utils/verifyWebhookSecret';

/** Accept any array or object; provider-specific extraction happens below */
const emailBounceBodySchema = z.union([
  z.array(z.record(z.string(), z.unknown())),
  z.record(z.string(), z.unknown()),
]);

/**
 * Handle email bounce events from email providers
 * Supports various email provider webhook formats (SendGrid, AWS SES, Mailgun, etc.)
 */
export const handleEmailBounce: RouteHandler = async ({ body, request }) => {
  assertWebhookSecretConfigured(request);
  const payload = validateBody(emailBounceBodySchema, body ?? {});

  logger.info('Email bounce webhook received', {
    shape: Array.isArray(payload) ? 'array' : 'object',
    keyCount: Array.isArray(payload) ? payload.length : Object.keys(payload as object).length,
  });

  let emailAddress: string | undefined;
  let messageId: string | undefined;
  let bounceType: 'hard' | 'soft' | undefined;
  let bounceReason: string | undefined;
  let bounceTimestamp: Date | undefined;

  if (Array.isArray(payload)) {
    const event = payload[0];
    if (event) {
      emailAddress = (event.email || event.recipient) as string;
      messageId = (event.sg_message_id || event.message_id) as string;
      bounceType = event.type === 'bounce' && event.bounce_type === 'permanent' ? 'hard' : 'soft';
      bounceReason = (event.reason || event.bounce_reason || event.description) as string;
      bounceTimestamp =
        event.timestamp && typeof event.timestamp === 'number'
          ? new Date(event.timestamp * 1000)
          : new Date();
    }
  } else if (
    (payload as Record<string, unknown>).Message &&
    (payload as Record<string, unknown>).Type === 'Notification'
  ) {
    try {
      const message = JSON.parse((payload as Record<string, unknown>).Message as string);
      const mail = message.mail || {};
      const bounce = message.bounce || {};

      emailAddress = mail.destination?.[0] || bounce.bouncedRecipients?.[0]?.emailAddress;
      messageId = mail.messageId;
      bounceType = bounce.bounceType === 'Permanent' ? 'hard' : 'soft';
      bounceReason = bounce.bouncedRecipients?.[0]?.diagnosticCode || bounce.reason;
      bounceTimestamp = bounce.timestamp ? new Date(bounce.timestamp) : new Date();
    } catch (parseError) {
      logger.error('Failed to parse AWS SES bounce notification', { error: parseError });
    }
  } else if (
    (payload as Record<string, unknown>)['event-data'] ||
    (payload as Record<string, unknown>).event
  ) {
    const eventData = (payload as Record<string, unknown>)['event-data'] || payload;
    const ed = eventData as Record<string, unknown>;
    emailAddress =
      (ed.recipient as string) ||
      ((ed['user-variables'] as Record<string, unknown>)?.email as string);
    messageId =
      ((ed.message as Record<string, unknown>)?.headers as Record<string, string>)?.[
        'message-id'
      ] || (ed.messageId as string);
    bounceType = ed.severity === 'permanent' ? 'hard' : 'soft';
    bounceReason = (ed.reason as string) || (ed.description as string);
    bounceTimestamp = ed.timestamp ? new Date((ed.timestamp as number) * 1000) : new Date();
  } else {
    const b = payload as Record<string, unknown>;
    emailAddress =
      (b.email as string) ||
      (b.recipient as string) ||
      (b.to as string) ||
      (b.emailAddress as string);
    messageId = (b.messageId as string) || (b.message_id as string) || (b.sg_message_id as string);
    bounceType = b.bounceType === 'hard' || b.bounceType === 'Permanent' ? 'hard' : 'soft';
    bounceReason =
      (b.reason as string) ||
      (b.bounceReason as string) ||
      (b.description as string) ||
      (b.error as string);
    bounceTimestamp = b.timestamp ? new Date(b.timestamp as string) : new Date();
  }

  if (!emailAddress) {
    logger.warn('Email bounce webhook missing email address');
    throw new AppError('Email address is required', 400);
  }

  if (!messageId) {
    logger.warn('Email bounce webhook missing message ID', { emailAddress });
  }

  emailAddress = emailAddress.toLowerCase().trim();

  let emailLog = messageId ? await getEmailLog({ messageId }) : null;

  if (!emailLog) {
    logger.warn('Email log not found by messageId, attempting to find by email', {
      messageId,
      emailAddress,
    });

    const oneDayAgo = Timestamp.fromDate(new Date(Date.now() - 24 * 60 * 60 * 1000));
    const rows = await findEmailLogsByRecipientSince(emailAddress, oneDayAgo);
    const fallback = rows.find(r => r.status === 'pending' || r.status === 'sent');
    if (fallback) {
      emailLog = await getEmailLog({ id: fallback.id });
    }
  }

  if (!emailLog) {
    logger.warn('Email log not found for bounce event', {
      emailAddress,
      messageId,
      bounceType,
    });
    return sendResponse(200, null, 'Bounce event received (email log not found)');
  }

  try {
    await updateEmailStatus(
      { id: emailLog._id },
      {
        status: 'bounced' satisfies EmailStatus,
        bounceType: bounceType ?? 'soft',
        error: bounceReason || 'Email bounced',
        metadata: {
          ...(emailLog.metadata || {}),
          bounceType,
          bounceReason,
          bounceTimestamp: bounceTimestamp || new Date(),
          originalStatus: emailLog.status,
        },
      }
    );

    logger.info('Email bounce processed successfully', {
      emailLogId: emailLog._id,
      emailAddress,
      messageId,
      bounceType,
    });
  } catch (updateError) {
    logger.error('Failed to update email log status to bounced', {
      emailLogId: emailLog._id,
      error: updateError,
    });
    throw new AppError('Failed to process bounce event', 500);
  }

  return sendResponse(200, null, 'Bounce event processed successfully');
};
