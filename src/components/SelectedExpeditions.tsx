import React, { useState, useEffect, useRef, useCallback } from 'react';
import { initialExpeditions } from '../data/expeditions';
import type { Expedition } from '../types';
import PixelSwap from './ui/PixelSwap';
import './SelectedExpeditions.css';

// 4 Top Featured Expeditions matching Robert Aperios editorial showcase
const FEATURED_EXPEDITIONS = initialExpeditions.filter((exp) => exp.featured).slice(0, 4);

export const SelectedExpeditions: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [isPixelSwapped, setIsPixelSwapped] = useState<boolean>(false);
  const [contentAIndex, setContentAIndex] = useState<number>(0);
  const [contentBIndex, setContentBIndex] = useState<number>(1);
  const [activeDossier, setActiveDossier] = useState<Expedition | null>(null);
  const [isRepoModalOpen, setIsRepoModalOpen] = useState<boolean>(false);

  const prevIndexRef = useRef<number>(0);

  // Smooth project navigation with PixelSwap trigger
  const goToProject = useCallback((newIndex: number) => {
    if (newIndex < 0 || newIndex >= FEATURED_EXPEDITIONS.length) return;
    if (newIndex === prevIndexRef.current) return;

    prevIndexRef.current = newIndex;
    setActiveIndex(newIndex);

    setIsPixelSwapped((prevSwapped) => {
      if (!prevSwapped) {
        setContentBIndex(newIndex);
        return true;
      } else {
        setContentAIndex(newIndex);
        return false;
      }
    });
  }, []);

  // Listen for scroll synchronization events from GSAP motion engine
  useEffect(() => {
    const handleExpeditionChange = (e: Event) => {
      const customEvent = e as CustomEvent<{ index: number }>;
      if (customEvent.detail && typeof customEvent.detail.index === 'number') {
        goToProject(customEvent.detail.index);
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

  // Render bespoke high-fidelity UI Mockups for each featured expedition
  const renderProjectMockup = (index: number) => {

    switch (index) {
      // 01: Lapor FSM (Civic Tech · Mobile Architecture)
      case 0:
        return (
          <div className="swiss-mockup-frame mockup-lapor">
            <div className="mockup-top-bar font-mono">
              <span className="mockup-dot-indicator active" />
              <span className="mockup-system-id">LAPOR_FSM // MOBILE CLIENT V1.4.0</span>
              <span className="mockup-badge-live">[ CIVIC ARCHITECTURE ]</span>
            </div>
            <div className="mockup-viewport">
              <div className="lapor-card hairline-box">
                <div className="lapor-card-header font-mono">
                  <span className="lapor-ticket-id">INCIDENT #FSM-2026-089</span>
                  <span className="lapor-status-badge is-investigating">UNDER REVIEW</span>
                </div>
                <h4 className="lapor-incident-title font-display">
                  AC Malfunction & Circuit Overload in Lab E-104
                </h4>
                <p className="lapor-incident-desc font-mono">
                  Reported by anonymous civitas. Automated dispatch routed to Department Facility Directorate.
                </p>
                <div className="lapor-telemetry-row font-mono">
                  <span className="lapor-tele-chip">DRIFT SQLITE: PERSISTED</span>
                  <span className="lapor-tele-chip">ELYSIA BUN: 0.8ms</span>
                  <span className="lapor-tele-chip">BLOC: SYNCED</span>
                </div>
              </div>
              <div className="lapor-bottom-actions font-mono">
                <span className="lapor-btn-mock primary">SUBMIT EVIDENCE ↗</span>
                <span className="lapor-btn-mock secondary">TRACK REPORT #089</span>
              </div>
            </div>
          </div>
        );

      // 02: Dipofeed (Agro-Tech · Cattle Feed Nutrition Calculator)
      case 1:
        return (
          <div className="swiss-mockup-frame mockup-dipofeed">
            <div className="mockup-top-bar font-mono">
              <span className="mockup-dot-indicator active" />
              <span className="mockup-system-id">DIPOFEED // RATION FORMULATION HUD</span>
              <span className="mockup-badge-live">[ AGRO-TECH ]</span>
            </div>
            <div className="mockup-viewport">
              <div className="dipofeed-metrics-grid font-mono">
                <div className="dipofeed-metric-box">
                  <span className="metric-label">DRY MATTER (DM)</span>
                  <span className="metric-val font-display">14.8 KG</span>
                  <div className="metric-bar-wrap">
                    <div className="metric-bar-fill" style={{ width: '85%' }} />
                  </div>
                </div>
                <div className="dipofeed-metric-box highlight">
                  <span className="metric-label">CRUDE PROTEIN (CP)</span>
                  <span className="metric-val font-display">16.2%</span>
                  <span className="metric-target-tag">TARGET MET ◆</span>
                </div>
                <div className="dipofeed-metric-box">
                  <span className="metric-label">TDN METRIC</span>
                  <span className="metric-val font-display">68.5%</span>
                  <div className="metric-bar-wrap">
                    <div className="metric-bar-fill" style={{ width: '78%' }} />
                  </div>
                </div>
              </div>
              <div className="dipofeed-ration-table font-mono">
                <div className="ration-row header">
                  <span>FORAGE INGREDIENT</span>
                  <span>QTY</span>
                  <span>EST. COST</span>
                </div>
                <div className="ration-row">
                  <span>Pennisetum purpureum (Gajah)</span>
                  <span>35.0 KG</span>
                  <span>IDR 17,500</span>
                </div>
                <div className="ration-row">
                  <span>Commercial Dairy Concentrate</span>
                  <span>6.5 KG</span>
                  <span>IDR 32,500</span>
                </div>
                <div className="ration-row highlight">
                  <span>Soybean Meal (Bungkil Kedelai)</span>
                  <span>1.2 KG</span>
                  <span>IDR 9,600</span>
                </div>
              </div>
            </div>
          </div>
        );

      // 03: Aware (Computer Vision · Occupational Safety Screening)
      case 2:
        return (
          <div className="swiss-mockup-frame mockup-aware">
            <div className="mockup-top-bar font-mono">
              <span className="mockup-dot-indicator alert" />
              <span className="mockup-system-id">AWARE // OCCUPATIONAL VISION TELEMETRY</span>
              <span className="mockup-badge-live">[ MEDIAPIPE CV ]</span>
            </div>
            <div className="mockup-viewport aware-hud-viewport">
              <div className="aware-reticle-box">
                <div className="aware-crosshair tl" />
                <div className="aware-crosshair tr" />
                <div className="aware-crosshair bl" />
                <div className="aware-crosshair br" />
                <div className="aware-face-mesh-simulation">
                  <span className="font-mono mesh-label">468 FACIAL LANDMARKS DETECTED</span>
                </div>
              </div>
              <div className="aware-telemetry-rail font-mono">
                <div className="aware-readout">
                  <span className="readout-tag">EYE ASPECT RATIO (EAR)</span>
                  <span className="readout-num font-display">0.28</span>
                  <span className="readout-status pass">NORMAL &gt; 0.22</span>
                </div>
                <div className="aware-readout">
                  <span className="readout-tag">MOUTH ASPECT RATIO (MAR)</span>
                  <span className="readout-num font-display">0.14</span>
                  <span className="readout-status pass">NO YAWN &lt; 0.50</span>
                </div>
                <div className="aware-readout verdict-card">
                  <span className="verdict-lead">SCREENING VERDICT</span>
                  <span className="verdict-main">FIT-TO-WORK: PASSED</span>
                  <span className="verdict-time">TIME: 18.4s / 30.0s MAX</span>
                </div>
              </div>
            </div>
          </div>
        );

      // 04: Kagu (Voice AI Browser Extension · Speech-to-Canvas)
      case 3:
      default:
        return (
          <div className="swiss-mockup-frame mockup-kagu">
            <div className="mockup-top-bar font-mono">
              <span className="mockup-dot-indicator pulse" />
              <span className="mockup-system-id">KAGU EXTENSION // VOICE-TO-CANVAS</span>
              <span className="mockup-badge-live">[ SPEECH RECOGNITION ]</span>
            </div>
            <div className="mockup-viewport kagu-viewport">
              <div className="kagu-audio-wave-visualizer">
                <span className="wave-bar b1" />
                <span className="wave-bar b2" />
                <span className="wave-bar b3" />
                <span className="wave-bar b4" />
                <span className="wave-bar b5" />
                <span className="wave-bar b6" />
                <span className="wave-bar b7" />
                <span className="wave-bar b8" />
                <span className="wave-bar b9" />
              </div>
              <div className="kagu-transcript-bubble font-serif">
                “Synthesize this technical architecture into actionable sprint tasks and map onto canvas...”
              </div>
              <div className="kagu-canvas-preview font-mono">
                <div className="kagu-chip">
                  <span className="kagu-chip-marker">◆</span>
                  <span>CARD #01: REFACTOR REPOSITORY CONTRACTS</span>
                </div>
                <div className="kagu-chip">
                  <span className="kagu-chip-marker">◆</span>
                  <span>CARD #02: BENCHMARK ELYSIA WEBSOCKET LATENCY</span>
                </div>
              </div>
              <div className="kagu-status-footer font-mono">
                <span className="kagu-live-tag">● LISTENING // 120ms ENGINE LATENCY</span>
              </div>
            </div>
          </div>
        );
    }
  };

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

        {/* 2. Three-Panel Swiss Layout Grid */}
        <div className="swiss-grid">
          {/* LEFT PANEL (~22%): Massive Vertical Rolling Counter & Dossier Trigger */}
          <div className="swiss-col-left">
            <div className="swiss-counter-wrapper">
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
            </div>

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

          {/* CENTER PANEL (~52%): High-Fidelity Project Showcase Frame with PixelSwap */}
          <div className="swiss-col-center">
            <div className="swiss-showcase-frame hairline-box">
              <PixelSwap
                firstContent={renderProjectMockup(contentAIndex)}
                secondContent={renderProjectMockup(contentBIndex)}
                pixelSize={40}
                gap={1}
                pixelRadius={0}
                pixelSpin={0}
                pixelScale={0.85}
                duration={900}
                pixelDuration={320}
                pattern="random"
                fade
                trigger="manual"
                active={isPixelSwapped}
                className="swiss-pixelswap-host"
              />
            </div>

            {/* Pagination Dot Indicator beneath Center Frame */}
            <div className="swiss-dots-nav" role="tablist" aria-label="Expedition showcase pagination">
              {FEATURED_EXPEDITIONS.map((exp, idx) => (
                <button
                  key={exp.id}
                  type="button"
                  role="tab"
                  aria-selected={activeIndex === idx}
                  aria-label={`Jump to expedition 0${idx + 1}: ${exp.title}`}
                  className={`swiss-dot-btn ${activeIndex === idx ? 'is-active' : ''}`}
                  onClick={() => goToProject(idx)}
                >
                  <span className="swiss-dot-inner" />
                </button>
              ))}
            </div>
          </div>

          {/* RIGHT PANEL (~26%): Technical Domain, Editorial Narrative & Repository Actions */}
          <div className="swiss-col-right font-mono">
            <div className="swiss-right-top">
              <div className="swiss-project-title font-display">
                {currentExpedition.title}
              </div>
              <div className="swiss-project-cat">
                {currentExpedition.categoryLabel.toUpperCase()}
              </div>
              <div className="swiss-project-role">
                ROLE: {currentExpedition.role.toUpperCase()}
              </div>
            </div>

            <div className="swiss-right-bottom">
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

              <div className="swiss-stack-pills">
                {currentExpedition.stack.slice(0, 5).map((tech) => (
                  <span key={tech} className="swiss-tech-pill">
                    {tech}
                  </span>
                ))}
              </div>

              {currentExpedition.repoUrl && (
                <div className="swiss-source-wrapper">
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
                    <span>SOURCE ↗</span>
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Bottom Bar: Complete Archive Modal Trigger */}
        <footer className="swiss-footer-row font-mono">
          <button
            type="button"
            className="swiss-all-logs-btn"
            onClick={() => setIsRepoModalOpen(true)}
          >
            <span>[ EXPLORE ALL 07 EXPEDITIONS ]</span>
            <span className="btn-arrow" aria-hidden="true">↗</span>
          </button>
        </footer>
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
