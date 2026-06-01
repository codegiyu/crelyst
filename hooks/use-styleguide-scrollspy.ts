'use client';

import { useEffect, useState } from 'react';

const SCROLLSPY_ROOT_MARGIN = '-20% 0px -65% 0px';

export function useStyleguideScrollspy(sectionIds: readonly string[], defaultId: string) {
  const [activeId, setActiveId] = useState(defaultId);

  useEffect(() => {
    const elements = sectionIds
      .map(id => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);

    if (!elements.length) return;

    const visibleSections = new Map<string, IntersectionObserverEntry>();

    const pickActiveSection = () => {
      if (!visibleSections.size) return;

      const sorted = [...visibleSections.values()].sort(
        (a, b) => a.boundingClientRect.top - b.boundingClientRect.top
      );

      setActiveId(sorted[0].target.id);
    };

    const observer = new IntersectionObserver(
      entries => {
        for (const entry of entries) {
          const id = entry.target.id;

          if (entry.isIntersecting) {
            visibleSections.set(id, entry);
          } else {
            visibleSections.delete(id);
          }
        }

        pickActiveSection();
      },
      { rootMargin: SCROLLSPY_ROOT_MARGIN, threshold: [0, 0.1, 0.25, 0.5, 0.75, 1] }
    );

    for (const element of elements) {
      observer.observe(element);
    }

    const onScrollEnd = () => {
      const nearBottom =
        window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 48;

      if (nearBottom) {
        setActiveId(sectionIds[sectionIds.length - 1] ?? defaultId);
      }
    };

    window.addEventListener('scroll', onScrollEnd, { passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', onScrollEnd);
    };
  }, [sectionIds, defaultId]);

  return activeId;
}
