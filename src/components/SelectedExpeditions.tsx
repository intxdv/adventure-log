import React, { useState, useEffect, useCallback } from 'react';
import { initialExpeditions } from '../data/expeditions';
import type { Expedition } from '../types';
import DepthCarousel from './ui/DepthCarousel';
import './SelectedExpeditions.css';

// 4 Top Featured Expeditions matching Robert Aperios editorial showcase
const FEATURED_EXPEDITIONS = initialExpeditions.filter((exp) => exp.featured).slice(0, 4);

const CAROUSEL_ITEMS = FEATURED_EXPEDITIONS.map((exp) => ({
  image: exp.image || '',
  alt: `${exp.title} exhibition display`,
}));

export const SelectedExpeditions: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [activeDossier, setActiveDossier] = useState<Expedition | null>(null);
  const [isRepoModalOpen, setIsRepoModalOpen] = useState<boolean>(false);

  // Smooth project navigation with optional ScrollTrigger stage synchronization
  const goToProject = useCallback((newIndex: number, syncScroll = false) => {
    if (newIndex < 0 || newIndex >= FEATURED_EXPEDITIONS.length) return;
    setActiveIndex(newIndex);
    if (syncScroll) {
      const stageWrapper = document.getElementById('hero-stage-wrapper');
      if (stageWrapper) {
        const maxScroll = stageWrapper.offsetHeight - window.innerHeight;
        const progressMap = [0.45, 0.59, 0.73, 0.87];
        const targetRatio = progressMap[newIndex] ?? (0.45 + newIndex * 0.14);
        const targetScroll = stageWrapper.offsetTop + maxScroll * targetRatio;
        window.scrollTo({ top: targetScroll, behavior: 'auto' });
      }
    }
  }, []);

  // Listen for scroll synchronization events from GSAP motion engine
  useEffect(() => {
    const handleExpeditionChange = (e: Event) => {
      const customEvent = e as CustomEvent<{ index: number }>;
      if (customEvent.detail && typeof customEvent.detail.index === 'number') {
        goToProject(customEvent.detail.index, false);
      }
    };

    window.addEventListener('adventure:expedition-change', handleExpeditionChange);
    return () => {
      window.removeEventListener('adventure:expedition-change', handleExpeditionChange);
    };
  }, [goToProject]);

  // Modal keyboard accessibility (Escape key) & body scroll lock
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

  const currentExpedition = FEATURED_EXPEDITIONS[activeIndex] || FEATURED_EXPEDITIONS[0];

  return (
    <section
      id="expeditions"
      className="expeditions-perspective-stage"
      aria-label="Selected Expeditions: Swiss Editorial Showcase"
    >
      {/* 0. Expanding White/Neutral Canvas (Base for Section 3) */}
      <div id="expeditions-white-canvas" className="expeditions-white-canvas" aria-hidden="true" />

      {/* 1. Swiss Editorial Stage Container */}
      <div id="expeditions-swiss-container" className="expeditions-swiss-container">
        {/* Technical Registration Crosshairs (+) matching Robert Aperios design */}
        <span className="swiss-crosshair ch-tl" aria-hidden="true">+</span>
        <span className="swiss-crosshair ch-tc" aria-hidden="true">+</span>
        <span className="swiss-crosshair ch-tr" aria-hidden="true">+</span>
        <span className="swiss-crosshair ch-bl" aria-hidden="true">+</span>
        <span className="swiss-crosshair ch-bc" aria-hidden="true">+</span>
        <span className="swiss-crosshair ch-br" aria-hidden="true">+</span>

        {/* Top Header Datum Bar */}
        <header className="swiss-header-row">
          <div className="swiss-header-left font-mono">
            <span className="designer-name">SYAFIQ ABIYYU TAQI</span>
            <span className="header-sep">//</span>
            <span className="role-tag">ENGINEERING LOGS</span>
          </div>
          <h2 className="swiss-main-title font-display">WORK</h2>
          <div className="swiss-header-right font-mono">
            <span>SELECTED EXPEDITIONS</span>
            <span className="header-sep">//</span>
            <span className="count-tag">04 FEATURED</span>
          </div>
        </header>

        {/* 2. Two-Column Swiss Layout Grid (Sketched Architecture) */}
        <div className="swiss-grid">
          {/* LEFT PANEL: Dynamic Dossier Sidebar (Counter + Title + Specs + Tech Stack + Dossier Button) */}
          <div className="swiss-col-left">
            <div className="swiss-left-top">
              <div className="swiss-counter-reel">
                <div
                  className="swiss-counter-track font-display"
                  style={{
                    transform: `translateY(-${activeIndex * 25}%)`,
                  }}
                  aria-live="polite"
                  aria-atomic="true"
                >
                  <div className="swiss-counter-num">01</div>
                  <div className="swiss-counter-num">02</div>
                  <div className="swiss-counter-num">03</div>
                  <div className="swiss-counter-num">04</div>
                </div>
              </div>

              {/* Dynamic Project Details with Soft Micro-Fade & Drift Animation */}
              <div key={activeIndex} className="swiss-project-dynamic-details">
                {/* Project Title & Metadata */}
                <div className="swiss-left-project-info font-mono">
                  <h3 className="swiss-project-title font-display">
                    {currentExpedition.title}
                  </h3>
                  <div className="swiss-project-cat">
                    {currentExpedition.categoryLabel.toUpperCase()}
                  </div>
                  <div className="swiss-project-role">
                    ROLE: {currentExpedition.role.toUpperCase()}
                  </div>
                  <div className="swiss-project-status">
                    <span className="status-dot">●</span>
                    <span>{currentExpedition.year} // {currentExpedition.status.toUpperCase()}</span>
                  </div>
                </div>

                {/* Mid Section: Editorial Narrative, Impact & Arsenal Telemetry (Option A) */}
                <div className="swiss-left-body font-mono">
                  <div className="swiss-box-header font-mono">
                    <span className="swiss-box-kicker">[ EXPEDITION SPECIFICATION ]</span>
                    <span className="swiss-box-idx">{currentExpedition.indexNumber}</span>
                  </div>

                  <p className="swiss-editorial-summary">
                    {(currentExpedition.dossier?.englishSummary || currentExpedition.summary).toUpperCase()}
                  </p>

                  {currentExpedition.dossier?.impact?.[0] && (
                    <div className="swiss-impact-callout">
                      <span className="impact-kicker">[ KEY ARCHITECTURAL IMPACT ]</span>
                      <p className="impact-detail">
                        {currentExpedition.dossier.impact[0].toUpperCase()}
                      </p>
                    </div>
                  )}

                  <div className="swiss-stack-section">
                    <span className="swiss-stack-label">[ ARSENAL TELEMETRY ]</span>
                    <div className="swiss-stack-pills">
                      {currentExpedition.stack.slice(0, 5).map((tech) => (
                        <span key={tech} className="swiss-tech-pill">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Anchor: View Dossier Trigger */}
            <div className="swiss-left-bottom">
              <button
                type="button"
                className="swiss-dossier-btn font-mono"
                onClick={() => setActiveDossier(currentExpedition)}
                title={`Open technical dossier for ${currentExpedition.title}`}
              >
                <span>VIEW DOSSIER</span>
                <span className="btn-arrow" aria-hidden="true">↗</span>
              </button>
            </div>
          </div>

          {/* RIGHT PANEL: Expansive 3D Visual Stage + Unified Tactical Datum Bar */}
          <div className="swiss-col-stage">
            <div className="swiss-depth-carousel-wrapper">
              <DepthCarousel
                items={CAROUSEL_ITEMS}
                cardWidth={720}
                cardHeight={405}
                radius={6}
                tint="#121512"
                depth={95}
                spread={30}
                tilt={4}
                orientation="vertical"
                verticalDirection="up"
                perspective={1200}
                visibleCards={3}
                falloff={0.24}
                blur={0}
                duration={600}
                ease="power3.out"
                loop={false}
                showControls={true}
                showIndicators={false}
                activeIndex={activeIndex}
                onChange={(idx) => goToProject(idx, true)}
              />
            </div>

            {/* Tactical Datum Bar beneath Stage: Step Indicator on Left, Action CTA on Right */}
            <div className="swiss-stage-bottom-bar font-mono">
              <div className="swiss-step-nav" role="tablist" aria-label="Expedition showcase navigation">
                <div className="swiss-step-track">
                  {FEATURED_EXPEDITIONS.map((exp, idx) => (
                    <button
                      key={exp.id}
                      type="button"
                      role="tab"
                      aria-selected={activeIndex === idx}
                      aria-label={`Jump to expedition 0${idx + 1}: ${exp.title}`}
                      className={`swiss-step-btn ${activeIndex === idx ? 'is-active' : ''}`}
                      onClick={() => goToProject(idx, true)}
                    >
                      <span className="swiss-step-dash" />
                    </button>
                  ))}
                </div>
                <span className="swiss-step-label font-mono">
                  0{activeIndex + 1} / 0{FEATURED_EXPEDITIONS.length}
                </span>
              </div>

              <div className="swiss-stage-actions">
                {currentExpedition.repoUrl && (
                  <a
                    href={currentExpedition.repoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="swiss-source-link"
                    title={`View ${currentExpedition.title} source on GitHub`}
                  >
                    <svg
                      className="github-svg"
                      width="13"
                      height="13"
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
                    <span>SOURCE REPOSITORY ↗</span>
                  </a>
                )}

                {/* Grand Archive CTA - Placed strictly on the final project (04) */}
                {activeIndex === FEATURED_EXPEDITIONS.length - 1 && (
                  <button
                    type="button"
                    className="swiss-archive-highlight-btn inline-compact font-mono"
                    onClick={() => setIsRepoModalOpen(true)}
                  >
                    <span className="cta-kicker">[ FIELD REPOSITORY ARCHIVE ]</span>
                    <span className="cta-title">
                      <span>EXPLORE ALL 07 EXPEDITIONS</span>
                      <span className="cta-arrow" aria-hidden="true">↗</span>
                    </span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Architectural Dossier Modal (Esc to close) */}
      {activeDossier && (
        <ExpeditionDossierModal
          expedition={activeDossier}
          onClose={() => setActiveDossier(null)}
        />
      )}

      {/* Full 7-Expedition Repository Index Modal */}
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
          {/* Visual Showcase Banner - Positioned above title */}
          {expedition.image && (
            <div className="dossier-visual-banner">
              <img
                src={expedition.image}
                alt={`${expedition.title} visual showcase`}
                className="dossier-visual-banner-img"
              />
            </div>
          )}

          <div className="dossier-title-block">
            <h3 id="dossier-modal-title" className="dossier-title font-display">
              {expedition.title}
            </h3>
            <p className="dossier-tagline">“{expedition.tagline}”</p>
          </div>

          {/* Classification & Ownership Matrix */}
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

          {/* Section 1: Executive Summary */}
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
