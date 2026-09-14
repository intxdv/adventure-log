import React, { useEffect, useState, useCallback, useRef } from 'react';
import './TacticalNav.css';

export interface NavSection {
  id: string;
  index: string;
  label: string;
  alt: string;
}

const DEFAULT_SECTIONS: NavSection[] = [
  { id: 'hero', index: '00', label: 'EXPEDITION HERO', alt: '280M' },
  { id: 'about', index: '01', label: 'FIELD BRIEF / BIO', alt: '850M' },
  { id: 'expeditions', index: '02', label: 'SELECTED EXPEDITIONS', alt: '1640M' },
  { id: 'arsenal', index: '03', label: 'TECHNICAL CAPABILITIES', alt: '2280M' },
  { id: 'footer', index: '04', label: 'BASECAMP DISPATCH', alt: '3142M' },
];

const MOBILE_LABELS: Record<string, string> = {
  hero: 'HERO',
  about: 'FIELD BIO',
  expeditions: 'EXPEDITIONS',
  arsenal: 'ARSENAL',
  footer: 'DISPATCH',
};

export const TacticalNav: React.FC<{ sections?: NavSection[] }> = ({ sections = DEFAULT_SECTIONS }) => {
  const [activeId, setActiveId] = useState<string>(sections[0]?.id || 'hero');
  const [scrollPct, setScrollPct] = useState<number>(0);
  const [altimeter, setAltimeter] = useState<number>(280);
  const [navFloatIdx, setNavFloatIdx] = useState<number>(0);
  const [pipCoords, setPipCoords] = useState<number[]>([22, 86, 150, 214, 278]);

  const spineRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);

  const measurePips = useCallback(() => {
    if (!spineRef.current) return;
    const spineRect = spineRef.current.getBoundingClientRect();
    const pipEls = spineRef.current.querySelectorAll('.tactical-nav-pip');
    if (pipEls.length >= sections.length) {
      const coords = Array.from(pipEls).map((pip) => {
        const rect = pip.getBoundingClientRect();
        return rect.top + rect.height / 2 - spineRect.top;
      });
      setPipCoords(coords);
    }
  }, [sections.length]);

  useEffect(() => {
    measurePips();
    const timer = setTimeout(measurePips, 150);

    const handleScroll = () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => {
        const scrollY = window.scrollY || window.pageYOffset;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const pct = docHeight > 0 ? Math.min(100, Math.max(0, Math.round((scrollY / docHeight) * 100))) : 0;
        setScrollPct(pct);

        // Dynamic altimeter mapping (from 280m to 3142m peak)
        const currentAlt = Math.round(280 + (pct / 100) * (3142 - 280));
        setAltimeter(currentAlt);

        const stageWrapper = document.getElementById('hero-stage-wrapper');

        // Continuous float progress across the 5 sections (0.0 -> 4.0)
        let floatProgress = 0;

        if (stageWrapper) {
          const stageTop = stageWrapper.offsetTop;
          const stageHeight = stageWrapper.offsetHeight;
          const maxScroll = stageHeight - window.innerHeight;

          if (scrollY < stageTop + maxScroll) {
            const stageProgress = maxScroll > 0 ? Math.max(0, scrollY - stageTop) / maxScroll : 0;

            if (stageProgress <= 0.19) {
              // 0 (Hero) -> 1 (About)
              floatProgress = Math.min(1.0, stageProgress / 0.19);
            } else if (stageProgress <= 0.44) {
              // 1 (About) -> 2 (Expeditions)
              floatProgress = 1.0 + Math.min(1.0, (stageProgress - 0.19) / 0.25);
            } else if (stageProgress <= 0.76) {
              // Resting in Expeditions 4 mockups
              floatProgress = 2.0;
            } else {
              // 2 (Expeditions) -> 3 (Arsenal)
              floatProgress = 2.0 + Math.min(1.0, (stageProgress - 0.76) / 0.24);
            }
          } else {
            // Past stageWrapper: 3 (Arsenal) -> 4 (Footer)
            const arsenalStart = stageTop + maxScroll;
            const footerDist = Math.max(1, docHeight - arsenalStart);
            const postScroll = Math.min(footerDist, Math.max(0, scrollY - arsenalStart));
            floatProgress = 3.0 + postScroll / footerDist;
          }
        } else {
          floatProgress = docHeight > 0 ? (scrollY / docHeight) * 4.0 : 0;
        }

        const clampedFloat = Math.max(0, Math.min(4.0, floatProgress));
        setNavFloatIdx(clampedFloat);

        // Determine activeId based on rounded threshold for labels & dark theme
        if (clampedFloat < 0.5) {
          setActiveId('hero');
        } else if (clampedFloat < 1.5) {
          setActiveId('about');
        } else if (clampedFloat < 2.5) {
          setActiveId('expeditions');
        } else if (clampedFloat < 3.5) {
          setActiveId('arsenal');
        } else {
          setActiveId('footer');
        }
      });
    };

    const onResize = () => {
      measurePips();
      handleScroll();
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', onResize);
    handleScroll();

    return () => {
      clearTimeout(timer);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', onResize);
    };
  }, [sections, measurePips]);

  const handleNavClick = (id: string) => {
    const stageWrapper = document.getElementById('hero-stage-wrapper');

    if (stageWrapper) {
      const stageTop = stageWrapper.offsetTop;
      const maxScroll = stageWrapper.offsetHeight - window.innerHeight;

      if (id === 'hero') {
        window.scrollTo({ top: stageTop, behavior: 'smooth' });
        return;
      }
      if (id === 'about') {
        // Scroll to About resting/reading zone (progress 0.19)
        window.scrollTo({ top: stageTop + maxScroll * 0.19, behavior: 'smooth' });
        return;
      }
      if (id === 'expeditions') {
        // Scroll to Selected Expeditions stage (progress 0.44 - Mock 0)
        window.scrollTo({ top: stageTop + maxScroll * 0.44, behavior: 'smooth' });
        return;
      }
      if (id === 'arsenal') {
        const targetScroll = stageTop + maxScroll;
        window.scrollTo({ top: targetScroll, behavior: 'smooth' });
        return;
      }
    }

    const target = document.getElementById(id);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const currentSection = sections.find((s) => s.id === activeId) || sections[0];

  // Dynamic coordinates for living spine line
  const currentSegIdx = Math.min(sections.length - 2, Math.floor(navFloatIdx));
  const segFraction = navFloatIdx - currentSegIdx;

  let currentSpineY = pipCoords[0] ?? 22;
  if (pipCoords.length >= sections.length) {
    if (navFloatIdx >= sections.length - 1) {
      currentSpineY = pipCoords[sections.length - 1];
    } else {
      const startY = pipCoords[currentSegIdx];
      const endY = pipCoords[currentSegIdx + 1];
      currentSpineY = startY + segFraction * (endY - startY);
    }
  }

  const activeSegmentStartY = pipCoords[currentSegIdx] ?? currentSpineY;
  const isTransitioning = segFraction > 0.03 && segFraction < 0.97;

  return (
    <>
      {/* Desktop Vertical Rail */}
      <nav className={`tactical-nav-rail ${activeId === 'about' ? 'theme-dark' : ''}`} aria-label="Expedition Sections">
        {/* Altimeter Telemetry Header */}
        <div className="tactical-nav-altimeter">
          <span className="alt-label">ALT // ELEV</span>
          <span className="alt-val">+{altimeter}M [{scrollPct}%]</span>
        </div>

        {/* Nav Items on the Vertical Ruler */}
        <div className="tactical-nav-spine" ref={spineRef}>
          {/* Living Dynamic Spine Line */}
          <svg className="tactical-spine-svg" aria-hidden="true">
            {/* 1. Subtle Inactive Guide Line from first to last pip */}
            {pipCoords.length >= 2 && (
              <line
                x1="5.5"
                y1={pipCoords[0]}
                x2="5.5"
                y2={pipCoords[pipCoords.length - 1]}
                className="tactical-spine-track"
              />
            )}

            {/* 2. Explored Path: Solid Active Line */}
            {pipCoords.length >= 2 && currentSpineY > pipCoords[0] && (
              <line
                x1="5.5"
                y1={pipCoords[0]}
                x2="5.5"
                y2={currentSpineY}
                className="tactical-spine-active-line"
              />
            )}

            {/* 3. Living Active Energy Beam (Between current and next dot) */}
            {pipCoords.length >= 2 && isTransitioning && (
              <>
                <line
                  x1="5.5"
                  y1={activeSegmentStartY}
                  x2="5.5"
                  y2={currentSpineY}
                  className="tactical-spine-living-beam"
                />
                <circle
                  cx="5.5"
                  cy={currentSpineY}
                  r="2.5"
                  className="tactical-spine-beacon"
                />
              </>
            )}
          </svg>

          {sections.map((sec, idx) => {
            const isActive = activeId === sec.id;
            const isApproaching = isTransitioning && currentSegIdx + 1 === idx;

            return (
              <button
                key={sec.id}
                onClick={() => handleNavClick(sec.id)}
                className={`tactical-nav-item cursor-target ${isActive ? 'active' : ''} ${isApproaching ? 'approaching' : ''}`}
                data-hover-reveal="section-reveal"
                data-cursor-label={`GOTO ${sec.index}`}
                aria-label={`Jump to ${sec.label}`}
                aria-current={isActive ? 'true' : undefined}
              >
                {/* Hover Reveal Card */}
                <div className="tactical-nav-reveal">
                  <span className="nav-idx">[{sec.index}]</span>
                  <span className="nav-title">{sec.label}</span>
                </div>

                {/* Pip Marker on Ruler */}
                <div className="tactical-nav-pip" />
              </button>
            );
          })}
        </div>

        {/* Coordinates / Telemetry footer */}
        <div className="tactical-nav-footer">
          SYS.GPS 07.47S // 110.22E
        </div>
      </nav>

      {/* Mobile Floating Telemetry Navigation Dock */}
      <nav className="tactical-nav-mobile font-mono" aria-label="Mobile Section Navigation">
        <div className={`mobile-nav-pill ${activeId === 'about' ? 'theme-dark' : ''}`}>
          <div className="mobile-nav-telemetry">
            <span className="mobile-alt-val">+{altimeter}M</span>
            <span className="mobile-sec-name">[{currentSection.index}] {MOBILE_LABELS[currentSection.id] || currentSection.label}</span>
          </div>
          <div className="mobile-pips-row">
            {sections.map((sec) => (
              <button
                key={sec.id}
                onClick={() => handleNavClick(sec.id)}
                className={`mobile-pip-btn ${activeId === sec.id ? 'active' : ''}`}
                aria-label={`Jump to ${sec.label}`}
                aria-current={activeId === sec.id ? 'true' : undefined}
              >
                <span>{sec.index}</span>
              </button>
            ))}
          </div>
        </div>
      </nav>
    </>
  );
};
