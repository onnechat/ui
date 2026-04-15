'use client';

import { useWebHaptics } from 'web-haptics/react';

export const useHaptics = () => {
  const { trigger } = useWebHaptics();

  const triggerHaptics = (
    type: 'click' | 'success' | 'error' | 'warning' | 'info',
  ) => {
    switch (type) {
      case 'click':
        trigger([{ duration: 8 }], { intensity: 0.5 });
        break;
      case 'success':
        trigger([{ duration: 30 }, { delay: 60, duration: 40, intensity: 1 }]);
        break;
      case 'error':
        trigger(
          [
            { duration: 40 },
            { delay: 40, duration: 40 },
            { delay: 40, duration: 40 },
          ],
          { intensity: 0.9 },
        );
        break;
      case 'warning':
        trigger([
          { duration: 40, intensity: 0.8 },
          { delay: 100, duration: 40, intensity: 0.6 },
        ]);
        break;
      case 'info':
        trigger([
          { duration: 80, intensity: 0.8 },
          { delay: 80, duration: 50, intensity: 0.3 },
        ]);
        break;
    }
  };

  return { trigger: triggerHaptics };
};
