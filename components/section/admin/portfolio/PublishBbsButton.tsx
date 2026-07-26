'use client';

import { useState } from 'react';
import { Rocket } from 'lucide-react';
import { RegularBtn } from '@/components/atoms/RegularBtn';
import { callApi } from '@/lib/services/callApi';
import { adminCallApiToast } from '@/lib/utils/adminMutationToast';

type PublishBbsButtonProps = {
  disabled?: boolean;
};

export const PublishBbsButton = ({ disabled = false }: PublishBbsButtonProps) => {
  const [publishing, setPublishing] = useState(false);

  const handlePublish = async () => {
    setPublishing(true);

    try {
      await adminCallApiToast(
        'Triggering Bold Brand Studio rebuild…',
        () => callApi('ADMIN_PUBLISH_PORTFOLIO_CASE_STUDIES', {}),
        'Publish triggered — Bold Brand Studio will rebuild shortly'
      );
    } finally {
      setPublishing(false);
    }
  };

  return (
    <RegularBtn
      text="Publish to Bold Brand Studio"
      variant="outline"
      LeftIcon={Rocket}
      leftIconProps={{ className: 'size-4' }}
      loading={publishing}
      disabled={disabled || publishing}
      onClick={handlePublish}
    />
  );
};
