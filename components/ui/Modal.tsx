'use client';

import { ReactNode, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { RegularBtn, RegularBtnProps } from '@/components/atoms/RegularBtn';
import { cn } from '@/lib/utils';
import { omit } from 'lodash';

export interface ModalHeaderProps {
  title: string;
  description?: string;
}

export interface ModalProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  trigger?: ReactNode;
  header: ModalHeaderProps;
  submitButton?: RegularBtnProps;
  cancelButton?: RegularBtnProps;
  children: ReactNode;
  contentClassName?: string;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | 'full';
}

const maxWidthClasses = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
  '2xl': 'max-w-2xl',
  '3xl': 'max-w-3xl',
  '4xl': 'max-w-4xl',
  full: 'max-w-full',
};

export function Modal({
  open: controlledOpen,
  onOpenChange: controlledOnOpenChange,
  trigger,
  header,
  submitButton,
  cancelButton,
  children,
  contentClassName,
  maxWidth = 'lg',
}: ModalProps) {
  const [internalOpen, setInternalOpen] = useState(false);

  // Use controlled state if provided, otherwise use internal state
  const isOpen = controlledOpen !== undefined ? controlledOpen : internalOpen;
  const setIsOpen = controlledOnOpenChange || setInternalOpen;

  const handleCancel = () => {
    cancelButton?.onClick?.();
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      {isOpen && (
        <DialogContent
          className={cn(
            maxWidthClasses[maxWidth],
            `grid ${submitButton || cancelButton ? 'grid-rows-[auto_1fr_auto]' : 'grid-rows-[auto_1fr]'}`,
            contentClassName
          )}>
          <DialogHeader>
            <DialogTitle>{header.title}</DialogTitle>
            {header.description && <DialogDescription>{header.description}</DialogDescription>}
          </DialogHeader>
          <div className="h-full py-4 overflow-hidden">
            <div className="h-full px-2 sleek-scrollbar overflow-y-auto">{children}</div>
          </div>
          {(submitButton || cancelButton) && (
            <DialogFooter>
              {cancelButton && (
                <RegularBtn
                  {...omit(cancelButton, [
                    'text',
                    'variant',
                    'onClick',
                    'disabled',
                    'loading',
                    'className',
                  ])}
                  text={cancelButton.text || 'Cancel'}
                  variant="destructive"
                  onClick={handleCancel}
                  disabled={cancelButton.disabled || submitButton?.loading}
                  loading={cancelButton.loading}
                  className={cn(
                    'text-destructive bg-transparent font-medium hover:bg-transparent',
                    cancelButton.className
                  )}
                />
              )}
              {submitButton && (
                <RegularBtn {...submitButton} text={submitButton.text || 'Submit'} />
              )}
            </DialogFooter>
          )}
        </DialogContent>
      )}
    </Dialog>
  );
}
