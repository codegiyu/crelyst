import mongoose from 'mongoose';
import { User } from '../../models/user';
import { Admin } from '../../models/admin';
import { createAndSendNotification } from '../../lib/utils/notifications';
import { addJobToQueue } from '../../queues/jobs';
import { logger } from '../../lib/utils/logger';
import { COMPANY_KEYS, CompanyKey, IAdmin, IUser } from '../../lib/types/constants';
import {
  updateNotificationEmailDelivery,
  type NotificationEmailDeliveryStatus,
} from '../../lib/utils/notificationEmailDelivery';

type NotificationChannels = {
  realtime?: boolean;
  email?: boolean;
};

type DispatchNotificationOptions = {
  userId: string | mongoose.Types.ObjectId;
  userModel: 'User' | 'Admin';
  title: string;
  message: string;
  eventType?: string;
  triggerDate?: Date;
  expiresAt?: Date;
  company?: CompanyKey;
  subject?: string;
  channels?: NotificationChannels;
  context?: Record<string, unknown>;
};

const DEFAULT_COMPANY: CompanyKey = (COMPANY_KEYS as readonly CompanyKey[]).includes(
  'pin-global' as CompanyKey
)
  ? ('pin-global' as CompanyKey)
  : COMPANY_KEYS[0];

type EmailResolutionReason =
  | 'channelDisabled'
  | 'preferenceDisabled'
  | 'missingEmailAddress'
  | 'userNotFound';

type UserEmailResolution = {
  email: string | null;
  allowed: boolean;
  reason: EmailResolutionReason | null;
};

type NotificationChannelResolution = {
  email: UserEmailResolution;
  realtimeAllowed: boolean;
};

const makeResolution = (
  email: string | null,
  allowed: boolean,
  reason: EmailResolutionReason | null
): UserEmailResolution => ({
  email,
  allowed,
  reason,
});

const checkUserEligibility = async (
  userId: mongoose.Types.ObjectId
): Promise<NotificationChannelResolution | null> => {
  const user = await User.findById(userId)
    .select('email preferences isDeleted')
    .lean<Pick<IUser, 'email' | 'isDeleted'>>();

  if (!user || user.isDeleted) {
    logger.warn('dispatchNotification: user not found or deleted', { userId });
    return null;
  }

  const realtimeAllowed = false;

  // if (user.preferences?.emailNotifications === false) {
  //   return {
  //     email: makeResolution(null, false, 'preferenceDisabled'),
  //     realtimeAllowed,
  //   };
  // }

  if (!user.email) {
    return {
      email: makeResolution(null, false, 'missingEmailAddress'),
      realtimeAllowed,
    };
  }

  return {
    email: makeResolution(user.email, true, null),
    realtimeAllowed,
  };
};

const checkAdminEligibility = async (
  adminId: mongoose.Types.ObjectId
): Promise<NotificationChannelResolution | null> => {
  const admin = await Admin.findById(adminId).select('email').lean<Pick<IAdmin, 'email'>>();

  if (!admin) {
    logger.warn('dispatchNotification: admin not found or deleted', { userId: adminId });
    return null;
  }

  const realtimeAllowed = false;

  if (!admin.email) {
    return {
      email: makeResolution(null, false, 'missingEmailAddress'),
      realtimeAllowed,
    };
  }

  return {
    email: makeResolution(admin.email, true, null),
    realtimeAllowed,
  };
};

const normalizeObjectId = (value: string | mongoose.Types.ObjectId) =>
  typeof value === 'string' ? new mongoose.Types.ObjectId(value) : value;

export const dispatchNotification = async (options: DispatchNotificationOptions) => {
  const {
    userId,
    userModel,
    title,
    message,
    eventType,
    triggerDate,
    expiresAt,
    company = DEFAULT_COMPANY,
    subject,
    channels,
    context,
  } = options;

  const realtimeEnabled = channels?.realtime ?? true;
  const emailEnabled = channels?.email ?? true;

  const targetId = normalizeObjectId(userId);

  let emailAllowed = emailEnabled;
  let emailStatusReason: EmailResolutionReason | null = null;
  let email: string | null | undefined;
  let realtimeAllowed = realtimeEnabled;

  if (!emailEnabled) {
    emailAllowed = false;
    emailStatusReason = 'channelDisabled';
  }

  try {
    let channelResolution: NotificationChannelResolution | null = null;

    if (userModel === 'User') {
      channelResolution = await checkUserEligibility(targetId);
    } else if (userModel === 'Admin') {
      channelResolution = await checkAdminEligibility(targetId);
    } else {
      return null;
    }

    if (!channelResolution) {
      return null;
    }

    const { email: emailResolution, realtimeAllowed: userRealtimeAllowed } = channelResolution;

    email = emailResolution.email;
    emailAllowed = emailAllowed && emailResolution.allowed;
    realtimeAllowed = realtimeAllowed && userRealtimeAllowed;

    if (emailResolution.reason) {
      emailStatusReason = emailResolution.reason;
    }
  } catch (error) {
    logger.error('dispatchNotification: failed to resolve target user', {
      userId: targetId,
      userModel,
      error,
    });
    return null;
  }

  try {
    const notification = await createAndSendNotification(
      {
        user: targetId,
        userModel,
        title,
        message,
        eventType,
        triggerDate,
        expiresAt,
        context,
      },
      realtimeEnabled && realtimeAllowed
    );

    const emailAddress = typeof email === 'string' ? email : undefined;

    if (emailAllowed && emailAddress) {
      try {
        const job = await addJobToQueue({
          type: 'notificationEmail',
          company,
          to: emailAddress,
          title,
          message,
          eventType,
          notificationId: notification._id.toString(),
          userModel,
          subject: subject ?? title,
        });

        const jobId = job?.id ? job.id.toString() : undefined;

        await updateNotificationEmailDelivery(notification._id, {
          status: jobId ? 'queued' : 'failed',
          jobId: jobId ?? null,
          lastAttemptAt: new Date(),
          lastError: jobId ? null : 'Failed to enqueue notification email job',
          statusReason: jobId ? null : 'queueEnqueueFailed',
        });
      } catch (enqueueError) {
        logger.error('dispatchNotification: failed to enqueue notification email job', {
          userId: targetId,
          userModel,
          error: enqueueError,
        });
        await updateNotificationEmailDelivery(notification._id, {
          status: 'failed',
          jobId: null,
          lastAttemptAt: new Date(),
          lastError: enqueueError instanceof Error ? enqueueError.message : String(enqueueError),
          statusReason: 'queueEnqueueFailed',
        });
      }
    }

    if (!emailAllowed || !emailAddress) {
      const wasChannelDisabled = !emailEnabled || emailStatusReason === 'channelDisabled';
      const status: NotificationEmailDeliveryStatus = wasChannelDisabled ? 'disabled' : 'skipped';

      await updateNotificationEmailDelivery(notification._id, {
        status,
        jobId: null,
        lastError: null,
        statusReason:
          emailStatusReason ?? (wasChannelDisabled ? 'channelDisabled' : 'missingEmailAddress'),
      });
    }

    return notification;
  } catch (error) {
    logger.error('dispatchNotification: failed to send notification', {
      userId: targetId,
      userModel,
      error,
    });
    return null;
  }
};
