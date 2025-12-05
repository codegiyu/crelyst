'use client';

import { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { callApi } from '@/lib/services/callApi';
import { toast } from 'sonner';
import type { ClientService } from '@/lib/constants/endpoints';
import { AlertTriangle } from 'lucide-react';
import { useServicesStore } from '@/lib/store/useServicesStore';

interface DeleteServiceDialogProps {
  service: ClientService | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export const DeleteServiceDialog = ({
  service,
  open,
  onOpenChange,
  onSuccess,
}: DeleteServiceDialogProps) => {
  const [loading, setLoading] = useState(false);
  const { actions } = useServicesStore(state => state);

  const handleDelete = async () => {
    if (!service) return;

    setLoading(true);
    try {
      const { error } = await callApi('ADMIN_DELETE_SERVICE', {
        query: `/${service.slug}`,
      });

      if (error) {
        toast.error(error.message || 'Failed to delete service');
        return;
      }

      actions.removeService(service.slug);
      toast.success('Service deleted successfully');
      onSuccess();
    } catch {
      toast.error('Failed to delete service');
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
        title: 'Delete Service',
        description: `Are you sure you want to delete "${service?.title}"? This action cannot be undone.`,
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
