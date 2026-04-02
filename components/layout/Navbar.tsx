'use client';

import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { ShoppingBag, Plus, LogOut, User, Menu, X } from 'lucide-react';
import { toast } from 'sonner';
import { useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import { cn } from '@/lib/utils';

export function Navbar() {
  const { user, isAuthenticated, logout } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully.');
    router.push('/login');
    setMenuOpen(false);
  };

  const navLinks = [
    { href: '/products', label: 'Browse' },
    ...(isAuthenticated
      ? [{ href: '/products/create', label: 'List Product', icon: Plus }]
      : []),
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-ink-border bg-ink/90 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link
            href="/products"
            className="group flex items-center gap-2.5 transition-opacity hover:opacity-80"
          >
            <div className="relative flex h-8 w-8 items-center justify-center rounded-sm bg-gold">
              <ShoppingBag className="h-4 w-4 text-ink" strokeWidth={2.5} />
            </div>
            <span
              className="text-xl font-display tracking-widest text-chalk"
              style={{ fontFamily: 'var(--font-bebas)' }}
            >
              MO Market
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden items-center gap-1 md:flex">
            {navLinks.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={cn(
                  'flex items-center gap-1.5 rounded-sm px-3 py-1.5 text-sm font-medium transition-colors',
                  pathname === href
                    ? 'bg-ink-muted text-gold'
                    : 'text-chalk-muted hover:bg-ink-muted hover:text-chalk'
                )}
              >
                {label}
              </Link>
            ))}
          </nav>

          {/* Desktop auth */}
          <div className="hidden items-center gap-3 md:flex">
            {isAuthenticated ? (
              <>
                <div className="flex items-center gap-2 rounded-sm border border-ink-border px-3 py-1.5">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gold/20">
                    <User className="h-3 w-3 text-gold" />
                  </div>
                  <span className="text-sm text-chalk-muted">
                    {user?.name?.split(' ')[0]}
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1.5 rounded-sm px-3 py-1.5 text-sm text-chalk-muted transition-colors hover:bg-crimson/10 hover:text-crimson"
                >
                  <LogOut className="h-3.5 w-3.5" />
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="px-3 py-1.5 text-sm text-chalk-muted transition-colors hover:text-chalk"
                >
                  Sign in
                </Link>
                <Link
                  href="/register"
                  className="rounded-sm bg-gold px-4 py-1.5 text-sm font-semibold text-ink transition-all hover:bg-gold-light"
                >
                  Get started
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu toggle */}
          <button
            className="flex items-center justify-center rounded-sm p-2 text-chalk-muted transition-colors hover:bg-ink-muted hover:text-chalk md:hidden"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="border-t border-ink-border bg-ink-soft md:hidden">
          <div className="mx-auto max-w-7xl space-y-1 px-4 py-3">
            {navLinks.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setMenuOpen(false)}
                className={cn(
                  'block rounded-sm px-3 py-2 text-sm font-medium transition-colors',
                  pathname === href
                    ? 'bg-ink-muted text-gold'
                    : 'text-chalk-muted hover:bg-ink-muted hover:text-chalk'
                )}
              >
                {label}
              </Link>
            ))}
            <div className="mt-3 border-t border-ink-border pt-3">
              {isAuthenticated ? (
                <>
                  <div className="mb-2 flex items-center gap-2 px-3 py-2">
                    <User className="h-4 w-4 text-gold" />
                    <span className="text-sm text-chalk">{user?.name}</span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="flex w-full items-center gap-2 rounded-sm px-3 py-2 text-sm text-crimson transition-colors hover:bg-crimson/10"
                  >
                    <LogOut className="h-4 w-4" />
                    Logout
                  </button>
                </>
              ) : (
                <div className="flex flex-col gap-2">
                  <Link
                    href="/login"
                    onClick={() => setMenuOpen(false)}
                    className="block rounded-sm px-3 py-2 text-center text-sm text-chalk-muted transition-colors hover:bg-ink-muted hover:text-chalk"
                  >
                    Sign in
                  </Link>
                  <Link
                    href="/register"
                    onClick={() => setMenuOpen(false)}
                    className="block rounded-sm bg-gold px-3 py-2 text-center text-sm font-semibold text-ink"
                  >
                    Get started
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
