import type { ClientProject, ClientService } from '../constants/endpoints';

/**
 * Shuffles an array using Fisher-Yates algorithm
 */
const shuffleArray = <T>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

/**
 * Compiles all images from projects and services into a single array
 * Includes featuredImage, cardImage, bannerImage, and images array from projects
 * Includes image, cardImage, bannerImage from services
 * Filters out empty strings and duplicates
 * Returns the array in a randomized order
 */
export const getAllProjectAndServiceImages = (
  projects: ClientProject[],
  services: ClientService[]
): string[] => {
  const imageSet = new Set<string>();

  // Collect images from projects
  projects.forEach(project => {
    if (project.featuredImage && project.featuredImage.trim()) {
      imageSet.add(project.featuredImage);
    }
    if (project.cardImage && project.cardImage.trim()) {
      imageSet.add(project.cardImage);
    }
    if (project.bannerImage && project.bannerImage.trim()) {
      imageSet.add(project.bannerImage);
    }
    if (project.images && Array.isArray(project.images)) {
      project.images.forEach(img => {
        if (img && img.trim()) {
          imageSet.add(img);
        }
      });
    }
  });

  // Collect images from services
  services.forEach(service => {
    if (service.image && service.image.trim()) {
      imageSet.add(service.image);
    }
    if (service.cardImage && service.cardImage.trim()) {
      imageSet.add(service.cardImage);
    }
    if (service.bannerImage && service.bannerImage.trim()) {
      imageSet.add(service.bannerImage);
    }
  });

  const imagesArray = Array.from(imageSet);
  return shuffleArray(imagesArray);
};
