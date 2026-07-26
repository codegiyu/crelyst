import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getPublicBbsSiteContent } from './getPublicBbsSiteContent';
import { updateBbsSiteContent } from './updateBbsSiteContent';
import { DEFAULT_BBS_SITE_CONTENT } from './schema';
import { AppError } from '../../lib/utils/appError';

const mockGet = vi.fn();
const mockSet = vi.fn();

vi.mock('../../lib/firestore/collections', () => ({
  getBbsSiteContent: (...args: unknown[]) => mockGet(...args),
  setBbsSiteContent: (...args: unknown[]) => mockSet(...args),
}));

describe('getPublicBbsSiteContent', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns seeded defaults when Firestore doc is missing', async () => {
    mockGet.mockResolvedValue(null);

    const response = await getPublicBbsSiteContent({
      request: new Request('http://localhost/api/public/bbs-site-content') as never,
      user: null,
      body: {},
    });

    const json = await response.json();
    expect(json.status).toBe(true);
    expect(json.data.content.contact.email).toBe(DEFAULT_BBS_SITE_CONTENT.contact.email);
  });

  it('returns stored about and contact when present', async () => {
    mockGet.mockResolvedValue({
      about: { ...DEFAULT_BBS_SITE_CONTENT.about, eyebrow: 'Who I Am' },
      contact: DEFAULT_BBS_SITE_CONTENT.contact,
    });

    const response = await getPublicBbsSiteContent({
      request: new Request('http://localhost/api/public/bbs-site-content') as never,
      user: null,
      body: {},
    });

    const json = await response.json();
    expect(json.data.content.about.eyebrow).toBe('Who I Am');
  });
});

describe('updateBbsSiteContent', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('requires auth', async () => {
    await expect(
      updateBbsSiteContent({
        request: new Request('http://localhost/api/admin/bbs-site-content') as never,
        user: null,
        body: { about: DEFAULT_BBS_SITE_CONTENT.about },
      })
    ).rejects.toBeInstanceOf(AppError);
  });

  it('merges about-only patch into existing content', async () => {
    mockGet.mockResolvedValue({
      about: DEFAULT_BBS_SITE_CONTENT.about,
      contact: DEFAULT_BBS_SITE_CONTENT.contact,
    });
    mockSet.mockImplementation(async (data: unknown) => data);

    const nextAbout = {
      ...DEFAULT_BBS_SITE_CONTENT.about,
      headingLine1: 'Craft First.',
    };

    const response = await updateBbsSiteContent({
      request: new Request('http://localhost/api/admin/bbs-site-content', {
        method: 'PATCH',
      }) as never,
      user: { _id: 'admin-1' } as never,
      body: { about: nextAbout },
    });

    const json = await response.json();
    expect(mockSet).toHaveBeenCalledWith(
      expect.objectContaining({
        about: expect.objectContaining({ headingLine1: 'Craft First.' }),
        contact: DEFAULT_BBS_SITE_CONTENT.contact,
      })
    );
    expect(json.data.content.about.headingLine1).toBe('Craft First.');
  });
});
