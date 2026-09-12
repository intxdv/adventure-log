import React, { useEffect, useState } from 'react';
import '../styles/NotchDock.css';

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
      // Show notch dock when hero has scrolled near or past top of screen
      setIsNotchVisible(rect.bottom < 80);
    };

    handleScroll();

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, []);

  const handleScrollToTop = (e: React.MouseEvent<HTMLAnchorElement>) => {
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
      <div id="header-notch-dock" className="notch-dock-body">
        {/* Inverted Concave Ear Left */}
        <svg className="notch-ear-left" viewBox="0 0 14 14" fill="none" aria-hidden="true">
          <path d="M0,0 H14 V14 C14,6.268 7.732,0 0,0 Z" fill="var(--color-canvas)" />
          <path d="M0,0 C7.732,0 14,6.268 14,14" stroke="var(--hairline-base)" strokeWidth="1" fill="none" />
        </svg>

        {/* Inverted Concave Ear Right */}
        <svg className="notch-ear-right" viewBox="0 0 14 14" fill="none" aria-hidden="true">
          <path d="M14,0 H0 V14 C0,6.268 6.268,0 14,0 Z" fill="var(--color-canvas)" />
          <path d="M0,14 C0,6.268 6.268,0 14,0" stroke="var(--hairline-base)" strokeWidth="1" fill="none" />
        </svg>

        {/* Notch Content & Back-to-Top Brand Anchor */}
        <a
          href="#hero"
          onClick={handleScrollToTop}
          className="notch-brand-anchor"
          title="Return to Expedition Basecamp (Hero)"
        >
          <span className="notch-brand-text">ADVENTURE LOG.</span>
        </a>
      </div>
    </header>
  );
};

