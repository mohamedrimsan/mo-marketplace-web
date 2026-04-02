'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { Plus, Trash2, AlertCircle, ArrowLeft, ArrowRight } from 'lucide-react';
import { productSchema, ProductFormValues } from '@/lib/validations';
import { useAuthStore } from '@/store/authStore';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import api, { getApiErrorMessage } from '@/lib/api';
import { Product } from '@/types';
import { cn } from '@/lib/utils';

const DEFAULT_VARIANT = {
  colour: '',
  size: '',
  material: '',
  price: 0,
  stock: 0,
};

export default function CreateProductPage() {
  const { isAuthenticated } = useAuthStore();
  const router = useRouter();

  // Guard: redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login?redirect=/products/create');
    }
  }, [isAuthenticated, router]);

  const {
    register,
    control,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: '',
      description: '',
      category: '',
      variants: [{ ...DEFAULT_VARIANT }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'variants',
  });

  const watchedVariants = watch('variants');

  // Check for duplicate combos client-side (for visual feedback)
  const getDuplicateIndices = (): Set<number> => {
    const seen = new Map<string, number>();
    const dupes = new Set<number>();
    watchedVariants?.forEach((v, i) => {
      const key = `${v.colour?.toLowerCase()}|${v.size?.toLowerCase()}|${v.material?.toLowerCase()}`;
      if (seen.has(key)) {
        dupes.add(i);
        dupes.add(seen.get(key)!);
      } else {
        seen.set(key, i);
      }
    });
    return dupes;
  };
  const duplicateIndices = getDuplicateIndices();

  const onSubmit = async (values: ProductFormValues) => {
    try {
      const { data } = await api.post<Product>('/products', values);
      toast.success('Product listed successfully! 🎉');
      router.push(`/products/${data.id}`);
    } catch (err) {
      toast.error(getApiErrorMessage(err));
    }
  };

  if (!isAuthenticated) return null;

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
      {/* Header */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => router.back()}
        leftIcon={<ArrowLeft className="h-3.5 w-3.5" />}
        className="mb-8"
      >
        Back
      </Button>

      <div className="mb-8">
        <p className="mb-1 text-xs font-medium uppercase tracking-widest text-gold">
          New Listing
        </p>
        <h1 className="text-3xl font-bold text-chalk">List a Product</h1>
        <p className="mt-2 text-sm text-chalk-muted">
          Fill in the details below to publish your product on MO Marketplace.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-6">
        {/* ── Product Info ── */}
        <section className="rounded-sm border border-ink-border bg-ink-soft p-6 space-y-5">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-chalk-muted">
            Product Info
          </h2>

          <Input
            label="Product Name"
            placeholder="e.g. Premium Wool Jacket"
            error={errors.name?.message}
            {...register('name')}
          />

          {/* Textarea for description */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium uppercase tracking-widest text-chalk-muted">
              Description
            </label>
            <textarea
              rows={4}
              placeholder="Describe your product in detail — materials, uses, unique qualities..."
              className={cn(
                'w-full rounded-sm border bg-ink-muted px-3 py-2.5 text-sm text-chalk placeholder:text-chalk-muted/50 resize-none',
                'transition-colors focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold/60',
                errors.description
                  ? 'border-crimson/60 focus:ring-crimson/30'
                  : 'border-ink-border hover:border-ink-border/80'
              )}
              {...register('description')}
            />
            {errors.description && (
              <p className="text-xs text-crimson">
                {errors.description.message}
              </p>
            )}
          </div>

          <Input
            label="Category"
            placeholder="e.g. Clothing, Electronics, Books"
            error={errors.category?.message}
            {...register('category')}
          />
        </section>

        {/* ── Variants ── */}
        <section className="rounded-sm border border-ink-border bg-ink-soft p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xs font-semibold uppercase tracking-widest text-chalk-muted">
                Variants
              </h2>
              <p className="mt-0.5 text-xs text-chalk-muted/60">
                Each variant = unique colour + size + material combo
              </p>
            </div>
            <Button
              type="button"
              variant="secondary"
              size="sm"
              leftIcon={<Plus className="h-3.5 w-3.5" />}
              onClick={() => append({ ...DEFAULT_VARIANT })}
            >
              Add
            </Button>
          </div>

          {/* Global variants error (Zod refine) */}
          {errors.variants?.root && (
            <div className="flex items-start gap-2 rounded-sm border border-crimson/30 bg-crimson/10 px-3 py-2.5 text-xs text-crimson">
              <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
              <span>{errors.variants.root.message}</span>
            </div>
          )}

          {/* Variant list */}
          <div className="space-y-3">
            {fields.map((field, idx) => {
              const isDuplicate = duplicateIndices.has(idx);
              return (
                <div
                  key={field.id}
                  className={cn(
                    'rounded-sm border p-4 space-y-3 transition-colors',
                    isDuplicate
                      ? 'border-crimson/40 bg-crimson/5'
                      : 'border-ink-border/50 bg-ink-muted/30'
                  )}
                >
                  {/* Variant header */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span
                        className="font-mono text-xs text-chalk-muted"
                        style={{ fontFamily: 'var(--font-geist-mono)' }}
                      >
                        #{String(idx + 1).padStart(2, '0')}
                      </span>
                      {isDuplicate && (
                        <span className="flex items-center gap-1 text-xs text-crimson">
                          <AlertCircle className="h-3 w-3" />
                          Duplicate combo
                        </span>
                      )}
                    </div>
                    {fields.length > 1 && (
                      <button
                        type="button"
                        onClick={() => remove(idx)}
                        aria-label="Remove variant"
                        className="text-chalk-muted/40 transition-colors hover:text-crimson"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>

                  {/* Colour / Size / Material */}
                  <div className="grid grid-cols-3 gap-3">
                    <Input
                      label="Colour"
                      placeholder="e.g. Black"
                      error={errors.variants?.[idx]?.colour?.message}
                      {...register(`variants.${idx}.colour`)}
                    />
                    <Input
                      label="Size"
                      placeholder="e.g. M, 42, XL"
                      error={errors.variants?.[idx]?.size?.message}
                      {...register(`variants.${idx}.size`)}
                    />
                    <Input
                      label="Material"
                      placeholder="e.g. Cotton"
                      error={errors.variants?.[idx]?.material?.message}
                      {...register(`variants.${idx}.material`)}
                    />
                  </div>

                  {/* Price / Stock */}
                  <div className="grid grid-cols-2 gap-3">
                    <Input
                      label="Price (USD)"
                      type="number"
                      step="0.01"
                      min="0.01"
                      placeholder="0.00"
                      error={errors.variants?.[idx]?.price?.message}
                      {...register(`variants.${idx}.price`, {
                        valueAsNumber: true,
                      })}
                    />
                    <Input
                      label="Stock"
                      type="number"
                      min="0"
                      step="1"
                      placeholder="0"
                      error={errors.variants?.[idx]?.stock?.message}
                      {...register(`variants.${idx}.stock`, {
                        valueAsNumber: true,
                      })}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Add more hint */}
          <button
            type="button"
            onClick={() => append({ ...DEFAULT_VARIANT })}
            className="w-full rounded-sm border border-dashed border-ink-border py-3 text-xs text-chalk-muted/60 transition-colors hover:border-gold/30 hover:text-chalk-muted"
          >
            + Add another variant
          </button>
        </section>

        {/* Submit */}
        <Button
          type="submit"
          isLoading={isSubmitting}
          size="lg"
          className="w-full"
          rightIcon={<ArrowRight className="h-4 w-4" />}
        >
          Publish Product
        </Button>
      </form>
    </div>
  );
}
