import { useState, useEffect } from 'react';

/**
 * Critical assets that must be rasterized and cached in browser memory
 * before dismissing the preloader screen.
 */
export const CRITICAL_IMAGES = [
  '/images/footer-landscape-bg-v2.png',
  '/images/footer-landscape-fg-slvgnt.png',
  '/images/taki-portrait.jpg',
  '/images/expeditions/dipofeed.png',
  '/images/expeditions/aware.png',
  '/images/expeditions/lapor-fsm.png',
  '/images/expeditions/kagu.png',
  '/images/hero-ink-splatter.png',
  '/logo/Logo SVG/Logo-deep-ink.svg',
  '/logo/Logo SVG/Logo-text-deep-ink.svg',
];

export interface AssetReadinessState {
  isReady: boolean;
  progress: number;
}

/**
 * Hook to detect and preload all critical assets (fonts, DOM, and heavy media)
 * with true progress tracking.
 */
export const useAssetReadiness = (): AssetReadinessState => {
  const [readiness, setReadiness] = useState<AssetReadinessState>({
    isReady: false,
    progress: 0,
  });

  useEffect(() => {
    let isMounted = true;
    const totalAssets = CRITICAL_IMAGES.length + 2; // +1 fonts, +1 DOM
    let loadedCount = 0;

    const recordAssetLoaded = () => {
      if (!isMounted) return;
      loadedCount++;
      const calculatedProgress = Math.min(100, Math.floor((loadedCount / totalAssets) * 100));
      setReadiness((prev) => ({
        isReady: loadedCount >= totalAssets,
        progress: Math.max(prev.progress, calculatedProgress),
      }));
    };

    // 1. Font rasterization check
    if ('fonts' in document) {
      document.fonts.ready
        .then(() => recordAssetLoaded())
        .catch(() => recordAssetLoaded());
    } else {
      recordAssetLoaded();
    }

    // 2. DOM Interactive / Complete check
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => recordAssetLoaded(), { once: true });
    } else {
      recordAssetLoaded();
    }

    // 3. Preload and decode all critical images into browser raster cache
    CRITICAL_IMAGES.forEach((src) => {
      const img = new Image();
      img.src = src;

      const handleImageReady = () => {
        if ('decode' in img) {
          img.decode().then(() => recordAssetLoaded()).catch(() => recordAssetLoaded());
        } else {
          recordAssetLoaded();
        }
      };

      if (img.complete) {
        handleImageReady();
      } else {
        img.onload = handleImageReady;
        img.onerror = () => recordAssetLoaded(); // Resolve on error so app never hangs
      }
    });

    // Safety fallback: if an asset stalls indefinitely, dismiss after 8s
    const safetyTimer = setTimeout(() => {
      if (isMounted) {
        setReadiness({ isReady: true, progress: 100 });
      }
    }, 8000);

    return () => {
      isMounted = false;
      clearTimeout(safetyTimer);
    };
  }, []);

  return readiness;
};
