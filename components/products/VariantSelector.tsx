'use client';

import { Variant } from '@/types';
import { toNum, fmtPrice } from '@/types';
import { cn } from '@/lib/utils';

interface VariantSelectorProps {
  variants: Variant[];
  selected: Variant | null;
  onSelect: (v: Variant) => void;
}

export function VariantSelector({
  variants,
  selected,
  onSelect,
}: VariantSelectorProps) {
  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
      {variants.map((v) => {
        const stock = toNum(v.stock);
        const isOos = stock === 0;
        const isSelected = selected?.id === v.id;

        return (
          <button
            key={v.id}
            type="button"
            onClick={() => !isOos && onSelect(v)}
            disabled={isOos}
            aria-pressed={isSelected}
            aria-label={`${v.colour}, ${v.size}, ${v.material}, ${fmtPrice(v.price)}${isOos ? ', out of stock' : `, ${stock} in stock`}`}
            className={cn(
              'relative flex flex-col items-start rounded-sm border p-3 text-left text-xs transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold',
              isOos
                ? 'cursor-not-allowed border-ink-border bg-ink-soft/40 opacity-50'
                : 'cursor-pointer hover:border-gold/40 active:scale-[0.98]',
              isSelected
                ? 'border-gold bg-gold/10 ring-1 ring-gold/30 shadow-[0_0_12px_rgba(201,168,76,0.1)]'
                : !isOos && 'border-ink-border bg-ink-soft'
            )}
          >
            {isOos && (
              <span className="absolute right-1.5 top-1.5 text-[9px] font-semibold uppercase tracking-widest text-crimson">
                OOS
              </span>
            )}
            {isSelected && !isOos && (
              <span className="absolute right-1.5 top-1.5">
                <span className="flex h-3 w-3 items-center justify-center rounded-full bg-gold">
                  <span className="h-1.5 w-1.5 rounded-full bg-ink" />
                </span>
              </span>
            )}
            <span className="font-semibold text-chalk mb-0.5">{v.colour}</span>
            <span className="text-chalk-muted">{v.size} · {v.material}</span>
            <span className="mt-1.5 font-mono text-gold" style={{ fontFamily: 'var(--font-geist-mono)' }}>
              {fmtPrice(v.price)}
            </span>
            {!isOos && (
              <span className="text-chalk-muted/60">{stock} left</span>
            )}
          </button>
        );
      })}
    </div>
  );
}
