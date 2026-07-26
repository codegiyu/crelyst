'use client';

import { useEffect, useState } from 'react';
import { CheckCircle2, Loader2, Rocket, TriangleAlert } from 'lucide-react';
import { RegularBtn } from '@/components/atoms/RegularBtn';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { callApi } from '@/lib/services/callApi';
import { adminCallApiToast } from '@/lib/utils/adminMutationToast';
import { cn } from '@/lib/utils';
import type { BbsPublishUiState } from '@/lib/admin/bbsPublishStatus';

type PublishBbsButtonProps = {
  disabled?: boolean;
};

const POLL_MS = 7_000;

export const PublishBbsButton = ({ disabled = false }: PublishBbsButtonProps) => {
  const [publishing, setPublishing] = useState(false);
  const [status, setStatus] = useState<BbsPublishUiState>('unknown');
  const [tooltip, setTooltip] = useState('Checking publish status…');

  const refreshStatus = async () => {
    const { data, error } = await callApi('ADMIN_GET_BBS_PUBLISH_STATUS', {});
    if (error || !data) {
      setStatus('unknown');
      setTooltip('Publish status is unavailable.');
      return data?.status;
    }

    setStatus(data.status);
    setTooltip(data.tooltip);
    return data.status;
  };

  useEffect(() => {
    void refreshStatus();
  }, []);

  useEffect(() => {
    if (status !== 'building') return;

    const timer = window.setInterval(() => {
      void refreshStatus();
    }, POLL_MS);

    return () => window.clearInterval(timer);
  }, [status]);

  const handlePublish = async () => {
    setPublishing(true);

    try {
      await adminCallApiToast(
        'Triggering Bold Brand Studio rebuild…',
        () => callApi('ADMIN_PUBLISH_PORTFOLIO_CASE_STUDIES', {}),
        'Publish triggered — Bold Brand Studio will rebuild shortly'
      );
      setStatus('building');
      setTooltip('Bold Brand Studio deploy in progress…');
      await refreshStatus();
    } finally {
      setPublishing(false);
    }
  };

  const StatusIcon =
    status === 'published'
      ? CheckCircle2
      : status === 'building'
        ? Loader2
        : status === 'error' || status === 'unpublished'
          ? TriangleAlert
          : Rocket;

  return (
    <TooltipProvider delayDuration={200}>
      <Tooltip>
        <TooltipTrigger asChild>
          <span className="inline-flex">
            <RegularBtn
              text="Publish to Bold Brand Studio"
              variant="outline"
              LeftIcon={StatusIcon}
              leftIconProps={{
                className: cn(
                  'size-4',
                  status === 'building' && 'animate-spin text-sky-600',
                  status === 'unpublished' && 'text-amber-600',
                  status === 'published' && 'text-emerald-600',
                  status === 'error' && 'text-destructive'
                ),
              }}
              className={cn(
                status === 'unpublished' && 'border-amber-500/50',
                status === 'published' && 'border-emerald-500/40',
                status === 'building' && 'border-sky-500/50',
                status === 'error' && 'border-destructive/50'
              )}
              loading={publishing}
              disabled={disabled || publishing}
              onClick={handlePublish}
            />
          </span>
        </TooltipTrigger>
        <TooltipContent side="bottom" className="max-w-xs text-left">
          {tooltip}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
