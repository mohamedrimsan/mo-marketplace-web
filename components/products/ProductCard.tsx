'use client';

import Link from 'next/link';
import { Package, Tag, Layers } from 'lucide-react';
import { Product, getPriceRange, isOutOfStock } from '@/types';
import { Badge } from '@/components/ui/Badge';
import { cn } from '@/lib/utils';

export function ProductCard({ product }: { product: Product }) {
  const outOfStock = isOutOfStock(product.variants);
  const priceRange = getPriceRange(product);
  const variantCount = product.variants?.length ?? 0;

  return (
    <Link href={`/products/${product.id}`} className="block">
      <article
        className={cn(
          'group relative flex flex-col rounded-sm border border-ink-border bg-ink-soft p-5 card-hover cursor-pointer overflow-hidden h-full',
          outOfStock && 'opacity-70'
        )}
      >
        {/* Top badges */}
        <div className="mb-4 flex items-start justify-between gap-2 flex-wrap">
          <Badge variant="muted">
            <Tag className="mr-1 h-2.5 w-2.5" />
            {product.category}
          </Badge>
          {outOfStock && <Badge variant="crimson">Out of Stock</Badge>}
        </div>

        {/* Visual placeholder */}
        <div className="mb-4 flex h-36 items-center justify-center rounded-sm bg-ink-muted/60 border border-ink-border/40 group-hover:border-gold/20 transition-colors duration-300">
          <Package
            className="h-12 w-12 text-ink-border group-hover:text-gold/40 transition-colors duration-300"
            strokeWidth={1}
          />
        </div>

        {/* Name */}
        <h3 className="mb-1 line-clamp-2 text-base font-semibold text-chalk leading-snug group-hover:text-gold transition-colors duration-200">
          {product.name}
        </h3>

        {/* Description */}
        <p className="mb-4 line-clamp-2 text-xs text-chalk-muted leading-relaxed flex-1">
          {product.description}
        </p>

        {/* Footer */}
        <div className="mt-auto flex items-center justify-between border-t border-ink-border pt-3">
          <span
            className="font-mono text-sm font-medium text-gold"
            style={{ fontFamily: 'var(--font-geist-mono)' }}
          >
            {priceRange}
          </span>
          <div className="flex items-center gap-1 text-xs text-chalk-muted">
            <Layers className="h-3 w-3" />
            {variantCount} variant{variantCount !== 1 ? 's' : ''}
          </div>
        </div>
      </article>
    </Link>
  );
}
