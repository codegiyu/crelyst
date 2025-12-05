/* eslint-disable react-hooks/exhaustive-deps */
'use client';

import { useEffect, useState } from 'react';
import { useServicesStore } from '@/lib/store/useServicesStore';
import { Plus, Pencil, Trash2, MoreHorizontal, Eye, EyeOff, ArrowUpDown } from 'lucide-react';
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
import { ServiceForm } from './ServiceForm';
import { DeleteServiceDialog } from './DeleteServiceDialog';
import { ReorderServicesModal } from './ReorderServicesModal';
import { DashboardPageWrapper } from '@/components/general/DashboardPageWrapper';
import type { ClientService } from '@/lib/constants/endpoints';
import Image from 'next/image';
import { toast } from 'sonner';
import { callApi } from '@/lib/services/callApi';

export const ServicesPageClient = () => {
  const { services, actions, isLoading } = useServicesStore(state => state);
  const { fetchServices, updateService } = actions;

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingService, setEditingService] = useState<ClientService | null>(null);
  const [deleteService, setDeleteService] = useState<ClientService | null>(null);
  const [isReorderOpen, setIsReorderOpen] = useState(false);

  useEffect(() => {
    fetchServices({ force: true });
  }, []);

  const handleCreate = () => {
    setEditingService(null);
    setIsFormOpen(true);
  };

  const handleEdit = (service: ClientService) => {
    setEditingService(service);
    setIsFormOpen(true);
  };

  const handleFormSuccess = () => {
    setIsFormOpen(false);
    setEditingService(null);
    fetchServices({ force: true });
  };

  const handleToggleActive = async (service: ClientService) => {
    try {
      const { data, error } = await callApi('ADMIN_UPDATE_SERVICE', {
        query: `/${service.slug}`,
        payload: { isActive: !service.isActive },
      });

      if (error || !data) {
        toast.error(error?.message || 'Failed to update service');
        return;
      }

      updateService(data.service);
      toast.success(`Service ${data.service.isActive ? 'activated' : 'deactivated'}`);
    } catch {
      toast.error('Failed to update service');
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
              onClick={() => setIsReorderOpen(true)}
            />
          )}
          <RegularBtn
            text="Add Service"
            LeftIcon={Plus}
            leftIconProps={{ className: 'size-5' }}
            onClick={handleCreate}
          />
        </div>
      }>
      {/* Services Grid */}
      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, idx) => (
            <ServiceCardSkeleton key={idx} />
          ))}
        </div>
      ) : services.length === 0 ? (
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
          fetchServices({ force: true });
        }}
      />

      {/* Reorder Modal */}
      <ReorderServicesModal
        services={services}
        open={isReorderOpen}
        onOpenChange={setIsReorderOpen}
        onSuccess={() => fetchServices({ force: true })}
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
      <div className="relative h-40 bg-muted">
        {service.image ? (
          <Image
            src={service.image}
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

const ServiceCardSkeleton = () => (
  <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
    <Skeleton className="h-40 rounded-none" />
    <div className="p-4 grid gap-3">
      <Skeleton className="h-5 w-3/4" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-1/2" />
    </div>
  </div>
);
