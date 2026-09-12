import React, { useEffect, useState } from 'react';

export const Header: React.FC = () => {
  const [isNotchVisible, setIsNotchVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const heroElement = document.getElementById('hero');
      if (!heroElement) {
        setIsNotchVisible(window.scrollY > 300);
        return;
      }
      const rect = heroElement.getBoundingClientRect();
      // Show notch as soon as Hero bottom scrolls near or past top of screen
      setIsNotchVisible(rect.bottom < 80);
    };

    // Check initial position on mount
    handleScroll();

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, []);

  return (
    <header
      id="top-notch-header"
      aria-label="Notch Navigation Bar"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 90,
        pointerEvents: 'none',
        display: 'flex',
        justifyContent: 'center',
        transform: isNotchVisible ? 'translateY(0)' : 'translateY(-120%)',
        opacity: isNotchVisible ? 1 : 0,
        transition: 'transform 0.42s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.3s ease',
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

