import { useState, useEffect } from 'react';

export interface AssetReadiness {
  isReady: boolean;
  progress: number;
}

const CRITICAL_IMAGES = [
  // Heavy Footer Landscape Assets (prevents black screen on fast scroll)
  '/images/footer-landscape-bg-v2.png',
  '/images/footer-landscape-fg-slvgnt.png',
  // About Portrait Image
  '/images/taki-portrait.jpg',
  // 4 Featured Expeditions Display Mocks
  '/images/expeditions/lapor-fsm.png',
  '/images/expeditions/dipofeed.png',
  '/images/expeditions/aware.png',
  '/images/expeditions/kagu.png',
  // Essential Selvagant Identity SVGs
  '/logo/Logo SVG/Logo-deep-ink.svg',
  '/logo/Logo SVG/Logo-text-deep-ink.svg',
  '/logo/Logo SVG/Logo-white.svg',
  '/logo/Logo SVG/Logo-text-white.svg',
  // Field Arsenal Pillar Visuals
  'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1200&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=1200&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?q=80&w=1200&auto=format&fit=crop',
];

const preloadImage = (src: string): Promise<void> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.src = src;

    const handleDecode = () => {
      if ('decode' in img) {
        img.decode().then(resolve).catch(resolve);
      } else {
        resolve();
      }
    };

    if (img.complete && img.naturalWidth > 0) {
      handleDecode();
    } else {
      img.onload = handleDecode;
      img.onerror = () => resolve(); // Resilient fallback: never deadlock on single network issue
    }
  });
};

/**
 * Hook to preload all critical visual and typographic assets
 * before unveiling the main stage, guaranteeing zero black screen flashes.
 */
export const useAssetReadiness = (): AssetReadiness => {
  const [isReady, setIsReady] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let isMounted = true;
    let loadedCount = 0;
    const totalItems = CRITICAL_IMAGES.length + 1; // +1 for fonts

    const updateItemProgress = () => {
      if (!isMounted) return;
      loadedCount++;
      const currentProgress = Math.min(100, Math.round((loadedCount / totalItems) * 100));
      setProgress(currentProgress);
    };

    const assessReadiness = async () => {
      // 1. Wait for custom web typography rasterization
      const fontPromise = (async () => {
        try {
          if ('fonts' in document) {
            await document.fonts.ready;
          }
        } catch (err) {
          console.warn('Font loading check bypassed:', err);
        } finally {
          updateItemProgress();
        }
      })();

      // 2. Preload & decode every critical image into memory & GPU
      const imagePromises = CRITICAL_IMAGES.map((src) =>
        preloadImage(src).then(() => {
          updateItemProgress();
        })
      );

      // 3. Wait for DOM ready
      const domPromise = (async () => {
        if (document.readyState === 'loading') {
          await new Promise((resolve) => {
            document.addEventListener('DOMContentLoaded', resolve, { once: true });
          });
        }
      })();

      await Promise.all([fontPromise, domPromise, ...imagePromises]);

      if (isMounted) {
        setProgress(100);
        setIsReady(true);
      }
    };

    assessReadiness();

    // 10s maximum safety timer
    const safetyTimeout = setTimeout(() => {
      if (isMounted && !isReady) {
        setProgress(100);
        setIsReady(true);
      }
    }, 10000);

    return () => {
      isMounted = false;
      clearTimeout(safetyTimeout);
    };
  }, []);

  return { isReady, progress };
};
