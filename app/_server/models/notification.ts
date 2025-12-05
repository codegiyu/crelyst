/* eslint-disable @typescript-eslint/no-explicit-any */
import { ModelNotification, NotificationEmailDelivery } from '../lib/types/constants';
import mongoose, { model, Schema } from 'mongoose';

const notificationSchema = new Schema<ModelNotification>({
  user: {
    type: Schema.Types.ObjectId,
    required: true,
    refPath: 'userModel',
    index: true,
  },
  userModel: {
    type: String,
    required: true,
    enum: ['User', 'Admin'],
  },
  eventType: {
    type: String,
  },
  title: { type: String },
  message: { type: String },
  isRead: {
    type: Boolean,
    default: false,
  },
  readAt: {
    type: Date,
    default: null,
  },
  context: {
    type: Schema.Types.Mixed,
    default: undefined,
  },
  status: {
    type: String,
    enum: ['active', 'expired'],
    default: 'active',
    index: true,
  },
  expiredAt: {
    type: Date,
    default: null,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  triggerDate: {
    type: Date,
    default: Date.now,
  },
  expiresAt: {
    type: Date,
    default: () => Date.now() + 30 * 24 * 60 * 60 * 1000,
  }, // Expire after 30 days
  emailDelivery: {
    type: new Schema<NotificationEmailDelivery>(
      {
        status: {
          type: String,
          enum: ['pending', 'queued', 'sent', 'failed', 'skipped', 'disabled'],
          default: 'pending',
        },
        jobId: { type: String },
        lastAttemptAt: { type: Date },
        lastSentAt: { type: Date },
        lastError: { type: String },
        statusReason: { type: String },
      },
      { _id: false }
    ),
    default: () => ({ status: 'pending' }),
  },
});

// TTL index for expiring notifications
notificationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

notificationSchema.pre(/^find/, function (this: any, next) {
  // Exclude expired notifications and notifications that have not been triggered yet
  this.find({
    expiresAt: { $gt: new Date() },
    triggerDate: { $lte: new Date() },
  });
  next();
});

export const Notification =
  mongoose.models.Notification || model<ModelNotification>('Notification', notificationSchema);
