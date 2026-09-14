import React, { useState, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import { initialArsenal } from '../data/arsenal';
import AccordionGallery from './ui/AccordionGallery';
import type { AccordionGalleryItem } from './ui/AccordionGallery';
import './FieldArsenal.css';

gsap.registerPlugin(ScrollToPlugin);

export const FieldArsenal: React.FC = () => {
  const [activePillarIndex, setActivePillarIndex] = useState<number>(0);

  // Smooth reverse glide from top of Arsenal back into Selected Expeditions (Mockup 3)
  useEffect(() => {
    const arsenalEl = document.getElementById('arsenal');
    const stageWrapper = document.getElementById('hero-stage-wrapper');
    if (!arsenalEl || !stageWrapper) return;

    let isTransitioning = false;
    let timer: ReturnType<typeof setTimeout> | null = null;

    const handleArsenalWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaY) < 18) return;

      const maxScroll = stageWrapper.offsetHeight - window.innerHeight;
      const arsenalTopScroll = stageWrapper.offsetTop + maxScroll;

      // Only intercept if user is at the top edge of Arsenal and scrolls up
      if (e.deltaY < 0 && window.scrollY <= arsenalTopScroll + 8) {
        e.preventDefault();
        if (isTransitioning) return;
        isTransitioning = true;

        const targetScroll = stageWrapper.offsetTop + maxScroll * 0.725;
        gsap.to(window, {
          duration: 1.05,
          scrollTo: { y: targetScroll, autoKill: false },
          ease: 'power2.inOut',
          onComplete: () => {
            if (timer) clearTimeout(timer);
            timer = setTimeout(() => {
              isTransitioning = false;
            }, 200);
          },
        });
      }
    };

    arsenalEl.addEventListener('wheel', handleArsenalWheel, { passive: false });
    return () => {
      arsenalEl.removeEventListener('wheel', handleArsenalWheel);
      if (timer) clearTimeout(timer);
    };
  }, []);

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

  return (
    <section id="arsenal" className="arsenal-section hairline-b" aria-labelledby="arsenal-heading">
      <div className="arsenal-container">

        {/* Section Header: Horizontal Tri-Column Alignment (Badge, Title, Telemetry) */}
        <header className="arsenal-header">
          <div className="arsenal-header-row">
            {/* Left Column: Technical Capabilities Tag Badge */}
            <div className="arsenal-header-left">
              <span className="tag-badge">TECHNICAL CAPABILITIES // 03 · CRAFT</span>
            </div>

            {/* Center Column: Technical Capabilities Headline & Tagline */}
            <div className="arsenal-header-center">
              <h2 id="arsenal-heading" className="arsenal-headline font-display">
                Technical Capabilities<span style={{ color: 'var(--color-olive)' }}>.</span>
              </h2>
              <p className="arsenal-header-tagline font-serif">
                “Tactical toolchains & craft disciplines forged through production expeditions.”
              </p>
            </div>

            {/* Right Column: Inventory Telemetry */}
            <div className="arsenal-header-right font-mono">
              <span className="arsenal-telemetry-meta">
                CORE INVENTORY: 03 PILLARS // 18 SPECS
              </span>
            </div>
          </div>
        </header>

        {/* Tactical Pillar Selector Navigation Bar (Centered) */}
        <div className="arsenal-control-bar font-mono" role="toolbar" aria-label="Capabilities Pillar Navigation">
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
