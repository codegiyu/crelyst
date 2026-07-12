'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Plus,
  Pencil,
  Trash2,
  MoreHorizontal,
  ArrowUpDown,
  Eye,
  EyeOff,
  Rocket,
  Star,
} from 'lucide-react';
import { RegularBtn } from '@/components/atoms/RegularBtn';
import { Modal } from '@/components/ui/Modal';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { DashboardPageWrapper } from '@/components/general/DashboardPageWrapper';
import type { ClientPortfolioCaseStudy } from '@/lib/constants/endpoints';
import Image from 'next/image';
import { callApi } from '@/lib/services/callApi';
import { adminCallApiToast } from '@/lib/utils/adminMutationToast';
import { useAdminEditDeepLink } from '@/lib/hooks/use-admin-edit-deep-link';
import { cn } from '@/lib/utils';
import {
  PortfolioCaseStudyForm,
  DeletePortfolioCaseStudyDialog,
  ReorderPortfolioModal,
} from './index';

export const PortfolioPageClient = ({
  initialCaseStudies,
}: {
  initialCaseStudies: ClientPortfolioCaseStudy[];
}) => {
  const router = useRouter();
  const [caseStudies, setCaseStudies] = useState(initialCaseStudies);

  useEffect(() => {
    setCaseStudies(initialCaseStudies);
  }, [initialCaseStudies]);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCaseStudy, setEditingCaseStudy] = useState<ClientPortfolioCaseStudy | null>(null);
  const [deleteCaseStudy, setDeleteCaseStudy] = useState<ClientPortfolioCaseStudy | null>(null);
  const [isReorderOpen, setIsReorderOpen] = useState(false);
  const [publishing, setPublishing] = useState(false);

  const handleCreate = () => {
    setEditingCaseStudy(null);
    setIsFormOpen(true);
  };

  const handleEdit = (item: ClientPortfolioCaseStudy) => {
    setEditingCaseStudy(item);
    setIsFormOpen(true);
  };

  useAdminEditDeepLink(caseStudies, handleEdit);

  const handleFormSuccess = () => {
    setIsFormOpen(false);
    setEditingCaseStudy(null);
    router.refresh();
  };

  const handleToggleActive = async (item: ClientPortfolioCaseStudy) => {
    const identifier = item.slug || item._id;
    const data = await adminCallApiToast(
      'Updating case study…',
      () =>
        callApi('ADMIN_UPDATE_PORTFOLIO_CASE_STUDY', {
          query: `/${identifier}`,
          payload: { isActive: !item.isActive },
        }),
      d => `Case study ${d.caseStudy.isActive ? 'activated' : 'deactivated'}`
    );
    if (data) {
      setCaseStudies(prev => prev.map(c => (c._id === data.caseStudy._id ? data.caseStudy : c)));
    }
  };

  const handleToggleFeatured = async (item: ClientPortfolioCaseStudy) => {
    const identifier = item.slug || item._id;
    const data = await adminCallApiToast(
      'Updating case study…',
      () =>
        callApi('ADMIN_UPDATE_PORTFOLIO_CASE_STUDY', {
          query: `/${identifier}`,
          payload: { featured: !item.featured },
        }),
      d => `Case study ${d.caseStudy.featured ? 'featured' : 'unfeatured'}`
    );
    if (data) {
      setCaseStudies(prev => prev.map(c => (c._id === data.caseStudy._id ? data.caseStudy : c)));
    }
  };

  const handlePublish = async () => {
    setPublishing(true);
    try {
      await adminCallApiToast(
        'Triggering Bold Brand Studio rebuild…',
        () => callApi('ADMIN_PUBLISH_PORTFOLIO_CASE_STUDIES', {}),
        'Publish triggered — Bold Brand Studio will rebuild shortly'
      );
    } finally {
      setPublishing(false);
    }
  };

  return (
    <DashboardPageWrapper
      header={{
        title: 'Portfolio (Bold Brand Studio)',
        description: 'Manage case studies published to the Bold Brand Studio site',
      }}
      headerActions={
        <div className="flex flex-wrap items-center gap-2">
          <RegularBtn
            text="Publish to Bold Brand Studio"
            variant="outline"
            LeftIcon={Rocket}
            leftIconProps={{ className: 'size-4' }}
            loading={publishing}
            onClick={handlePublish}
          />
          {caseStudies.length > 1 && (
            <RegularBtn
              text="Reorder"
              variant="outline"
              LeftIcon={ArrowUpDown}
              leftIconProps={{ className: 'size-4' }}
              onClick={() => setIsReorderOpen(true)}
            />
          )}
          <RegularBtn
            text="Add Case Study"
            LeftIcon={Plus}
            leftIconProps={{ className: 'size-5' }}
            onClick={handleCreate}
          />
        </div>
      }>
      {caseStudies.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="rounded-full bg-muted p-4 mb-4">
            <Plus className="size-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold text-foreground">No case studies yet</h3>
          <p className="text-muted-foreground mb-4">
            Add your first portfolio case study or run the migration script
          </p>
          <RegularBtn
            text="Add Case Study"
            LeftIcon={Plus}
            leftIconProps={{ className: 'size-5' }}
            onClick={handleCreate}
          />
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[...caseStudies]
            .sort((a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0))
            .map(item => (
              <div
                key={item._id}
                className="group relative rounded-xl border bg-card overflow-hidden hover:border-primary/40 transition-colors">
                <div className="relative aspect-[16/10] bg-muted">
                  {item.image ? (
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-muted-foreground text-sm">
                      No image
                    </div>
                  )}
                  <div className="absolute top-2 right-2 flex gap-1">
                    {item.featured && (
                      <span className="rounded-full bg-amber-500/90 px-2 py-0.5 text-xs font-medium text-white">
                        Featured
                      </span>
                    )}
                    <span
                      className={cn(
                        'rounded-full px-2 py-0.5 text-xs font-medium',
                        item.isActive
                          ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                          : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'
                      )}>
                      {item.isActive ? 'Active' : 'Draft'}
                    </span>
                  </div>
                </div>

                <div className="p-4">
                  <h3 className="font-semibold text-foreground line-clamp-1">{item.title}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                    {item.description}
                  </p>
                  <p className="text-xs text-muted-foreground mt-2">{item.category}</p>
                </div>

                <div className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button
                        type="button"
                        className="rounded-lg bg-background/90 p-1.5 shadow-sm border hover:bg-accent">
                        <MoreHorizontal className="size-4" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start">
                      <DropdownMenuItem onClick={() => handleEdit(item)}>
                        <Pencil className="size-4 mr-2" /> Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleToggleFeatured(item)}>
                        <Star className="size-4 mr-2" />
                        {item.featured ? 'Unfeature' : 'Feature'}
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleToggleActive(item)}>
                        {item.isActive ? (
                          <>
                            <EyeOff className="size-4 mr-2" /> Deactivate
                          </>
                        ) : (
                          <>
                            <Eye className="size-4 mr-2" /> Activate
                          </>
                        )}
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        className="text-destructive focus:text-destructive"
                        onClick={() => setDeleteCaseStudy(item)}>
                        <Trash2 className="size-4 mr-2" /> Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            ))}
        </div>
      )}

      <Modal
        open={isFormOpen}
        onOpenChange={open => {
          setIsFormOpen(open);
          if (!open) setEditingCaseStudy(null);
        }}
        maxWidth="4xl"
        header={{
          title: editingCaseStudy ? 'Edit Case Study' : 'New Case Study',
          description: 'Fields map to sections on the Bold Brand Studio project page',
        }}>
        <PortfolioCaseStudyForm
          caseStudy={editingCaseStudy}
          onSuccess={handleFormSuccess}
          onCancel={() => {
            setIsFormOpen(false);
            setEditingCaseStudy(null);
          }}
        />
      </Modal>

      <DeletePortfolioCaseStudyDialog
        caseStudy={deleteCaseStudy}
        open={Boolean(deleteCaseStudy)}
        onOpenChange={open => {
          if (!open) setDeleteCaseStudy(null);
        }}
        onSuccess={() => {
          setDeleteCaseStudy(null);
          router.refresh();
        }}
      />

      <ReorderPortfolioModal
        caseStudies={caseStudies}
        open={isReorderOpen}
        onOpenChange={setIsReorderOpen}
        onSuccess={() => router.refresh()}
      />
    </DashboardPageWrapper>
  );
};
