'use client';

import Image from 'next/image';
import { Star } from 'lucide-react';
import { format, formatDistanceToNow } from 'date-fns';
import type { ClientTestimonial } from '@/lib/constants/endpoints';
import { cn } from '@/lib/utils';

export type TestimonialCardProps = {
  testimonial: ClientTestimonial;
  className?: string;
  /** When true, omits hover lift — useful inside carousels or static previews */
  static?: boolean;
};

function parseTestimonialDate(iso?: string): Date | null {
  if (!iso) return null;

  const date = new Date(iso);

  return Number.isNaN(date.getTime()) ? null : date;
}

function StarRating({ rating, className }: { rating: number; className?: string }) {
  const clamped = Math.min(5, Math.max(1, Math.round(rating)));

  return (
    <div
      className={cn('flex shrink-0 items-center gap-px', className)}
      role="img"
      aria-label={`Rated ${clamped} out of 5 stars`}>
      {Array.from({ length: 5 }, (_, i) => (
        <Star
          key={i}
          aria-hidden
          className={cn(
            'size-3.5',
            i < clamped ? 'fill-amber-400 text-amber-400' : 'fill-muted/25 text-muted-foreground/20'
          )}
        />
      ))}
    </div>
  );
}

function buildClientSubtitle(testimonial: ClientTestimonial): string | null {
  const parts = [testimonial.clientRole, testimonial.companyName].filter(Boolean);

  return parts.length > 0 ? parts.join(' · ') : null;
}

export const TestimonialCard = ({
  testimonial,
  className,
  static: isStatic,
}: TestimonialCardProps) => {
  const createdAt = parseTestimonialDate(testimonial.createdAt);
  const subtitle = buildClientSubtitle(testimonial);
  const hasRating = testimonial.rating != null && testimonial.rating > 0;

  return (
    <figure
      className={cn(
        'group w-full max-w-[32rem] rounded-xl border border-white/5 bg-card text-foreground shadow-sm',
        !isStatic &&
          'motion-safe:transition-[box-shadow,border-color,transform] motion-safe:duration-300',
        !isStatic &&
          'hover:border-primary/35 hover:shadow-elegant motion-safe:hover:-translate-y-0.5',
        className
      )}>
      <div className="px-5 py-7 md:px-6 md:py-8">
        <div className="mb-6 flex items-center justify-between gap-3">
          {createdAt ? (
            <time
              dateTime={testimonial.createdAt}
              className="text-xs italic text-muted-foreground"
              title={format(createdAt, 'PPP')}>
              {formatDistanceToNow(createdAt, { addSuffix: true })}
            </time>
          ) : (
            <span className="text-xs italic text-muted-foreground/50" aria-hidden>
              —
            </span>
          )}

          {hasRating ? <StarRating rating={testimonial.rating!} /> : null}
        </div>

        <blockquote className="mb-7">
          <p className="text-left font-body text-sm leading-[1.7] text-foreground/95">
            {testimonial.testimonial}
          </p>
        </blockquote>

        <figcaption className="flex items-center justify-between gap-3 border-t border-white/5 pt-6">
          <div className="flex min-w-0 items-center gap-2.5">
            {testimonial.clientImage ? (
              <Image
                src={testimonial.clientImage}
                alt=""
                width={40}
                height={40}
                sizes="40px"
                className="size-10 shrink-0 rounded-full object-cover"
              />
            ) : (
              <div
                aria-hidden
                className="flex size-10 shrink-0 items-center justify-center rounded-full bg-muted font-heading text-sm font-semibold text-muted-foreground">
                {testimonial.clientName.charAt(0)}
              </div>
            )}

            <div className="min-w-0">
              <cite className="not-italic">
                <span className="block truncate font-heading text-sm font-semibold leading-tight text-foreground">
                  {testimonial.clientName}
                </span>
              </cite>
              {subtitle ? (
                <p className="mt-0.5 truncate text-xs leading-snug text-muted-foreground">
                  {subtitle}
                </p>
              ) : null}
            </div>
          </div>

          {testimonial.companyLogo ? (
            <div className="relative size-10 shrink-0 overflow-hidden rounded-md border border-border bg-background p-1">
              <Image
                src={testimonial.companyLogo}
                alt={testimonial.companyName ? `${testimonial.companyName} logo` : 'Company logo'}
                fill
                sizes="40px"
                className="object-contain object-center"
              />
            </div>
          ) : null}
        </figcaption>
      </div>
    </figure>
  );
};
