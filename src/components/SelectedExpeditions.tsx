import React, { useState, useEffect } from 'react';
import { initialExpeditions } from '../data/expeditions';
import type { Expedition } from '../types';
import './SelectedExpeditions.css';

// 4 Top Featured Expeditions for 3D Corridor Fly-Through
const FEATURED_EXPEDITIONS = initialExpeditions.filter((exp) => exp.featured).slice(0, 4);

export const SelectedExpeditions: React.FC = () => {
  const [activeDossier, setActiveDossier] = useState<Expedition | null>(null);
  const [isRepoModalOpen, setIsRepoModalOpen] = useState<boolean>(false);

  // Close modal on Escape key and lock body scroll
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setActiveDossier(null);
        setIsRepoModalOpen(false);
      }
    };

    if (activeDossier || isRepoModalOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [activeDossier, isRepoModalOpen]);

  return (
    <section
      id="expeditions"
      className="expeditions-perspective-stage"
      aria-label="Selected Expeditions: 3D Camera Obscura Room & Corridor"
    >
      {/* 1. Tactical SVG Perspective Wireframe Grid (Connecting Card to Viewport Corners) */}
      <svg
        className="expeditions-perspective-grid-svg"
        viewBox="0 0 1920 1080"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="grid-ray-fade" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="rgba(163, 186, 153, 0.45)" />
            <stop offset="100%" stopColor="rgba(255, 255, 255, 0.08)" />
          </linearGradient>
        </defs>

        {/* 4 Corner Rays shooting from Photo Card (~20% X, 25% to 75% Y) to Viewport Corners */}
        {/* Top-Left Ray */}
        <line
          id="ray-top-left"
          className="perspective-ray"
          x1="360"
          y1="230"
          x2="0"
          y2="0"
          stroke="url(#grid-ray-fade)"
          strokeWidth="1.5"
          strokeDasharray="6 4"
        />
        {/* Bottom-Left Ray */}
        <line
          id="ray-bottom-left"
          className="perspective-ray"
          x1="360"
          y1="820"
          x2="0"
          y2="1080"
          stroke="url(#grid-ray-fade)"
          strokeWidth="1.5"
          strokeDasharray="6 4"
        />
        {/* Top-Right Ray */}
        <line
          id="ray-top-right"
          className="perspective-ray"
          x1="680"
          y1="230"
          x2="1920"
          y2="0"
          stroke="url(#grid-ray-fade)"
          strokeWidth="1.5"
        />
        {/* Bottom-Right Ray */}
        <line
          id="ray-bottom-right"
          className="perspective-ray"
          x1="680"
          y1="820"
          x2="1920"
          y2="1080"
          stroke="url(#grid-ray-fade)"
          strokeWidth="1.5"
        />

        {/* Right Wall Perspective Horizontal Grid Lines (Converging toward Left Vanishing Anchor) */}
        <line x1="680" y1="360" x2="1920" y2="240" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="1" />
        <line x1="680" y1="520" x2="1920" y2="520" stroke="rgba(163, 186, 153, 0.16)" strokeWidth="1" strokeDasharray="3 6" />
        <line x1="680" y1="680" x2="1920" y2="800" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="1" />

        {/* Right Wall Vertical Division Lines in Perspective Depth */}
        <line x1="900" y1="180" x2="900" y2="870" stroke="rgba(255, 255, 255, 0.05)" strokeWidth="1" />
        <line x1="1180" y1="120" x2="1180" y2="930" stroke="rgba(255, 255, 255, 0.07)" strokeWidth="1" strokeDasharray="4 4" />
        <line x1="1520" y1="60" x2="1520" y2="990" stroke="rgba(255, 255, 255, 0.09)" strokeWidth="1" />

        {/* Tactical Telemetry Text Inscriptions on the Grid */}
        <text x="710" y="220" fill="rgba(163, 186, 153, 0.65)" fontSize="12" fontFamily="monospace" letterSpacing="0.1em">
          [ 3D PROJECTION // CORRIDOR ELEVATION +1640M ]
        </text>
        <text x="1600" y="80" fill="rgba(255, 255, 255, 0.35)" fontSize="11" fontFamily="monospace" letterSpacing="0.08em">
          Z-AXIS // FLY-THROUGH WALL
        </text>
      </svg>

      {/* 2. Tactical Stage Horizon Telemetry */}
      <div className="perspective-telemetry-bar font-mono" aria-hidden="true">
        <span className="telemetry-item">[ SECTION 02 // SELECTED EXPEDITIONS ]</span>
        <span className="telemetry-sep">✦</span>
        <span className="telemetry-item">PERSPECTIVE: 1200PX // AXIS: Z-FORWARD</span>
        <span className="telemetry-sep">✦</span>
        <span className="telemetry-item">STATUS: TRAVERSING</span>
      </div>

      {/* 3. 3D Perspective Right-Wall Corridor Track */}
      <div className="perspective-corridor-track" role="region" aria-label="Featured Expedition Projects 3D Corridor">
        {FEATURED_EXPEDITIONS.map((exp, index) => (
          <article
            key={exp.id}
            id={`expedition-3d-card-${index + 1}`}
            className={`perspective-project-card card-step-${index + 1}`}
            data-index={index + 1}
            aria-label={`${exp.indexNumber}: ${exp.title}`}
          >
            {/* Card Top Rail */}
            <header className="perspective-card-header font-mono">
              <div className="perspective-card-index">
                <span className="index-tag">{exp.indexNumber}</span>
                <span className="index-bullet">●</span>
                <span className="category-tag">{exp.categoryLabel}</span>
              </div>
              <div className="perspective-card-status">
                <span className={`status-pill ${exp.status.toLowerCase()}`}>
                  {exp.status.toUpperCase()}
                </span>
              </div>
            </header>

            {/* Card Body */}
            <div className="perspective-card-body">
              <h3 className="perspective-card-title font-display">
                {exp.title}
              </h3>
              <p className="perspective-card-tagline font-serif">
                “{exp.tagline}”
              </p>
              <p className="perspective-card-summary font-serif">
                {exp.summary}
              </p>

              {/* Architectural Key Impact Highlight */}
              {exp.dossier?.impact?.[0] && (
                <div className="perspective-card-impact font-mono">
                  <span className="impact-lead font-mono">[ KEY IMPACT ]</span>
                  <p className="impact-text">{exp.dossier.impact[0]}</p>
                </div>
              )}

              {/* Stack Chips */}
              <div className="perspective-card-stack font-mono">
                {exp.stack.slice(0, 5).map((tech) => (
                  <span key={tech} className="perspective-stack-pill">
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            {/* Card Footer Actions */}
            <footer className="perspective-card-footer font-mono">
              <button
                type="button"
                className="perspective-action-btn primary"
                onClick={() => setActiveDossier(exp)}
                title={`Open complete dossier for ${exp.title}`}
              >
                <span>READ DOSSIER</span>
                <span className="btn-arrow" aria-hidden="true">↗</span>
              </button>

              {exp.repoUrl && (
                <a
                  href={exp.repoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="perspective-action-btn secondary"
                  title={`View source code on GitHub`}
                >
                  <svg className="github-svg" width="13" height="13" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                  </svg>
                  <span>SOURCE</span>
                  <span className="btn-arrow" aria-hidden="true">↗</span>
                </a>
              )}
            </footer>
          </article>
        ))}

        {/* 4. Complete Repository Callout Card (At the tail of fly-through) */}
        <div id="perspective-archive-cta" className="perspective-archive-cta font-mono">
          <div className="archive-cta-inner">
            <span className="archive-cta-kicker">[ EXPEDITION ARCHIVE REPERTORY ]</span>
            <h4 className="archive-cta-title font-display">
              All 07 Field Logs Documented.
            </h4>
            <p className="archive-cta-desc font-serif">
              Complete engineering dossiers, software architecture diagrams, and lessons learned across mobile, systems, and AI.
            </p>
            <button
              type="button"
              className="archive-cta-btn"
              onClick={() => setIsRepoModalOpen(true)}
            >
              <span>EXPLORE ALL 7 LOGS</span>
              <span className="btn-arrow" aria-hidden="true">↗</span>
            </button>
          </div>
        </div>
      </div>

      {/* 5. Whiteout Exposure Bloom Veil (Transisi Mulus ke Section 4 / Arsenal) */}
      <div
        id="expeditions-whiteout-veil"
        className="expeditions-whiteout-veil"
        aria-hidden="true"
      />

      {/* 6. Detailed Architectural Dossier Modal */}
      {activeDossier && (
        <ExpeditionDossierModal
          expedition={activeDossier}
          onClose={() => setActiveDossier(null)}
        />
      )}

      {/* 7. Full Repository Index Modal (When "EXPLORE ALL 7 LOGS" is clicked) */}
      {isRepoModalOpen && (
        <CompleteArchiveModal
          expeditions={initialExpeditions}
          onSelectDossier={(target) => {
            setIsRepoModalOpen(false);
            setActiveDossier(target);
          }}
          onClose={() => setIsRepoModalOpen(false)}
        />
      )}
    </section>
  );
};

// Tactile Field Dossier Pop-Up Modal (Apple Developer Academy Portfolio Specification)
interface ExpeditionDossierModalProps {
  expedition: Expedition;
  onClose: () => void;
}

const ExpeditionDossierModal: React.FC<ExpeditionDossierModalProps> = ({ expedition, onClose }) => {
  return (
    <div
      className="dossier-modal-backdrop"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="dossier-modal-title"
    >
      <div className="dossier-modal-container hairline-box">
        {/* Modal Top Bar */}
        <div className="dossier-modal-top font-mono">
          <div className="dossier-modal-header-meta">
            <span className="dossier-index-badge">{expedition.indexNumber}</span>
            <span className="dossier-meta-sep">//</span>
            <span className="dossier-meta-tag">{expedition.categoryLabel}</span>
          </div>
          <button
            onClick={onClose}
            className="dossier-close-btn font-mono"
            aria-label="Close dossier modal"
            title="Close dossier (Esc)"
          >
            <span className="dossier-close-text">CLOSE [ESC]</span>
            <span className="dossier-close-icon" aria-hidden="true">✕</span>
          </button>
        </div>

        {/* Modal Scrollable Content */}
        <div className="dossier-modal-body">
          {/* Title & Tagline */}
          <div className="dossier-title-block">
            <h3 id="dossier-modal-title" className="dossier-title font-display">
              {expedition.title}
            </h3>
            <p className="dossier-tagline">“{expedition.tagline}”</p>
          </div>

          {/* Classification & Ownership Matrix (Apple Developer Academy Criteria) */}
          <div className="dossier-meta-grid font-mono">
            <div className="dossier-meta-cell">
              <span className="dossier-label">PROJECT NATURE</span>
              <span className="dossier-nature-badge">{expedition.dossier.nature.toUpperCase()}</span>
            </div>

            <div className="dossier-meta-cell">
              <span className="dossier-label">TEAM STRUCTURE</span>
              <span
                className={`dossier-team-badge ${
                  expedition.dossier.isGroupProject ? 'is-group' : 'is-individual'
                }`}
              >
                {expedition.dossier.isGroupProject ? 'GROUP PROJECT' : 'INDIVIDUAL PROJECT'}
              </span>
            </div>

            <div className="dossier-meta-cell">
              <span className="dossier-label">ROLE IN PROJECT</span>
              <span className="dossier-role-value">
                {expedition.dossier.groupRole || expedition.role}
              </span>
            </div>

            <div className="dossier-meta-cell">
              <span className="dossier-label">TIMELINE</span>
              <span className="dossier-timeline-value">
                {expedition.period || expedition.year}
              </span>
            </div>
          </div>

          {/* Section 1: Executive Summary (1-2 sentences in English) */}
          <div className="dossier-section">
            <h4 className="dossier-section-title font-mono">
              <span className="dossier-sec-num">[01]</span> PROJECT SUMMARY
            </h4>
            <p className="dossier-narrative-summary font-serif">
              {expedition.dossier.englishSummary}
            </p>
          </div>

          {/* Section 2: Demonstrated Impact & Value Delivered */}
          <div className="dossier-section">
            <h4 className="dossier-section-title font-mono">
              <span className="dossier-sec-num">[02]</span> KEY IMPACT & VALUE DELIVERED
            </h4>
            <ul className="dossier-bullet-list">
              {expedition.dossier.impact.map((item, idx) => (
                <li key={idx} className="dossier-bullet-item">
                  <span className="dossier-bullet-marker font-mono" aria-hidden="true">◆</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Section 3: Lessons Learned & Architectural Mastery */}
          <div className="dossier-section">
            <h4 className="dossier-section-title font-mono">
              <span className="dossier-sec-num">[03]</span> LESSONS LEARNED & ARCHITECTURAL INSIGHTS
            </h4>
            <ul className="dossier-bullet-list">
              {expedition.dossier.learnings.map((item, idx) => (
                <li key={idx} className="dossier-bullet-item">
                  <span className="dossier-bullet-marker font-mono" aria-hidden="true">→</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Section 4: System Stack & Telemetry */}
          <div className="dossier-section">
            <h4 className="dossier-section-title font-mono">
              <span className="dossier-sec-num">[04]</span> TECHNICAL ARSENAL & TELEMETRY
            </h4>
            <div className="dossier-stack-tags font-mono">
              {expedition.stack.map((tech) => (
                <span key={tech} className="dossier-stack-tag">
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Bottom Actions */}
        <div className="dossier-modal-footer font-mono">
          <div className="dossier-footer-links centered">
            {expedition.repoUrl && (
              <a
                href={expedition.repoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="dossier-action-btn primary"
                title={`Open GitHub repository for ${expedition.title}`}
              >
                <svg
                  className="dossier-github-icon"
                  width="15"
                  height="15"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                  />
                </svg>
                <span>OPEN REPOSITORY</span>
                <span aria-hidden="true">↗</span>
              </a>
            )}
            {expedition.link && expedition.link !== expedition.repoUrl && (
              <a
                href={expedition.link}
                target="_blank"
                rel="noopener noreferrer"
                className="dossier-action-btn secondary"
              >
                <span>LIVE DEMO</span>
                <span aria-hidden="true">↗</span>
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Complete 7-Log Archive Drawer Modal
interface CompleteArchiveModalProps {
  expeditions: Expedition[];
  onSelectDossier: (exp: Expedition) => void;
  onClose: () => void;
}

const CompleteArchiveModal: React.FC<CompleteArchiveModalProps> = ({
  expeditions,
  onSelectDossier,
  onClose,
}) => {
  return (
    <div
      className="dossier-modal-backdrop"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="archive-modal-title"
    >
      <div className="dossier-modal-container archive-modal-wide hairline-box">
        <div className="dossier-modal-top font-mono">
          <div className="dossier-modal-header-meta">
            <span className="dossier-index-badge">ARCHIVE // 07 ENTRIES</span>
            <span className="dossier-meta-sep">//</span>
            <span className="dossier-meta-tag">COMPLETE EXPEDITION REPOSITORY</span>
          </div>
          <button
            onClick={onClose}
            className="dossier-close-btn font-mono"
            aria-label="Close archive modal"
          >
            <span className="dossier-close-text">CLOSE [ESC]</span>
            <span className="dossier-close-icon" aria-hidden="true">✕</span>
          </button>
        </div>

        <div className="dossier-modal-body">
          <div className="dossier-title-block">
            <h3 id="archive-modal-title" className="dossier-title font-display">
              Field Repository & Expeditions.
            </h3>
            <p className="dossier-tagline">“Complete catalog of software engineering archives.”</p>
          </div>

          <div className="archive-cards-list font-mono">
            {expeditions.map((exp) => (
              <div key={exp.id} className="archive-row-card">
                <div className="archive-row-left">
                  <span className="archive-row-idx">{exp.indexNumber}</span>
                  <span className="archive-row-title font-display">{exp.title}</span>
                  <span className="archive-row-cat font-mono">{exp.categoryLabel}</span>
                </div>
                <div className="archive-row-right">
                  <button
                    type="button"
                    className="archive-row-btn font-mono"
                    onClick={() => onSelectDossier(exp)}
                  >
                    DOSSIER ↗
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};



