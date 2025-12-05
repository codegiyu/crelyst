/* eslint-disable react-hooks/exhaustive-deps */
'use client';

import { useEffect, useState } from 'react';
import { useBrandsStore } from '@/lib/store/useBrandsStore';
import { Plus, Pencil, Trash2, MoreHorizontal, Eye, EyeOff, ExternalLink } from 'lucide-react';
import { RegularBtn } from '@/components/atoms/RegularBtn';
import { Skeleton } from '@/components/ui/skeleton';
import { Modal } from '@/components/ui/Modal';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { BrandForm } from './BrandForm';
import { DeleteBrandDialog } from './DeleteBrandDialog';
import { DashboardPageWrapper } from '@/components/general/DashboardPageWrapper';
import type { ClientBrand } from '@/lib/constants/endpoints';
import Image from 'next/image';
import { toast } from 'sonner';
import { callApi } from '@/lib/services/callApi';

export const BrandsPageClient = () => {
  const { brands, actions, isLoading } = useBrandsStore(state => state);
  const { fetchBrands, updateBrand } = actions;

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingBrand, setEditingBrand] = useState<ClientBrand | null>(null);
  const [deleteBrand, setDeleteBrand] = useState<ClientBrand | null>(null);

  useEffect(() => {
    fetchBrands({ force: true });
  }, []);

  const handleCreate = () => {
    setEditingBrand(null);
    setIsFormOpen(true);
  };

  const handleEdit = (brand: ClientBrand) => {
    setEditingBrand(brand);
    setIsFormOpen(true);
  };

  const handleFormSuccess = () => {
    setIsFormOpen(false);
    setEditingBrand(null);
    fetchBrands({ force: true });
  };

  const handleToggleActive = async (brand: ClientBrand) => {
    try {
      const { data, error } = await callApi('ADMIN_UPDATE_BRAND', {
        query: `/${brand._id}`,
        payload: { isActive: !brand.isActive },
      });

      if (error || !data) {
        toast.error(error?.message || 'Failed to update brand');
        return;
      }

      updateBrand(data.brand);
      toast.success(`Brand ${data.brand.isActive ? 'activated' : 'deactivated'}`);
    } catch {
      toast.error('Failed to update brand');
    }
  };

  return (
    <DashboardPageWrapper
      header={{
        title: 'Brands',
        description: 'Manage your partner and client brands',
      }}
      headerActions={
        <RegularBtn
          text="Add Brand"
          LeftIcon={Plus}
          leftIconProps={{ className: 'size-5' }}
          onClick={handleCreate}
        />
      }>
      {/* Brands Grid */}
      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, idx) => (
            <BrandCardSkeleton key={idx} />
          ))}
        </div>
      ) : brands.length === 0 ? (
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
          {brands.map(brand => (
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

      {/* Create/Edit Modal */}
      <Modal
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        maxWidth="md"
        header={{
          title: editingBrand ? 'Edit Brand' : 'Add Brand',
          description: editingBrand
            ? 'Update the brand details below'
            : 'Fill in the details to add a new brand',
        }}>
        <BrandForm
          brand={editingBrand}
          onSuccess={handleFormSuccess}
          onCancel={() => setIsFormOpen(false)}
        />
      </Modal>

      {/* Delete Dialog */}
      <DeleteBrandDialog
        brand={deleteBrand}
        open={!!deleteBrand}
        onOpenChange={open => !open && setDeleteBrand(null)}
        onSuccess={() => {
          setDeleteBrand(null);
          fetchBrands({ force: true });
        }}
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
              <Button variant="ghost" size="icon" className="shrink-0">
                <MoreHorizontal className="size-4" />
              </Button>
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

const BrandCardSkeleton = () => (
  <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
    <Skeleton className="h-32 rounded-none" />
    <div className="p-4 grid gap-2">
      <Skeleton className="h-5 w-3/4" />
      <Skeleton className="h-4 w-1/2" />
    </div>
  </div>
);
