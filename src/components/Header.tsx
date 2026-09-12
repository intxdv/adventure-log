import React, { useEffect, useState } from 'react';
import '../styles/NotchDock.css';

export const Header: React.FC = () => {
  const [isNotchVisible, setIsNotchVisible] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

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

      // Calculate overall scroll progress (0 - 100%)
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      if (totalScroll > 0) {
        const currentProgress = (window.scrollY / totalScroll) * 100;
        setScrollProgress(Math.min(100, Math.max(0, currentProgress)));
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

        {/* Reading / Scroll Progress Hairline Indicator */}
        <div className="notch-progress-track" aria-hidden="true">
          <div className="notch-progress-bar" style={{ width: `${scrollProgress}%` }} />
        </div>

        {/* Notch Content & Back-to-Top Brand Anchor */}
        <a
          href="#hero"
          onClick={handleScrollToTop}
          className="notch-brand-anchor"
          title="Click to Return to Expedition Basecamp (Hero)"
        >
          <span className="notch-brand-text">
            ADVENTURE LOG
            <span className="notch-period-container">
              <span className="notch-period-dot">.</span>
              <span className="notch-period-arrow" aria-hidden="true">↑</span>
            </span>
          </span>
        </a>
      </div>
    </header>
  );
};

