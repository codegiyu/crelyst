'use client';

import { useState, useEffect } from 'react';
import { Modal } from '@/components/ui/Modal';
import { callApi } from '@/lib/services/callApi';
import { toast } from 'sonner';
import type { ClientTeamMember } from '@/lib/constants/endpoints';
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

interface ReorderTeamMembersModalProps {
  members: ClientTeamMember[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

interface ReorderableMember extends ClientTeamMember {
  newDisplayOrder: number;
}

export const ReorderTeamMembersModal = ({
  members,
  open,
  onOpenChange,
  onSuccess,
}: ReorderTeamMembersModalProps) => {
  const [loading, setLoading] = useState(false);
  const [orderedMembers, setOrderedMembers] = useState<ReorderableMember[]>([]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const hasChanges = () => {
    return orderedMembers.some((member, index) => {
      const originalIndex = members
        .sort((a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0))
        .findIndex(m => m._id === member._id);
      return originalIndex !== index;
    });
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setOrderedMembers(items => {
        const oldIndex = items.findIndex(item => item._id === active.id);
        const newIndex = items.findIndex(item => item._id === over.id);

        const newOrder = arrayMove(items, oldIndex, newIndex);
        return newOrder.map((member, index) => ({
          ...member,
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
      const reorderItems = orderedMembers.map(member => ({
        id: member._id,
        displayOrder: member.newDisplayOrder,
      }));

      const { error } = await callApi('ADMIN_REORDER_TEAM_MEMBERS', {
        payload: { reorderItems },
      });

      if (error) {
        toast.error(error.message || 'Failed to reorder team members');
        return;
      }

      toast.success('Team members reordered successfully');
      onSuccess();
      onOpenChange(false);
    } catch {
      toast.error('Failed to reorder team members');
    } finally {
      setLoading(false);
    }
  };

  // Initialize ordered members when modal opens
  useEffect(() => {
    if (open && members.length > 0) {
      const sorted = [...members]
        .sort((a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0))
        .map((member, index) => ({
          ...member,
          newDisplayOrder: index + 1,
        }));
      setOrderedMembers(sorted);
    }
  }, [open, members]);

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      maxWidth="lg"
      header={{
        title: 'Reorder Team Members',
        description: 'Drag and drop team members to change their display order on the website.',
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
          items={orderedMembers.map(m => m._id)}
          strategy={verticalListSortingStrategy}>
          <div className="space-y-2">
            {orderedMembers.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No team members to reorder
              </div>
            ) : (
              orderedMembers.map((member, index) => (
                <ReorderableMemberItem key={member._id} member={member} index={index} />
              ))
            )}
          </div>
        </SortableContext>
      </DndContext>
    </Modal>
  );
};

interface ReorderableMemberItemProps {
  member: ReorderableMember;
  index: number;
}

const ReorderableMemberItem = ({ member, index }: ReorderableMemberItemProps) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: member._id,
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

      {/* Member info */}
      <div className="flex items-center gap-3 flex-1 min-w-0">
        {member.image ? (
          <div className="relative w-10 h-10 rounded-full overflow-hidden shrink-0 bg-muted">
            <Image
              src={member.image}
              alt={member.name}
              fill
              className="object-cover"
              sizes="40px"
            />
          </div>
        ) : (
          <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center shrink-0">
            <span className="text-sm font-semibold text-muted-foreground">
              {member.name.charAt(0).toUpperCase()}
            </span>
          </div>
        )}
        <div className="min-w-0 flex-1">
          <h4 className="font-medium text-foreground truncate">{member.name}</h4>
          <p className="text-xs text-muted-foreground truncate">{member.role}</p>
        </div>
      </div>

      {/* Status indicator */}
      <div
        className={cn(
          'px-2 py-0.5 rounded-full text-xs font-medium shrink-0',
          member.isActive
            ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
            : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'
        )}>
        {member.isActive ? 'Active' : 'Inactive'}
      </div>
    </div>
  );
};
