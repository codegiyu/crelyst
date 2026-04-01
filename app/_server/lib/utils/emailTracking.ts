/* eslint-disable @typescript-eslint/no-explicit-any */
import { Timestamp } from 'firebase-admin/firestore';
import type { JOB_TYPE } from '../types/queues';
import type { ModelEmailLog, EmailStatus, CompanyKey } from '../types/constants';
import {
  createEmailLogDoc,
  findEmailLogByJobId,
  findEmailLogByMessageId,
  getEmailLogDocById,
  updateEmailLogDoc,
  findEmailLogsByRecipientSince,
  getCollection,
} from '../firestore/collections';

function toDate(v: unknown): Date {
  if (v instanceof Date) return v;
  if (v && typeof (v as { toDate?: () => Date }).toDate === 'function') {
    return (v as { toDate: () => Date }).toDate();
  }
  return new Date();
}

function mapToModel(id: string, data: Record<string, any>): ModelEmailLog {
  return {
    _id: id,
    jobId: String(data.jobId ?? ''),
    company: data.company as CompanyKey,
    type: data.type as JOB_TYPE,
    to: String(data.to ?? ''),
    from: String(data.from ?? ''),
    subject: String(data.subject ?? ''),
    status: data.status as EmailStatus,
    messageId: data.messageId as string | undefined,
    provider: String(data.provider ?? 'smtp'),
    error: data.error as string | undefined,
    retryCount: data.retryCount as number | undefined,
    htmlContent: data.htmlContent as string | undefined,
    sentAt: data.sentAt ? toDate(data.sentAt) : undefined,
    deliveredAt: data.deliveredAt ? toDate(data.deliveredAt) : undefined,
    openedAt: data.openedAt ? toDate(data.openedAt) : undefined,
    clickedAt: data.clickedAt ? toDate(data.clickedAt) : undefined,
    metadata: (data.metadata as Record<string, any>) ?? {},
    bounceType: data.bounceType as 'hard' | 'soft' | undefined,
    isDeleted: data.isDeleted as boolean | undefined,
    deleteRequestedAt: data.deleteRequestedAt ? toDate(data.deleteRequestedAt) : undefined,
    deletionApprovedAt: data.deletionApprovedAt ? toDate(data.deletionApprovedAt) : undefined,
    deletionApprovedBy: data.deletionApprovedBy as string | undefined,
    createdAt: toDate(data.createdAt),
    updatedAt: toDate(data.updatedAt),
  };
}

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
  const row = await createEmailLogDoc({
    ...data,
    status: 'pending',
    provider: data.provider || 'smtp',
  });
  return mapToModel(row.id, row as Record<string, any>);
}

export async function updateEmailStatus(
  identifier: { jobId: string } | { messageId: string } | { _id: string } | { id: string },
  updates: {
    status: EmailStatus;
    error?: string | null;
    retryCount?: number;
    jobId?: string;
    sentAt?: Date;
    deliveredAt?: Date;
    openedAt?: Date;
    clickedAt?: Date;
    messageId?: string;
    htmlContent?: string;
    metadata?: Record<string, any>;
    bounceType?: 'hard' | 'soft';
  }
): Promise<ModelEmailLog | null> {
  let id: string | null = null;
  if ('jobId' in identifier) {
    const found = await findEmailLogByJobId(identifier.jobId);
    id = found?.id ?? null;
  } else if ('messageId' in identifier) {
    const found = await findEmailLogByMessageId(identifier.messageId);
    id = found?.id ?? null;
  } else if ('_id' in identifier) {
    id = identifier._id;
  } else {
    id = identifier.id;
  }

  if (!id) return null;

  const patch: Record<string, unknown> = { status: updates.status };
  if (updates.error !== undefined) patch.error = updates.error;
  if (updates.retryCount !== undefined) patch.retryCount = updates.retryCount;
  if (updates.jobId) patch.jobId = updates.jobId;
  if (updates.sentAt) patch.sentAt = Timestamp.fromDate(updates.sentAt);
  if (updates.deliveredAt) patch.deliveredAt = Timestamp.fromDate(updates.deliveredAt);
  if (updates.openedAt) patch.openedAt = Timestamp.fromDate(updates.openedAt);
  if (updates.clickedAt) patch.clickedAt = Timestamp.fromDate(updates.clickedAt);
  if (updates.messageId) patch.messageId = updates.messageId;
  if (updates.htmlContent !== undefined) patch.htmlContent = updates.htmlContent;
  if (updates.metadata) patch.metadata = updates.metadata;
  if (updates.bounceType) patch.bounceType = updates.bounceType;

  const row = await updateEmailLogDoc(id, patch);
  if (!row) return null;
  return mapToModel(row.id, row as Record<string, any>);
}

export async function getEmailLog(
  identifier: { jobId: string } | { messageId: string } | { _id: string } | { id: string }
): Promise<ModelEmailLog | null> {
  if ('jobId' in identifier) {
    const found = await findEmailLogByJobId(identifier.jobId);
    return found ? mapToModel(found.id, found as Record<string, any>) : null;
  }
  if ('messageId' in identifier) {
    const found = await findEmailLogByMessageId(identifier.messageId);
    return found ? mapToModel(found.id, found as Record<string, any>) : null;
  }
  const id = '_id' in identifier ? identifier._id : identifier.id;
  const found = await getEmailLogDocById(id);
  return found ? mapToModel(found.id, found as Record<string, any>) : null;
}

const STATS_SCAN_LIMIT = 2500;

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
  const coll = getCollection('emailLogs');
  const snap = await coll.orderBy('createdAt', 'desc').limit(STATS_SCAN_LIMIT).get();
  let rows = snap.docs.map(d => ({ id: d.id, ...d.data() }) as Record<string, any>);

  if (filters?.company) rows = rows.filter(r => r.company === filters.company);
  if (filters?.type) rows = rows.filter(r => r.type === filters.type);
  if (filters?.startDate || filters?.endDate) {
    rows = rows.filter(r => {
      const c = toDate(r.createdAt).getTime();
      if (filters.startDate && c < filters.startDate.getTime()) return false;
      if (filters.endDate && c > filters.endDate.getTime()) return false;
      return true;
    });
  }

  const count = (s: EmailStatus) => rows.filter(r => r.status === s).length;
  const total = rows.length;
  const sent = count('sent');
  const delivered = count('delivered');
  const bounced = count('bounced');
  const failed = count('failed');
  const opened = count('opened');
  const clicked = count('clicked');
  const pending = count('pending');

  return {
    total,
    sent,
    delivered,
    bounced,
    failed,
    opened,
    clicked,
    pending,
    deliveryRate: total > 0 ? (delivered / total) * 100 : 0,
    bounceRate: total > 0 ? (bounced / total) * 100 : 0,
    failureRate: total > 0 ? (failed / total) * 100 : 0,
    openRate: delivered > 0 ? (opened / delivered) * 100 : 0,
    clickRate: delivered > 0 ? (clicked / delivered) * 100 : 0,
  };
}

export async function hasEmailBounced(
  emailAddress: string,
  lookbackDays: number = 30
): Promise<boolean> {
  const email = emailAddress.toLowerCase().trim();
  const lookbackDate = new Date(Date.now() - lookbackDays * 24 * 60 * 60 * 1000);
  const since = Timestamp.fromDate(lookbackDate);
  const rows = await findEmailLogsByRecipientSince(email, since);
  return rows.some(
    r =>
      r.status === 'bounced' &&
      (r as { bounceType?: string }).bounceType === 'hard' &&
      toDate((r as { createdAt?: unknown }).createdAt).getTime() >= lookbackDate.getTime()
  );
}

export async function getBouncedEmails(
  lookbackDays: number = 30,
  bounceType?: 'hard' | 'soft'
): Promise<string[]> {
  const lookbackDate = new Date(Date.now() - lookbackDays * 24 * 60 * 60 * 1000);
  const coll = getCollection('emailLogs');
  const snap = await coll
    .where('status', '==', 'bounced')
    .where('createdAt', '>=', Timestamp.fromDate(lookbackDate))
    .orderBy('createdAt', 'desc')
    .limit(500)
    .get();

  const emails = new Set<string>();
  for (const d of snap.docs) {
    const r = d.data() as { to?: string; bounceType?: string };
    if (bounceType && r.bounceType !== bounceType) continue;
    if (r.to) emails.add(String(r.to).toLowerCase());
  }
  return [...emails];
}
