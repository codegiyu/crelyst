import { ContactInfo, OfficeHours } from '@/app/_server/lib/types/constants';
import { FooterContactRowProps } from '@/components/layout/Footer';
import { MapPin, Phone, Mail } from 'lucide-react';

/**
 * Transform contact info from site settings to footer contact cards format
 */
export const transformContactInfoToFooterCards = (
  contactInfo: ContactInfo | undefined
): FooterContactRowProps[] => {
  if (!contactInfo) return [];

  const cards: FooterContactRowProps[] = [];

  // Address
  if (contactInfo.address && contactInfo.address.length > 0) {
    cards.push({
      LucideIcon: MapPin,
      href: contactInfo.locationUrl || undefined,
      texts: contactInfo.address.map(text => ({ text })),
    });
  }

  // Phone
  if (contactInfo.tel && contactInfo.tel.length > 0) {
    cards.push({
      LucideIcon: Phone,
      texts: contactInfo.tel.map(phone => ({
        text: phone,
        link: `tel:${phone.replaceAll(' ', '')}`,
      })),
    });
  }

  // Email
  if (contactInfo.email && contactInfo.email.length > 0) {
    cards.push({
      LucideIcon: Mail,
      texts: contactInfo.email.map(mail => ({
        text: mail,
        link: `mailto:${mail}`,
      })),
    });
  }

  return cards;
};

/**
 * Format office hours from the site settings structure to display format
 */
export const formatOfficeHours = (
  officeHours: OfficeHours | undefined
): { days: string; time: string }[] => {
  if (!officeHours) return [];

  const dayNames: (keyof OfficeHours)[] = [
    'monday',
    'tuesday',
    'wednesday',
    'thursday',
    'friday',
    'saturday',
    'sunday',
  ];

  const dayLabels: Record<keyof OfficeHours, string> = {
    monday: 'Monday',
    tuesday: 'Tuesday',
    wednesday: 'Wednesday',
    thursday: 'Thursday',
    friday: 'Friday',
    saturday: 'Saturday',
    sunday: 'Sunday',
  };

  // Group consecutive days with same hours
  const result: { days: string; time: string }[] = [];
  let currentGroup: {
    startDay: keyof OfficeHours;
    endDay: keyof OfficeHours;
    time: string;
  } | null = null;

  const getTimeString = (day: keyof OfficeHours): string => {
    const hours = officeHours[day];
    if (!hours || !hours.start || !hours.end) return 'Closed';
    return `${hours.start} - ${hours.end}`;
  };

  for (const day of dayNames) {
    const timeStr = getTimeString(day);

    if (!currentGroup) {
      currentGroup = { startDay: day, endDay: day, time: timeStr };
    } else if (currentGroup.time === timeStr) {
      currentGroup.endDay = day;
    } else {
      // Push current group and start new one
      const daysLabel =
        currentGroup.startDay === currentGroup.endDay
          ? dayLabels[currentGroup.startDay]
          : `${dayLabels[currentGroup.startDay]} - ${dayLabels[currentGroup.endDay]}`;
      result.push({ days: daysLabel, time: currentGroup.time });
      currentGroup = { startDay: day, endDay: day, time: timeStr };
    }
  }

  // Push final group
  if (currentGroup) {
    const daysLabel =
      currentGroup.startDay === currentGroup.endDay
        ? dayLabels[currentGroup.startDay]
        : `${dayLabels[currentGroup.startDay]} - ${dayLabels[currentGroup.endDay]}`;
    result.push({ days: daysLabel, time: currentGroup.time });
  }

  return result;
};
