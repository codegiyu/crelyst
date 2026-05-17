import { describe, expect, it } from 'vitest';
import { shouldRevealMotion } from './motionReveal';

describe('shouldRevealMotion', () => {
  it('reveals when site is not loading', () => {
    expect(shouldRevealMotion(false)).toBe(true);
  });

  it('stays hidden while site is loading unless immediate', () => {
    expect(shouldRevealMotion(true)).toBe(false);
    expect(shouldRevealMotion(true, true)).toBe(true);
  });
});
