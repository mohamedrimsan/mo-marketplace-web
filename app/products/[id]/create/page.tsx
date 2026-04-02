'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { ArrowLeft, Calendar, Tag } from 'lucide-react';
import { Product, Variant } from '@/types';
import { VariantSelector } from '@/components/products/VariantSelector';
import { QuickBuyBtn } from '@/components/products/QuickBuyBtn';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Skeleton } from '@/components/ui/Skeleton';
import { getPriceRange, isOutOfStock, getTotalStock } from '@/types';
import api, { getApiErrorMessage } from '@/lib/api';

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedVariant, setSelectedVariant] = useState<Variant | null>(null);

  useEffect(() => {
    if (!id) return;
    api.get<Product>(`/products/${id}`)
      .then(({ data }) => {
        setProduct(data);
        // Auto-select first in-stock variant
        const first = data.variants?.find((v) => v.stock > 0) ?? null;
        setSelectedVariant(first);
      })
      .catch((err) => {
        toast.error(getApiErrorMessage(err));
        router.push('/products');
      })
      .finally(() => setLoading(false));
  }, [id, router]);

  if (loading) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
        <Skeleton className="mb-8 h-5 w-32" />
        <div className="grid gap-10 lg:grid-cols-2">
          <Skeleton className="h-80 w-full" />
          <div className="space-y-4">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-4 w-1/4" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-40 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) return null;

  const oos = isOutOfStock(product.variants);
  const priceRange = getPriceRange(product.variants);
  const totalStock = getTotalStock(product.variants);

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 animate-[fadeIn_0.4s_ease]">
      <Button variant="ghost" size="sm" onClick={() => router.back()} leftIcon={<ArrowLeft className="h-3.5 w-3.5" />} className="mb-8">
        Back
      </Button>

      <div className="grid gap-10 lg:grid-cols-5">
        {/* Left: visual */}
        <div className="lg:col-span-2">
          <div className="flex h-72 items-center justify-center rounded-sm border border-ink-border bg-ink-soft lg:h-96">
            <div className="text-center">
              <div className="mx-auto mb-3 flex h-20 w-20 items-center justify-center rounded-sm bg-ink-muted">
                <Tag className="h-10 w-10 text-gold/40" strokeWidth={1} />
              </div>
              <Badge variant="muted">{product.category}</Badge>
            </div>
          </div>
        </div>

        {/* Right: details */}
        <div className="lg:col-span-3 flex flex-col gap-5">
          <div>
            <div className="mb-3 flex flex-wrap items-center gap-2">
              <Badge variant="muted"><Tag className="mr-1 h-2.5 w-2.5" />{product.category}</Badge>
              {oos && <Badge variant="crimson">Out of Stock</Badge>}
            </div>
            <h1 className="text-3xl font-bold text-chalk leading-tight">{product.name}</h1>
            <p className="mt-1 font-mono text-2xl text-gold">{priceRange}</p>
          </div>

          <p className="text-sm text-chalk-muted leading-relaxed">{product.description}</p>

          <div className="flex items-center gap-4 text-xs text-chalk-muted/60">
            <span className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {new Date(product.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            </span>
            <span>{product.variants?.length ?? 0} variants · {totalStock} total in stock</span>
          </div>

          {/* Variant selector */}
          {product.variants && product.variants.length > 0 && (
            <div>
              <p className="mb-3 text-xs font-medium uppercase tracking-widest text-chalk-muted">
                Select Variant
                {selectedVariant && (
                  <span className="ml-2 text-gold normal-case tracking-normal">
                    — {selectedVariant.colour}, {selectedVariant.size}, {selectedVariant.material}
                  </span>
                )}
              </p>
              <VariantSelector
                variants={product.variants}
                selected={selectedVariant}
                onSelect={setSelectedVariant}
              />
            </div>
          )}

          {selectedVariant && (
            <div className="rounded-sm border border-ink-border bg-ink-muted p-4 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-chalk-muted">Selected price</span>
                <span className="font-mono font-semibold text-gold">${selectedVariant.price.toFixed(2)}</span>
              </div>
              <div className="mt-1 flex items-center justify-between">
                <span className="text-chalk-muted">Stock</span>
                <span className={selectedVariant.stock > 0 ? 'text-chalk' : 'text-crimson'}>
                  {selectedVariant.stock > 0 ? `${selectedVariant.stock} available` : 'Out of stock'}
                </span>
              </div>
            </div>
          )}

          <QuickBuyBtn productId={product.id} selectedVariant={selectedVariant} />
        </div>
      </div>
    </div>
  );
}