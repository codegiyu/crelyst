'use client';

import { useAuthStore } from '@/lib/store/useAuthStore';
import { useAdminResource } from '@/lib/hooks/use-admin-resource';
import { AdminSectionError } from '@/components/general/admin/AdminSectionError';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Briefcase,
  FolderKanban,
  Star,
  Users,
  UsersRound,
  TrendingUp,
  Activity,
  Calendar,
} from 'lucide-react';
import Link from 'next/link';
import type { LucideIcon } from 'lucide-react';

const DASHBOARD_LIST_LIMIT = 100;
const LIST_QUERY = '?limit=100' as const;

function formatDashboardStatValue(fetched: number, total: number): string {
  if (total > DASHBOARD_LIST_LIMIT && fetched >= DASHBOARD_LIST_LIMIT) {
    return `${DASHBOARD_LIST_LIMIT}+`;
  }

  return String(total);
}

type StatCardProps = {
  title: string;
  href: string;
  icon: LucideIcon;
  color: string;
  isLoading: boolean;
  isError: boolean;
  errorMessage: string | null;
  onRetry: () => void;
  value: string | null;
};

function StatCard({
  title,
  href,
  icon: Icon,
  color,
  isLoading,
  isError,
  errorMessage,
  onRetry,
  value,
}: StatCardProps) {
  if (isError) {
    return (
      <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-4 shadow-sm">
        <p className="text-sm font-medium text-muted-foreground mb-2">{title}</p>
        <AdminSectionError
          message={errorMessage ?? `Could not load ${title.toLowerCase()}.`}
          onRetry={() => void onRetry()}
          className="border-0 bg-transparent p-0 text-destructive"
        />
      </div>
    );
  }

  if (isLoading || value === null) {
    return (
      <div className="rounded-xl border bg-card p-6 shadow-sm" aria-busy="true">
        <div className="flex items-center justify-between">
          <div className="grid gap-2">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-8 w-12" />
          </div>
          <Skeleton className="size-11 rounded-full" />
        </div>
      </div>
    );
  }

  return (
    <Link
      href={href}
      className="group relative overflow-hidden rounded-xl border bg-card p-6 shadow-sm transition-all hover:shadow-md hover:border-primary/30">
      <div className="flex items-center justify-between">
        <div className="grid gap-1">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="text-2xl font-bold text-foreground">{value}</p>
        </div>
        <div className={`rounded-full p-3 ${color}`}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
      <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-primary/0 via-primary/50 to-primary/0 opacity-0 transition-opacity group-hover:opacity-100" />
    </Link>
  );
}

export const DashboardHomeClient = () => {
  const { user } = useAuthStore(state => state);

  const services = useAdminResource({
    resourceKey: ['admin', 'services', { limit: DASHBOARD_LIST_LIMIT }],
    endpoint: 'ADMIN_LIST_SERVICES',
    options: { query: LIST_QUERY },
    sectionLabel: 'services',
  });

  const projects = useAdminResource({
    resourceKey: ['admin', 'projects', { limit: DASHBOARD_LIST_LIMIT }],
    endpoint: 'ADMIN_LIST_PROJECTS',
    options: { query: LIST_QUERY },
    sectionLabel: 'projects',
  });

  const testimonials = useAdminResource({
    resourceKey: ['admin', 'testimonials', { limit: DASHBOARD_LIST_LIMIT }],
    endpoint: 'ADMIN_LIST_TESTIMONIALS',
    options: { query: LIST_QUERY },
    sectionLabel: 'testimonials',
  });

  const brands = useAdminResource({
    resourceKey: ['admin', 'brands', { limit: DASHBOARD_LIST_LIMIT }],
    endpoint: 'ADMIN_LIST_BRANDS',
    options: { query: LIST_QUERY },
    sectionLabel: 'brands',
  });

  const team = useAdminResource({
    resourceKey: ['admin', 'team-members', { limit: DASHBOARD_LIST_LIMIT }],
    endpoint: 'ADMIN_LIST_TEAM_MEMBERS',
    options: { query: LIST_QUERY },
    sectionLabel: 'team members',
  });

  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const serviceItems = services.data?.services ?? [];
  const projectItems = projects.data?.projects ?? [];
  const testimonialItems = testimonials.data?.testimonials ?? [];
  const brandItems = brands.data?.brands ?? [];
  const teamItems = team.data?.teamMembers ?? [];

  return (
    <div className="grid gap-8">
      <div className="grid gap-2">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          {greeting()}, {user?.firstName || 'Admin'}!
        </h1>
        <p className="text-muted-foreground">
          Here&apos;s an overview of your site&apos;s content.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        <StatCard
          title="Services"
          href="/admin/dashboard/services"
          icon={Briefcase}
          color="bg-blue-500/10 text-blue-500"
          isLoading={services.isLoading}
          isError={services.isError}
          errorMessage={services.errorMessage}
          onRetry={services.reload}
          value={
            services.isSuccess && services.data
              ? formatDashboardStatValue(
                  services.data.services.length,
                  services.data.pagination.total
                )
              : null
          }
        />
        <StatCard
          title="Projects"
          href="/admin/dashboard/projects"
          icon={FolderKanban}
          color="bg-purple-500/10 text-purple-500"
          isLoading={projects.isLoading}
          isError={projects.isError}
          errorMessage={projects.errorMessage}
          onRetry={projects.reload}
          value={
            projects.isSuccess && projects.data
              ? formatDashboardStatValue(
                  projects.data.projects.length,
                  projects.data.pagination.total
                )
              : null
          }
        />
        <StatCard
          title="Testimonials"
          href="/admin/dashboard/testimonials"
          icon={Star}
          color="bg-amber-500/10 text-amber-500"
          isLoading={testimonials.isLoading}
          isError={testimonials.isError}
          errorMessage={testimonials.errorMessage}
          onRetry={testimonials.reload}
          value={
            testimonials.isSuccess && testimonials.data
              ? formatDashboardStatValue(
                  testimonials.data.testimonials.length,
                  testimonials.data.pagination.total
                )
              : null
          }
        />
        <StatCard
          title="Brands"
          href="/admin/dashboard/brands"
          icon={Users}
          color="bg-emerald-500/10 text-emerald-500"
          isLoading={brands.isLoading}
          isError={brands.isError}
          errorMessage={brands.errorMessage}
          onRetry={brands.reload}
          value={
            brands.isSuccess && brands.data
              ? formatDashboardStatValue(brands.data.brands.length, brands.data.pagination.total)
              : null
          }
        />
        <StatCard
          title="Team Members"
          href="/admin/dashboard/team"
          icon={UsersRound}
          color="bg-rose-500/10 text-rose-500"
          isLoading={team.isLoading}
          isError={team.isError}
          errorMessage={team.errorMessage}
          onRetry={team.reload}
          value={
            team.isSuccess && team.data
              ? formatDashboardStatValue(team.data.teamMembers.length, team.data.pagination.total)
              : null
          }
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-xl border bg-card shadow-sm">
          <div className="border-b px-6 py-4">
            <h2 className="font-semibold text-foreground flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Quick Actions
            </h2>
          </div>
          <div className="p-6 grid gap-3">
            <QuickActionItem
              href="/admin/dashboard/services"
              title="Add New Service"
              description="Create a new service offering"
            />
            <QuickActionItem
              href="/admin/dashboard/projects"
              title="Add New Project"
              description="Showcase your latest work"
            />
            <QuickActionItem
              href="/admin/dashboard/testimonials"
              title="Add Testimonial"
              description="Add client feedback"
            />
            <QuickActionItem
              href="/admin/dashboard/settings"
              title="Site Settings"
              description="Configure site details"
            />
          </div>
        </div>

        <div className="rounded-xl border bg-card shadow-sm">
          <div className="border-b px-6 py-4">
            <h2 className="font-semibold text-foreground flex items-center gap-2">
              <Activity className="h-5 w-5 text-primary" />
              Site Overview
            </h2>
          </div>
          <div className="p-6 grid gap-4">
            <OverviewItem
              icon={Calendar}
              label="Active Services"
              isLoading={services.isLoading}
              isError={services.isError}
              onRetry={services.reload}
              value={
                services.isSuccess
                  ? `${serviceItems.filter(s => s.isActive).length} of ${serviceItems.length}`
                  : null
              }
            />
            <OverviewItem
              icon={FolderKanban}
              label="Featured Projects"
              isLoading={projects.isLoading}
              isError={projects.isError}
              onRetry={projects.reload}
              value={
                projects.isSuccess
                  ? `${projectItems.filter(p => p.isFeatured).length} featured`
                  : null
              }
            />
            <OverviewItem
              icon={Star}
              label="Featured Testimonials"
              isLoading={testimonials.isLoading}
              isError={testimonials.isError}
              onRetry={testimonials.reload}
              value={
                testimonials.isSuccess
                  ? `${testimonialItems.filter(t => t.isFeatured).length} featured`
                  : null
              }
            />
            <OverviewItem
              icon={Users}
              label="Active Brands"
              isLoading={brands.isLoading}
              isError={brands.isError}
              onRetry={brands.reload}
              value={
                brands.isSuccess ? `${brandItems.filter(b => b.isActive).length} active` : null
              }
            />
            <OverviewItem
              icon={UsersRound}
              label="Active Team Members"
              isLoading={team.isLoading}
              isError={team.isError}
              onRetry={team.reload}
              value={team.isSuccess ? `${teamItems.filter(t => t.isActive).length} active` : null}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

const QuickActionItem = ({
  href,
  title,
  description,
}: {
  href: string;
  title: string;
  description: string;
}) => (
  <Link
    href={href}
    className="block rounded-lg p-3 -mx-3 hover:bg-muted/50 transition-colors group">
    <p className="font-medium text-foreground group-hover:text-primary transition-colors">
      {title}
    </p>
    <p className="text-sm text-muted-foreground">{description}</p>
  </Link>
);

const OverviewItem = ({
  icon: Icon,
  label,
  value,
  isLoading,
  isError,
  onRetry,
}: {
  icon: LucideIcon;
  label: string;
  value: string | null;
  isLoading: boolean;
  isError: boolean;
  onRetry: () => Promise<void>;
}) => (
  <div className="flex items-center justify-between gap-3">
    <div className="flex items-center gap-3 min-w-0">
      <div className="rounded-full bg-muted p-2 shrink-0">
        <Icon className="h-4 w-4 text-muted-foreground" />
      </div>
      <span className="text-sm text-muted-foreground">{label}</span>
    </div>
    {isError ? (
      <button
        type="button"
        onClick={() => void onRetry()}
        className="text-sm font-medium text-destructive hover:underline shrink-0">
        Retry
      </button>
    ) : isLoading || value === null ? (
      <Skeleton className="h-4 w-16" />
    ) : (
      <span className="text-sm font-medium text-foreground">{value}</span>
    )}
  </div>
);
