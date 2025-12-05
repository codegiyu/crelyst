'use client';

import { ArrowLeft, Home } from 'lucide-react';
import { RegularBtn } from '../atoms/RegularBtn';
import { useRouter } from 'next/navigation';

export const Btns404Page = () => {
  const { back } = useRouter();

  return (
    <>
      <RegularBtn
        size="lg"
        linkProps={{ href: '/' }}
        text="Return Home"
        LeftIcon={Home}
        leftIconProps={{ className: 'w-5 h-5 mr-2' }}
        className="group w-full sm:w-fit"
        wrapClassName="w-full sm:w-fit"
      />
      <RegularBtn
        variant="outline"
        size="lg"
        text="Go Back"
        onClick={back}
        LeftIcon={ArrowLeft}
        leftIconProps={{ className: 'w-5 h-5 mr-2' }}
        className="group w-full sm:w-fit"
        wrapClassName="w-full sm:w-fit"
      />
    </>
  );
};
