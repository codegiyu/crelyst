'use client';

import { GhostBtn } from '../atoms/GhostBtn';
import { LogoFull } from '../icons';
import { NAV_LINKS } from '@/lib/constants/texts';
import { HeaderLinkProps } from './Header';
import { IconComp, LucideIconComp } from '@/lib/types/general';
import { getSocialIcon, formatSocialLabel } from '@/lib/utils/socials';
import { transformContactInfoToFooterCards, formatOfficeHours } from '@/lib/utils/contactInfo';
import type { PublicFooterSettings } from '@/lib/types/public-layout';

export const Footer = ({ initialSettings }: { initialSettings?: PublicFooterSettings }) => {
  const currentYear = new Date().getFullYear();

  const contactCards = transformContactInfoToFooterCards(initialSettings?.contactInfo);
  const officeHours = formatOfficeHours(initialSettings?.contactInfo?.officeHours);

  const socials =
    initialSettings?.socials?.map(social => ({
      Icon: getSocialIcon(social.platform),
      href: social.href,
      label: formatSocialLabel(social.platform),
    })) || [];

  const appName = initialSettings?.appDetails?.appName || 'Your Company';
  const appDescription =
    initialSettings?.appDetails?.description ||
    'Your site description here. Update this with your actual content.';

  return (
    <footer className="bg-[#050505] text-zinc-100 pt-16 md:pt-16 lg:pt-20 2xl:pt-28">
      <div className="regular-container">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 text-[0.9375rem] mb-12">
          {/* Company Info */}
          <div className="h-fit grid gap-4">
            <div className="flex items-center">
              <GhostBtn
                Icon={LogoFull}
                iconClass="text-zinc-300 text-3xl"
                linkProps={{ href: '/' }}
                size="none"
              />
            </div>
            <p className="text-zinc-400 text-[0.9375rem] leading-[1.6]">{appDescription}</p>
            <div className="w-full flex items-center gap-4">
              {socials.map((social, idx) => (
                <SocialBtn key={idx} {...social} />
              ))}
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
            <div className="grid gap-5 text-zinc-400">
              {contactCards.map((item, idx) => (
                <FooterContactRow key={idx} {...item} />
              ))}
            </div>
          </div>

          {/* Office Hours */}
          <div className="h-fit grid gap-4">
            <h3 className="text-lg font-semibold text-accent">Office Hours</h3>
            <ul className="grid gap-2 text-[0.9375rem] text-zinc-400">
              {officeHours.map((item, idx) => (
                <OfficeHourRow key={idx} {...item} />
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/[0.08] py-6 flex flex-col sm:flex-row flex-wrap justify-center items-center gap-x-3 gap-y-2 text-zinc-500 text-[0.9375rem] text-center">
          <p>
            &copy; {currentYear} {appName}. All rights reserved.
          </p>
          <span className="hidden sm:inline text-zinc-600" aria-hidden>
            |
          </span>
          <p>
            Built by{' '}
            <a
              href="https://portfolio-codegiyu.vercel.app"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block font-lobster text-red-600 hover:text-red-700 transition-colors">
              <span className="text-xl font-black">C</span>
              <span>odegiyu</span>
            </a>
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
          <p className={`text-zinc-400 hover:text-zinc-100 transition-smooth`}>
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
        className={`text-zinc-300 ${href ? 'hover:text-zinc-100' : ''}`}
        wrapClassName="">
        <div className="grid gap-3 text-start">
          {texts.map((item, idx) => (
            <span key={idx} className={item.link ? 'hover:text-zinc-100' : ''}>
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
      className="size-10 bg-white/10 grid place-items-center rounded-full hover:bg-accent hover:text-accent-foreground transition-all transition-smooth"
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
