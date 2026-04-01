import type { ClientSiteSettings } from '@/lib/constants/endpoints';

export type PublicFooterSettings = Partial<
  Pick<ClientSiteSettings, 'contactInfo' | 'socials' | 'appDetails'>
>;
