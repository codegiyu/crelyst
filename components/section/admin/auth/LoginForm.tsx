'use client';

import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store/useAuthStore';
import { useForm } from '@/lib/hooks/use-form';
import { RegularInput } from '@/components/atoms/RegularInput';
import { PasswordInput } from '@/components/atoms/PasswordInput';
import { RegularBtn } from '@/components/atoms/RegularBtn';
import { LogIn } from 'lucide-react';
import { z } from 'zod';

const loginSchema = z.object({
  email: z.email('Please enter a valid email'),
  password: z.string().min(1, 'Password is required'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export const LoginForm = () => {
  const router = useRouter();
  const {
    actions: { login },
  } = useAuthStore(state => state);

  const {
    formValues,
    formErrors,
    errorsVisible,
    loading,
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
    onSubmit: async (values: LoginFormValues) => {
      const result = await login(values.email, values.password);

      if (result.success) {
        router.replace('/admin/dashboard/home');
        resetForm();
        return true;
      } else {
        setFormErrors({ root: [result.error || 'Login failed'] });
        return false;
      }
    },
  });

  return (
    <form onSubmit={handleSubmit} className="mt-8 grid gap-6">
      {errorsVisible && formErrors.root && formErrors.root.length > 0 && (
        <div className="bg-destructive/10 border border-destructive/30 text-destructive px-4 py-3 rounded-lg text-sm">
          {formErrors.root[0]}
        </div>
      )}

      <div className="grid gap-4">
        <RegularInput
          label="Email address"
          name="email"
          type="email"
          autoComplete="email"
          required
          placeholder="admin@example.com"
          value={formValues.email}
          onChange={handleInputChange}
          errors={errorsVisible ? formErrors.email : []}
        />

        <PasswordInput
          label="Password"
          name="password"
          autoComplete="current-password"
          required
          placeholder="••••••••"
          value={formValues.password}
          onChange={handleInputChange}
          errors={errorsVisible ? formErrors.password : []}
        />
      </div>

      <RegularBtn
        type="submit"
        text="Sign in"
        LeftIcon={LogIn}
        leftIconProps={{ className: 'h-5 w-5' }}
        loading={loading}
        size="full"
      />

      <p className="text-center text-sm text-muted-foreground">
        Forgot your password?{' '}
        <a href="#" className="text-primary hover:text-primary/80 font-medium transition-colors">
          Reset it here
        </a>
      </p>
    </form>
  );
};
