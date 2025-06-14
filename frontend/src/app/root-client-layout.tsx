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

  // Define page conditions
  const isAuthPage = ['/login', '/signup'].includes(pathname);
  const isChatPage = pathname?.startsWith('/chat');
  const isOnboardPage = pathname?.startsWith('/onboard');
  const isHomePage = pathname === '/';

  // Define public routes that don't require authentication
  const publicRoutes = ['/login', '/signup', '/about', '/contact', '/pricing'];
  const isPublicRoute = publicRoutes.includes(pathname);

  const shouldShowSidebar = !isAuthPage && !isChatPage && !isOnboardPage;
  const shouldShowNavbar = !isAuthPage && !isOnboardPage; // Don't show navbar on onboarding

  // Show loading state while auth is being determined
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  // For auth pages when user is not authenticated - allow access
  if (isAuthPage && !user) {
    return <>{children}</>;
  }

  // If user is authenticated but on auth pages - redirect to home
  if (user && isAuthPage) {
    return <HomePage />;
  }

  // If user is authenticated but not onboarded, and not on auth pages
  if (user && user.isOnBoarded === false && !isAuthPage && !isOnboardPage) {
    return <OnboardingPage />;
  }

  // For public routes, allow access regardless of auth status
  if (isPublicRoute) {
    return <>{children}</>;
  }

  // For protected routes, redirect to login if not authenticated
  // BUT only for known app routes, let unknown routes fall through to not-found
  const knownProtectedRoutes = ['/dashboard', '/profile', '/settings', '/chat'];
  const isKnownProtectedRoute =
    knownProtectedRoutes.some((route) => pathname.startsWith(route)) ||
    isHomePage;

  if (!user && isKnownProtectedRoute) {
    return <LoginPage />;
  }

  // For unknown routes, let them pass through so not-found.tsx can handle them
  if (!user && !isKnownProtectedRoute) {
    return <>{children}</>;
  }

  // Render with sidebar layout for authenticated users on appropriate pages
  if (shouldShowSidebar && user) {
    return (
      <div className="flex h-screen bg-gray-50">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Navbar />
          <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50">
            {children}
          </main>
        </div>
      </div>
    );
  }

  // Render without sidebar (for chat pages and onboarding)
  return (
    <div className="min-h-screen bg-gray-50">
      {shouldShowNavbar && <Navbar />}
      <div className={shouldShowNavbar ? 'pt-16' : ''}>{children}</div>
    </div>
  );
}
