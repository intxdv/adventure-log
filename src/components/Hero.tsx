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
        paddingTop: 'clamp(3rem, 7vw, 6rem)',
        paddingBottom: 'clamp(3rem, 7vw, 6rem)',
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

        {/* Hero Main Wordmark & Editorial Centerpiece */}
        <div style={{ textAlign: 'center', margin: 'var(--space-2xl) auto var(--space-3xl)', maxWidth: '960px' }}>
          {/* Moniker & Positioning Pill */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexWrap: 'wrap',
              gap: 'var(--space-sm)',
              marginBottom: 'var(--space-lg)',
            }}
          >
            <span className="tag-badge">
              DISPATCH // 2026
            </span>
            <span
              className="tag-badge"
              style={{
                borderColor: 'var(--color-olive)',
                color: 'var(--color-olive)',
                backgroundColor: 'rgba(74, 88, 68, 0.06)',
              }}
            >
              SELV<span style={{ fontWeight: 400, letterSpacing: '0.04em' }}>AGANT</span>
            </span>
            <span className="font-mono" style={{ fontSize: 'var(--text-xs)', color: 'var(--color-ink-muted)' }}>
              THE WANDERING <em>SELV</em>
            </span>
          </div>

          {/* Grand Editorial Display Title */}
          <h1
            id="hero-title"
            style={{
              fontSize: 'clamp(3.2rem, 8.5vw, 6.4rem)',
              fontWeight: 800,
              letterSpacing: '-0.035em',
              lineHeight: 0.98,
              marginBottom: 'var(--space-lg)',
              color: 'var(--color-ink)',
            }}
          >
            Adventure Log<span style={{ color: 'var(--color-olive)' }}>.</span>
          </h1>

          {/* Role Positioning & Manifesto Excerpt */}
          <p
            style={{
              fontSize: 'clamp(1rem, 2vw, 1.25rem)',
              lineHeight: 1.6,
              maxWidth: '660px',
              margin: '0 auto var(--space-xl)',
              color: 'var(--color-ink-muted)',
              fontFamily: 'var(--font-sans)',
            }}
          >
            A digital field journal by Selvagant (Taki) — <strong>Creative Developer & Mobile Architect</strong> based in Central Java.
            Bridging analytical software engineering with tactile digital systems and organic exploration.
          </p>

          {/* Field Waypoint Jump Links */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 'var(--space-md)',
              flexWrap: 'wrap',
              justifyContent: 'center',
            }}
          >
            <a
              href="#expeditions"
              className="tag-badge"
              style={{
                padding: '8px 16px',
                fontSize: 'var(--text-xs)',
                fontWeight: 600,
                color: 'var(--color-ink)',
                borderColor: 'var(--color-ink)',
                backgroundColor: 'var(--color-canvas)',
                textDecoration: 'none',
              }}
            >
              [ 01. EXPEDITIONS ↓ ]
            </a>
            <a
              href="#about"
              className="tag-badge"
              style={{
                padding: '8px 16px',
                fontSize: 'var(--text-xs)',
                color: 'var(--color-ink-muted)',
                backgroundColor: 'transparent',
                textDecoration: 'none',
              }}
            >
              [ 02. DOSSIER & MANIFESTO ]
            </a>
          </div>
        </div>

        {/* Tactical Coordinates Grid from Dossier */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: 'var(--space-md)',
            marginTop: 'var(--space-3xl)',
            paddingTop: 'var(--space-lg)',
            borderTop: '1px solid var(--hairline-base)',
          }}
        >
          <div className="hairline-box" style={{ padding: 'var(--space-md)', background: 'var(--color-canvas-subtle)' }}>
            <span className="font-mono" style={{ fontSize: 'var(--text-xs)', color: 'var(--color-olive)' }}>
              COORD. 01 // MOBILE ARCHITECTURE
            </span>
            <div style={{ fontWeight: 700, fontSize: 'var(--text-sm)', marginTop: '4px' }}>
              Mobile Engineer @ UPPTI Undip
            </div>
            <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-ink-faint)', marginTop: '2px', lineHeight: 1.5 }}>
              Flutter, Native Android (Kotlin), Clean Architecture, offline-first client sync.
            </p>
          </div>

          <div className="hairline-box" style={{ padding: 'var(--space-md)', background: 'var(--color-canvas-subtle)' }}>
            <span className="font-mono" style={{ fontSize: 'var(--text-xs)', color: 'var(--color-olive)' }}>
              COORD. 02 // CREATIVE WEB CRAFT
            </span>
            <div style={{ fontWeight: 700, fontSize: 'var(--text-sm)', marginTop: '4px' }}>
              Tactile Systems & Shaders
            </div>
            <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-ink-faint)', marginTop: '2px', lineHeight: 1.5 }}>
              TypeScript, React 18, Canvas 2D telemetry, responsive editorial typography design tokens.
            </p>
          </div>

          <div className="hairline-box" style={{ padding: 'var(--space-md)', background: 'var(--color-canvas-subtle)' }}>
            <span className="font-mono" style={{ fontSize: 'var(--text-xs)', color: 'var(--color-olive)' }}>
              COORD. 03 // LEADERSHIP & PEOPLE
            </span>
            <div style={{ fontWeight: 700, fontSize: 'var(--text-sm)', marginTop: '4px' }}>
              Mas'ul DIGIT & MADANI · PSDM HMIF
            </div>
            <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-ink-faint)', marginTop: '2px', lineHeight: 1.5 }}>
              Strategic organization direction, student human capital development & laboratory mentoring.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
