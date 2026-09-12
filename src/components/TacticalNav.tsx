import React, { useEffect, useState } from 'react';
import './TacticalNav.css';

export interface NavSection {
  id: string;
  index: string;
  label: string;
  alt: string;
}

const DEFAULT_SECTIONS: NavSection[] = [
  { id: 'hero', index: '00', label: 'EXPEDITION HERO', alt: '280M' },
  { id: 'about', index: '01', label: 'FIELD LOG / BIO', alt: '850M' },
  { id: 'expeditions', index: '02', label: 'SELECTED LOGS', alt: '1640M' },
  { id: 'arsenal', index: '03', label: 'FIELD ARSENAL', alt: '2280M' },
  { id: 'footer', index: '04', label: 'BASECAMP / ARCHIVE', alt: '3142M' },
];

export const TacticalNav: React.FC<{ sections?: NavSection[] }> = ({ sections = DEFAULT_SECTIONS }) => {
  const [activeId, setActiveId] = useState<string>(sections[0]?.id || 'hero');
  const [scrollPct, setScrollPct] = useState<number>(0);
  const [altimeter, setAltimeter] = useState<number>(280);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY || window.pageYOffset;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const pct = docHeight > 0 ? Math.min(100, Math.max(0, Math.round((scrollY / docHeight) * 100))) : 0;
      setScrollPct(pct);

      // Dynamic altimeter mapping (from 280m to 3142m peak)
      const currentAlt = Math.round(280 + (pct / 100) * (3142 - 280));
      setAltimeter(currentAlt);

      // Detect active section based on proximity to viewport center
      const viewportMid = scrollY + window.innerHeight * 0.4;
      let closestSection = sections[0].id;

      for (const section of sections) {
        const el = document.getElementById(section.id);
        if (el) {
          const top = el.offsetTop;
          if (top <= viewportMid) {
            closestSection = section.id;
          }
        }
      }

      setActiveId(closestSection);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [sections]);

  const handleNavClick = (id: string) => {
    const target = document.getElementById(id);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const currentSection = sections.find((s) => s.id === activeId) || sections[0];

  return (
    <>
      {/* Desktop Vertical Rail */}
      <nav className="tactical-nav-rail" aria-label="Expedition Sections">
        {/* Altimeter Telemetry Header */}
        <div className="tactical-nav-altimeter">
          <span className="alt-label">ALT // ELEV</span>
          <span className="alt-val">+{altimeter}M [{scrollPct}%]</span>
        </div>

        {/* Nav Items on the Vertical Ruler */}
        <div className="tactical-nav-spine">
          {sections.map((sec) => {
            const isActive = activeId === sec.id;

            return (
              <button
                key={sec.id}
                onClick={() => handleNavClick(sec.id)}
                className={`tactical-nav-item ${isActive ? 'active' : ''}`}
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
        <div className="mobile-nav-pill">
          <div className="mobile-nav-telemetry">
            <span className="mobile-alt-val">+{altimeter}M</span>
            <span className="mobile-sec-name">[{currentSection.index}] {currentSection.label.split('/')[0].trim()}</span>
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
