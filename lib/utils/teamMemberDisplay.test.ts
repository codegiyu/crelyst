import { describe, expect, it } from 'vitest';
import type { ClientTeamMember } from '@/lib/constants/endpoints';
import {
  clampTeamMemberSlideIndex,
  getActiveTeamMembersSorted,
  shouldShowTeamMemberNav,
  splitTeamMemberBioParagraphs,
} from './teamMemberDisplay';

function member(id: string, displayOrder: number, isActive = true): ClientTeamMember {
  return {
    _id: id,
    name: `Member ${id}`,
    role: 'Role',
    isActive,
    displayOrder,
    createdAt: '2025-01-01T00:00:00.000Z',
    updatedAt: '2025-01-01T00:00:00.000Z',
  };
}

describe('getActiveTeamMembersSorted', () => {
  it('excludes inactive members and sorts by displayOrder then _id', () => {
    const sorted = getActiveTeamMembersSorted([
      member('b', 2),
      member('a', 1),
      member('c', 1),
      member('inactive', 0, false),
    ]);

    expect(sorted.map(m => m._id)).toEqual(['a', 'c', 'b']);
  });
});

describe('clampTeamMemberSlideIndex', () => {
  it('returns 0 for empty lists or non-finite indexes', () => {
    expect(clampTeamMemberSlideIndex(3, 0)).toBe(0);
    expect(clampTeamMemberSlideIndex(Number.NaN, 4)).toBe(0);
  });

  it('clamps to the valid slide range', () => {
    expect(clampTeamMemberSlideIndex(-1, 3)).toBe(0);
    expect(clampTeamMemberSlideIndex(0, 3)).toBe(0);
    expect(clampTeamMemberSlideIndex(2, 3)).toBe(2);
    expect(clampTeamMemberSlideIndex(9, 3)).toBe(2);
  });
});

describe('shouldShowTeamMemberNav', () => {
  it('returns false for zero or one member', () => {
    expect(shouldShowTeamMemberNav(0)).toBe(false);
    expect(shouldShowTeamMemberNav(1)).toBe(false);
  });

  it('returns true for two or more members', () => {
    expect(shouldShowTeamMemberNav(2)).toBe(true);
  });
});

describe('splitTeamMemberBioParagraphs', () => {
  it('returns an empty list for blank bios', () => {
    expect(splitTeamMemberBioParagraphs('')).toEqual([]);
    expect(splitTeamMemberBioParagraphs('   \n\n  ')).toEqual([]);
  });

  it('splits newline-separated paragraphs and trims each one', () => {
    expect(splitTeamMemberBioParagraphs('First paragraph.\n\nSecond paragraph.\nThird.')).toEqual([
      'First paragraph.',
      'Second paragraph.',
      'Third.',
    ]);
  });
});
