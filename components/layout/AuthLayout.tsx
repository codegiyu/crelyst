import { ReactNode } from 'react';
import Link from 'next/link';
import { LogoFull } from '../icons';

interface AuthLayoutProps {
  children: ReactNode;
  subtitle?: string;
}

export default function AuthLayout({ children, subtitle = 'Admin Dashboard' }: AuthLayoutProps) {
  return (
    <main className="min-h-screen flex flex-col items-center justify-between bg-background px-4 py-12 sm:px-6 lg:px-8">
      {/* Logo */}
      <div className="w-fit flex flex-col items-center mx-auto">
        <div className="mb-6 flex items-center justify-center">
          <Link
            href="/"
            className="h-8 text-foreground inline-flex items-center"
            title="Back to site">
            <i className="h-12 text-foreground">
              <LogoFull />
            </i>
          </Link>
        </div>
        <h2 className="text-center text-xl font-semibold tracking-tight text-foreground">
          {subtitle}
        </h2>
      </div>

      {/* Content */}
      <div className="w-full max-w-md grid gap-8">{children}</div>

      {/* Footer */}
      <div className="w-full grid gap-8">
        <p className="text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} All rights reserved.
        </p>
      </div>
    </main>
  );
}
