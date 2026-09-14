import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useAssetReadiness } from '../hooks/useAssetReadiness';
import './Preloader.css';

interface PreloaderProps {
  onComplete?: () => void;
}

export const Preloader: React.FC<PreloaderProps> = ({ onComplete }) => {
  const { isReady: isAssetsReady, progress: assetProgress } = useAssetReadiness();
  const [progress, setProgress] = useState(0);
  const [isRevealing, setIsRevealing] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  const hasTriggeredRevealRef = useRef(false);
  const pauseTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const dismissTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Force viewport to top on initial mount & disable browser scrollRestoration caching
  useEffect(() => {
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual';
    }
    if (window.location.hash) {
      window.history.replaceState(null, '', window.location.pathname + window.location.search);
    }
    window.scrollTo(0, 0);
  }, []);

  // Lock body scroll while preloader is active to prevent scroll leak
  useEffect(() => {
    if (!isDismissed) {
      document.body.style.overflow = 'hidden';
      window.scrollTo(0, 0);
    } else {
      document.body.style.overflow = '';
      window.scrollTo(0, 0);
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isDismissed]);

  const triggerRevealSequence = useCallback(() => {
    if (hasTriggeredRevealRef.current) return;
    hasTriggeredRevealRef.current = true;

    setProgress(100);

    // Zen pacing: hold 100% for 220ms so user registers complete readiness
    pauseTimerRef.current = setTimeout(() => {
      setIsRevealing(true);
      // Smooth curtain fade & lift transition (650ms)
      dismissTimerRef.current = setTimeout(() => {
        setIsDismissed(true);
        window.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior });
        onComplete?.();
      }, 650);
    }, 220);
  }, [onComplete]);

  // Smooth progress animation strictly bound to real asset readiness
  useEffect(() => {
    if (isDismissed) {
      onComplete?.();
      return;
    }

    let animationFrameId: number;
    let currentProgress = progress;

    const tick = () => {
      if (hasTriggeredRevealRef.current) return;

      // Target progress is capped at 95% until all critical assets (including 6MB footer) are 100% ready
      const target = isAssetsReady ? 100 : Math.min(Math.max(assetProgress, 12), 95);

      if (currentProgress < target) {
        const diff = target - currentProgress;
        const step = isAssetsReady ? Math.max(diff * 0.16, 1.2) : Math.max(diff * 0.08, 0.4);
        currentProgress = Math.min(target, currentProgress + step);
        setProgress(Math.floor(currentProgress));
      }

      if (currentProgress >= 100 && isAssetsReady) {
        setProgress(100);
        triggerRevealSequence();
      } else {
        animationFrameId = requestAnimationFrame(tick);
      }
    };

    animationFrameId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(animationFrameId);
      if (pauseTimerRef.current) clearTimeout(pauseTimerRef.current);
      if (dismissTimerRef.current) clearTimeout(dismissTimerRef.current);
    };
  }, [isAssetsReady, assetProgress, isDismissed, onComplete, triggerRevealSequence]);

  if (isDismissed) return null;

  return (
    <aside
      id="preloader-curtain"
      className={`preloader-curtain ${isRevealing ? 'is-revealing' : ''}`}
      aria-label="Selvagant Loading Screen"
      role="status"
    >
      {/* Centered Brand Stage */}
      <div className="preloader-stage" aria-hidden={isRevealing}>
        {/* Official Selvagant Emblem */}
        <div className="preloader-emblem-wrap">
          <img
            src="/logo/Logo SVG/Logo-deep-ink.svg"
            alt="Selvagant Emblem"
            className="preloader-emblem-img"
            width="68"
            height="40"
            loading="eager"
          />
        </div>

        {/* Wordmark Hierarchy */}
        <h1 className="preloader-brand-title">
          SELVAGANT
        </h1>
        <p className="preloader-brand-sub">
          ADVENTURE LOG
        </p>

        {/* Minimalist 128px Hairline Progress */}
        <div className="preloader-progress-track" aria-hidden="true">
          <div
            className="preloader-progress-bar"
            style={{ transform: `scaleX(${progress / 100})` }}
          />
        </div>

        {/* Quiet Percentage Counter */}
        <span className="preloader-counter" aria-live="polite">
          {String(progress).padStart(2, '0')}%
        </span>
      </div>
    </aside>
  );
};
