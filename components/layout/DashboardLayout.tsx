'use client';

import { PropsWithChildren } from 'react';
import { SidebarProvider } from '@/components/ui/sidebar';
import { AppSidebar } from './Sidebar';
import { DashboardHeader } from './DashboardHeader';

export function DashboardLayout({ children }: PropsWithChildren) {
  return (
    <SidebarProvider>
      <div className="min-h-screen w-full bg-background flex">
        <AppSidebar />

        <div className="flex-1 flex flex-col">
          {/* Top header */}
          <DashboardHeader />

          {/* Main content */}
          <main className="flex-1 p-6">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
}
