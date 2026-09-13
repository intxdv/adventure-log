import React, { useState } from 'react';
import { initialArsenal } from '../data/arsenal';
import AccordionGallery from './ui/AccordionGallery';
import type { AccordionGalleryItem } from './ui/AccordionGallery';
import './FieldArsenal.css';

export const FieldArsenal: React.FC = () => {
  const [activePillarIndex, setActivePillarIndex] = useState<number>(0);

  // Map arsenal pillars directly with complete dossier specs
  const galleryItems: AccordionGalleryItem[] = initialArsenal.map((pillar) => ({
    id: pillar.id,
    image: pillar.image || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1200&auto=format&fit=crop',
    label: pillar.title,
    code: pillar.code,
    tagline: pillar.tagline,
    pillarIndex: pillar.pillarIndex,
    description: pillar.description,
    skills: pillar.skills,
    tools: pillar.tools,
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

        {/* Unified GSAP 3D Accordion Gallery with Embedded Dossiers & Vertical Spine Titles */}
        <div className="arsenal-gallery-wrapper">
          <AccordionGallery
            items={galleryItems}
            activeIndex={activePillarIndex}
            onActiveChange={setActivePillarIndex}
            defaultIndex={0}
            expandRatio={0.65}
            height={700}
            radius={4}
            accentColor="var(--color-olive)"
            overlayColor="#121512"
            textColor="#F7F6F2"
            trigger="hover"
            parallax={0.4}
            tilt={5}
            className="arsenal-accordion-gallery"
          />
        </div>

      </div>
    </section>
  );
};

export default FieldArsenal;
