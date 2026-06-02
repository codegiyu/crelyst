'use client';

import { DomeGallery, type DomeGalleryImageItem } from '@/components/gallery';
import { useIsMobile, useMediaQuery } from '@/lib/hooks/use-mobile';

export type GalleryDomeSectionProps = {
  images: string[];
};

export const GalleryDomeSection = ({ images }: GalleryDomeSectionProps) => {
  const isMobile = useIsMobile();
  const isLg = useMediaQuery('(min-width: 1024px)');
  const isXl = useMediaQuery('(min-width: 1280px)');

  const galleryItems: DomeGalleryImageItem[] = images.map((src, index) => ({
    src,
    alt: `Gallery image ${index + 1}`,
  }));

  const openedImageWidth = isXl
    ? 'min(88vw, 780px)'
    : isLg
      ? 'min(90vw, 640px)'
      : 'min(92vw, 400px)';

  const openedImageHeight = isXl
    ? 'min(85vh, 880px)'
    : isLg
      ? 'min(82vh, 720px)'
      : 'min(72vh, 520px)';

  return (
    <section
      aria-label="Interactive gallery"
      className="relative h-dvh min-h-screen w-full snap-start overflow-hidden bg-[#0a0a0a]">
      {galleryItems.length > 0 ? (
        <DomeGallery
          className="h-full w-full"
          images={galleryItems}
          grayscale={false}
          overlayBlurColor="#0a0a0a"
          layout={isMobile ? 'portrait' : 'landscape'}
          fit={isMobile ? 0.56 : 0.5}
          fitBasis={isMobile ? 'height' : 'auto'}
          minRadius={isMobile ? 260 : 400}
          maxVerticalRotationDeg={isMobile ? 14 : 5}
          segmentsY={isMobile ? 28 : undefined}
          openedImageWidth={openedImageWidth}
          openedImageHeight={openedImageHeight}
          openedImageBorderRadius={isLg ? '24px' : '20px'}
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center px-6 text-center">
          <p className="max-w-md text-sm text-white/70 md:text-base">
            Gallery images will appear here once projects and services are published.
          </p>
        </div>
      )}
    </section>
  );
};
