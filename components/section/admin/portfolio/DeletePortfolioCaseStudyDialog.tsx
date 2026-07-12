'use client';

import { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { callApi } from '@/lib/services/callApi';
import { adminCallApiToast } from '@/lib/utils/adminMutationToast';
import type { ClientPortfolioCaseStudy } from '@/lib/constants/endpoints';
import { AlertTriangle } from 'lucide-react';

interface DeletePortfolioCaseStudyDialogProps {
  caseStudy: ClientPortfolioCaseStudy | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

function getCaseStudyId(caseStudy: ClientPortfolioCaseStudy): string {
  return (caseStudy as { _id?: string })._id ?? caseStudy.slug;
}

export const DeletePortfolioCaseStudyDialog = ({
  caseStudy,
  open,
  onOpenChange,
  onSuccess,
}: DeletePortfolioCaseStudyDialogProps) => {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (!caseStudy) return;

    setLoading(true);
    try {
      const identifier = caseStudy.slug || getCaseStudyId(caseStudy);
      const data = await adminCallApiToast(
        'Deleting case study…',
        () =>
          callApi('ADMIN_DELETE_PORTFOLIO_CASE_STUDY', {
            query: `/${identifier}`,
          }),
        'Case study deleted successfully'
      );
      if (data) {
        onSuccess();
      }
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
        title: 'Delete Case Study',
        description: `Are you sure you want to delete "${caseStudy?.title}"? This action cannot be undone.`,
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
