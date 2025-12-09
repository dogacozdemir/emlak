'use client';

import Link from 'next/link';
import { useAuthStore, useIsAdmin, useIsAgent } from '@/store/authStore';

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuthStore();
  const isAdmin = useIsAdmin();
  const isAgent = useIsAgent();

  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm shadow-soft border-b border-neutral-200">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          <Link href="/" className="text-2xl font-heading font-bold text-primary-700 hover:text-primary-800 transition-colors">
            KKTC Emlak
          </Link>

          <div className="flex items-center gap-8">
            <Link
              href="/properties"
              className="text-neutral-700 hover:text-primary-700 transition-colors font-medium"
            >
              Properties
            </Link>

            {isAuthenticated ? (
              <>
                {isAdmin && (
                  <>
                    <Link
                      href="/admin"
                      className="text-neutral-700 hover:text-primary-700 transition-colors"
                    >
                      Admin Panel
                    </Link>
                    <Link
                      href="/admin/bookings"
                      className="text-neutral-700 hover:text-primary-700 transition-colors"
                    >
                      Bookings
                    </Link>
                  </>
                )}
                {isAgent && (
                  <Link
                    href="/admin/properties/new"
                    className="text-neutral-700 hover:text-primary-700 transition-colors"
                  >
                    My Properties
                  </Link>
                )}
                <div className="flex items-center gap-4">
                  <span className="text-sm text-neutral-600">
                    {user?.name}
                  </span>
                  <button
                    onClick={logout}
                    className="text-sm text-neutral-600 hover:text-accent-600 transition-colors"
                  >
                    Çıkış
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-4">
                <Link
                  href="/login"
                  className="text-neutral-700 hover:text-primary-700 transition-colors"
                >
                  Giriş
                </Link>
                <Link
                  href="/register"
                  className="bg-accent-600 hover:bg-accent-700 text-white px-6 py-3 rounded-lg font-semibold shadow-soft btn-primary"
                >
                  <span className="btn-content">List Your Property</span>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
