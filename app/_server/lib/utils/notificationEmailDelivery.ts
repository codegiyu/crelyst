import mongoose from 'mongoose';
import { Notification } from '../../models/notification';
import { logger } from '../../lib/utils/logger';

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

const applyUnsetAwareUpdate = <T>(
  value: T | null | undefined,
  path: string,
  set: Record<string, unknown>,
  unset: Record<string, 1>
) => {
  if (value === undefined) return;
  if (value === null) {
    unset[path] = 1;
    return;
  }
  set[path] = value;
};

export const updateNotificationEmailDelivery = async (
  notificationId: mongoose.Types.ObjectId | string,
  update: NotificationEmailDeliveryUpdate
) => {
  try {
    const id =
      typeof notificationId === 'string'
        ? new mongoose.Types.ObjectId(notificationId)
        : notificationId;

    const set: Record<string, unknown> = {
      'emailDelivery.status': update.status,
    };
    const unset: Record<string, 1> = {};

    applyUnsetAwareUpdate(update.jobId, 'emailDelivery.jobId', set, unset);
    applyUnsetAwareUpdate(update.lastAttemptAt, 'emailDelivery.lastAttemptAt', set, unset);
    applyUnsetAwareUpdate(update.lastSentAt, 'emailDelivery.lastSentAt', set, unset);
    applyUnsetAwareUpdate(update.lastError, 'emailDelivery.lastError', set, unset);
    applyUnsetAwareUpdate(update.statusReason, 'emailDelivery.statusReason', set, unset);

    const updateQuery: Record<string, unknown> = {
      $set: set,
    };

    if (Object.keys(unset).length > 0) {
      updateQuery.$unset = unset;
    }

    await Notification.updateOne({ _id: id }, updateQuery).exec();
  } catch (error) {
    logger.error('Failed to update notification email delivery metadata', {
      notificationId,
      update,
      error,
    });
  }
};
