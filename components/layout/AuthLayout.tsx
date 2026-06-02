import { ReactNode } from 'react';
import Link from 'next/link';
import { LogoFull } from '../icons';

interface AuthLayoutProps {
  children: ReactNode;
  subtitle?: string;
}

export default function AuthLayout({ children, subtitle = 'Admin Dashboard' }: AuthLayoutProps) {
  return (
    <main className="relative flex min-h-dvh flex-col items-center justify-center bg-background px-4 py-12 sm:px-6 lg:px-8">
      <div
        className="pointer-events-none absolute inset-0 opacity-60"
        aria-hidden
        style={{
          background:
            'radial-gradient(ellipse 80% 50% at 50% -20%, hsl(20 87% 65% / 0.12), transparent 60%)',
        }}
      />

      <div className="relative z-10 flex w-full max-w-md flex-col items-center gap-10">
        <div className="flex w-full flex-col items-center gap-4 text-center">
          <Link
            href="/"
            className="inline-flex items-center text-foreground transition-opacity hover:opacity-90"
            title="Back to site">
            <LogoFull className="h-10 w-auto sm:h-12" />
          </Link>
          <p className="text-sm text-muted-foreground">{subtitle}</p>
        </div>

        {children}

        <p className="text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} Crelyst. All rights reserved.
        </p>
      </div>
    </main>
  );
}
