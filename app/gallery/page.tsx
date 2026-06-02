import { PublicShell } from '@/components/layout/PublicShell';
import { GalleryPageView } from '@/components/section/gallery';
import { serverFetchJsonOrNull } from '@/app/_server/lib/api/serverFetch';
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
  const [projectsRes, servicesRes, contactInfoSlice, socialsSlice, appDetailsSlice] =
    await Promise.all([
      serverFetchJsonOrNull<IProjectsListRes>('/api/projects?limit=100'),
      serverFetchJsonOrNull<IServicesListRes>('/api/services?limit=100'),
      serverFetchJsonOrNull<Pick<ClientSiteSettings, 'contactInfo'>>(
        '/api/site-settings/contactInfo'
      ),
      serverFetchJsonOrNull<Pick<ClientSiteSettings, 'socials'>>('/api/site-settings/socials'),
      serverFetchJsonOrNull<Pick<ClientSiteSettings, 'appDetails'>>(
        '/api/site-settings/appDetails'
      ),
    ]);

  const footerSettings = {
    ...contactInfoSlice,
    ...socialsSlice,
    ...appDetailsSlice,
  };

  const images = getAllProjectAndServiceImages(
    projectsRes?.projects ?? [],
    servicesRes?.services ?? []
  );

  return (
    <PublicShell transparentHeader footerSettings={footerSettings}>
      <GalleryPageView images={images} />
    </PublicShell>
  );
}
