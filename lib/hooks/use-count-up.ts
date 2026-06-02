'use client';

import { animate, useInView, useMotionValue, useReducedMotion, useTransform } from 'motion/react';
import { useEffect, useRef, useState } from 'react';

export type UseCountUpOptions = {
  end: number;
  duration?: number;
  delay?: number;
  disabled?: boolean;
};

export function useCountUp({ end, duration = 2, delay = 0, disabled = false }: UseCountUpOptions) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-40px' });
  const prefersReducedMotion = useReducedMotion() ?? false;
  const count = useMotionValue(disabled ? end : 0);
  const display = useTransform(count, value => Math.round(value));
  const [animationDone, setAnimationDone] = useState(false);
  const isComplete = disabled || prefersReducedMotion || animationDone;

  useEffect(() => {
    if (disabled || prefersReducedMotion) {
      count.set(end);
      return;
    }

    if (!isInView) {
      return;
    }

    count.set(0);

    const controls = animate(count, end, {
      duration,
      delay,
      ease: [0.22, 1, 0.36, 1],
      onComplete: () => setAnimationDone(true),
    });

    return () => controls.stop();
  }, [count, disabled, isInView, end, duration, delay, prefersReducedMotion]);

  return { ref, display, isComplete };
}
