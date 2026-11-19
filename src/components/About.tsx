import React, { useState } from 'react';
import './About.css';

export const About: React.FC = () => {
  const [hasImageError, setHasImageError] = useState(false);

  // Helper untuk membungkus tiap kata dalam span agar animasi GSAP entrance tetap berjalan halus
  const renderWords = (text: string) => {
    return text.split(' ').map((word, idx) => (
      <React.Fragment key={idx}>
        <span className="about-word">{word}</span>{' '}
      </React.Fragment>
    ));
  };

  return (
    <section
      id="about"
      className="about-section is-nocturne"
      aria-labelledby="about-heading"
    >
      <div className="about-container about-grid">
        {/* Kolom Kiri: Kartu Foto Portrait Bersih (Dagu Putih Polaroid Tanpa Teks) */}
        <div className="field-card-wrapper">
          <figure
            id="field-zine-card-elem"
            className="field-zine-card"
            aria-label="Portrait: Syafiq Abiyyu Taqi (Taki)"
          >
            <div className="field-zine-frame">
              <div className="field-zine-img-viewport">
                {!hasImageError ? (
                  <img
                    id="field-zine-portrait-img"
                    src="/images/taki-portrait.webp"
                    alt="Syafiq Abiyyu Taqi (Taki)"
                    className="field-zine-img"
                    width={1080}
                    height={1080}
                    loading="eager"
                    decoding="async"
                    onError={() => setHasImageError(true)}
                  />
                ) : (
                  <div className="field-dossier-fallback">
                    <div style={{ fontWeight: 700, fontSize: 'var(--text-base)', color: 'var(--color-ink)' }}>
                      TAKI
                    </div>
                    <div className="font-mono" style={{ fontSize: 'var(--text-xs)', color: 'var(--color-olive)', marginTop: '4px' }}>
                      Syafiq Abiyyu Taqi
                    </div>
                  </div>
                )}
              </div>

              {/* Selvagant Emblem Logo in Top-Right Corner */}
              <div
                className="field-zine-logo-badge"
                aria-label="Selvagant Logo Emblem"
              >
                <img
                  src="/logo/Logo SVG/Logo-white.svg"
                  alt="Selvagant Logo Emblem"
                  className="field-zine-logo-img"
                  width={72}
                  height={42}
                  loading="lazy"
                  decoding="async"
                />
              </div>

              {/* Minimalist In-Photo TAKI mark on bottom-left sleeve */}
              <div className="field-photo-callname font-display" aria-hidden="true">
                TAKI
              </div>
            </div>
          </figure>
        </div>

        {/* Kolom Kanan: Bio Editorial Humanized (No em-dashes, no AI puffery) */}
        <article className="about-article">
          <header>
            <div className="about-kicker font-mono">
              <span className="about-kicker-tag">[ 01 // ABOUT ]</span>
            </div>
            
            <h2 id="about-heading" className="about-headline font-display">
              {renderWords("Software Developer & Builder.")}
            </h2>
          </header>

          <p className="about-lead">
            {renderWords(
              "I build mobile apps, web extensions, and practical tools. Most of what I make starts with a real problem: an offline feed calculator for rural dairy farmers, campus facility reporting without bureaucracy, or a code-editor EPUB previewer I built because reading raw translation chapters one by one got annoying."
            )}
          </p>

          <p className="about-body">
            {renderWords(
              "I like digging into systems from scratch and keeping code simple so the tool just works."
            )}
          </p>
        </article>
      </div>
    </section>
  );
};
