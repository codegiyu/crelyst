'use client';

import { debounce } from '@/lib/utils/general';
import { useEffect, useState } from 'react';
import { Logo } from '../icons';
import { motion } from 'motion/react';
import { useSiteStore } from '@/lib/store/siteStore';

const BASE_LOAD_TIME = 2000; // ms
const TRANSITION_DURATION = 1; // s

export const LoadAnimationScreen = () => {
  const {
    siteLoading,
    actions: { setSiteLoading },
  } = useSiteStore(state => state);
  const [pageLoaded, setPageLoaded] = useState(false);

  useEffect(() => {
    const handleLoad = async () => {
      await debounce(BASE_LOAD_TIME);

      setPageLoaded(true);
    };

    // If already loaded (from cache)
    if (document.readyState === 'complete') {
      handleLoad();
    } else {
      window.addEventListener('load', handleLoad);
    }

    return () => {
      window.removeEventListener('load', handleLoad);
    };
  }, []);

  return (
    <>
      {siteLoading && (
        <motion.div
          initial={{ opacity: 1 }}
          animate={pageLoaded ? { opacity: 0 } : {}}
          transition={{ duration: TRANSITION_DURATION, ease: 'easeInOut' }}
          onAnimationComplete={() => setSiteLoading(false)}
          className="w-full h-screen bg-white grid place-items-center fixed inset-0 z-[99]">
          <div
            className={`transition-all duration-1500 ease-linear ${!pageLoaded ? '' : 'opacity-0'}`}>
            <i className={`text-9xl text-primary `}>
              <Logo className={`${!pageLoaded ? 'animate-loader' : ''}`} />
            </i>
          </div>
        </motion.div>
      )}
    </>
  );
};
