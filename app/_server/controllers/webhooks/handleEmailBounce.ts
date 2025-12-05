import { catchAsync } from '../../middlewares/catchAsync';
import { AppError } from '../../lib/utils/appError';
import { sendResponse } from '../../lib/utils/appResponse';
import { logger } from '../../lib/utils/logger';
import { updateEmailStatus, getEmailLog } from '../../lib/utils/emailTracking';
import { RequestContext, withRequestContext } from '../../lib/context/withRequestContext';
import { EmailStatus } from '../../lib/types/constants';
import { EmailLog } from '../../models/emailLog';

/**
 * Handle email bounce events from email providers
 * Supports various email provider webhook formats (SendGrid, AWS SES, Mailgun, etc.)
 */
export const handleEmailBounce = withRequestContext({ protect: false })(
  catchAsync(async context => {
    const { body, req } = context as RequestContext;
    const headers = req.headers;

    logger.info('Email bounce webhook received', {
      body: JSON.stringify(body),
      headers: JSON.stringify(headers),
    });

    // Extract bounce information from different provider formats
    let emailAddress: string | undefined;
    let messageId: string | undefined;
    let bounceType: 'hard' | 'soft' | undefined;
    let bounceReason: string | undefined;
    let bounceTimestamp: Date | undefined;

    // Try to extract from common webhook formats

    // Format 1: SendGrid style
    if (Array.isArray(body)) {
      const event = body[0];
      if (event) {
        emailAddress = event.email || event.recipient;
        messageId = event.sg_message_id || event.message_id;
        bounceType = event.type === 'bounce' && event.bounce_type === 'permanent' ? 'hard' : 'soft';
        bounceReason = event.reason || event.bounce_reason || event.description;
        bounceTimestamp = event.timestamp ? new Date(event.timestamp * 1000) : new Date();
      }
    }
    // Format 2: AWS SES style
    else if (body.Message && body.Type === 'Notification') {
      try {
        const message = JSON.parse(body.Message);
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
    }
    // Format 3: Mailgun style
    else if (body['event-data'] || body.event) {
      const eventData = body['event-data'] || body;
      emailAddress = eventData.recipient || eventData['user-variables']?.email;
      messageId = eventData.message?.headers?.['message-id'] || eventData.messageId;
      bounceType = eventData.severity === 'permanent' ? 'hard' : 'soft';
      bounceReason = eventData.reason || eventData.description;
      bounceTimestamp = eventData.timestamp ? new Date(eventData.timestamp * 1000) : new Date();
    }
    // Format 4: Generic format
    else {
      emailAddress = body.email || body.recipient || body.to || body.emailAddress;
      messageId = body.messageId || body.message_id || body.sg_message_id;
      bounceType = body.bounceType === 'hard' || body.bounceType === 'Permanent' ? 'hard' : 'soft';
      bounceReason = body.reason || body.bounceReason || body.description || body.error;
      bounceTimestamp = body.timestamp ? new Date(body.timestamp) : new Date();
    }

    // Validate required fields
    if (!emailAddress) {
      logger.warn('Email bounce webhook missing email address', { body });
      throw new AppError('Email address is required', 400);
    }

    if (!messageId) {
      logger.warn('Email bounce webhook missing message ID', { body, emailAddress });
      // Try to find by email address and recent timestamp if messageId is missing
      // This is a fallback for providers that don't include messageId
    }

    // Normalize email address
    emailAddress = emailAddress.toLowerCase().trim();

    // Find the email log record
    let emailLog;
    if (messageId) {
      emailLog = await getEmailLog({ messageId });
    }

    // If not found by messageId, try to find by email and recent timestamp (within last 24 hours)
    if (!emailLog) {
      logger.warn('Email log not found by messageId, attempting to find by email', {
        messageId,
        emailAddress,
      });

      // Try to find by email address and recent date (last 24 hours)
      const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
      emailLog = await EmailLog.findOne({
        to: emailAddress,
        createdAt: { $gte: oneDayAgo },
        status: { $in: ['pending', 'sent'] },
      })
        .sort({ createdAt: -1 })
        .exec();
    }

    if (!emailLog) {
      logger.warn('Email log not found for bounce event', {
        emailAddress,
        messageId,
        bounceType,
      });
      // Still return success to prevent webhook retries
      return sendResponse(200, null, 'Bounce event received (email log not found)');
    }

    // Update email log status to 'bounced'
    try {
      await updateEmailStatus(
        { _id: emailLog._id.toString() },
        {
          status: 'bounced' satisfies EmailStatus,
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
        bounceReason,
      });
    } catch (updateError) {
      logger.error('Failed to update email log status to bounced', {
        emailLogId: emailLog._id,
        error: updateError,
      });
      throw new AppError('Failed to process bounce event', 500);
    }

    return sendResponse(200, null, 'Bounce event processed successfully');
  })
);
