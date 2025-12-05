import { AdminAuthWrapper } from '@/components/layout/AdminAuthWrapper';
import { Metadata } from 'next';
import { Suspense } from 'react';
import { Loader2 } from 'lucide-react';

export const metadata: Metadata = {
  title: {
    default: 'Admin Dashboard',
    template: '%s | Admin',
  },
  description: 'Admin dashboard for site management',
  robots: {
    index: false,
    follow: false,
  },
};

function AdminAuthWrapperFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground">Loading...</p>
      </div>
    </div>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<AdminAuthWrapperFallback />}>
      <AdminAuthWrapper>{children}</AdminAuthWrapper>
    </Suspense>
  );
}
