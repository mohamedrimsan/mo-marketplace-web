'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { ArrowLeft, Calendar, Tag, Package, Layers } from 'lucide-react';
import {
  Product, Variant,
  getPriceRange, isOutOfStock, getTotalStock,
  toNum, fmtPrice,
} from '@/types';
import { VariantSelector } from '@/components/products/VariantSelector';
import { QuickBuyBtn } from '@/components/products/QuickBuyBtn';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { ProductDetailSkeleton } from '@/components/ui/Skeleton';
import api, { getApiErrorMessage } from '@/lib/api';

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedVariant, setSelectedVariant] = useState<Variant | null>(null);

  useEffect(() => {
    if (!id) return;
    api
      .get<Product>(`/products/${id}`)
      .then(({ data }) => {
        setProduct(data);
        // Auto-select first in-stock variant
        const firstInStock = data.variants?.find((v) => toNum(v.stock) > 0) ?? null;
        setSelectedVariant(firstInStock);
      })
      .catch((err) => {
        toast.error(getApiErrorMessage(err));
        router.push('/products');
      })
      .finally(() => setLoading(false));
  }, [id, router]);

  if (loading) return <ProductDetailSkeleton />;
  if (!product) return null;

  const oos = isOutOfStock(product.variants);
  const priceRange = getPriceRange(product.variants);
  const totalStock = getTotalStock(product.variants);
  const variantCount = product.variants?.length ?? 0;

  return (
    <div
      className="mx-auto max-w-5xl px-4 py-10 sm:px-6"
      style={{ animation: 'fadeIn 0.4s ease' }}
    >
      <Button
        variant="ghost"
        size="sm"
        onClick={() => router.back()}
        leftIcon={<ArrowLeft className="h-3.5 w-3.5" />}
        className="mb-8"
      >
        Back to Products
      </Button>

      <div className="grid gap-10 lg:grid-cols-5">
        {/* ── Left: visual ── */}
        <div className="lg:col-span-2">
          <div className="flex h-72 items-center justify-center rounded-sm border border-ink-border bg-ink-soft lg:h-[420px]">
            <div className="flex flex-col items-center gap-3 text-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-sm border border-ink-border/40 bg-ink-muted">
                <Package className="h-10 w-10 text-gold/30" strokeWidth={1} />
              </div>
              <Badge variant="muted">
                <Tag className="mr-1 h-2.5 w-2.5" />
                {product.category}
              </Badge>
            </div>
          </div>

          {/* Quick stats */}
          <div className="mt-3 grid grid-cols-2 gap-2">
            <div className="rounded-sm border border-ink-border bg-ink-soft p-3 text-center">
              <p className="text-xs text-chalk-muted">Variants</p>
              <p className="mt-0.5 font-semibold text-chalk">{variantCount}</p>
            </div>
            <div className="rounded-sm border border-ink-border bg-ink-soft p-3 text-center">
              <p className="text-xs text-chalk-muted">In Stock</p>
              <p className={`mt-0.5 font-semibold ${oos ? 'text-crimson' : 'text-chalk'}`}>
                {totalStock}
              </p>
            </div>
          </div>
        </div>

        {/* ── Right: details ── */}
        <div className="lg:col-span-3 flex flex-col gap-6">
          <div>
            <div className="mb-3 flex flex-wrap items-center gap-2">
              <Badge variant="muted">
                <Tag className="mr-1 h-2.5 w-2.5" />
                {product.category}
              </Badge>
              {oos && <Badge variant="crimson">Out of Stock</Badge>}
            </div>
            <h1 className="text-3xl font-bold leading-tight text-chalk">
              {product.name}
            </h1>
            <p
              className="mt-1.5 font-mono text-2xl font-medium text-gold"
              style={{ fontFamily: 'var(--font-geist-mono)' }}
            >
              {priceRange}
            </p>
          </div>

          <p className="text-sm leading-relaxed text-chalk-muted">
            {product.description}
          </p>

          <div className="flex flex-wrap items-center gap-4 text-xs text-chalk-muted/60">
            <span className="flex items-center gap-1.5">
              <Calendar className="h-3 w-3" />
              Listed{' '}
              {new Date(product.createdAt).toLocaleDateString('en-US', {
                month: 'short', day: 'numeric', year: 'numeric',
              })}
            </span>
            <span className="flex items-center gap-1.5">
              <Layers className="h-3 w-3" />
              {variantCount} variant{variantCount !== 1 ? 's' : ''} · {totalStock} units total
            </span>
          </div>

          {/* Variant selector */}
          {product.variants && product.variants.length > 0 ? (
            <div>
              <p className="mb-3 text-xs font-medium uppercase tracking-widest text-chalk-muted">
                Select Variant
                {selectedVariant && (
                  <span className="ml-2 font-normal normal-case tracking-normal text-gold">
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
          ) : (
            <p className="text-sm italic text-chalk-muted/60">No variants available.</p>
          )}

          {/* Selected variant summary */}
          {selectedVariant && (
            <div className="rounded-sm border border-ink-border bg-ink-muted/60 p-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-chalk-muted">Selected price</span>
                <span
                  className="font-mono font-semibold text-gold"
                  style={{ fontFamily: 'var(--font-geist-mono)' }}
                >
                  {fmtPrice(selectedVariant.price)}
                </span>
              </div>
              <div className="mt-1.5 flex items-center justify-between text-sm">
                <span className="text-chalk-muted">Availability</span>
                <span className={toNum(selectedVariant.stock) > 0 ? 'text-chalk' : 'text-crimson'}>
                  {toNum(selectedVariant.stock) > 0
                    ? `${toNum(selectedVariant.stock)} in stock`
                    : 'Out of stock'}
                </span>
              </div>
            </div>
          )}

          {/* CTA */}
          <div className="mt-auto">
            <QuickBuyBtn productId={product.id} selectedVariant={selectedVariant} />
            {!selectedVariant && !oos && (
              <p className="mt-2 text-center text-xs text-chalk-muted/60">
                Choose a variant above to continue
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
