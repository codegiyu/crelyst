import { describe, expect, it, vi, beforeEach } from 'vitest';
import { createTestimonial } from './createTestimonial';
import { updateTestimonial } from './updateTestimonial';
import { deleteTestimonial } from './deleteTestimonial';
import { reorderTestimonials } from './reorderTestimonials';
import { AppError } from '../../lib/utils/appError';

const mockCreate = vi.fn();
const mockGetById = vi.fn();
const mockUpdate = vi.fn();
const mockDelete = vi.fn();
const mockReorder = vi.fn();

vi.mock('../../lib/utils/revalidateSiteCache', () => ({
  revalidateAboutAndHome: vi.fn(),
}));

vi.mock('../../lib/firestore/collections', () => ({
  createTestimonial: (...args: unknown[]) => mockCreate(...args),
  getTestimonialById: (...args: unknown[]) => mockGetById(...args),
  updateTestimonial: (...args: unknown[]) => mockUpdate(...args),
  deleteTestimonial: (...args: unknown[]) => mockDelete(...args),
  reorderTestimonials: (...args: unknown[]) => mockReorder(...args),
}));

const adminUser = { _id: 'admin-1' } as never;

describe('testimonial admin controllers', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('createTestimonial', () => {
    it('rejects unauthenticated requests', async () => {
      await expect(
        createTestimonial({
          request: new Request('http://localhost/api/admin/testimonials') as never,
          user: null,
          body: { clientName: 'Ada', testimonial: 'Great work' },
        })
      ).rejects.toBeInstanceOf(AppError);
    });

    it('creates with active default and returns testimonial', async () => {
      mockCreate.mockResolvedValue({
        id: 't-1',
        clientName: 'Ada',
        testimonial: 'Great work',
        isActive: true,
        isFeatured: false,
        rating: 5,
        displayOrder: 0,
      });

      const response = await createTestimonial({
        request: new Request('http://localhost/api/admin/testimonials') as never,
        user: adminUser,
        body: { clientName: 'Ada', testimonial: 'Great work' },
      });
      const json = await response.json();

      expect(mockCreate).toHaveBeenCalledWith(
        expect.objectContaining({
          clientName: 'Ada',
          testimonial: 'Great work',
          isActive: true,
          isFeatured: false,
          rating: 5,
        })
      );
      expect(json.data.testimonial._id).toBe('t-1');
    });
  });

  describe('updateTestimonial', () => {
    it('toggles isFeatured on existing testimonial', async () => {
      mockGetById.mockResolvedValue({ id: 't-1', clientName: 'Ada' });
      mockUpdate.mockResolvedValue({
        id: 't-1',
        clientName: 'Ada',
        isFeatured: true,
      });

      const response = await updateTestimonial({
        request: new Request('http://localhost/api/admin/testimonials/t-1') as never,
        user: adminUser,
        body: { isFeatured: true },
      });
      const json = await response.json();

      expect(mockUpdate).toHaveBeenCalledWith('t-1', { isFeatured: true });
      expect(json.data.testimonial.isFeatured).toBe(true);
    });

    it('returns 404 when testimonial missing', async () => {
      mockGetById.mockResolvedValue(null);

      await expect(
        updateTestimonial({
          request: new Request('http://localhost/api/admin/testimonials/missing') as never,
          user: adminUser,
          body: { isActive: false },
        })
      ).rejects.toMatchObject({ statusCode: 404 });
    });
  });

  describe('deleteTestimonial', () => {
    it('returns success payload', async () => {
      mockGetById.mockResolvedValue({ id: 't-1' });
      mockDelete.mockResolvedValue(true);

      const response = await deleteTestimonial({
        request: new Request('http://localhost/api/admin/testimonials/t-1') as never,
        user: adminUser,
        body: {},
      });
      const json = await response.json();

      expect(json.data).toEqual({ success: true });
    });
  });

  describe('reorderTestimonials', () => {
    it('persists display order updates', async () => {
      mockReorder.mockResolvedValue({ modifiedCount: 2, matchedCount: 2 });

      const response = await reorderTestimonials({
        request: new Request('http://localhost/api/admin/testimonials/reorder') as never,
        user: adminUser,
        body: {
          reorderItems: [
            { id: 't-1', displayOrder: 1 },
            { id: 't-2', displayOrder: 2 },
          ],
        },
      });
      const json = await response.json();

      expect(mockReorder).toHaveBeenCalledWith([
        { id: 't-1', displayOrder: 1 },
        { id: 't-2', displayOrder: 2 },
      ]);
      expect(json.data.modifiedCount).toBe(2);
    });
  });
});
