'use client';

import { useState, useEffect } from 'react';
import { Modal } from '@/components/ui/Modal';
import { callApi } from '@/lib/services/callApi';
import { toast } from 'sonner';
import type { ClientBrand } from '@/lib/constants/endpoints';
import { GripVertical } from 'lucide-react';
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

interface ReorderBrandsModalProps {
  brands: ClientBrand[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

interface ReorderableBrand extends ClientBrand {
  newDisplayOrder: number;
}

export const ReorderBrandsModal = ({
  brands,
  open,
  onOpenChange,
  onSuccess,
}: ReorderBrandsModalProps) => {
  const [loading, setLoading] = useState(false);
  const [orderedBrands, setOrderedBrands] = useState<ReorderableBrand[]>([]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const hasChanges = () => {
    return orderedBrands.some((brand, index) => {
      const originalIndex = brands
        .sort((a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0))
        .findIndex(b => b._id === brand._id);
      return originalIndex !== index;
    });
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setOrderedBrands(items => {
        const oldIndex = items.findIndex(item => item._id === active.id);
        const newIndex = items.findIndex(item => item._id === over.id);

        const newOrder = arrayMove(items, oldIndex, newIndex);
        return newOrder.map((brand, index) => ({
          ...brand,
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
      const reorderItems = orderedBrands.map(brand => ({
        id: brand._id,
        displayOrder: brand.newDisplayOrder,
      }));

      const { error } = await callApi('ADMIN_REORDER_BRANDS', {
        payload: { reorderItems },
      });

      if (error) {
        toast.error(error.message || 'Failed to reorder brands');
        return;
      }

      toast.success('Brands reordered successfully');
      onSuccess();
      onOpenChange(false);
    } catch {
      toast.error('Failed to reorder brands');
    } finally {
      setLoading(false);
    }
  };

  // Initialize ordered brands when modal opens
  useEffect(() => {
    if (open && brands.length > 0) {
      const sorted = [...brands]
        .sort((a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0))
        .map((brand, index) => ({
          ...brand,
          newDisplayOrder: index + 1,
        }));
      setOrderedBrands(sorted);
    }
  }, [open, brands]);

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      maxWidth="lg"
      header={{
        title: 'Reorder Brands',
        description: 'Drag and drop brands to change their display order on the website.',
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
          items={orderedBrands.map(b => b._id)}
          strategy={verticalListSortingStrategy}>
          <div className="space-y-2">
            {orderedBrands.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">No brands to reorder</div>
            ) : (
              orderedBrands.map((brand, index) => (
                <ReorderableBrandItem key={brand._id} brand={brand} index={index} />
              ))
            )}
          </div>
        </SortableContext>
      </DndContext>
    </Modal>
  );
};

interface ReorderableBrandItemProps {
  brand: ReorderableBrand;
  index: number;
}

const ReorderableBrandItem = ({ brand, index }: ReorderableBrandItemProps) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: brand._id,
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

      {/* Brand info */}
      <div className="flex items-center gap-3 flex-1 min-w-0">
        {brand.logo ? (
          <div className="relative w-12 h-12 rounded-md overflow-hidden shrink-0 bg-muted flex items-center justify-center">
            <Image
              src={brand.logo}
              alt={brand.name}
              fill
              className="object-contain p-2"
              sizes="48px"
            />
          </div>
        ) : (
          <div className="w-12 h-12 rounded-md bg-muted flex items-center justify-center shrink-0">
            <GripVertical className="size-4 text-muted-foreground" />
          </div>
        )}
        <div className="min-w-0 flex-1">
          <h4 className="font-medium text-foreground truncate">{brand.name}</h4>
          {brand.websiteUrl && (
            <p className="text-xs text-muted-foreground truncate">
              {brand.websiteUrl.replace(/^https?:\/\//, '')}
            </p>
          )}
        </div>
      </div>

      {/* Status indicator */}
      <div
        className={cn(
          'px-2 py-0.5 rounded-full text-xs font-medium shrink-0',
          brand.isActive
            ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
            : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'
        )}>
        {brand.isActive ? 'Active' : 'Inactive'}
      </div>
    </div>
  );
};
