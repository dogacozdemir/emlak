'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore, useIsAdmin, useIsAgent } from '@/store/authStore';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
  requireAgent?: boolean;
}

export default function ProtectedRoute({
  children,
  requireAdmin = false,
  requireAgent = false,
}: ProtectedRouteProps) {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuthStore();
  const isAdmin = useIsAdmin();
  const isAgent = useIsAgent();

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        router.push('/login');
        return;
      }

      if (requireAdmin && !isAdmin) {
        router.push('/');
        return;
      }

      if (requireAgent && !isAgent) {
        router.push('/');
        return;
      }
    }
  }, [isAuthenticated, isLoading, isAdmin, isAgent, requireAdmin, requireAgent, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-neutral-600">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  if (requireAdmin && !isAdmin) {
    return null;
  }

  if (requireAgent && !isAgent) {
    return null;
  }

  return <>{children}</>;
}

