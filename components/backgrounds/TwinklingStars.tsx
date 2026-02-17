'use client';

import { useMemo } from 'react';

interface TwinklingStarsProps {
  /** Number of stars to render */
  count?: number;
  /** Base color of the stars (e.g. #ffffff, #f5f5f5) */
  starColor?: string;
  /** Twinkle speed: 'slow' | 'medium' | 'fast' */
  speed?: 'slow' | 'medium' | 'fast';
  /** Size range: 'small' | 'medium' | 'mixed' */
  size?: 'small' | 'medium' | 'mixed';
  className?: string;
}

const DURATION = {
  slow: [3, 4, 5],
  medium: [2, 3, 4],
  fast: [1.5, 2, 2.5],
} as const;

type StarSpeed = keyof typeof DURATION;
type StarSize = 'small' | 'medium' | 'mixed';

interface StarConfig {
  id: number;
  left: string;
  top: string;
  duration: number;
  delay: number;
  size: number;
}

function generateStars(count: number, speed: StarSpeed, size: StarSize): StarConfig[] {
  return Array.from({ length: count }, (_, i) => {
    const durations = DURATION[speed];
    const duration = durations[i % durations.length];
    const delay = Math.random() * 2;
    const sizePx = size === 'small' ? 1 : size === 'medium' ? 3 : i % 5 === 0 ? 3 : 1;
    return {
      id: i,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      duration,
      delay,
      size: sizePx,
    };
  });
}

export const TwinklingStars = ({
  count = 60,
  starColor = 'rgba(255, 255, 255, 0.9)',
  speed = 'medium',
  size = 'mixed',
  className = '',
}: TwinklingStarsProps) => {
  const stars = useMemo(() => generateStars(count, speed, size), [count, speed, size]);

  return (
    <div
      className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}
      aria-hidden>
      {stars.map(star => (
        <div
          key={star.id}
          className="absolute rounded-full animate-star-twinkle"
          style={{
            left: star.left,
            top: star.top,
            width: star.size,
            height: star.size,
            backgroundColor: starColor,
            ['--twinkle-duration' as string]: `${star.duration}s`,
            ['--twinkle-delay' as string]: `${star.delay}s`,
          }}
        />
      ))}
    </div>
  );
};
