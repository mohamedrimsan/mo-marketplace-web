import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { User, AuthResponse } from '@/types';
import api from '@/lib/api';

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;

  // Actions
  setAuth: (data: AuthResponse) => void;
  logout: () => void;
  fetchMe: () => Promise<void>;
  clearLoading: () => void;
}

// SSR-safe localStorage wrapper for Zustand persist
const safeLocalStorage = {
  getItem: (name: string): string | null => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(name);
  },
  setItem: (name: string, value: string): void => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(name, value);
  },
  removeItem: (name: string): void => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(name);
  },
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isLoading: false,
      isAuthenticated: false,

      setAuth: (data: AuthResponse) => {
        const token = data.access_token;
        safeLocalStorage.setItem('mo_token', token);
        set({
          user: data.user,
          token,
          isAuthenticated: true,
          isLoading: false,
        });
      },

      logout: () => {
        safeLocalStorage.removeItem('mo_token');
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          isLoading: false,
        });
      },

      fetchMe: async () => {
        const token = get().token;
        if (!token) return;
        try {
          set({ isLoading: true });
          const { data } = await api.get<User>('/auth/me');
          set({ user: data, isAuthenticated: true, isLoading: false });
        } catch {
          get().logout();
        }
      },

      clearLoading: () => set({ isLoading: false }),
    }),
    {
      name: 'mo-auth-storage',
      storage: createJSONStorage(() => safeLocalStorage),
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
