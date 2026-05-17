import { PublicPageLoading } from '@/components/layout/PublicPageLoading';
import { ServicesPageLoadingContent } from '@/components/section/services/ServicesPageLoadingContent';

export default async function ServicesLoading() {
  return (
    <PublicPageLoading transparentHeader>
      <ServicesPageLoadingContent />
    </PublicPageLoading>
  );
}
