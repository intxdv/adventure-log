import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import './About.css';

export const About: React.FC = () => {
  const [hasImageError, setHasImageError] = useState(false);
  const [isNoteOpen, setIsNoteOpen] = useState(false);
  const [isManifestoOpen, setIsManifestoOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  // Lock background scroll when profile modal is open without breaking position:sticky on ancestors
  useEffect(() => {
    if (isProfileModalOpen) {
      const originalBodyOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';

      const preventBackgroundScroll = (e: WheelEvent | TouchEvent) => {
        const target = e.target as HTMLElement | null;
        if (target && target.closest('.dossier-modal-body')) {
          return;
        }
        e.preventDefault();
      };

      window.addEventListener('wheel', preventBackgroundScroll, { passive: false });
      window.addEventListener('touchmove', preventBackgroundScroll, { passive: false });

      return () => {
        document.body.style.overflow = originalBodyOverflow;
        window.removeEventListener('wheel', preventBackgroundScroll);
        window.removeEventListener('touchmove', preventBackgroundScroll);
      };
    }
  }, [isProfileModalOpen]);

  // Close modal on Escape key and handle outside clicks for popovers
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsProfileModalOpen(false);
        setIsNoteOpen(false);
        setIsManifestoOpen(false);
      }
    };

    const handleDocumentClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;
      if (isNoteOpen && !target.closest('.field-zine-logo-badge')) {
        setIsNoteOpen(false);
      }
      if (isManifestoOpen && !target.closest('.field-zine-quote-trigger')) {
        setIsManifestoOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('click', handleDocumentClick);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('click', handleDocumentClick);
    };
  }, [isNoteOpen, isManifestoOpen]);

  const toggleNote = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsNoteOpen((prev) => !prev);
    setIsManifestoOpen(false);
  };

  const toggleManifesto = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsManifestoOpen((prev) => !prev);
    setIsNoteOpen(false);
  };

  const handleMouseEnter = () => {
    if (typeof window !== 'undefined' && window.matchMedia('(hover: hover)').matches) {
      setIsNoteOpen(true);
    }
  };

  const handleMouseLeave = () => {
    if (typeof window !== 'undefined' && window.matchMedia('(hover: hover)').matches) {
      setIsNoteOpen(false);
    }
  };

  const handleManifestoEnter = () => {
    if (typeof window !== 'undefined' && window.matchMedia('(hover: hover)').matches) {
      setIsManifestoOpen(true);
    }
  };

  const handleManifestoLeave = () => {
    if (typeof window !== 'undefined' && window.matchMedia('(hover: hover)').matches) {
      setIsManifestoOpen(false);
    }
  };

  return (
    <section
      id="about"
      className="about-section is-nocturne"
      aria-labelledby="about-heading"
    >
      <div className="about-container about-grid">
        
        {/* Left Column: Zine-Style Card Frame (Reference-Inspired) */}
        <div className="field-card-wrapper">
          <figure
            id="field-zine-card-elem"
            className="field-zine-card"
            aria-label="Portrait: Syafiq Abiyyu Taqi"
          >
            <div className="field-zine-frame">
              <div className="field-zine-img-viewport">
                {!hasImageError ? (
                  <img
                    id="field-zine-portrait-img"
                    src="/images/taki-portrait.jpg"
                    alt="Syafiq Abiyyu Taqi (Taki / Selvagant) resting in nature foliage"
                    className="field-zine-img"
                    width={1080}
                    height={1080}
                    loading="eager"
                    decoding="async"
                    onError={() => setHasImageError(true)}
                  />
                ) : (
                  <div className="field-dossier-fallback">
                    <div className="field-dossier-reticle font-mono">FIELD</div>
                    <div style={{ fontWeight: 700, fontSize: 'var(--text-base)', color: 'var(--color-ink)' }}>
                      TAKI
                    </div>
                    <div className="font-mono" style={{ fontSize: 'var(--text-xs)', color: 'var(--color-olive)', marginTop: '4px' }}>
                      Syafiq Abiyyu Taqi
                    </div>
                  </div>
                )}
              </div>

              {/* Selvagant Emblem Logo in Top-Right Corner (Frameless directly on photo) */}
              <div
                className={`field-zine-logo-badge cursor-target ${isNoteOpen ? 'is-expanded' : ''}`}
                tabIndex={0}
                role="button"
                data-hover-reveal="etymology-popover"
                aria-label="Selvagant Moniker & Etymology - Hover or tap to view note"
                aria-expanded={isNoteOpen}
                onClick={toggleNote}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    toggleNote(e as unknown as React.MouseEvent);
                  } else if (e.key === 'Escape') {
                    setIsNoteOpen(false);
                  }
                }}
              >
                <img
                  src="/logo/Logo SVG/Logo-white.svg"
                  alt="Selvagant Logo Emblem"
                  className="field-zine-logo-img"
                  width={72}
                  height={42}
                />

                {/* Floating Etymology Note Popover with Official Logo + Text SVG */}
                <div
                  className="field-zine-note-popover"
                  role="tooltip"
                  aria-hidden={!isNoteOpen}
                >
                  <div className="field-zine-note-brand">
                    <img
                      src="/logo/Logo SVG/Logo-text-white.svg"
                      alt="SELVAGANT"
                      className="field-zine-note-brand-svg"
                      width={160}
                      height={24}
                    />
                    <span className="field-zine-note-tag font-mono">// ETYMOLOGY</span>
                  </div>
                  <div className="field-zine-note-header font-mono">
                    <span>THE WANDERING <span className="selvagant-selv-accent">Selv</span></span>
                  </div>
                  <p className="field-zine-note-body font-mono">
                    Evolved from the Latin <em>Solivagant</em> (one who wanders alone), condensed into <em>Slvgnt</em>, and ultimately forged into <strong>Selvagant</strong> by infusing <strong>Selv</strong>—a deliberate phonetic resonance with <em>Self</em>. A moniker capturing a solitary expedition across software craft, architecture, and conscious self-discovery.
                  </p>
                </div>
              </div>
            </div>

            <figcaption className="field-zine-footer">
              <div className="field-zine-identity">
                <span className="field-zine-callname">TAKI</span>
                <span className="field-zine-fullname">Syafiq Abiyyu Taqi</span>
              </div>
              <div
                className={`field-zine-quote-trigger cursor-target ${isManifestoOpen ? 'is-active' : ''}`}
                tabIndex={0}
                role="button"
                data-hover-reveal="manifesto-popover"
                aria-label="Refleksi filosofis eksplorasi Taki"
                aria-expanded={isManifestoOpen}
                onClick={toggleManifesto}
                onMouseEnter={handleManifestoEnter}
                onMouseLeave={handleManifestoLeave}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    toggleManifesto(e as unknown as React.MouseEvent);
                  }
                }}
              >
                <p className="field-zine-quote">
                  “karena kita terlalu berharga untuk disia-siakan.”
                </p>

                {/* Tactical Dossier Manifesto Popover (Revealed on hover/tap) */}
                <div
                  className="field-zine-manifesto-popover"
                  role="tooltip"
                  aria-hidden={!isManifestoOpen}
                >
                  <div className="manifesto-popover-header font-mono">
                    <span className="manifesto-popover-tag">[ EXPEDITION MANIFESTO // FIELD LOG ]</span>
                  </div>
                  <p className="manifesto-popover-text font-display">
                    “Menyusuri daerah yang tak terjamah indra sejarah, tak terjamah pengalaman. Sebagian waktu berusaha, sebagian waktu menyesali keputusan—hingga tersadar bahwa penyesalan itu sia-sia sambil mengingat alasan berjuang—dan membawa pulang sesuatu dari wilayah eksplorasi sambil berpikir, <em>‘Ternyata tak seburuk itu.’</em>”
                  </p>
                  <cite className="manifesto-popover-cite font-mono">
                    — Syafiq Abiyyu Taqi · Catatan Refleksi Eksplorasi
                  </cite>
                </div>
              </div>
            </figcaption>
          </figure>
        </div>

        {/* Editorial Storytelling & Manifesto */}
        <article className="about-article">
          <header>
            <div className="about-kicker">
              <button
                type="button"
                className="about-field-brief-btn font-mono cursor-target"
                onClick={() => setIsProfileModalOpen(true)}
                aria-label="Open full Field Brief Profile Dossier"
                title="Open full Field Brief Profile Dossier"
              >
                <span>FIELD BRIEF // 01 · PROFILE</span>
                <span className="about-btn-arrow" aria-hidden="true">↗</span>
              </button>
            </div>
            
            <h2 id="about-heading" className="about-headline font-display">
              <span className="about-word">Creative</span>{' '}
              <span className="about-word">Developer</span>{' '}
              <span className="about-word">&amp;</span>{' '}
              <span className="about-word">Mobile</span>{' '}
              <span className="about-word">Architect<span style={{ color: 'var(--color-olive)' }}>.</span></span>
            </h2>
          </header>

          <p className="about-lead">
            <span className="about-word">Undergraduate</span>{' '}
            <span className="about-word">Computer</span>{' '}
            <span className="about-word">Science</span>{' '}
            <span className="about-word">student</span>{' '}
            <span className="about-word">at</span>{' '}
            <span className="about-word">Universitas</span>{' '}
            <span className="about-word">Diponegoro</span>{' '}
            <span className="about-word">specializing</span>{' '}
            <span className="about-word">in</span>{' '}
            <span className="about-word">Software</span>{' '}
            <span className="about-word">Engineering.</span>{' '}
            <span className="about-word">I</span>{' '}
            <span className="about-word">build</span>{' '}
            <span className="about-word">resilient</span>{' '}
            <span className="about-word">mobile</span>{' '}
            <span className="about-word">architectures</span>{' '}
            <span className="about-word">and</span>{' '}
            <span className="about-word">tactile</span>{' '}
            <span className="about-word">web</span>{' '}
            <span className="about-word">environments</span>{' '}
            <span className="about-word">where</span>{' '}
            <span className="about-word">engineering</span>{' '}
            <span className="about-word">rigor</span>{' '}
            <span className="about-word">meets</span>{' '}
            <span className="about-word">calm</span>{' '}
            <span className="about-word">editorial</span>{' '}
            <span className="about-word">aesthetics.</span>
          </p>

          <p className="about-body">
            <span className="about-word">From</span>{' '}
            <span className="about-word">architecting</span>{' '}
            <span className="about-word">mobile</span>{' '}
            <span className="about-word">solutions</span>{' '}
            <span className="about-word">at</span>{' '}
            <span className="about-word">UPPTI</span>{' '}
            <span className="about-word">Undip</span>{' '}
            <span className="about-word">to</span>{' '}
            <span className="about-word">leading</span>{' '}
            <span className="about-word">community</span>{' '}
            <span className="about-word">initiatives</span>{' '}
            <span className="about-word">at</span>{' '}
            <span className="about-word">DIGIT</span>{' '}
            <span className="about-word">and</span>{' '}
            <span className="about-word">MADANI,</span>{' '}
            <span className="about-word">every</span>{' '}
            <span className="about-word">interface</span>{' '}
            <span className="about-word">is</span>{' '}
            <span className="about-word">approached</span>{' '}
            <span className="about-word">as</span>{' '}
            <span className="about-word">a</span>{' '}
            <span className="about-word">deliberate</span>{' '}
            <span className="about-word">expedition:</span>{' '}
            <span className="about-word">eliminating</span>{' '}
            <span className="about-word">unnecessary</span>{' '}
            <span className="about-word">noise,</span>{' '}
            <span className="about-word">establishing</span>{' '}
            <span className="about-word">structural</span>{' '}
            <span className="about-word">clarity,</span>{' '}
            <span className="about-word">and</span>{' '}
            <span className="about-word">honoring</span>{' '}
            <span className="about-word">the</span>{' '}
            <span className="about-word">craft.</span>
          </p>
        </article>

      </div>

      {/* Tactical Profile Field Brief Dossier Pop-up Modal */}
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
                  <span className="dossier-meta-tag">FIELD BRIEF &amp; ARCHITECTURAL DOSSIER</span>
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
                      Creative Developer &amp; Mobile Architect.
                    </h3>
                    <p className="dossier-tagline">
                      “Bridging analytical software engineering with tactile digital systems and organic exploration.”
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
                        MOBILE ARCHITECTURE &amp; TACTILE WEB
                      </span>
                    </div>

                    <div className="dossier-meta-cell">
                      <span className="dossier-label">BASECAMP</span>
                      <span className="dossier-timeline-value">
                        CENTRAL JAVA, INDONESIA
                      </span>
                    </div>
                  </div>

                  {/* Section 1: Executive Dossier */}
                  <div className="dossier-section">
                    <h4 className="dossier-section-title font-mono">
                      <span className="dossier-sec-num">[01]</span> EXECUTIVE DOSSIER
                    </h4>
                    <p className="profile-dossier-p">
                      Undergraduate Computer Science student at Universitas Diponegoro specializing in Software Engineering.
                      I build resilient mobile architectures and tactile web environments where engineering rigor meets calm editorial aesthetics.
                    </p>
                  </div>

                  {/* Section 2: Background & Community Initiatives */}
                  <div className="dossier-section">
                    <h4 className="dossier-section-title font-mono">
                      <span className="dossier-sec-num">[02]</span> BACKGROUND &amp; COMMUNITY INITIATIVES
                    </h4>
                    <p className="profile-dossier-p">
                      From architecting mobile solutions at UPPTI Undip to leading community initiatives at DIGIT and MADANI,
                      every interface is approached as a deliberate expedition: eliminating unnecessary noise, establishing structural clarity,
                      and honoring the craft.
                    </p>
                  </div>

                  {/* Section 3: Etymology & Philosophy */}
                  <div className="dossier-section">
                    <h4 className="dossier-section-title font-mono">
                      <span className="dossier-sec-num">[03]</span> ETYMOLOGY &amp; PHILOSOPHY
                    </h4>
                    <p className="profile-dossier-p">
                      Evolved from the Latin <em>Solivagant</em> (one who wanders alone), condensed into <em>Slvgnt</em>,
                      and ultimately forged into <strong>Selvagant</strong> by infusing <strong>Selv–</strong>—a deliberate phonetic resonance with <em>Self</em>.
                      A moniker capturing a solitary expedition across software craft, architecture, and conscious self-discovery.
                    </p>
                  </div>

                  {/* Section 4: Expedition Manifesto */}
                  <div className="dossier-section">
                    <h4 className="dossier-section-title font-mono">
                      <span className="dossier-sec-num">[04]</span> EXPEDITION MANIFESTO
                    </h4>
                    <blockquote className="profile-dossier-quote">
                      “Menyusuri daerah yang tak terjamah indra sejarah, tak terjamah pengalaman.
                      Sebagian waktu berusaha, sebagian waktu menyesali keputusan—hingga tersadar bahwa
                      penyesalan itu sia-sia sambil mengingat alasan kita memulainya. Perjalanan ini bukan sekadar
                      tentang sampai di puncak tujuan, melainkan proses memaknai tiap keheningan, rintangan, dan
                      keteguhan batin di sepanjang lintasan tapak.”
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
