import { z } from 'zod';

// ─── Auth ─────────────────────────────────────────────────────────────────────

export const registerSchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(80, 'Name must be under 80 characters'),
  email: z.string().email('Please enter a valid email address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
});

export type RegisterFormValues = z.infer<typeof registerSchema>;

export const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

export type LoginFormValues = z.infer<typeof loginSchema>;

// ─── Variant ─────────────────────────────────────────────────────────────────

export const variantSchema = z.object({
  attributes: z.object({
    color: z.string().min(1, 'Color is required').max(50),
    size: z.string().min(1, 'Size is required').max(50),
    material: z.string().min(1, 'Material is required').max(100),
  }),
  price: z
    .number({ invalid_type_error: 'Price must be a number' })
    .min(0.01, 'Price must be greater than 0'),
  stock: z
    .number({ invalid_type_error: 'Stock must be a number' })
    .int('Stock must be a whole number')
    .min(0, 'Stock cannot be negative'),
  sku: z.string().min(1, 'SKU is required'),
});

export type VariantFormValues = z.infer<typeof variantSchema>;

// ─── Product ─────────────────────────────────────────────────────────────────

export const productSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  category: z.string().min(2, 'Category is required'),
  basePrice: z.number({ invalid_type_error: 'Base price must be a number' })
    .min(0.01, 'Base price must be greater than 0'),
  imageUrl: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  variants: z
    .array(variantSchema)
    .min(1, 'Add at least one variant')
    .refine(
      (variants) => {
        const keys = variants.map(
          (v) =>
            `${v.attributes.color.toLowerCase()}|${v.attributes.size.toLowerCase()}|${v.attributes.material.toLowerCase()}`
        );
        return new Set(keys).size === keys.length;
      },
      { message: 'Duplicate color + size + material combination found' }
    ),
});

export type ProductFormValues = z.infer<typeof productSchema>;

// ─── Quick Buy ────────────────────────────────────────────────────────────────

export const quickBuySchema = z.object({
  variantId: z.string().min(1, 'Please select a variant'),
  quantity: z.number().int().min(1, 'Quantity must be at least 1'),
});

export type QuickBuyFormValues = z.infer<typeof quickBuySchema>;