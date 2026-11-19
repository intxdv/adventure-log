import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';

export interface ProfileDossierModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ProfileDossierModal: React.FC<ProfileDossierModalProps> = ({ isOpen, onClose }) => {
  // Prevent background scroll and handle Escape key without touching html/body overflow (which breaks sticky positioning)
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    const preventBackgroundScroll = (e: WheelEvent | TouchEvent) => {
      const target = e.target as HTMLElement | null;
      if (target && target.closest('.dossier-modal-body')) {
        return;
      }
      e.preventDefault();
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('wheel', preventBackgroundScroll, { passive: false });
    window.addEventListener('touchmove', preventBackgroundScroll, { passive: false });

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('wheel', preventBackgroundScroll);
      window.removeEventListener('touchmove', preventBackgroundScroll);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return createPortal(
    <div
      className="dossier-modal-backdrop is-stacked"
      onWheel={(e) => e.stopPropagation()}
      onTouchMove={(e) => {
        if (e.target === e.currentTarget) e.preventDefault();
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
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
            onClick={onClose}
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
                  CS @ UNIVERSITAS DIPONEGORO (GPA 3.8/4.0)
                </span>
              </div>

              <div className="dossier-meta-cell">
                <span className="dossier-label">CORE FOCUS</span>
                <span className="dossier-role-value">
                  MOBILE ENGINEERING &amp; PRACTICAL TOOLS
                </span>
              </div>

              <div className="dossier-meta-cell">
                <span className="dossier-label">BASECAMP</span>
                <span className="dossier-timeline-value">
                  SEMARANG, INDONESIA
                </span>
              </div>
            </div>

            {/* Section 1: Executive Dossier */}
            <div className="dossier-section">
              <h4 className="dossier-section-title font-mono">
                <span className="dossier-sec-num">[01]</span> EXECUTIVE SUMMARY
              </h4>
              <p className="profile-dossier-p">
                Computer Science student at Universitas Diponegoro and software developer focused on mobile engineering (Flutter/Dart), web extensions, and developer tooling. Experienced in building offline-first systems, clean state architectures, and practical tools that solve real operational problems.
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
              href="/resume-syafiq-abiyyu-taqi.pdf"
              download="Resume_Syafiq_Abiyyu_Taqi.pdf"
              className="dossier-action-btn primary"
              title="Download Base Rover ATS Resume as PDF"
            >
              <span aria-hidden="true">⤓</span>
              <span>DOWNLOAD PDF</span>
            </a>
            <a
              href="mailto:selvagant@gmail.com"
              className="dossier-action-btn secondary"
              title="Send email to selvagant@gmail.com"
            >
              <span>EMAIL</span>
              <span aria-hidden="true">↗</span>
            </a>
            <a
              href="https://github.com/intxdv"
              target="_blank"
              rel="noopener noreferrer"
              className="dossier-action-btn secondary"
              title="Open GitHub Profile"
            >
              <span>GITHUB</span>
              <span aria-hidden="true">↗</span>
            </a>
            <a
              href="https://linkedin.com/in/syafiq-abiyyu-taqi"
              target="_blank"
              rel="noopener noreferrer"
              className="dossier-action-btn secondary"
              title="Open LinkedIn Profile"
            >
              <span>LINKEDIN</span>
              <span aria-hidden="true">↗</span>
            </a>
            <button
              type="button"
              className="dossier-action-btn secondary dossier-footer-close-btn"
              onClick={onClose}
              title="Close modal (Esc)"
            >
              <span>CLOSE [ESC]</span>
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};
