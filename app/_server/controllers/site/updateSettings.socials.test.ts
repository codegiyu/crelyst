import { describe, expect, it, vi, beforeEach } from 'vitest';
import { AppError } from '../../lib/utils/appError';

const mockGetSettingsSlice = vi.fn();
const mockUpdateSiteSettingsSlice = vi.fn();
const mockRevalidatePublicLayout = vi.fn();
const mockRevalidateAboutAndHome = vi.fn();

vi.mock('./fetchSettings', () => ({
  getSettingsSlice: (...args: unknown[]) => mockGetSettingsSlice(...args),
}));

vi.mock('../../lib/firestore/collections', () => ({
  updateSiteSettingsSlice: (...args: unknown[]) => mockUpdateSiteSettingsSlice(...args),
}));

vi.mock('../../lib/utils/revalidateSiteCache', () => ({
  revalidatePublicLayout: (...args: unknown[]) => mockRevalidatePublicLayout(...args),
  revalidateAboutAndHome: (...args: unknown[]) => mockRevalidateAboutAndHome(...args),
}));

import { updateSettings } from './updateSettings';

describe('updateSettings — socials slice', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUpdateSiteSettingsSlice.mockResolvedValue(undefined);
  });

  it('replaces socials with an array payload (add/remove links)', async () => {
    mockGetSettingsSlice.mockResolvedValue({
      socials: [{ platform: 'facebook', href: 'https://facebook.com/old' }],
    });

    const nextSocials = [
      { platform: 'instagram', href: 'https://instagram.com/example' },
      { platform: 'x', href: 'https://x.com/example' },
    ];

    const response = await updateSettings({
      request: new Request('http://localhost/api/admin/settings', { method: 'PATCH' }) as never,
      user: { _id: 'admin-1' } as never,
      body: {
        settingsPayload: [{ name: 'socials', value: nextSocials }],
      },
    });

    const json = await response.json();

    expect(mockUpdateSiteSettingsSlice).toHaveBeenCalledWith('settings', 'socials', nextSocials);
    expect(json.data.socials).toEqual(nextSocials);
    expect(mockRevalidatePublicLayout).toHaveBeenCalled();
  });

  it('allows clearing all social links with an empty array', async () => {
    mockGetSettingsSlice.mockResolvedValue({
      socials: [{ platform: 'facebook', href: 'https://facebook.com/old' }],
    });

    const response = await updateSettings({
      request: new Request('http://localhost/api/admin/settings', { method: 'PATCH' }) as never,
      user: { _id: 'admin-1' } as never,
      body: {
        settingsPayload: [{ name: 'socials', value: [] }],
      },
    });

    const json = await response.json();

    expect(mockUpdateSiteSettingsSlice).toHaveBeenCalledWith('settings', 'socials', []);
    expect(json.data.socials).toEqual([]);
  });

  it('rejects non-array socials values', async () => {
    await expect(
      updateSettings({
        request: new Request('http://localhost/api/admin/settings', { method: 'PATCH' }) as never,
        user: { _id: 'admin-1' } as never,
        body: {
          settingsPayload: [{ name: 'socials', value: { platform: 'x' } }],
        },
      })
    ).rejects.toBeInstanceOf(AppError);
  });
});
