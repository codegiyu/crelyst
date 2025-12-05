/* eslint-disable react-hooks/exhaustive-deps */
'use client';

import { useEffect } from 'react';
import { useQueryState, parseAsStringLiteral } from 'nuqs';
import { useSiteSettingsStore } from '@/lib/store/useSiteSettingsStore';
import { DashboardPageWrapper } from '@/components/general/DashboardPageWrapper';
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
import { Skeleton } from '@/components/ui/skeleton';

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
] as const;

type SettingsTab = (typeof SETTINGS_TABS)[number];

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
];

export const SettingsPageClient = () => {
  const { settings, isLoading, actions } = useSiteSettingsStore(state => state);
  const { fetchAllSettings } = actions;

  const [activeTab, setActiveTab] = useQueryState(
    'tab',
    parseAsStringLiteral(SETTINGS_TABS).withDefault('app-details')
  );

  useEffect(() => {
    fetchAllSettings({ force: true });
  }, []);

  const renderTabContent = () => {
    if (isLoading || !settings) {
      return <TabContentSkeleton />;
    }

    switch (activeTab) {
      case 'app-details':
        return <AppDetailsTab settings={settings} />;
      case 'contact-info':
        return <ContactInfoTab settings={settings} />;
      case 'socials':
        return <SocialsTab settings={settings} />;
      case 'seo':
        return <SEOTab settings={settings} />;
      case 'branding':
        return <BrandingTab settings={settings} />;
      case 'email':
        return <EmailTab settings={settings} />;
      case 'legal':
        return <LegalTab settings={settings} />;
      case 'features':
        return <FeaturesTab settings={settings} />;
      case 'localization':
        return <LocalizationTab settings={settings} />;
      case 'analytics':
        return <AnalyticsTab settings={settings} />;
      default:
        return <AppDetailsTab settings={settings} />;
    }
  };

  return (
    <DashboardPageWrapper
      header={{
        title: 'Settings',
        description: 'Manage your site configuration and preferences',
      }}>
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Tab Navigation - Sidebar Style */}
        <nav className="lg:w-64 shrink-0">
          <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
            <div className="p-4 border-b bg-muted/30">
              <h3 className="font-semibold text-sm text-foreground">Configuration</h3>
            </div>
            <div className="p-2">
              {tabConfig.map(tab => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;

                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={cn(
                      'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-all duration-200',
                      'hover:bg-muted/50 group',
                      isActive && 'bg-primary text-primary-foreground hover:bg-primary/90'
                    )}>
                    <div
                      className={cn(
                        'p-1.5 rounded-md transition-colors',
                        isActive
                          ? 'bg-primary-foreground/20'
                          : 'bg-muted group-hover:bg-muted-foreground/10'
                      )}>
                      <Icon
                        className={cn(
                          'size-4',
                          isActive ? 'text-primary-foreground' : 'text-muted-foreground'
                        )}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p
                        className={cn(
                          'text-sm font-medium truncate',
                          isActive ? 'text-primary-foreground' : 'text-foreground'
                        )}>
                        {tab.label}
                      </p>
                      <p
                        className={cn(
                          'text-xs truncate hidden sm:block lg:hidden xl:block',
                          isActive ? 'text-primary-foreground/70' : 'text-muted-foreground'
                        )}>
                        {tab.description}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </nav>

        {/* Tab Content */}
        <div className="flex-1 min-w-0">{renderTabContent()}</div>
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
    <div className="flex justify-end">
      <Skeleton className="h-10 w-32" />
    </div>
  </div>
);
