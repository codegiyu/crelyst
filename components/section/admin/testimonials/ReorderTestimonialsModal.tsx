'use client';

import { useState, useEffect } from 'react';
import { Modal } from '@/components/ui/Modal';
import { callApi } from '@/lib/services/callApi';
import { toast } from 'sonner';
import type { ClientTestimonial } from '@/lib/constants/endpoints';
import { GripVertical, Star } from 'lucide-react';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface ReorderTestimonialsModalProps {
  testimonials: ClientTestimonial[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

interface ReorderableTestimonial extends ClientTestimonial {
  newDisplayOrder: number;
}

export const ReorderTestimonialsModal = ({
  testimonials,
  open,
  onOpenChange,
  onSuccess,
}: ReorderTestimonialsModalProps) => {
  const [loading, setLoading] = useState(false);
  const [orderedTestimonials, setOrderedTestimonials] = useState<ReorderableTestimonial[]>([]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const hasChanges = () => {
    return orderedTestimonials.some((testimonial, index) => {
      const originalIndex = testimonials
        .sort((a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0))
        .findIndex(t => t._id === testimonial._id);
      return originalIndex !== index;
    });
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setOrderedTestimonials(items => {
        const oldIndex = items.findIndex(item => item._id === active.id);
        const newIndex = items.findIndex(item => item._id === over.id);

        const newOrder = arrayMove(items, oldIndex, newIndex);
        return newOrder.map((testimonial, index) => ({
          ...testimonial,
          newDisplayOrder: index + 1,
        }));
      });
    }
  };

  const handleSave = async () => {
    if (!hasChanges()) {
      onOpenChange(false);
      return;
    }

    setLoading(true);
    try {
      const reorderItems = orderedTestimonials.map(testimonial => ({
        id: testimonial._id,
        displayOrder: testimonial.newDisplayOrder,
      }));

      const { error } = await callApi('ADMIN_REORDER_TESTIMONIALS', {
        payload: { reorderItems },
      });

      if (error) {
        toast.error(error.message || 'Failed to reorder testimonials');
        return;
      }

      toast.success('Testimonials reordered successfully');
      onSuccess();
      onOpenChange(false);
    } catch {
      toast.error('Failed to reorder testimonials');
    } finally {
      setLoading(false);
    }
  };

  // Initialize ordered testimonials when modal opens
  useEffect(() => {
    if (open && testimonials.length > 0) {
      const sorted = [...testimonials]
        .sort((a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0))
        .map((testimonial, index) => ({
          ...testimonial,
          newDisplayOrder: index + 1,
        }));
      setOrderedTestimonials(sorted);
    }
  }, [open, testimonials]);

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      maxWidth="lg"
      header={{
        title: 'Reorder Testimonials',
        description: 'Drag and drop testimonials to change their display order on the website.',
      }}
      cancelButton={{
        text: 'Cancel',
        disabled: loading,
      }}
      submitButton={{
        text: 'Save Order',
        loading,
        onClick: handleSave,
        disabled: !hasChanges(),
      }}>
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext
          items={orderedTestimonials.map(t => t._id)}
          strategy={verticalListSortingStrategy}>
          <div className="space-y-2">
            {orderedTestimonials.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No testimonials to reorder
              </div>
            ) : (
              orderedTestimonials.map((testimonial, index) => (
                <ReorderableTestimonialItem
                  key={testimonial._id}
                  testimonial={testimonial}
                  index={index}
                />
              ))
            )}
          </div>
        </SortableContext>
      </DndContext>
    </Modal>
  );
};

interface ReorderableTestimonialItemProps {
  testimonial: ReorderableTestimonial;
  index: number;
}

const ReorderableTestimonialItem = ({ testimonial, index }: ReorderableTestimonialItemProps) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: testimonial._id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        'flex items-center gap-3 p-3 rounded-lg border bg-card transition-colors',
        'hover:border-primary/50 hover:bg-accent/30',
        isDragging && 'ring-2 ring-primary ring-offset-2'
      )}>
      {/* Drag handle */}
      <div
        {...attributes}
        {...listeners}
        className="text-muted-foreground cursor-grab active:cursor-grabbing hover:text-foreground transition-colors">
        <GripVertical className="size-5" />
      </div>

      {/* Position number */}
      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary text-sm font-semibold shrink-0">
        {index + 1}
      </div>

      {/* Testimonial info */}
      <div className="flex items-center gap-3 flex-1 min-w-0">
        {testimonial.clientImage ? (
          <div className="relative w-10 h-10 rounded-full overflow-hidden shrink-0 bg-muted">
            <Image
              src={testimonial.clientImage}
              alt={testimonial.clientName}
              fill
              className="object-cover"
              sizes="40px"
            />
          </div>
        ) : (
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
            <span className="text-sm font-semibold text-primary">
              {testimonial.clientName.charAt(0).toUpperCase()}
            </span>
          </div>
        )}
        <div className="min-w-0 flex-1">
          <h4 className="font-medium text-foreground truncate">{testimonial.clientName}</h4>
          <p className="text-xs text-muted-foreground truncate">
            {testimonial.clientRole}
            {testimonial.clientRole && testimonial.companyName && ' at '}
            {testimonial.companyName}
          </p>
        </div>
      </div>

      {/* Rating */}
      {testimonial.rating && (
        <div className="flex items-center gap-1 shrink-0">
          {Array.from({ length: 5 }).map((_, idx) => (
            <Star
              key={idx}
              className={cn(
                'size-3',
                idx < testimonial.rating!
                  ? 'fill-yellow-400 text-yellow-400'
                  : 'fill-muted text-muted'
              )}
            />
          ))}
        </div>
      )}

      {/* Status indicator */}
      <div
        className={cn(
          'px-2 py-0.5 rounded-full text-xs font-medium shrink-0',
          testimonial.isActive
            ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
            : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'
        )}>
        {testimonial.isActive ? 'Active' : 'Inactive'}
      </div>

      {/* Featured indicator */}
      {testimonial.isFeatured && (
        <div className="px-2 py-0.5 rounded-full text-xs font-medium shrink-0 bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
          Featured
        </div>
      )}
    </div>
  );
};
