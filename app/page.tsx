import { PublicShell } from '@/components/layout/PublicShell';
import { PublicLoadErrorBanner } from '@/components/general/PublicLoadErrorBanner';
import { HomePageView } from '@/components/section/home';
import { JsonLd } from '@/components/seo/JsonLd';
import { getSettingsSlice } from '@/app/_server/controllers/site/fetchSettings';
import { buildOrganizationJsonLd } from '@/lib/seo/jsonLd';
import type { ContactInfo, SEODetails, Social } from '@/lib/types/site-settings';
import { hasAnyServerFetchFailure, serverFetchJsonOrNull } from '@/app/_server/lib/api/serverFetch';
import type {
  IBrandsListRes,
  IProjectsListRes,
  IServicesListRes,
  ITestimonialsListRes,
} from '@/lib/constants/endpoints';
import type { ClientSiteSettings } from '@/lib/constants/endpoints';

const LIST_Q = '?limit=100';

export default async function Home() {
  const [fetchResults, seoSlice] = await Promise.all([
    Promise.all([
      serverFetchJsonOrNull<IServicesListRes>(`/api/services${LIST_Q}`),
      serverFetchJsonOrNull<IProjectsListRes>(`/api/projects${LIST_Q}`),
      serverFetchJsonOrNull<ITestimonialsListRes>(`/api/testimonials${LIST_Q}`),
      serverFetchJsonOrNull<IBrandsListRes>(`/api/brands${LIST_Q}`),
      serverFetchJsonOrNull<Pick<ClientSiteSettings, 'contactInfo'>>(
        '/api/site-settings/contactInfo'
      ),
      serverFetchJsonOrNull<Pick<ClientSiteSettings, 'socials'>>('/api/site-settings/socials'),
      serverFetchJsonOrNull<Pick<ClientSiteSettings, 'appDetails'>>(
        '/api/site-settings/appDetails'
      ),
    ]),
    getSettingsSlice('seo', false),
  ]);

  const [
    servicesRes,
    projectsRes,
    testimonialsRes,
    brandsRes,
    contactInfoSlice,
    socialsSlice,
    appDetailsSlice,
  ] = fetchResults;

  const loadFailed = hasAnyServerFetchFailure(fetchResults);

  const footerSettings = {
    ...(contactInfoSlice.ok ? contactInfoSlice.data : {}),
    ...(socialsSlice.ok ? socialsSlice.data : {}),
    ...(appDetailsSlice.ok ? appDetailsSlice.data : {}),
  };

  const organizationJsonLd = buildOrganizationJsonLd({
    seo: (seoSlice as { seo?: SEODetails } | null)?.seo,
    contactInfo: footerSettings.contactInfo as ContactInfo | undefined,
    socials: footerSettings.socials as Social[] | undefined,
  });

  return (
    <PublicShell transparentHeader footerSettings={footerSettings}>
      <JsonLd data={organizationJsonLd} />
      {loadFailed ? <PublicLoadErrorBanner /> : null}
      <HomePageView
        services={servicesRes.ok ? (servicesRes.data.services ?? []) : []}
        projects={projectsRes.ok ? (projectsRes.data.projects ?? []) : []}
        testimonials={testimonialsRes.ok ? (testimonialsRes.data.testimonials ?? []) : []}
        brands={brandsRes.ok ? (brandsRes.data.brands ?? []) : []}
        contactInfo={footerSettings.contactInfo}
      />
    </PublicShell>
  );
}
