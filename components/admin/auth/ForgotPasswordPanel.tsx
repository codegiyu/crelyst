'use client';

import { FormEvent, useState } from 'react';
import { z } from 'zod';
import { ArrowLeft, Mail } from 'lucide-react';
import { toast } from 'sonner';
import { sendPasswordReset } from '@/lib/firebase/auth';
import { RegularInput } from '@/components/atoms/RegularInput';
import { RegularBtn } from '@/components/atoms/RegularBtn';

const forgotSchema = z.object({
  email: z.email('Please enter a valid email'),
});

type ForgotPasswordPanelProps = {
  onBack: () => void;
  defaultEmail?: string;
};

export function ForgotPasswordPanel({ onBack, defaultEmail = '' }: ForgotPasswordPanelProps) {
  const [email, setEmail] = useState(defaultEmail);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    const parsed = forgotSchema.safeParse({ email: email.trim() });

    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? 'Invalid email');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await sendPasswordReset(parsed.data.email);
      toast.success('Check your inbox for a password reset link.');
      onBack();
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Failed to send reset email. Please try again.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="grid gap-6">
      {error ? (
        <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      ) : null}

      <p className="text-sm text-muted-foreground">
        Enter the email associated with your admin account. We will send you a link to reset your
        password.
      </p>

      <RegularInput
        label="Email address"
        name="email"
        type="email"
        autoComplete="email"
        required
        placeholder="admin@example.com"
        value={email}
        onChange={event => setEmail(event.target.value)}
      />

      <RegularBtn
        type="submit"
        text="Send reset link"
        LeftIcon={Mail}
        leftIconProps={{ className: 'h-5 w-5' }}
        loading={loading}
        size="full"
      />

      <button
        type="button"
        onClick={onBack}
        className="inline-flex items-center justify-center gap-2 text-sm font-medium text-primary transition-colors hover:text-primary/80">
        <ArrowLeft className="h-4 w-4" aria-hidden />
        Back to sign in
      </button>
    </form>
  );
}
