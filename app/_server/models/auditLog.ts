import { AUDIT_ACTIONS, AUDIT_LOG_RESOURCES, ModelAuditLog } from '../lib/types/constants';
import mongoose, { Schema } from 'mongoose';

const AuditLogSchema = new Schema<ModelAuditLog>(
  {
    actor: { type: Schema.Types.ObjectId, ref: 'Admin', required: true, index: true },
    actorEmail: { type: String, index: true },
    action: { type: String, enum: AUDIT_ACTIONS, required: true, index: true },
    resource: { type: String, enum: AUDIT_LOG_RESOURCES, required: true, index: true },
    resourceId: { type: Schema.Types.Mixed, index: true },
    description: { type: String },
    metadata: { type: Schema.Types.Mixed },
    changes: { type: Schema.Types.Mixed },
    ipAddress: { type: String },
    userAgent: { type: String },
    requestId: { type: String, index: true },
    performedAt: { type: Date, default: Date.now, index: true },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

AuditLogSchema.pre(/^find/, function (next) {
  this.find({ isDeleted: { $ne: true } });
  next();
});

AuditLogSchema.index({ actor: 1, performedAt: -1 });
AuditLogSchema.index({ action: 1, performedAt: -1 });
AuditLogSchema.index({ resource: 1, resourceId: 1, performedAt: -1 });

export const AuditLog =
  mongoose.models.AuditLog || mongoose.model<ModelAuditLog>('AuditLog', AuditLogSchema);
