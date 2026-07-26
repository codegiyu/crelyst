'use client';

import { useState } from 'react';
import { Plus, Pencil, Trash2, MoreHorizontal, Eye, EyeOff, ArrowUpDown } from 'lucide-react';
import { RegularBtn } from '@/components/atoms/RegularBtn';
import { Modal } from '@/components/ui/Modal';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ServiceForm } from './ServiceForm';
import { DeleteServiceDialog } from './DeleteServiceDialog';
import { ReorderServicesModal } from './ReorderServicesModal';
import { DashboardPageWrapper } from '@/components/general/DashboardPageWrapper';
import { AdminAsyncSection } from '@/components/general/admin/AdminAsyncSection';
import { AdminMediaCardGridSkeleton } from '@/components/general/admin/loading';
import type { ClientService } from '@/lib/constants/endpoints';
import Image from 'next/image';
import { callApi } from '@/lib/services/callApi';
import { adminCallApiToast } from '@/lib/utils/adminMutationToast';
import { useAdminEditDeepLink } from '@/lib/hooks/use-admin-edit-deep-link';
import { useAdminResource } from '@/lib/hooks/use-admin-resource';
import { useRemoteListItems } from '@/lib/hooks/use-remote-list-items';

const LIST_QUERY = '?limit=100' as const;

export const ServicesPageClient = () => {
  const list = useAdminResource({
    resourceKey: ['admin', 'services', { limit: 100 }],
    endpoint: 'ADMIN_LIST_SERVICES',
    options: { query: LIST_QUERY },
    sectionLabel: 'services',
  });

  const [services, setServices] = useRemoteListItems(list.data?.services);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingService, setEditingService] = useState<ClientService | null>(null);
  const [deleteService, setDeleteService] = useState<ClientService | null>(null);
  const [isReorderOpen, setIsReorderOpen] = useState(false);

  const handleCreate = () => {
    setEditingService(null);
    setIsFormOpen(true);
  };

  const handleEdit = (service: ClientService) => {
    setEditingService(service);
    setIsFormOpen(true);
  };

  useAdminEditDeepLink(services, handleEdit);

  const handleFormSuccess = () => {
    setIsFormOpen(false);
    setEditingService(null);
    void list.reload();
  };

  const handleToggleActive = async (service: ClientService) => {
    const data = await adminCallApiToast(
      'Updating service…',
      () =>
        callApi('ADMIN_UPDATE_SERVICE', {
          query: `/${service.slug}`,
          payload: { isActive: !service.isActive },
        }),
      d => `Service ${d.service.isActive ? 'activated' : 'deactivated'}`
    );
    if (data) {
      setServices(prev => prev.map(s => (s.slug === data.service.slug ? data.service : s)));
    }
  };

  return (
    <DashboardPageWrapper
      header={{
        title: 'Services',
        description: 'Manage the services you offer',
      }}
      headerActions={
        <div className="flex items-center gap-2">
          {services.length > 1 && (
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
            text="Add Service"
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
        loadingFallback={<AdminMediaCardGridSkeleton label="Loading services" />}>
        {services.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="rounded-full bg-muted p-4 mb-4">
              <Plus className="size-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold text-foreground">No services yet</h3>
            <p className="text-muted-foreground mb-4">Get started by creating your first service</p>
            <RegularBtn
              text="Add Service"
              LeftIcon={Plus}
              leftIconProps={{ className: 'size-5' }}
              onClick={handleCreate}
            />
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {services.map(service => (
              <ServiceCard
                key={service._id}
                service={service}
                onEdit={() => handleEdit(service)}
                onDelete={() => setDeleteService(service)}
                onToggleActive={() => handleToggleActive(service)}
              />
            ))}
          </div>
        )}
      </AdminAsyncSection>

      {/* Create/Edit Modal */}
      <Modal
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        maxWidth="xl"
        header={{
          title: editingService ? 'Edit Service' : 'Create Service',
          description: editingService
            ? 'Update the service details below'
            : 'Fill in the details to create a new service',
        }}>
        <ServiceForm
          service={editingService}
          onSuccess={handleFormSuccess}
          onCancel={() => setIsFormOpen(false)}
        />
      </Modal>

      {/* Delete Dialog */}
      <DeleteServiceDialog
        service={deleteService}
        open={!!deleteService}
        onOpenChange={open => !open && setDeleteService(null)}
        onSuccess={() => {
          setDeleteService(null);
          void list.reload();
        }}
      />

      {/* Reorder Modal */}
      <ReorderServicesModal
        services={services}
        open={isReorderOpen}
        onOpenChange={setIsReorderOpen}
        onSuccess={() => void list.reload()}
      />
    </DashboardPageWrapper>
  );
};

interface ServiceCardProps {
  service: ClientService;
  onEdit: () => void;
  onDelete: () => void;
  onToggleActive: () => void;
}

const ServiceCard = ({ service, onEdit, onDelete, onToggleActive }: ServiceCardProps) => {
  return (
    <div className="group relative rounded-xl border bg-card shadow-sm overflow-hidden hover:shadow-md transition-shadow">
      {/* Image */}
      <div className="relative h-72 bg-muted">
        {service.cardImage || service.bannerImage || service.image ? (
          <Image
            src={service.cardImage || service.bannerImage || service.image || ''}
            alt={service.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            No image
          </div>
        )}
        {/* Status Badge */}
        <div
          className={`absolute top-2 left-2 px-2 py-1 rounded-full text-xs font-medium ${
            service.isActive
              ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
              : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'
          }`}>
          {service.isActive ? 'Active' : 'Inactive'}
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-foreground truncate">{service.title}</h3>
            <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
              {service.shortDescription || service.description}
            </p>
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
                {service.isActive ? (
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

        {/* Features count */}
        {service.features && service.features.length > 0 && (
          <p className="text-xs text-muted-foreground mt-3">
            {service.features.length} feature{service.features.length !== 1 ? 's' : ''}
          </p>
        )}
      </div>
    </div>
  );
};
