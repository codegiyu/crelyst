import { PublicShell } from '@/components/layout/PublicShell';
import { HomePageView } from '@/components/section/home';
import { serverFetchJsonOrNull } from '@/app/_server/lib/api/serverFetch';
import type {
  IBrandsListRes,
  IProjectsListRes,
  IServicesListRes,
  ITestimonialsListRes,
} from '@/lib/constants/endpoints';
import type { ClientSiteSettings } from '@/lib/constants/endpoints';

const LIST_Q = '?limit=100';

export default async function Home() {
  const [
    servicesRes,
    projectsRes,
    testimonialsRes,
    brandsRes,
    contactInfoSlice,
    socialsSlice,
    appDetailsSlice,
  ] = await Promise.all([
    serverFetchJsonOrNull<IServicesListRes>(`/api/services${LIST_Q}`),
    serverFetchJsonOrNull<IProjectsListRes>(`/api/projects${LIST_Q}`),
    serverFetchJsonOrNull<ITestimonialsListRes>(`/api/testimonials${LIST_Q}`),
    serverFetchJsonOrNull<IBrandsListRes>(`/api/brands${LIST_Q}`),
    serverFetchJsonOrNull<Pick<ClientSiteSettings, 'contactInfo'>>(
      '/api/site-settings/contactInfo'
    ),
    serverFetchJsonOrNull<Pick<ClientSiteSettings, 'socials'>>('/api/site-settings/socials'),
    serverFetchJsonOrNull<Pick<ClientSiteSettings, 'appDetails'>>('/api/site-settings/appDetails'),
  ]);

  const footerSettings = {
    ...contactInfoSlice,
    ...socialsSlice,
    ...appDetailsSlice,
  };

  return (
    <PublicShell transparentHeader footerSettings={footerSettings}>
      <HomePageView
        services={servicesRes?.services ?? []}
        projects={projectsRes?.projects ?? []}
        testimonials={testimonialsRes?.testimonials ?? []}
        brands={brandsRes?.brands ?? []}
        contactInfo={footerSettings.contactInfo}
      />
    </PublicShell>
  );
}
