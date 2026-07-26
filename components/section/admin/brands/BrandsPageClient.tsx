'use client';

import { useState } from 'react';
import {
  Plus,
  Pencil,
  Trash2,
  MoreHorizontal,
  Eye,
  EyeOff,
  ExternalLink,
  ArrowUpDown,
} from 'lucide-react';
import { RegularBtn } from '@/components/atoms/RegularBtn';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { BrandFormModal } from './BrandFormModal';
import { DeleteBrandDialog } from './DeleteBrandDialog';
import { ReorderBrandsModal } from './ReorderBrandsModal';
import { DashboardPageWrapper } from '@/components/general/DashboardPageWrapper';
import { AdminAsyncSection } from '@/components/general/admin/AdminAsyncSection';
import { AdminLogoCardGridSkeleton } from '@/components/general/admin/loading';
import type { ClientBrand } from '@/lib/constants/endpoints';
import Image from 'next/image';
import { callApi } from '@/lib/services/callApi';
import { adminCallApiToast } from '@/lib/utils/adminMutationToast';
import { useAdminEditDeepLink } from '@/lib/hooks/use-admin-edit-deep-link';
import { useAdminResource } from '@/lib/hooks/use-admin-resource';
import { useRemoteListItems } from '@/lib/hooks/use-remote-list-items';

const LIST_QUERY = '?limit=100' as const;

export const BrandsPageClient = () => {
  const list = useAdminResource({
    resourceKey: ['admin', 'brands', { limit: 100 }],
    endpoint: 'ADMIN_LIST_BRANDS',
    options: { query: LIST_QUERY },
    sectionLabel: 'brands',
  });

  const [brands, setBrands] = useRemoteListItems(list.data?.brands);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingBrand, setEditingBrand] = useState<ClientBrand | null>(null);
  const [deleteBrand, setDeleteBrand] = useState<ClientBrand | null>(null);
  const [isReorderOpen, setIsReorderOpen] = useState(false);

  const handleCreate = () => {
    setEditingBrand(null);
    setIsFormOpen(true);
  };

  const handleEdit = (brand: ClientBrand) => {
    setEditingBrand(brand);
    setIsFormOpen(true);
  };

  useAdminEditDeepLink(brands, handleEdit);

  const handleFormSuccess = () => {
    setIsFormOpen(false);
    setEditingBrand(null);
    void list.reload();
  };

  const handleToggleActive = async (brand: ClientBrand) => {
    const data = await adminCallApiToast(
      'Updating brand…',
      () =>
        callApi('ADMIN_UPDATE_BRAND', {
          query: `/${brand._id}`,
          payload: { isActive: !brand.isActive },
        }),
      d => `Brand ${d.brand.isActive ? 'activated' : 'deactivated'}`
    );
    if (data) {
      setBrands(prev => prev.map(b => (b._id === data.brand._id ? data.brand : b)));
    }
  };

  return (
    <DashboardPageWrapper
      header={{
        title: 'Brands',
        description: 'Manage your partner and client brands',
      }}
      headerActions={
        <div className="flex items-center gap-2">
          {brands.length > 1 && (
            <RegularBtn
              text="Reorder"
              variant="outline"
              LeftIcon={ArrowUpDown}
              leftIconProps={{ className: 'size-4' }}
              disabled={list.isError || list.isLoading}
              onClick={() => setIsReorderOpen(true)}
            />
          )}
          <RegularBtn
            text="Add Brand"
            LeftIcon={Plus}
            leftIconProps={{ className: 'size-5' }}
            disabled={list.isError || list.isLoading}
            onClick={handleCreate}
          />
        </div>
      }>
      <AdminAsyncSection
        status={list.status}
        errorMessage={list.errorMessage}
        onRetry={() => void list.reload()}
        hasData={list.data != null}
        loadingFallback={<AdminLogoCardGridSkeleton label="Loading brands" />}>
        {brands.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="rounded-full bg-muted p-4 mb-4">
              <Plus className="size-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold text-foreground">No brands yet</h3>
            <p className="text-muted-foreground mb-4">Get started by adding your first brand</p>
            <RegularBtn
              text="Add Brand"
              LeftIcon={Plus}
              leftIconProps={{ className: 'size-5' }}
              onClick={handleCreate}
            />
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {[...brands]
              .sort((a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0))
              .map(brand => (
                <BrandCard
                  key={brand._id}
                  brand={brand}
                  onEdit={() => handleEdit(brand)}
                  onDelete={() => setDeleteBrand(brand)}
                  onToggleActive={() => handleToggleActive(brand)}
                />
              ))}
          </div>
        )}
      </AdminAsyncSection>

      {/* Create/Edit Modal */}
      <BrandFormModal
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        brand={editingBrand}
        onSuccess={handleFormSuccess}
      />

      {/* Delete Dialog */}
      <DeleteBrandDialog
        brand={deleteBrand}
        open={!!deleteBrand}
        onOpenChange={open => !open && setDeleteBrand(null)}
        onSuccess={() => {
          setDeleteBrand(null);
          void list.reload();
        }}
      />

      {/* Reorder Modal */}
      <ReorderBrandsModal
        brands={brands}
        open={isReorderOpen}
        onOpenChange={setIsReorderOpen}
        onSuccess={() => void list.reload()}
      />
    </DashboardPageWrapper>
  );
};

interface BrandCardProps {
  brand: ClientBrand;
  onEdit: () => void;
  onDelete: () => void;
  onToggleActive: () => void;
}

const BrandCard = ({ brand, onEdit, onDelete, onToggleActive }: BrandCardProps) => {
  return (
    <div className="group relative rounded-xl border bg-card shadow-sm overflow-hidden hover:shadow-md transition-shadow">
      {/* Logo */}
      <div className="relative h-32 bg-muted flex items-center justify-center p-4">
        {brand.logo ? (
          <Image
            src={brand.logo}
            alt={brand.name}
            fill
            className="object-contain p-4"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
          />
        ) : (
          <div className="text-muted-foreground text-sm">No logo</div>
        )}
        {/* Status Badge */}
        <div
          className={`absolute top-2 left-2 px-2 py-1 rounded-full text-xs font-medium ${
            brand.isActive
              ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
              : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'
          }`}>
          {brand.isActive ? 'Active' : 'Inactive'}
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-foreground truncate">{brand.name}</h3>
            {brand.websiteUrl && (
              <a
                href={brand.websiteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-muted-foreground hover:text-primary flex items-center gap-1 mt-1">
                <ExternalLink className="size-3" />
                <span className="truncate">{brand.websiteUrl.replace(/^https?:\/\//, '')}</span>
              </a>
            )}
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <RegularBtn variant="ghost" size="icon" className="shrink-0">
                <MoreHorizontal className="size-4" />
              </RegularBtn>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={onEdit}>
                <Pencil className="size-4 mr-2" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onToggleActive}>
                {brand.isActive ? (
                  <>
                    <EyeOff className="size-4 mr-2" />
                    Deactivate
                  </>
                ) : (
                  <>
                    <Eye className="size-4 mr-2" />
                    Activate
                  </>
                )}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={onDelete}
                className="text-destructive focus:text-destructive">
                <Trash2 className="size-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
};
