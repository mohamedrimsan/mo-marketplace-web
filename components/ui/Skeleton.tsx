import { cn } from '@/lib/utils';

export function Skeleton({ className }: { className?: string }) {
  return <div className={cn('skeleton rounded-sm', className)} />;
}

export function ProductCardSkeleton() {
  return (
    <div className="rounded-sm border border-ink-border bg-ink-soft p-5 flex flex-col gap-4">
      <div className="flex items-start justify-between">
        <Skeleton className="h-5 w-24" />
        <Skeleton className="h-5 w-16" />
      </div>
      <Skeleton className="h-36 w-full" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-2/3" />
      </div>
      <div className="flex items-center justify-between border-t border-ink-border pt-3">
        <Skeleton className="h-5 w-28" />
        <Skeleton className="h-4 w-16" />
      </div>
    </div>
  );
}

export function ProductDetailSkeleton() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <Skeleton className="mb-8 h-8 w-24" />
      <div className="grid gap-10 lg:grid-cols-5">
        <div className="lg:col-span-2">
          <Skeleton className="h-72 w-full lg:h-96" />
        </div>
        <div className="lg:col-span-3 space-y-4">
          <div className="flex gap-2">
            <Skeleton className="h-5 w-20" />
            <Skeleton className="h-5 w-24" />
          </div>
          <Skeleton className="h-9 w-3/4" />
          <Skeleton className="h-7 w-32" />
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-4 w-48" />
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-24 w-full" />
            ))}
          </div>
          <Skeleton className="h-14 w-full" />
        </div>
      </div>
    </div>
  );
}
