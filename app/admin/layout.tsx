import { AdminAuthWrapper } from '@/components/layout/AdminAuthWrapper';
import { Metadata } from 'next';
import { Suspense } from 'react';
import { AdminAuthLoading } from '@/components/admin/auth/AdminAuthLoading';

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
  return <AdminAuthLoading />;
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="dark min-h-dvh bg-background text-foreground">
      <Suspense fallback={<AdminAuthWrapperFallback />}>
        <AdminAuthWrapper>{children}</AdminAuthWrapper>
      </Suspense>
    </div>
  );
}
