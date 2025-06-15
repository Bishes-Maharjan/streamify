'use client';
import PageLoader from '@/components/PageLoader';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

function Page() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  useEffect(() => {
    setIsLoading(true);
    const token = new URLSearchParams(window.location.search).get('token');
    if (token) {
      fetch('/api/set-cookie', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token }),
      })
        .then(() => {
          router.push('/');
        })
        .catch(() => {
          toast.error('Something went wrong. Try again later');
        });
      setIsLoading(true);
    }
  });
  if (isLoading) return <PageLoader />;
  return <div></div>;
}

export default Page;
