import AuthLayout from '@/components/layout/AuthLayout';
import { LoginForm } from '@/components/section/admin/auth/LoginForm';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Admin Login',
  description: 'Sign in to access the admin dashboard',
};

export default function AdminLoginPage() {
  return (
    <AuthLayout subtitle="Sign in to your account">
      <LoginForm />
    </AuthLayout>
  );
}
