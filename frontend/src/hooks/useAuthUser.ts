import { axiosInstance } from '@/lib/axios';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { isAxiosError } from 'axios';
import { useEffect } from 'react';

export const useAuthUser = () => {
  const queryClient = useQueryClient();

  const {
    data: user,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ['auth-user'],
    queryFn: async () => {
      try {
        const res = await axiosInstance.get('/auth/me');

        return res.data;
      } catch (error) {
        console.error('Auth query failed:', error);
        // Return null for unauthenticated users instead of throwing
        return null;
      }
    },
    // Disable query during SSR
    enabled: typeof window !== 'undefined',
    // Don't retry on auth failures
    retry: (failureCount, error) => {
      // Don't retry on 401/403 errors (auth failures)
      if (isAxiosError(error))
        if (
          error?.response?.status === 401 ||
          error?.response?.status === 403
        ) {
          return false;
        }
      // Retry up to 2 times for other errors
      return failureCount < 2;
    },
    // Handle network errors gracefully
    retryOnMount: false,
    refetchOnWindowFocus: false,
    // Add a stale time to prevent unnecessary refetches
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Handle OAuth redirect
  useEffect(() => {
    const handleOAuthRedirect = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const oauthSuccess = urlParams.get('oauth_success');
      const hasError = urlParams.get('error');
      const oauthInProgress = sessionStorage.getItem('oauth_in_progress');

      if (oauthSuccess === 'true' || oauthInProgress) {
        console.log('OAuth redirect detected, refetching user data...');

        // Clear the session storage flag
        sessionStorage.removeItem('oauth_in_progress');

        // Clear URL parameters
        if (oauthSuccess) {
          window.history.replaceState(
            {},
            document.title,
            window.location.pathname
          );
        }

        if (hasError) {
          console.error('OAuth error:', hasError);
          return;
        }

        // Invalidate and refetch auth data
        queryClient.invalidateQueries({ queryKey: ['auth-user'] });

        // Add a delay to ensure cookie is properly set
        setTimeout(() => {
          refetch();
        }, 1000);
      }
    };

    // Only run on client side
    if (typeof window !== 'undefined') {
      handleOAuthRedirect();
    }
  }, [queryClient, refetch]);

  // Also check when page becomes visible (handles tab switching during OAuth)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden && sessionStorage.getItem('oauth_in_progress')) {
        console.log('Page visible after OAuth, rechecking auth...');
        sessionStorage.removeItem('oauth_in_progress');
        queryClient.invalidateQueries({ queryKey: ['auth-user'] });
        setTimeout(() => refetch(), 1000);
      }
    };

    if (typeof window !== 'undefined') {
      document.addEventListener('visibilitychange', handleVisibilityChange);
      return () =>
        document.removeEventListener(
          'visibilitychange',
          handleVisibilityChange
        );
    }
  }, [queryClient, refetch]);

  return { user, isLoading };
};
