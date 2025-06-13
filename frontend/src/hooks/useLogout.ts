import { axiosInstance } from '@/lib/axios';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

export const useLogout = () => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { mutate: logout, isPending } = useMutation({
    mutationFn: async () => {
      const res = await axiosInstance.post('auth/logout');

      return res.data;
    },
    onSuccess: () => {
      queryClient.setQueryData(['auth-user'], null);
      setTimeout(() => {
        router.push('/login');
      }, 1000);
    },
  });

  return { logout, isPending };
};
