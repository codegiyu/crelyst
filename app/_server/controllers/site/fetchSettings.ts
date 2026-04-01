import { ACCESS_TYPES, ISiteSettings } from '../../lib/types/constants';
import { AppError } from '../../lib/utils/appError';
import { sendResponse } from '../../lib/utils/appResponse';
import { getSiteSettings, getSiteSettingsSlice } from '../../lib/firestore/collections';
import type { RouteHandler } from '../../lib/api/routeHandler';

export type Portion =
  | 'all'
  | 'appDetails'
  | 'seo'
  | 'legal'
  | 'email'
  | 'features'
  | 'analytics'
  | 'localization'
  | 'branding'
  | 'contactInfo'
  | 'socials';

type I = ISiteSettings | Partial<ISiteSettings> | null;

export const getSettingsSlice = async (
  slice: Portion,
  _withSensitiveFields: boolean = true
): Promise<I> => {
  if (slice === 'all') {
    const settings = await getSiteSettings('settings');
    if (!settings) return null;
    return settings as I;
  }

  const value = await getSiteSettingsSlice('settings', slice);
  if (value === null || value === undefined) return null;
  return { [slice]: value } as I;
};

export const fetchSettings =
  (accessType: ACCESS_TYPES = 'client'): RouteHandler =>
  async ({ request }) => {
    const url = new URL(request.url);
    const pathParts = url.pathname.split('/').filter(Boolean);
    const sliceIndex = pathParts.indexOf('site-settings');
    const slice = (pathParts[sliceIndex + 1] || 'all') as Portion;

    const validSlices: Portion[] = [
      'all',
      'appDetails',
      'seo',
      'legal',
      'email',
      'features',
      'analytics',
      'localization',
      'branding',
      'contactInfo',
      'socials',
    ];
    if (!validSlices.includes(slice)) {
      throw new AppError(`Invalid slice. Must be one of: ${validSlices.join(', ')}`, 400);
    }

    const settings = await getSettingsSlice(slice, accessType === 'console');

    if (!settings) throw new AppError('Settings not found', 404);

    return sendResponse(200, settings, 'Settings fetched successfully');
  };
