import React, { useEffect, useState } from 'react';

interface PreloaderProps {
  onComplete?: () => void;
}

export const Preloader: React.FC<PreloaderProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(() => {
            setIsDismissed(true);
            onComplete?.();
          }, 300);
          return 100;
        }
        const increment = Math.floor(Math.random() * 15) + 8;
        return Math.min(prev + increment, 100);
      });
    }, 100);

    return () => clearInterval(timer);
  }, [onComplete]);

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
