import { Facebook, Instagram, Linkedin, Tiktok, TwitterX, Whatsapp } from '@/components/icons';
import { SocialPlatform } from '@/app/_server/lib/types/constants';
import { IconComp } from '@/lib/types/general';

/**
 * Maps social platform names to their icon components
 */
export const SOCIAL_ICON_MAP: Record<SocialPlatform, IconComp> = {
  facebook: Facebook,
  instagram: Instagram,
  linkedin: Linkedin,
  twitter: TwitterX,
  x: TwitterX,
  tiktok: Tiktok,
  whatsapp: Whatsapp,
  youtube: Linkedin, // Fallback - you can add a YouTube icon
};

/**
 * Get the icon component for a social platform
 */
export const getSocialIcon = (platform: SocialPlatform): IconComp => {
  return SOCIAL_ICON_MAP[platform] || Facebook;
};

/**
 * Capitalize a social platform name for display
 */
export const formatSocialLabel = (platform: SocialPlatform): string => {
  if (platform === 'x') return 'X';
  return platform.charAt(0).toUpperCase() + platform.slice(1);
};
