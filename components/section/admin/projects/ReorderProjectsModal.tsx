'use client';

import { useState, useEffect } from 'react';
import { Modal } from '@/components/ui/Modal';
import { callApi } from '@/lib/services/callApi';
import { toast } from 'sonner';
import type { ClientProject } from '@/lib/constants/endpoints';
import { GripVertical, ChevronUp, ChevronDown, ArrowUpToLine, ArrowDownToLine } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import Image from 'next/image';

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

  const moveItem = (fromIndex: number, toIndex: number) => {
    if (toIndex < 0 || toIndex >= orderedProjects.length) return;

    setOrderedProjects(prev => {
      const newOrder = [...prev];
      const [movedItem] = newOrder.splice(fromIndex, 1);
      newOrder.splice(toIndex, 0, movedItem);

      // Update display orders
      return newOrder.map((project, index) => ({
        ...project,
        newDisplayOrder: index + 1,
      }));
    });
  };

  const moveToTop = (index: number) => {
    if (index === 0) return;
    moveItem(index, 0);
  };

  const moveToBottom = (index: number) => {
    if (index === orderedProjects.length - 1) return;
    moveItem(index, orderedProjects.length - 1);
  };

  const hasChanges = () => {
    return orderedProjects.some((project, index) => {
      const originalIndex = projects
        .sort((a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0))
        .findIndex(p => p._id === project._id);
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
        description: 'Use the arrows to change the display order of projects on the website.',
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
      <div className="space-y-2">
        {orderedProjects.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">No projects to reorder</div>
        ) : (
          orderedProjects.map((project, index) => (
            <ReorderableProjectItem
              key={project._id}
              project={project}
              index={index}
              isFirst={index === 0}
              isLast={index === orderedProjects.length - 1}
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

interface ReorderableProjectItemProps {
  project: ReorderableProject;
  index: number;
  isFirst: boolean;
  isLast: boolean;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onMoveToTop: () => void;
  onMoveToBottom: () => void;
}

const ReorderableProjectItem = ({
  project,
  index,
  isFirst,
  isLast,
  onMoveUp,
  onMoveDown,
  onMoveToTop,
  onMoveToBottom,
}: ReorderableProjectItemProps) => {
  const statusColors: Record<string, string> = {
    draft: 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400',
    'in-progress': 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    completed: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    'on-hold': 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
    cancelled: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  };

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
