'use client';

import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useMemo, useState, useTransition } from 'react';
import { format } from 'date-fns';
import { DashboardPageWrapper } from '@/components/general/DashboardPageWrapper';
import { RegularBtn } from '@/components/atoms/RegularBtn';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Modal } from '@/components/ui/Modal';
import { callApi } from '@/lib/services/callApi';
import type {
  ClientFormSubmission,
  FormSubmissionFormType,
  IFormSubmissionsListRes,
} from '@/lib/constants/endpoints';
import { AlertTriangle, Eye, Mail, RefreshCw } from 'lucide-react';

const PAGE_LIMIT = 25;

function formatDate(value: string | undefined) {
  if (!value) return '—';
  try {
    return format(new Date(value), 'PPp');
  } catch {
    return value;
  }
}

function infoRow(label: string, value: string | undefined | null) {
  return (
    <div className="space-y-1">
      <p className="text-xs font-medium text-muted-foreground">{label}</p>
      <p className="text-sm text-foreground break-words">{value?.trim() || '—'}</p>
    </div>
  );
}

interface FormSubmissionsReadOnlyPageClientProps {
  initial: IFormSubmissionsListRes;
  formType: FormSubmissionFormType;
  title: string;
  description: string;
  /** True when server-side initial fetch failed; client will retry on mount. */
  loadFailed?: boolean;
}

export function FormSubmissionsReadOnlyPageClient({
  initial,
  formType,
  title,
  description,
  loadFailed = false,
}: FormSubmissionsReadOnlyPageClientProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [submissions, setSubmissions] = useState<ClientFormSubmission[]>(initial.submissions);
  const [total, setTotal] = useState(initial.pagination.total);
  const [nextCursor, setNextCursor] = useState<string | null>(initial.nextCursor);
  const [hasMore, setHasMore] = useState(initial.hasMore);
  const [search, setSearch] = useState('');
  const [selectedSubmission, setSelectedSubmission] = useState<ClientFormSubmission | null>(null);
  const [loadingMore, setLoadingMore] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [fetchError, setFetchError] = useState(loadFailed);

  useEffect(() => {
    setSubmissions(initial.submissions);
    setTotal(initial.pagination.total);
    setNextCursor(initial.nextCursor);
    setHasMore(initial.hasMore);
    if (!loadFailed) setFetchError(false);
  }, [initial, loadFailed]);

  const fetchPage = useCallback(
    async (cursor?: string | null, replace = false) => {
      const cursorPart = cursor ? `&cursor=${encodeURIComponent(cursor)}` : '';
      const { data, error } = await callApi('ADMIN_LIST_FORM_SUBMISSIONS', {
        query: `?formType=${encodeURIComponent(formType)}&limit=${PAGE_LIMIT}${cursorPart}`,
      });

      if (error || !data) {
        setFetchError(true);
        return false;
      }

      setFetchError(false);
      setTotal(data.pagination.total);
      setNextCursor(data.nextCursor);
      setHasMore(data.hasMore);

      setSubmissions(prev => {
        if (replace) return data.submissions;
        const have = new Set(prev.map(s => s._id));
        const more = data.submissions.filter(s => !have.has(s._id));
        return [...prev, ...more];
      });

      return true;
    },
    [formType]
  );

  const filteredSubmissions = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return submissions;
    return submissions.filter(s => {
      const haystack = [s.name, s.email, s.message, s.company, s.projectType, s.portfolio]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();
      return haystack.includes(q);
    });
  }, [submissions, search]);

  const listEmpty = submissions.length === 0 && !fetchError;
  const filterEmpty = !listEmpty && filteredSubmissions.length === 0;

  const handleRefresh = () => {
    startTransition(() => {
      void (async () => {
        setRefreshing(true);
        try {
          const ok = await fetchPage(null, true);
          if (ok) router.refresh();
        } finally {
          setRefreshing(false);
        }
      })();
    });
  };

  const handleLoadMore = () => {
    if (!nextCursor || loadingMore) return;
    startTransition(() => {
      void (async () => {
        setLoadingMore(true);
        try {
          await fetchPage(nextCursor, false);
        } finally {
          setLoadingMore(false);
        }
      })();
    });
  };

  return (
    <DashboardPageWrapper
      header={{ title, description }}
      headerActions={
        <RegularBtn
          text="Refresh"
          variant="outline"
          LeftIcon={RefreshCw}
          leftIconProps={{ className: 'size-4' }}
          loading={refreshing || isPending}
          loadingIconBesideText
          onClick={handleRefresh}
        />
      }>
      {fetchError ? (
        <div className="flex items-start gap-3 rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
          <AlertTriangle className="mt-0.5 size-4 shrink-0" />
          <div className="space-y-2">
            <p>Could not load submissions. Check your connection and try again.</p>
            <RegularBtn text="Retry" size="sm" variant="outline" onClick={handleRefresh} />
          </div>
        </div>
      ) : null}

      {!listEmpty && (
        <div className="max-w-md">
          <Input
            placeholder="Search name, email, message..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            aria-label={`Filter ${title}`}
          />
        </div>
      )}

      <p className="text-sm text-muted-foreground">
        {total} total
        {hasMore ? ` · showing ${submissions.length} loaded` : ''}
        {total !== filteredSubmissions.length && submissions.length > 0
          ? ` · ${filteredSubmissions.length} matching`
          : ''}
      </p>

      {listEmpty ? (
        <div className="rounded-xl border border-dashed bg-muted/30 px-6 py-12 text-center text-muted-foreground">
          <Mail className="mx-auto mb-3 size-10 opacity-50" />
          <p>No submissions yet.</p>
        </div>
      ) : filterEmpty ? (
        <div className="rounded-xl border border-dashed bg-muted/30 px-6 py-10 text-center text-muted-foreground">
          <p>No submissions match your search.</p>
        </div>
      ) : (
        <>
          <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {filteredSubmissions.map(submission => (
              <li key={submission._id}>
                <Card className="h-full">
                  <CardHeader className="space-y-1 pb-2">
                    <p className="font-semibold text-foreground line-clamp-1">{submission.name}</p>
                    <p className="text-sm text-muted-foreground line-clamp-1">{submission.email}</p>
                    <p className="text-xs text-muted-foreground">
                      Submitted {formatDate(submission.createdAt)}
                    </p>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {formType === 'quote-request'
                      ? infoRow('Company', submission.company)
                      : infoRow('Portfolio', submission.portfolio)}
                    {formType === 'quote-request'
                      ? infoRow('Project type', submission.projectType)
                      : infoRow('Experience', submission.experience)}
                    <div className="space-y-1">
                      <p className="text-xs font-medium text-muted-foreground">Message</p>
                      <p className="text-sm text-foreground line-clamp-3">
                        {submission.message || '—'}
                      </p>
                    </div>
                    <RegularBtn
                      text="View"
                      size="sm"
                      variant="outline"
                      LeftIcon={Eye}
                      leftIconProps={{ className: 'size-4' }}
                      aria-label={`View submission from ${submission.name}`}
                      onClick={() => setSelectedSubmission(submission)}
                    />
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
                onClick={handleLoadMore}
              />
            </div>
          ) : null}
        </>
      )}

      <Modal
        open={!!selectedSubmission}
        onOpenChange={open => !open && setSelectedSubmission(null)}
        maxWidth="lg"
        header={{
          title: selectedSubmission?.name ?? 'Submission details',
          description: selectedSubmission?.email ?? '',
        }}
        cancelButton={{ text: 'Close' }}>
        {selectedSubmission ? (
          <div className="grid gap-4 sm:grid-cols-2">
            {infoRow('Submitted at', formatDate(selectedSubmission.createdAt))}
            {infoRow('Updated at', formatDate(selectedSubmission.updatedAt))}
            {infoRow('Email', selectedSubmission.email)}
            {infoRow('Source IP', selectedSubmission.sourceIp ?? '—')}
            {formType === 'quote-request' ? (
              <>
                {infoRow('Company', selectedSubmission.company)}
                {infoRow('Project type', selectedSubmission.projectType)}
                {infoRow('Budget', selectedSubmission.budget)}
              </>
            ) : (
              <>
                {infoRow('Portfolio', selectedSubmission.portfolio)}
                {infoRow('Experience', selectedSubmission.experience)}
              </>
            )}
            <div className="space-y-1 sm:col-span-2">
              <p className="text-xs font-medium text-muted-foreground">Message</p>
              <p className="whitespace-pre-wrap text-sm text-foreground">
                {selectedSubmission.message || '—'}
              </p>
            </div>
          </div>
        ) : null}
      </Modal>
    </DashboardPageWrapper>
  );
}
