'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { toast } from 'sonner';
import { Plus, RefreshCw, PackageOpen, Search } from 'lucide-react';
import { Product } from '@/types';
import { ProductCard } from '@/components/products/ProductCard';
import { ProductCardSkeleton } from '@/components/ui/Skeleton';
import { Button } from '@/components/ui/Button';
import { useAuthStore } from '@/store/authStore';
import api, { getApiErrorMessage } from '@/lib/api';

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filtered, setFiltered] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const { isAuthenticated } = useAuthStore();

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const { data } = await api.get<Product[]>('/products');
      setProducts(data);
      setFiltered(data);
    } catch (err) {
      const msg = getApiErrorMessage(err);
      setError(msg);
      toast.error(msg, { description: 'Failed to load products.' });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Client-side search filter
  useEffect(() => {
    if (!search.trim()) {
      setFiltered(products);
      return;
    }
    const q = search.toLowerCase();
    setFiltered(
      products.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q)
      )
    );
  }, [search, products]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      {/* Hero header */}
      <div className="mb-10">
        <p className="mb-1 text-xs font-medium uppercase tracking-widest text-gold">
          Marketplace
        </p>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <h1 className="text-4xl font-bold text-chalk sm:text-5xl">
            All Products
          </h1>
          {isAuthenticated && (
            <Link href="/products/create">
              <Button
                size="sm"
                leftIcon={<Plus className="h-3.5 w-3.5" />}
              >
                List Product
              </Button>
            </Link>
          )}
        </div>

        {/* Search */}
        {!loading && products.length > 0 && (
          <div className="mt-6 relative max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-chalk-muted/50" />
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-10 w-full rounded-sm border border-ink-border bg-ink-muted pl-9 pr-4 text-sm text-chalk placeholder:text-chalk-muted/50 focus:border-gold/60 focus:outline-none focus:ring-2 focus:ring-gold/30 transition-colors"
            />
          </div>
        )}
      </div>

      {/* Error retry */}
      {error && !loading && (
        <div className="mb-6 flex items-center justify-between rounded-sm border border-crimson/30 bg-crimson/10 px-4 py-3">
          <p className="text-sm text-crimson">{error}</p>
          <Button
            variant="ghost"
            size="sm"
            onClick={fetchProducts}
            leftIcon={<RefreshCw className="h-3.5 w-3.5" />}
          >
            Retry
          </Button>
        </div>
      )}

      {/* Loading skeleton */}
      {loading ? (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <ProductCardSkeleton key={i} />
          ))}
        </div>
      ) : filtered.length === 0 && search ? (
        /* No search results */
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <Search className="mb-4 h-12 w-12 text-ink-border" strokeWidth={1} />
          <h3 className="mb-2 text-lg font-semibold text-chalk">
            No results for &ldquo;{search}&rdquo;
          </h3>
          <p className="text-sm text-chalk-muted">
            Try a different search term.
          </p>
          <button
            onClick={() => setSearch('')}
            className="mt-4 text-sm text-gold hover:text-gold-light transition-colors"
          >
            Clear search
          </button>
        </div>
      ) : products.length === 0 ? (
        /* Empty state */
        <div className="flex flex-col items-center justify-center py-28 text-center">
          <PackageOpen
            className="mb-4 h-16 w-16 text-ink-border"
            strokeWidth={1}
          />
          <h3 className="mb-2 text-xl font-semibold text-chalk">
            No products yet
          </h3>
          <p className="mb-6 max-w-xs text-sm text-chalk-muted">
            Be the first to list something on the marketplace.
          </p>
          {isAuthenticated ? (
            <Link href="/products/create">
              <Button leftIcon={<Plus className="h-4 w-4" />}>
                List First Product
              </Button>
            </Link>
          ) : (
            <Link href="/register">
              <Button>Join &amp; List Products</Button>
            </Link>
          )}
        </div>
      ) : (
        /* Product grid */
        <>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 stagger-children">
            {filtered.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>

          <p className="mt-8 text-center text-xs text-chalk-muted/50">
            Showing {filtered.length} of {products.length} product
            {products.length !== 1 ? 's' : ''}
          </p>
        </>
      )}
    </div>
  );
}
