'use client';

import { useQueryState, parseAsStringLiteral } from 'nuqs';
import { useSiteSettingsStore } from '@/lib/store/useSiteSettingsStore';
import type { SiteSettingsSlice } from '@/lib/store/useSiteSettingsStore';
import type { ClientSiteSettings } from '@/lib/constants/endpoints';
import { DashboardPageWrapper } from '@/components/general/DashboardPageWrapper';
import { AdminAsyncSection } from '@/components/general/admin/AdminAsyncSection';
import { useAdminResource } from '@/lib/hooks/use-admin-resource';
import { cn } from '@/lib/utils';
import {
  Building2,
  Phone,
  Share2,
  Search,
  Palette,
  Mail,
  Scale,
  ToggleLeft,
  Globe,
  BarChart3,
  ListOrdered,
} from 'lucide-react';
import { AppDetailsTab } from './tabs/AppDetailsTab';
import { ContactInfoTab } from './tabs/ContactInfoTab';
import { SocialsTab } from './tabs/SocialsTab';
import { SEOTab } from './tabs/SEOTab';
import { BrandingTab } from './tabs/BrandingTab';
import { EmailTab } from './tabs/EmailTab';
import { LegalTab } from './tabs/LegalTab';
import { FeaturesTab } from './tabs/FeaturesTab';
import { LocalizationTab } from './tabs/LocalizationTab';
import { AnalyticsTab } from './tabs/AnalyticsTab';
import { ProjectWorkflowTab } from './tabs/ProjectWorkflowTab';
import { Skeleton } from '@/components/ui/skeleton';
import { settingsTabRemountKey } from '@/lib/utils/settingsTabKey';

const SETTINGS_TABS = [
  'app-details',
  'contact-info',
  'socials',
  'seo',
  'branding',
  'email',
  'legal',
  'features',
  'localization',
  'analytics',
  'project-workflow',
] as const;

type SettingsTab = (typeof SETTINGS_TABS)[number];

const TAB_TO_SLICE: Record<SettingsTab, SiteSettingsSlice> = {
  'app-details': 'appDetails',
  'contact-info': 'contactInfo',
  socials: 'socials',
  seo: 'seo',
  branding: 'branding',
  email: 'email',
  legal: 'legal',
  features: 'features',
  localization: 'localization',
  analytics: 'analytics',
  'project-workflow': 'projectWorkflow',
};

const tabConfig: {
  id: SettingsTab;
  label: string;
  icon: typeof Building2;
  description: string;
}[] = [
  {
    id: 'app-details',
    label: 'App Details',
    icon: Building2,
    description: 'App name, logo, and description',
  },
  {
    id: 'contact-info',
    label: 'Contact Info',
    icon: Phone,
    description: 'Address, phone, and office hours',
  },
  {
    id: 'socials',
    label: 'Social Media',
    icon: Share2,
    description: 'Social media links',
  },
  {
    id: 'seo',
    label: 'SEO',
    icon: Search,
    description: 'Meta tags and search optimization',
  },
  {
    id: 'branding',
    label: 'Branding',
    icon: Palette,
    description: 'Colors and visual identity',
  },
  {
    id: 'email',
    label: 'Email',
    icon: Mail,
    description: 'Email configuration',
  },
  {
    id: 'legal',
    label: 'Legal',
    icon: Scale,
    description: 'Legal documents and policies',
  },
  {
    id: 'features',
    label: 'Features',
    icon: ToggleLeft,
    description: 'Feature flags and toggles',
  },
  {
    id: 'localization',
    label: 'Localization',
    icon: Globe,
    description: 'Language and regional settings',
  },
  {
    id: 'analytics',
    label: 'Analytics',
    icon: BarChart3,
    description: 'Tracking and analytics IDs',
  },
  {
    id: 'project-workflow',
    label: 'Project Workflow',
    icon: ListOrdered,
    description: 'Client journey from brief to delivery',
  },
];

type SettingsTabNavItemProps = {
  tab: (typeof tabConfig)[number];
  isActive: boolean;
  onClick: () => void;
};

const SettingsTabNavItem = ({ tab, isActive, onClick }: SettingsTabNavItemProps) => {
  const Icon = tab.icon;

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'w-full flex items-start gap-3 rounded-lg px-3 py-2.5 text-left transition-colors',
        isActive ? 'bg-primary/10 text-primary' : 'hover:bg-muted/60 text-foreground'
      )}>
      <Icon className="size-4 mt-0.5 shrink-0" />
      <div className="min-w-0 grid gap-0.5">
        <span className="text-sm font-medium leading-none">{tab.label}</span>
        <p
          className={cn(
            'text-xs leading-snug',
            isActive ? 'text-primary/80' : 'text-muted-foreground'
          )}>
          {tab.description}
        </p>
      </div>
    </button>
  );
};

export const SettingsPageClient = () => {
  const storeSettings = useSiteSettingsStore(state => state.settings);

  const [activeTab, setActiveTab] = useQueryState(
    'tab',
    parseAsStringLiteral(SETTINGS_TABS).withDefault('app-details')
  );

  const slice = TAB_TO_SLICE[activeTab];
  const sliceQuery = `/${slice}` as const;

  const sliceResource = useAdminResource({
    resourceKey: ['admin', 'site-settings', slice],
    endpoint: 'ADMIN_GET_SITE_SETTINGS',
    options: { query: sliceQuery },
    sectionLabel: `${tabConfig.find(t => t.id === activeTab)?.label ?? 'settings'}`,
  });

  const effective: Partial<ClientSiteSettings> = {
    ...(storeSettings ?? {}),
    ...(sliceResource.data ?? {}),
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'app-details':
        return (
          <AppDetailsTab
            key={settingsTabRemountKey('app-details', effective.appDetails)}
            settings={effective}
          />
        );
      case 'contact-info':
        return (
          <ContactInfoTab
            key={settingsTabRemountKey('contact-info', effective.contactInfo)}
            settings={effective}
          />
        );
      case 'socials':
        return (
          <SocialsTab
            key={settingsTabRemountKey('socials', effective.socials)}
            settings={effective}
          />
        );
      case 'seo':
        return <SEOTab key={settingsTabRemountKey('seo', effective.seo)} settings={effective} />;
      case 'branding':
        return (
          <BrandingTab
            key={settingsTabRemountKey('branding', effective.branding)}
            settings={effective}
          />
        );
      case 'email':
        return (
          <EmailTab key={settingsTabRemountKey('email', effective.email)} settings={effective} />
        );
      case 'legal':
        return (
          <LegalTab key={settingsTabRemountKey('legal', effective.legal)} settings={effective} />
        );
      case 'features':
        return (
          <FeaturesTab
            key={settingsTabRemountKey('features', effective.features)}
            settings={effective}
          />
        );
      case 'localization':
        return (
          <LocalizationTab
            key={settingsTabRemountKey('localization', effective.localization)}
            settings={effective}
          />
        );
      case 'analytics':
        return (
          <AnalyticsTab
            key={settingsTabRemountKey('analytics', effective.analytics)}
            settings={effective}
          />
        );
      case 'project-workflow':
        return (
          <ProjectWorkflowTab
            key={settingsTabRemountKey('project-workflow', effective.projectWorkflow)}
            settings={effective}
          />
        );
      default:
        return (
          <AppDetailsTab
            key={settingsTabRemountKey('app-details', effective.appDetails)}
            settings={effective}
          />
        );
    }
  };

  return (
    <DashboardPageWrapper
      header={{
        title: 'Settings',
        description: 'Manage your site configuration and preferences',
      }}>
      <div className="flex flex-col lg:flex-row gap-6">
        <nav className="lg:w-64 shrink-0">
          <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
            <div className="p-4 border-b bg-muted/30">
              <h3 className="font-semibold text-sm text-foreground">Configuration</h3>
            </div>
            <div className="p-2">
              {tabConfig.map(tab => (
                <SettingsTabNavItem
                  key={tab.id}
                  tab={tab}
                  isActive={activeTab === tab.id}
                  onClick={() => setActiveTab(tab.id)}
                />
              ))}
            </div>
          </div>
        </nav>

        <div className="flex-1 min-w-0">
          <AdminAsyncSection
            status={sliceResource.status}
            errorMessage={sliceResource.errorMessage}
            onRetry={() => void sliceResource.reload()}
            hasData={sliceResource.data != null}
            loadingFallback={<TabContentSkeleton />}>
            {renderTabContent()}
          </AdminAsyncSection>
        </div>
      </div>
    </DashboardPageWrapper>
  );
};

const TabContentSkeleton = () => (
  <div className="rounded-xl border bg-card shadow-sm p-6 grid gap-6">
    <div className="grid gap-2">
      <Skeleton className="h-6 w-48" />
      <Skeleton className="h-4 w-72" />
    </div>
    <div className="grid gap-4">
      <div className="grid gap-2">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-10 w-full" />
      </div>
      <div className="grid gap-2">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-10 w-full" />
      </div>
      <div className="grid gap-2">
        <Skeleton className="h-4 w-28" />
        <Skeleton className="h-24 w-full" />
      </div>
    </div>
  </div>
);
