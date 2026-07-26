'use client';

import { useState, useEffect } from 'react';
import { Modal } from '@/components/ui/Modal';
import { callApi } from '@/lib/services/callApi';
import { adminCallApiToast } from '@/lib/utils/adminMutationToast';
import type { ClientPortfolioCaseStudy } from '@/lib/constants/endpoints';
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

type PortfolioCaseStudyWithId = ClientPortfolioCaseStudy & { _id: string };

interface ReorderPortfolioModalProps {
  caseStudies: ClientPortfolioCaseStudy[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

interface ReorderableCaseStudy extends PortfolioCaseStudyWithId {
  newDisplayOrder: number;
}

function getCaseStudyId(caseStudy: ClientPortfolioCaseStudy): string {
  return (caseStudy as { _id?: string })._id ?? caseStudy.slug;
}

export const ReorderPortfolioModal = ({
  caseStudies,
  open,
  onOpenChange,
  onSuccess,
}: ReorderPortfolioModalProps) => {
  const [loading, setLoading] = useState(false);
  const [orderedCaseStudies, setOrderedCaseStudies] = useState<ReorderableCaseStudy[]>([]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const hasChanges = () => {
    const sortedSource = [...caseStudies].sort(
      (a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0)
    );

    return orderedCaseStudies.some((item, index) => {
      const originalIndex = sortedSource.findIndex(
        cs => getCaseStudyId(cs) === getCaseStudyId(item)
      );
      return originalIndex !== index;
    });
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setOrderedCaseStudies(items => {
        const oldIndex = items.findIndex(item => getCaseStudyId(item) === active.id);
        const newIndex = items.findIndex(item => getCaseStudyId(item) === over.id);

        const newOrder = arrayMove(items, oldIndex, newIndex);
        return newOrder.map((caseStudy, index) => ({
          ...caseStudy,
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
      const reorderItems = orderedCaseStudies.map(caseStudy => ({
        id: getCaseStudyId(caseStudy),
        displayOrder: caseStudy.newDisplayOrder,
      }));

      const data = await adminCallApiToast(
        'Saving order…',
        () =>
          callApi('ADMIN_REORDER_PORTFOLIO_CASE_STUDIES', {
            payload: { reorderItems },
          }),
        'Portfolio order saved successfully'
      );
      if (data) {
        onSuccess();
        onOpenChange(false);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open && caseStudies.length > 0) {
      const sorted = [...caseStudies]
        .sort((a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0))
        .map((caseStudy, index) => ({
          ...(caseStudy as PortfolioCaseStudyWithId),
          _id: getCaseStudyId(caseStudy),
          newDisplayOrder: index + 1,
        }));
      setOrderedCaseStudies(sorted);
    }
  }, [open, caseStudies]);

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      maxWidth="lg"
      header={{
        title: 'Reorder Portfolio',
        description:
          'Drag and drop case studies to change their display order on Bold Brand Studio.',
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
          items={orderedCaseStudies.map(cs => getCaseStudyId(cs))}
          strategy={verticalListSortingStrategy}>
          <div className="grid gap-2">
            {orderedCaseStudies.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No case studies to reorder
              </div>
            ) : (
              orderedCaseStudies.map((caseStudy, index) => (
                <ReorderableCaseStudyItem
                  key={getCaseStudyId(caseStudy)}
                  caseStudy={caseStudy}
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

interface ReorderableCaseStudyItemProps {
  caseStudy: ReorderableCaseStudy;
  index: number;
}

const ReorderableCaseStudyItem = ({ caseStudy, index }: ReorderableCaseStudyItemProps) => {
  const id = getCaseStudyId(caseStudy);
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id,
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
      <div
        {...attributes}
        {...listeners}
        className="text-muted-foreground cursor-grab active:cursor-grabbing hover:text-foreground transition-colors">
        <GripVertical className="size-5" />
      </div>

      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary text-sm font-semibold shrink-0">
        {index + 1}
      </div>

      <div className="flex items-center gap-3 flex-1 min-w-0">
        {caseStudy.image ? (
          <div className="relative w-12 h-12 rounded-md overflow-hidden shrink-0 bg-muted">
            <Image
              src={caseStudy.image}
              alt={caseStudy.title}
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
          <h4 className="font-medium text-foreground truncate">{caseStudy.title}</h4>
          <p className="text-xs text-muted-foreground truncate">
            {caseStudy.client} · {caseStudy.category}
          </p>
        </div>
      </div>

      {caseStudy.featured && (
        <div className="px-2 py-0.5 rounded-full text-xs font-medium shrink-0 bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
          Featured
        </div>
      )}

      <div
        className={cn(
          'px-2 py-0.5 rounded-full text-xs font-medium shrink-0',
          caseStudy.isActive
            ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
            : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'
        )}>
        {caseStudy.isActive ? 'Active' : 'Inactive'}
      </div>
    </div>
  );
};
