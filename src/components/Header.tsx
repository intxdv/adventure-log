import React from 'react';

export const Header: React.FC = () => {
  return (
    <header
      id="top-notch-header"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 90,
        pointerEvents: 'none', // Allow clicks to pass through except on the notch itself
        display: 'flex',
        justifyContent: 'center',
      }}
    >
      {/* Top Center Cutout Notch Dock */}
      <div
        id="header-notch-dock"
        style={{
          pointerEvents: 'auto',
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {/* Notch Content Anchor */}
        <a
          href="#hero"
          style={{
            fontFamily: 'var(--font-display)',
            fontWeight: 800,
            fontSize: 'var(--text-xs)',
            letterSpacing: '0.04em',
            textTransform: 'uppercase',
            color: 'var(--color-ink)',
            textDecoration: 'none',
            padding: '8px 18px',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <span
            style={{
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              backgroundColor: 'var(--color-olive)',
              display: 'inline-block',
            }}
          />
          Adventure Log.
        </a>
      </div>
    </header>
  );
};

