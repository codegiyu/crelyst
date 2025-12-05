/* eslint-disable react-hooks/exhaustive-deps */
'use client';

import { useEffect } from 'react';
import { SectionContainer } from '@/components/general/SectionContainer';
import { SectionHeading } from '@/components/general/SectionHeading';
import { motion } from 'motion/react';
import { useSiteStore } from '@/lib/store/siteStore';
import { useTeamMembersStore } from '@/lib/store/useTeamMembersStore';
import { ClientTeamMember } from '@/lib/constants/endpoints';
import { Linkedin, Twitter, Github, Globe } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

interface TeamMemberCardProps {
  member: ClientTeamMember;
  index: number;
}

const TeamMemberCard = ({ member, index }: TeamMemberCardProps) => {
  const { siteLoading } = useSiteStore(state => state);

  const hasSocials =
    member.socials?.linkedin ||
    member.socials?.twitter ||
    member.socials?.github ||
    member.socials?.website;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={siteLoading ? {} : { opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      viewport={{ once: true }}
      className="group text-center">
      <div className="relative mb-4 overflow-hidden rounded-xl aspect-[3/4] bg-gradient-to-br from-primary/10 to-accent/10">
        {member.image ? (
          <img
            src={member.image}
            alt={member.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="w-24 h-24 rounded-full bg-primary/20 flex items-center justify-center">
              <span className="text-3xl font-bold text-primary">
                {member.name
                  .split(' ')
                  .map(n => n[0])
                  .join('')}
              </span>
            </div>
          </div>
        )}

        {/* Social overlay */}
        {hasSocials && (
          <div className="absolute inset-0 bg-gradient-to-t from-primary/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-6">
            <div className="flex gap-3">
              {member.socials?.linkedin && (
                <a
                  href={member.socials.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors">
                  <Linkedin className="w-5 h-5 text-white" />
                </a>
              )}
              {member.socials?.twitter && (
                <a
                  href={member.socials.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors">
                  <Twitter className="w-5 h-5 text-white" />
                </a>
              )}
              {member.socials?.github && (
                <a
                  href={member.socials.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors">
                  <Github className="w-5 h-5 text-white" />
                </a>
              )}
              {member.socials?.website && (
                <a
                  href={member.socials.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors">
                  <Globe className="w-5 h-5 text-white" />
                </a>
              )}
            </div>
          </div>
        )}
      </div>

      <h3 className="text-lg font-semibold text-foreground">{member.name}</h3>
      <p className="text-muted-foreground">{member.role}</p>
      {member.bio && (
        <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{member.bio}</p>
      )}
    </motion.div>
  );
};

export const TeamSection = () => {
  const { siteLoading } = useSiteStore(state => state);
  const { teamMembers, isLoading, fetchTeamMembers } = useTeamMembersStore(state => ({
    teamMembers: state.teamMembers,
    isLoading: state.isLoading,
    fetchTeamMembers: state.actions.fetchTeamMembers,
  }));

  useEffect(() => {
    fetchTeamMembers();
  }, []);

  const activeMembers = teamMembers
    .filter(m => m.isActive)
    .sort((a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0));

  // Don't render if no team members and not loading
  if (!isLoading && activeMembers.length === 0) {
    return null;
  }

  return (
    <SectionContainer background="muted">
      <SectionHeading title="Meet Our Team" text="The talented people behind our success" />

      {isLoading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="text-center">
              <Skeleton className="aspect-[3/4] rounded-xl mb-4" />
              <Skeleton className="h-6 w-3/4 mx-auto mb-2" />
              <Skeleton className="h-4 w-1/2 mx-auto" />
            </div>
          ))}
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={siteLoading ? {} : { opacity: 1 }}
          className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {activeMembers.map((member, index) => (
            <TeamMemberCard key={member._id} member={member} index={index} />
          ))}
        </motion.div>
      )}
    </SectionContainer>
  );
};
