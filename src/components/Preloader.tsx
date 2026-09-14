import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useAssetReadiness } from '../hooks/useAssetReadiness';
import './Preloader.css';

interface PreloaderProps {
  onComplete?: () => void;
}

export const Preloader: React.FC<PreloaderProps> = ({ onComplete }) => {
  const { isReady, progress: targetAssetProgress } = useAssetReadiness();
  const [displayedProgress, setDisplayedProgress] = useState(0);
  const [isRevealing, setIsRevealing] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  const hasTriggeredRevealRef = useRef(false);
  const currentProgressRef = useRef(0);
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

    setDisplayedProgress(100);

    // Zen pacing: hold 100% for 350ms before smooth curtain lift
    pauseTimerRef.current = setTimeout(() => {
      setIsRevealing(true);
      // Smooth curtain fade transition (750ms)
      dismissTimerRef.current = setTimeout(() => {
        setIsDismissed(true);
        window.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior });
        onComplete?.();
      }, 750);
    }, 350);
  }, [onComplete]);

  // Smoothly interpolate displayed progress across a measured ~2.0s curve, bound to true asset readiness
  useEffect(() => {
    if (isDismissed) return;

    let animationFrameId: number;
    let startTime: number | null = null;
    const minDuration = 2000; // 2.0s calm, dignified loading curve

    const updateProgress = (timestamp: number) => {
      if (hasTriggeredRevealRef.current) return;
      if (!startTime) startTime = timestamp;

      const elapsed = timestamp - startTime;
      const timeRatio = Math.min(elapsed / minDuration, 1);

      // Smooth S-curve easing
      const easedTimeRatio = timeRatio < 0.5
        ? 4 * timeRatio * timeRatio * timeRatio
        : 1 - Math.pow(-2 * timeRatio + 2, 3) / 2;

      const timeBasedProgress = Math.floor(easedTimeRatio * 100);

      // Cap at 92% until all critical images are 100% decoded
      const currentCap = isReady ? 100 : Math.min(92, targetAssetProgress);
      const calculated = Math.min(timeBasedProgress, currentCap);

      currentProgressRef.current = calculated;
      setDisplayedProgress(calculated);

      if (isReady && timeRatio >= 1 && calculated >= 100) {
        triggerRevealSequence();
      } else {
        animationFrameId = requestAnimationFrame(updateProgress);
      }
    };

    animationFrameId = requestAnimationFrame(updateProgress);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [isReady, targetAssetProgress, isDismissed, triggerRevealSequence]);

  // Cleanup timers on unmount
  useEffect(() => {
    return () => {
      if (pauseTimerRef.current) clearTimeout(pauseTimerRef.current);
      if (dismissTimerRef.current) clearTimeout(dismissTimerRef.current);
    };
  }, []);

  if (isDismissed) return null;

  return (
    <aside
      id="preloader-curtain"
      className={`preloader-curtain ${isRevealing ? 'is-revealing' : ''}`}
      aria-label="Selvagant Archival Preloader"
      role="status"
    >
      {/* Centered Brand Stage */}
      <div className="preloader-stage" aria-hidden={isRevealing}>
        {/* Official Selvagant Emblem (88px x 51px) */}
        <div className="preloader-emblem-wrap">
          <img
            src="/logo/Logo SVG/Logo-deep-ink.svg"
            alt="Selvagant Emblem"
            className="preloader-emblem-img"
            width="88"
            height="51"
            loading="eager"
            decoding="async"
          />
        </div>

        {/* Wordmark Hierarchy */}
        <h1 className="preloader-brand-title">
          SELVAGANT
        </h1>
        <p className="preloader-brand-sub">
          ADVENTURE LOG
        </p>

        {/* Minimalist 160px Hairline Progress Track */}
        <div className="preloader-progress-track" aria-hidden="true">
          <div
            className="preloader-progress-bar"
            style={{ transform: `scaleX(${displayedProgress / 100})` }}
          />
        </div>

        {/* Monospaced Percentage Counter */}
        <span className="preloader-counter" aria-live="polite">
          {String(displayedProgress).padStart(2, '0')}%
        </span>
      </div>
    </aside>
  );
};
