/* eslint-disable react-hooks/exhaustive-deps */
'use client';

import { useEffect } from 'react';
import { GhostBtn } from '../atoms/GhostBtn';
import { LogoFull } from '../icons';
import { NAV_LINKS } from '@/lib/constants/texts';
import { HeaderLinkProps } from './Header';
import { IconComp, LucideIconComp } from '@/lib/types/general';
import { useSiteSettingsStore } from '@/lib/store/useSiteSettingsStore';
import { getSocialIcon, formatSocialLabel } from '@/lib/utils/socials';
import { transformContactInfoToFooterCards, formatOfficeHours } from '@/lib/utils/contactInfo';
import { Skeleton } from '@/components/ui/skeleton';

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  const { settings, isLoading, fetchSettings } = useSiteSettingsStore(state => ({
    settings: state.settings,
    isLoading: state.isLoading,
    fetchSettings: state.actions.fetchSettings,
  }));

  useEffect(() => {
    // Fetch contactInfo and socials slices
    fetchSettings('contactInfo');
    fetchSettings('socials');
    fetchSettings('appDetails');
  }, []);

  const contactCards = transformContactInfoToFooterCards(settings?.contactInfo);
  const officeHours = formatOfficeHours(settings?.contactInfo?.officeHours);

  const socials =
    settings?.socials?.map(social => ({
      Icon: getSocialIcon(social.platform),
      href: social.href,
      label: formatSocialLabel(social.platform),
    })) || [];

  const appName = settings?.appDetails?.appName || 'Your Company';
  const appDescription =
    settings?.appDetails?.description ||
    'Your site description here. Update this with your actual content.';

  return (
    <footer className="bg-secondary text-secondary-foreground pt-16 md:pt-16 lg:pt-20 2xl:pt-28">
      <div className="regular-container">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 text-[0.9375rem] mb-12">
          {/* Company Info */}
          <div className="h-fit grid gap-4">
            <div className="flex items-center">
              <GhostBtn
                Icon={LogoFull}
                iconClass="text-secondary-foreground/80 text-3xl"
                linkProps={{ href: '/' }}
                size="none"
              />
            </div>
            <p className="text-secondary-foreground/80 text-[0.9375rem] leading-[1.6]">
              {appDescription}
            </p>
            <div className="w-full flex items-center gap-4">
              {isLoading && socials.length === 0 ? (
                <>
                  <Skeleton className="size-10 rounded-full" />
                  <Skeleton className="size-10 rounded-full" />
                  <Skeleton className="size-10 rounded-full" />
                </>
              ) : (
                socials.map((social, idx) => <SocialBtn key={idx} {...social} />)
              )}
            </div>
          </div>

          {/* Quick Links */}
          <div className="h-fit grid gap-4">
            <h3 className="text-lg font-semibold text-accent">Quick Links</h3>
            <ul className="grid gap-3">
              {NAV_LINKS.filter(item => !item.showInHeaderOnly).map((item, idx) => (
                <FooterLink key={idx} {...item} />
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div className="h-fit grid gap-4">
            <h3 className="text-lg font-semibold text-accent">Contact</h3>
            <div className="grid gap-5 text-secondary-foreground/60">
              {isLoading && contactCards.length === 0 ? (
                <>
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-8 w-3/4" />
                  <Skeleton className="h-8 w-3/4" />
                </>
              ) : (
                contactCards.map((item, idx) => <FooterContactRow key={idx} {...item} />)
              )}
            </div>
          </div>

          {/* Office Hours */}
          <div className="h-fit grid gap-4">
            <h3 className="text-lg font-semibold text-accent">Office Hours</h3>
            <ul className="grid gap-2 text-[0.9375rem] text-secondary-foreground/80">
              {isLoading && officeHours.length === 0 ? (
                <>
                  <Skeleton className="h-6 w-full" />
                  <Skeleton className="h-6 w-full" />
                </>
              ) : (
                officeHours.map((item, idx) => <OfficeHourRow key={idx} {...item} />)
              )}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-secondary-foreground/10 py-6 flex flex-col md:flex-row justify-between items-center text-secondary-foreground/50">
          <p className="text-[0.9375rem]">
            &copy; {currentYear} {appName}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

const FooterLink = ({ text, href = '#', footerOnlySuffix = '', afterClick }: HeaderLinkProps) => {
  return (
    <li className={``}>
      <GhostBtn
        size="none"
        className={`w-fit py-0`}
        wrapClassName={`w-fit`}
        {...(href && { linkProps: { href } })}
        onClick={() => {
          afterClick?.();
        }}>
        <div className="w-fit px-0 relative">
          <p
            className={`text-secondary-foreground/60 hover:text-secondary-foreground transition-smooth`}>
            {text + footerOnlySuffix}
          </p>
        </div>
      </GhostBtn>
    </li>
  );
};

export interface FooterContactRowProps {
  LucideIcon?: LucideIconComp;
  Icon?: IconComp;
  href?: string;
  texts: { text: string; link?: string }[];
}

const FooterContactRow = ({ LucideIcon, Icon, texts, href = '' }: FooterContactRowProps) => {
  return (
    <div className="flex items-start gap-2">
      {LucideIcon && <LucideIcon className="w-4 h-4 text-accent shrink-0 mt-0.5" />}
      {Icon && (
        <i className="text-base text-accent flex-none mt-0.5">
          <Icon />
        </i>
      )}
      <GhostBtn
        {...(href ? { linkProps: { href, target: '_blank', rel: 'noreferrer noopener' } } : {})}
        size="none"
        className={`text-secondary-foreground/70 ${href ? 'hover:text-secondary-foreground' : ''}`}
        wrapClassName="">
        <div className="grid gap-3 text-start">
          {texts.map((item, idx) => (
            <span key={idx} className={item.link ? 'hover:text-secondary-foreground' : ''}>
              {item.link ? (
                <a
                  href={item.link}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="no-underline text-current cursor-pointer">
                  {item.text}
                </a>
              ) : (
                item.text
              )}
            </span>
          ))}
        </div>
      </GhostBtn>
    </div>
  );
};

export interface SocialBtnProps {
  Icon: IconComp;
  href: string;
  label: string;
}

export function SocialBtn({ Icon, href, label }: SocialBtnProps) {
  return (
    <GhostBtn
      size="none"
      className="size-10 bg-secondary-foreground/10 grid place-items-center rounded-full hover:bg-accent hover:text-accent-foreground transition-all transition-smooth"
      linkProps={{ href, target: '_blank', rel: 'noopener noreferrer' }}
      aria-label={label}>
      <i className="text-xl">
        <Icon />
      </i>
    </GhostBtn>
  );
}

const OfficeHourRow = ({ days, time }: { days: string; time: string }) => {
  return (
    <li className="flex justify-between">
      <span>{days}:</span>
      <span className="font-medium">{time}</span>
    </li>
  );
};
