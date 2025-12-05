'use client';

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  useSidebar,
} from '@/components/ui/sidebar';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { NavLink } from '../atoms/NavLink';
import { ISidebarLink } from '@/lib/types/general';
import { usePathname } from 'next/navigation';
import { bottomBarLinks, sidebarLinksData } from '@/lib/constants/routing';
import { Logo } from '../icons';
import { GhostBtn } from '../atoms/GhostBtn';

export function AppSidebar() {
  const { state } = useSidebar();
  const isCollapsed = state === 'collapsed';

  return (
    <Sidebar className={isCollapsed ? 'w-14' : 'w-56'}>
      <SidebarHeader
        className={`border-b-0 border-sidebar-border py-4 ${isCollapsed ? 'px-2.5' : 'px-4'}`}>
        <div
          className={isCollapsed ? 'flex flex-col items-center gap-2' : 'flex items-center gap-3'}>
          <i className="text-primary text-4xl">
            <Logo />
          </i>
          {!isCollapsed && (
            <div className="flex-1">
              <h1 className="text-lg font-semibold">Admin Dashboard</h1>
              <p className="text-xs text-muted-foreground">Management Console</p>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent className="mt-0">
        {sidebarLinksData.map(group => (
          <SidebarLinkGroup key={group.groupName} {...group} isCollapsed={isCollapsed} />
        ))}
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border px-0">
        <SidebarLinkGroup {...bottomBarLinks} isCollapsed={isCollapsed} />
      </SidebarFooter>
    </Sidebar>
  );
}

export const SidebarLinkGroup = ({
  groupName,
  links,
  isCollapsed,
}: {
  groupName: string;
  links: ISidebarLink[];
  isCollapsed: boolean;
}) => {
  const currentPath = usePathname();

  const isActive = (path: string) => {
    if (path === '/') return currentPath === '/';
    return currentPath.startsWith(path);
  };

  const getNavClassName = (path?: string | undefined) => {
    return path && isActive(path)
      ? 'bg-primary text-primary-foreground font-medium'
      : 'hover:bg-primary/15 hover:text-accent-foreground';
  };

  return (
    <SidebarGroup>
      {groupName && <SidebarGroupLabel>{groupName}</SidebarGroupLabel>}
      <SidebarGroupContent>
        <SidebarMenu>
          {links.map(({ Icon, LucideIcon, page, path, action }) => {
            const href = path ? `${path.prefix}${path.suffix}` : `/${page.toLowerCase()}`;
            const buttonContent = action ? (
              <GhostBtn className={`${getNavClassName()} justify-start p-2`} onClick={action}>
                {Icon ? (
                  <i className="text-base">
                    <Icon />
                  </i>
                ) : (
                  <LucideIcon className="h-4 w-4" />
                )}
                {!isCollapsed && <span>{page}</span>}
              </GhostBtn>
            ) : (
              <GhostBtn
                className={`${getNavClassName(href)} justify-start ${isCollapsed ? 'w-fit' : 'w-full'} p-0`}
                wrapClassName={`${isCollapsed ? 'w-fit' : 'w-full'}`}>
                <NavLink href={href} className="w-full flex items-center gap-2 p-2">
                  {Icon ? (
                    <i className="text-base">
                      <Icon />
                    </i>
                  ) : (
                    <LucideIcon className="h-4 w-4" />
                  )}
                  {!isCollapsed && <span>{page}</span>}
                </NavLink>
              </GhostBtn>
            );

            const menuButton = (
              <SidebarMenuButton asChild variant="none">
                {buttonContent}
              </SidebarMenuButton>
            );

            return (
              <SidebarMenuItem key={page}>
                {isCollapsed ? (
                  <Tooltip delayDuration={150}>
                    <TooltipTrigger asChild>{menuButton}</TooltipTrigger>
                    <TooltipContent side="right" className="text-xs font-medium">
                      {page}
                    </TooltipContent>
                  </Tooltip>
                ) : (
                  menuButton
                )}
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
};
