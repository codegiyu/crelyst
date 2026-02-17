/* eslint-disable react-hooks/exhaustive-deps */
'use client';

import { useEffect, useState } from 'react';

export type UseTypewriterOptions = {
  /** Ms per character when typing or untyping */
  speed?: number;
  /** Target length (0 to fullText.length). Typing when increasing, untyping when decreasing. */
  targetLength: number;
  /** Called once when displayed length reaches targetLength */
  onReachTarget?: () => void;
};

/**
 * Typewriter effect: animates displayed text toward targetLength character by character.
 * Use for both typing (targetLength increasing) and untyping (targetLength decreasing).
 */
export function useTypewriter(
  fullText: string,
  { speed = 80, targetLength, onReachTarget }: UseTypewriterOptions
) {
  const [displayedLength, setDisplayedLength] = useState(0);
  const displayedText = fullText.slice(0, displayedLength);
  const hasReachedTarget = displayedLength === targetLength;

  useEffect(() => {
    // Only animate when not already at target (avoids calling onReachTarget when e.g. phase is 'fly' and length is 0)
    if (displayedLength === targetLength) {
      return undefined;
    }

    const step = targetLength > displayedLength ? 1 : -1;
    const id = window.setInterval(() => {
      setDisplayedLength(prev => {
        const next = Math.max(0, Math.min(fullText.length, prev + step));
        if (next === targetLength) {
          window.clearInterval(id);
          onReachTarget?.();
        }
        return next;
      });
    }, speed);

    return () => window.clearInterval(id);
  }, [targetLength, fullText.length, speed]);

  return { displayedText, hasReachedTarget };
}
