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
        {/* Kolom Kiri: Kartu Foto Portrait dengan Footer Dagu Putih Rapi */}
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
            </div>

            {/* Dagu Putih Rapi: Nama TAKI & Syafiq Abiyyu Taqi Bersih Tanpa Bayangan Hitam di Foto */}
            <figcaption className="field-zine-footer">
              <div className="field-zine-identity">
                <span className="field-zine-callname font-display">TAKI</span>
                <span className="field-zine-fullname font-mono">Syafiq Abiyyu Taqi</span>
              </div>
            </figcaption>
          </figure>
        </div>

        {/* Kolom Kanan: Bio Editorial Berbobot & Padat (English) */}
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
              "I build software driven by curiosity and practical problem-solving—ranging from campus mobile platforms and offline-first agro-tech, to browser extensions and AI tools built to solve everyday friction."
            )}
          </p>

          <p className="about-body">
            {renderWords(
              "My focus is simple: understand systems from the ground up, eliminate unnecessary complexity, and engineer software that is genuinely useful."
            )}
          </p>
        </article>
      </div>
    </section>
  );
};
