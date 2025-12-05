'use client';

import { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { callApi } from '@/lib/services/callApi';
import { toast } from 'sonner';
import type { ClientTestimonial } from '@/lib/constants/endpoints';
import { AlertTriangle } from 'lucide-react';
import { useTestimonialsStore } from '@/lib/store/useTestimonialsStore';

interface DeleteTestimonialDialogProps {
  testimonial: ClientTestimonial | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export const DeleteTestimonialDialog = ({
  testimonial,
  open,
  onOpenChange,
  onSuccess,
}: DeleteTestimonialDialogProps) => {
  const [loading, setLoading] = useState(false);
  const { actions } = useTestimonialsStore(state => state);

  const handleDelete = async () => {
    if (!testimonial) return;

    setLoading(true);
    try {
      const { error } = await callApi('ADMIN_DELETE_TESTIMONIAL', {
        query: `/${testimonial._id}`,
      });

      if (error) {
        toast.error(error.message || 'Failed to delete testimonial');
        return;
      }

      actions.removeTestimonial(testimonial._id);
      toast.success('Testimonial deleted successfully');
      onSuccess();
    } catch {
      toast.error('Failed to delete testimonial');
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
        title: 'Delete Testimonial',
        description: `Are you sure you want to delete the testimonial from "${testimonial?.clientName}"? This action cannot be undone.`,
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
