'use client';

import { useState, useEffect } from 'react';
import { Modal } from '@/components/ui/Modal';
import { callApi } from '@/lib/services/callApi';
import { toast } from 'sonner';
import type { ClientService } from '@/lib/constants/endpoints';
import { GripVertical, ChevronUp, ChevronDown, ArrowUpToLine, ArrowDownToLine } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import Image from 'next/image';

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

  const moveItem = (fromIndex: number, toIndex: number) => {
    if (toIndex < 0 || toIndex >= orderedServices.length) return;

    setOrderedServices(prev => {
      const newOrder = [...prev];
      const [movedItem] = newOrder.splice(fromIndex, 1);
      newOrder.splice(toIndex, 0, movedItem);

      // Update display orders
      return newOrder.map((service, index) => ({
        ...service,
        newDisplayOrder: index + 1,
      }));
    });
  };

  const moveToTop = (index: number) => {
    if (index === 0) return;
    moveItem(index, 0);
  };

  const moveToBottom = (index: number) => {
    if (index === orderedServices.length - 1) return;
    moveItem(index, orderedServices.length - 1);
  };

  const hasChanges = () => {
    return orderedServices.some((service, index) => {
      const originalIndex = services
        .sort((a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0))
        .findIndex(s => s._id === service._id);
      return originalIndex !== index;
    });
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
        description:
          'Drag services or use the arrows to change their display order on the website.',
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
      <div className="grid gap-2">
        {orderedServices.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">No services to reorder</div>
        ) : (
          orderedServices.map((service, index) => (
            <ReorderableServiceItem
              key={service._id}
              service={service}
              index={index}
              isFirst={index === 0}
              isLast={index === orderedServices.length - 1}
              onMoveUp={() => moveItem(index, index - 1)}
              onMoveDown={() => moveItem(index, index + 1)}
              onMoveToTop={() => moveToTop(index)}
              onMoveToBottom={() => moveToBottom(index)}
            />
          ))
        )}
      </div>
    </Modal>
  );
};

interface ReorderableServiceItemProps {
  service: ReorderableService;
  index: number;
  isFirst: boolean;
  isLast: boolean;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onMoveToTop: () => void;
  onMoveToBottom: () => void;
}

const ReorderableServiceItem = ({
  service,
  index,
  isFirst,
  isLast,
  onMoveUp,
  onMoveDown,
  onMoveToTop,
  onMoveToBottom,
}: ReorderableServiceItemProps) => {
  return (
    <div
      className={cn(
        'flex items-center gap-3 p-3 rounded-lg border bg-card transition-colors',
        'hover:border-primary/50 hover:bg-accent/30'
      )}>
      {/* Grip icon for visual indication */}
      <div className="text-muted-foreground">
        <GripVertical className="size-5" />
      </div>

      {/* Position number */}
      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary text-sm font-semibold shrink-0">
        {index + 1}
      </div>

      {/* Service info */}
      <div className="flex items-center gap-3 flex-1 min-w-0">
        {service.image ? (
          <div className="relative w-12 h-12 rounded-md overflow-hidden shrink-0 bg-muted">
            <Image
              src={service.image}
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

      {/* Reorder controls */}
      <div className="flex items-center gap-1 shrink-0">
        <Button
          variant="ghost"
          size="icon"
          className="size-8"
          onClick={onMoveToTop}
          disabled={isFirst}
          title="Move to top">
          <ArrowUpToLine className="size-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="size-8"
          onClick={onMoveUp}
          disabled={isFirst}
          title="Move up">
          <ChevronUp className="size-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="size-8"
          onClick={onMoveDown}
          disabled={isLast}
          title="Move down">
          <ChevronDown className="size-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="size-8"
          onClick={onMoveToBottom}
          disabled={isLast}
          title="Move to bottom">
          <ArrowDownToLine className="size-4" />
        </Button>
      </div>
    </div>
  );
};
