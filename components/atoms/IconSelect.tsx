'use client';

import { useState, useMemo, ReactNode } from 'react';
import { Search, X, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { CURATED_ICON_GROUPS, IconGroup } from '@/lib/constants/lucide-icons';
import { InputWrapper } from '../general/InputWrapper';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { ScrollArea } from '../ui/scroll-area';
import { DynamicIcon, LucideIconName, LucideIcons } from '../general/DynamicIcon';

export interface IconSelectProps {
  label?: string;
  subtext?: ReactNode;
  labelClassName?: string;
  wrapClassName?: string;
  errors?: string[];
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  name?: string;
}

export const IconSelect = ({
  label,
  subtext,
  labelClassName,
  wrapClassName,
  errors = [],
  value = '',
  onChange,
  placeholder = 'Select an icon...',
  disabled = false,
  required = false,
  name,
}: IconSelectProps) => {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeGroup, setActiveGroup] = useState<string | null>(null);

  // Get the current icon component
  // const SelectedIcon = value ? getIconComponent(value) : null;

  // Filter icons based on search
  const filteredGroups = useMemo(() => {
    if (!searchQuery.trim()) {
      return CURATED_ICON_GROUPS;
    }

    const query = searchQuery.toLowerCase();
    return CURATED_ICON_GROUPS.map(group => ({
      ...group,
      icons: group.icons.filter(icon => icon.toLowerCase().includes(query)),
    })).filter(group => group.icons.length > 0);
  }, [searchQuery]);

  // Handle icon selection
  const handleSelect = (iconName: string) => {
    onChange?.(iconName);
    setOpen(false);
    setSearchQuery('');
  };

  // Clear selection
  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange?.('');
  };

  return (
    <InputWrapper
      wrapClassName={wrapClassName}
      label={label}
      subtext={subtext}
      labelTextClassName={labelClassName}
      required={required}
      errors={errors}>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild disabled={disabled}>
          <button
            type="button"
            name={name}
            className={cn(
              'flex items-center justify-between w-full rounded-md border border-input bg-background px-3 py-2 text-sm',
              'hover:bg-accent/50 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
              'disabled:cursor-not-allowed disabled:opacity-50',
              'min-h-[40px]'
            )}
            disabled={disabled}>
            <span className="flex items-center gap-2">
              {value ? (
                <>
                  <DynamicIcon
                    name={value as LucideIconName}
                    props={{ className: 'size-5 text-primary' }}
                  />
                  <span className="text-foreground">{value}</span>
                </>
              ) : (
                <span className="text-muted-foreground">{placeholder}</span>
              )}
            </span>
            <span className="flex items-center gap-1">
              {value && (
                <span
                  role="button"
                  onClick={handleClear}
                  className="p-1 hover:bg-muted rounded-sm transition-colors">
                  <X className="size-4 text-muted-foreground hover:text-foreground" />
                </span>
              )}
              <ChevronDown className="size-4 text-muted-foreground" />
            </span>
          </button>
        </DialogTrigger>

        <DialogContent className="max-w-4xl max-h-[85vh] p-0 gap-0">
          <DialogHeader className="px-6 pt-6 pb-4 border-b">
            <DialogTitle>Select an Icon</DialogTitle>
            <div className="relative mt-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input
                placeholder="Search icons..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="pl-10"
                autoFocus
              />
            </div>
            {/* Category Quick Filters */}
            <div className="flex flex-wrap gap-2 mt-4">
              <Button
                variant={activeGroup === null ? 'default' : 'outline'}
                size="sm"
                onClick={() => setActiveGroup(null)}
                className="text-xs">
                All
              </Button>
              {CURATED_ICON_GROUPS.map(group => (
                <Button
                  key={group.name}
                  variant={activeGroup === group.name ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setActiveGroup(group.name)}
                  className="text-xs">
                  {group.name}
                </Button>
              ))}
            </div>
          </DialogHeader>

          <ScrollArea className="flex-1 max-h-[calc(85vh-200px)]">
            <div className="p-6 grid gap-8">
              {(activeGroup
                ? filteredGroups.filter(g => g.name === activeGroup)
                : filteredGroups
              ).map(group => (
                <IconGroupSection
                  key={group.name}
                  group={group}
                  selectedIcon={value}
                  onSelect={handleSelect}
                />
              ))}

              {filteredGroups.length === 0 && (
                <div className="text-center py-12 text-muted-foreground">
                  <Search className="size-12 mx-auto mb-4 opacity-50" />
                  <p className="text-lg font-medium">No icons found</p>
                  <p className="text-sm">Try a different search term</p>
                </div>
              )}
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </InputWrapper>
  );
};

// Separate component for icon groups for better performance
interface IconGroupSectionProps {
  group: IconGroup;
  selectedIcon: string;
  onSelect: (iconName: string) => void;
}

const IconGroupSection = ({ group, selectedIcon, onSelect }: IconGroupSectionProps) => {
  return (
    <div>
      <h3 className="text-sm font-semibold text-foreground mb-4 sticky top-0 bg-background py-2 z-10">
        {group.name}
        <span className="text-muted-foreground font-normal ml-2">({group.icons.length})</span>
      </h3>
      <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-2">
        {group.icons.map(iconName => (
          <IconButton
            key={iconName}
            iconName={iconName}
            isSelected={selectedIcon === iconName}
            onClick={() => onSelect(iconName)}
          />
        ))}
      </div>
    </div>
  );
};

// Memoized icon button for performance
interface IconButtonProps {
  iconName: string;
  isSelected: boolean;
  onClick: () => void;
}

const IconButton = ({ iconName, isSelected, onClick }: IconButtonProps) => {
  const icon = LucideIcons[iconName as LucideIconName];

  if (!icon) return null;

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'flex flex-col items-center justify-center gap-1.5 p-3 rounded-lg border transition-all',
        'hover:border-primary/50 hover:bg-primary/5',
        'focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1',
        'min-h-[80px]',
        isSelected
          ? 'border-primary bg-primary/10 ring-2 ring-primary ring-offset-1'
          : 'border-border bg-card'
      )}>
      <DynamicIcon
        name={iconName as LucideIconName}
        props={{ className: cn('size-6', isSelected ? 'text-primary' : 'text-foreground') }}
      />
      <span
        className={cn(
          'text-[10px] leading-tight text-center break-all line-clamp-2',
          isSelected ? 'text-primary font-medium' : 'text-muted-foreground'
        )}>
        {iconName}
      </span>
    </button>
  );
};
