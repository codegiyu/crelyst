import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Maintenance',
  robots: { index: false, follow: false },
};

export default function MaintenancePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background px-6 text-center">
      <p className="mb-3 text-xs font-medium uppercase tracking-[0.28em] text-primary">Crelyst</p>
      <h1 className="font-heading text-3xl font-bold text-foreground md:text-4xl">
        We&apos;ll be back shortly
      </h1>
      <p className="mt-4 max-w-md text-muted-foreground">
        Our site is undergoing scheduled maintenance. Please check back soon.
      </p>
    </main>
  );
}
