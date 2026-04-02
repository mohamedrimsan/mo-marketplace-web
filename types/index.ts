// ─── User ────────────────────────────────────────────────────────────────────

export interface User {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  accessToken: string;
  user: User;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

// ─── Variant ─────────────────────────────────────────────────────────────────

export interface Variant {
  id: string;
  colour: string;
  size: string;
  material: string;
  price: number;
  stock: number;
  productId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateVariantPayload {
  attributes: {
    color: string;
    size: string;
    material: string;
  };
  price: number;
  stock: number;
  sku: string;
}

export interface UpdateVariantPayload extends Partial<CreateVariantPayload> {}

// ─── Product ─────────────────────────────────────────────────────────────────

export interface Product {
  id: string;
  name: string;
  description: string;
  category: string;
  basePrice: string;        
  imageUrl?: string;        
  variants: Variant[];
  createdAt: string;
  updatedAt: string;
  userId?: string;
}

export interface CreateProductPayload {
  name: string;
  description: string;
  category: string;
  basePrice: number;
  imageUrl?: string;
  variants: CreateVariantPayload[];
}

export interface UpdateProductPayload {
  name?: string;
  description?: string;
  category?: string;
}

// ─── Quick Buy ───────────────────────────────────────────────────────────────

export interface QuickBuyPayload {
  variantId: string;
  quantity: number;
}

export interface QuickBuyResponse {
  message: string;
  orderId?: string;
}

// ─── API Error ───────────────────────────────────────────────────────────────

export interface ApiError {
  message: string | string[];
  error: string;
  statusCode: number;
}

// ─── Safe number coercion ─────────────────────────────────────────────────────
// The API may return price/stock as strings — always coerce before arithmetic.

export function toNum(v: unknown): number {
  const n = Number(v);
  return isNaN(n) ? 0 : n;
}

export function fmtPrice(v: unknown): string {
  return `$${toNum(v).toFixed(2)}`;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

export function getPriceRange(product: Product): string {
  // Use variants prices if available
  if (product.variants && product.variants.length > 0) {
    const prices = product.variants.map((v) => toNum(v.price));
    const min = Math.min(...prices);
    const max = Math.max(...prices);
    if (min === max) return fmtPrice(min);
    return `${fmtPrice(min)} – ${fmtPrice(max)}`;
  }
  // Fallback to basePrice
  return fmtPrice(product.basePrice);
}

export function isOutOfStock(variants: Variant[]): boolean {
  if (!variants || variants.length === 0) return true;
  return variants.every((v) => toNum(v.stock) === 0);
}

export function getTotalStock(variants: Variant[]): number {
  if (!variants || variants.length === 0) return 0;
  return variants.reduce((acc, v) => acc + toNum(v.stock), 0);
}
