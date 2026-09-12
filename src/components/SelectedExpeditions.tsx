import React, { useState, useMemo, useEffect } from 'react';
import { initialExpeditions } from '../data/expeditions';
import type { Expedition, ExpeditionCategory } from '../types';
import './SelectedExpeditions.css';

interface FilterOption {
  key: ExpeditionCategory;
  label: string;
}

const FILTER_OPTIONS: FilterOption[] = [
  { key: 'all', label: 'ALL LOGS' },
  { key: 'mobile', label: 'MOBILE APPS' },
  { key: 'ai-tools', label: 'AI & EXTENSIONS' },
  { key: 'systems', label: 'SYSTEMS & WEB' },
  { key: 'editorial', label: 'EDITORIAL' },
];

export const SelectedExpeditions: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState<ExpeditionCategory>('all');
  const [isArchiveExpanded, setIsArchiveExpanded] = useState<boolean>(false);
  const [activeDossier, setActiveDossier] = useState<Expedition | null>(null);

  // Close modal on Escape key and lock body scroll
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setActiveDossier(null);
      }
    };

    if (activeDossier) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [activeDossier]);

  // Compute counts for each category
  const counts = useMemo(() => {
    return {
      all: initialExpeditions.length,
      mobile: initialExpeditions.filter((e) => e.category === 'mobile').length,
      'ai-tools': initialExpeditions.filter((e) => e.category === 'ai-tools').length,
      systems: initialExpeditions.filter((e) => e.category === 'systems').length,
      editorial: initialExpeditions.filter((e) => e.category === 'editorial').length,
    };
  }, []);

  // Filter expeditions based on active tab
  const filteredExpeditions = useMemo(() => {
    if (activeFilter === 'all') {
      return initialExpeditions;
    }
    return initialExpeditions.filter((exp) => exp.category === activeFilter);
  }, [activeFilter]);

  // Combine Option A + Option B: If "all" and not expanded, show top 4 featured
  const displayedExpeditions = useMemo(() => {
    if (activeFilter === 'all' && !isArchiveExpanded) {
      return filteredExpeditions.slice(0, 4);
    }
    return filteredExpeditions;
  }, [activeFilter, isArchiveExpanded, filteredExpeditions]);

  const toggleArchive = () => {
    setIsArchiveExpanded((prev) => !prev);
  };

  return (
    <section id="expeditions" className="expeditions-section hairline-b" aria-labelledby="expeditions-heading">
      <div className="container">
        
        {/* Section Header */}
        <header className="expeditions-header">
          <div className="expeditions-header-top">
            <div>
              <span className="tag-badge">FIELD ARCHIVE // 02 · REPERTORY</span>
              <h2 id="expeditions-heading" className="expeditions-headline font-display">
                Selected Expeditions<span style={{ color: 'var(--color-olive)' }}>.</span>
              </h2>
            </div>
            <div className="expeditions-telemetry-meta font-mono">
              INDEX: {displayedExpeditions.length} OF {initialExpeditions.length} LOG ENTRIES
            </div>
          </div>

          {/* Option A: Category Filter Tabs */}
          <nav className="expeditions-filter-row" aria-label="Filter Expeditions by Domain">
            {FILTER_OPTIONS.map((tab) => {
              const isActive = activeFilter === tab.key;
              const count = counts[tab.key];

              return (
                <button
                  key={tab.key}
                  onClick={() => {
                    setActiveFilter(tab.key);
                    // Reset archive expand state if changing filter
                    if (tab.key !== 'all') {
                      setIsArchiveExpanded(true);
                    }
                  }}
                  className={`expedition-filter-btn ${isActive ? 'active' : ''}`}
                  aria-pressed={isActive}
                >
                  <span>{tab.label}</span>
                  <span className="filter-count">[{String(count).padStart(2, '0')}]</span>
                </button>
              );
            })}
          </nav>
        </header>

        {/* Expeditions Grid / Cards */}
        <div className="expeditions-grid" role="region" aria-label="Field Log Cards">
          {displayedExpeditions.map((exp) => (
            <ExpeditionCard
              key={exp.id}
              expedition={exp}
              onOpenDossier={(target) => setActiveDossier(target)}
            />
          ))}
        </div>

        {/* Option B: Archive Expander Dock (When "All" is selected) */}
        {activeFilter === 'all' && initialExpeditions.length > 4 && (
          <div className="expeditions-archive-dock">
            <button
              onClick={toggleArchive}
              className={`expeditions-expand-btn ${isArchiveExpanded ? 'is-expanded' : ''}`}
              aria-expanded={isArchiveExpanded}
              aria-controls="expeditions-grid"
            >
              <span className="expand-icon" aria-hidden="true">
                {isArchiveExpanded ? '↑' : '↓'}
              </span>
              <span>
                {isArchiveExpanded
                  ? 'COLLAPSE TO FEATURED LOGS [04]'
                  : `EXPLORE COMPLETE LOG ARCHIVE [${String(initialExpeditions.length).padStart(2, '0')} ENTRIES]`}
              </span>
            </button>
          </div>
        )}

      </div>

      {/* Tactile Field Dossier Pop-Up Modal */}
      {activeDossier && (
        <ExpeditionDossierModal
          expedition={activeDossier}
          onClose={() => setActiveDossier(null)}
        />
      )}
    </section>
  );
};

// Modular, Type-Safe Expedition Card Component
interface ExpeditionCardProps {
  expedition: Expedition;
  onOpenDossier: (expedition: Expedition) => void;
}

const ExpeditionCard: React.FC<ExpeditionCardProps> = ({ expedition, onOpenDossier }) => {
  return (
    <article
      className="expedition-card hairline-box"
      aria-label={`Project: ${expedition.title}. Click to view full dossier.`}
      onClick={() => onOpenDossier(expedition)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onOpenDossier(expedition);
        }
      }}
    >
      <div>
        {/* Card Header Metadata */}
        <div className="exp-card-header font-mono">
          <span className="exp-card-index">{expedition.indexNumber}</span>
          <span className="exp-card-year">{expedition.year}</span>
        </div>

        {/* Card Visual Blueprint / Thumbnail Frame */}
        <div className="exp-card-visual" aria-hidden="true">
          {expedition.image ? (
            <img
              src={expedition.image}
              alt={expedition.title}
              className="exp-card-img"
              loading="lazy"
              width={640}
              height={360}
            />
          ) : (
            <div className="exp-blueprint-frame">
              <svg className="exp-blueprint-grid" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <pattern id={`grid-${expedition.id}`} width="24" height="24" patternUnits="userSpaceOnUse">
                    <path d="M 24 0 L 0 0 0 24" fill="none" stroke="rgba(74, 88, 68, 0.12)" strokeWidth="0.8" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill={`url(#grid-${expedition.id})`} />
                <circle cx="50%" cy="50%" r="28" fill="none" stroke="rgba(74, 88, 68, 0.22)" strokeDasharray="3,3" />
                <path d="M 12 12 L 20 12 M 12 12 L 12 20" stroke="rgba(74, 88, 68, 0.35)" strokeWidth="1.2" fill="none" />
              </svg>
              <div className="exp-blueprint-stamp font-mono">
                <span>SYS.SPEC // {expedition.id.toUpperCase()}</span>
                <span>{expedition.stack[0]}</span>
              </div>
            </div>
          )}
        </div>

        {/* Card Body */}
        <div className="exp-card-body">
          <h3 className="exp-card-title font-display">
            {expedition.title}
          </h3>
          <span className="exp-card-tagline">
            “{expedition.tagline}”
          </span>

          <div className="exp-card-meta-line font-mono">
            <span style={{ color: 'var(--color-olive)' }}>[{expedition.categoryLabel}]</span>
            <span style={{ color: 'var(--color-ink-faint)' }}>//</span>
            <span>{expedition.role}</span>
          </div>

          <p className="exp-card-summary">
            {expedition.summary}
          </p>
        </div>
      </div>

      {/* Card Footer Tech Stack & Links */}
      <footer className="exp-card-footer">
        <div className="exp-card-stack-row font-mono">
          {expedition.stack.map((tech) => (
            <span key={tech} className="exp-stack-tag">
              {tech}
            </span>
          ))}
        </div>

        <div className="exp-card-actions font-mono">
          <button
            type="button"
            className="exp-card-dossier-btn"
            onClick={(e) => {
              e.stopPropagation();
              onOpenDossier(expedition);
            }}
            title={`Open Apple Dev Academy portfolio dossier for ${expedition.title}`}
          >
            <span>VIEW DOSSIER</span>
            <span aria-hidden="true">↗</span>
          </button>

          <a
            href={expedition.repoUrl || expedition.link || '#'}
            target="_blank"
            rel="noopener noreferrer"
            className="exp-card-link"
            onClick={(e) => e.stopPropagation()}
            title={`Inspect repository for ${expedition.title}`}
          >
            <svg
              className="exp-card-github-icon"
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
            <span>REPO</span>
            <span aria-hidden="true">↗</span>
          </a>

          {expedition.period && (
            <span className="exp-card-period">{expedition.period}</span>
          )}
        </div>
      </footer>
    </article>
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
            <span>CLOSE [ESC]</span>
            <span aria-hidden="true">✕</span>
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


