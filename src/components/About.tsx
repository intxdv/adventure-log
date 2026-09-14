import React, { useState } from 'react';
import './About.css';

export const About: React.FC = () => {
  const [hasImageError, setHasImageError] = useState(false);
  const [isNoteOpen, setIsNoteOpen] = useState(false);
  const [isManifestoOpen, setIsManifestoOpen] = useState(false);

  const toggleNote = () => {
    setIsNoteOpen((prev) => !prev);
  };

  const handleMouseEnter = () => {
    if (typeof window !== 'undefined' && window.matchMedia('(hover: hover)').matches) {
      setIsNoteOpen(true);
    }
  };

  const handleMouseLeave = () => {
    if (typeof window !== 'undefined' && window.matchMedia('(hover: hover)').matches) {
      setIsNoteOpen(false);
    }
  };

  const toggleManifesto = () => {
    setIsManifestoOpen((prev) => !prev);
  };

  const handleManifestoEnter = () => {
    if (typeof window !== 'undefined' && window.matchMedia('(hover: hover)').matches) {
      setIsManifestoOpen(true);
    }
  };

  const handleManifestoLeave = () => {
    if (typeof window !== 'undefined' && window.matchMedia('(hover: hover)').matches) {
      setIsManifestoOpen(false);
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
          <figure
            id="field-zine-card-elem"
            className="field-zine-card"
            aria-label="Portrait: Syafiq Abiyyu Taqi"
          >
            <div className="field-zine-frame">
              <div className="field-zine-img-viewport">
                {!hasImageError ? (
                  <img
                    id="field-zine-portrait-img"
                    src="/images/taki-portrait.jpg"
                    alt="Syafiq Abiyyu Taqi (Taki / Selvagant) resting in nature foliage"
                    className="field-zine-img"
                    width={1080}
                    height={1080}
                    loading="eager"
                    decoding="async"
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

              {/* Selvagant Emblem Logo in Top-Right Corner (Frameless directly on photo) */}
              <div
                className={`field-zine-logo-badge ${isNoteOpen ? 'is-expanded' : ''}`}
                tabIndex={0}
                role="button"
                aria-label="Selvagant Moniker & Etymology - Hover or tap to view note"
                aria-expanded={isNoteOpen}
                onClick={toggleNote}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                onFocus={() => setIsNoteOpen(true)}
                onBlur={(e) => {
                  if (!e.currentTarget.contains(e.relatedTarget as Node)) {
                    setIsNoteOpen(false);
                  }
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    toggleNote();
                  } else if (e.key === 'Escape') {
                    setIsNoteOpen(false);
                  }
                }}
              >
                <img
                  src="/logo/Logo SVG/Logo-white.svg"
                  alt="Selvagant Logo Emblem"
                  className="field-zine-logo-img"
                  width={48}
                  height={28}
                />

                {/* Floating Etymology Note Popover with Official Logo + Text SVG */}
                <div
                  className="field-zine-note-popover"
                  role="tooltip"
                  aria-hidden={!isNoteOpen}
                >
                  <div className="field-zine-note-brand">
                    <img
                      src="/logo/Logo SVG/Logo-text-white.svg"
                      alt="SELVAGANT"
                      className="field-zine-note-brand-svg"
                      width={160}
                      height={24}
                    />
                    <span className="field-zine-note-tag font-mono">// ETYMOLOGY</span>
                  </div>
                  <div className="field-zine-note-header font-mono">
                    <span>THE WANDERING <span className="selvagant-selv-accent">Selv</span></span>
                  </div>
                  <p className="field-zine-note-body font-mono">
                    Evolved from the Latin <em>Solivagant</em> (one who wanders alone), condensed into <em>Slvgnt</em>, and ultimately forged into <strong>Selvagant</strong> by infusing <strong>Selv</strong>—a deliberate phonetic resonance with <em>Self</em>. A moniker capturing a solitary expedition across software craft, architecture, and conscious self-discovery.
                  </p>
                </div>
              </div>
            </div>

            <figcaption className="field-zine-footer">
              <div className="field-zine-identity">
                <span className="field-zine-callname">TAKI</span>
                <span className="field-zine-fullname">Syafiq Abiyyu Taqi</span>
              </div>
              <div className="field-zine-telemetry font-mono" aria-label="Geographic telemetry and academic coordinates">
                <span className="telemetry-coord">7.45° S, 110.51° E</span>
                <span className="telemetry-origin">MERBABU // TENGARAN, ID</span>
                <span className="telemetry-station">STATION // UNDIP CS '23</span>
              </div>
            </figcaption>
          </figure>
        </div>

        {/* Editorial Storytelling & Manifesto */}
        <article className="about-article">
          <header>
            <div className="about-kicker">
              <span className="tag-badge">FIELD BRIEF // 01 · PROFILE</span>
            </div>
            
            <h2 id="about-heading" className="about-headline font-display">
              <span className="about-word">Creative</span>{' '}
              <span className="about-word">Developer</span>{' '}
              <span className="about-word">&amp;</span>{' '}
              <span className="about-word">Mobile</span>{' '}
              <span className="about-word">Architect<span style={{ color: 'var(--color-olive)' }}>.</span></span>
            </h2>

            <p className="about-subhead font-mono">
              SYAFIQ ABIYYU TAQI // INFORMATIKA UNDIP '23
            </p>
          </header>

          <p className="about-lead">
            <span className="about-word">Undergraduate</span>{' '}
            <span className="about-word">Computer</span>{' '}
            <span className="about-word">Science</span>{' '}
            <span className="about-word">student</span>{' '}
            <span className="about-word">at</span>{' '}
            <span className="about-word">Universitas</span>{' '}
            <span className="about-word">Diponegoro</span>{' '}
            <span className="about-word">specializing</span>{' '}
            <span className="about-word">in</span>{' '}
            <span className="about-word">Software</span>{' '}
            <span className="about-word">Engineering.</span>{' '}
            <span className="about-word">I</span>{' '}
            <span className="about-word">build</span>{' '}
            <span className="about-word">resilient</span>{' '}
            <span className="about-word">mobile</span>{' '}
            <span className="about-word">architectures</span>{' '}
            <span className="about-word">and</span>{' '}
            <span className="about-word">tactile</span>{' '}
            <span className="about-word">web</span>{' '}
            <span className="about-word">environments</span>{' '}
            <span className="about-word">where</span>{' '}
            <span className="about-word">engineering</span>{' '}
            <span className="about-word">rigor</span>{' '}
            <span className="about-word">meets</span>{' '}
            <span className="about-word">calm</span>{' '}
            <span className="about-word">editorial</span>{' '}
            <span className="about-word">aesthetics.</span>
          </p>

          <p className="about-body">
            <span className="about-word">From</span>{' '}
            <span className="about-word">architecting</span>{' '}
            <span className="about-word">mobile</span>{' '}
            <span className="about-word">solutions</span>{' '}
            <span className="about-word">at</span>{' '}
            <span className="about-word">UPPTI</span>{' '}
            <span className="about-word">Undip</span>{' '}
            <span className="about-word">to</span>{' '}
            <span className="about-word">leading</span>{' '}
            <span className="about-word">community</span>{' '}
            <span className="about-word">initiatives</span>{' '}
            <span className="about-word">at</span>{' '}
            <span className="about-word">DIGIT</span>{' '}
            <span className="about-word">and</span>{' '}
            <span className="about-word">MADANI,</span>{' '}
            <span className="about-word">every</span>{' '}
            <span className="about-word">interface</span>{' '}
            <span className="about-word">is</span>{' '}
            <span className="about-word">approached</span>{' '}
            <span className="about-word">as</span>{' '}
            <span className="about-word">a</span>{' '}
            <span className="about-word">deliberate</span>{' '}
            <span className="about-word">expedition:</span>{' '}
            <span className="about-word">eliminating</span>{' '}
            <span className="about-word">unnecessary</span>{' '}
            <span className="about-word">noise,</span>{' '}
            <span className="about-word">establishing</span>{' '}
            <span className="about-word">structural</span>{' '}
            <span className="about-word">clarity,</span>{' '}
            <span className="about-word">and</span>{' '}
            <span className="about-word">honoring</span>{' '}
            <span className="about-word">the</span>{' '}
            <span className="about-word">craft.</span>
          </p>

          {/* Authentic Manifesto Blockquote from taki-bio-dossier.md */}
          <blockquote className="about-manifesto" cite="resource/specs/taki-bio-dossier.md">
            <span className="about-manifesto-kicker font-mono">[ EXPEDITION MANIFESTO // FIELD LOG ]</span>
            <p className="about-manifesto-quote font-display">
              <span className="about-word">“Menyusuri</span>{' '}
              <span className="about-word">daerah</span>{' '}
              <span className="about-word">yang</span>{' '}
              <span className="about-word">tak</span>{' '}
              <span className="about-word">terjamah</span>{' '}
              <span className="about-word">indra</span>{' '}
              <span className="about-word">sejarah,</span>{' '}
              <span className="about-word">tak</span>{' '}
              <span className="about-word">terjamah</span>{' '}
              <span className="about-word">pengalaman.</span>{' '}
              <span className="about-word">Sebagian</span>{' '}
              <span className="about-word">waktu</span>{' '}
              <span className="about-word">berusaha,</span>{' '}
              <span className="about-word">sebagian</span>{' '}
              <span className="about-word">waktu</span>{' '}
              <span className="about-word">menyesali</span>{' '}
              <span className="about-word">keputusan—hingga</span>{' '}
              <span className="about-word">tersadar</span>{' '}
              <span className="about-word">bahwa</span>{' '}
              <span className="about-word">penyesalan</span>{' '}
              <span className="about-word">itu</span>{' '}
              <span className="about-word">sia-sia</span>{' '}
              <span className="about-word">sambil</span>{' '}
              <span className="about-word">mengingat</span>{' '}
              <span className="about-word">alasan</span>{' '}
              <span className="about-word">berjuang—dan</span>{' '}
              <span className="about-word">membawa</span>{' '}
              <span className="about-word">pulang</span>{' '}
              <span className="about-word">sesuatu</span>{' '}
              <span className="about-word">dari</span>{' '}
              <span className="about-word">wilayah</span>{' '}
              <span className="about-word">eksplorasi</span>{' '}
              <span className="about-word">sambil</span>{' '}
              <span className="about-word">berpikir,</span>{' '}
              <span className="about-word"><em>‘Ternyata</em></span>{' '}
              <span className="about-word"><em>tak</em></span>{' '}
              <span className="about-word"><em>seburuk</em></span>{' '}
              <span className="about-word"><em>itu.’</em>”</span>
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

