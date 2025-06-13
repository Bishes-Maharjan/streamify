'use client';
import { create } from 'zustand';

interface ThemeStore {
  theme: string;
  setTheme: (theme: string) => void;
  initializeTheme: () => void;
}

export const useThemeStore = create<ThemeStore>((set) => ({
  theme: 'coffee', // default theme
  setTheme: (theme: string) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('streamify-theme', theme);
      document.documentElement.setAttribute('data-theme', theme);
    }
    set({ theme });
  },
  initializeTheme: () => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('streamify-theme') || 'coffee';
      document.documentElement.setAttribute('data-theme', savedTheme);
      set({ theme: savedTheme });
    }
  },
}));
