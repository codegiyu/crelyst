'use client';

import { useState } from 'react';
import { format } from 'date-fns';
import Link from 'next/link';
import { DashboardPageWrapper } from '@/components/general/DashboardPageWrapper';
import { AdminAsyncSection } from '@/components/general/admin/AdminAsyncSection';
import { AdminSectionError } from '@/components/general/admin/AdminSectionError';
import { RegularBtn } from '@/components/atoms/RegularBtn';
import { Input } from '@/components/ui/input';
import { callApi } from '@/lib/services/callApi';
import type { ClientAuditLogEntry } from '@/lib/constants/endpoints';
import { cn } from '@/lib/utils';
import { RefreshCw } from 'lucide-react';
import { useAdminResource } from '@/lib/hooks/use-admin-resource';
import { useRemoteListItems } from '@/lib/hooks/use-remote-list-items';
import { resolveAdminResourceErrorMessage } from '@/lib/admin/adminResourceState';

const LIST_QUERY = '?limit=40' as const;
const PAGE_LIMIT = 40;

function formatAt(iso: string) {
  try {
    return format(new Date(iso), 'PPpp');
  } catch {
    return iso;
  }
}

export function AuditLogsPageClient() {
  const list = useAdminResource({
    resourceKey: ['admin', 'audit-logs', { limit: 40 }],
    endpoint: 'ADMIN_LIST_AUDIT_LOGS',
    options: { query: LIST_QUERY },
    sectionLabel: 'audit logs',
  });

  const [entries, setEntries] = useRemoteListItems(list.data?.entries);
  const [nextCursor, setNextCursor] = useState<string | null>(list.data?.nextCursor ?? null);
  const [hasMore, setHasMore] = useState(list.data?.hasMore ?? false);
  const [total, setTotal] = useState(list.data?.pagination.total ?? 0);
  const [searchActive, setSearchActive] = useState(list.data?.searchActive ?? false);
  const [qInput, setQInput] = useState('');
  const [activeQ, setActiveQ] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [prevListData, setPrevListData] = useState(list.data);

  // Keep pagination/search meta aligned when the remote list payload identity changes.
  if (list.data !== prevListData) {
    setPrevListData(list.data);

    if (list.data) {
      setNextCursor(list.data.nextCursor);
      setHasMore(list.data.hasMore);
      setTotal(list.data.pagination.total);
      setSearchActive(list.data.searchActive);
      setSearchError(null);
    }
  }

  const applyListPayload = (
    data: {
      entries: ClientAuditLogEntry[];
      nextCursor: string | null;
      hasMore: boolean;
      searchActive: boolean;
      pagination: { total: number; limit: number };
    },
    replace: boolean
  ) => {
    if (replace) {
      setEntries(data.entries);
    } else {
      setEntries(prev => {
        const have = new Set(prev.map(e => e._id));
        const more = data.entries.filter(e => !have.has(e._id));

        return [...prev, ...more];
      });
    }

    setNextCursor(data.nextCursor);
    setHasMore(data.hasMore);
    setTotal(data.pagination.total);
    setSearchActive(data.searchActive);
    setSearchError(null);
  };

  const runSearch = async (q: string, replace: boolean, cursor?: string | null) => {
    const params = new URLSearchParams();
    params.set('limit', String(PAGE_LIMIT));
    if (q) params.set('q', q);
    if (cursor) params.set('cursor', cursor);

    const { data, error } = await callApi('ADMIN_LIST_AUDIT_LOGS', {
      query: `?${params.toString()}` as `?${string}`,
    });

    if (error || !data) {
      setSearchError(resolveAdminResourceErrorMessage(error?.message, 'audit logs'));

      return;
    }

    applyListPayload(data, replace);
  };

  const applySearch = async () => {
    setLoading(true);
    setActiveQ(qInput.trim());

    try {
      await runSearch(qInput.trim(), true);
    } finally {
      setLoading(false);
    }
  };

  const clearSearch = async () => {
    setQInput('');
    setActiveQ('');
    setLoading(true);

    try {
      await runSearch('', true);
    } finally {
      setLoading(false);
    }
  };

  const loadMore = async () => {
    if (!nextCursor || loadingMore) return;

    setLoadingMore(true);

    try {
      await runSearch(activeQ, false, nextCursor);
    } finally {
      setLoadingMore(false);
    }
  };

  const handleRefresh = () => {
    setQInput('');
    setActiveQ('');
    setSearchError(null);
    void list.reload();
  };

  return (
    <DashboardPageWrapper
      header={{
        title: 'Audit log',
        description:
          'Admin API activity. Search matches method, path, query string, status, actor email, or client IP.',
      }}
      headerActions={
        <RegularBtn
          text="Refresh"
          variant="outline"
          LeftIcon={RefreshCw}
          leftIconProps={{ className: 'size-4' }}
          disabled={list.isError || list.isLoading}
          onClick={handleRefresh}
        />
      }>
      <div className="flex flex-wrap gap-2 items-end max-w-2xl">
        <div className="flex-1 min-w-[200px]">
          <Input
            placeholder="Search logs…"
            value={qInput}
            onChange={e => setQInput(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter') void applySearch();
            }}
            aria-label="Search audit logs"
            disabled={list.isError || list.isLoading}
          />
        </div>
        <RegularBtn
          text="Search"
          loading={loading}
          disabled={list.isError || list.isLoading}
          onClick={() => void applySearch()}
        />
        {activeQ ? (
          <RegularBtn text="Clear" variant="outline" onClick={() => void clearSearch()} />
        ) : null}
        <Link
          href="/admin/dashboard/search"
          className="text-sm text-primary hover:underline pb-2 whitespace-nowrap">
          Search CMS content →
        </Link>
      </div>

      {searchError ? (
        <AdminSectionError message={searchError} onRetry={() => void applySearch()} />
      ) : null}

      <AdminAsyncSection
        status={list.status}
        errorMessage={list.errorMessage}
        onRetry={() => void list.reload()}
        hasData={list.data != null}>
        <div className="grid gap-6">
          <p className="text-sm text-muted-foreground">
            {searchActive
              ? `Search results for “${activeQ}”`
              : total >= 0
                ? `${total} total events`
                : ''}
            {hasMore ? ` · showing ${entries.length} loaded` : ''}
          </p>

          <div className="rounded-xl border overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/50 text-left">
                  <th className="p-3 font-medium whitespace-nowrap">Time</th>
                  <th className="p-3 font-medium whitespace-nowrap">Status</th>
                  <th className="p-3 font-medium whitespace-nowrap">Method</th>
                  <th className="p-3 font-medium min-w-[200px]">Path</th>
                  <th className="p-3 font-medium min-w-[140px]">Actor</th>
                  <th className="p-3 font-medium whitespace-nowrap">IP</th>
                </tr>
              </thead>
              <tbody>
                {entries.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-muted-foreground">
                      No audit entries yet.
                    </td>
                  </tr>
                ) : (
                  entries.map(row => (
                    <tr key={row._id} className="border-b border-border/60 hover:bg-muted/30">
                      <td className="p-3 whitespace-nowrap text-muted-foreground align-top">
                        {formatAt(row.createdAt)}
                      </td>
                      <td className="p-3 align-top">
                        <span
                          className={cn(
                            'inline-flex rounded px-2 py-0.5 text-xs font-medium',
                            row.statusCode >= 500
                              ? 'bg-destructive/15 text-destructive'
                              : row.statusCode >= 400
                                ? 'bg-orange-500/15 text-orange-700 dark:text-orange-400'
                                : 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400'
                          )}>
                          {row.statusCode}
                        </span>
                      </td>
                      <td className="p-3 font-mono text-xs align-top">{row.method}</td>
                      <td className="p-3 align-top">
                        <div className="font-mono text-xs break-all">{row.path}</div>
                        {row.query ? (
                          <div className="text-xs text-muted-foreground mt-1 break-all">
                            {row.query}
                          </div>
                        ) : null}
                      </td>
                      <td className="p-3 align-top text-xs break-all">
                        {row.actorEmail || row.actorId || '—'}
                      </td>
                      <td className="p-3 font-mono text-xs align-top whitespace-nowrap">
                        {row.clientIp || '—'}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {hasMore && nextCursor ? (
            <div className="flex justify-center">
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
        </div>
      </AdminAsyncSection>
    </DashboardPageWrapper>
  );
}
