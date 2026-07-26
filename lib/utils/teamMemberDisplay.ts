import type { ClientTeamMember } from '@/lib/constants/endpoints';

export function getActiveTeamMembersSorted(members: ClientTeamMember[]): ClientTeamMember[] {
  return [...members]
    .filter(member => member.isActive)
    .sort((a, b) => {
      const orderDiff = (a.displayOrder ?? 0) - (b.displayOrder ?? 0);
      if (orderDiff !== 0) return orderDiff;

      return a._id.localeCompare(b._id);
    });
}

export function clampTeamMemberSlideIndex(index: number, count: number): number {
  if (count <= 0 || !Number.isFinite(index)) return 0;

  return Math.min(Math.max(Math.trunc(index), 0), count - 1);
}

export function shouldShowTeamMemberNav(count: number): boolean {
  return count > 1;
}

export function splitTeamMemberBioParagraphs(bio: string): string[] {
  return bio
    .replace(/\r\n/g, '\n')
    .split(/\n+/)
    .map(paragraph => paragraph.trim())
    .filter(Boolean);
}
