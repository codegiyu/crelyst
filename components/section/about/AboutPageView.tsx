'use client';

import { HeroSection } from './HeroSection';
import { StorySection } from './StorySection';
import { ValuesSection } from './ValuesSection';
import { GallerySection } from './GallerySection';
import { TeamSection } from './TeamSection';
import type { ClientProject, ClientService, ClientTeamMember } from '@/lib/constants/endpoints';

export type AboutPageViewProps = {
  teamMembers: ClientTeamMember[];
  projects: ClientProject[];
  services: ClientService[];
};

export const AboutPageView = ({ teamMembers, projects, services }: AboutPageViewProps) => {
  return (
    <>
      <HeroSection />
      <StorySection />
      <ValuesSection />
      <GallerySection projects={projects} services={services} />
      <TeamSection teamMembers={teamMembers} />
    </>
  );
};
