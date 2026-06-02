'use client';

import { useEffect } from 'react';

const SNAP_CLASSES = ['snap-y', 'snap-mandatory'] as const;

/**
 * Enables viewport scroll-snap on the gallery route (hero + dome section).
 * Skipped when the user prefers reduced motion.
 */
export function useGalleryScrollSnap() {
  useEffect(() => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reducedMotion) return;

    const root = document.documentElement;
    root.classList.add(...SNAP_CLASSES);

    return () => {
      root.classList.remove(...SNAP_CLASSES);
    };
  }, []);
}
