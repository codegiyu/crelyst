import {
  ModelUserActivityLog,
  USER_ACTIVITY_ACTIONS,
  USER_ACTIVITY_RESOURCES,
} from '../lib/types/constants';
import mongoose, { Schema } from 'mongoose';

const ActivityLogSchema = new Schema<ModelUserActivityLog>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    action: { type: String, enum: USER_ACTIVITY_ACTIONS, required: true, index: true },
    resource: { type: String, enum: USER_ACTIVITY_RESOURCES, required: true, index: true },
    resourceId: { type: Schema.Types.Mixed, index: true },
    performedBy: { type: String, enum: ['self', 'admin', 'system'], default: 'self', index: true },
    description: { type: String },
    metadata: { type: Schema.Types.Mixed },
    ipAddress: { type: String },
    userAgent: { type: String },
    requestId: { type: String, index: true },
    performedAt: { type: Date, default: Date.now, index: true },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

ActivityLogSchema.pre(/^find/, function (next) {
  this.find({ isDeleted: { $ne: true } });
  next();
});

ActivityLogSchema.index({ user: 1, performedAt: -1 });
ActivityLogSchema.index({ action: 1, performedAt: -1 });
ActivityLogSchema.index({ resource: 1, resourceId: 1, performedAt: -1 });

export const ActivityLog =
  mongoose.models.ActivityLog ||
  mongoose.model<ModelUserActivityLog>('ActivityLog', ActivityLogSchema);
