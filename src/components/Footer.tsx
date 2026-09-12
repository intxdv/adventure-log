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

      {/* 2. Main Colophon Wide & Airy Layout (Opnest Style) */}
      <div className="footer-container">
        {/* Visually Hidden Screen Reader Heading */}
        <h2 id="colophon-heading" className="sr-only">
          Colophon, Navigation, and Basecamp Telemetry
        </h2>

        <div className="footer-layout">
          {/* Brand Identity & Socials Block (Left Side) */}
          <div className="footer-brand-col">
            <div className="footer-brand-title font-display">
              ADVENTURE LOG<span className="footer-brand-dot">.</span>
            </div>
            <p className="footer-brand-tagline font-serif">
              Personal digital archive & software engineering field log by Syafiq Abiyyu Taqi (Selvagant).
            </p>
            <div className="footer-socials-row font-mono" role="list">
              {FOOTER_SOCIAL_LINKS.map((social) => (
                <a
                  key={social.label}
                  href={social.url}
                  className="footer-social-pill"
                  target={social.url.startsWith('mailto:') ? undefined : '_blank'}
                  rel={social.url.startsWith('mailto:') ? undefined : 'noopener noreferrer'}
                  aria-label={social.label}
                >
                  <span>{social.label}</span>
                  <span className="footer-link-arrow" aria-hidden="true">↗</span>
                </a>
              ))}
            </div>
          </div>

          {/* Right Information Grid */}
          <div className="footer-nav-grid">
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

            {/* Col 2: Basecamp Telemetry (No Blinking Beacon, Clean Monospace) */}
            <div className="footer-col">
              <div className="footer-col-header font-mono">
                <span>[ 02 // BASECAMP ]</span>
              </div>
              <div className="footer-telemetry-block font-mono">
                <div className="footer-telemetry-row">
                  <span className="footer-telemetry-label">LIVE WIB CLOCK //</span>
                  <span className="footer-clock-text" aria-live="polite">
                    {wibTime}
                  </span>
                </div>

                <div className="footer-telemetry-row">
                  <span className="footer-telemetry-label">SECTOR COORDINATES //</span>
                  <span className="footer-telemetry-val">{FOOTER_TELEMETRY.coordinates}</span>
                </div>

                <div className="footer-telemetry-row">
                  <span className="footer-telemetry-label">STATION & REGION //</span>
                  <span className="footer-telemetry-val">{FOOTER_TELEMETRY.region}</span>
                </div>

                <div className="footer-telemetry-row">
                  <span className="footer-telemetry-label">COMMISSION STATUS //</span>
                  <span className="footer-telemetry-val footer-status-val">
                    {FOOTER_TELEMETRY.status}
                  </span>
                </div>
              </div>
            </div>

            {/* Col 3: Colophon Credits */}
            <div className="footer-col">
              <div className="footer-col-header font-mono">
                <span>[ 03 // COLOPHON ]</span>
              </div>
              <div className="footer-colophon-body font-mono">
                <div className="footer-colophon-meta">
                  <div>TYPOGRAPHY: {FOOTER_COLOPHON.typography}</div>
                  <div>SYSTEM: {FOOTER_COLOPHON.stack}</div>
                  <div>ARCHIVE: {FOOTER_COLOPHON.edition}</div>
                </div>
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

        {/* Layer 4: Stage Center Copyright Plaque (Sesuai Posisi Kotak Merah Taki) */}
        <div className="footer-stage-copyright font-mono">
          © 2026 SELVAGANT (TAKI) // ALL RIGHTS RESERVED
        </div>
      </div>
    </footer>
  );
};
