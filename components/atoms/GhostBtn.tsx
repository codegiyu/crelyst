import { cn } from '@/lib/utils';
import { RegularBtn, RegularBtnProps } from './RegularBtn';
import { IconComp, LucideIconComp } from '@/lib/types/general';

interface BaseGhostBtnProps extends Omit<RegularBtnProps, 'text'> {
  iconClass?: string;
  Icon?: IconComp;
  LucideIcon?: LucideIconComp;
}
interface GhostBtnPropsWithIcon extends BaseGhostBtnProps {
  Icon?: IconComp;
}
interface GhostBtnPropsWithLucideIcon extends BaseGhostBtnProps {
  LucideIcon?: LucideIconComp;
}
export type GhostBtnProps = GhostBtnPropsWithIcon | GhostBtnPropsWithLucideIcon;

export const GhostBtn = ({
  children,
  Icon,
  LucideIcon,
  iconClass,
  className,
  ...props
}: GhostBtnProps) => {
  return (
    <RegularBtn
      variant="none"
      size="icon"
      typo="custom"
      className={cn('p-0 flex-none', className)}
      {...props}>
      {Icon ? (
        <i className={cn('text-2xl text-foreground', iconClass)}>
          <Icon />
        </i>
      ) : LucideIcon ? (
        <LucideIcon className={cn('size-4 text-foreground', iconClass)} />
      ) : (
        children
      )}
    </RegularBtn>
  );
};
