/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useMemo, useState } from 'react';

const MOBILE_BREAKPOINT = 768;

export function useIsMobile(width?: number) {
  const queryString = useMemo(() => `(max-width: ${width ?? MOBILE_BREAKPOINT - 1}px)`, [width]);
  const [isMobile, setIsMobile] = useState<boolean | undefined>(undefined);

  useEffect(() => {
    const mql = window.matchMedia(queryString);
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    };
    mql.addEventListener('change', onChange);
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    return () => mql.removeEventListener('change', onChange);
  }, [queryString]);

  return !!isMobile;
}
