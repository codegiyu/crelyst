'use client';

import { PropsWithChildren } from 'react';
import { SidebarProvider } from '@/components/ui/sidebar';
import { AppSidebar } from './Sidebar';
import { DashboardHeader } from './DashboardHeader';

export function DashboardLayout({ children }: PropsWithChildren) {
  return (
    <SidebarProvider className="h-dvh max-h-dvh min-h-0 overflow-hidden">
      <div className="flex h-full min-h-0 w-full bg-background">
        <div className="shrink-0">
          <AppSidebar />
        </div>

        <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
          <DashboardHeader />
          <main className="min-h-0 flex-1 overflow-y-auto overscroll-y-contain p-6">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
