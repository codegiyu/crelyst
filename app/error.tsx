'use client';

import { useEffect } from 'react';
import { Btns404Page } from '@/components/general/Btns404Page';
import { MainLayout } from '@/components/layout/MainLayout';
import { SectionContainer } from '@/components/general/SectionContainer';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Error boundary caught:', error);
  }, [error]);

  return (
    <MainLayout>
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <SectionContainer>
          <div className="text-center grid gap-8 mx-auto max-w-2xl">
            <div className="grid gap-4">
              <h1 className="text-6xl md:text-8xl font-bold text-accent">500</h1>
              <h2 className="text-2xl md:text-3xl font-bold font-heading text-primary">
                Something went wrong!
              </h2>
              <p className="text-lg text-muted-foreground">
                {process.env.NODE_ENV === 'development'
                  ? error.message || 'An unexpected error occurred'
                  : "We're sorry, but something went wrong. Please try again later."}
              </p>
              {error.digest && process.env.NODE_ENV === 'development' && (
                <p className="text-sm text-muted-foreground font-mono">Error ID: {error.digest}</p>
              )}
            </div>

            <div className="flex flex-col md:flex-row gap-4 justify-center items-center">
              <button
                onClick={reset}
                className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium">
                Try Again
              </button>
              <Btns404Page />
            </div>
          </div>
        </SectionContainer>
      </div>
    </MainLayout>
  );
}
