import React, { useState } from 'react';
import { initialArsenal } from '../data/arsenal';
import AccordionGallery from './ui/AccordionGallery';
import type { AccordionGalleryItem } from './ui/AccordionGallery';
import './FieldArsenal.css';

export const FieldArsenal: React.FC = () => {
  const [activePillarIndex, setActivePillarIndex] = useState<number>(0);

  const activePillar = initialArsenal[activePillarIndex] || initialArsenal[0];

  // Map arsenal pillars to AccordionGalleryItems
  const galleryItems: AccordionGalleryItem[] = initialArsenal.map((pillar) => ({
    image: pillar.image || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1200&auto=format&fit=crop',
    label: pillar.title,
    code: pillar.code,
    tagline: pillar.tagline,
    alt: `${pillar.title} - ${pillar.code}`,
  }));

  // Handlers for manual pillar cycling
  const handlePrev = () => {
    setActivePillarIndex((prev) => (prev === 0 ? initialArsenal.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setActivePillarIndex((prev) => (prev === initialArsenal.length - 1 ? 0 : prev + 1));
  };

  return (
    <section id="arsenal" className="arsenal-section hairline-b" aria-labelledby="arsenal-heading">
      <div className="arsenal-container">
        
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

        {/* Tactical Pillar Selector Navigation Bar */}
        <div className="arsenal-control-bar font-mono" role="toolbar" aria-label="Arsenal Pillar Navigation">
          <div className="arsenal-nav-tabs">
            {initialArsenal.map((pillar, idx) => {
              const shortLabel =
                pillar.id === 'creative-web' ? 'WEB & SPATIAL' : pillar.id === 'mobile-craft' ? 'MOBILE ARCH' : 'INTERFACE SYSTEMS';
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

          <div className="arsenal-nav-arrows">
            <button
              type="button"
              className="arsenal-arrow-btn"
              onClick={handlePrev}
              aria-label="Previous technical pillar"
            >
              ← PREV
            </button>
            <span className="arsenal-counter">
              0{activePillarIndex + 1} / 0{initialArsenal.length}
            </span>
            <button
              type="button"
              className="arsenal-arrow-btn"
              onClick={handleNext}
              aria-label="Next technical pillar"
            >
              NEXT →
            </button>
          </div>
        </div>

        {/* Interactive GSAP 3D Accordion Gallery Showcase */}
        <div className="arsenal-gallery-wrapper">
          <AccordionGallery
            items={galleryItems}
            activeIndex={activePillarIndex}
            onActiveChange={setActivePillarIndex}
            defaultIndex={0}
            expandRatio={0.52}
            height={460}
            radius={4}
            accentColor="var(--color-olive)"
            overlayColor="#181A18"
            textColor="#F7F6F2"
            trigger="hover"
            parallax={0.45}
            tilt={6}
            className="arsenal-accordion-gallery"
          />
        </div>

        {/* Synchronized Telemetry Dossier (Master-Detail Capability Inspector) */}
        <div
          key={activePillar.id}
          className="arsenal-dossier-panel hairline-box"
          aria-live="polite"
          aria-atomic="true"
        >
          {/* Dossier Header Meta */}
          <div className="arsenal-dossier-header">
            <div className="arsenal-dossier-meta font-mono">
              <span className="dossier-pillar-idx">{activePillar.pillarIndex}</span>
              <span className="dossier-pillar-sep">/</span>
              <span className="dossier-pillar-code">{activePillar.code}</span>
              <span className="dossier-pillar-badge font-mono">INSPECTION ACTIVE</span>
            </div>

            <div className="arsenal-dossier-title-group">
              <h3 className="arsenal-dossier-title font-display">
                {activePillar.title}
              </h3>
              <p className="arsenal-dossier-tagline">
                “{activePillar.tagline}”
              </p>
              <p className="arsenal-dossier-desc">
                {activePillar.description}
              </p>
            </div>
          </div>

          {/* Capabilities Inventory Grid */}
          <div className="arsenal-dossier-skills-section">
            <div className="arsenal-skills-label font-mono">
              <span>VERIFIED CAPABILITIES (06 SPECS) //</span>
              <span className="skills-sublabel font-mono">PRODUCTION TESTED</span>
            </div>
            <ul className="arsenal-skills-grid" role="list">
              {activePillar.skills.map((skill) => (
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

          {/* Primary Toolchain Tray */}
          <footer className="arsenal-dossier-footer font-mono">
            <span className="arsenal-tools-heading">PRIMARY PRODUCTION TOOLCHAIN //</span>
            <div className="arsenal-tools-pills">
              {activePillar.tools.map((tool) => (
                <span key={tool} className="arsenal-tool-pill">
                  {tool}
                </span>
              ))}
            </div>
          </footer>
        </div>

      </div>
    </section>
  );
};

export default FieldArsenal;
