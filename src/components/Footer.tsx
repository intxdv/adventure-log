import React from 'react';
import { useWibTime } from '../hooks/useWibTime';
import {
  FOOTER_NAV_LINKS,
  FOOTER_SOCIAL_LINKS,
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

      {/* 2. Main Colophon Wide & Airy Layout (4-Column Balanced Grid) */}
      <div className="footer-container">
        {/* Visually Hidden Screen Reader Heading */}
        <h2 id="colophon-heading" className="sr-only">
          Colophon, Navigation, and Field Dispatch
        </h2>

        <div className="footer-layout">
          {/* Col 1: Creator Identity & Dispatch (Logo Slvgnt, The Wandering Selv, Clock, Dispatch Icons) */}
          <div className="footer-identity-col">
            <div className="footer-brand-logo-wrapper">
              <img
                src="/logo/Logo SVG/Logo-text-deep-ink.svg"
                alt="Selvagant Logo"
                className="footer-brand-logo-img"
              />
            </div>

            <p className="footer-wandering-selv font-serif">
              The Wandering <span className="footer-selv-accent">Selv</span>.
            </p>

            <div className="footer-clock-row font-mono">
              <span className="footer-clock-time" aria-live="polite">
                {wibTime}
              </span>
            </div>

            <div className="footer-dispatch-icons-row" role="list">
              {FOOTER_SOCIAL_LINKS.map((social) => (
                <a
                  key={social.label}
                  href={social.url}
                  className="footer-dispatch-btn"
                  target={social.url.startsWith('mailto:') ? undefined : '_blank'}
                  rel={social.url.startsWith('mailto:') ? undefined : 'noopener noreferrer'}
                  aria-label={social.label}
                  title={social.label}
                >
                  <img
                    src={social.icon}
                    alt=""
                    className="footer-dispatch-svg"
                    aria-hidden="true"
                  />
                </a>
              ))}
            </div>
          </div>

          {/* Col 2: Adventure Log Journal Block */}
          <div className="footer-journal-col">
            <div className="footer-journal-header font-mono">
              <span>[ PUBLICATION ]</span>
            </div>
            <div className="footer-brand-title font-display">
              ADVENTURE LOG<span className="footer-brand-dot">.</span>
            </div>
            <p className="footer-brand-tagline font-serif">
              {FOOTER_COLOPHON.tagline}
            </p>
          </div>

          {/* Col 3: Index */}
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

          {/* Col 4: Colophon Credits */}
          <div className="footer-col">
            <div className="footer-col-header font-mono">
              <span>[ 02 // COLOPHON ]</span>
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

        {/* Layer 2: Giant Wordmark Typography (Crisp 3.8KB Pure Vector) */}
        <div className="footer-landscape-wordmark" aria-hidden="true">
          <img
            src="/images/SLVGNT.svg"
            alt="SLVGNT"
            className="footer-slvgnt-svg"
            loading="lazy"
          />
        </div>

        {/* Layer 3: Foreground Hill Slope with Mossy CRT Monitor Cutout */}
        <img
          src="/images/footer-landscape-fg-slvgnt.png"
          alt="Landscape Foreground Hill with Retro CRT Monitor"
          className="footer-landscape-fg"
          loading="lazy"
        />

        {/* Layer 4: Frosted White Glass Copyright Plaque on the Hill */}
        <div className="footer-stage-copyright font-mono">
          <span>© 2026 SELVAGANT (TAKI) // ALL RIGHTS RESERVED</span>
        </div>
      </div>
    </footer>
  );
};
