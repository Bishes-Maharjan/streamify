'use client';

import { useAuth } from '@/auth/AuthProvider';
import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function Providers({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user, isLoading } = useAuth();
  const router = useRouter();

  // Define page conditions
  const isAuthPage = ['/login', '/signup'].includes(pathname);
  const isChatPage = pathname?.startsWith('/chat');
  const isOnboardPage = pathname?.startsWith('/onboard');
  const shouldShowSidebar = !isAuthPage && !isChatPage && !isOnboardPage;
  const shouldShowNavbar = !isAuthPage && isOnboardPage;

  // Handle redirects with useEffect instead of direct rendering
  useEffect(() => {
    if (isLoading) return; // Wait for auth to load

    // Redirect logic
    if (!user && !isAuthPage) {
      router.push('/login');
      return;
    }

    if (user && isAuthPage) {
      router.push('/');
      return;
    }

    if (user && !user.isOnBoarded && !isOnboardPage && !isAuthPage) {
      router.push('/onboard');
      return;
    }
  }, [user, isLoading, isAuthPage, isOnboardPage, router]);

  // Show loading during auth check
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="loading loading-spinner loading-lg"></div>
      </div>
    );
  }

  // For auth pages, render without any layout
  if (isAuthPage) {
    return <>{children}</>;
  }

  // Don't render anything if redirecting
  if (!user || (user && !user.isOnBoarded && !isOnboardPage)) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="loading loading-spinner loading-lg"></div>
      </div>
    );
  }

  // Render with sidebar layout
  if (shouldShowSidebar) {
    return (
      <div className="grid grid-cols-[16rem_1fr] grid-rows-[auto_1fr] min-h-screen">
        <div className="row-span-2 border-r border-base-300 bg-base-200">
          <Sidebar />
        </div>
        <div className="col-start-2 row-start-1">
          <Navbar />
        </div>
        <div className="col-start-2 row-start-2 p-4 overflow-auto">
          {children}
        </div>
      </div>
    );
  }

  // Render without sidebar (for chat pages)
  return (
    <div className="flex flex-col min-h-screen">
      {(shouldShowNavbar || isChatPage) && <Navbar />}
      <div className="flex-1 overflow-auto p-4">{children}</div>
    </div>
  );
}
