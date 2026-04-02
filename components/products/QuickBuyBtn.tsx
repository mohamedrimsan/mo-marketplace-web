'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Zap } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useAuthStore } from '@/store/authStore';
import api, { getApiErrorMessage } from '@/lib/api';
import { Variant, toNum } from '@/types';

interface QuickBuyBtnProps {
  productId: string;
  selectedVariant: Variant | null;
}

export function QuickBuyBtn({ productId, selectedVariant }: QuickBuyBtnProps) {
  const { isAuthenticated } = useAuthStore();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleQuickBuy = async () => {
    if (!isAuthenticated) {
      toast.error('Please sign in to purchase.', {
        description: 'You will be redirected to login.',
      });
      router.push(`/login?redirect=/products/${productId}`);
      return;
    }
    if (!selectedVariant) {
      toast.error('Please select a variant first.');
      return;
    }
    if (toNum(selectedVariant.stock) === 0) {
      toast.error('This variant is out of stock.');
      return;
    }
    try {
      setLoading(true);
      await api.post(`/products/${productId}/quick-buy`, {
        variantId: selectedVariant.id,
        quantity: 1,
      });
      toast.success('Order placed successfully! 🎉', {
        description: `${selectedVariant.colour} · ${selectedVariant.size} · ${selectedVariant.material}`,
      });
    } catch (err) {
      toast.error(getApiErrorMessage(err), { description: 'Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const isOutOfStock = toNum(selectedVariant?.stock) === 0;
  const noVariantSelected = !selectedVariant;

  const label = () => {
    if (noVariantSelected) return 'Select a Variant';
    if (isOutOfStock) return 'Out of Stock';
    return 'Quick Buy';
  };

  return (
    <Button
      onClick={handleQuickBuy}
      isLoading={loading}
      disabled={noVariantSelected || isOutOfStock}
      size="lg"
      className="w-full"
      leftIcon={<Zap className="h-4 w-4" />}
    >
      {label()}
    </Button>
  );
}
