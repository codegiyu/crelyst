/* eslint-disable react-hooks/exhaustive-deps */
'use client';

import { useEffect, useState } from 'react';
import { useTestimonialsStore } from '@/lib/store/useTestimonialsStore';
import {
  Plus,
  Pencil,
  Trash2,
  MoreHorizontal,
  Star,
  StarOff,
  Quote,
  Eye,
  EyeOff,
  ArrowUpDown,
} from 'lucide-react';
import { RegularBtn } from '@/components/atoms/RegularBtn';
import { Skeleton } from '@/components/ui/skeleton';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { TestimonialFormModal } from './TestimonialFormModal';
import { DeleteTestimonialDialog } from './DeleteTestimonialDialog';
import { ReorderTestimonialsModal } from './ReorderTestimonialsModal';
import { DashboardPageWrapper } from '@/components/general/DashboardPageWrapper';
import type { ClientTestimonial } from '@/lib/constants/endpoints';
import Image from 'next/image';
import { toast } from 'sonner';
import { callApi } from '@/lib/services/callApi';
import { cn } from '@/lib/utils';

export const TestimonialsPageClient = () => {
  const { testimonials, actions, isLoading } = useTestimonialsStore(state => state);
  const { fetchTestimonials, updateTestimonial } = actions;

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState<ClientTestimonial | null>(null);
  const [deleteTestimonial, setDeleteTestimonial] = useState<ClientTestimonial | null>(null);
  const [isReorderOpen, setIsReorderOpen] = useState(false);

  useEffect(() => {
    fetchTestimonials({ force: true, useAdminEndpoint: true });
  }, []);

  const handleCreate = () => {
    setEditingTestimonial(null);
    setIsFormOpen(true);
  };

  const handleEdit = (testimonial: ClientTestimonial) => {
    setEditingTestimonial(testimonial);
    setIsFormOpen(true);
  };

  const handleFormSuccess = () => {
    setIsFormOpen(false);
    setEditingTestimonial(null);
    fetchTestimonials({ force: true, useAdminEndpoint: true });
  };

  const handleToggleFeatured = async (testimonial: ClientTestimonial) => {
    try {
      const { data, error } = await callApi('ADMIN_UPDATE_TESTIMONIAL', {
        query: `/${testimonial._id}`,
        payload: { isFeatured: !testimonial.isFeatured },
      });

      if (error || !data) {
        toast.error(error?.message || 'Failed to update testimonial');
        return;
      }

      updateTestimonial(data.testimonial);
      toast.success(`Testimonial ${data.testimonial.isFeatured ? 'featured' : 'unfeatured'}`);
    } catch {
      toast.error('Failed to update testimonial');
    }
  };

  const handleToggleActive = async (testimonial: ClientTestimonial) => {
    try {
      const { data, error } = await callApi('ADMIN_UPDATE_TESTIMONIAL', {
        query: `/${testimonial._id}`,
        payload: { isActive: !testimonial.isActive },
      });

      if (error || !data) {
        toast.error(error?.message || 'Failed to update testimonial');
        return;
      }

      updateTestimonial(data.testimonial);
      toast.success(`Testimonial ${data.testimonial.isActive ? 'activated' : 'deactivated'}`);
    } catch {
      toast.error('Failed to update testimonial');
    }
  };

  return (
    <DashboardPageWrapper
      header={{
        title: 'Testimonials',
        description: 'Manage your client testimonials and reviews',
      }}
      headerActions={
        <div className="flex items-center gap-2">
          {testimonials.length > 1 && (
            <RegularBtn
              text="Reorder"
              variant="outline"
              LeftIcon={ArrowUpDown}
              leftIconProps={{ className: 'size-4' }}
              onClick={() => setIsReorderOpen(true)}
            />
          )}
          <RegularBtn
            text="Add Testimonial"
            LeftIcon={Plus}
            leftIconProps={{ className: 'size-5' }}
            onClick={handleCreate}
          />
        </div>
      }>
      {/* Testimonials Grid */}
      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, idx) => (
            <TestimonialCardSkeleton key={idx} />
          ))}
        </div>
      ) : testimonials.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="rounded-full bg-muted p-4 mb-4">
            <Quote className="size-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold text-foreground">No testimonials yet</h3>
          <p className="text-muted-foreground mb-4">Get started by adding your first testimonial</p>
          <RegularBtn
            text="Add Testimonial"
            LeftIcon={Plus}
            leftIconProps={{ className: 'size-5' }}
            onClick={handleCreate}
          />
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[...testimonials]
            .sort((a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0))
            .map(testimonial => (
              <TestimonialCard
                key={testimonial._id}
                testimonial={testimonial}
                onEdit={() => handleEdit(testimonial)}
                onDelete={() => setDeleteTestimonial(testimonial)}
                onToggleFeatured={() => handleToggleFeatured(testimonial)}
                onToggleActive={() => handleToggleActive(testimonial)}
              />
            ))}
        </div>
      )}

      {/* Create/Edit Modal */}
      <TestimonialFormModal
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        testimonial={editingTestimonial}
        onSuccess={handleFormSuccess}
      />

      {/* Delete Dialog */}
      <DeleteTestimonialDialog
        testimonial={deleteTestimonial}
        open={!!deleteTestimonial}
        onOpenChange={open => !open && setDeleteTestimonial(null)}
        onSuccess={() => {
          setDeleteTestimonial(null);
          fetchTestimonials({ force: true, useAdminEndpoint: true });
        }}
      />

      {/* Reorder Modal */}
      <ReorderTestimonialsModal
        testimonials={testimonials}
        open={isReorderOpen}
        onOpenChange={setIsReorderOpen}
        onSuccess={() => fetchTestimonials({ force: true, useAdminEndpoint: true })}
      />
    </DashboardPageWrapper>
  );
};

interface TestimonialCardProps {
  testimonial: ClientTestimonial;
  onEdit: () => void;
  onDelete: () => void;
  onToggleFeatured: () => void;
  onToggleActive: () => void;
}

const TestimonialCard = ({
  testimonial,
  onEdit,
  onDelete,
  onToggleFeatured,
  onToggleActive,
}: TestimonialCardProps) => {
  return (
    <div className="group relative rounded-xl border bg-card shadow-sm overflow-hidden hover:shadow-md transition-shadow">
      {/* Header with client info */}
      <div className="p-4 pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-3 min-w-0">
            {/* Client Image */}
            {testimonial.clientImage ? (
              <div className="relative size-12 rounded-full overflow-hidden shrink-0 bg-muted">
                <Image
                  src={testimonial.clientImage}
                  alt={testimonial.clientName}
                  fill
                  className="object-cover"
                  sizes="48px"
                />
              </div>
            ) : (
              <div className="size-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <span className="text-lg font-semibold text-primary">
                  {testimonial.clientName.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
            <div className="min-w-0">
              <h3 className="font-semibold text-foreground truncate">{testimonial.clientName}</h3>
              {(testimonial.clientRole || testimonial.companyName) && (
                <p className="text-sm text-muted-foreground truncate">
                  {testimonial.clientRole}
                  {testimonial.clientRole && testimonial.companyName && ' at '}
                  {testimonial.companyName}
                </p>
              )}
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <RegularBtn variant="ghost" size="icon" className="shrink-0">
                <MoreHorizontal className="size-4" />
              </RegularBtn>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={onEdit}>
                <Pencil className="size-4 mr-2" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onToggleFeatured}>
                {testimonial.isFeatured ? (
                  <>
                    <StarOff className="size-4 mr-2" />
                    Unfeature
                  </>
                ) : (
                  <>
                    <Star className="size-4 mr-2" />
                    Feature
                  </>
                )}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onToggleActive}>
                {testimonial.isActive ? (
                  <>
                    <EyeOff className="size-4 mr-2" />
                    Deactivate
                  </>
                ) : (
                  <>
                    <Eye className="size-4 mr-2" />
                    Activate
                  </>
                )}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={onDelete}
                className="text-destructive focus:text-destructive">
                <Trash2 className="size-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Testimonial content */}
      <div className="px-4 pb-4">
        {/* Rating */}
        {testimonial.rating && (
          <div className="flex items-center gap-1 mb-2">
            {Array.from({ length: 5 }).map((_, idx) => (
              <Star
                key={idx}
                className={`size-4 ${
                  idx < testimonial.rating!
                    ? 'fill-yellow-400 text-yellow-400'
                    : 'fill-muted text-muted'
                }`}
              />
            ))}
          </div>
        )}

        {/* Quote */}
        <p className="text-sm text-muted-foreground line-clamp-4 italic">
          "{testimonial.testimonial}"
        </p>

        {/* Badges and Company Logo */}
        <div className="flex items-center justify-between gap-2 mt-3">
          <div className="flex items-center gap-2 flex-wrap">
            <span
              className={cn(
                'px-2 py-0.5 rounded-full text-xs font-medium',
                testimonial.isActive
                  ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                  : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'
              )}>
              {testimonial.isActive ? 'Active' : 'Inactive'}
            </span>
            {testimonial.isFeatured && (
              <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400">
                Featured
              </span>
            )}
          </div>
          {testimonial.companyLogo && (
            <div className="relative h-8 w-20 shrink-0 bg-transparent rounded overflow-hidden">
              <Image
                src={testimonial.companyLogo}
                alt={testimonial.companyName || 'Company logo'}
                fill
                className="object-contain p-1"
                sizes="80px"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const TestimonialCardSkeleton = () => (
  <div className="rounded-xl border bg-card shadow-sm overflow-hidden p-4">
    <div className="flex items-center gap-3 mb-4">
      <Skeleton className="size-12 rounded-full" />
      <div className="grid gap-2 flex-1">
        <Skeleton className="h-4 w-2/3" />
        <Skeleton className="h-3 w-1/2" />
      </div>
    </div>
    <div className="grid gap-2">
      <Skeleton className="h-3 w-full" />
      <Skeleton className="h-3 w-full" />
      <Skeleton className="h-3 w-3/4" />
    </div>
  </div>
);
