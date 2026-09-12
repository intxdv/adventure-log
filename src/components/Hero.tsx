import React, { useEffect, useState } from 'react';

export const Hero: React.FC = () => {
  const [timeString, setTimeString] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const options: Intl.DateTimeFormatOptions = {
        timeZone: 'Asia/Jakarta',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
      };
      setTimeString(new Intl.DateTimeFormat('id-ID', options).format(now) + ' WIB');
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section
      id="hero"
      className="hairline-b"
      style={{
        paddingTop: 'var(--space-4xl)',
        paddingBottom: 'var(--space-4xl)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div className="container">
        {/* Top Field Telemetry Bar with Live WIB Clock */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 'var(--space-xs)',
            marginBottom: 'var(--space-2xl)',
            paddingBottom: 'var(--space-sm)',
            borderBottom: '1px solid var(--hairline-subtle)',
          }}
        >
          <div className="font-mono" style={{ fontSize: 'var(--text-xs)', color: 'var(--color-olive)' }}>
            BASECAMP // TENGARAN, SEMARANG (7.45°S, 110.51°E)
          </div>
          <div
            className="font-mono"
            style={{
              fontSize: 'var(--text-xs)',
              color: 'var(--color-ink-muted)',
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--space-sm)',
            }}
          >
            <span>{timeString || '12:00:00 WIB'}</span>
            <span style={{ color: 'var(--hairline-base)' }}>|</span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
              <span
                style={{
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--color-olive)',
                }}
              />
              AVAILABLE FOR EXPEDITIONS
            </span>
          </div>
        </div>

        {/* Hero Main Wordmark & Notch Morph Source */}
        <div style={{ textAlign: 'center', margin: 'var(--space-xl) 0 var(--space-2xl)' }}>
          <span
            className="tag-badge"
            style={{ marginBottom: 'var(--space-md)' }}
          >
            SELVAGANT // CREATIVE DEVELOPER & MOBILE ARCHITECT
          </span>
          <h1
            id="hero-title"
            style={{
              fontSize: 'var(--text-4xl)',
              fontWeight: 800,
              letterSpacing: '-0.03em',
              lineHeight: 1.05,
              marginBottom: 'var(--space-md)',
            }}
          >
            Adventure Log.
          </h1>
          <p
            style={{
              fontSize: 'var(--text-lg)',
              maxWidth: '680px',
              margin: '0 auto',
              color: 'var(--color-ink-muted)',
            }}
          >
            A digital field journal by Selvagant (Taki) — Creative Developer & Mobile Architect.
            Crafting tactile digital systems, robust mobile architectures, and immersive web experiences.
          </p>
        </div>

        {/* Tactical Coordinates Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: 'var(--space-md)',
            marginTop: 'var(--space-3xl)',
            paddingTop: 'var(--space-lg)',
            borderTop: '1px solid var(--hairline-base)',
          }}
        >
          <div className="hairline-box" style={{ padding: 'var(--space-md)', background: 'var(--color-canvas-subtle)' }}>
            <span className="font-mono" style={{ fontSize: 'var(--text-xs)', color: 'var(--color-olive)' }}>
              COORD. 01
            </span>
            <div style={{ fontWeight: 700, fontSize: 'var(--text-sm)', marginTop: '4px' }}>
              Creative Web & Shaders
            </div>
            <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-ink-faint)', marginTop: '2px' }}>
              Canvas 2D, Three.js, WebGL
            </p>
          </div>

          <div className="hairline-box" style={{ padding: 'var(--space-md)', background: 'var(--color-canvas-subtle)' }}>
            <span className="font-mono" style={{ fontSize: 'var(--text-xs)', color: 'var(--color-olive)' }}>
              COORD. 02
            </span>
            <div style={{ fontWeight: 700, fontSize: 'var(--text-sm)', marginTop: '4px' }}>
              Mobile Architecture
            </div>
            <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-ink-faint)', marginTop: '2px' }}>
              Flutter, Native Bridges, Offline Sync
            </p>
          </div>

          <div className="hairline-box" style={{ padding: 'var(--space-md)', background: 'var(--color-canvas-subtle)' }}>
            <span className="font-mono" style={{ fontSize: 'var(--text-xs)', color: 'var(--color-olive)' }}>
              COORD. 03
            </span>
            <div style={{ fontWeight: 700, fontSize: 'var(--text-sm)', marginTop: '4px' }}>
              Editorial Design Systems
            </div>
            <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-ink-faint)', marginTop: '2px' }}>
              Design Tokens, WCAG AA, Typography
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
