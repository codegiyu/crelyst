'use client';

import { useState } from 'react';
import { SectionContainer } from '@/components/general/SectionContainer';
import { SectionHeading } from '@/components/general/SectionHeading';
import { motion } from 'motion/react';
import { useSiteStore } from '@/lib/store/siteStore';
import type { ClientTeamMember } from '@/lib/constants/endpoints';
import { Linkedin, Twitter, Instagram, Globe } from 'lucide-react';
import Image from 'next/image';
import { getActiveTeamMembersSorted } from '@/lib/utils/teamMemberDisplay';
import { TeamMemberDetailDialog } from './TeamMemberDetailDialog';

interface TeamMemberCardProps {
  member: ClientTeamMember;
  index: number;
  onOpen: (index: number) => void;
}

const TeamMemberCard = ({ member, index, onOpen }: TeamMemberCardProps) => {
  const { siteLoading } = useSiteStore(state => state);

  const hasSocials =
    member.socials?.linkedin ||
    member.socials?.twitter ||
    member.socials?.instagram ||
    member.socials?.website;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={siteLoading ? {} : { opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      viewport={{ once: true }}
      className="group text-center">
      <button
        type="button"
        onClick={() => onOpen(index)}
        className="w-full cursor-pointer text-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-xl">
        <div className="relative mb-4 overflow-hidden rounded-xl aspect-[3/4] bg-gradient-to-br from-primary/10 to-accent/10">
          {member.image ? (
            <Image
              src={member.image}
              alt=""
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <div className="w-24 h-24 rounded-full bg-primary/20 flex items-center justify-center">
                <span className="text-3xl font-bold text-primary" aria-hidden>
                  {member.name
                    .split(' ')
                    .map(n => n[0])
                    .join('')}
                </span>
              </div>
            </div>
          )}
        </div>

        <h3 className="text-lg font-semibold text-foreground">{member.name}</h3>
        <p className="text-muted-foreground">{member.role}</p>
        <span className="sr-only">View profile</span>
      </button>

      {hasSocials ? (
        <div className="mt-3 flex items-center justify-center gap-2">
          {member.socials?.twitter ? (
            <a
              href={member.socials.twitter}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${member.name} on Twitter`}
              className="flex size-9 items-center justify-center rounded-full bg-muted text-foreground transition-colors hover:bg-primary/10 hover:text-primary">
              <Twitter className="size-4" aria-hidden />
            </a>
          ) : null}
          {member.socials?.instagram ? (
            <a
              href={member.socials.instagram}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${member.name} on Instagram`}
              className="flex size-9 items-center justify-center rounded-full bg-muted text-foreground transition-colors hover:bg-primary/10 hover:text-primary">
              <Instagram className="size-4" aria-hidden />
            </a>
          ) : null}
          {member.socials?.linkedin ? (
            <a
              href={member.socials.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${member.name} on LinkedIn`}
              className="flex size-9 items-center justify-center rounded-full bg-muted text-foreground transition-colors hover:bg-primary/10 hover:text-primary">
              <Linkedin className="size-4" aria-hidden />
            </a>
          ) : null}
          {member.socials?.website ? (
            <a
              href={member.socials.website}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${member.name}'s website`}
              className="flex size-9 items-center justify-center rounded-full bg-muted text-foreground transition-colors hover:bg-primary/10 hover:text-primary">
              <Globe className="size-4" aria-hidden />
            </a>
          ) : null}
        </div>
      ) : null}
    </motion.div>
  );
};

export const TeamSection = ({ teamMembers }: { teamMembers: ClientTeamMember[] }) => {
  const { siteLoading } = useSiteStore(state => state);
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const activeMembers = getActiveTeamMembersSorted(teamMembers);

  if (activeMembers.length === 0) {
    return null;
  }

  const dialogOpen = openIndex !== null;

  return (
    <SectionContainer background="muted">
      <SectionHeading
        caption="Team"
        title="Meet Our Team"
        text="The talented people behind our success"
      />

      <motion.div
        initial={{ opacity: 0 }}
        animate={siteLoading ? {} : { opacity: 1 }}
        className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {activeMembers.map((member, index) => (
          <TeamMemberCard
            key={member._id}
            member={member}
            index={index}
            onOpen={setOpenIndex}
          />
        ))}
      </motion.div>

      <TeamMemberDetailDialog
        members={activeMembers}
        open={dialogOpen}
        initialIndex={openIndex ?? 0}
        onOpenChange={open => {
          if (!open) setOpenIndex(null);
        }}
      />
    </SectionContainer>
  );
};
