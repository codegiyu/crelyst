'use client';

import { PropsWithChildren } from 'react';
import NextTopLoader from 'nextjs-toploader';
import { NuqsAdapter } from 'nuqs/adapters/next/app';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Toaster } from '@/components/ui/sonner';
import { AuthProvider } from '@/components/auth/AuthProvider';

/** Crelyst primary orange — matches globals.css / #F27B35 */
const PRIMARY_ORANGE = '#F27B35';

export const Providers = ({ children }: PropsWithChildren) => {
  return (
    <NuqsAdapter>
      <NextTopLoader
        color={PRIMARY_ORANGE}
        height={3}
        showSpinner={false}
        shadow={`0 0 10px ${PRIMARY_ORANGE},0 0 4px ${PRIMARY_ORANGE}`}
      />
      <AuthProvider>
        <TooltipProvider delayDuration={700} skipDelayDuration={300}>
          {children}
          <Toaster />
        </TooltipProvider>
      </AuthProvider>
    </NuqsAdapter>
  );
};
