'use client';

import { useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const { fetchUser, accessToken } = useAuthStore();

  useEffect(() => {
    // Fetch user on mount if token exists
    if (accessToken) {
      fetchUser();
    }
  }, [accessToken, fetchUser]);

  return <>{children}</>;
}

