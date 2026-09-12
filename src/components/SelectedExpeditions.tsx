import React, { useState, useMemo } from 'react';
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
            <ExpeditionCard key={exp.id} expedition={exp} />
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
    </section>
  );
};

// Modular, Type-Safe Expedition Card Component
interface ExpeditionCardProps {
  expedition: Expedition;
}

const ExpeditionCard: React.FC<ExpeditionCardProps> = ({ expedition }) => {
  return (
    <article className="expedition-card hairline-box" aria-label={`Project: ${expedition.title}`}>
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
          <a
            href={expedition.repoUrl || expedition.link || '#'}
            target="_blank"
            rel="noopener noreferrer"
            className="exp-card-link"
            title={`Inspect repository for ${expedition.title}`}
          >
            <span>INSPECT REPO</span>
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

