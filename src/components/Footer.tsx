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
              <span>The Wandering</span>
              <span className="footer-selv-accent">Selv.</span>
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
          src="/images/footer-landscape-bg-v2.webp"
          alt="Mountain Landscape Background"
          className="footer-landscape-bg"
          loading="lazy"
          decoding="async"
        />

        {/* Layer 2: Figma Design Accurate SLVGNT Vector Typography (Clean Line Art) */}
        {/* Desktop Single-Line Wordmark */}
        <div className="footer-landscape-wordmark footer-landscape-wordmark--desktop" aria-label="SLVGNT">
          <svg
            className="footer-landscape-wordmark-svg"
            viewBox="0 0 2428 478"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g className="slvgnt-group">
              <path
                id="slvgnt-char-s"
                className="slvgnt-char slvgnt-s"
                d="M200.991 465.35C166.303 465.35 131.51 458.938 96.6122 446.114C61.7141 433.29 32.1768 416.366 8.0003 395.343L64.7624 310.831C83.8933 327.439 105.652 340.894 130.039 351.195C154.636 361.286 178.076 366.331 200.361 366.331C218.861 366.331 234.418 362.968 247.032 356.24C259.856 349.513 266.268 340.578 266.268 329.436C266.268 325.442 265.427 321.868 263.745 318.714C262.063 315.561 259.225 312.618 255.231 309.885C251.236 307.152 247.242 304.839 243.248 302.947C239.253 300.845 233.472 298.637 225.904 296.325C218.546 294.012 212.134 292.225 206.668 290.964C201.412 289.492 193.739 287.495 183.647 284.972C78.5325 259.324 25.975 210.866 25.975 139.598C25.975 98.6035 42.0576 65.8076 74.2228 41.2107C106.388 16.4036 148.854 4 201.622 4C234.628 4 265.112 9.04552 293.072 19.1366C321.243 29.2276 344.158 42.4721 361.817 58.87L310.731 143.698C297.277 131.504 280.563 121.729 260.592 114.371C240.62 106.802 220.543 103.018 200.361 103.018C182.701 103.018 168.301 106.067 157.158 112.163C146.016 118.26 140.445 126.144 140.445 135.814C140.445 146.115 146.962 154.63 159.997 161.357C173.241 168.085 191.426 174.181 214.551 179.647C222.33 181.329 229.478 183.116 235.995 185.008C242.722 186.69 251.972 189.633 263.745 193.838C275.728 197.832 286.45 202.247 295.91 207.082C305.581 211.917 315.882 218.224 326.814 226.003C337.746 233.781 346.786 242.191 353.934 251.23C361.292 260.27 367.388 271.202 372.224 284.026C377.269 296.85 379.792 310.515 379.792 325.021C379.792 352.351 371.908 376.843 356.141 398.497C340.374 419.94 318.93 436.443 291.811 448.006C264.691 459.568 234.418 465.35 200.991 465.35Z"
                fill="white"
                fillOpacity="0.95"
                stroke="#121512"
                strokeWidth="2"
                strokeLinejoin="round"
              />
              <path
                id="slvgnt-char-l"
                className="slvgnt-char slvgnt-l"
                d="M541.564 352.772H719.103V457.466H430.563V11.8836H541.564V352.772Z"
                fill="white"
                fillOpacity="0.95"
                stroke="#121512"
                strokeWidth="2"
                strokeLinejoin="round"
              />
              <path
                id="slvgnt-char-v"
                className="slvgnt-char slvgnt-v"
                d="M998.184 11.8836H1119.59L947.728 457.466H834.204L661.71 11.8836H785.641L892.228 307.677L998.184 11.8836Z"
                fill="white"
                fillOpacity="0.95"
                stroke="#121512"
                strokeWidth="2"
                strokeLinejoin="round"
              />
              <path
                id="slvgnt-char-g"
                className="slvgnt-char slvgnt-g"
                d="M1352 197.306H1571.17V236.094C1571.17 279.612 1561.49 318.925 1542.15 354.033C1522.81 388.931 1495.9 416.261 1461.43 436.023C1426.95 455.574 1388.16 465.35 1345.06 465.35C1312.27 465.35 1281.36 459.463 1252.35 447.69C1223.34 435.707 1198.43 419.52 1177.61 399.127C1157.01 378.735 1140.72 354.348 1128.74 325.967C1116.96 297.376 1111.08 266.893 1111.08 234.517C1111.08 191.42 1121.27 152.317 1141.67 117.209C1162.27 81.8902 1190.54 54.245 1226.49 34.2731C1262.65 14.091 1302.81 4 1346.96 4C1385.22 4 1420.64 11.3581 1453.23 26.0741C1485.81 40.7902 1511.99 61.1826 1531.75 87.2511L1447.55 154.42C1435.99 140.544 1421.69 129.718 1404.66 121.939C1387.63 113.95 1369.24 109.956 1349.48 109.956C1314.16 109.956 1284.52 121.939 1260.55 145.905C1236.79 169.661 1224.92 199.199 1224.92 234.517C1224.92 270.046 1236.79 299.794 1260.55 323.76C1284.31 347.516 1313.74 359.394 1348.85 359.394C1373.02 359.394 1394.26 353.612 1412.55 342.05C1431.05 330.487 1444.08 315.14 1451.65 296.009H1352V197.306Z"
                fill="white"
                fillOpacity="0.95"
                stroke="#121512"
                strokeWidth="2"
                strokeLinejoin="round"
              />
              <path
                id="slvgnt-char-n"
                className="slvgnt-char slvgnt-n"
                d="M1904.8 11.8836H2015.8V457.466H1904.8L1737.35 206.136V457.466H1626.35V11.8836H1737.35L1904.8 263.844V11.8836Z"
                fill="white"
                fillOpacity="0.95"
                stroke="#121512"
                strokeWidth="2"
                strokeLinejoin="round"
              />
              <path
                id="slvgnt-char-t"
                className="slvgnt-char slvgnt-t"
                d="M2419.76 11.8836V116.578H2300.87V457.466H2189.87V116.578H2070.36V11.8836H2419.76Z"
                fill="white"
                fillOpacity="0.95"
                stroke="#121512"
                strokeWidth="2"
                strokeLinejoin="round"
              />
            </g>
          </svg>
        </div>

        {/* Mobile 2-Line Stacked Wordmark (SLV on top, GNT on bottom) */}
        <div className="footer-landscape-wordmark footer-landscape-wordmark--mobile" aria-label="SLVGNT">
          <svg
            className="footer-landscape-wordmark-svg"
            viewBox="0 0 1440 880"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g className="slvgnt-group">
              {/* Top Row: SLV */}
              <g transform="translate(100, 0)">
                <path
                  className="slvgnt-char slvgnt-s"
                  d="M200.991 465.35C166.303 465.35 131.51 458.938 96.6122 446.114C61.7141 433.29 32.1768 416.366 8.0003 395.343L64.7624 310.831C83.8933 327.439 105.652 340.894 130.039 351.195C154.636 361.286 178.076 366.331 200.361 366.331C218.861 366.331 234.418 362.968 247.032 356.24C259.856 349.513 266.268 340.578 266.268 329.436C266.268 325.442 265.427 321.868 263.745 318.714C262.063 315.561 259.225 312.618 255.231 309.885C251.236 307.152 247.242 304.839 243.248 302.947C239.253 300.845 233.472 298.637 225.904 296.325C218.546 294.012 212.134 292.225 206.668 290.964C201.412 289.492 193.739 287.495 183.647 284.972C78.5325 259.324 25.975 210.866 25.975 139.598C25.975 98.6035 42.0576 65.8076 74.2228 41.2107C106.388 16.4036 148.854 4 201.622 4C234.628 4 265.112 9.04552 293.072 19.1366C321.243 29.2276 344.158 42.4721 361.817 58.87L310.731 143.698C297.277 131.504 280.563 121.729 260.592 114.371C240.62 106.802 220.543 103.018 200.361 103.018C182.701 103.018 168.301 106.067 157.158 112.163C146.016 118.26 140.445 126.144 140.445 135.814C140.445 146.115 146.962 154.63 159.997 161.357C173.241 168.085 191.426 174.181 214.551 179.647C222.33 181.329 229.478 183.116 235.995 185.008C242.722 186.69 251.972 189.633 263.745 193.838C275.728 197.832 286.45 202.247 295.91 207.082C305.581 211.917 315.882 218.224 326.814 226.003C337.746 233.781 346.786 242.191 353.934 251.23C361.292 260.27 367.388 271.202 372.224 284.026C377.269 296.85 379.792 310.515 379.792 325.021C379.792 352.351 371.908 376.843 356.141 398.497C340.374 419.94 318.93 436.443 291.811 448.006C264.691 459.568 234.418 465.35 200.991 465.35Z"
                  fill="white"
                  fillOpacity="0.95"
                  stroke="#121512"
                  strokeWidth="2"
                  strokeLinejoin="round"
                />
                <path
                  className="slvgnt-char slvgnt-l"
                  d="M541.564 352.772H719.103V457.466H430.563V11.8836H541.564V352.772Z"
                  fill="white"
                  fillOpacity="0.95"
                  stroke="#121512"
                  strokeWidth="2"
                  strokeLinejoin="round"
                />
                <path
                  className="slvgnt-char slvgnt-v"
                  d="M998.184 11.8836H1119.59L947.728 457.466H834.204L661.71 11.8836H785.641L892.228 307.677L998.184 11.8836Z"
                  fill="white"
                  fillOpacity="0.95"
                  stroke="#121512"
                  strokeWidth="2"
                  strokeLinejoin="round"
                />
              </g>
              {/* Bottom Row: GNT */}
              <g transform="translate(-1003, 395)">
                <path
                  className="slvgnt-char slvgnt-g"
                  d="M1352 197.306H1571.17V236.094C1571.17 279.612 1561.49 318.925 1542.15 354.033C1522.81 388.931 1495.9 416.261 1461.43 436.023C1426.95 455.574 1388.16 465.35 1345.06 465.35C1312.27 465.35 1281.36 459.463 1252.35 447.69C1223.34 435.707 1198.43 419.52 1177.61 399.127C1157.01 378.735 1140.72 354.348 1128.74 325.967C1116.96 297.376 1111.08 266.893 1111.08 234.517C1111.08 191.42 1121.27 152.317 1141.67 117.209C1162.27 81.8902 1190.54 54.245 1226.49 34.2731C1262.65 14.091 1302.81 4 1346.96 4C1385.22 4 1420.64 11.3581 1453.23 26.0741C1485.81 40.7902 1511.99 61.1826 1531.75 87.2511L1447.55 154.42C1435.99 140.544 1421.69 129.718 1404.66 121.939C1387.63 113.95 1369.24 109.956 1349.48 109.956C1314.16 109.956 1284.52 121.939 1260.55 145.905C1236.79 169.661 1224.92 199.199 1224.92 234.517C1224.92 270.046 1236.79 299.794 1260.55 323.76C1284.31 347.516 1313.74 359.394 1348.85 359.394C1373.02 359.394 1394.26 353.612 1412.55 342.05C1431.05 330.487 1444.08 315.14 1451.65 296.009H1352V197.306Z"
                  fill="white"
                  fillOpacity="0.95"
                  stroke="#121512"
                  strokeWidth="2"
                  strokeLinejoin="round"
                />
                <path
                  className="slvgnt-char slvgnt-n"
                  d="M1904.8 11.8836H2015.8V457.466H1904.8L1737.35 206.136V457.466H1626.35V11.8836H1737.35L1904.8 263.844V11.8836Z"
                  fill="white"
                  fillOpacity="0.95"
                  stroke="#121512"
                  strokeWidth="2"
                  strokeLinejoin="round"
                />
                <path
                  className="slvgnt-char slvgnt-t"
                  d="M2419.76 11.8836V116.578H2300.87V457.466H2189.87V116.578H2070.36V11.8836H2419.76Z"
                  fill="white"
                  fillOpacity="0.95"
                  stroke="#121512"
                  strokeWidth="2"
                  strokeLinejoin="round"
                />
              </g>
            </g>
          </svg>
        </div>

        {/* Layer 3: Foreground Hill Slope with Mossy CRT Monitor Cutout */}
        <img
          src="/images/footer-landscape-fg-slvgnt.webp"
          alt="Landscape Foreground Hill with Retro CRT Monitor"
          className="footer-landscape-fg"
          loading="lazy"
          decoding="async"
        />

        {/* Layer 4: Frosted White Glass Copyright Plaque on the Hill */}
        <div className="footer-stage-copyright font-mono">
          <span>© 2026 SELVAGANT // ALL RIGHTS RESERVED</span>
        </div>
      </div>
    </footer>
  );
};
