import { PublicPageLoading } from '@/components/layout/PublicPageLoading';
import { ServiceDetailPageLoadingContent } from '@/components/section/services/ServiceDetailPageLoadingContent';

export default async function ServiceDetailLoading() {
  return (
    <PublicPageLoading transparentHeader>
      <ServiceDetailPageLoadingContent />
    </PublicPageLoading>
  );
}
