'use client';

import { debounce } from '@/lib/utils/general';
import { useEffect, useState } from 'react';
import { Logo, LogoFull } from '../icons';
import { motion } from 'motion/react';
import { useSiteStore } from '@/lib/store/siteStore';

const TRANSITION_DURATION = 0.8; // s

type Particle = {
  id: number;
  x: number;
  y: number;
  delay: number;
  duration: number;
  driftX: number;
};

export const LoadAnimationScreen = () => {
  const {
    siteLoading,
    actions: { setSiteLoading },
  } = useSiteStore(state => state);
  const [pageLoaded, setPageLoaded] = useState(false);
  const [animationPhase, setAnimationPhase] = useState<'logo' | 'logofull' | 'fadeout'>('logo');
  // Generate floating particles with lazy initializer
  const [particles] = useState<Particle[]>(() =>
    Array.from({ length: 12 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 0.5,
      duration: 2 + Math.random() * 2,
      driftX: (Math.random() - 0.5) * 10,
    }))
  );

  useEffect(() => {
    const handleLoad = async () => {
      // Phase 1: Show Logo icon (0-1.5s)
      await debounce(1500);
      setAnimationPhase('logofull');

      // Phase 2: Show LogoFull (1.5-4s)
      await debounce(2500);
      setAnimationPhase('fadeout');

      // Phase 3: Fade out (4-5s)
      await debounce(1000);
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
          className="w-full h-screen grid place-items-center fixed inset-0 z-[99] overflow-hidden">
          {/* Animated background gradient */}
          <motion.div
            className="absolute inset-0 bg-white"
            animate={{
              backgroundColor: [
                'rgb(255, 255, 255)',
                'rgb(255, 245, 240)',
                'rgb(255, 245, 240)',
                'rgb(255, 255, 255)',
              ],
            }}
            transition={{
              duration: 5,
              times: [0, 0.3, 0.8, 1],
              ease: 'easeInOut',
            }}
          />
          {/* Gradient overlay */}
          <motion.div
            className="absolute inset-0 opacity-0"
            style={{
              background:
                'linear-gradient(135deg, rgba(255, 228, 214, 0) 0%, rgba(255, 212, 179, 0.3) 50%, rgba(255, 228, 214, 0) 100%)',
            }}
            animate={{
              opacity: [0, 0.6, 0.6, 0],
            }}
            transition={{
              duration: 5,
              times: [0, 0.3, 0.8, 1],
              ease: 'easeInOut',
            }}
          />

          {/* Floating particles */}
          {animationPhase !== 'fadeout' && (
            <div className="absolute inset-0">
              {particles.map(particle => (
                <motion.div
                  key={particle.id}
                  className="absolute w-2 h-2 rounded-full bg-primary/20"
                  initial={{
                    x: `${particle.x}%`,
                    y: `${particle.y}%`,
                    opacity: 0,
                    scale: 0,
                  }}
                  animate={{
                    y: [`${particle.y}%`, `${particle.y - 20}%`, `${particle.y}%`],
                    x: [`${particle.x}%`, `${particle.x + particle.driftX}%`, `${particle.x}%`],
                    opacity: [0, 0.6, 0],
                    scale: [0, 1, 0],
                  }}
                  transition={{
                    duration: particle.duration,
                    delay: particle.delay,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                />
              ))}
            </div>
          )}

          {/* Geometric shapes */}
          <div className="absolute inset-0 overflow-hidden">
            <motion.div
              className="absolute top-20 left-20 w-32 h-32 border-2 border-primary/10 rounded-lg"
              initial={{ rotate: 0, scale: 0, opacity: 0 }}
              animate={{
                rotate: 360,
                scale: [0, 1, 1, 0],
                opacity: [0, 0.3, 0.3, 0],
              }}
              transition={{
                duration: 5,
                times: [0, 0.2, 0.7, 1],
                ease: 'easeInOut',
              }}
            />
            <motion.div
              className="absolute bottom-20 right-20 w-24 h-24 border-2 border-primary/10 rounded-full"
              initial={{ rotate: 0, scale: 0, opacity: 0 }}
              animate={{
                rotate: -360,
                scale: [0, 1, 1, 0],
                opacity: [0, 0.3, 0.3, 0],
              }}
              transition={{
                duration: 5,
                times: [0, 0.25, 0.75, 1],
                ease: 'easeInOut',
              }}
            />
            <motion.div
              className="absolute top-1/2 right-32 w-16 h-16 border-2 border-primary/10 rotate-45"
              initial={{ scale: 0, opacity: 0 }}
              animate={{
                scale: [0, 1, 1, 0],
                opacity: [0, 0.2, 0.2, 0],
              }}
              transition={{
                duration: 5,
                times: [0, 0.3, 0.7, 1],
                ease: 'easeInOut',
              }}
            />
          </div>

          {/* Logo animations */}
          <div className="relative z-10 flex flex-col items-center justify-center">
            {/* Logo Icon - always present, animated based on phase */}
            <motion.div
              className="flex items-center justify-center absolute"
              initial={{ opacity: 0, scale: 0, rotate: -180, x: 0 }}
              animate={{
                opacity: animationPhase === 'logo' ? 1 : 0,
                scale: animationPhase === 'logo' ? 1 : animationPhase === 'logofull' ? 0.4 : 0,
                rotate: animationPhase === 'logo' ? 0 : -180,
                x: animationPhase === 'logo' ? 0 : '-145%',
              }}
              transition={{
                duration: 0.8,
                ease: [0.34, 1.56, 0.64, 1],
              }}>
              <motion.div
                animate={{
                  scale: animationPhase === 'logo' ? [1, 1.1, 1] : 1,
                  rotate: animationPhase === 'logo' ? [0, 5, -5, 0] : 0,
                }}
                transition={{
                  duration: 1.5,
                  repeat: animationPhase === 'logo' ? Infinity : 0,
                  ease: 'easeInOut',
                }}>
                <Logo className="text-9xl text-primary drop-shadow-lg" />
              </motion.div>
            </motion.div>

            {/* LogoFull - always present, animated based on phase */}
            <motion.div
              className="flex items-center justify-center"
              initial={{ opacity: 0, y: 30, scale: 0.9 }}
              animate={{
                opacity:
                  animationPhase === 'logo'
                    ? 0
                    : animationPhase === 'logofull'
                      ? 1
                      : animationPhase === 'fadeout'
                        ? 0
                        : 0,
                y:
                  animationPhase === 'logo'
                    ? 30
                    : animationPhase === 'logofull'
                      ? 0
                      : animationPhase === 'fadeout'
                        ? 0
                        : 30,
                scale:
                  animationPhase === 'logo'
                    ? 0.9
                    : animationPhase === 'logofull'
                      ? 1
                      : animationPhase === 'fadeout'
                        ? 0.95
                        : 0.9,
              }}
              transition={{
                opacity: {
                  duration: animationPhase === 'fadeout' ? 1 : 0.6,
                  ease: animationPhase === 'fadeout' ? 'easeIn' : 'easeOut',
                },
                y: {
                  duration: 0.6,
                  ease: 'easeOut',
                },
                scale: {
                  duration: animationPhase === 'fadeout' ? 1 : 0.6,
                  ease: animationPhase === 'fadeout' ? 'easeIn' : 'easeOut',
                },
              }}>
              <motion.div
                animate={{
                  scale:
                    animationPhase === 'logofull'
                      ? [1, 1.02, 1]
                      : animationPhase === 'fadeout'
                        ? 1
                        : 1,
                }}
                transition={{
                  duration: 2.5,
                  repeat: animationPhase === 'logofull' ? Infinity : 0,
                  ease: 'easeInOut',
                }}>
                <LogoFull className="text-6xl md:text-7xl lg:text-8xl text-foreground drop-shadow-xl" />
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </>
  );
};
