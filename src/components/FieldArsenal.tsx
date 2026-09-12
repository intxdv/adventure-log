import React, { useState, useRef } from 'react';
import { initialArsenal } from '../data/arsenal';
import './FieldArsenal.css';

export const FieldArsenal: React.FC = () => {
  const [activePillarIndex, setActivePillarIndex] = useState<number>(0);
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  // Circular navigation (looping)
  const handlePrev = () => {
    setActivePillarIndex((prev) => (prev === 0 ? initialArsenal.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setActivePillarIndex((prev) => (prev === initialArsenal.length - 1 ? 0 : prev + 1));
  };

  // Touch Swipe Handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (touchStartX.current === null || touchEndX.current === null) return;
    const swipeDistance = touchStartX.current - touchEndX.current;

    // Minimum swipe threshold 45px
    if (swipeDistance > 45) {
      handleNext(); // Swiped left -> show next
    } else if (swipeDistance < -45) {
      handlePrev(); // Swiped right -> show prev
    }

    touchStartX.current = null;
    touchEndX.current = null;
  };

  return (
    <section id="arsenal" className="arsenal-section hairline-b" aria-labelledby="arsenal-heading">
      <div className="container">
        
        {/* Section Header */}
        <header className="arsenal-header">
          <div className="arsenal-header-top">
            <div>
              <span className="tag-badge">FIELD GEAR // 03 · ARSENAL</span>
              <h2 id="arsenal-heading" className="arsenal-headline font-display">
                Technical Arsenal<span style={{ color: 'var(--color-olive)' }}>.</span>
              </h2>
            </div>
            <div className="arsenal-telemetry-meta font-mono">
              CORE INVENTORY: 03 PILLARS // 18 VERIFIED CAPABILITIES
            </div>
          </div>
          <p className="arsenal-header-tagline">
            “Tactical toolchains & craft disciplines forged through production expeditions.”
          </p>
        </header>

        {/* Mobile Quick Selector Tabs (Visible only on Mobile <= 768px) */}
        <div className="arsenal-mobile-tabs font-mono" aria-label="Select Technical Pillar">
          {initialArsenal.map((pillar, idx) => {
            const shortLabel =
              pillar.id === 'creative-web' ? 'WEB' : pillar.id === 'mobile-craft' ? 'MOBILE' : 'DESIGN';
            const isActive = activePillarIndex === idx;

            return (
              <button
                key={pillar.id}
                type="button"
                className={`arsenal-tab-btn ${isActive ? 'active' : ''}`}
                onClick={() => setActivePillarIndex(idx)}
                aria-pressed={isActive}
              >
                <span className="tab-idx">0{idx + 1}</span>
                <span className="tab-label">{shortLabel}</span>
              </button>
            );
          })}
        </div>

        {/* 3 Pillars Grid / Mobile Carousel Viewport */}
        <div
          className="arsenal-viewport"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          role="region"
          aria-label="Technical Capabilities Inventory"
        >
          <div
            className="arsenal-track"
            style={{
              '--active-index': activePillarIndex,
            } as React.CSSProperties}
          >
            {initialArsenal.map((pillar, idx) => (
              <article
                key={pillar.id}
                className={`arsenal-pillar hairline-box ${activePillarIndex === idx ? 'is-active-card' : ''}`}
                aria-labelledby={`pillar-${pillar.id}`}
              >
                <div>
                  {/* Pillar Header Meta */}
                  <div className="arsenal-pillar-header font-mono">
                    <span className="arsenal-pillar-index">{pillar.pillarIndex}</span>
                    <span className="arsenal-pillar-code">{pillar.code}</span>
                  </div>

                  {/* Pillar Body */}
                  <div className="arsenal-pillar-body">
                    <h3 id={`pillar-${pillar.id}`} className="arsenal-pillar-title font-display">
                      {pillar.title}
                    </h3>
                    <span className="arsenal-pillar-tagline">
                      “{pillar.tagline}”
                    </span>
                    <p className="arsenal-pillar-desc">
                      {pillar.description}
                    </p>

                    {/* Skills Inventory List */}
                    <ul className="arsenal-skills-list" role="list">
                      {pillar.skills.map((skill) => (
                        <li key={skill.name} className="arsenal-skill-item">
                          <div className="arsenal-skill-header">
                            <span className="arsenal-skill-bullet font-mono" aria-hidden="true">
                              ▸
                            </span>
                            <span className="arsenal-skill-name font-mono">
                              {skill.name}
                            </span>
                          </div>
                          {skill.spec && (
                            <span className="arsenal-skill-spec font-mono">
                              {skill.spec}
                            </span>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Primary Toolchain Tray */}
                <footer className="arsenal-pillar-footer font-mono">
                  <span className="arsenal-tools-heading">PRIMARY TOOLCHAIN //</span>
                  <div className="arsenal-tools-pills">
                    {pillar.tools.map((tool) => (
                      <span key={tool} className="arsenal-tool-pill">
                        {tool}
                      </span>
                    ))}
                  </div>
                </footer>
              </article>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};


