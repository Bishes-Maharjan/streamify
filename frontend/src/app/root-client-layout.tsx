'use client';

import { useAuth } from '@/auth/AuthProvider';
import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';
import { usePathname } from 'next/navigation';
import LoginPage from './login/page';
import OnboardingPage from './onboard/page';
import HomePage from './page';

export default function Providers({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user, isLoading } = useAuth();
  // const router = useRouter();
  // Define page conditions
  const isAuthPage = ['/login', '/signup'].includes(pathname);
  const isChatPage = pathname?.startsWith('/chat');
  const isOnboardPage = pathname?.startsWith('/onboard');
  const shouldShowSidebar = !isAuthPage && !isChatPage && !isOnboardPage;
  const shouldShowNavbar = !isAuthPage && isOnboardPage;

  // For auth pages, render without any layout
  if (isAuthPage && !user) {
    return <>{children}</>;
  }
  if (!user && !isAuthPage) {
    return <LoginPage />;
  }
  if (user && isAuthPage) {
    return <HomePage />;
  }
  if (user && !user.isOnBoarded && !isAuthPage) {
    return <OnboardingPage />;
  }

  // Render with sidebar layout
  if (shouldShowSidebar && user && !isLoading) {
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
