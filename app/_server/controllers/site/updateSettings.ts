/* eslint-disable @typescript-eslint/no-explicit-any */
import { z } from 'zod';
import { AppError } from '../../lib/utils/appError';
import { getSettingsSlice, Portion } from './fetchSettings';
import { updateSiteSettingsSlice } from '../../lib/firestore/collections';
import { sendResponse } from '../../lib/utils/appResponse';
import type { RouteHandler } from '../../lib/api/routeHandler';
import { validateBody } from '../../lib/api/validateBody';
import {
  revalidatePublicLayout,
  revalidateAboutAndHome,
} from '../../lib/utils/revalidateSiteCache';

const updateSettingsBodySchema = z.object({
  settingsPayload: z.array(
    z.object({
      name: z.string().min(1, 'Setting slice name is required'),
      // Most slices are objects; `socials` is an array of { platform, href }.
      value: z.union([
        z.record(z.string(), z.unknown(), { error: 'Setting value must be a valid object' }),
        z.array(z.unknown()),
      ]),
    })
  ),
});

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

export const updateSettings: RouteHandler = async ({ body, user }) => {
  if (!user || !(user as { _id?: string })._id) throw new AppError('Unauthorized', 401);

  const payload = validateBody(updateSettingsBodySchema, body);

  const updatedSettings: { [key: string]: any } = {};

  for (const setting of payload.settingsPayload) {
    if (!setting.name || setting.value === undefined || setting.value === null) {
      throw new AppError('name and value are required', 400);
    }

    const validSlices: Portion[] = [
      'appDetails',
      'seo',
      'legal',
      'email',
      'features',
      'analytics',
      'localization',
      'branding',
      'projectWorkflow',
      'aboutPage',
      'contactInfo',
      'socials',
    ];
    if (!validSlices.includes(setting.name as Portion)) {
      throw new AppError(`Invalid slice name. Must be one of: ${validSlices.join(', ')}`, 400);
    }

    // Socials is a full-replace array slice (add/remove links changes length).
    if (setting.name === 'socials') {
      if (!Array.isArray(setting.value)) {
        throw new AppError('socials value must be an array', 400);
      }

      await updateSiteSettingsSlice('settings', setting.name, setting.value);
      updatedSettings[setting.name] = setting.value;
      continue;
    }

    if (!setting.value || Array.isArray(setting.value)) {
      throw new AppError('Setting value must be a valid object', 400);
    }

    const currentSettings = await getSettingsSlice(setting.name as Portion);
    const currentSliceData = currentSettings ? (currentSettings as any)[setting.name] : undefined;

    if (
      setting.name === 'contactInfo' ||
      setting.name === 'projectWorkflow' ||
      setting.name === 'aboutPage'
    ) {
      const mergedValue = { ...(currentSliceData || {}), ...setting.value };

      if (setting.name === 'aboutPage') {
        const { aboutPageContentSchema } = await import('./aboutPageSchema');
        const parsed = aboutPageContentSchema.safeParse(mergedValue);
        if (!parsed.success) {
          throw new AppError('Invalid about page content', 400);
        }
        await updateSiteSettingsSlice('settings', setting.name, parsed.data);
        updatedSettings[setting.name] = parsed.data;
        continue;
      }

      await updateSiteSettingsSlice('settings', setting.name, mergedValue);
      updatedSettings[setting.name] = mergedValue;
      continue;
    }

    if (!currentSettings) throw new AppError('Current setting not found', 404);

    const currentKeysSet = new Set(getAllKeys(currentSliceData));
    const payloadKeysSet = new Set(getAllKeys(setting.value));

    if (
      currentKeysSet.size !== payloadKeysSet.size ||
      ![...currentKeysSet].every(key => payloadKeysSet.has(key))
    ) {
      throw new AppError('Payload does not match current settings structure', 400);
    }

    await updateSiteSettingsSlice('settings', setting.name, setting.value);
    updatedSettings[setting.name] = setting.value;
  }

  revalidatePublicLayout();

  if (updatedSettings.aboutPage) {
    revalidateAboutAndHome();
  }

  return sendResponse(200, updatedSettings, 'Settings updated successfully');
};
