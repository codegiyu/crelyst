'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';
import Link from 'next/link';
import { DashboardPageWrapper } from '@/components/general/DashboardPageWrapper';
import { RegularBtn } from '@/components/atoms/RegularBtn';
import { Input } from '@/components/ui/input';
import { callApi } from '@/lib/services/callApi';
import type { ClientAuditLogEntry, IAuditLogsListRes } from '@/lib/constants/endpoints';
import { cn } from '@/lib/utils';
import { RefreshCw } from 'lucide-react';

function formatAt(iso: string) {
  try {
    return format(new Date(iso), 'PPpp');
  } catch {
    return iso;
  }
}

export function AuditLogsPageClient({ initial }: { initial: IAuditLogsListRes }) {
  const router = useRouter();
  const pageLimit = initial.pagination.limit;
  const [entries, setEntries] = useState<ClientAuditLogEntry[]>(initial.entries);
  const [nextCursor, setNextCursor] = useState<string | null>(initial.nextCursor);
  const [hasMore, setHasMore] = useState(initial.hasMore);
  const [total, setTotal] = useState(initial.pagination.total);
  const [searchActive, setSearchActive] = useState(initial.searchActive);
  const [qInput, setQInput] = useState('');
  const [activeQ, setActiveQ] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);

  useEffect(() => {
    setEntries(initial.entries);
    setNextCursor(initial.nextCursor);
    setHasMore(initial.hasMore);
    setTotal(initial.pagination.total);
    setSearchActive(initial.searchActive);
  }, [initial]);

  const runSearch = async (q: string, replace: boolean, cursor?: string | null) => {
    const params = new URLSearchParams();
    params.set('limit', String(pageLimit));
    if (q) params.set('q', q);
    if (cursor) params.set('cursor', cursor);
    const { data, error } = await callApi('ADMIN_LIST_AUDIT_LOGS', {
      query: `?${params.toString()}` as `?${string}`,
    });
    if (error || !data) return;
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
          onClick={() => router.refresh()}
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
          />
        </div>
        <RegularBtn text="Search" loading={loading} onClick={() => void applySearch()} />
        {activeQ ? (
          <RegularBtn text="Clear" variant="outline" onClick={() => void clearSearch()} />
        ) : null}
        <Link
          href="/admin/dashboard/search"
          className="text-sm text-primary hover:underline pb-2 whitespace-nowrap">
          Search CMS content →
        </Link>
      </div>

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
    </DashboardPageWrapper>
  );
}
