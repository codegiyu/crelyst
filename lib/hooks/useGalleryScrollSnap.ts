'use client';

import { useEffect } from 'react';

/** Proximity snapping: settles near hero/dome/CTA when you slow down, but does not trap scroll like mandatory. */
const SNAP_CLASSES = ['snap-y', 'snap-proximity'] as const;

/**
 * Enables viewport scroll-snap on the gallery route.
 * Uses proximity (not mandatory) so users can scroll past the dome to the CTA and footer.
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
