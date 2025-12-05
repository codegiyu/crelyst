/* eslint-disable @typescript-eslint/no-explicit-any */
import { Notification } from '../../models/notification';
import { logger } from '../../lib/utils/logger';
import mongoose from 'mongoose';
import { NotificationStatus } from '../../lib/types/constants';

export interface CreateNotificationData {
  user: mongoose.Types.ObjectId;
  userModel: 'User' | 'Admin';
  eventType?: string;
  title: string;
  message: string;
  triggerDate?: Date;
  expiresAt?: Date;
  status?: NotificationStatus;
  expiredAt?: Date | null;
  context?: Record<string, unknown>;
}

/**
 * Create a notification in the database
 */
export async function createNotification(data: CreateNotificationData) {
  const notification = await Notification.create({
    ...data,
    triggerDate: data.triggerDate || new Date(),
    expiresAt: data.expiresAt || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days default
    status: data.status ?? 'active',
    expiredAt: data.expiredAt ?? null,
    context: data.context,
  });

  return notification;
}

/**
 * Send a real-time notification to a user via Socket.io
 * @param userId - The user's ID (used as room identifier)
 * @param notification - The notification object to send
 */
export async function sendRealTimeNotification(
  userId: string | mongoose.Types.ObjectId,
  notification: {
    _id?: any;
    title: string;
    message: string;
    eventType?: string;
    isRead?: boolean;
    createdAt?: Date;
    status?: NotificationStatus;
    context?: Record<string, unknown>;
    [key: string]: any;
  }
) {
  try {
    logger.info(`Sending real-time notification: ${notification.title}`);
    // if (!global.io) {
    //   logger.warn('Socket.io server not initialized, cannot send real-time notification');
    //   return;
    // }
    // const userIdString = typeof userId === 'string' ? userId : userId.toString();
    // const userRoom = buildUserRoomId(userIdString);
    // const notificationPayload = {
    //   success: true,
    //   type: SOCKET_EVENTS.NOTIFICATION,
    //   data: {
    //     _id: notification._id?.toString() || notification._id,
    //     title: notification.title,
    //     message: notification.message,
    //     eventType: notification.eventType,
    //     isRead: notification.isRead || false,
    //     createdAt: notification.createdAt || new Date(),
    //     status: notification.status ?? 'active',
    //     context: notification.context ?? undefined,
    //     ...Object.fromEntries(
    //       Object.entries(notification).filter(
    //         ([key]) =>
    //           ![
    //             '_id',
    //             'title',
    //             'message',
    //             'eventType',
    //             'isRead',
    //             'createdAt',
    //             'status',
    //             'context',
    //           ].includes(key)
    //       )
    //     ),
    //   },
    // };
    // // Emit to the user's room (userId is the room identifier)
    // global.io.to(userRoom).to(userIdString).emit(SOCKET_EVENTS.NOTIFICATION, notificationPayload);
    // logger.debug('Real-time notification sent', {
    //   userId: userIdString,
    //   notificationId: notification._id,
    //   title: notification.title,
    // });
  } catch (error) {
    logger.error('Failed to send real-time notification', {
      userId,
      error,
    });
  }
}

/**
 * Create and send a notification in real-time
 * This is the main function to use when creating notifications that should be delivered immediately
 * @param data - Notification data
 * @param sendRealTime - Whether to send via Socket.io (default: true)
 */
export async function createAndSendNotification(
  data: CreateNotificationData,
  sendRealTime: boolean = true
) {
  // Create notification in database
  const notification = await createNotification(data);

  // Send real-time notification if requested
  if (sendRealTime) {
    await sendRealTimeNotification(data.user, {
      _id: notification._id,
      title: notification.title ?? '',
      message: notification.message ?? '',
      eventType: notification.eventType ?? '',
      isRead: notification.isRead,
      createdAt: notification.createdAt,
      status: notification.status,
      context: notification.context ?? undefined,
    });
  }

  return notification;
}

/**
 * Send notification to multiple users
 * @param userIds - Array of user IDs
 * @param notification - Notification data
 */
export async function sendNotificationToMultipleUsers(
  userIds: (string | mongoose.Types.ObjectId)[],
  notification: CreateNotificationData
) {
  const notifications = await Promise.all(
    userIds.map(async userId => {
      const userSpecificNotification = {
        ...notification,
        user: typeof userId === 'string' ? (userId as any) : userId,
      };
      return createAndSendNotification(userSpecificNotification, true);
    })
  );

  return notifications;
}
