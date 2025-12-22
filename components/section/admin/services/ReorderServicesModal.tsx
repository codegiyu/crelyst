'use client';

import { useState, useEffect } from 'react';
import { Modal } from '@/components/ui/Modal';
import { callApi } from '@/lib/services/callApi';
import { toast } from 'sonner';
import type { ClientService } from '@/lib/constants/endpoints';
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

interface ReorderServicesModalProps {
  services: ClientService[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

interface ReorderableService extends ClientService {
  newDisplayOrder: number;
}

export const ReorderServicesModal = ({
  services,
  open,
  onOpenChange,
  onSuccess,
}: ReorderServicesModalProps) => {
  const [loading, setLoading] = useState(false);
  const [orderedServices, setOrderedServices] = useState<ReorderableService[]>([]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const hasChanges = () => {
    return orderedServices.some((service, index) => {
      const originalIndex = services
        .sort((a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0))
        .findIndex(s => s._id === service._id);
      return originalIndex !== index;
    });
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setOrderedServices(items => {
        const oldIndex = items.findIndex(item => item._id === active.id);
        const newIndex = items.findIndex(item => item._id === over.id);

        const newOrder = arrayMove(items, oldIndex, newIndex);
        return newOrder.map((service, index) => ({
          ...service,
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
      const reorderItems = orderedServices.map(service => ({
        id: service._id,
        displayOrder: service.newDisplayOrder,
      }));

      const { error } = await callApi('ADMIN_REORDER_SERVICES', {
        payload: { reorderItems },
      });

      if (error) {
        toast.error(error.message || 'Failed to reorder services');
        return;
      }

      toast.success('Services reordered successfully');
      onSuccess();
      onOpenChange(false);
    } catch {
      toast.error('Failed to reorder services');
    } finally {
      setLoading(false);
    }
  };

  // Initialize ordered services when modal opens
  useEffect(() => {
    if (open && services.length > 0) {
      const sorted = [...services]
        .sort((a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0))
        .map((service, index) => ({
          ...service,
          newDisplayOrder: index + 1,
        }));
      setOrderedServices(sorted);
    }
  }, [open, services]);

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      maxWidth="lg"
      header={{
        title: 'Reorder Services',
        description: 'Drag and drop services to change their display order on the website.',
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
          items={orderedServices.map(s => s._id)}
          strategy={verticalListSortingStrategy}>
          <div className="grid gap-2">
            {orderedServices.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">No services to reorder</div>
            ) : (
              orderedServices.map((service, index) => (
                <ReorderableServiceItem key={service._id} service={service} index={index} />
              ))
            )}
          </div>
        </SortableContext>
      </DndContext>
    </Modal>
  );
};

interface ReorderableServiceItemProps {
  service: ReorderableService;
  index: number;
}

const ReorderableServiceItem = ({ service, index }: ReorderableServiceItemProps) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: service._id,
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

      {/* Service info */}
      <div className="flex items-center gap-3 flex-1 min-w-0">
        {service.cardImage || service.bannerImage || service.image ? (
          <div className="relative w-12 h-12 rounded-md overflow-hidden shrink-0 bg-muted">
            <Image
              src={service.cardImage || service.bannerImage || service.image || ''}
              alt={service.title}
              fill
              className="object-cover"
              sizes="48px"
            />
          </div>
        ) : (
          <div className="w-12 h-12 rounded-md bg-muted flex items-center justify-center shrink-0">
            <GripVertical className="size-4 text-muted-foreground" />
          </div>
        )}
        <div className="min-w-0 flex-1">
          <h4 className="font-medium text-foreground truncate">{service.title}</h4>
          <p className="text-xs text-muted-foreground truncate">
            {service.shortDescription || service.description}
          </p>
        </div>
      </div>

      {/* Status indicator */}
      <div
        className={cn(
          'px-2 py-0.5 rounded-full text-xs font-medium shrink-0',
          service.isActive
            ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
            : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'
        )}>
        {service.isActive ? 'Active' : 'Inactive'}
      </div>
    </div>
  );
};
