'use client';

import { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { callApi } from '@/lib/services/callApi';
import { toast } from 'sonner';
import type { ClientProject } from '@/lib/constants/endpoints';
import { AlertTriangle } from 'lucide-react';
import { useProjectsStore } from '@/lib/store/useProjectsStore';

interface DeleteProjectDialogProps {
  project: ClientProject | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export const DeleteProjectDialog = ({
  project,
  open,
  onOpenChange,
  onSuccess,
}: DeleteProjectDialogProps) => {
  const [loading, setLoading] = useState(false);
  const { actions } = useProjectsStore(state => state);

  const handleDelete = async () => {
    if (!project) return;

    setLoading(true);
    try {
      const { error } = await callApi('ADMIN_DELETE_PROJECT', {
        query: `/${project.slug}`,
      });

      if (error) {
        toast.error(error.message || 'Failed to delete project');
        return;
      }

      actions.removeProject(project.slug);
      toast.success('Project deleted successfully');
      onSuccess();
    } catch {
      toast.error('Failed to delete project');
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
        title: 'Delete Project',
        description: `Are you sure you want to delete "${project?.title}"? This action cannot be undone.`,
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
