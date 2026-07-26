import { cookies, headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { buildAdminLoginUrl } from '@/lib/auth/adminRoutePaths';
import { resolveConsoleAdminFromToken } from '@/lib/middleware/auth';

export default async function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const token = cookieStore.get('authToken')?.value;
  const headersList = await headers();
  const pathname = headersList.get('x-pathname') ?? '/admin/dashboard/home';

  if (!token) {
    redirect(buildAdminLoginUrl(pathname));
  }

  const resolved = await resolveConsoleAdminFromToken(token);
  if (resolved.status !== 'ok') {
    redirect(buildAdminLoginUrl(pathname));
  }

  return <DashboardLayout>{children}</DashboardLayout>;
}
