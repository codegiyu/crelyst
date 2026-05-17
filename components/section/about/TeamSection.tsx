'use client';

import { SectionContainer } from '@/components/general/SectionContainer';
import { SectionHeading } from '@/components/general/SectionHeading';
import { motion } from 'motion/react';
import { useSiteStore } from '@/lib/store/siteStore';
import type { ClientTeamMember } from '@/lib/constants/endpoints';
import { Linkedin, Twitter, Instagram, Globe } from 'lucide-react';
import Image from 'next/image';

interface TeamMemberCardProps {
  member: ClientTeamMember;
  index: number;
}

const TeamMemberCard = ({ member, index }: TeamMemberCardProps) => {
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
      <div className="relative mb-4 overflow-hidden rounded-xl aspect-[3/4] bg-gradient-to-br from-primary/10 to-accent/10">
        {member.image ? (
          <Image
            src={member.image}
            alt={member.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
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
          <div className="absolute top-3 right-3 flex flex-col gap-2">
            {member.socials?.twitter && (
              <a
                href={member.socials.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-black/45 backdrop-blur-sm flex items-center justify-center hover:bg-black/60 transition-colors">
                <Twitter className="w-5 h-5 text-white" />
              </a>
            )}
            {member.socials?.instagram && (
              <a
                href={member.socials.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-black/45 backdrop-blur-sm flex items-center justify-center hover:bg-black/60 transition-colors">
                <Instagram className="w-5 h-5 text-white" />
              </a>
            )}
            {member.socials?.linkedin && (
              <a
                href={member.socials.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-black/45 backdrop-blur-sm flex items-center justify-center hover:bg-black/60 transition-colors">
                <Linkedin className="w-5 h-5 text-white" />
              </a>
            )}
            {member.socials?.website && (
              <a
                href={member.socials.website}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-black/45 backdrop-blur-sm flex items-center justify-center hover:bg-black/60 transition-colors">
                <Globe className="w-5 h-5 text-white" />
              </a>
            )}
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

export const TeamSection = ({ teamMembers }: { teamMembers: ClientTeamMember[] }) => {
  const { siteLoading } = useSiteStore(state => state);

  const activeMembers = teamMembers
    .filter(m => m.isActive)
    .sort((a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0));

  if (activeMembers.length === 0) {
    return null;
  }

  return (
    <SectionContainer background="muted">
      <SectionHeading title="Meet Our Team" text="The talented people behind our success" />

      <motion.div
        initial={{ opacity: 0 }}
        animate={siteLoading ? {} : { opacity: 1 }}
        className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {activeMembers.map((member, index) => (
          <TeamMemberCard key={member._id} member={member} index={index} />
        ))}
      </motion.div>
    </SectionContainer>
  );
};
