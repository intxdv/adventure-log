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
            <span className="dossier-index-badge">[ 01 // RESUME ]</span>
            <span className="dossier-meta-sep">//</span>
            <span className="dossier-meta-tag">CURRICULUM VITAE &amp; FIELD DOSSIER</span>
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
              <h3 id="profile-dossier-title" className="dossier-title profile-dossier-main-title font-display">
                Software Developer &amp; Builder.
              </h3>
            </div>

            {/* Architectural Spec Strip (Refined Key-Value Matrix) */}
            <div className="dossier-spec-strip font-mono">
              <div className="dossier-spec-item">
                <span className="dossier-spec-label">IDENTITY</span>
                <span className="dossier-spec-val">Syafiq Abiyyu Taqi (Taki)</span>
              </div>
              <div className="dossier-spec-item">
                <span className="dossier-spec-label">EDUCATION</span>
                <span className="dossier-spec-val">CS @ Universitas Diponegoro (GPA 3.8)</span>
              </div>
              <div className="dossier-spec-item">
                <span className="dossier-spec-label">FOCUS</span>
                <span className="dossier-spec-val">Fullstack, Applied AI, &amp; Dev Tools</span>
              </div>
              <div className="dossier-spec-item">
                <span className="dossier-spec-label">LOCATION</span>
                <span className="dossier-spec-val">Semarang, Central Java, ID</span>
              </div>
            </div>

            {/* Section 1: Professional Summary */}
            <div className="dossier-section">
              <h4 className="dossier-section-title font-mono">
                <span className="dossier-sec-num">[01]</span> PROFESSIONAL SUMMARY
              </h4>
              <p className="profile-dossier-p">
                Computer Science student at Universitas Diponegoro and software developer working across <strong>fullstack web</strong>, <strong>applied AI</strong>, and <strong>developer tools</strong>, with practical mobile development experience in <strong>Flutter and Dart</strong>. Builds clean client-server architectures, offline-first mobile systems, and developer extensions.
              </p>
            </div>

            {/* Section 2: Education */}
            <div className="dossier-section">
              <h4 className="dossier-section-title font-mono">
                <span className="dossier-sec-num">[02]</span> EDUCATION
              </h4>
              <div className="dossier-cv-entry">
                <div className="dossier-cv-row">
                  <span className="dossier-cv-title">Universitas Diponegoro</span>
                  <span className="dossier-cv-meta">Semarang, Indonesia</span>
                </div>
                <div className="dossier-cv-row">
                  <span className="dossier-cv-subtitle">Bachelor Degree in Computer Science · Cumulative GPA: 3.8/4.0</span>
                  <span className="dossier-cv-meta">2023 &ndash; Present</span>
                </div>
                <ul className="dossier-cv-bullets">
                  <li className="dossier-cv-bullet">
                    <span className="dossier-cv-bullet-marker" aria-hidden="true">✦</span>
                    <span>Relevant Coursework: Mobile Application Development, Software Architecture, Database Systems, Computer Networks, Operating Systems, Algorithms &amp; Data Structures.</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Section 3: Work Experience */}
            <div className="dossier-section">
              <h4 className="dossier-section-title font-mono">
                <span className="dossier-sec-num">[03]</span> EXPERIENCE
              </h4>

              <div className="dossier-cv-entry">
                <div className="dossier-cv-row">
                  <span className="dossier-cv-title">UP2TI Universitas Diponegoro</span>
                  <span className="dossier-cv-meta">Semarang, Indonesia</span>
                </div>
                <div className="dossier-cv-row">
                  <span className="dossier-cv-subtitle">Mobile Developer (Flutter)</span>
                  <span className="dossier-cv-meta">Jan &ndash; May 2026</span>
                </div>
                <ul className="dossier-cv-bullets">
                  <li className="dossier-cv-bullet">
                    <span className="dossier-cv-bullet-marker" aria-hidden="true">✦</span>
                    <span>Built <em>Lapor FSM</em>, a mobile incident reporting app for students and campus staff to submit facility repair tickets directly to maintenance teams.</span>
                  </li>
                  <li className="dossier-cv-bullet">
                    <span className="dossier-cv-bullet-marker" aria-hidden="true">✦</span>
                    <span>Implemented offline draft caching and local state management so reports submit reliably when campus Wi-Fi drops.</span>
                  </li>
                  <li className="dossier-cv-bullet">
                    <span className="dossier-cv-bullet-marker" aria-hidden="true">✦</span>
                    <span>Integrated authenticated REST APIs with token refresh handling and client-side photo compression.</span>
                  </li>
                </ul>
              </div>

              <div className="dossier-cv-entry">
                <div className="dossier-cv-row">
                  <span className="dossier-cv-title">DipoFeed (FPP Undip &amp; ACIAR)</span>
                  <span className="dossier-cv-meta">Semarang, Indonesia</span>
                </div>
                <div className="dossier-cv-row">
                  <span className="dossier-cv-subtitle">Mobile Developer (Flutter)</span>
                  <span className="dossier-cv-meta">Mar 2026 &ndash; Present</span>
                </div>
                <ul className="dossier-cv-bullets">
                  <li className="dossier-cv-bullet">
                    <span className="dossier-cv-bullet-marker" aria-hidden="true">✦</span>
                    <span>Built an offline mobile feed calculator for smallholder dairy farmers in Central Java, in partnership with the Australian Centre for International Agricultural Research (ACIAR).</span>
                  </li>
                  <li className="dossier-cv-bullet">
                    <span className="dossier-cv-bullet-marker" aria-hidden="true">✦</span>
                    <span>Implemented cattle feed formulation algorithms using local forage nutritional data, running calculations entirely on-device.</span>
                  </li>
                  <li className="dossier-cv-bullet">
                    <span className="dossier-cv-bullet-marker" aria-hidden="true">✦</span>
                    <span>Designed high-contrast layouts and large touch targets for outdoor sunlight visibility and one-handed field use.</span>
                  </li>
                </ul>
              </div>

              <div className="dossier-cv-entry">
                <div className="dossier-cv-row">
                  <span className="dossier-cv-title">DBS Foundation Coding Camp</span>
                  <span className="dossier-cv-meta">Remote</span>
                </div>
                <div className="dossier-cv-row">
                  <span className="dossier-cv-subtitle">Front-End &amp; Machine Learning Cohort (AWARE)</span>
                  <span className="dossier-cv-meta">Apr &ndash; Jun 2026</span>
                </div>
                <ul className="dossier-cv-bullets">
                  <li className="dossier-cv-bullet">
                    <span className="dossier-cv-bullet-marker" aria-hidden="true">✦</span>
                    <span>Built a computer vision fatigue screening tool using MediaPipe facial landmarks to track eye (EAR) and mouth (MAR) aspect ratios in real time.</span>
                  </li>
                  <li className="dossier-cv-bullet">
                    <span className="dossier-cv-bullet-marker" aria-hidden="true">✦</span>
                    <span>Ran browser webcam inference with a responsive interface to flag signs of worker drowsiness in under 30 seconds.</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Section 4: Selected Projects */}
            <div className="dossier-section">
              <h4 className="dossier-section-title font-mono">
                <span className="dossier-sec-num">[04]</span> SELECTED PROJECTS
              </h4>

              <div className="dossier-cv-entry">
                <div className="dossier-cv-row">
                  <span className="dossier-cv-title">XHTML Reader Previewer</span>
                  <span className="dossier-cv-meta">Nov 2026 &ndash; Present</span>
                </div>
                <div className="dossier-cv-row">
                  <span className="dossier-cv-subtitle">VS Code &amp; Antigravity Extension</span>
                  <span className="dossier-cv-meta">Open Source</span>
                </div>
                <ul className="dossier-cv-bullets">
                  <li className="dossier-cv-bullet">
                    <span className="dossier-cv-bullet-marker" aria-hidden="true">✦</span>
                    <span>Created an open-source VS Code and Antigravity extension to preview EPUB and XHTML publications directly inside the editor.</span>
                  </li>
                  <li className="dossier-cv-bullet">
                    <span className="dossier-cv-bullet-marker" aria-hidden="true">✦</span>
                    <span>Built continuous vertical scroll and paginated multi-column reading modes with a live table of contents drawer.</span>
                  </li>
                  <li className="dossier-cv-bullet">
                    <span className="dossier-cv-bullet-marker" aria-hidden="true">✦</span>
                    <span>Handled in-memory ZIP extraction with JSZip and anchored footnote popovers with zero runtime dependencies.</span>
                  </li>
                </ul>
              </div>

              <div className="dossier-cv-entry">
                <div className="dossier-cv-row">
                  <span className="dossier-cv-title">NoteCraft</span>
                  <span className="dossier-cv-meta">Mar 2026</span>
                </div>
                <div className="dossier-cv-row">
                  <span className="dossier-cv-subtitle">Interactive Music Education Mobile Game</span>
                  <span className="dossier-cv-meta">Android</span>
                </div>
                <ul className="dossier-cv-bullets">
                  <li className="dossier-cv-bullet">
                    <span className="dossier-cv-bullet-marker" aria-hidden="true">✦</span>
                    <span>Developed a Flutter mobile game for ear training with pitch recognition drills and interactive rhythm exercises.</span>
                  </li>
                  <li className="dossier-cv-bullet">
                    <span className="dossier-cv-bullet-marker" aria-hidden="true">✦</span>
                    <span>Implemented low-latency audio playback and touch handling for responsive note feedback across Android devices.</span>
                  </li>
                </ul>
              </div>

              <div className="dossier-cv-entry">
                <div className="dossier-cv-row">
                  <span className="dossier-cv-title">Kagu Voice AI</span>
                  <span className="dossier-cv-meta">Aug &ndash; Sep 2026</span>
                </div>
                <div className="dossier-cv-row">
                  <span className="dossier-cv-subtitle">BYOK Browser Voice Assistant Extension</span>
                  <span className="dossier-cv-meta">Chrome &amp; Edge</span>
                </div>
                <ul className="dossier-cv-bullets">
                  <li className="dossier-cv-bullet">
                    <span className="dossier-cv-bullet-marker" aria-hidden="true">✦</span>
                    <span>Built a Chromium browser extension using WXT with a Bring-Your-Own-Key (BYOK) architecture for Gemini Live and OpenAI Whisper APIs.</span>
                  </li>
                  <li className="dossier-cv-bullet">
                    <span className="dossier-cv-bullet-marker" aria-hidden="true">✦</span>
                    <span>Supported voice-to-text transcription directly into active web fields while keeping API keys stored locally in the browser.</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Section 5: Technical Skills */}
            <div className="dossier-section">
              <h4 className="dossier-section-title font-mono">
                <span className="dossier-sec-num">[05]</span> TECHNICAL SKILLS &amp; CAPABILITIES
              </h4>
              <ul className="dossier-cv-bullets font-mono" style={{ fontSize: '0.8rem' }}>
                <li className="dossier-cv-bullet">
                  <span className="dossier-cv-bullet-marker" aria-hidden="true">✦</span>
                  <div><strong>LANGUAGES:</strong> TypeScript, Dart, Python, JavaScript, HTML5/CSS3, SQL</div>
                </li>
                <li className="dossier-cv-bullet">
                  <span className="dossier-cv-bullet-marker" aria-hidden="true">✦</span>
                  <div><strong>FRAMEWORKS &amp; TOOLS:</strong> Flutter, React 19, Vite, Elysia (Bun), PostgreSQL, SQLite, WXT (Web Extensions), VS Code Extension API, MediaPipe, GSAP, REST APIs, Git</div>
                </li>
                <li className="dossier-cv-bullet">
                  <span className="dossier-cv-bullet-marker" aria-hidden="true">✦</span>
                  <div><strong>ARCHITECTURE:</strong> Clean Architecture, Offline-First Systems, Client-Server Architecture, State Management (BLoC / Riverpod / React Hooks)</div>
                </li>
                <li className="dossier-cv-bullet">
                  <span className="dossier-cv-bullet-marker" aria-hidden="true">✦</span>
                  <div><strong>SPOKEN LANGUAGES:</strong> Indonesian (Native), English (Professional Working Proficiency)</div>
                </li>
              </ul>
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
