/* eslint-disable @typescript-eslint/no-explicit-any */
import mongoose from 'mongoose';
import { Notification } from '../../models/notification';
import { NotificationStatus } from '../../lib/types/constants';
import { logger } from '../../lib/utils/logger';

type ExpireResult = {
  matchedCount: number;
  modifiedCount: number;
};

const buildUserFilter = (
  userId: mongoose.Types.ObjectId,
  userModel: 'Customer' | 'Admin' | 'Business'
) => ({
  user: userId,
  userModel,
  status: 'active' as NotificationStatus,
  expiresAt: { $lte: new Date() },
});

const buildExpiryUpdate = () => {
  const now = new Date();
  return {
    $set: {
      status: 'expired' as NotificationStatus,
      expiredAt: now,
      isRead: true,
      readAt: now,
    },
  };
};

export const expireNotificationsForUser = async (
  userId: mongoose.Types.ObjectId | string,
  userModel: 'Customer' | 'Admin' | 'Business'
): Promise<ExpireResult> => {
  try {
    const targetId = typeof userId === 'string' ? new mongoose.Types.ObjectId(userId) : userId;

    const result = await Notification.updateMany(
      buildUserFilter(targetId, userModel),
      buildExpiryUpdate()
    );

    return {
      matchedCount: result.matchedCount ?? (result as any).n ?? 0,
      modifiedCount: result.modifiedCount ?? (result as any).nModified ?? 0,
    };
  } catch (error) {
    logger.error('Failed to expire notifications for user', {
      userId,
      userModel,
      error,
    });

    return {
      matchedCount: 0,
      modifiedCount: 0,
    };
  }
};

export const expireNotifications = async (): Promise<ExpireResult> => {
  try {
    const result = await Notification.updateMany(
      {
        status: 'active',
        expiresAt: { $lte: new Date() },
      },
      buildExpiryUpdate()
    );

    return {
      matchedCount: result.matchedCount ?? (result as any).n ?? 0,
      modifiedCount: result.modifiedCount ?? (result as any).nModified ?? 0,
    };
  } catch (error) {
    logger.error('Failed to expire notifications', { error });
    return {
      matchedCount: 0,
      modifiedCount: 0,
    };
  }
};
