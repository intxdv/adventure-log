import React, { useEffect, useState } from 'react';
import { useAssetReadiness } from '../hooks/useAssetReadiness';

interface PreloaderProps {
  onComplete?: () => void;
}

export const Preloader: React.FC<PreloaderProps> = ({ onComplete }) => {
  const isAssetsReady = useAssetReadiness();
  const [progress, setProgress] = useState(0);
  const [isRevealing, setIsRevealing] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

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

  useEffect(() => {
    if (isDismissed) {
      onComplete?.();
      return;
    }

    let animationFrameId: number;
    let startTime: number | null = null;
    let pauseTimer: ReturnType<typeof setTimeout> | null = null;
    let dismissTimer: ReturnType<typeof setTimeout> | null = null;
    const targetDuration = 1200; // 1.2 seconds for counter

    const triggerRevealSequence = () => {
      setProgress(100);
      // Pacing pause: allow user to comfortably register 100% calibration for 500ms
      pauseTimer = setTimeout(() => {
        setIsRevealing(true);
        // Majestic unhurried curtain reveal transition (1350ms)
        dismissTimer = setTimeout(() => {
          setIsDismissed(true);
          window.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior });
          onComplete?.();
        }, 1350);
      }, 500);
    };

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const linearRatio = Math.min(elapsed / targetDuration, 1);

      // Nonlinear calibration curve
      let calculatedProgress: number;
      if (linearRatio < 0.6) {
        calculatedProgress = Math.floor((linearRatio / 0.6) * 68);
      } else if (linearRatio < 0.85) {
        calculatedProgress = 68 + Math.floor(((linearRatio - 0.6) / 0.25) * 22);
      } else {
        calculatedProgress = 90 + Math.floor(((linearRatio - 0.85) / 0.15) * 10);
      }

      if (isAssetsReady && linearRatio >= 0.95) {
        calculatedProgress = 100;
      }

      setProgress(Math.min(100, calculatedProgress));

      if (linearRatio < 1 && calculatedProgress < 100) {
        animationFrameId = requestAnimationFrame(animate);
      } else {
        triggerRevealSequence();
      }
    };

    animationFrameId = requestAnimationFrame(animate);

    // Emergency fallback safety timer
    const fallbackTimer = setTimeout(() => {
      triggerRevealSequence();
    }, 2800);

    return () => {
      cancelAnimationFrame(animationFrameId);
      clearTimeout(fallbackTimer);
      if (pauseTimer) clearTimeout(pauseTimer);
      if (dismissTimer) clearTimeout(dismissTimer);
    };
  }, [isAssetsReady, isDismissed, onComplete]);

  if (isDismissed) return null;

  return (
    <div
      id="preloader-curtain"
      aria-label="Expedition Telemetry Preloader"
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'var(--color-canvas)',
        zIndex: 1000,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: 'clamp(1.5rem, 5vw, 3.5rem)',
        transition: 'opacity 1.35s cubic-bezier(0.16, 1, 0.3, 1), transform 1.35s cubic-bezier(0.16, 1, 0.3, 1)',
        opacity: isRevealing ? 0 : 1,
        transform: isRevealing ? 'translateY(-36px) scale(0.985)' : 'translateY(0) scale(1)',
        pointerEvents: isRevealing ? 'none' : 'all',
      }}
    >
      {/* Top Telemetry Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
        <span className="font-mono" style={{ fontSize: 'var(--text-xs)', color: 'var(--color-olive)', letterSpacing: '0.04em' }}>
          [ EXPEDITION TELEMETRY UNIT // 001.2026 ]
        </span>
        <span className="font-mono" style={{ fontSize: 'var(--text-xs)', color: 'var(--color-ink-muted)' }}>
          BASECAMP // 7.45° S, 110.51° E · SEMARANG, ID
        </span>
      </div>

      {/* Centerpiece Artifact */}
      <div style={{ textAlign: 'center', maxWidth: '580px', margin: '0 auto', width: '100%' }}>
        <div style={{ marginBottom: 'var(--space-md)' }}>
          <span className="tag-badge">
            SELVAGANT // THE DIGITAL CARTOGRAPHER
          </span>
        </div>

        <h2
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(2rem, 5vw, 3.25rem)',
            fontWeight: 800,
            marginBottom: 'var(--space-md)',
            letterSpacing: '-0.03em',
            lineHeight: 1,
            color: 'var(--color-ink)',
          }}
        >
          Adventure Log<span style={{ color: 'var(--color-olive)' }}>.</span>
        </h2>

        {/* Tactile Progress Track Bar */}
        <div
          style={{
            width: '100%',
            height: '2px',
            backgroundColor: 'var(--hairline-base)',
            margin: 'var(--space-md) auto',
            position: 'relative',
            overflow: 'hidden',
          }}
          aria-hidden="true"
        >
          <div
            style={{
              height: '100%',
              backgroundColor: 'var(--color-olive)',
              width: `${progress}%`,
              transition: 'width 0.08s linear',
            }}
          />
        </div>

        <p className="font-mono" style={{ fontSize: 'var(--text-xs)', color: 'var(--color-ink-faint)', letterSpacing: '0.02em' }}>
          CALIBRATING SENSORS & ARCHIVAL SYSTEMS...
        </p>
      </div>

      {/* Bottom Status & Numerical Counter */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 'var(--space-md)' }}>
        <div>
          <span className="font-mono" style={{ fontSize: 'var(--text-xs)', display: 'block', color: 'var(--color-ink-muted)', marginBottom: '2px' }}>
            STATUS // CALIBRATING INSTRUMENTS
          </span>
          <span className="font-mono" style={{ fontSize: 'var(--text-xs)', color: 'var(--color-olive)', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            <span
              style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                backgroundColor: 'var(--color-olive)',
                display: 'inline-block',
              }}
            />
            STATION // INFORMATIKA UNDIP '23
          </span>
        </div>

        <div style={{ textAlign: 'right' }}>
          <span
            className="font-mono"
            style={{
              fontSize: 'clamp(2.5rem, 6vw, 4.25rem)',
              fontWeight: 700,
              color: 'var(--color-ink)',
              fontVariantNumeric: 'tabular-nums',
              lineHeight: 1,
              display: 'block',
              letterSpacing: '-0.03em',
            }}
          >
            {String(progress).padStart(2, '0')}%
          </span>
        </div>
      </div>
    </div>
  );
};
