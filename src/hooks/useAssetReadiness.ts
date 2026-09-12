import { useState, useEffect } from 'react';

/**
 * Hook to detect critical asset readiness (web fonts & document completion)
 * before unveiling the field journal entrance experience.
 */
export const useAssetReadiness = (): boolean => {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const assessReadiness = async () => {
      try {
        if ('fonts' in document) {
          // Wait for custom fonts (Lufga & JetBrains Mono) to finish rasterizing
          await document.fonts.ready;
        }
      } catch (err) {
        console.warn('Font loading check bypassed:', err);
      }

      // Check if critical DOM state is at least interactive/complete
      if (document.readyState === 'loading') {
        await new Promise((resolve) => {
          document.addEventListener('DOMContentLoaded', resolve, { once: true });
        });
      }

      if (isMounted) {
        setIsReady(true);
      }
    };

    assessReadiness();

    return () => {
      isMounted = false;
    };
  }, []);

  return isReady;
};
