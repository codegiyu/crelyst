import { useSyncExternalStore } from 'react';

const MOBILE_BREAKPOINT = 768;

function subscribe(query: string, onChange: () => void) {
  const mql = window.matchMedia(query);
  mql.addEventListener('change', onChange);
  return () => mql.removeEventListener('change', onChange);
}

function getSnapshot(query: string, breakpoint: number) {
  return () => window.innerWidth < breakpoint;
}

function getServerSnapshot() {
  return false;
}

export function useIsMobile(width?: number) {
  const breakpoint = width ?? MOBILE_BREAKPOINT;
  const query = `(max-width: ${breakpoint - 1}px)`;

  return useSyncExternalStore(
    onChange => subscribe(query, onChange),
    getSnapshot(query, breakpoint),
    getServerSnapshot
  );
}
