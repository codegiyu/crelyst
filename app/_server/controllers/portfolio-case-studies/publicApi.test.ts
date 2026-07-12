import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  corsHeadersForOrigin,
  isBoldBrandStudioOrigin,
} from '@/app/_server/lib/utils/portfolioCors';
import { getPublicPortfolioCaseStudy } from './getPublicPortfolioCaseStudy';
import { AppError } from '../../lib/utils/appError';

const mockGetBySlug = vi.fn();
const mockGetById = vi.fn();

vi.mock('../../lib/firestore/collections', () => ({
  getPortfolioCaseStudyBySlug: (...args: unknown[]) => mockGetBySlug(...args),
  getPortfolioCaseStudyById: (...args: unknown[]) => mockGetById(...args),
}));

describe('portfolioCors', () => {
  it('allows Bold Brand Studio dev origin', () => {
    expect(isBoldBrandStudioOrigin('http://localhost:5173')).toBe(true);
    const headers = corsHeadersForOrigin('http://localhost:5173');
    expect(headers['Access-Control-Allow-Origin']).toBe('http://localhost:5173');
  });

  it('allows Vercel preview pattern', () => {
    expect(isBoldBrandStudioOrigin('https://bold-brand-studio-git-main.vercel.app')).toBe(true);
  });

  it('rejects arbitrary third-party origin', () => {
    expect(isBoldBrandStudioOrigin('https://evil.example.com')).toBe(false);
    expect(corsHeadersForOrigin('https://evil.example.com')).toEqual({});
  });
});

describe('getPublicPortfolioCaseStudy', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns 404 for nonexistent slug', async () => {
    mockGetBySlug.mockResolvedValue(null);
    mockGetById.mockResolvedValue(null);

    await expect(
      getPublicPortfolioCaseStudy({
        request: new Request(
          'http://localhost/api/public/portfolio-case-studies/does-not-exist'
        ) as never,
        user: null,
        body: {},
      })
    ).rejects.toMatchObject({ statusCode: 404 });
  });

  it('hides inactive case studies from client access', async () => {
    mockGetBySlug.mockResolvedValue({
      id: 'test-id',
      slug: 'draft-case-study',
      title: 'Draft',
      isActive: false,
    });
    mockGetById.mockResolvedValue(null);

    await expect(
      getPublicPortfolioCaseStudy({
        request: new Request(
          'http://localhost/api/public/portfolio-case-studies/draft-case-study'
        ) as never,
        user: null,
        body: {},
      })
    ).rejects.toBeInstanceOf(AppError);
  });
});
