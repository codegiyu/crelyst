import { Model, Document } from 'mongoose';

/**
 * Converts a string to a URL-friendly slug
 */
export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-') // Replace spaces with -
    .replace(/[^w-]+/g, '') // Remove all non-word chars except -
    .replace(/--+/g, '-') // Replace multiple - with single -
    .replace(/^-+/, '') // Trim - from start of text
    .replace(/-+$/, ''); // Trim - from end of text
}

/**
 * Generates a unique slug for a document
 * If the base slug already exists, appends a number suffix
 */
export async function generateUniqueSlug<T extends Document>(
  model: Model<T>,
  baseSlug: string,
  excludeId?: string
): Promise<string> {
  const slug = slugify(baseSlug);
  let counter = 0;
  let candidateSlug = slug;

  // Keep trying until we find a unique slug
  while (true) {
    const query: Record<string, unknown> = { slug: candidateSlug };

    // Exclude current document when updating
    if (excludeId) {
      query._id = { $ne: excludeId };
    }

    const existing = await model.findOne(query).select('_id').lean();

    if (!existing) {
      return candidateSlug;
    }

    counter++;
    candidateSlug = `${slug}-${counter}`;
  }
}

/**
 * Creates pre-save and pre-findOneAndUpdate middleware for auto-generating slugs
 * @param titleField - The field name to generate slug from (e.g., 'title', 'name')
 */
export function createSlugMiddleware<T extends Document>(titleField: string = 'title') {
  return {
    preSave: async function (this: T & Document, next: () => void) {
      const doc = this as T & Document & Record<string, unknown>;
      const model = doc.constructor as Model<T>;
      const titleValue = doc[titleField] as string | undefined;

      // Generate slug if title exists and slug is empty or title was modified
      if (titleValue && (!doc.slug || doc.isModified(titleField))) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (doc as any).slug = await generateUniqueSlug(model, titleValue, doc._id?.toString());
      }

      next();
    },

    preUpdate: async function (
      this: {
        getQuery: () => Record<string, unknown>;
        getUpdate: () => Record<string, unknown> | null;
        model: Model<T>;
      },
      next: () => void
    ) {
      const update = this.getUpdate() as Record<string, unknown> | null;
      if (!update) return next();

      const titleValue = update[titleField] as string | undefined;

      // If title is being updated but slug is not provided, generate a new slug
      if (titleValue && !update.slug) {
        const query = this.getQuery();
        const docId = query._id?.toString();
        update.slug = await generateUniqueSlug(this.model, titleValue, docId);
      }

      next();
    },
  };
}
