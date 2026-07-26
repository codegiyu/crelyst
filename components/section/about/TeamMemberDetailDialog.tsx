'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, Globe, Instagram, Linkedin, Twitter } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import type { Swiper as SwiperInstance } from 'swiper';
import { A11y, Keyboard, Navigation, Pagination } from 'swiper/modules';
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import type { ClientTeamMember } from '@/lib/constants/endpoints';
import {
  clampTeamMemberSlideIndex,
  shouldShowTeamMemberNav,
  splitTeamMemberBioParagraphs,
} from '@/lib/utils/teamMemberDisplay';
import { cn } from '@/lib/utils';

type TeamMemberDetailDialogProps = {
  members: ClientTeamMember[];
  open: boolean;
  initialIndex: number;
  onOpenChange: (open: boolean) => void;
};

function MemberInitials({ name }: { name: string }) {
  return (
    <span className="text-3xl font-bold text-primary">
      {name
        .split(' ')
        .map(part => part[0])
        .join('')}
    </span>
  );
}

function MemberSocialLinks({
  member,
  className,
}: {
  member: ClientTeamMember;
  className?: string;
}) {
  const socials = [
    member.socials?.twitter
      ? { href: member.socials.twitter, label: `${member.name} on Twitter`, Icon: Twitter }
      : null,
    member.socials?.instagram
      ? {
          href: member.socials.instagram,
          label: `${member.name} on Instagram`,
          Icon: Instagram,
        }
      : null,
    member.socials?.linkedin
      ? { href: member.socials.linkedin, label: `${member.name} on LinkedIn`, Icon: Linkedin }
      : null,
    member.socials?.website
      ? { href: member.socials.website, label: `${member.name}'s website`, Icon: Globe }
      : null,
  ].filter(Boolean) as Array<{
    href: string;
    label: string;
    Icon: typeof Twitter;
  }>;

  if (socials.length === 0) return null;

  return (
    <div className={cn('flex flex-wrap items-center gap-2', className)}>
      {socials.map(({ href, label, Icon }) => (
        <a
          key={href}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={label}
          className="flex size-10 items-center justify-center rounded-full border border-border bg-card text-foreground transition-colors hover:border-primary/35 hover:text-primary">
          <Icon className="size-4" aria-hidden />
        </a>
      ))}
    </div>
  );
}

function syncSwiperLayout(swiper: SwiperInstance) {
  swiper.updateSize();
  swiper.updateSlides();
  swiper.updateProgress();
  swiper.updateSlidesClasses();
  swiper.updateAutoHeight?.(0);
}

type TeamMemberSwiperProps = {
  members: ClientTeamMember[];
  startIndex: number;
};

function TeamMemberSwiper({ members, startIndex }: TeamMemberSwiperProps) {
  const prevRef = useRef<HTMLButtonElement>(null);
  const nextRef = useRef<HTMLButtonElement>(null);
  const swiperRef = useRef<SwiperInstance | null>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [layoutReady, setLayoutReady] = useState(false);
  const showNav = shouldShowTeamMemberNav(members.length);

  // Defer init until the open dialog has a measurable width.
  useEffect(() => {
    let cancelled = false;
    let innerFrame = 0;

    const outerFrame = requestAnimationFrame(() => {
      innerFrame = requestAnimationFrame(() => {
        if (!cancelled) setLayoutReady(true);
      });
    });

    return () => {
      cancelled = true;
      cancelAnimationFrame(outerFrame);
      cancelAnimationFrame(innerFrame);
    };
  }, []);

  useEffect(() => {
    if (!layoutReady || !trackRef.current) return;

    const observer = new ResizeObserver(() => {
      if (swiperRef.current) syncSwiperLayout(swiperRef.current);
    });

    observer.observe(trackRef.current);

    return () => observer.disconnect();
  }, [layoutReady]);

  function bindNavigation(swiper: SwiperInstance) {
    if (!showNav) return;

    const navigation = swiper.params.navigation;

    if (navigation && typeof navigation !== 'boolean') {
      navigation.prevEl = prevRef.current;
      navigation.nextEl = nextRef.current;
    }

    swiper.navigation?.destroy();
    swiper.navigation?.init();
    swiper.navigation?.update();
  }

  return (
    <div ref={trackRef} className="relative w-full min-w-0">
      {showNav ? (
        <>
          <Button
            ref={prevRef}
            type="button"
            variant="outline"
            size="icon"
            className="absolute top-1/2 left-3 z-10 size-11 -translate-y-1/2 border-border bg-background/90 shadow-sm backdrop-blur-sm hover:border-primary/35 sm:left-5"
            aria-label="Previous team member">
            <ChevronLeft className="size-5" aria-hidden />
          </Button>

          <Button
            ref={nextRef}
            type="button"
            variant="outline"
            size="icon"
            className="absolute top-1/2 right-3 z-10 size-11 -translate-y-1/2 border-border bg-background/95 shadow-sm backdrop-blur-md hover:border-primary/35 sm:right-5"
            aria-label="Next team member">
            <ChevronRight className="size-5" aria-hidden />
          </Button>
        </>
      ) : null}

      {layoutReady ? (
        <Swiper
          key={`team-member-swiper-${startIndex}-${members.map(m => m._id).join('-')}`}
          modules={[Navigation, Pagination, A11y, Keyboard]}
          initialSlide={startIndex}
          // Rewind cycles members without loop clones that mis-measure inside dialogs.
          rewind={showNav}
          loop={false}
          slidesPerView={1}
          spaceBetween={0}
          speed={400}
          autoHeight
          watchOverflow
          keyboard={{ enabled: true }}
          a11y={{
            prevSlideMessage: 'Previous team member',
            nextSlideMessage: 'Next team member',
            paginationBulletMessage: 'Go to team member {{index}}',
          }}
          pagination={
            showNav
              ? {
                  type: 'bullets',
                  clickable: true,
                }
              : false
          }
          navigation={showNav}
          onBeforeInit={bindNavigation}
          onSwiper={swiper => {
            swiperRef.current = swiper;
            bindNavigation(swiper);
            syncSwiperLayout(swiper);
            swiper.slideTo(startIndex, 0);
          }}
          className="w-full min-w-0 pb-12">
          {members.map(member => (
            <SwiperSlide key={member._id} className="!h-auto min-w-0">
              <article className="grid w-full min-w-0 gap-0 sm:grid-cols-[minmax(0,22rem)_minmax(0,1fr)] lg:grid-cols-[minmax(0,26rem)_minmax(0,1fr)]">
                <div className="relative aspect-[3/4] w-full bg-gradient-to-br from-primary/10 to-accent/10 sm:aspect-auto sm:min-h-[28rem] lg:min-h-[32rem]">
                  {member.image ? (
                    <Image
                      src={member.image}
                      alt={member.name}
                      fill
                      sizes="(max-width: 640px) 100vw, 26rem"
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex h-full min-h-[18rem] w-full items-center justify-center sm:min-h-[28rem] lg:min-h-[32rem]">
                      <div className="flex size-28 items-center justify-center rounded-full bg-primary/20">
                        <MemberInitials name={member.name} />
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex min-w-0 flex-col gap-5 p-6 pt-14 sm:p-10 sm:pt-12 lg:p-12">
                  <div className="grid min-w-0 gap-2">
                    <h2 className="text-3xl font-semibold text-foreground lg:text-4xl">
                      {member.name}
                    </h2>
                    <p className="text-sm text-muted-foreground lg:text-base">{member.role}</p>
                  </div>

                  {member.bio ? (
                    <div className="grid min-w-0 gap-4">
                      {splitTeamMemberBioParagraphs(member.bio).map((paragraph, index) => (
                        <p
                          key={`${member._id}-bio-${index}`}
                          className="min-w-0 break-words text-wrap text-base leading-relaxed text-muted-foreground lg:text-lg">
                          {paragraph}
                        </p>
                      ))}
                    </div>
                  ) : (
                    <p className="text-base text-muted-foreground/80">
                      No bio available for this team member yet.
                    </p>
                  )}

                  <MemberSocialLinks member={member} className="mt-auto pt-2" />
                </div>
              </article>
            </SwiperSlide>
          ))}
        </Swiper>
      ) : (
        <div className="min-h-[28rem] w-full" aria-hidden />
      )}
    </div>
  );
}

export function TeamMemberDetailDialog({
  members,
  open,
  initialIndex,
  onOpenChange,
}: TeamMemberDetailDialogProps) {
  const startIndex = clampTeamMemberSlideIndex(initialIndex, members.length);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {open && members.length > 0 ? (
        <DialogContent
          overlayClassName="bg-black/75"
          className="team-member-swiper scrollbar-primary-slim max-h-[min(92vh,56rem)] w-[min(100%-1.5rem,72rem)] max-w-[72rem] gap-0 overflow-y-auto overflow-x-hidden p-0 sm:w-[min(100%-2rem,72rem)]">
          <DialogTitle className="sr-only">Team members</DialogTitle>
          <DialogDescription className="sr-only">
            Browse team member profiles. Use arrow keys or controls to move between members.
          </DialogDescription>

          <TeamMemberSwiper
            key={`team-dialog-${startIndex}-${members.map(m => m._id).join('-')}`}
            members={members}
            startIndex={startIndex}
          />
        </DialogContent>
      ) : null}
    </Dialog>
  );
}
