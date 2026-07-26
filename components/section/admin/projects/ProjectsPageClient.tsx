'use client';

import { useState } from 'react';
import {
  Plus,
  Pencil,
  Trash2,
  MoreHorizontal,
  Star,
  StarOff,
  ArrowUpDown,
  ExternalLink,
  Github,
  Eye,
  EyeOff,
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
import { ProjectForm } from './ProjectForm';
import { DeleteProjectDialog } from './DeleteProjectDialog';
import { ReorderProjectsModal } from './ReorderProjectsModal';
import { DashboardPageWrapper } from '@/components/general/DashboardPageWrapper';
import { AdminAsyncSection } from '@/components/general/admin/AdminAsyncSection';
import { AdminMediaCardGridSkeleton } from '@/components/general/admin/loading';
import type { ClientProject } from '@/lib/constants/endpoints';
import Image from 'next/image';
import { callApi } from '@/lib/services/callApi';
import { adminCallApiToast } from '@/lib/utils/adminMutationToast';
import { useAdminEditDeepLink } from '@/lib/hooks/use-admin-edit-deep-link';
import { useAdminResource } from '@/lib/hooks/use-admin-resource';
import { useRemoteListItems } from '@/lib/hooks/use-remote-list-items';
import { cn } from '@/lib/utils';

const LIST_QUERY = '?limit=100' as const;

export const ProjectsPageClient = () => {
  const list = useAdminResource({
    resourceKey: ['admin', 'projects', { limit: 100 }],
    endpoint: 'ADMIN_LIST_PROJECTS',
    options: { query: LIST_QUERY },
    sectionLabel: 'projects',
  });

  const [projects, setProjects] = useRemoteListItems(list.data?.projects);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<ClientProject | null>(null);
  const [deleteProject, setDeleteProject] = useState<ClientProject | null>(null);
  const [isReorderOpen, setIsReorderOpen] = useState(false);

  const handleCreate = () => {
    setEditingProject(null);
    setIsFormOpen(true);
  };

  const handleEdit = (project: ClientProject) => {
    setEditingProject(project);
    setIsFormOpen(true);
  };

  useAdminEditDeepLink(projects, handleEdit);

  const handleFormSuccess = () => {
    setIsFormOpen(false);
    setEditingProject(null);
    void list.reload();
  };

  const handleToggleFeatured = async (project: ClientProject) => {
    const identifier = project.slug || project._id;
    const data = await adminCallApiToast(
      'Updating project…',
      () =>
        callApi('ADMIN_UPDATE_PROJECT', {
          query: `/${identifier}`,
          payload: { isFeatured: !project.isFeatured },
        }),
      d => `Project ${d.project.isFeatured ? 'featured' : 'unfeatured'}`
    );
    if (data) {
      setProjects(prev => prev.map(p => (p.slug === data.project.slug ? data.project : p)));
    }
  };

  const handleToggleActive = async (project: ClientProject) => {
    const identifier = project.slug || project._id;
    const data = await adminCallApiToast(
      'Updating project…',
      () =>
        callApi('ADMIN_UPDATE_PROJECT', {
          query: `/${identifier}`,
          payload: { isActive: !project.isActive },
        }),
      d => `Project ${d.project.isActive ? 'activated' : 'deactivated'}`
    );
    if (data) {
      setProjects(prev => prev.map(p => (p.slug === data.project.slug ? data.project : p)));
    }
  };

  return (
    <DashboardPageWrapper
      header={{
        title: 'Projects',
        description: 'Manage your portfolio projects',
      }}
      headerActions={
        <div className="flex items-center gap-2">
          {projects.length > 1 && (
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
            text="Add Project"
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
        loadingFallback={<AdminMediaCardGridSkeleton label="Loading projects" />}>
        {projects.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="rounded-full bg-muted p-4 mb-4">
              <Plus className="size-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold text-foreground">No projects yet</h3>
            <p className="text-muted-foreground mb-4">Get started by creating your first project</p>
            <RegularBtn
              text="Add Project"
              LeftIcon={Plus}
              leftIconProps={{ className: 'size-5' }}
              onClick={handleCreate}
            />
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {projects.map(project => (
              <ProjectCard
                key={project._id}
                project={project}
                onEdit={() => handleEdit(project)}
                onDelete={() => setDeleteProject(project)}
                onToggleFeatured={() => handleToggleFeatured(project)}
                onToggleActive={() => handleToggleActive(project)}
              />
            ))}
          </div>
        )}
      </AdminAsyncSection>

      {/* Create/Edit Modal */}
      <Modal
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        maxWidth="4xl"
        header={{
          title: editingProject ? 'Edit Project' : 'Create Project',
          description: editingProject
            ? 'Update the project details below'
            : 'Fill in the details to create a new project',
        }}>
        <ProjectForm
          key={editingProject?._id ?? 'new-project'}
          project={editingProject}
          onSuccess={handleFormSuccess}
          onCancel={() => setIsFormOpen(false)}
        />
      </Modal>

      {/* Delete Dialog */}
      <DeleteProjectDialog
        project={deleteProject}
        open={!!deleteProject}
        onOpenChange={open => !open && setDeleteProject(null)}
        onSuccess={() => {
          setDeleteProject(null);
          void list.reload();
        }}
      />

      {/* Reorder Modal */}
      <ReorderProjectsModal
        projects={projects}
        open={isReorderOpen}
        onOpenChange={setIsReorderOpen}
        onSuccess={() => void list.reload()}
      />
    </DashboardPageWrapper>
  );
};

interface ProjectCardProps {
  project: ClientProject;
  onEdit: () => void;
  onDelete: () => void;
  onToggleFeatured: () => void;
  onToggleActive: () => void;
}

const statusColors: Record<string, string> = {
  draft: 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400',
  'in-progress': 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  completed: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  'on-hold': 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
  cancelled: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
};

const ProjectCard = ({
  project,
  onEdit,
  onDelete,
  onToggleFeatured,
  onToggleActive,
}: ProjectCardProps) => {
  return (
    <div className="group relative rounded-xl border bg-card shadow-sm overflow-hidden hover:shadow-md transition-shadow">
      {/* Image */}
      <div className="relative h-72 bg-muted">
        {project.featuredImage || project.cardImage ? (
          <Image
            src={project.featuredImage || project.cardImage || ''}
            alt={project.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            No image
          </div>
        )}
        {/* Badges */}
        <div className="absolute top-2 left-2 flex items-center gap-2">
          <div
            className={cn(
              'px-2 py-1 rounded-full text-xs font-medium capitalize',
              statusColors[project.status] || statusColors.draft
            )}>
            {project.status.replace('-', ' ')}
          </div>
          <div
            className={cn(
              'px-2 py-1 rounded-full text-xs font-medium',
              project.isActive
                ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'
            )}>
            {project.isActive ? 'Active' : 'Inactive'}
          </div>
          {project.isFeatured && (
            <div className="px-2 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 flex items-center gap-1">
              <Star className="size-3 fill-current" />
              Featured
            </div>
          )}
          {project.caseStudy && (
            <div className="px-2 py-1 rounded-full text-xs font-medium bg-violet-100 text-violet-800 dark:bg-violet-900/40 dark:text-violet-300">
              Case study
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-foreground truncate">{project.title}</h3>
            <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
              {project.shortDescription || project.description}
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
              <DropdownMenuItem onClick={onToggleFeatured}>
                {project.isFeatured ? (
                  <>
                    <StarOff className="size-4 mr-2" />
                    Remove from Featured
                  </>
                ) : (
                  <>
                    <Star className="size-4 mr-2" />
                    Add to Featured
                  </>
                )}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onToggleActive}>
                {project.isActive ? (
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
              {project.projectUrl && (
                <DropdownMenuItem asChild>
                  <a href={project.projectUrl} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="size-4 mr-2" />
                    Visit Project
                  </a>
                </DropdownMenuItem>
              )}
              {project.githubUrl && (
                <DropdownMenuItem asChild>
                  <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                    <Github className="size-4 mr-2" />
                    View on GitHub
                  </a>
                </DropdownMenuItem>
              )}
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

        {/* Meta info */}
        <div className="flex flex-wrap items-center gap-2 mt-3">
          {project.category && (
            <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded">
              {project.category}
            </span>
          )}
          {project.technologies && project.technologies.length > 0 && (
            <span className="text-xs text-muted-foreground">
              {project.technologies.length} tech{project.technologies.length !== 1 ? 's' : ''}
            </span>
          )}
          {project.clientName && (
            <span className="text-xs text-muted-foreground">• {project.clientName}</span>
          )}
        </div>
      </div>
    </div>
  );
};
