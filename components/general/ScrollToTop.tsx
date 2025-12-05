'use client';

import { ComponentPropsWithRef, MouseEvent, useEffect, useState } from 'react';
import { ChevronUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import { RegularBtn } from '../atoms/RegularBtn';

export interface ScrollToTopProps extends Omit<ComponentPropsWithRef<'button'>, 'children'> {
  triggerOffset?: number;
  wrapClassName?: string;
}

export const ScrollToTop = ({
  triggerOffset = 250,
  className,
  wrapClassName,
  onClick,
  ...props
}: ScrollToTopProps) => {
  const [isVisible, setIsVisible] = useState(false);

  const handleClick = (e?: MouseEvent<HTMLButtonElement>) => {
    scrollTo({ top: 0, left: 0, behavior: 'smooth' });
    if (e && onClick) onClick(e);
  };

  useEffect(() => {
    const handlePageOffset = () => {
      const { scrollY, innerHeight } = window;
      setIsVisible(scrollY > (triggerOffset ?? innerHeight));
    };

    handlePageOffset();
    window.addEventListener('scroll', handlePageOffset);

    return () => window.removeEventListener('scroll', handlePageOffset);
  }, [triggerOffset]);

  return (
    <RegularBtn
      className={cn(
        'w-8 md:w-16 aspect-[0.9] rounded-[10px] grid place-items-center \
        transition-all duration-500 ease-out',
        className
      )}
      wrapClassName={cn(
        'fixed bottom-10 right-5 md:right-10 z-[20] transition-all duration-500 ease-out',
        `${isVisible ? 'scale-100 hover:scale-105' : 'scale-0'}`,
        wrapClassName
      )}
      onClick={handleClick}
      {...props}>
      <ChevronUp className="text-white size-6 md:size-8 group-hover:scale-125 transition-all duration-500 ease-in" />
    </RegularBtn>
  );
};
