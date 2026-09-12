import React, { useState } from 'react';
import './About.css';

export const About: React.FC = () => {
  const [hasImageError, setHasImageError] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const toggleDrawer = () => {
    setIsDrawerOpen((prev) => !prev);
  };

  const handleMouseEnter = () => {
    if (typeof window !== 'undefined' && window.matchMedia('(hover: hover)').matches) {
      setIsDrawerOpen(true);
    }
  };

  const handleMouseLeave = () => {
    if (typeof window !== 'undefined' && window.matchMedia('(hover: hover)').matches) {
      setIsDrawerOpen(false);
    }
  };

  return (
    <section
      id="about"
      className="about-section is-nocturne"
      aria-labelledby="about-heading"
    >
      <div className="about-container about-grid">
        
        {/* Left Column: Zine-Style Card Frame (Reference-Inspired) */}
        <div className="field-card-wrapper">
          <figure className="field-zine-card" aria-label="Portrait: Syafiq Abiyyu Taqi">
            <div className="field-zine-frame">
              {!hasImageError ? (
                <img
                  src="/images/taki-portrait.jpg"
                  alt="Syafiq Abiyyu Taqi (Taki / Selvagant) resting in nature foliage"
                  className="field-zine-img"
                  width={1080}
                  height={1080}
                  loading="lazy"
                  onError={() => setHasImageError(true)}
                />
              ) : (
                <div className="field-dossier-fallback">
                  <div className="field-dossier-reticle font-mono">FIELD</div>
                  <div style={{ fontWeight: 700, fontSize: 'var(--text-base)', color: 'var(--color-ink)' }}>
                    TAKI
                  </div>
                  <div className="font-mono" style={{ fontSize: 'var(--text-xs)', color: 'var(--color-olive)', marginTop: '4px' }}>
                    Syafiq Abiyyu Taqi
                  </div>
                </div>
              )}
            </div>

            <figcaption className="field-zine-footer">
              <div className="field-zine-identity">
                <span className="field-zine-callname">TAKI</span>
                <span className="field-zine-fullname">Syafiq Abiyyu Taqi</span>
              </div>
              <div className="field-zine-quote">
                “karena kita terlalu berharga untuk disia-siakan.”
              </div>
            </figcaption>
          </figure>

          {/* Interactive SELVAGANT Display Dock with Click & Hover Disclosure */}
          <div
            className={`selvagant-reveal-dock ${isDrawerOpen ? 'is-expanded' : ''}`}
            tabIndex={0}
            role="button"
            aria-expanded={isDrawerOpen}
            aria-label="Selvagant Moniker Etymology & Meaning - Click to toggle"
            onClick={toggleDrawer}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                toggleDrawer();
              }
            }}
          >
            <div className="selvagant-trigger-row">
              <h3 className="selvagant-hero-word">
                SELVAGANT
              </h3>
            </div>

            {/* Revealed Meaning Drawer */}
            <div className="selvagant-drawer">
              <div className="selvagant-drawer-inner">
                <div className="selvagant-drawer-header font-mono">
                  <span>THE WANDERING <span className="selvagant-selv-accent">Selv</span></span>
                  <span style={{ color: 'var(--color-ink-faint)' }}>// ETYMOLOGY</span>
                </div>
                <p className="selvagant-drawer-body font-mono">
                  Evolved from the Latin <em>Solivagant</em> (one who wanders alone), condensed into <em>Slvgnt</em>, and ultimately forged into <strong>Selvagant</strong> by infusing <strong>Selv</strong>—a deliberate phonetic resonance with <em>Self</em>. A moniker capturing a solitary expedition across software craft, architecture, and conscious self-discovery.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Editorial Storytelling & Manifesto */}
        <article className="about-article">
          <header>
            <div className="about-kicker">
              <span className="tag-badge">FIELD BRIEF // 01 · PROFILE</span>
            </div>
            
            <h2 id="about-heading" className="about-headline font-display">
              Creative Developer &amp; Mobile Architect<span style={{ color: 'var(--color-olive)' }}>.</span>
            </h2>

            <p className="about-subhead font-mono">
              SYAFIQ ABIYYU TAQI // INFORMATIKA UNDIP '23
            </p>
          </header>

          <p className="about-lead">
            Undergraduate Computer Science student at Universitas Diponegoro specializing in Software Engineering.
            I build resilient mobile architectures and tactile web environments where engineering rigor meets calm editorial aesthetics.
          </p>

          <p className="about-body">
            From architecting mobile solutions at UPPTI Undip to leading community initiatives at DIGIT and MADANI, every interface is approached as a deliberate expedition: eliminating unnecessary noise, establishing structural clarity, and honoring the craft.
          </p>

          {/* Authentic Manifesto Blockquote from taki-bio-dossier.md */}
          <blockquote className="about-manifesto" cite="resource/specs/taki-bio-dossier.md">
            <span className="about-manifesto-kicker font-mono">[ EXPEDITION MANIFESTO // FIELD LOG ]</span>
            <p className="about-manifesto-quote font-display">
              “Menyusuri daerah yang tak terjamah indra sejarah, tak terjamah pengalaman. Sebagian waktu berusaha, sebagian waktu menyesali keputusan—hingga tersadar bahwa penyesalan itu sia-sia sambil mengingat alasan berjuang—dan membawa pulang sesuatu dari wilayah eksplorasi sambil berpikir, <em>‘Ternyata tak seburuk itu.’</em>”
            </p>
            <cite className="about-manifesto-cite font-mono">
              — Syafiq Abiyyu Taqi · Catatan Refleksi Eksplorasi
            </cite>
          </blockquote>
        </article>

      </div>
    </section>
  );
};

