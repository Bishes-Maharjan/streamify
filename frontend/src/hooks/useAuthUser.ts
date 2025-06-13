import { axiosInstance } from '@/lib/axios';
import { useQuery } from '@tanstack/react-query';

export const useAuthUser = () => {
  const { data: user, isLoading } = useQuery({
    queryKey: ['auth-user'],
    queryFn: async () => {
      const res = await axiosInstance.get('/auth/me', {
        withCredentials: true,
      });
      return res.data;
    },
    // Disable query during SSR
    enabled: typeof window !== 'undefined',
    // Don't retry during build
    retry: false,
    // Handle network errors gracefully
    retryOnMount: false,
    refetchOnWindowFocus: false,
  });

  return { user, isLoading };
};
