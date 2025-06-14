'use client';
import { useAuthUser } from '@/hooks/useAuthUser';
import { useQueryClient } from '@tanstack/react-query';
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
  loginWithGoogle: () => void;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const [isHydrated, setIsHydrated] = useState(false);
  const queryClient = useQueryClient();

  // Move hook call to the top - always call hooks in the same order
  const { user, isLoading } = useAuthUser();
  console.log('Current user:', user);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  const loginWithGoogle = () => {
    // Set flag to track OAuth flow
    sessionStorage.setItem('oauth_in_progress', 'true');

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
    window.location.href = `${apiUrl}/auth/google`;
  };

  const logout = async () => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
      await fetch(`${apiUrl}/auth/logout`, {
        method: 'POST',
        credentials: 'include',
      });

      // Clear React Query cache
      queryClient.invalidateQueries({ queryKey: ['auth-user'] });
      queryClient.clear();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  // During SSR or before hydration, return safe defaults
  if (!isHydrated) {
    return (
      <AuthContext.Provider
        value={{
          user: null,
          isLoading: true,
          loginWithGoogle: () => {},
          logout: async () => {},
        }}
      >
        {children}
      </AuthContext.Provider>
    );
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        loginWithGoogle,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');

  return ctx;
};
