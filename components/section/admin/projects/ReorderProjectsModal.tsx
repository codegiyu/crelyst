'use client';

import { useState, useEffect } from 'react';
import { Modal } from '@/components/ui/Modal';
import { callApi } from '@/lib/services/callApi';
import { toast } from 'sonner';
import type { ClientProject } from '@/lib/constants/endpoints';
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

interface ReorderProjectsModalProps {
  projects: ClientProject[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

interface ReorderableProject extends ClientProject {
  newDisplayOrder: number;
}

export const ReorderProjectsModal = ({
  projects,
  open,
  onOpenChange,
  onSuccess,
}: ReorderProjectsModalProps) => {
  const [loading, setLoading] = useState(false);
  const [orderedProjects, setOrderedProjects] = useState<ReorderableProject[]>([]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const hasChanges = () => {
    return orderedProjects.some((project, index) => {
      const originalIndex = projects
        .sort((a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0))
        .findIndex(p => p._id === project._id);
      return originalIndex !== index;
    });
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setOrderedProjects(items => {
        const oldIndex = items.findIndex(item => item._id === active.id);
        const newIndex = items.findIndex(item => item._id === over.id);

        const newOrder = arrayMove(items, oldIndex, newIndex);
        return newOrder.map((project, index) => ({
          ...project,
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
      const reorderItems = orderedProjects.map(project => ({
        id: project._id,
        displayOrder: project.newDisplayOrder,
      }));

      const { error } = await callApi('ADMIN_REORDER_PROJECTS', {
        payload: { reorderItems },
      });

      if (error) {
        toast.error(error.message || 'Failed to reorder projects');
        return;
      }

      toast.success('Projects reordered successfully');
      onSuccess();
      onOpenChange(false);
    } catch {
      toast.error('Failed to reorder projects');
    } finally {
      setLoading(false);
    }
  };

  // Initialize ordered projects when modal opens
  useEffect(() => {
    if (open && projects.length > 0) {
      const sorted = [...projects]
        .sort((a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0))
        .map((project, index) => ({
          ...project,
          newDisplayOrder: index + 1,
        }));
      setOrderedProjects(sorted);
    }
  }, [open, projects]);

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      maxWidth="lg"
      header={{
        title: 'Reorder Projects',
        description: 'Drag and drop projects to change their display order on the website.',
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
          items={orderedProjects.map(p => p._id)}
          strategy={verticalListSortingStrategy}>
          <div className="space-y-2">
            {orderedProjects.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">No projects to reorder</div>
            ) : (
              orderedProjects.map((project, index) => (
                <ReorderableProjectItem key={project._id} project={project} index={index} />
              ))
            )}
          </div>
        </SortableContext>
      </DndContext>
    </Modal>
  );
};

interface ReorderableProjectItemProps {
  project: ReorderableProject;
  index: number;
}

const ReorderableProjectItem = ({ project, index }: ReorderableProjectItemProps) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: project._id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const statusColors: Record<string, string> = {
    draft: 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400',
    'in-progress': 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    completed: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    'on-hold': 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
    cancelled: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
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

      {/* Project info */}
      <div className="flex items-center gap-3 flex-1 min-w-0">
        {project.featuredImage || project.cardImage ? (
          <div className="relative w-12 h-12 rounded-md overflow-hidden shrink-0 bg-muted">
            <Image
              src={project.featuredImage || project.cardImage || ''}
              alt={project.title}
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
          <h4 className="font-medium text-foreground truncate">{project.title}</h4>
          <p className="text-xs text-muted-foreground truncate">
            {project.shortDescription || project.description}
          </p>
        </div>
      </div>

      {/* Status indicator */}
      <div
        className={cn(
          'px-2 py-0.5 rounded-full text-xs font-medium shrink-0 capitalize',
          statusColors[project.status] || statusColors.draft
        )}>
        {project.status.replace('-', ' ')}
      </div>

      {/* Featured indicator */}
      {project.isFeatured && (
        <div className="px-2 py-0.5 rounded-full text-xs font-medium shrink-0 bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
          Featured
        </div>
      )}
    </div>
  );
};
