/* eslint-disable react-hooks/immutability */
'use client';

import { useEffect, useState } from 'react';
import { SectionContainer } from '@/components/general/SectionContainer';
import { SectionHeading } from '@/components/general/SectionHeading';
import { motion } from 'motion/react';
import { useSiteStore } from '@/lib/store/siteStore';
import { useProjectsStore } from '@/lib/store/useProjectsStore';
import { useServicesStore } from '@/lib/store/useServicesStore';
import { getAllProjectAndServiceImages } from '@/lib/utils/getAllProjectAndServiceImages';
import { Image } from 'lucide-react';

export const GallerySection = () => {
  const { siteLoading } = useSiteStore(state => state);
  const { projects, actions: projectActions } = useProjectsStore(state => ({
    projects: state.projects,
    actions: state.actions,
  }));
  const { services, actions: serviceActions } = useServicesStore(state => ({
    services: state.services,
    actions: state.actions,
  }));

  const [images, setImages] = useState<string[]>([]);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    // Fetch projects and services if not already loaded
    if (projects.length === 0) {
      projectActions.fetchProjects({ limit: 100 });
    }
    if (services.length === 0) {
      serviceActions.fetchServices({ limit: 100 });
    }
  }, [projects.length, services.length, projectActions, serviceActions]);

  useEffect(() => {
    // Compile images whenever projects or services change
    const compiledImages = getAllProjectAndServiceImages(projects, services);
    setImages(compiledImages);
  }, [projects, services]);

  const openLightbox = (index: number) => {
    setCurrentIndex(index);
    setLightboxOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
    document.body.style.overflow = 'unset';
  };

  const goToPrevious = () => {
    setCurrentIndex(prev => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setCurrentIndex(prev => (prev === images.length - 1 ? 0 : prev + 1));
  };

  if (images.length === 0) {
    return null;
  }

  return (
    <>
      <SectionContainer background="default" fullWidth>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={siteLoading ? {} : { opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="w-full">
          <SectionHeading
            title="Our Work Gallery"
            text="A showcase of our projects and services"
            Icon={Image}
          />

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-1 mt-12">
            {images.map((image, index) => (
              <motion.button
                key={`${image}-${index}`}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={siteLoading ? {} : { opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                viewport={{ once: true }}
                onClick={() => openLightbox(index)}
                className="aspect-square rounded-xl overflow-hidden bg-muted hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 group">
                <img
                  src={image}
                  alt={`Gallery image ${index + 1}`}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  loading="lazy"
                />
              </motion.button>
            ))}
          </div>
        </motion.div>
      </SectionContainer>

      {/* Lightbox */}
      {lightboxOpen && images.length > 0 && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4"
          onClick={closeLightbox}>
          <button
            onClick={e => {
              e.stopPropagation();
              closeLightbox();
            }}
            className="absolute top-4 right-4 text-white hover:text-accent transition-colors z-10 p-2">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>

          <button
            onClick={e => {
              e.stopPropagation();
              goToPrevious();
            }}
            className="absolute left-4 text-white hover:text-accent transition-colors z-10 p-2">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>

          <button
            onClick={e => {
              e.stopPropagation();
              goToNext();
            }}
            className="absolute right-4 text-white hover:text-accent transition-colors z-10 p-2">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          <div
            onClick={e => e.stopPropagation()}
            className="max-w-7xl max-h-full flex items-center justify-center">
            <motion.img
              key={currentIndex}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
              src={images[currentIndex]}
              alt={`Gallery image ${currentIndex + 1}`}
              className="max-w-full max-h-[90vh] object-contain rounded-lg"
            />
          </div>

          {/* Image counter */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white text-sm bg-black/50 px-4 py-2 rounded-full">
            {currentIndex + 1} / {images.length}
          </div>
        </div>
      )}
    </>
  );
};
