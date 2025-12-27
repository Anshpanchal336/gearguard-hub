import { ReactNode } from 'react';
import { DashboardSidebar } from './DashboardSidebar';

interface DashboardLayoutProps {
  children: ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="flex min-h-screen w-full bg-background">
      <DashboardSidebar />
      <main className="flex-1 overflow-auto">
        <div className="container max-w-7xl py-6 px-6 md:px-8">
          {children}
        </div>
      </main>
    </div>
  );
}
