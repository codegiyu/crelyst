import { cn } from '@/lib/utils';
import { ComponentPropsWithRef } from 'react';

type TextareaProps = ComponentPropsWithRef<'textarea'>;

function Textarea({ className, ...props }: TextareaProps) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        'w-full px-4 py-4 bg-transparent border border-border rounded-[6px] \
        focus:ring-2 focus:ring-primary focus:border-transparent \
        transition-all duration-200 font-inter \
        placeholder:text-muted-foreground focus-visible:border-primary \
        focus-visible:ring-primary/50 aria-invalid:ring-destructive/20 \
        aria-invalid:border-destructive \
        flex text-sm outline-none focus-visible:ring-[2px] \
        disabled:cursor-not-allowed disabled:opacity-50 md:text-base',
        className
      )}
      {...props}
    />
  );
}

export { Textarea, type TextareaProps };
