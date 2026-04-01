import { revalidatePath } from 'next/cache';
import { logger } from './logger';

function safeRevalidate(label: string, fn: () => void) {
  try {
    fn();
  } catch (err) {
    logger.warn(`revalidateSiteCache: ${label} failed`, { err });
  }
}

export function revalidateProjectPublic(slug?: string) {
  safeRevalidate('project', () => {
    revalidatePath('/');
    revalidatePath('/projects');
    if (slug) revalidatePath(`/projects/${slug}`);
  });
}

export function revalidateServicePublic(slug?: string) {
  safeRevalidate('service', () => {
    revalidatePath('/');
    revalidatePath('/services');
    if (slug) revalidatePath(`/services/${slug}`);
  });
}

/** Brands, team, testimonials surface on home / about. */
export function revalidateAboutAndHome() {
  safeRevalidate('about-home', () => {
    revalidatePath('/');
    revalidatePath('/about');
  });
}

/** Site settings (footer, contact, etc.) affect most public pages. */
export function revalidatePublicLayout() {
  safeRevalidate('layout', () => {
    revalidatePath('/', 'layout');
  });
}
