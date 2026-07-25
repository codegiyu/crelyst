'use client';

import { useState } from 'react';
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
import { AdminAsyncSection } from '@/components/general/admin/AdminAsyncSection';
import type { ClientTestimonial } from '@/lib/constants/endpoints';
import Image from 'next/image';
import { callApi } from '@/lib/services/callApi';
import { adminCallApiToast } from '@/lib/utils/adminMutationToast';
import { useAdminEditDeepLink } from '@/lib/hooks/use-admin-edit-deep-link';
import { useAdminResource } from '@/lib/hooks/use-admin-resource';
import { useRemoteListItems } from '@/lib/hooks/use-remote-list-items';
import { cn } from '@/lib/utils';

const LIST_QUERY = '?limit=100' as const;

export const TestimonialsPageClient = () => {
  const list = useAdminResource({
    resourceKey: ['admin', 'testimonials', { limit: 100 }],
    endpoint: 'ADMIN_LIST_TESTIMONIALS',
    options: { query: LIST_QUERY },
    sectionLabel: 'testimonials',
  });

  const [testimonials, setTestimonials] = useRemoteListItems(list.data?.testimonials);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState<ClientTestimonial | null>(null);
  const [deleteTestimonial, setDeleteTestimonial] = useState<ClientTestimonial | null>(null);
  const [isReorderOpen, setIsReorderOpen] = useState(false);

  const nextDisplayOrder =
    testimonials.reduce((max, t) => Math.max(max, t.displayOrder ?? 0), 0) + 1;

  const handleCreate = () => {
    setEditingTestimonial(null);
    setIsFormOpen(true);
  };

  const handleEdit = (testimonial: ClientTestimonial) => {
    setEditingTestimonial(testimonial);
    setIsFormOpen(true);
  };

  useAdminEditDeepLink(testimonials, handleEdit);

  const handleFormSuccess = () => {
    setIsFormOpen(false);
    setEditingTestimonial(null);
    void list.reload();
  };

  const handleToggleFeatured = async (testimonial: ClientTestimonial) => {
    const data = await adminCallApiToast(
      'Updating testimonial…',
      () =>
        callApi('ADMIN_UPDATE_TESTIMONIAL', {
          query: `/${testimonial._id}`,
          payload: { isFeatured: !testimonial.isFeatured },
        }),
      d => `Testimonial ${d.testimonial.isFeatured ? 'featured' : 'unfeatured'}`
    );
    if (data) {
      setTestimonials(prev =>
        prev.map(t => (t._id === data.testimonial._id ? data.testimonial : t))
      );
    }
  };

  const handleToggleActive = async (testimonial: ClientTestimonial) => {
    const data = await adminCallApiToast(
      'Updating testimonial…',
      () =>
        callApi('ADMIN_UPDATE_TESTIMONIAL', {
          query: `/${testimonial._id}`,
          payload: { isActive: !testimonial.isActive },
        }),
      d => `Testimonial ${d.testimonial.isActive ? 'activated' : 'deactivated'}`
    );
    if (data) {
      setTestimonials(prev =>
        prev.map(t => (t._id === data.testimonial._id ? data.testimonial : t))
      );
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
              disabled={list.isError || list.isLoading}
              onClick={() => setIsReorderOpen(true)}
            />
          )}
          <RegularBtn
            text="Add Testimonial"
            LeftIcon={Plus}
            leftIconProps={{ className: 'size-5' }}
            disabled={list.isError || list.isLoading}
            onClick={handleCreate}
          />
        </div>
      }>
      <AdminAsyncSection
        status={list.status}
        errorMessage={list.errorMessage}
        onRetry={() => void list.reload()}
        hasData={list.data != null}>
        {testimonials.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="rounded-full bg-muted p-4 mb-4">
              <Quote className="size-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold text-foreground">No testimonials yet</h3>
            <p className="text-muted-foreground mb-4">
              Get started by adding your first testimonial
            </p>
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
                <AdminTestimonialCard
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
      </AdminAsyncSection>

      {/* Create/Edit Modal */}
      <TestimonialFormModal
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        testimonial={editingTestimonial}
        nextDisplayOrder={nextDisplayOrder}
        onSuccess={handleFormSuccess}
      />

      {/* Delete Dialog */}
      <DeleteTestimonialDialog
        testimonial={deleteTestimonial}
        open={!!deleteTestimonial}
        onOpenChange={open => !open && setDeleteTestimonial(null)}
        onSuccess={() => {
          setDeleteTestimonial(null);
          void list.reload();
        }}
      />

      {/* Reorder Modal */}
      <ReorderTestimonialsModal
        testimonials={testimonials}
        open={isReorderOpen}
        onOpenChange={setIsReorderOpen}
        onSuccess={() => void list.reload()}
      />
    </DashboardPageWrapper>
  );
};

interface AdminTestimonialCardProps {
  testimonial: ClientTestimonial;
  onEdit: () => void;
  onDelete: () => void;
  onToggleFeatured: () => void;
  onToggleActive: () => void;
}

function buildAdminSubtitle(testimonial: ClientTestimonial): string | null {
  const parts = [testimonial.clientRole, testimonial.companyName].filter(Boolean);

  return parts.length > 0 ? parts.join(' · ') : null;
}

const AdminTestimonialCard = ({
  testimonial,
  onEdit,
  onDelete,
  onToggleFeatured,
  onToggleActive,
}: AdminTestimonialCardProps) => {
  const subtitle = buildAdminSubtitle(testimonial);

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
              {subtitle ? (
                <p className="text-sm text-muted-foreground truncate">{subtitle}</p>
              ) : null}
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
          &ldquo;{testimonial.testimonial}&rdquo;
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
