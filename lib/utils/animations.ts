/**
 * Calculates animation delay for staggered animations
 * @param index - The index of the item (0-based)
 * @param multiplier - Delay multiplier in seconds (default: 0.1)
 * @returns CSS animation-delay string (e.g., "0.2s")
 */
export function getAnimationDelay(index: number, multiplier: number = 0.1): string {
  return `${index * multiplier}s`;
}

/**
 * Generates inline style object for animation delay
 * @param index - The index of the item (0-based)
 * @param multiplier - Delay multiplier in seconds (default: 0.1)
 * @returns Style object with animationDelay property
 */
export function getAnimationDelayStyle(
  index: number,
  multiplier: number = 0.1
): { style: { animationDelay: string } } {
  return {
    style: { animationDelay: getAnimationDelay(index, multiplier) },
  };
}
