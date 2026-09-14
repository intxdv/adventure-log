import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useAssetReadiness } from '../hooks/useAssetReadiness';
import './Preloader.css';

interface PreloaderProps {
  onComplete?: () => void;
}

export const Preloader: React.FC<PreloaderProps> = ({ onComplete }) => {
  const isAssetsReady = useAssetReadiness();
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

  const triggerRevealSequence = useCallback((instant = false) => {
    if (hasTriggeredRevealRef.current) return;
    hasTriggeredRevealRef.current = true;

    setProgress(100);

    if (instant) {
      setIsRevealing(true);
      if (dismissTimerRef.current) clearTimeout(dismissTimerRef.current);
      dismissTimerRef.current = setTimeout(() => {
        setIsDismissed(true);
        window.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior });
        onComplete?.();
      }, 350);
      return;
    }

    // Zen pacing: hold 100% for 180ms before smooth curtain lift
    pauseTimerRef.current = setTimeout(() => {
      setIsRevealing(true);
      // Smooth curtain fade transition (650ms)
      dismissTimerRef.current = setTimeout(() => {
        setIsDismissed(true);
        window.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior });
        onComplete?.();
      }, 650);
    }, 180);
  }, [onComplete]);

  // Click or keypress to skip
  const handleSkip = useCallback(() => {
    triggerRevealSequence(true);
  }, [triggerRevealSequence]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === ' ' || e.key === 'Enter' || e.key === 'Escape') {
        handleSkip();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleSkip]);

  useEffect(() => {
    if (isDismissed) {
      onComplete?.();
      return;
    }

    let animationFrameId: number;
    let startTime: number | null = null;
    const targetDuration = 1050; // Responsive, respectful 1.05s loading curve

    const animate = (timestamp: number) => {
      if (hasTriggeredRevealRef.current) return;

      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const ratio = Math.min(elapsed / targetDuration, 1);

      // Smooth cubic curve
      const easedRatio = ratio < 0.5
        ? 4 * ratio * ratio * ratio
        : 1 - Math.pow(-2 * ratio + 2, 3) / 2;

      let calculatedProgress = Math.floor(easedRatio * 100);

      if (isAssetsReady && ratio >= 0.85) {
        calculatedProgress = 100;
      }

      setProgress(Math.min(100, calculatedProgress));

      if (ratio < 1 && calculatedProgress < 100) {
        animationFrameId = requestAnimationFrame(animate);
      } else {
        triggerRevealSequence(false);
      }
    };

    animationFrameId = requestAnimationFrame(animate);

    // Fallback timer (2.2s max safety)
    const fallbackTimer = setTimeout(() => {
      triggerRevealSequence(false);
    }, 2200);

    return () => {
      cancelAnimationFrame(animationFrameId);
      clearTimeout(fallbackTimer);
      if (pauseTimerRef.current) clearTimeout(pauseTimerRef.current);
      if (dismissTimerRef.current) clearTimeout(dismissTimerRef.current);
    };
  }, [isAssetsReady, isDismissed, onComplete, triggerRevealSequence]);

  if (isDismissed) return null;

  return (
    <aside
      id="preloader-curtain"
      className={`preloader-curtain ${isRevealing ? 'is-revealing' : ''}`}
      aria-label="Selvagant Loading Screen"
      onClick={handleSkip}
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

      {/* Subtle Skip Hint */}
      <span className="preloader-skip-hint">
        Click or press any key to skip
      </span>
    </aside>
  );
};
