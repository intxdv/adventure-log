import React, { useState } from 'react';
import './About.css';

export const About: React.FC = () => {
  const [hasImageError, setHasImageError] = useState(false);

  return (
    <section id="about" className="about-section hairline-b" aria-labelledby="about-heading">
      <div className="container about-grid">
        
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

          {/* Interactive SELVAGANT Display Dock with Hover Meaning Disclosure */}
          <div
            className="selvagant-reveal-dock hairline-box"
            tabIndex={0}
            role="region"
            aria-label="Selvagant Moniker Etymology & Meaning"
          >
            <div className="selvagant-trigger-row">
              <div className="selvagant-hero-word font-display">
                <span className="selvagant-selv-accent">SELV</span>AGANT
              </div>
              <span className="selvagant-cue-tag font-mono">
                [ HOVER FOR MEANING ↘ ]
              </span>
            </div>

            {/* Revealed Meaning Drawer */}
            <div className="selvagant-drawer">
              <div className="selvagant-drawer-inner">
                <div className="selvagant-drawer-header font-mono">
                  <span>THE WANDERING SELV</span>
                  <span style={{ color: 'var(--color-ink-faint)' }}>// ETYMOLOGY</span>
                </div>
                <p className="selvagant-drawer-body font-mono">
                  Rooted in <strong>Solivagant</strong> (one who wanders alone) and <strong>Selva</strong> (the untamed forest) + Self-determination. An ongoing exploration of software systems, mobile architectures, and digital craft as conscious self-discovery.
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

