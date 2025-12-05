'use client';

import { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { callApi } from '@/lib/services/callApi';
import { toast } from 'sonner';
import type { ClientBrand } from '@/lib/constants/endpoints';
import { AlertTriangle } from 'lucide-react';
import { useBrandsStore } from '@/lib/store/useBrandsStore';

interface DeleteBrandDialogProps {
  brand: ClientBrand | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export const DeleteBrandDialog = ({
  brand,
  open,
  onOpenChange,
  onSuccess,
}: DeleteBrandDialogProps) => {
  const [loading, setLoading] = useState(false);
  const { actions } = useBrandsStore(state => state);

  const handleDelete = async () => {
    if (!brand) return;

    setLoading(true);
    try {
      const { error } = await callApi('ADMIN_DELETE_BRAND', {
        query: `/${brand._id}`,
      });

      if (error) {
        toast.error(error.message || 'Failed to delete brand');
        return;
      }

      actions.removeBrand(brand._id);
      toast.success('Brand deleted successfully');
      onSuccess();
    } catch {
      toast.error('Failed to delete brand');
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
        title: 'Delete Brand',
        description: `Are you sure you want to delete "${brand?.name}"? This action cannot be undone.`,
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
