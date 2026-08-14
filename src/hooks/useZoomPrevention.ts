/**
 * @fileoverview
 * Custom hook to prevent browser zoom
 * @module hooks/useFingerprintJS
 * @author Braulio Rodriguez <brauliorg@gmail.com>
 * @version 0.3.0
 */

import { useEffect } from 'react';

export const useZoomPrevention = (): void => {
  useEffect(() => {
    const handleWheel = (event: WheelEvent): void => {
      if (event.ctrlKey) {
        event.preventDefault();
      }
    };

    const handleKeyDown = (event: KeyboardEvent): void => {
      if (
        event.ctrlKey &&
        (event.key === '+' || event.key === '-' || event.key === '0')
      ) {
        event.preventDefault();
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);
};
