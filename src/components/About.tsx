import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import './About.css';

export const About: React.FC = () => {
  const [hasImageError, setHasImageError] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  // Lock body/html scroll when profile modal is open to prevent page scroll hijacking
  useEffect(() => {
    if (isProfileModalOpen) {
      const originalBodyOverflow = document.body.style.overflow;
      const originalHtmlOverflow = document.documentElement.style.overflow;
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';

      return () => {
        document.body.style.overflow = originalBodyOverflow;
        document.documentElement.style.overflow = originalHtmlOverflow;
      };
    }
  }, [isProfileModalOpen]);

  // Close modal on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsProfileModalOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Helper untuk membungkus tiap kata dalam span agar animasi GSAP entrance tetap berjalan halus
  const renderWords = (text: string) => {
    return text.split(' ').map((word, idx) => (
      <React.Fragment key={idx}>
        <span className="about-word">{word}</span>{' '}
      </React.Fragment>
    ));
  };

  return (
    <section
      id="about"
      className="about-section is-nocturne"
      aria-labelledby="about-heading"
    >
      <div className="about-container about-grid">
        {/* Kolom Kiri: Kartu Foto Portrait Bersih (Dagu Putih Polaroid Tanpa Teks) */}
        <div className="field-card-wrapper">
          <figure
            id="field-zine-card-elem"
            className="field-zine-card"
            aria-label="Portrait: Syafiq Abiyyu Taqi (Taki)"
          >
            <div className="field-zine-frame">
              <div className="field-zine-img-viewport">
                {!hasImageError ? (
                  <img
                    id="field-zine-portrait-img"
                    src="/images/taki-portrait.webp"
                    alt="Syafiq Abiyyu Taqi (Taki)"
                    className="field-zine-img"
                    width={1080}
                    height={1080}
                    loading="eager"
                    decoding="async"
                    onError={() => setHasImageError(true)}
                  />
                ) : (
                  <div className="field-dossier-fallback">
                    <div style={{ fontWeight: 700, fontSize: 'var(--text-base)', color: 'var(--color-ink)' }}>
                      TAKI
                    </div>
                    <div className="font-mono" style={{ fontSize: 'var(--text-xs)', color: 'var(--color-olive)', marginTop: '4px' }}>
                      Syafiq Abiyyu Taqi
                    </div>
                  </div>
                )}
              </div>

              {/* Selvagant Emblem Logo in Top-Right Corner */}
              <div
                className="field-zine-logo-badge"
                aria-label="Selvagant Logo Emblem"
              >
                <img
                  src="/logo/Logo SVG/Logo-white.svg"
                  alt="Selvagant Logo Emblem"
                  className="field-zine-logo-img"
                  width={72}
                  height={42}
                  loading="lazy"
                  decoding="async"
                />
              </div>

              {/* In-Photo Identity Stamp on bottom-left sleeve */}
              <div className="field-photo-identity-stamp" aria-hidden="true">
                <span className="field-photo-callname font-display">TAKI</span>
                <span className="field-photo-fullname font-mono">Syafiq Abiyyu Taqi</span>
              </div>
            </div>
          </figure>
        </div>

        {/* Kolom Kanan: Bio Editorial Humanized (No em-dashes, no AI puffery) */}
        <article className="about-article">
          <header>
            <div className="about-kicker font-mono">
              <span className="about-kicker-tag">[ 01 // PROFILE ]</span>
            </div>
            
            <h2 id="about-heading" className="about-headline font-display">
              {renderWords("Software Developer & Builder.")}
            </h2>
          </header>

          <p className="about-lead">
            {renderWords(
              "I build mobile apps, web extensions, and practical tools. Most of what I make starts with a real problem: an offline feed calculator for rural dairy farmers, campus facility reporting without bureaucracy, or a code-editor EPUB previewer I built because reading raw translation chapters one by one got annoying."
            )}
          </p>

          <p className="about-body">
            {renderWords(
              "I like digging into systems from scratch and keeping code simple so the tool just works."
            )}
          </p>

          <div className="about-actions">
            <button
              type="button"
              className="about-field-brief-btn font-mono cursor-target"
              onClick={() => setIsProfileModalOpen(true)}
              aria-label="Open full Resume and Profile Dossier"
              title="Open full Resume and Profile Dossier"
            >
              <span>[ RESUME ]</span>
              <span className="about-btn-arrow" aria-hidden="true">↗</span>
            </button>
          </div>
        </article>
      </div>

      {/* Profile & Resume Dossier Modal */}
      {isProfileModalOpen &&
        createPortal(
          <div
            className="dossier-modal-backdrop is-stacked"
            onWheel={(e) => e.stopPropagation()}
            onTouchMove={(e) => {
              if (e.target === e.currentTarget) e.preventDefault();
            }}
            onClick={(e) => {
              if (e.target === e.currentTarget) setIsProfileModalOpen(false);
            }}
            role="dialog"
            aria-modal="true"
            aria-labelledby="profile-dossier-title"
          >
            <div className="dossier-modal-container hairline-box">
              {/* Modal Top Bar */}
              <div className="dossier-modal-top font-mono">
                <div className="dossier-modal-header-meta">
                  <span className="dossier-index-badge">[ 01 // PROFILE ]</span>
                  <span className="dossier-meta-sep">//</span>
                  <span className="dossier-meta-tag">FIELD BRIEF &amp; RESUME DOSSIER</span>
                </div>
                <button
                  onClick={() => setIsProfileModalOpen(false)}
                  className="dossier-close-btn font-mono"
                  aria-label="Close profile dossier modal"
                  title="Close profile dossier (Esc)"
                >
                  <span className="dossier-close-text">CLOSE [ESC]</span>
                  <span className="dossier-close-icon" aria-hidden="true">✕</span>
                </button>
              </div>

              {/* Modal Scrollable Content */}
              <div className="dossier-modal-body">
                <div className="dossier-modal-content">
                  <div className="dossier-title-block">
                    <h3 id="profile-dossier-title" className="dossier-title font-display">
                      Software Developer &amp; Builder.
                    </h3>
                    <p className="dossier-tagline">
                      “Building mobile apps, web extensions, and practical developer tools.”
                    </p>
                  </div>

                  {/* Classification & Identity Matrix */}
                  <div className="dossier-meta-grid font-mono">
                    <div className="dossier-meta-cell">
                      <span className="dossier-label">CREATOR IDENTITY</span>
                      <span className="dossier-nature-badge">TAKI (SYAFIQ ABIYYU TAQI)</span>
                    </div>

                    <div className="dossier-meta-cell">
                      <span className="dossier-label">ACADEMIC AFFILIATION</span>
                      <span className="dossier-team-badge is-individual">
                        CS @ UNIVERSITAS DIPONEGORO
                      </span>
                    </div>

                    <div className="dossier-meta-cell">
                      <span className="dossier-label">CORE FOCUS</span>
                      <span className="dossier-role-value">
                        MOBILE ARCHITECTURE &amp; PRACTICAL TOOLS
                      </span>
                    </div>

                    <div className="dossier-meta-cell">
                      <span className="dossier-label">BASECAMP</span>
                      <span className="dossier-timeline-value">
                        INDONESIA
                      </span>
                    </div>
                  </div>

                  {/* Section 1: Executive Dossier */}
                  <div className="dossier-section">
                    <h4 className="dossier-section-title font-mono">
                      <span className="dossier-sec-num">[01]</span> EXECUTIVE SUMMARY
                    </h4>
                    <p className="profile-dossier-p">
                      Undergraduate Computer Science student at Universitas Diponegoro. I build practical software across mobile apps, browser extensions, and developer tooling. My focus is understanding systems from the ground up, cutting unnecessary bloat, and making tools that just work.
                    </p>
                  </div>

                  {/* Section 2: Background & Selected Work */}
                  <div className="dossier-section">
                    <h4 className="dossier-section-title font-mono">
                      <span className="dossier-sec-num">[02]</span> BACKGROUND &amp; SELECTED WORK
                    </h4>
                    <p className="profile-dossier-p">
                      Experienced in mobile architecture with Flutter (Lapor FSM at UP2TI Undip, NoteCraft musical education game, and DipoFeed offline-first cattle feed calculator with FPP Undip and ACIAR). Built AI computer vision web solutions at DBS Foundation Coding Camp (AWARE), as well as open developer extensions like XHTML Reader Previewer and Kagu Voice AI (BYOK).
                    </p>
                  </div>

                  {/* Section 3: Etymology & Philosophy */}
                  <div className="dossier-section">
                    <h4 className="dossier-section-title font-mono">
                      <span className="dossier-sec-num">[03]</span> ETYMOLOGY &amp; PHILOSOPHY
                    </h4>
                    <p className="profile-dossier-p">
                      Evolved from the Latin <em>Solivagant</em> (one who wanders alone), condensed into <em>Slvgnt</em>, and forged into <strong>Selvagant</strong> by infusing <strong>Selv</strong> (phonetic resonance with <em>Self</em>). A moniker capturing personal exploration across software craft and conscious learning.
                    </p>
                  </div>

                  {/* Section 4: Expedition Manifesto */}
                  <div className="dossier-section">
                    <h4 className="dossier-section-title font-mono">
                      <span className="dossier-sec-num">[04]</span> EXPEDITION MANIFESTO
                    </h4>
                    <blockquote className="profile-dossier-quote">
                      “Menyusuri daerah yang tak terjamah indra sejarah, tak terjamah pengalaman. Sebagian waktu berusaha, sebagian waktu menyesali keputusan, hingga tersadar bahwa penyesalan itu sia-sia sambil mengingat alasan kita memulainya. Perjalanan ini bukan sekadar tentang sampai di puncak tujuan, melainkan proses memaknai tiap keheningan, rintangan, dan keteguhan batin di sepanjang lintasan tapak.”
                    </blockquote>
                    <cite className="profile-dossier-cite font-mono">
                      — Syafiq Abiyyu Taqi · Catatan Refleksi Eksplorasi
                    </cite>
                  </div>
                </div>
              </div>

              {/* Modal Bottom Actions */}
              <div className="dossier-modal-footer font-mono">
                <div className="dossier-footer-links centered">
                  <a
                    href="https://github.com/TaqiSyafiq"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="dossier-action-btn primary"
                    title="Open Taqi's GitHub Profile"
                  >
                    <span>GITHUB</span>
                    <span aria-hidden="true">↗</span>
                  </a>
                  <a
                    href="https://linkedin.com/in/syafiq-abiyyu-taqi"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="dossier-action-btn secondary"
                    title="Open Taqi's LinkedIn Profile"
                  >
                    <span>LINKEDIN</span>
                    <span aria-hidden="true">↗</span>
                  </a>
                  <button
                    type="button"
                    className="dossier-action-btn secondary dossier-footer-close-btn"
                    onClick={() => setIsProfileModalOpen(false)}
                  >
                    <span>CLOSE</span>
                  </button>
                </div>
              </div>
            </div>
          </div>,
          document.body
        )}
    </section>
  );
};
