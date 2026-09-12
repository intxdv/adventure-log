import React, { useEffect, useState } from 'react';
import { useAssetReadiness } from '../hooks/useAssetReadiness';

interface PreloaderProps {
  onComplete?: () => void;
}

export const Preloader: React.FC<PreloaderProps> = ({ onComplete }) => {
  const isAssetsReady = useAssetReadiness();
  const [progress, setProgress] = useState(0);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    let animationFrameId: number;
    let startTime: number | null = null;
    const targetDuration = 1350; // Max 1.35 seconds for crisp entrance

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const linearRatio = Math.min(elapsed / targetDuration, 1);

      // Nonlinear expedition calibration curve (accelerate -> tactile linger -> snap to complete)
      let calculatedProgress: number;
      if (linearRatio < 0.6) {
        calculatedProgress = Math.floor((linearRatio / 0.6) * 68);
      } else if (linearRatio < 0.85) {
        // Lingers slightly while assets rasterize
        calculatedProgress = 68 + Math.floor(((linearRatio - 0.6) / 0.25) * 22);
      } else {
        calculatedProgress = 90 + Math.floor(((linearRatio - 0.85) / 0.15) * 10);
      }

      // If assets are ready, allow progress to reach 100%
      if (isAssetsReady && linearRatio >= 0.95) {
        calculatedProgress = 100;
      }

      setProgress(Math.min(100, calculatedProgress));

      if (linearRatio < 1 && calculatedProgress < 100) {
        animationFrameId = requestAnimationFrame(animate);
      } else {
        setProgress(100);
        setTimeout(() => {
          setIsDismissed(true);
          onComplete?.();
        }, 320);
      }
    };

    animationFrameId = requestAnimationFrame(animate);

    // Emergency fallback safety timer: guarantee dismissal within 1.8 seconds max
    const fallbackTimer = setTimeout(() => {
      setProgress(100);
      setTimeout(() => {
        setIsDismissed(true);
        onComplete?.();
      }, 200);
    }, 1800);

    return () => {
      cancelAnimationFrame(animationFrameId);
      clearTimeout(fallbackTimer);
    };
  }, [isAssetsReady, onComplete]);

  if (isDismissed) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'var(--color-canvas)',
        zIndex: 1000,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: 'clamp(1.5rem, 5vw, 3rem)',
        transition: 'opacity 0.6s var(--ease-out-expo), transform 0.6s var(--ease-out-expo)',
        opacity: progress === 100 ? 0 : 1,
        pointerEvents: progress === 100 ? 'none' : 'all',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span className="font-mono" style={{ fontSize: 'var(--text-xs)', color: 'var(--color-olive)' }}>
          [ EXPEDITION TELEMETRY UNIT ]
        </span>
        <span className="font-mono" style={{ fontSize: 'var(--text-xs)', color: 'var(--color-ink-muted)' }}>
          BASECAMP: 7.9797° S, 112.6304° E
        </span>
      </div>

      <div style={{ textAlign: 'center' }}>
        <h2
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'var(--text-2xl)',
            fontWeight: 800,
            marginBottom: 'var(--space-xs)',
            letterSpacing: '-0.02em',
          }}
        >
          ADVENTURE LOG.
        </h2>
        <p className="font-mono" style={{ fontSize: 'var(--text-xs)', color: 'var(--color-ink-faint)' }}>
          INITIALIZING FIELD ARCHIVE & CARTOGRAPHER PROTOCOLS...
        </p>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <span className="font-mono" style={{ fontSize: 'var(--text-xs)', display: 'block', color: 'var(--color-ink-muted)' }}>
            STATUS: CALIBRATING INSTRUMENTS
          </span>
          <span className="font-mono" style={{ fontSize: 'var(--text-xs)', color: 'var(--color-olive)' }}>
            SYSTEM: OK
          </span>
        </div>
        <div style={{ textAlign: 'right' }}>
          <span
            className="font-mono"
            style={{
              fontSize: 'var(--text-2xl)',
              fontWeight: 700,
              color: 'var(--color-ink)',
              fontVariantNumeric: 'tabular-nums',
            }}
          >
            {String(progress).padStart(2, '0')}%
          </span>
        </div>
      </div>
    </div>
  );
};
