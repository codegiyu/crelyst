'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { LogIn } from 'lucide-react';
import { z } from 'zod';
import { safeAdminRedirectPath } from '@/lib/constants/routing';
import { useAuthStore } from '@/lib/store/useAuthStore';
import { useForm } from '@/lib/hooks/use-form';
import { RegularInput } from '@/components/atoms/RegularInput';
import { PasswordInput } from '@/components/atoms/PasswordInput';
import { RegularBtn } from '@/components/atoms/RegularBtn';
import { AdminLoginCard } from '@/components/admin/auth/AdminLoginCard';
import { ForgotPasswordPanel } from '@/components/admin/auth/ForgotPasswordPanel';

const loginSchema = z.object({
  email: z.email('Please enter a valid email'),
  password: z.string().min(1, 'Password is required'),
});

type LoginFormValues = z.infer<typeof loginSchema>;
type AuthView = 'sign-in' | 'forgot-password';

export const LoginForm = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [view, setView] = useState<AuthView>('sign-in');
  const loginLoading = useAuthStore(state => state.loginLoading);
  const {
    actions: { login },
  } = useAuthStore(state => state);

  const {
    formValues,
    formErrors,
    errorsVisible,
    handleInputChange,
    handleSubmit,
    setFormErrors,
    resetForm,
  } = useForm<typeof loginSchema>({
    formSchema: loginSchema,
    defaultFormValues: {
      email: '',
      password: '',
    },
    validateOnChange: true,
    onSubmit: async (values: LoginFormValues) => {
      const result = await login(values.email, values.password);

      if (result.success) {
        router.replace(safeAdminRedirectPath(searchParams.get('redirectTo')));
        resetForm();
        return true;
      }

      setFormErrors({ root: [result.error || 'Login failed'] });
      return false;
    },
  });

  if (view === 'forgot-password') {
    return (
      <AdminLoginCard
        title="Reset password"
        description="We will email you a secure link to choose a new password.">
        <ForgotPasswordPanel defaultEmail={formValues.email} onBack={() => setView('sign-in')} />
      </AdminLoginCard>
    );
  }

  return (
    <AdminLoginCard title="Sign in" description="Use your admin email and password to continue.">
      <form onSubmit={handleSubmit} className="grid gap-6">
        {errorsVisible && formErrors.root && formErrors.root.length > 0 ? (
          <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
            {formErrors.root[0]}
          </div>
        ) : null}

        <div className="grid gap-5">
          <RegularInput
            label="Email address"
            name="email"
            type="email"
            autoComplete="email"
            required
            placeholder="admin@example.com"
            value={formValues.email}
            onChange={handleInputChange}
            errors={errorsVisible ? (formErrors.email ?? []) : []}
          />

          <PasswordInput
            label="Password"
            name="password"
            autoComplete="current-password"
            required
            placeholder="••••••••"
            value={formValues.password}
            onChange={handleInputChange}
            errors={errorsVisible ? (formErrors.password ?? []) : []}
          />
        </div>

        <RegularBtn
          type="submit"
          text="Sign in"
          LeftIcon={LogIn}
          leftIconProps={{ className: 'h-5 w-5' }}
          loading={loginLoading}
          size="full"
        />

        <p className="text-center text-sm text-muted-foreground">
          Forgot your password?{' '}
          <button
            type="button"
            onClick={() => setView('forgot-password')}
            className="font-medium text-primary transition-colors hover:text-primary/80">
            Reset it here
          </button>
        </p>
      </form>
    </AdminLoginCard>
  );
};
