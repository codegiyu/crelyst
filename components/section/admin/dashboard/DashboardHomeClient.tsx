/* eslint-disable react-hooks/exhaustive-deps */
'use client';

import { useEffect } from 'react';
import { useAuthStore } from '@/lib/store/useAuthStore';
import { useServicesStore } from '@/lib/store/useServicesStore';
import { useProjectsStore } from '@/lib/store/useProjectsStore';
import { useTestimonialsStore } from '@/lib/store/useTestimonialsStore';
import { useBrandsStore } from '@/lib/store/useBrandsStore';
import { useTeamMembersStore } from '@/lib/store/useTeamMembersStore';
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
import { Skeleton } from '@/components/ui/skeleton';
import Link from 'next/link';

export const DashboardHomeClient = () => {
  const { user } = useAuthStore(state => state);
  const {
    services,
    actions: servicesActions,
    isLoading: servicesLoading,
  } = useServicesStore(state => state);
  const {
    projects,
    actions: projectsActions,
    isLoading: projectsLoading,
  } = useProjectsStore(state => state);
  const {
    testimonials,
    actions: testimonialsActions,
    isLoading: testimonialsLoading,
  } = useTestimonialsStore(state => state);
  const {
    brands,
    actions: brandsActions,
    isLoading: brandsLoading,
  } = useBrandsStore(state => state);
  const {
    teamMembers,
    actions: teamMembersActions,
    isLoading: teamMembersLoading,
  } = useTeamMembersStore(state => state);

  useEffect(() => {
    servicesActions.fetchServices({ useAdminEndpoint: true });
    projectsActions.fetchProjects({ useAdminEndpoint: true });
    testimonialsActions.fetchTestimonials({ useAdminEndpoint: true });
    brandsActions.fetchBrands({ useAdminEndpoint: true });
    teamMembersActions.fetchTeamMembers({ useAdminEndpoint: true });
  }, []);

  const stats = [
    {
      title: 'Services',
      value: services.length,
      icon: Briefcase,
      color: 'bg-blue-500/10 text-blue-500',
      href: '/admin/dashboard/services',
      loading: servicesLoading,
    },
    {
      title: 'Projects',
      value: projects.length,
      icon: FolderKanban,
      color: 'bg-purple-500/10 text-purple-500',
      href: '/admin/dashboard/projects',
      loading: projectsLoading,
    },
    {
      title: 'Testimonials',
      value: testimonials.length,
      icon: Star,
      color: 'bg-amber-500/10 text-amber-500',
      href: '/admin/dashboard/testimonials',
      loading: testimonialsLoading,
    },
    {
      title: 'Brands',
      value: brands.length,
      icon: Users,
      color: 'bg-emerald-500/10 text-emerald-500',
      href: '/admin/dashboard/brands',
      loading: brandsLoading,
    },
    {
      title: 'Team Members',
      value: teamMembers.length,
      icon: UsersRound,
      color: 'bg-rose-500/10 text-rose-500',
      href: '/admin/dashboard/team',
      loading: teamMembersLoading,
    },
  ];

  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div className="grid gap-8">
      {/* Welcome Section */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          {greeting()}, {user?.firstName || 'Admin'}!
        </h1>
        <p className="text-muted-foreground">
          Here&apos;s an overview of your site&apos;s content and recent activity.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {stats.map(stat => (
          <Link
            key={stat.title}
            href={stat.href}
            className="group relative overflow-hidden rounded-xl border bg-card p-6 shadow-sm transition-all hover:shadow-md hover:border-primary/30">
            <div className="flex items-center justify-between">
              <div className="grid gap-1">
                <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                {stat.loading ? (
                  <Skeleton className="h-8 w-12" />
                ) : (
                  <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                )}
              </div>
              <div className={`rounded-full p-3 ${stat.color}`}>
                <stat.icon className="h-5 w-5" />
              </div>
            </div>
            <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-primary/0 via-primary/50 to-primary/0 opacity-0 transition-opacity group-hover:opacity-100" />
          </Link>
        ))}
      </div>

      {/* Quick Actions & Recent Activity */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Quick Actions */}
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

        {/* Recent Activity */}
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
              value={`${services.filter(s => s.isActive).length} of ${services.length}`}
              loading={servicesLoading}
            />
            <OverviewItem
              icon={FolderKanban}
              label="Featured Projects"
              value={`${projects.filter(p => p.isFeatured).length} featured`}
              loading={projectsLoading}
            />
            <OverviewItem
              icon={Star}
              label="Featured Testimonials"
              value={`${testimonials.filter(t => t.isFeatured).length} featured`}
              loading={testimonialsLoading}
            />
            <OverviewItem
              icon={Users}
              label="Active Brands"
              value={`${brands.filter(b => b.isActive).length} active`}
              loading={brandsLoading}
            />
            <OverviewItem
              icon={UsersRound}
              label="Active Team Members"
              value={`${teamMembers.filter(t => t.isActive).length} active`}
              loading={teamMembersLoading}
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
  loading,
}: {
  icon: typeof Activity;
  label: string;
  value: string;
  loading: boolean;
}) => (
  <div className="flex items-center justify-between">
    <div className="flex items-center gap-3">
      <div className="rounded-full bg-muted p-2">
        <Icon className="h-4 w-4 text-muted-foreground" />
      </div>
      <span className="text-sm text-muted-foreground">{label}</span>
    </div>
    {loading ? (
      <Skeleton className="h-5 w-16" />
    ) : (
      <span className="text-sm font-medium text-foreground">{value}</span>
    )}
  </div>
);
