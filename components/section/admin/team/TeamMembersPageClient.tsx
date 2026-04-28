'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Plus,
  Pencil,
  Trash2,
  MoreHorizontal,
  Eye,
  EyeOff,
  ArrowUpDown,
  Mail,
  Phone,
  Linkedin,
  Twitter,
  Instagram,
  Globe,
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
import { TeamMemberForm } from './TeamMemberForm';
import { DeleteTeamMemberDialog } from './DeleteTeamMemberDialog';
import { ReorderTeamMembersModal } from './ReorderTeamMembersModal';
import { DashboardPageWrapper } from '@/components/general/DashboardPageWrapper';
import type { ClientTeamMember } from '@/lib/constants/endpoints';
import Image from 'next/image';
import { callApi } from '@/lib/services/callApi';
import { adminCallApiToast } from '@/lib/utils/adminMutationToast';
import Link from 'next/link';

export const TeamMembersPageClient = ({
  initialTeamMembers,
}: {
  initialTeamMembers: ClientTeamMember[];
}) => {
  const router = useRouter();
  const [teamMembers, setTeamMembers] = useState<ClientTeamMember[]>(initialTeamMembers);

  useEffect(() => {
    setTeamMembers(initialTeamMembers);
  }, [initialTeamMembers]);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<ClientTeamMember | null>(null);
  const [deleteMember, setDeleteMember] = useState<ClientTeamMember | null>(null);
  const [isReorderOpen, setIsReorderOpen] = useState(false);

  const handleCreate = () => {
    setEditingMember(null);
    setIsFormOpen(true);
  };

  const handleEdit = (member: ClientTeamMember) => {
    setEditingMember(member);
    setIsFormOpen(true);
  };

  const handleFormSuccess = () => {
    setIsFormOpen(false);
    setEditingMember(null);
    router.refresh();
  };

  const handleToggleActive = async (member: ClientTeamMember) => {
    const data = await adminCallApiToast(
      'Updating team member…',
      () =>
        callApi('ADMIN_UPDATE_TEAM_MEMBER', {
          query: `/${member._id}`,
          payload: { isActive: !member.isActive },
        }),
      d => `Team member ${d.teamMember.isActive ? 'activated' : 'deactivated'}`
    );
    if (data) {
      setTeamMembers(prev => prev.map(m => (m._id === data.teamMember._id ? data.teamMember : m)));
    }
  };

  // Sort team members by displayOrder
  const sortedMembers = [...teamMembers].sort(
    (a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0)
  );

  return (
    <DashboardPageWrapper
      header={{
        title: 'Team Members',
        description: 'Manage the team members displayed on your website',
      }}
      headerActions={
        <div className="flex items-center gap-2">
          {teamMembers.length > 1 && (
            <RegularBtn
              text="Reorder"
              variant="outline"
              LeftIcon={ArrowUpDown}
              leftIconProps={{ className: 'size-4' }}
              onClick={() => setIsReorderOpen(true)}
            />
          )}
          <RegularBtn
            text="Add Member"
            LeftIcon={Plus}
            leftIconProps={{ className: 'size-5' }}
            onClick={handleCreate}
          />
        </div>
      }>
      {teamMembers.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="rounded-full bg-muted p-4 mb-4">
            <Plus className="size-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold text-foreground">No team members yet</h3>
          <p className="text-muted-foreground mb-4">Get started by adding your first team member</p>
          <RegularBtn
            text="Add Member"
            LeftIcon={Plus}
            leftIconProps={{ className: 'size-5' }}
            onClick={handleCreate}
          />
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
          {sortedMembers.map(member => (
            <TeamMemberCard
              key={member._id}
              member={member}
              onEdit={() => handleEdit(member)}
              onDelete={() => setDeleteMember(member)}
              onToggleActive={() => handleToggleActive(member)}
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
          title: editingMember ? 'Edit Team Member' : 'Add Team Member',
          description: editingMember
            ? 'Update the team member details below'
            : 'Fill in the details to add a new team member',
        }}>
        <TeamMemberForm
          member={editingMember}
          onSuccess={handleFormSuccess}
          onCancel={() => setIsFormOpen(false)}
        />
      </Modal>

      {/* Delete Dialog */}
      <DeleteTeamMemberDialog
        member={deleteMember}
        open={!!deleteMember}
        onOpenChange={open => !open && setDeleteMember(null)}
        onSuccess={() => {
          setDeleteMember(null);
          router.refresh();
        }}
      />

      {/* Reorder Modal */}
      <ReorderTeamMembersModal
        members={sortedMembers}
        open={isReorderOpen}
        onOpenChange={setIsReorderOpen}
        onSuccess={() => router.refresh()}
      />
    </DashboardPageWrapper>
  );
};

interface TeamMemberCardProps {
  member: ClientTeamMember;
  onEdit: () => void;
  onDelete: () => void;
  onToggleActive: () => void;
}

const TeamMemberCard = ({ member, onEdit, onDelete, onToggleActive }: TeamMemberCardProps) => {
  const hasSocials =
    member.socials?.linkedin ||
    member.socials?.twitter ||
    member.socials?.instagram ||
    member.socials?.website;

  return (
    <div className="group relative rounded-xl border bg-card shadow-sm overflow-hidden hover:shadow-md transition-shadow">
      {/* Image */}
      <div className="relative aspect-[3/4] bg-muted">
        {member.image ? (
          <Image
            src={member.image}
            alt={member.name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            <div className="w-20 h-20 rounded-full bg-muted-foreground/20 flex items-center justify-center text-3xl font-semibold text-muted-foreground">
              {member.name.charAt(0).toUpperCase()}
            </div>
          </div>
        )}
        {/* Status Badge */}
        <div
          className={`absolute top-2 left-2 px-2 py-1 rounded-full text-xs font-medium ${
            member.isActive
              ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
              : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'
          }`}>
          {member.isActive ? 'Active' : 'Inactive'}
        </div>

        {hasSocials && (
          <div className="absolute top-3 right-3 flex flex-col gap-2">
            {member.socials?.twitter && (
              <a
                href={member.socials.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-black/45 backdrop-blur-sm flex items-center justify-center hover:bg-black/60 transition-colors">
                <Twitter className="size-4 text-white" />
              </a>
            )}
            {member.socials?.instagram && (
              <a
                href={member.socials.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-black/45 backdrop-blur-sm flex items-center justify-center hover:bg-black/60 transition-colors">
                <Instagram className="size-4 text-white" />
              </a>
            )}
            {member.socials?.linkedin && (
              <a
                href={member.socials.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-black/45 backdrop-blur-sm flex items-center justify-center hover:bg-black/60 transition-colors">
                <Linkedin className="size-4 text-white" />
              </a>
            )}
            {member.socials?.website && (
              <a
                href={member.socials.website}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-black/45 backdrop-blur-sm flex items-center justify-center hover:bg-black/60 transition-colors">
                <Globe className="size-4 text-white" />
              </a>
            )}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="space-y-8 p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-foreground truncate">{member.name}</h3>
            <p className="text-sm text-primary truncate">{member.role}</p>
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
                {member.isActive ? (
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

        <div className="">
          {member.bio && (
            <p className="text-xs leading-5 text-muted-foreground mt-1">{member.bio}</p>
          )}
        </div>

        {/* Contact Info */}
        <div className="flex items-center gap-3 mt-3 text-xs text-muted-foreground">
          {member.email && (
            <Link href={`mailto:${member.email}`} className="hover:text-foreground">
              <div className="flex items-center gap-1 truncate">
                <Mail className="size-3 shrink-0" />
                <span className="truncate">{member.email}</span>
              </div>
            </Link>
          )}
          {member.phone && (
            <Link
              href={`tel:${member.phone.replaceAll(' ', '')}`}
              className="hover:text-foreground">
              <div className="flex items-center gap-1">
                <Phone className="size-3 shrink-0" />
                <span>{member.phone}</span>
              </div>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};
