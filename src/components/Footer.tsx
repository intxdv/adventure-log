import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer id="footer" style={{ backgroundColor: 'var(--color-canvas)', position: 'relative', overflow: 'hidden' }}>
      {/* Ticker Marquee Ribbon */}
      <div
        style={{
          borderTop: '1px solid var(--hairline-base)',
          borderBottom: '1px solid var(--hairline-base)',
          padding: 'var(--space-xs) 0',
          backgroundColor: 'var(--color-canvas-subtle)',
          overflow: 'hidden',
          whiteSpace: 'nowrap',
        }}
      >
        <div
          className="font-mono"
          style={{
            display: 'inline-block',
            fontSize: 'var(--text-xs)',
            color: 'var(--color-olive)',
            letterSpacing: '0.1em',
          }}
        >
          ✦ EXPLORE THE UNKNOWN ✦ CRAFT WITH PRECISION ✦ THE DIGITAL CARTOGRAPHER ✦ DISPATCH // 2026 ✦ SELVAGANT — THE WANDERING SELV ✦
        </div>
      </div>

      {/* Main Colophon 4-Column Grid */}
      <div className="container" style={{ padding: 'var(--space-4xl) var(--container-pad) var(--space-3xl)' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: 'var(--space-2xl)',
            marginBottom: 'var(--space-4xl)',
          }}
        >
          {/* Col 1: Index */}
          <div>
            <span className="font-mono" style={{ fontSize: 'var(--text-xs)', color: 'var(--color-olive)', display: 'block', marginBottom: 'var(--space-md)' }}>
              [ 01 // INDEX ]
            </span>
            <ul style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-xs)' }}>
              <li><a href="#hero" style={{ fontSize: 'var(--text-sm)' }}>00. Expedition Log</a></li>
              <li><a href="#about" style={{ fontSize: 'var(--text-sm)' }}>01. Field Brief</a></li>
              <li><a href="#expeditions" style={{ fontSize: 'var(--text-sm)' }}>02. Selected Works</a></li>
              <li><a href="#arsenal" style={{ fontSize: 'var(--text-sm)' }}>03. Technical Gear</a></li>
            </ul>
          </div>

          {/* Col 2: Connect */}
          <div>
            <span className="font-mono" style={{ fontSize: 'var(--text-xs)', color: 'var(--color-olive)', display: 'block', marginBottom: 'var(--space-md)' }}>
              [ 02 // CONNECT ]
            </span>
            <ul style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-xs)' }}>
              <li><a href="https://github.com" target="_blank" rel="noopener noreferrer" style={{ fontSize: 'var(--text-sm)' }}>GitHub ↗</a></li>
              <li><a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" style={{ fontSize: 'var(--text-sm)' }}>LinkedIn ↗</a></li>
              <li><a href="https://twitter.com" target="_blank" rel="noopener noreferrer" style={{ fontSize: 'var(--text-sm)' }}>X / Twitter ↗</a></li>
              <li><a href="mailto:hello@example.com" style={{ fontSize: 'var(--text-sm)' }}>Direct Dispatch ↗</a></li>
            </ul>
          </div>

          {/* Col 3: Basecamp Telemetry */}
          <div>
            <span className="font-mono" style={{ fontSize: 'var(--text-xs)', color: 'var(--color-olive)', display: 'block', marginBottom: 'var(--space-md)' }}>
              [ 03 // BASECAMP ]
            </span>
            <p className="font-mono" style={{ fontSize: 'var(--text-xs)', color: 'var(--color-ink-muted)', lineHeight: 1.8 }}>
              LOCATION: INDONESIA<br />
              COORDINATES: 7.9797° S, 112.6304° E<br />
              TIMEZONE: GMT+7 (WIB)<br />
              STATUS: SELECT PROJECTS OPEN
            </p>
          </div>

          {/* Col 4: Colophon Credits */}
          <div>
            <span className="font-mono" style={{ fontSize: 'var(--text-xs)', color: 'var(--color-olive)', display: 'block', marginBottom: 'var(--space-md)' }}>
              [ 04 // COLOPHON ]
            </span>
            <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-ink-muted)', lineHeight: 1.8 }}>
              Designed & developed by Taki (Selvagant). Set in Lufga & JetBrains Mono. Built with React & Vite.
            </p>
          </div>
        </div>

        {/* Giant Sunken Wordmark Display */}
        <div
          style={{
            textAlign: 'center',
            borderTop: '1px solid var(--hairline-base)',
            paddingTop: 'var(--space-xl)',
            userSelect: 'none',
          }}
        >
          <div
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'var(--text-giant)',
              fontWeight: 800,
              lineHeight: 0.85,
              letterSpacing: '-0.04em',
              color: 'var(--hairline-strong)',
              marginBottom: 'var(--space-md)',
            }}
          >
            ADVENTURE LOG.
          </div>
          <div className="font-mono" style={{ fontSize: 'var(--text-xs)', color: 'var(--color-ink-faint)' }}>
            © 2026 TAKI · ALL RIGHTS RESERVED · FIELD LOG VERSION 1.0
          </div>
        </div>
      </div>
    </footer>
  );
};
