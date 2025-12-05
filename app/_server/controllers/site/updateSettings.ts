/* eslint-disable @typescript-eslint/no-explicit-any */

import { AppError } from '../../lib/utils/appError';
import { catchAsync } from '../../middlewares/catchAsync';
import { getSettingsSlice, Portion } from './fetchSettings';
import { SiteSettings } from '../../models/siteSettings';
import { sendResponse } from '../../lib/utils/appResponse';
import { RequestContext, withRequestContext } from '../../lib/context/withRequestContext';

// intentionally using a stack to avoid being attacked by a large object
// that could cause a stack overflow that can crash the server
function getAllKeys(obj: any): string[] {
  const keys: string[] = [];
  const stack: { obj: any; prefix: string }[] = [{ obj, prefix: '' }];

  while (stack.length > 0) {
    const { obj, prefix } = stack.pop()!;
    for (const key of Object.keys(obj)) {
      const fullKey = prefix ? `${prefix}.${key}` : key;
      if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
        stack.push({ obj: obj[key], prefix: fullKey });
      } else {
        keys.push(fullKey);
      }
    }
  }

  return keys;
}

export const updateSettings = withRequestContext({ protect: true, accessType: 'console' })(
  catchAsync(async context => {
    const ctx = context as RequestContext;
    const { settingsPayload } = ctx.body;

    if (!ctx.user || !ctx.user._id) throw new AppError('Unauthorized', 401);

    if (!settingsPayload) throw new AppError('Payload is required', 400);

    if (!Array.isArray(settingsPayload))
      throw new AppError('Payload must be an array of objects', 400);

    const updatedSettings: { [key: string]: any } = {};

    // Process each setting update in the payload
    for (const setting of settingsPayload) {
      if (!setting.name || !setting.value) throw new AppError('name and value are required', 400);

      // Validate slice name
      const validSlices: Portion[] = [
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
      if (!validSlices.includes(setting.name as Portion)) {
        throw new AppError(`Invalid slice name. Must be one of: ${validSlices.join(', ')}`, 400);
      }

      // Fetch the current settings to compare with the payload
      const currentSettings = await getSettingsSlice(setting.name as Portion);

      if (!currentSettings) throw new AppError('Current setting not found', 404);

      // Flatten the keys of the current settings and compare with the keys of the payload
      const currentSliceData = (currentSettings as any)[setting.name];
      const currentKeysSet = new Set(getAllKeys(currentSliceData));
      const payloadKeysSet = new Set(getAllKeys(setting.value));

      if (
        currentKeysSet.size !== payloadKeysSet.size ||
        ![...currentKeysSet].every(key => payloadKeysSet.has(key))
      ) {
        throw new AppError('Payload does not match current settings structure', 400);
      }

      const settingsName = setting.name;

      // Update the setting in the database
      const update = await SiteSettings.findOneAndUpdate(
        { name: 'settings' },
        { [`${settingsName}`]: setting.value },
        { new: true }
      ).lean();

      if (!update) throw new AppError('Setting not updated', 500);

      updatedSettings[settingsName] = (update as any)[settingsName];
    }

    // Clean up the response object
    delete updatedSettings?._id;
    delete updatedSettings?.__v;
    delete updatedSettings?.name;
    delete updatedSettings?.createdAt;
    delete updatedSettings?.updatedAt;

    return sendResponse(200, updatedSettings, 'Settings updated successfully');
  })
);
