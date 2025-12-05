'use client';

import { useState, useEffect } from 'react';
import { Modal } from '@/components/ui/Modal';
import { callApi } from '@/lib/services/callApi';
import { toast } from 'sonner';
import type { ClientTeamMember } from '@/lib/constants/endpoints';
import { GripVertical, ChevronUp, ChevronDown, ArrowUpToLine, ArrowDownToLine } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import Image from 'next/image';

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

  const moveItem = (fromIndex: number, toIndex: number) => {
    if (toIndex < 0 || toIndex >= orderedMembers.length) return;

    setOrderedMembers(prev => {
      const newOrder = [...prev];
      const [movedItem] = newOrder.splice(fromIndex, 1);
      newOrder.splice(toIndex, 0, movedItem);

      // Update display orders
      return newOrder.map((member, index) => ({
        ...member,
        newDisplayOrder: index + 1,
      }));
    });
  };

  const moveToTop = (index: number) => {
    if (index === 0) return;
    moveItem(index, 0);
  };

  const moveToBottom = (index: number) => {
    if (index === orderedMembers.length - 1) return;
    moveItem(index, orderedMembers.length - 1);
  };

  const hasChanges = () => {
    return orderedMembers.some((member, index) => {
      const originalIndex = members
        .sort((a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0))
        .findIndex(m => m._id === member._id);
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
        description: 'Use the arrows to change the display order of team members on the website.',
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
        {orderedMembers.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">No team members to reorder</div>
        ) : (
          orderedMembers.map((member, index) => (
            <ReorderableMemberItem
              key={member._id}
              member={member}
              index={index}
              isFirst={index === 0}
              isLast={index === orderedMembers.length - 1}
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

interface ReorderableMemberItemProps {
  member: ReorderableMember;
  index: number;
  isFirst: boolean;
  isLast: boolean;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onMoveToTop: () => void;
  onMoveToBottom: () => void;
}

const ReorderableMemberItem = ({
  member,
  index,
  isFirst,
  isLast,
  onMoveUp,
  onMoveDown,
  onMoveToTop,
  onMoveToBottom,
}: ReorderableMemberItemProps) => {
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
