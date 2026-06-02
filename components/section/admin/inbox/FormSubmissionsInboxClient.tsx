'use client';

import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { format } from 'date-fns';
import { DashboardPageWrapper } from '@/components/general/DashboardPageWrapper';
import { RegularBtn } from '@/components/atoms/RegularBtn';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Modal } from '@/components/ui/Modal';
import { callApi } from '@/lib/services/callApi';
import { adminCallApiToast } from '@/lib/utils/adminMutationToast';
import type {
  ClientFormSubmission,
  FormSubmissionFormType,
  IFormSubmissionsListRes,
} from '@/lib/constants/endpoints';
import { Mail, CheckCheck, Download, RefreshCw, Trash2, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';

const POLL_MS = 600_000; // 600 seconds = 10 minutes

function submissionApiPath(id: string, formType: FormSubmissionFormType): `/${string}` {
  return `/${id}?formType=${encodeURIComponent(formType)}` as `/${string}`;
}

function formatSubmittedAt(createdAt: string) {
  try {
    return format(new Date(createdAt), 'PPp');
  } catch {
    return createdAt;
  }
}

function formatMaybeAt(value: string | undefined) {
  if (!value) return '—';
  return formatSubmittedAt(value);
}

function dispatchInboxChanged() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('form-submissions-unread-changed'));
  }
}

function csvEscape(value: string) {
  if (/[",\n\r]/.test(value)) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

function downloadSubmissionsCsv(rows: ClientFormSubmission[], formType: FormSubmissionFormType) {
  const baseHeaders =
    formType === 'quote-request'
      ? ([
          '_id',
          'createdAt',
          'updatedAt',
          'name',
          'email',
          'company',
          'projectType',
          'budget',
          'message',
          'sourceIp',
          'isRead',
        ] as const)
      : ([
          '_id',
          'createdAt',
          'updatedAt',
          'name',
          'email',
          'portfolio',
          'experience',
          'message',
          'sourceIp',
          'isRead',
        ] as const);

  const lines = [baseHeaders.join(',')];
  for (const r of rows) {
    const rec = r as unknown as Record<string, unknown>;
    lines.push(
      baseHeaders
        .map(h => {
          const v = rec[h];
          if (v === null || v === undefined) return '';
          if (typeof v === 'boolean') return v ? 'true' : 'false';
          return csvEscape(String(v));
        })
        .join(',')
    );
  }
  const blob = new Blob([`\ufeff${lines.join('\n')}`], {
    type: 'text/csv;charset=utf-8;',
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `submissions-${formType}-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

export interface FormSubmissionsInboxClientProps {
  initial: IFormSubmissionsListRes;
  formType: FormSubmissionFormType;
  title: string;
  description: string;
}

export function FormSubmissionsInboxClient({
  initial,
  formType,
  title,
  description,
}: FormSubmissionsInboxClientProps) {
  const router = useRouter();
  const pageLimit = initial.pagination.limit;
  const [submissions, setSubmissions] = useState<ClientFormSubmission[]>(initial.submissions);
  const [unreadCount, setUnreadCount] = useState(initial.unreadCount);
  const [nextCursor, setNextCursor] = useState<string | null>(initial.nextCursor);
  const [hasMore, setHasMore] = useState(initial.hasMore);
  const [total, setTotal] = useState(initial.pagination.total);
  const [markingAll, setMarkingAll] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [search, setSearch] = useState('');
  const [deleteTarget, setDeleteTarget] = useState<ClientFormSubmission | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const submissionsRef = useRef(submissions);
  submissionsRef.current = submissions;

  useEffect(() => {
    setSubmissions(initial.submissions);
    setUnreadCount(initial.unreadCount);
    setNextCursor(initial.nextCursor);
    setHasMore(initial.hasMore);
    setTotal(initial.pagination.total);
  }, [initial]);

  const pollNewSubmissions = useCallback(async () => {
    const { data, error } = await callApi('ADMIN_LIST_FORM_SUBMISSIONS', {
      query: `?formType=${encodeURIComponent(formType)}&limit=${pageLimit}`,
    });
    if (error || !data?.submissions) return;

    const have = new Set(submissionsRef.current.map(s => s._id));
    const fresh = data.submissions.filter(s => !have.has(s._id));
    if (fresh.length > 0) {
      setSubmissions(prev => [...fresh, ...prev]);
    }
    setUnreadCount(data.unreadCount);
    if (fresh.length > 0) {
      dispatchInboxChanged();
    }
  }, [formType, pageLimit]);

  useEffect(() => {
    const tick = () => {
      if (typeof document !== 'undefined' && document.visibilityState !== 'visible') return;
      void pollNewSubmissions();
    };
    const id = window.setInterval(tick, POLL_MS);
    return () => window.clearInterval(id);
  }, [pollNewSubmissions]);

  const filteredSubmissions = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return submissions;
    return submissions.filter(s => {
      const hay = [s.name, s.email, s.message, s.company, s.projectType, s.portfolio]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();
      return hay.includes(q);
    });
  }, [submissions, search]);

  const markOneRead = async (submission: ClientFormSubmission) => {
    if (submission.isRead) return;
    const data = await adminCallApiToast(
      'Marking as read…',
      () =>
        callApi('ADMIN_PATCH_FORM_SUBMISSION', {
          query: submissionApiPath(submission._id, formType),
          payload: { isRead: true },
        }),
      'Marked as read'
    );
    if (data) {
      setSubmissions(prev =>
        prev.map(s =>
          s._id === submission._id
            ? { ...s, isRead: true, updatedAt: data.submission.updatedAt }
            : s
        )
      );
      setUnreadCount(c => Math.max(0, c - 1));
      dispatchInboxChanged();
    }
  };

  const markOneUnread = async (submission: ClientFormSubmission) => {
    if (!submission.isRead) return;
    const data = await adminCallApiToast(
      'Marking as unread…',
      () =>
        callApi('ADMIN_PATCH_FORM_SUBMISSION', {
          query: submissionApiPath(submission._id, formType),
          payload: { isRead: false },
        }),
      'Marked as unread'
    );
    if (data) {
      setSubmissions(prev =>
        prev.map(s =>
          s._id === submission._id
            ? { ...s, isRead: false, updatedAt: data.submission.updatedAt }
            : s
        )
      );
      setUnreadCount(c => c + 1);
      dispatchInboxChanged();
    }
  };

  const markAllRead = async () => {
    if (unreadCount <= 0) return;
    setMarkingAll(true);
    try {
      const data = await adminCallApiToast(
        'Marking all as read…',
        () =>
          callApi('ADMIN_MARK_ALL_FORM_SUBMISSIONS_READ', {
            payload: { formType },
          }),
        d => `Marked ${d.modifiedCount} as read`
      );
      if (data) {
        setSubmissions(prev => prev.map(s => ({ ...s, isRead: true })));
        setUnreadCount(0);
        dispatchInboxChanged();
        router.refresh();
      }
    } finally {
      setMarkingAll(false);
    }
  };

  const loadMore = async () => {
    if (!nextCursor || loadingMore) return;
    setLoadingMore(true);
    try {
      const { data, error } = await callApi('ADMIN_LIST_FORM_SUBMISSIONS', {
        query: `?formType=${encodeURIComponent(formType)}&limit=${pageLimit}&cursor=${encodeURIComponent(nextCursor)}`,
      });
      if (error || !data) return;
      setSubmissions(prev => {
        const have = new Set(prev.map(s => s._id));
        const more = data.submissions.filter(s => !have.has(s._id));
        return [...prev, ...more];
      });
      setNextCursor(data.nextCursor);
      setHasMore(data.hasMore);
      setTotal(data.pagination.total);
    } finally {
      setLoadingMore(false);
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleteLoading(true);
    try {
      const data = await adminCallApiToast(
        'Deleting submission…',
        () =>
          callApi('ADMIN_DELETE_FORM_SUBMISSION', {
            query: submissionApiPath(deleteTarget._id, formType),
          }),
        'Submission deleted'
      );
      if (data) {
        const wasUnread = !deleteTarget.isRead;
        setSubmissions(prev => prev.filter(s => s._id !== deleteTarget._id));
        if (wasUnread) setUnreadCount(c => Math.max(0, c - 1));
        setTotal(t => Math.max(0, t - 1));
        setDeleteTarget(null);
        dispatchInboxChanged();
        router.refresh();
      }
    } finally {
      setDeleteLoading(false);
    }
  };

  const hasUnread = unreadCount > 0;
  const listEmpty = submissions.length === 0;
  const filterEmpty = filteredSubmissions.length === 0 && !listEmpty;

  return (
    <DashboardPageWrapper
      header={{ title, description }}
      headerActions={
        <div className="flex flex-wrap items-center gap-2">
          <RegularBtn
            text="Refresh"
            variant="outline"
            LeftIcon={RefreshCw}
            leftIconProps={{ className: 'size-4' }}
            onClick={() => router.refresh()}
          />
          {!listEmpty && (
            <RegularBtn
              text={search.trim() ? 'Export filtered CSV' : 'Export CSV'}
              variant="outline"
              LeftIcon={Download}
              leftIconProps={{ className: 'size-4' }}
              onClick={() => downloadSubmissionsCsv(filteredSubmissions, formType)}
            />
          )}
          {hasUnread ? (
            <RegularBtn
              text="Mark all read"
              variant="outline"
              LeftIcon={CheckCheck}
              leftIconProps={{ className: 'size-4' }}
              disabled={markingAll}
              onClick={() => void markAllRead()}
            />
          ) : null}
        </div>
      }>
      {!listEmpty && (
        <div className="max-w-md">
          <Input
            placeholder="Search name, email, message…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            aria-label="Filter submissions"
          />
        </div>
      )}

      <p className="text-sm text-muted-foreground">
        {total} total
        {hasMore ? ` · showing ${submissions.length} loaded` : ''}
      </p>

      {listEmpty ? (
        <div className="rounded-xl border border-dashed bg-muted/30 px-6 py-12 text-center text-muted-foreground">
          <Mail className="mx-auto size-10 opacity-50 mb-3" />
          <p>No submissions yet.</p>
        </div>
      ) : filterEmpty ? (
        <div className="rounded-xl border border-dashed bg-muted/30 px-6 py-10 text-center text-muted-foreground">
          <p>No submissions match your search.</p>
        </div>
      ) : (
        <>
          <ul className="flex flex-col gap-4">
            {filteredSubmissions.map(sub => (
              <li key={sub._id}>
                <Card
                  className={cn(
                    'overflow-hidden transition-colors',
                    !sub.isRead && 'border-primary/40 bg-primary/[0.03]'
                  )}>
                  <CardHeader className="flex flex-row flex-wrap items-start justify-between gap-3 space-y-0 pb-2">
                    <div className="min-w-0 space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span
                          className={cn(
                            'font-semibold text-foreground',
                            !sub.isRead && 'text-primary'
                          )}>
                          {sub.name}
                        </span>
                        {!sub.isRead && (
                          <span className="rounded-full bg-primary/15 px-2 py-0.5 text-xs font-medium text-primary">
                            Unread
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Submitted {formatSubmittedAt(sub.createdAt)}
                        {sub.updatedAt ? ` · Updated ${formatMaybeAt(sub.updatedAt)}` : ''}
                      </p>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      {!sub.isRead ? (
                        <RegularBtn
                          text="Mark read"
                          variant="outline"
                          size="sm"
                          onClick={() => void markOneRead(sub)}
                        />
                      ) : (
                        <RegularBtn
                          text="Mark unread"
                          variant="outline"
                          size="sm"
                          onClick={() => void markOneUnread(sub)}
                        />
                      )}
                      <RegularBtn
                        text="Delete"
                        variant="destructive"
                        size="sm"
                        LeftIcon={Trash2}
                        leftIconProps={{ className: 'size-3.5' }}
                        onClick={() => setDeleteTarget(sub)}
                      />
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3 text-sm">
                    <div className="grid gap-2 sm:grid-cols-2">
                      <div>
                        <span className="text-muted-foreground">Email</span>
                        <p>
                          <a
                            href={`mailto:${sub.email}`}
                            className="text-primary hover:underline break-all">
                            {sub.email}
                          </a>
                        </p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Source IP</span>
                        <p className="font-mono text-xs">{sub.sourceIp ?? '—'}</p>
                      </div>
                      {formType === 'quote-request' && (
                        <>
                          <div>
                            <span className="text-muted-foreground">Company</span>
                            <p>{sub.company ?? '—'}</p>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Project type</span>
                            <p>{sub.projectType ?? '—'}</p>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Budget</span>
                            <p>{sub.budget ?? '—'}</p>
                          </div>
                        </>
                      )}
                      {formType === 'work-with-us' && (
                        <>
                          <div>
                            <span className="text-muted-foreground">Portfolio</span>
                            <p>
                              {sub.portfolio ? (
                                <a
                                  href={sub.portfolio}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-primary hover:underline break-all">
                                  {sub.portfolio}
                                </a>
                              ) : (
                                '—'
                              )}
                            </p>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Experience</span>
                            <p>{sub.experience ?? '—'}</p>
                          </div>
                        </>
                      )}
                    </div>
                    <div>
                      <span className="text-muted-foreground">Message</span>
                      <p className="mt-1 whitespace-pre-wrap text-foreground">{sub.message}</p>
                    </div>
                  </CardContent>
                </Card>
              </li>
            ))}
          </ul>

          {hasMore ? (
            <div className="flex justify-center pt-4">
              <RegularBtn
                text="Load more"
                variant="outline"
                loading={loadingMore}
                loadingIconBesideText
                loadingIconClassName="text-muted-foreground shrink-0 animate-spin"
                onClick={() => void loadMore()}
              />
            </div>
          ) : null}
        </>
      )}

      <Modal
        open={!!deleteTarget}
        onOpenChange={open => !open && setDeleteTarget(null)}
        maxWidth="sm"
        header={{
          title: 'Delete submission',
          description: deleteTarget
            ? `Permanently remove the submission from ${deleteTarget.name}? This cannot be undone.`
            : '',
        }}
        cancelButton={{
          text: 'Cancel',
          disabled: deleteLoading,
        }}
        submitButton={{
          text: 'Delete',
          variant: 'destructive',
          loading: deleteLoading,
          onClick: () => void confirmDelete(),
        }}>
        <div className="flex justify-center py-4">
          <div className="flex size-16 items-center justify-center rounded-full bg-destructive/10">
            <AlertTriangle className="size-8 text-destructive" />
          </div>
        </div>
      </Modal>
    </DashboardPageWrapper>
  );
}
