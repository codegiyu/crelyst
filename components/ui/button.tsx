import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-[6px] transition-all cursor-pointer transition-all duration-300 ease-in disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive blur-0',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-primary/90',
        destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
        outline: 'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
        secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
        link: 'text-primary underline-offset-4 hover:underline',
        hero: 'bg-primary hover:bg-primary-light text-primary-foreground shadow-elegant hover:shadow-gold hover:-translate-y-0.5 duration-300',
        accent: 'bg-accent hover:bg-accent/90 text-accent-foreground shadow-gold duration-300',
        none: '',
      },
      size: {
        default: 'w-fit px-6 py-3.5',
        sm: 'w-fit py-2 px-4',
        lg: 'w-fit py-3 px-8',
        xl: 'w-fit py-4.5 px-10',
        icon: '',
        full: 'w-full py-3 px-8',
      },
      typo: {
        default: 'font-inter text-sm font-medium',
        small: 'font-inter text-xs font-medium',
        large: 'font-semibold text-base',
        custom: '',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
      typo: 'default',
    },
  }
);

interface ButtonProps extends React.ComponentProps<'button'>, VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

function Button({ className, variant, size, typo, asChild = false, ...props }: ButtonProps) {
  const Comp = asChild ? Slot : 'button';

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, typo, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants, type ButtonProps };
