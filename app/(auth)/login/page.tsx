'use client';

import { Suspense, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'sonner';
import { ShoppingBag, ArrowRight } from 'lucide-react';
import { loginSchema, LoginFormValues } from '@/lib/validations';
import { useAuthStore } from '@/store/authStore';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import api, { getApiErrorMessage } from '@/lib/api';
import { AuthResponse } from '@/types';

function LoginForm() {
  const { setAuth, isAuthenticated } = useAuthStore();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect') || '/products';

  useEffect(() => {
    if (isAuthenticated) router.replace(redirect);
  }, [isAuthenticated, redirect, router]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (values: LoginFormValues) => {
    try {
      const { data } = await api.post<AuthResponse>('/auth/login', values);
      setAuth(data);
      toast.success(`Welcome back, ${data.user.name.split(' ')[0]}!`);
      router.push(redirect);
    } catch (err) {
      toast.error(getApiErrorMessage(err));
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
      <Input
        label="Email"
        type="email"
        autoComplete="email"
        placeholder="you@example.com"
        error={errors.email?.message}
        {...register('email')}
      />
      <Input
        label="Password"
        type="password"
        autoComplete="current-password"
        placeholder="••••••••"
        error={errors.password?.message}
        {...register('password')}
      />
      <Button
        type="submit"
        isLoading={isSubmitting}
        size="lg"
        className="w-full mt-2"
        rightIcon={<ArrowRight className="h-4 w-4" />}
      >
        Sign In
      </Button>
    </form>
  );
}

export default function LoginPage() {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-16">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-1/4 h-96 w-96 -translate-x-1/2 rounded-full bg-gold/5 blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        <div className="mb-10 text-center">
          <div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-sm bg-gold">
            <ShoppingBag className="h-6 w-6 text-ink" strokeWidth={2.5} />
          </div>
          <h1 className="mb-2 text-4xl font-bold tracking-tight text-chalk">
            Welcome back
          </h1>
          <p className="text-sm text-chalk-muted">
            Sign in to your MO Marketplace account
          </p>
        </div>

        <div className="rounded-sm border border-ink-border bg-ink-soft p-8 shadow-2xl">
          <Suspense fallback={<div className="h-48 skeleton rounded-sm" />}>
            <LoginForm />
          </Suspense>

          <div className="mt-6 flex items-center gap-3">
            <div className="h-px flex-1 bg-ink-border" />
            <span className="text-xs text-chalk-muted/50">or</span>
            <div className="h-px flex-1 bg-ink-border" />
          </div>

          <p className="mt-5 text-center text-sm text-chalk-muted">
            Don&apos;t have an account?{' '}
            <Link
              href="/register"
              className="font-medium text-gold transition-colors hover:text-gold-light"
            >
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
