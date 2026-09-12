import React from 'react';
import { useWibTime } from '../hooks/useWibTime';
import {
  FOOTER_NAV_LINKS,
  FOOTER_SOCIAL_LINKS,
  FOOTER_TELEMETRY,
  FOOTER_COLOPHON,
  MARQUEE_ITEMS,
} from '../data/footer';
import './Footer.css';

export const Footer: React.FC = () => {
  const wibTime = useWibTime();

  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAnchorClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith('#')) {
      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <footer id="footer" className="footer-section" aria-labelledby="colophon-heading">
      {/* 1. Ticker Marquee Ribbon */}
      <div className="footer-marquee-ribbon" role="region" aria-label="Field Dispatch Marquee">
        <div className="footer-marquee-track font-mono" aria-hidden="true">
          {/* Double items array for endless smooth marquee loop */}
          {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((item, idx) => (
            <span key={idx} className="footer-marquee-item">
              <span className="footer-marquee-bullet">✦</span>
              <span>{item}</span>
            </span>
          ))}
        </div>
      </div>

      {/* 2. Main Colophon Grid & Landscape Stage */}
      <div className="container footer-container">
        {/* Screen Reader Heading */}
        <h2 id="colophon-heading" className="sr-only">
          Colophon, Navigation, and Basecamp Telemetry
        </h2>

        {/* 4-Column Editorial Information Grid */}
        <div className="footer-grid">
          {/* Col 1: Index */}
          <div className="footer-col">
            <div className="footer-col-header font-mono">
              <span>[ 01 // INDEX ]</span>
            </div>
            <ul className="footer-links-list" role="list">
              {FOOTER_NAV_LINKS.map((link) => (
                <li key={link.index} className="footer-link-item">
                  <a
                    href={link.href}
                    className="footer-link font-mono"
                    onClick={(e) => handleAnchorClick(e, link.href)}
                  >
                    <span className="footer-link-idx">{link.index}.</span>
                    <span>{link.label}</span>
                    <span className="footer-link-arrow" aria-hidden="true">↗</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 2: Connect / Socials */}
          <div className="footer-col">
            <div className="footer-col-header font-mono">
              <span>[ 02 // CONNECT ]</span>
            </div>
            <ul className="footer-links-list" role="list">
              {FOOTER_SOCIAL_LINKS.map((social) => (
                <li key={social.label} className="footer-link-item">
                  <a
                    href={social.url}
                    className="footer-link font-mono"
                    target={social.url.startsWith('mailto:') ? undefined : '_blank'}
                    rel={social.url.startsWith('mailto:') ? undefined : 'noopener noreferrer'}
                  >
                    <span>{social.label}</span>
                    <span className="footer-link-arrow" aria-hidden="true">↗</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Basecamp Telemetry */}
          <div className="footer-col">
            <div className="footer-col-header font-mono">
              <span>[ 03 // BASECAMP ]</span>
            </div>
            <div className="footer-telemetry-block font-mono">
              <div className="footer-telemetry-row">
                <span className="footer-telemetry-label">LIVE WIB CLOCK //</span>
                <div className="footer-live-clock-row">
                  <span className="footer-live-dot" aria-hidden="true" />
                  <span className="footer-clock-text" aria-live="polite">
                    {wibTime}
                  </span>
                </div>
              </div>

              <div className="footer-telemetry-row">
                <span className="footer-telemetry-label">COORDINATES //</span>
                <span className="footer-telemetry-val">{FOOTER_TELEMETRY.coordinates}</span>
              </div>

              <div className="footer-telemetry-row">
                <span className="footer-telemetry-label">STATION & ELEVATION //</span>
                <span className="footer-telemetry-val">{FOOTER_TELEMETRY.elevation}</span>
              </div>

              <div className="footer-telemetry-row">
                <span className="footer-telemetry-label">COMMISSION STATUS //</span>
                <span className="footer-telemetry-val" style={{ color: 'var(--color-olive)' }}>
                  {FOOTER_TELEMETRY.status}
                </span>
              </div>
            </div>
          </div>

          {/* Col 4: Colophon Credits */}
          <div className="footer-col">
            <div className="footer-col-header font-mono">
              <span>[ 04 // COLOPHON ]</span>
            </div>
            <div className="footer-colophon-body">
              <p className="footer-colophon-text font-serif">
                {FOOTER_COLOPHON.craft}
              </p>
              <div className="footer-colophon-meta font-mono">
                <div>TYPOGRAPHY: {FOOTER_COLOPHON.typography}</div>
                <div>SYSTEM: {FOOTER_COLOPHON.stack}</div>
                <div>ARCHIVE: {FOOTER_COLOPHON.edition}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Full-Bleed Edge-to-Edge Landscape Stage (Mentok Bawah & Gradient di Atas) */}
      <div
        className="footer-landscape-stage"
        role="img"
        aria-label="SLVGNT Mountain Landscape with Retro CRT Monitor and Sunken Wordmark"
      >
        {/* Layer 1: Background Landscape Sky & Mountains */}
        <img
          src="/images/footer-landscape-bg.png"
          alt="Mountain Landscape Background"
          className="footer-landscape-bg"
          loading="lazy"
        />

        {/* Layer 2: Giant Wordmark Typography */}
        <div className="footer-wordmark-layer" aria-hidden="true">
          <div className="footer-giant-wordmark">SLVGNT</div>
        </div>

        {/* Layer 3: Foreground Landscape Cutout (Hill and Moss-Covered CRT Monitor) */}
        <img
          src="/images/footer-landscape-fg-slvgnt.png"
          alt=""
          aria-hidden="true"
          className="footer-landscape-fg"
          loading="lazy"
        />

        {/* Layer 4: Stage Overlay Bottom Dispatch Bar (Mentok ke bawah) */}
        <div className="footer-stage-bottom-bar font-mono">
          <div className="footer-stage-bottom-left">
            <span className="footer-stage-coord">
              © 2026 SELVAGANT (TAKI) // ALL RIGHTS RESERVED // CARTOGRAPHIC DOSSIER NO. 07
            </span>
            <span className="footer-stage-coord">
              7.9797° S, 112.6304° E · 3142M
            </span>
          </div>

          <div className="footer-stage-bottom-right">
            <span className="footer-stage-coord">BASECAMP ACTIVE // 2026</span>
            <button
              type="button"
              className="footer-stage-coord footer-stage-top-btn"
              onClick={handleScrollToTop}
              aria-label="Back to top of expedition log"
            >
              <span>TOP</span>
              <span aria-hidden="true">↑</span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
