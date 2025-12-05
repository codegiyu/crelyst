/* eslint-disable @typescript-eslint/no-explicit-any */
import { ACCESS_TYPES, ISiteSettings } from '../../lib/types/constants';
import { AppError } from '../../lib/utils/appError';
import { sendResponse } from '../../lib/utils/appResponse';
import { catchAsync } from '../../middlewares/catchAsync';
import { SENSITIVE_SETTINGS_SLICES, SiteSettings } from '../../models/siteSettings';
import { RequestContext, withRequestContext } from '../../lib/context/withRequestContext';

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
  withSensitiveFields: boolean = true
): Promise<I> => {
  const settings = await SiteSettings.findOne({
    name: 'settings',
  })
    .select(slice === 'all' ? '' : slice)
    .lean<ISiteSettings | null>();

  if (!settings) return null;

  if (!withSensitiveFields && SENSITIVE_SETTINGS_SLICES.length > 0) {
    for (const field of SENSITIVE_SETTINGS_SLICES) {
      delete (settings as any)[field];
    }
  }

  if (slice !== 'all' && !(settings as any)[slice]) return null;

  const realSettings = (settings as any)[slice as Exclude<Portion, 'all'>];

  return slice === 'all' ? settings : { [slice]: realSettings };
};

export const fetchSettings = (accessType: ACCESS_TYPES = 'client') =>
  withRequestContext({ protect: false, accessType })(
    catchAsync(async context => {
      const ctx = context as RequestContext;
      // Extract slice from URL path
      const url = new URL(ctx.req.url);
      const pathParts = url.pathname.split('/').filter(Boolean);
      const sliceIndex = pathParts.indexOf('site-settings');
      const slice = (pathParts[sliceIndex + 1] || 'all') as Portion;

      // Validate slice
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
    })
  );
