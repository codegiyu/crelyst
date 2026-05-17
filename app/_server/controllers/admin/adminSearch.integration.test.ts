import { describe, expect, it, vi } from 'vitest';
import { adminSearch } from './adminSearch';

vi.mock('../../lib/firestore/collections', () => ({
  listServices: vi.fn().mockResolvedValue({
    items: [{ id: 's1', title: 'Brand Design', slug: 'brand-design' }],
    total: 1,
  }),
  listProjects: vi.fn().mockResolvedValue({ items: [], total: 0 }),
  listBrands: vi.fn().mockResolvedValue({ items: [], total: 0 }),
  listTestimonials: vi.fn().mockResolvedValue({ items: [], total: 0 }),
  listTeamMembers: vi.fn().mockResolvedValue({ items: [], total: 0 }),
}));

describe('adminSearch', () => {
  it('rejects queries shorter than 2 characters', async () => {
    const request = new Request('http://localhost/api/admin/search?q=a');
    await expect(
      adminSearch({
        request: request as never,
        user: { _id: 'admin-1' } as never,
        body: {},
      })
    ).rejects.toMatchObject({ statusCode: 400 });
  });

  it('returns matching services for a valid query', async () => {
    const request = new Request('http://localhost/api/admin/search?q=brand');
    const response = await adminSearch({
      request: request as never,
      user: { _id: 'admin-1' } as never,
      body: {},
    });
    const json = await response.json();

    expect(json.data.services).toHaveLength(1);
    expect(json.data.services[0].title).toBe('Brand Design');
  });
});
