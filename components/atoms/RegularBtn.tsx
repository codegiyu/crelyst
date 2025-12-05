'use client';
import {
  type KeyboardEvent,
  type SVGProps,
  MouseEvent,
  ComponentPropsWithoutRef,
  ComponentPropsWithRef,
} from 'react';
import { buttonVariants } from '../ui/button';
import { type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { omit } from 'lodash';
import { Loader } from 'lucide-react';
import { LucideIconComp } from '@/lib/types/general';

export interface RegularBtnProps
  extends ComponentPropsWithRef<'button'>,
    VariantProps<typeof buttonVariants> {
  LeftIcon?: LucideIconComp;
  RightIcon?: LucideIconComp;
  leftIconProps?: SVGProps<SVGSVGElement>;
  rightIconProps?: SVGProps<SVGSVGElement>;
  text?: string;
  textClassName?: string;
  children?: React.ReactNode;
  loading?: boolean;
  loadingIconBesideText?: boolean;
  loadingIconClassName?: string;
  onDisabledClick?: () => void;
  onClick?: (e?: MouseEvent<HTMLButtonElement>) => void;
  wrapClassName?: string;
  linkProps?: Omit<ComponentPropsWithoutRef<'a'>, 'onClick' | 'className' | 'children' | 'href'> & {
    href: string;
    preventdefault?: string;
  };
}

export const RegularBtn = ({
  LeftIcon,
  RightIcon,
  leftIconProps = {},
  rightIconProps = {},
  className = '',
  text = '',
  textClassName = '',
  children,
  variant = 'default',
  size = 'default',
  typo = 'default',
  loading = false,
  loadingIconBesideText = false,
  loadingIconClassName,
  onDisabledClick,
  disabled = false,
  wrapClassName = '',
  onMouseEnter,
  linkProps,
  ref,
  ...props
}: RegularBtnProps) => {
  const fullWrapClassName = cn(
    `inline-block leading-none ${!!onDisabledClick && disabled ? 'cursor-pointer focus-visible:outline-gray-border focus-visible:outline-1' : 'cursor-default'} focus:outline-none focus-visible:outline-white/60 focus-visible:outline-2 outline-offset-2`,
    size === 'full' || className.includes('w-full') ? 'w-full' : 'w-fit',
    wrapClassName
  );
  const wrapProps = {
    ...(disabled && {
      tabIndex: 0,
      role: 'button',
      onKeyDown: (e: KeyboardEvent<HTMLDivElement>) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault(); // Prevent scrolling when pressing Space
          onDisabledClick?.();
        }
      },
      onClick: () => onDisabledClick?.(),
    }),
  };
  const mainEl = (
    <button
      className={cn(buttonVariants({ size, variant, typo, className }), 'group')}
      ref={ref}
      disabled={loading || disabled}
      onMouseEnter={e => {
        if (onMouseEnter) onMouseEnter(e);
      }}
      aria-label={props['aria-label'] || text || 'button'}
      {...omit(props, ['aria-label'])}>
      {loading && children ? (
        <Loader className={cn('size-4 text-white animate-pulse', loadingIconClassName)} />
      ) : !loading && children ? (
        children
      ) : loading && !loadingIconBesideText ? (
        <Loader className={cn('size-4 text-white animate-pulse', loadingIconClassName)} />
      ) : (
        <>
          {LeftIcon && <LeftIcon {...leftIconProps} />}
          <div className="gap-3 grid place-items-center transition-colors relative overflow-hidden">
            <span className={cn('font-inter ', textClassName)}>{text}</span>
            {loading && (
              <Loader className={cn('size-4 text-white animate-pulse', loadingIconClassName)} />
            )}
          </div>
          {RightIcon && <RightIcon {...rightIconProps} />}
        </>
      )}
    </button>
  );

  return (
    <>
      {linkProps && !disabled ? (
        <Link
          onClick={(e: MouseEvent<HTMLAnchorElement>) => {
            if (linkProps.preventdefault === 'true') e.preventDefault();
            props.onClick?.();
          }}
          className={fullWrapClassName}
          {...linkProps}>
          {mainEl}
        </Link>
      ) : (
        <div className={fullWrapClassName} {...wrapProps}>
          {mainEl}
        </div>
      )}
    </>
  );
};
