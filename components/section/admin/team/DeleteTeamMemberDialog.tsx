'use client';

import { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { callApi } from '@/lib/services/callApi';
import { toast } from 'sonner';
import type { ClientTeamMember } from '@/lib/constants/endpoints';
import { AlertTriangle } from 'lucide-react';
import { useTeamMembersStore } from '@/lib/store/useTeamMembersStore';

interface DeleteTeamMemberDialogProps {
  member: ClientTeamMember | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export const DeleteTeamMemberDialog = ({
  member,
  open,
  onOpenChange,
  onSuccess,
}: DeleteTeamMemberDialogProps) => {
  const [loading, setLoading] = useState(false);
  const { actions } = useTeamMembersStore(state => state);

  const handleDelete = async () => {
    if (!member) return;

    setLoading(true);
    try {
      const { error } = await callApi('ADMIN_DELETE_TEAM_MEMBER', {
        query: `/${member._id}`,
      });

      if (error) {
        toast.error(error.message || 'Failed to delete team member');
        return;
      }

      actions.removeTeamMember(member._id);
      toast.success('Team member deleted successfully');
      onSuccess();
    } catch {
      toast.error('Failed to delete team member');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      maxWidth="sm"
      header={{
        title: 'Delete Team Member',
        description: `Are you sure you want to delete "${member?.name}"? This action cannot be undone.`,
      }}
      cancelButton={{
        text: 'Cancel',
        disabled: loading,
      }}
      submitButton={{
        text: 'Delete',
        variant: 'destructive',
        loading,
        onClick: handleDelete,
      }}>
      <div className="flex justify-center py-4">
        <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center">
          <AlertTriangle className="size-8 text-destructive" />
        </div>
      </div>
    </Modal>
  );
};
