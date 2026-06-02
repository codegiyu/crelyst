'use client';

import { DomeGallery, type DomeGalleryImageItem } from '@/components/gallery';

export type GalleryDomeSectionProps = {
  images: string[];
};

export const GalleryDomeSection = ({ images }: GalleryDomeSectionProps) => {
  const galleryItems: DomeGalleryImageItem[] = images.map((src, index) => ({
    src,
    alt: `Gallery image ${index + 1}`,
  }));

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
          fit={0.5}
          minRadius={400}
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
