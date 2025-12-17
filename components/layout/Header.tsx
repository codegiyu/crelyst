'use client';

import { ComponentProps, Dispatch, SetStateAction, useEffect, useState } from 'react';
import { ChevronDown, Menu, X } from 'lucide-react';
import { LogoFull } from '../icons';
import { RegularBtn } from '../atoms/RegularBtn';
import { GhostBtn } from '../atoms/GhostBtn';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { NAV_LINKS } from '@/lib/constants/texts';

export type HeaderProps = ComponentProps<'section'> & {
  transparentOnLoad?: boolean;
};

export const Header = ({ className, transparentOnLoad = false, ...props }: HeaderProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();

  // Scroll detection for transparent header
  useEffect(() => {
    if (!transparentOnLoad) return;

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    // Check initial scroll position
    handleScroll();

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [transparentOnLoad]);

  // Prevent scroll when menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMenuOpen]);

  const isTransparent = transparentOnLoad && !isScrolled;

  return (
    <header
      className={cn(
        'z-50 transition-all duration-300',
        transparentOnLoad ? 'fixed top-0 left-0 right-0' : 'sticky top-0',
        isTransparent
          ? 'bg-transparent shadow-none border-transparent'
          : 'bg-card shadow-soft border-b border-border',
        className
      )}
      {...props}>
      <div className="regular-container">
        <div className={`flex items-center justify-between ${isTransparent ? 'h-28' : 'h-20'}`}>
          {/* Logo */}
          <div className="flex items-center">
            <GhostBtn
              linkProps={{ href: '/' }}
              className={isTransparent ? 'text-white hover:text-white/80' : ''}>
              <i className={cn('text-[1.5rem] lg:text-[2.5rem]', isTransparent && 'text-white')}>
                <LogoFull />
              </i>
            </GhostBtn>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            <nav className="">
              <ul className="list-none hidden lg:flex items-center space-x-8">
                {NAV_LINKS.filter(s => !s.showInFooterOnly).map((item, idx) => (
                  <HeaderLink
                    key={idx}
                    {...item}
                    activePath={pathname}
                    isTransparent={isTransparent}
                  />
                ))}
              </ul>
            </nav>
          </div>

          {/* Mobile Menu Button */}
          <GhostBtn
            className={cn('lg:hidden', isTransparent && 'text-white hover:text-white/80')}
            wrapClassName="lg:hidden"
            iconClass={cn(
              'size-6',
              isMenuOpen ? 'text-destructive' : '',
              isTransparent && !isMenuOpen && 'text-white'
            )}
            LucideIcon={isMenuOpen ? X : Menu}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          />
        </div>

        {/* Mobile Menu */}
        <div
          className={cn(
            'lg:hidden h-auto grid transition-all duration-500 ease-out animate-fade-in overflow-hidden',
            isMenuOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]',
            isTransparent && 'bg-card/95 backdrop-blur-sm'
          )}>
          <nav className="overflow-hidden">
            <div className="pb-4">
              <ul className="list-none grid px-0 pb-6 gap-2">
                {NAV_LINKS.filter(s => !s.showInFooterOnly).map((item, idx) => (
                  <MobileHeaderLink
                    key={idx}
                    {...item}
                    afterClick={() => setIsMenuOpen(false)}
                    activePath={pathname}
                  />
                ))}
              </ul>
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
};

export type BaseHeaderLinkProps = {
  text: string;
  href?: string;
  basePath?: string;
  children?: HeaderDropdownLinkProps[];
  footerOnlySuffix?: string;
  showInHeaderOnly?: boolean;
  showInFooterOnly?: boolean;
  afterClick?: () => void;
  activePath?: string;
  dropdownOpen?: boolean;
  setDropdownOpen?: Dispatch<SetStateAction<boolean>>;
};

export type HeaderLinkProps =
  | {
      text: string;
      href: string;
      basePath?: never;
      children?: never;
      footerOnlySuffix?: string;
      showInHeaderOnly?: boolean;
      showInFooterOnly?: boolean;
      afterClick?: () => void;
      activePath?: string;
      dropdownOpen?: boolean;
      setDropdownOpen?: Dispatch<SetStateAction<boolean>>;
    }
  | {
      text: string;
      href?: never;
      basePath: string;
      children: HeaderDropdownLinkProps[];
      footerOnlySuffix?: never;
      showInHeaderOnly: true;
      showInFooterOnly?: never;
      afterClick?: () => void;
      activePath?: string;
      dropdownOpen?: boolean;
      setDropdownOpen?: Dispatch<SetStateAction<boolean>>;
    };

export interface HeaderDropdownLinkProps {
  text: string;
  href: string;
}

const HeaderLink = ({
  text,
  href,
  children,
  afterClick,
  activePath,
  basePath,
  dropdownOpen,
  setDropdownOpen,
  isTransparent = false,
}: HeaderLinkProps & { isTransparent?: boolean }) => {
  return (
    <li className={``}>
      {children ? (
        <div className="relative group">
          <GhostBtn
            className={cn(
              'w-fit flex items-center font-medium transition-smooth',
              isTransparent
                ? activePath?.startsWith(basePath)
                  ? 'text-white'
                  : 'text-white/90 hover:text-white'
                : activePath?.startsWith(basePath)
                  ? 'text-primary'
                  : 'text-foreground hover:text-primary'
            )}
            onMouseEnter={() => setDropdownOpen?.(true)}
            onMouseLeave={() => setDropdownOpen?.(false)}>
            <span>{text}</span>
            <ChevronDown className={cn('ml-1 h-4 w-4', isTransparent && 'text-white')} />
          </GhostBtn>

          {dropdownOpen && (
            <div
              className={cn(
                'absolute top-full left-0 mt-0 w-48 rounded-lg shadow-medium border py-2 animate-fade-in',
                isTransparent
                  ? 'bg-card/95 backdrop-blur-sm border-border'
                  : 'bg-card border-border'
              )}
              onMouseEnter={() => setDropdownOpen?.(true)}
              onMouseLeave={() => setDropdownOpen?.(false)}>
              {children.map((link, idx) => (
                <Link
                  key={`link-${text}-${idx}`}
                  href={link.href}
                  className="block px-4 py-2 hover:bg-secondary transition-smooth text-foreground">
                  {link.text}
                </Link>
              ))}
            </div>
          )}
        </div>
      ) : (
        <GhostBtn
          className={`w-fit py-0`}
          wrapClassName={`w-fit`}
          {...(href && { linkProps: { href } })}
          onClick={() => {
            afterClick?.();
          }}>
          <div className="w-full lg:w-fit px-0 relative">
            <p
              className={cn(
                'transition-smooth',
                isTransparent
                  ? activePath === href
                    ? 'font-semibold text-white'
                    : 'font-medium text-white/90 hover:text-white'
                  : activePath === href
                    ? 'font-semibold text-primary'
                    : 'font-medium text-foreground hover:text-primary'
              )}>
              {text}
            </p>
          </div>
        </GhostBtn>
      )}
    </li>
  );
};

const MobileHeaderLink = ({ text, href, children, afterClick, activePath }: HeaderLinkProps) => {
  return (
    <li className={``}>
      {children ? (
        <div className="grid gap-2">
          <span className="font-medium text-foreground py-2">{text}</span>
          {children.map(({ href, text }, idx) => (
            <RegularBtn
              key={`mob-link-${text}-${idx}`}
              variant="none"
              size="icon"
              linkProps={{ href }}
              text={text}
              className={`w-full justify-start px-4 py-2 ${activePath === href ? 'bg-primary text-primary-foreground' : 'text-muted-foreground'} hover:bg-muted`}
              wrapClassName="w-full"
              onClick={() => afterClick?.()}
            />
          ))}
        </div>
      ) : (
        <RegularBtn
          variant="none"
          size="icon"
          linkProps={{ href }}
          text={text}
          className={`w-full justify-start px-4 py-2 ${activePath === href ? 'bg-primary text-primary-foreground' : 'text-foreground'} hover:bg-muted`}
          wrapClassName="w-full"
          onClick={() => afterClick?.()}
        />
      )}
    </li>
  );
};
