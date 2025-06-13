import { axiosInstance } from '@/lib/axios';
import { useQuery } from '@tanstack/react-query';

export const useAuthUser = () => {
  const {
    data: user,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['auth-user'],
    queryFn: async () => {
      const res = await axiosInstance.get('/auth/me', {
        withCredentials: true,
      });
      return res.data;
    },
  });

  return { user, isLoading, error };
};
