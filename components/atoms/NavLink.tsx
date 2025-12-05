'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { type ReactNode, useMemo } from 'react';

interface NavLinkProps {
  href: string;
  /** Text or elements inside the link */
  children: ReactNode;
  /** Optional extra classes */
  className?: string;
  /** Apply active styles only on an exact match (default: false) */
  exact?: boolean;
  /** Custom class applied when active */
  activeClassName?: string;
}

/**
 * A Next.js 16 App Router–compatible NavLink
 * that mimics React Router's NavLink behavior.
 */
export function NavLink({
  href,
  children,
  className = '',
  exact = false,
  activeClassName = 'active',
}: NavLinkProps) {
  const pathname = usePathname();

  const isActive = useMemo(() => {
    if (!pathname) return false;
    return exact ? pathname === href : pathname.startsWith(href);
  }, [pathname, href, exact]);

  const combinedClassName = `${className} ${isActive ? activeClassName : ''}`.trim();

  return (
    <Link href={href} className={combinedClassName}>
      {children}
    </Link>
  );
}
