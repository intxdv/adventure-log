import React, { useEffect, useState } from 'react';
import '../styles/NotchDock.css';

export const Header: React.FC = () => {
  const [isNotchVisible, setIsNotchVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const heroElement = document.getElementById('hero');
      if (!heroElement) {
        setIsNotchVisible(window.scrollY > 300);
      } else {
        const rect = heroElement.getBoundingClientRect();
        // Show notch dock when hero has scrolled near or past top of screen
        setIsNotchVisible(rect.bottom < 80);
      }
    };

    handleScroll();

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, []);

  const handleScrollToTop = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header
      id="top-notch-header"
      aria-label="Top Notch Identity Dock"
      className={`notch-header-container ${isNotchVisible ? 'is-visible' : 'is-hidden'}`}
    >
      {/* Top Center Cutout Notch Dock with Inverted Rounded Corners */}
      <div id="header-notch-dock" className="notch-dock-body" onClick={handleScrollToTop}>
        {/* Inverted Concave Ear Left (R=16) */}
        <svg className="notch-ear-left" viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <path d="M0,0 H16 V16 C16,7.163 8.837,0 0,0 Z" fill="var(--color-canvas)" />
          <path d="M0,0 C8.837,0 16,7.163 16,16" stroke="var(--hairline-base)" strokeWidth="1" fill="none" />
        </svg>

        {/* Inverted Concave Ear Right (R=16) */}
        <svg className="notch-ear-right" viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <path d="M16,0 H0 V16 C0,7.163 7.163,0 16,0 Z" fill="var(--color-canvas)" />
          <path d="M0,16 C0,7.163 7.163,0 16,0" stroke="var(--hairline-base)" strokeWidth="1" fill="none" />
        </svg>

        {/* Notch Content & Back-to-Top Brand Anchor */}
        <a
          href="#hero"
          onClick={handleScrollToTop}
          className="notch-brand-anchor"
          title="Click to Return to Expedition Basecamp (Hero)"
        >
          {/* Default View: Editorial Wordmark */}
          <span className="notch-label-default">
            ADVENTURE LOG<span style={{ color: 'var(--color-olive)' }}>.</span>
          </span>

          {/* Hover View: Clean Centered Upward Arrow */}
          <span className="notch-label-hover" aria-hidden="true">
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="12" y1="19" x2="12" y2="5" />
              <polyline points="5 12 12 5 19 12" />
            </svg>
          </span>
        </a>
      </div>
    </header>
  );
};

