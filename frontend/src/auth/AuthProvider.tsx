'use client';
import { useAuthUser } from '@/hooks/useAuthUser';
import { createContext, useContext, useEffect, useState } from 'react';

type User = {
  fullName: string;
  bio: string;
  nativeLanguage: string;
  learningLanguage: string;
  image: string;
  location: string;
  isOnBoarded: boolean;
  _id: string;
} | null;

type AuthContextType = {
  user: User;
  isLoading: boolean;
};

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  // During SSR or before hydration, return safe defaults
  if (!isHydrated) {
    return (
      <AuthContext.Provider value={{ user: null, isLoading: true }}>
        {children}
      </AuthContext.Provider>
    );
  }

  const { user, isLoading } = useAuthUser();

  return (
    <AuthContext.Provider value={{ user, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');

  return ctx;
};
