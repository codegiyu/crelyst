'use client';

import { useState } from 'react';
import Link from 'next/link';
import { DashboardPageWrapper } from '@/components/general/DashboardPageWrapper';
import { RegularBtn } from '@/components/atoms/RegularBtn';
import { Input } from '@/components/ui/input';
import { callApi } from '@/lib/services/callApi';
import type { IAdminSearchHit, IAdminSearchRes } from '@/lib/constants/endpoints';

const section = (title: string, base: string, items: IAdminSearchHit[]) =>
  items.length === 0 ? null : (
    <section className="grid gap-3">
      <h2 className="text-lg font-semibold">{title}</h2>
      <ul className="grid gap-2 border rounded-xl divide-y">
        {items.map(hit => (
          <li
            key={`${hit.type}-${hit.id}`}
            className="px-4 py-3 flex flex-wrap items-center justify-between gap-2">
            <span className="font-medium">{hit.title}</span>
            <Link href={base} className="text-sm text-primary hover:underline shrink-0">
              Open in admin →
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );

export function AdminSearchPageClient() {
  const [q, setQ] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<IAdminSearchRes | null>(null);

  const search = async () => {
    const term = q.trim();
    if (term.length < 2) return;
    setLoading(true);
    try {
      const { data, error } = await callApi('ADMIN_SEARCH', {
        query: `?q=${encodeURIComponent(term)}` as `?${string}`,
      });
      if (!error && data) setResult(data);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardPageWrapper
      header={{
        title: 'Search',
        description:
          'Full-text search across services, projects, brands, testimonials, and team (recent records, in-memory match).',
      }}>
      <div className="flex flex-wrap gap-2 max-w-xl">
        <Input
          placeholder="Type at least 2 characters…"
          value={q}
          onChange={e => setQ(e.target.value)}
          onKeyDown={e => {
            if (e.key === 'Enter') void search();
          }}
          aria-label="Search CMS"
        />
        <RegularBtn text="Search" loading={loading} onClick={() => void search()} />
      </div>

      {result ? (
        <div className="grid gap-10 pt-6">
          {section('Services', '/admin/dashboard/services', result.services)}
          {section('Projects', '/admin/dashboard/projects', result.projects)}
          {section('Brands', '/admin/dashboard/brands', result.brands)}
          {section('Testimonials', '/admin/dashboard/testimonials', result.testimonials)}
          {section('Team', '/admin/dashboard/team', result.teamMembers)}
          {result.services.length === 0 &&
            result.projects.length === 0 &&
            result.brands.length === 0 &&
            result.testimonials.length === 0 &&
            result.teamMembers.length === 0 && (
              <p className="text-muted-foreground">No matches in loaded content.</p>
            )}
        </div>
      ) : null}
    </DashboardPageWrapper>
  );
}
