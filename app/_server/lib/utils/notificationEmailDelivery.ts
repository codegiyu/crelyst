import { FieldValue, Timestamp } from 'firebase-admin/firestore';
import { adminDb } from '@/lib/firebase/admin';
import { logger } from './logger';

export type NotificationEmailDeliveryStatus =
  | 'pending'
  | 'queued'
  | 'sent'
  | 'failed'
  | 'skipped'
  | 'disabled';

type NullableString = string | null | undefined;
type NullableDate = Date | null | undefined;

export interface NotificationEmailDeliveryUpdate {
  status: NotificationEmailDeliveryStatus;
  jobId?: NullableString;
  lastAttemptAt?: NullableDate;
  lastSentAt?: NullableDate;
  lastError?: NullableString;
  statusReason?: NullableString;
}

export const updateNotificationEmailDelivery = async (
  notificationId: string,
  update: NotificationEmailDeliveryUpdate
) => {
  try {
    if (!adminDb) return;

    const ref = adminDb.collection('notifications').doc(String(notificationId));
    const snap = await ref.get();
    if (!snap.exists) {
      logger.debug('Notification not found for email delivery update', { notificationId });
      return;
    }

    const patch: Record<string, unknown> = {
      'emailDelivery.status': update.status,
      updatedAt: FieldValue.serverTimestamp(),
    };

    if (update.jobId !== undefined) {
      patch['emailDelivery.jobId'] = update.jobId === null ? FieldValue.delete() : update.jobId;
    }
    if (update.lastAttemptAt !== undefined) {
      patch['emailDelivery.lastAttemptAt'] =
        update.lastAttemptAt === null
          ? FieldValue.delete()
          : Timestamp.fromDate(update.lastAttemptAt);
    }
    if (update.lastSentAt !== undefined) {
      patch['emailDelivery.lastSentAt'] =
        update.lastSentAt === null ? FieldValue.delete() : Timestamp.fromDate(update.lastSentAt);
    }
    if (update.lastError !== undefined) {
      patch['emailDelivery.lastError'] =
        update.lastError === null ? FieldValue.delete() : update.lastError;
    }
    if (update.statusReason !== undefined) {
      patch['emailDelivery.statusReason'] =
        update.statusReason === null ? FieldValue.delete() : update.statusReason;
    }

    await ref.update(patch);
  } catch (error) {
    logger.error('Failed to update notification email delivery metadata', {
      notificationId,
      error,
    });
  }
};
