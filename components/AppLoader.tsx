'use client';

// import { Skeleton } from '@/components/ui/skeleton';
import { DashboardHeader } from '@/components/layout/DashboardHeader';
import { SkeletonSidebar } from '@/components/layout/SkeletonSidebar';
import { useEffect, type JSX, type PropsWithChildren } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

type AppLoaderProps = {
  message?: string | JSX.Element;
  route?: string;
  options?: {
    replace?: boolean;
  };
};

export function AppLoader({ message, route, options }: AppLoaderProps) {
  const { push, replace } = useRouter();
  // const pathname = usePathname();
  // const isInDashboard = pathname.startsWith('/dashboard');
  // const Wrapper = isInDashboard ? Fragment : GeneralAppLoaderWrapper;

  useEffect(() => {
    if (route) {
      const actionFunc = options?.replace ? replace : push;

      void actionFunc(route);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [route, options?.replace]);

  return (
    <BaseAppLoader>
      {message && <p className="text-sm md:text-base font-medium text-center">{message}</p>}
    </BaseAppLoader>
  );
}

const BaseAppLoader = ({ children }: PropsWithChildren) => {
  return (
    <main className="w-full h-dvh bg-white grid">
      <div className="w-full h-full grid place-items-center gap-5">
        <Loader2 className="size-28 text-primary animate-spin" />
        {children}
      </div>
    </main>
  );
};

export const GeneralAppLoaderWrapper = ({ children }: PropsWithChildren) => {
  return (
    <main className="w-full h-dvh bg-gray-f8 grid grid-rows-[auto_1fr] lg:grid-rows-1 lg:grid-cols-[17rem_1fr] overflow-hidden">
      <DashboardHeader />
      <SkeletonSidebar />
      <section className="main-content overflow-hidden h-full py-6 px-2 lg:pl-0 lg:pr-6">
        <section className="main-content-wrap h-full overflow-hidden dark:bg-charcoal border border-d-10 rounded-[20px]">
          {/* Page specific skeleton content here */}
          {children}
        </section>
      </section>
    </main>
  );
};
