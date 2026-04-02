'use client';

import { useEffect } from 'react';
import { toast } from 'sonner';
import { useAuthStore } from '@/store/authStore';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { logout, fetchMe, token } = useAuthStore();

  // Rehydrate user on app load
  useEffect(() => {
    if (token) {
      fetchMe();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Listen for 401 / token expiry events from the Axios interceptor
  useEffect(() => {
    const handler = () => {
      logout();
      toast.error('Your session has expired. Please log in again.');
      // Use window.location to avoid needing useRouter at the root layout level
      window.location.href = '/login';
    };
    window.addEventListener('mo:auth:expired', handler);
    return () => window.removeEventListener('mo:auth:expired', handler);
  }, [logout]);

  return <>{children}</>;
}
