/* eslint-disable @typescript-eslint/no-explicit-any */
import type { JOB_TYPE } from '../types/queues';
import { EmailLog } from '../../models/emailLog';
import { ModelEmailLog, EmailStatus, CompanyKey } from '../types/constants';

/**
 * Create an email log record
 */
export async function createEmailLog(data: {
  jobId: string;
  company: CompanyKey;
  type: JOB_TYPE;
  to: string;
  from: string;
  subject: string;
  provider?: string;
  htmlContent?: string;
  metadata?: Record<string, any>;
}): Promise<ModelEmailLog> {
  const emailLog = await EmailLog.create({
    ...data,
    status: 'pending',
    provider: data.provider || 'smtp',
  });

  return emailLog;
}

/**
 * Update email delivery status
 */
export async function updateEmailStatus(
  identifier: { jobId: string } | { messageId: string } | { _id: string },
  updates: {
    status: EmailStatus;
    error?: string | null;
    retryCount?: number;
    jobId?: string; // Update jobId for retries
    sentAt?: Date;
    deliveredAt?: Date;
    openedAt?: Date;
    clickedAt?: Date;
    messageId?: string;
    htmlContent?: string;
    metadata?: Record<string, any>;
  }
): Promise<ModelEmailLog | null> {
  const query: any = {};
  if ('jobId' in identifier) query.jobId = identifier.jobId;
  if ('messageId' in identifier) query.messageId = identifier.messageId;
  if ('_id' in identifier) query._id = identifier._id;

  const updateData: any = {
    status: updates.status,
  };

  if (updates.error !== undefined) {
    updateData.error = updates.error === null ? null : updates.error;
  }
  if (updates.retryCount !== undefined) updateData.retryCount = updates.retryCount;
  if (updates.jobId) updateData.jobId = updates.jobId;
  if (updates.sentAt) updateData.sentAt = updates.sentAt;
  if (updates.deliveredAt) updateData.deliveredAt = updates.deliveredAt;
  if (updates.openedAt) updateData.openedAt = updates.openedAt;
  if (updates.clickedAt) updateData.clickedAt = updates.clickedAt;
  if (updates.messageId) updateData.messageId = updates.messageId;
  if (updates.htmlContent !== undefined) updateData.htmlContent = updates.htmlContent;
  if (updates.metadata) updateData.metadata = updates.metadata;

  const emailLog = await EmailLog.findOneAndUpdate(query, updateData, { new: true });

  return emailLog;
}

/**
 * Get email log by identifier
 */
export async function getEmailLog(
  identifier: { jobId: string } | { messageId: string } | { _id: string }
): Promise<ModelEmailLog | null> {
  const query: any = {};
  if ('jobId' in identifier) query.jobId = identifier.jobId;
  if ('messageId' in identifier) query.messageId = identifier.messageId;
  if ('_id' in identifier) query._id = identifier._id;

  const emailLog = await EmailLog.findOne(query);

  return emailLog;
}

/**
 * Get email delivery statistics
 */
export async function getEmailStats(filters?: {
  company?: CompanyKey;
  type?: JOB_TYPE;
  startDate?: Date;
  endDate?: Date;
}): Promise<{
  total: number;
  sent: number;
  delivered: number;
  bounced: number;
  failed: number;
  opened: number;
  clicked: number;
  pending: number;
  deliveryRate: number;
  bounceRate: number;
  failureRate: number;
  openRate: number;
  clickRate: number;
}> {
  const query: any = {};

  if (filters?.company) query.company = filters.company;
  if (filters?.type) query.type = filters.type;
  if (filters?.startDate || filters?.endDate) {
    query.createdAt = {};
    if (filters.startDate) query.createdAt.$gte = filters.startDate;
    if (filters.endDate) query.createdAt.$lte = filters.endDate;
  }

  const stats = await EmailLog.aggregate([
    { $match: query },
    {
      $group: {
        _id: null,
        total: { $sum: 1 },
        sent: {
          $sum: { $cond: [{ $eq: ['$status', 'sent'] }, 1, 0] },
        },
        delivered: {
          $sum: { $cond: [{ $eq: ['$status', 'delivered'] }, 1, 0] },
        },
        bounced: {
          $sum: { $cond: [{ $eq: ['$status', 'bounced'] }, 1, 0] },
        },
        failed: {
          $sum: { $cond: [{ $eq: ['$status', 'failed'] }, 1, 0] },
        },
        opened: {
          $sum: { $cond: [{ $eq: ['$status', 'opened'] }, 1, 0] },
        },
        clicked: {
          $sum: { $cond: [{ $eq: ['$status', 'clicked'] }, 1, 0] },
        },
        pending: {
          $sum: { $cond: [{ $eq: ['$status', 'pending'] }, 1, 0] },
        },
      },
    },
  ]);

  const result = stats[0] || {
    total: 0,
    sent: 0,
    delivered: 0,
    bounced: 0,
    failed: 0,
    opened: 0,
    clicked: 0,
    pending: 0,
  };

  const total = result.total || 0;
  const sent = result.sent || 0;
  const delivered = result.delivered || 0;

  return {
    total,
    sent,
    delivered,
    bounced: result.bounced || 0,
    failed: result.failed || 0,
    opened: result.opened || 0,
    clicked: result.clicked || 0,
    pending: result.pending || 0,
    deliveryRate: total > 0 ? (delivered / total) * 100 : 0,
    bounceRate: total > 0 ? ((result.bounced || 0) / total) * 100 : 0,
    failureRate: total > 0 ? ((result.failed || 0) / total) * 100 : 0,
    openRate: delivered > 0 ? ((result.opened || 0) / delivered) * 100 : 0,
    clickRate: delivered > 0 ? ((result.clicked || 0) / delivered) * 100 : 0,
  };
}

/**
 * Check if an email address has bounced (hard bounce)
 * @param emailAddress - The email address to check
 * @param lookbackDays - Number of days to look back (default: 30)
 * @returns true if email has a hard bounce, false otherwise
 */
export async function hasEmailBounced(
  emailAddress: string,
  lookbackDays: number = 30
): Promise<boolean> {
  const email = emailAddress.toLowerCase().trim();
  const lookbackDate = new Date(Date.now() - lookbackDays * 24 * 60 * 60 * 1000);

  const bouncedEmail = await EmailLog.findOne({
    to: email,
    status: 'bounced',
    createdAt: { $gte: lookbackDate },
    'metadata.bounceType': 'hard',
  });

  return !!bouncedEmail;
}

/**
 * Get bounced email addresses within a time period
 * @param lookbackDays - Number of days to look back (default: 30)
 * @param bounceType - Filter by bounce type ('hard' | 'soft') or undefined for all
 * @returns Array of unique bounced email addresses
 */
export async function getBouncedEmails(
  lookbackDays: number = 30,
  bounceType?: 'hard' | 'soft'
): Promise<string[]> {
  const lookbackDate = new Date(Date.now() - lookbackDays * 24 * 60 * 60 * 1000);

  const query: any = {
    status: 'bounced',
    createdAt: { $gte: lookbackDate },
  };

  if (bounceType) {
    query['metadata.bounceType'] = bounceType;
  }

  const bouncedEmails = await EmailLog.distinct('to', query);

  return bouncedEmails;
}
