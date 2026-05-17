import { describe, expect, it, vi } from 'vitest';
import { listFormSubmissions } from './listFormSubmissions';
import { AppError } from '../../lib/utils/appError';

vi.mock('../../lib/firestore/collections', () => ({
  listFormSubmissions: vi.fn().mockResolvedValue({
    items: [{ id: 'sub-1', name: 'Ada', email: 'ada@example.com', isRead: false }],
    total: 1,
    nextCursor: null,
    hasMore: false,
    limit: 25,
  }),
  countUnreadByFormType: vi.fn().mockResolvedValue(1),
}));

describe('listFormSubmissions', () => {
  it('rejects invalid formType query', async () => {
    const request = new Request(
      'http://localhost/api/admin/form-submissions?formType=invalid&limit=10'
    );

    await expect(
      listFormSubmissions({
        request: request as never,
        user: { _id: 'admin-1' } as never,
        body: {},
      })
    ).rejects.toBeInstanceOf(AppError);
  });

  it('returns submissions for a valid formType', async () => {
    const request = new Request(
      'http://localhost/api/admin/form-submissions?formType=quote-request&limit=25'
    );
    const response = await listFormSubmissions({
      request: request as never,
      user: { _id: 'admin-1' } as never,
      body: {},
    });
    const json = await response.json();

    expect(json.data.submissions).toHaveLength(1);
    expect(json.data.submissions[0]._id).toBe('sub-1');
    expect(json.data.unreadCount).toBe(1);
  });
});
