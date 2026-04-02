import { cn } from '@/lib/utils';

type BadgeVariant = 'gold' | 'crimson' | 'muted' | 'acid';

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
}

const variants: Record<BadgeVariant, string> = {
  gold: 'bg-gold/15 text-gold-light border-gold/30',
  crimson: 'bg-crimson/10 text-crimson border-crimson/30',
  muted: 'bg-ink-muted text-chalk-muted border-ink-border',
  acid: 'bg-acid/10 text-acid border-acid/30',
};

export function Badge({
  children,
  variant = 'muted',
  className,
}: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-sm border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-widest',
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
