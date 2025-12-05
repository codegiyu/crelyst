'use client';

import { useRouter } from 'next/navigation';

let routerRef: ReturnType<typeof useRouter> | null = null;

export const setRouter = (r: typeof routerRef) => {
  routerRef = r;
};

export const getRouter = () => routerRef;
