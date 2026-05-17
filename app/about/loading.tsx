import { PublicPageLoading } from '@/components/layout/PublicPageLoading';
import { AboutPageLoadingContent } from '@/components/section/about/AboutPageLoadingContent';

export default async function AboutLoading() {
  return (
    <PublicPageLoading transparentHeader>
      <AboutPageLoadingContent />
    </PublicPageLoading>
  );
}
