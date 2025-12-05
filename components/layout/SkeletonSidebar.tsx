import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuSkeleton,
} from '@/components/ui/sidebar';
import { Skeleton } from '@/components/ui/skeleton';

const GROUP_COUNT = 2;
const ITEMS_PER_GROUP = 4;

export function SkeletonSidebar() {
  return (
    <Sidebar className="w-52">
      <SidebarHeader className="border-b border-sidebar-border p-4">
        <div className="flex items-center gap-3">
          <Skeleton className="h-8 w-8 rounded-lg" />
          <div className="flex flex-1 flex-col gap-2">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-3 w-20" />
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        {Array.from({ length: GROUP_COUNT }).map((_, groupIndex) => (
          <SidebarGroup key={`skeleton-group-${groupIndex}`}>
            <SidebarGroupLabel>
              <Skeleton className="h-3 w-16" />
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu className="gap-2">
                {Array.from({ length: ITEMS_PER_GROUP }).map((__, itemIndex) => (
                  <SidebarMenuSkeleton
                    key={`skeleton-item-${groupIndex}-${itemIndex}`}
                    showIcon
                    className="rounded-md bg-transparent px-2"
                  />
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border p-4">
        <Skeleton className="h-9 w-full rounded-md" />
      </SidebarFooter>
    </Sidebar>
  );
}
