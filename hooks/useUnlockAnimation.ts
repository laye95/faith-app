import { bzzt } from '@/utils/haptics';
import { useEffect, useRef, useState } from 'react';

export function useUnlockAnimation(isLocked: boolean) {
  const [isAnimating, setIsAnimating] = useState(false);
  const prevIsLockedRef = useRef<boolean | undefined>(undefined);

  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    const wasLocked = prevIsLockedRef.current;
    prevIsLockedRef.current = isLocked;

    if (wasLocked === true && isLocked === false) {
      bzzt();
      setIsAnimating(true);
    }
  }, [isLocked]);

  const handleAnimationComplete = () => {
    if (isMountedRef.current) {
      setIsAnimating(false);
    }
  };

  return { isAnimating, handleAnimationComplete };
}
