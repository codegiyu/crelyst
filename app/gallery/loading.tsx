import { PublicPageLoading } from '@/components/layout/PublicPageLoading';
import { RegularPageHeroSection } from '@/components/general/RegularPageHeroSection';

export default function GalleryLoading() {
  return (
    <PublicPageLoading transparentHeader>
      <RegularPageHeroSection
        immediate
        backgroundImage="/images/bg-hero-gallery.jpg"
        badge="Visual Showcase"
        title="The Crelyst Gallery"
        description="Loading gallery…"
      />
      <div className="h-dvh min-h-screen w-full animate-pulse bg-[#0a0a0a]" aria-hidden />
    </PublicPageLoading>
  );
}
