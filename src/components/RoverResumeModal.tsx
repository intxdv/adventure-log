import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import './RoverResumeModal.css';

interface RoverResumeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RoverResumeModal: React.FC<RoverResumeModalProps> = ({ isOpen, onClose }) => {
  // Close on Escape key & manage non-intrusive scroll boundaries
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    const handleWheel = (e: WheelEvent) => {
      const target = e.target as HTMLElement | null;
      if (target && target.closest('.rover-modal-body')) {
        return;
      }
      e.preventDefault();
    };

    const handleTouchMove = (e: TouchEvent) => {
      const target = e.target as HTMLElement | null;
      if (target && target.closest('.rover-modal-body')) {
        return;
      }
      e.preventDefault();
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('touchmove', handleTouchMove, { passive: false });

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('touchmove', handleTouchMove);
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
      aria-labelledby="rover-resume-name"
    >
      <div className="rover-modal-container hairline-box">
        {/* Modal Top Bar */}
        <div className="rover-modal-top font-mono">
          <div className="rover-modal-meta">
            <span className="rover-index-badge">[ 01 // RESUME ]</span>
            <span className="rover-meta-sep">//</span>
            <span className="rover-meta-tag">BASE ROVER ATS TEMPLATE</span>
          </div>

          <div className="rover-modal-actions">
            <button
              onClick={onClose}
              className="rover-close-btn cursor-target"
              aria-label="Close resume modal"
              title="Close modal (Esc)"
            >
              <span>CLOSE [ESC]</span>
              <span aria-hidden="true">✕</span>
            </button>
          </div>
        </div>

        {/* Modal Body: Base Rover LaTeX Paper Sheet */}
        <div className="rover-modal-body">
          <article className="rover-sheet">
            {/* Header: Centered Classic Resume Layout */}
            <header className="rover-header">
              <h1 id="rover-resume-name" className="rover-name">
                Syafiq Abiyyu Taqi
              </h1>
              <div className="rover-subtitle">
                Software Developer &amp; Builder
              </div>
              <div className="rover-contact-line">
                <span className="rover-contact-item">
                  Email: <a href="mailto:selvagant@gmail.com">selvagant@gmail.com</a>
                </span>
                <span className="rover-contact-sep" aria-hidden="true">•</span>
                <span className="rover-contact-item">
                  Location: Semarang, Central Java, Indonesia
                </span>
                <span className="rover-contact-sep" aria-hidden="true">•</span>
                <span className="rover-contact-item">
                  LinkedIn: <a href="https://linkedin.com/in/syafiq-abiyyu-taqi" target="_blank" rel="noopener noreferrer">linkedin.com/in/syafiq-abiyyu-taqi</a>
                </span>
                <span className="rover-contact-sep" aria-hidden="true">•</span>
                <span className="rover-contact-item">
                  GitHub: <a href="https://github.com/intxdv" target="_blank" rel="noopener noreferrer">github.com/intxdv</a>
                </span>
              </div>
            </header>

            {/* Section: Education */}
            <section className="rover-section">
              <h2 className="rover-section-title">Education</h2>
              <div className="rover-titlerule" aria-hidden="true"></div>

              <div className="rover-entry">
                <div className="rover-entry-row">
                  <div>
                    <span className="rover-entry-primary">Universitas Diponegoro, Semarang</span>
                    {' '}| <span className="rover-entry-secondary">B.S. in Computer Science</span>
                  </div>
                  <span className="rover-entry-date">2023 &ndash; Present</span>
                </div>
                <ul className="rover-bullets">
                  <li>Cumulative GPA: 3.7+ / 4.00 &bull; Focus: Software Engineering &amp; Mobile Systems</li>
                  <li>Relevant Coursework: Mobile Application Development, Software Architecture, Database Systems, Computer Networks, Operating Systems, Algorithms &amp; Data Structures.</li>
                </ul>
              </div>
            </section>

            {/* Section: Experience */}
            <section className="rover-section">
              <h2 className="rover-section-title">Experience</h2>
              <div className="rover-titlerule" aria-hidden="true"></div>

              {/* UP2TI Undip */}
              <div className="rover-entry">
                <div className="rover-entry-row">
                  <span className="rover-entry-primary">UP2TI Universitas Diponegoro</span>
                  <span className="rover-entry-date">Semarang, Indonesia</span>
                </div>
                <div className="rover-entry-row">
                  <span className="rover-entry-secondary">Mobile Developer (Flutter)</span>
                  <span className="rover-entry-date">Jan &ndash; Mei 2026</span>
                </div>
                <ul className="rover-bullets">
                  <li>Developed <em>Lapor FSM</em>, a mobile incident reporting app connecting campus students and staff directly with maintenance technicians.</li>
                  <li>Built offline-first draft caching and state management so reports submit reliably when campus Wi-Fi drops.</li>
                  <li>Integrated authenticated REST APIs with token management and client-side photo compression.</li>
                </ul>
              </div>

              {/* DipoFeed */}
              <div className="rover-entry">
                <div className="rover-entry-row">
                  <span className="rover-entry-primary">DipoFeed &mdash; FPP Undip &amp; ACIAR</span>
                  <span className="rover-entry-date">Semarang, Indonesia</span>
                </div>
                <div className="rover-entry-row">
                  <span className="rover-entry-secondary">Lead Mobile Developer (Flutter)</span>
                  <span className="rover-entry-date">Mar 2026 &ndash; Present</span>
                </div>
                <ul className="rover-bullets">
                  <li>Engineered an offline feed calculator for smallholder dairy farmers in partnership with the Australian Centre for International Agricultural Research (ACIAR).</li>
                  <li>Implemented client-side least-cost ration balancing algorithms without needing an internet connection.</li>
                  <li>Designed high-contrast screens and large touch targets for outdoor sunlight visibility and one-handed use.</li>
                </ul>
              </div>

              {/* DBS Foundation */}
              <div className="rover-entry">
                <div className="rover-entry-row">
                  <span className="rover-entry-primary">DBS Foundation Coding Camp</span>
                  <span className="rover-entry-date">Remote</span>
                </div>
                <div className="rover-entry-row">
                  <span className="rover-entry-secondary">Front-End &amp; Machine Learning Cohort (AWARE)</span>
                  <span className="rover-entry-date">Apr &ndash; Jun 2026</span>
                </div>
                <ul className="rover-bullets">
                  <li>Built an accessible computer vision web app for municipal waste categorization.</li>
                  <li>Integrated browser camera inference workflows with a responsive, lightweight user flow.</li>
                </ul>
              </div>
            </section>

            {/* Section: Selected Projects */}
            <section className="rover-section">
              <h2 className="rover-section-title">Selected Projects</h2>
              <div className="rover-titlerule" aria-hidden="true"></div>

              {/* XHTML Reader */}
              <div className="rover-entry">
                <div className="rover-entry-row">
                  <div>
                    <span className="rover-entry-primary">XHTML Reader Previewer</span>
                    {' '}| <a href="https://github.com/intxdv/XHTML-Reader-Previewer" target="_blank" rel="noopener noreferrer" className="rover-entry-link">github.com/intxdv/XHTML-Reader-Previewer</a>
                  </div>
                  <span className="rover-entry-date">Nov 2026 &ndash; Present</span>
                </div>
                <ul className="rover-bullets">
                  <li>Authored an open-source VS Code and Antigravity extension for instant EPUB and XHTML publication previewing.</li>
                  <li>Built two reading modes: continuous vertical scroll and paginated multi-column book layout with live TOC navigation.</li>
                  <li>Handled in-memory ZIP extraction and anchored footnote popovers with zero external runtime dependencies.</li>
                </ul>
              </div>

              {/* NoteCraft */}
              <div className="rover-entry">
                <div className="rover-entry-row">
                  <div>
                    <span className="rover-entry-primary">NoteCraft</span>
                    {' '}| <span className="rover-entry-secondary">Interactive Music Education Mobile Game</span>
                  </div>
                  <span className="rover-entry-date">Mar 2026</span>
                </div>
                <ul className="rover-bullets">
                  <li>Developed an interactive Flutter music education game with real-time pitch feedback and rhythm drills.</li>
                  <li>Engineered a low-latency audio synthesis pipeline for fast sound response across Android devices.</li>
                </ul>
              </div>

              {/* Kagu Voice AI */}
              <div className="rover-entry">
                <div className="rover-entry-row">
                  <div>
                    <span className="rover-entry-primary">Kagu Voice AI</span>
                    {' '}| <span className="rover-entry-secondary">BYOK Browser Voice Assistant Extension</span>
                  </div>
                  <span className="rover-entry-date">Agu &ndash; Sep 2026</span>
                </div>
                <ul className="rover-bullets">
                  <li>Created a lightweight browser extension with Bring-Your-Own-Key (BYOK) architecture for Gemini Live and OpenAI Whisper APIs.</li>
                  <li>Built voice-to-text input with live transcription and on-device API key storage.</li>
                </ul>
              </div>
            </section>

            {/* Section: Skills & Interests */}
            <section className="rover-section">
              <h2 className="rover-section-title">Technical Skills &amp; Interests</h2>
              <div className="rover-titlerule" aria-hidden="true"></div>

              <div className="rover-skill-line">
                <span className="rover-skill-label">Languages:</span>
                <span>Dart, TypeScript, JavaScript, HTML5/CSS3, Python, Node.js</span>
              </div>
              <div className="rover-skill-line">
                <span className="rover-skill-label">Frameworks &amp; Tooling:</span>
                <span>Flutter, React, Vite, WXT (Web Extensions), VS Code Extension API, Git, Linux, Hive, SQLite, REST APIs</span>
              </div>
              <div className="rover-skill-line">
                <span className="rover-skill-label">Architecture:</span>
                <span>Clean Architecture, Offline-First Systems, State Management (BLoC / Provider), Progressive Web Apps</span>
              </div>
              <div className="rover-skill-line">
                <span className="rover-skill-label">Spoken Languages:</span>
                <span>Indonesian (Native), English (Professional Working Proficiency)</span>
              </div>
            </section>
          </article>
        </div>

        {/* Modal Bottom Bar */}
        <div className="rover-modal-footer">
          <div className="rover-footer-links">
            <a
              href="https://github.com/intxdv"
              target="_blank"
              rel="noopener noreferrer"
              className="rover-footer-link-btn"
            >
              <span>GITHUB</span>
              <span aria-hidden="true">↗</span>
            </a>
            <a
              href="https://linkedin.com/in/syafiq-abiyyu-taqi"
              target="_blank"
              rel="noopener noreferrer"
              className="rover-footer-link-btn"
            >
              <span>LINKEDIN</span>
              <span aria-hidden="true">↗</span>
            </a>
          </div>
          <div className="rover-footer-actions">
            <a
              href="/resume-syafiq-abiyyu-taqi.pdf"
              download="Resume_Syafiq_Abiyyu_Taqi.pdf"
              className="rover-download-btn cursor-target"
              title="Download ATS Resume as PDF"
            >
              <span className="rover-download-icon" aria-hidden="true">⤓</span>
              <span>DOWNLOAD PDF</span>
            </a>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};
