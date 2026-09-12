import React, { useState } from 'react';
import './About.css';

export const About: React.FC = () => {
  const [hasImageError, setHasImageError] = useState(false);

  return (
    <section id="about" className="about-section hairline-b" aria-labelledby="about-heading">
      <div className="container about-grid">
        
        {/* Tactical Archival Portrait / Field Dossier Frame */}
        <figure className="field-dossier" aria-label="Field Explorer Dossier: Syafiq Abiyyu Taqi">
          <header className="field-dossier-header">
            <span className="field-dossier-id font-mono">
              [ FIELD DOSSIER // 001 ]
            </span>
            <span className="field-dossier-coord font-mono">
              7.45° S, 110.51° E · SEMARANG
            </span>
          </header>

          {/* Portrait Container Frame with 1:1 Aspect Ratio */}
          <div className="field-dossier-frame">
            <span className="corner-bracket corner-tl" aria-hidden="true" />
            <span className="corner-bracket corner-tr" aria-hidden="true" />
            <span className="corner-bracket corner-bl" aria-hidden="true" />
            <span className="corner-bracket corner-br" aria-hidden="true" />

            {!hasImageError ? (
              <img
                src="/images/taki-portrait.jpg"
                alt="Syafiq Abiyyu Taqi (Taki / Selvagant) resting in nature foliage"
                className="field-dossier-img"
                width={1080}
                height={1080}
                loading="lazy"
                onError={() => setHasImageError(true)}
              />
            ) : (
              <div className="field-dossier-fallback">
                <div className="field-dossier-reticle font-mono">
                  FIELD
                </div>
                <div style={{ fontWeight: 700, fontSize: 'var(--text-base)', color: 'var(--color-ink)' }}>
                  Syafiq Abiyyu Taqi
                </div>
                <div className="font-mono" style={{ fontSize: 'var(--text-xs)', color: 'var(--color-olive)', marginTop: '4px' }}>
                  ARCHIVE REF // TK-001
                </div>
              </div>
            )}
          </div>

          <figcaption className="field-dossier-caption font-mono">
            <div className="field-dossier-meta-row">
              <span style={{ color: 'var(--color-ink)', fontWeight: 600 }}>
                SUBJECT: SYAFIQ ABIYYU TAQI
              </span>
              <span className="field-dossier-badge">
                <span className="field-dossier-pulse" aria-hidden="true" />
                ACTIVE
              </span>
            </div>
            <div className="field-dossier-meta-row" style={{ color: 'var(--color-ink-muted)' }}>
              <span>ROLE: MOBILE ARCHITECT</span>
              <span>STN: INFORMATIKA UNDIP '23</span>
            </div>
            <div className="field-dossier-stamp">
              <span>SELVAGANT VERIFIED DOSSIER</span>
              <span>SCALE: 1:1 NATURAL</span>
            </div>
          </figcaption>
        </figure>

        {/* Editorial Storytelling & Manifesto */}
        <article className="about-article">
          <header>
            <div className="about-kicker">
              <span className="tag-badge">FIELD BRIEF // 01 · ABOUT SELVAGANT</span>
            </div>
            
            <h2 id="about-heading" className="about-headline font-display">
              The Digital Cartographer<span style={{ color: 'var(--color-olive)' }}>.</span>
            </h2>

            <p className="about-subhead font-mono">
              Syafiq Abiyyu Taqi // Creative Developer & Mobile Architect
            </p>
          </header>

          <p className="about-lead">
            Operating at the intersection of deep systems logic and organic visual taste.
            I engineer resilient mobile architectures and tactile web environments designed to feel grounded, deliberate, and calm.
          </p>

          <p className="about-body">
            Rooted in Computer Science at Universitas Diponegoro (Software Engineering focus) and honed through hands-on leadership at UPPTI Undip, DIGIT, and MADANI. Every interface is treated like an expedition map: discarding unnecessary noise, prioritizing structural clarity, and celebrating thoughtful micro-craftsmanship.
          </p>

          {/* Authentic Manifesto Blockquote from taki-bio-dossier.md */}
          <blockquote className="about-manifesto" cite="resource/specs/taki-bio-dossier.md">
            <span className="about-manifesto-kicker font-mono">[ EXPEDITION MANIFESTO // THE WANDERING SELV ]</span>
            <p className="about-manifesto-quote font-display">
              “Menyusuri daerah yang tak terjamah indra sejarah, tak terjamah pengalaman. Sebagian waktu berusaha, sebagian waktu menyesali keputusan—yang kemudian tersadar sia-sia saja menyesali toh sudah sejauh ini—dan sebagian waktu bersyukur: aku bisa membawa pulang sesuatu dari wilayah eksplorasi sambil berpikir, <em>‘Ternyata tak seburuk itu.’</em>
            </p>
            <p className="about-manifesto-quote font-display" style={{ marginTop: 'var(--space-xs)', fontSize: 'var(--text-sm)', color: 'var(--color-ink-muted)', fontStyle: 'normal' }}>
              Terus berjalan, terus melangkah, karena ‘kita terlalu berharga untuk disia-siakan’.”
            </p>
            <cite className="about-manifesto-cite font-mono">
              — Syafiq Abiyyu Taqi (Taki / Selvagant) · Field Log Reflection
            </cite>
          </blockquote>

          {/* Moniker Etymology & Typography Citation */}
          <aside className="about-moniker" aria-label="Moniker Origin">
            <div className="about-moniker-title">
              <span className="about-moniker-selv font-display">Selv</span>agant
              <span className="about-moniker-subtitle font-mono">
                — The Wandering <span style={{ fontStyle: 'italic', fontWeight: 600 }}>Selv</span>
              </span>
            </div>
            <p className="about-moniker-desc font-mono">
              Rooted in <strong>Solivagant</strong> (one who wanders alone) and <strong>Selva</strong> (the wild forest) + Self-determination. An ongoing exploration of digital craft as conscious self-discovery.
            </p>
          </aside>
        </article>

      </div>
    </section>
  );
};

