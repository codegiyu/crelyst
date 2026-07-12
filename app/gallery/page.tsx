import { PublicShell } from '@/components/layout/PublicShell';
import { PublicLoadErrorBanner } from '@/components/general/PublicLoadErrorBanner';
import { GalleryPageView } from '@/components/section/gallery';
import { hasAnyServerFetchFailure, serverFetchJsonOrNull } from '@/app/_server/lib/api/serverFetch';
import { getAllProjectAndServiceImages } from '@/lib/utils/getAllProjectAndServiceImages';
import type {
  ClientSiteSettings,
  IProjectsListRes,
  IServicesListRes,
} from '@/lib/constants/endpoints';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Gallery',
  description:
    'Explore Crelyst work in an immersive 3D gallery — photography, branding, product design, and visual identity from our studio.',
};

export default async function GalleryPage() {
  const fetchResults = await Promise.all([
    serverFetchJsonOrNull<IProjectsListRes>('/api/projects?limit=100'),
    serverFetchJsonOrNull<IServicesListRes>('/api/services?limit=100'),
    serverFetchJsonOrNull<Pick<ClientSiteSettings, 'contactInfo'>>(
      '/api/site-settings/contactInfo'
    ),
    serverFetchJsonOrNull<Pick<ClientSiteSettings, 'socials'>>('/api/site-settings/socials'),
    serverFetchJsonOrNull<Pick<ClientSiteSettings, 'appDetails'>>('/api/site-settings/appDetails'),
  ]);

  const [projectsRes, servicesRes, contactInfoSlice, socialsSlice, appDetailsSlice] = fetchResults;
  const loadFailed = hasAnyServerFetchFailure(fetchResults);

  const footerSettings = {
    ...(contactInfoSlice.ok ? contactInfoSlice.data : {}),
    ...(socialsSlice.ok ? socialsSlice.data : {}),
    ...(appDetailsSlice.ok ? appDetailsSlice.data : {}),
  };

  const images = getAllProjectAndServiceImages(
    projectsRes.ok ? (projectsRes.data.projects ?? []) : [],
    servicesRes.ok ? (servicesRes.data.services ?? []) : []
  );

  return (
    <PublicShell transparentHeader footerSettings={footerSettings}>
      {loadFailed ? <PublicLoadErrorBanner /> : null}
      <GalleryPageView images={images} />
    </PublicShell>
  );
}
