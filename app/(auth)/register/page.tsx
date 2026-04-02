'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'sonner';
import { ArrowRight, ShieldCheck } from 'lucide-react';
import { registerSchema, RegisterFormValues } from '@/lib/validations';
import { useAuthStore } from '@/store/authStore';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import api, { getApiErrorMessage } from '@/lib/api';
import { AuthResponse } from '@/types';

export default function RegisterPage() {
  const { setAuth, isAuthenticated } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated) router.replace('/products');
  }, [isAuthenticated, router]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (values: RegisterFormValues) => {
    try {
      const { data } = await api.post<AuthResponse>('/auth/register', values);
      setAuth(data);
      toast.success(`Welcome to MO Marketplace, ${data.user.name.split(' ')[0]}! 🎉`);
      router.push('/products');
    } catch (err) {
      toast.error(getApiErrorMessage(err));
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-16">
      {/* Background decoration */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-1/4 h-96 w-96 -translate-x-1/2 rounded-full bg-gold/5 blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        {/* Header */}
        <div className="mb-10 text-center">
          <div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-sm bg-gold">
            <ShieldCheck className="h-6 w-6 text-ink" strokeWidth={2.5} />
          </div>
          <h1 className="mb-2 text-4xl font-bold tracking-tight text-chalk">
            Create account
          </h1>
          <p className="text-sm text-chalk-muted">
            Join the MO Marketplace community
          </p>
        </div>

        {/* Card */}
        <div className="rounded-sm border border-ink-border bg-ink-soft p-8 shadow-2xl">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-5"
            noValidate
          >
            <Input
              label="Full Name"
              type="text"
              autoComplete="name"
              placeholder="Jane Smith"
              error={errors.name?.message}
              {...register('name')}
            />
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
              autoComplete="new-password"
              placeholder="Min. 8 chars, 1 uppercase, 1 number"
              hint="At least 8 characters with one uppercase letter and one number"
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
              Create Account
            </Button>
          </form>

          <div className="mt-6 flex items-center gap-3">
            <div className="h-px flex-1 bg-ink-border" />
            <span className="text-xs text-chalk-muted/50">or</span>
            <div className="h-px flex-1 bg-ink-border" />
          </div>

          <p className="mt-5 text-center text-sm text-chalk-muted">
            Already have an account?{' '}
            <Link
              href="/login"
              className="font-medium text-gold transition-colors hover:text-gold-light"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
