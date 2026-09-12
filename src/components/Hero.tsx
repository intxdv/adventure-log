import React, { useEffect, useState, useRef } from 'react';
import { useWibTime } from '../hooks/useWibTime';
import './Hero.css';

interface FontConfig {
  text: string;
  fontFamily: string;
  fontWeight: number | string;
  fontSize: string;
  letterSpacing?: string;
}

// 8 Variasi Font & Casing terkalibrasi secara optik agar ukuran tinggi & lebarnya seimbang
const FONT_SEQUENCE: FontConfig[] = [
  {
    text: 'Adventure Log.',
    fontFamily: 'Hitobito',
    fontWeight: 400,
    fontSize: 'clamp(2.4rem, 5vw, 4.3rem)',
    letterSpacing: '0.02em',
  },
  {
    text: 'ADVENTURE LOG.',
    fontFamily: 'Lufga',
    fontWeight: 800,
    fontSize: 'clamp(2.1rem, 4.3vw, 3.8rem)',
    letterSpacing: '-0.02em',
  },
  {
    text: 'ADVENTURE LOG.',
    fontFamily: 'Daydream',
    fontWeight: 400,
    fontSize: 'clamp(1.6rem, 3.2vw, 2.7rem)',
    letterSpacing: '0.04em',
  },
  {
    text: 'ADVENTURE LOG.',
    fontFamily: 'Hitobito',
    fontWeight: 400,
    fontSize: 'clamp(2.1rem, 4.2vw, 3.7rem)',
    letterSpacing: '0.03em',
  },
  {
    text: 'Adventure Log.',
    fontFamily: 'Printvetica',
    fontWeight: 400,
    fontSize: 'clamp(2.2rem, 4.5vw, 3.9rem)',
    letterSpacing: '-0.01em',
  },
  {
    text: 'Adventure Log.',
    fontFamily: 'TBJ Serial Port',
    fontWeight: 400,
    fontSize: 'clamp(1.9rem, 3.8vw, 3.3rem)',
    letterSpacing: '0.02em',
  },
  {
    text: 'Adventure Log.',
    fontFamily: 'Lufga',
    fontWeight: 800,
    fontSize: 'clamp(2.4rem, 5vw, 4.3rem)',
    letterSpacing: '-0.01em',
  },
  {
    text: 'ADVENTURE LOG.',
    fontFamily: 'TBJ Serial Port',
    fontWeight: 700,
    fontSize: 'clamp(1.8rem, 3.6vw, 3.1rem)',
    letterSpacing: '0.04em',
  },
];

interface HeroProps {
  isAppLoaded?: boolean;
}

export const Hero: React.FC<HeroProps> = ({ isAppLoaded = true }) => {
  const wibTime = useWibTime();
  const [fontIndex, setFontIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState(FONT_SEQUENCE[0].text);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [hasStartedLoop, setHasStartedLoop] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Monitor scroll untuk Top Bar visibility
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Delay jeda awal setelah preloader selesai sebelum typewriter mulai
  useEffect(() => {
    if (!isAppLoaded) return;

    const startupTimer = setTimeout(() => {
      setHasStartedLoop(true);
    }, 1200); // Tunggu 1.2 detik dengan tenang agar visitor menyerap tampilan awal

    return () => clearTimeout(startupTimer);
  }, [isAppLoaded]);

  // Animasi 1: Typewriter & Multi-Font Morphing Loop
  useEffect(() => {
    if (!hasStartedLoop) return;

    const currentTarget = FONT_SEQUENCE[fontIndex];
    const fullText = currentTarget.text;

    if (!isDeleting && displayedText === fullText) {
      // Pause saat teks lengkap agar pengunjung menikmati keindahan tipografinya
      timerRef.current = setTimeout(() => {
        setIsDeleting(true);
      }, 2300);
      return () => {
        if (timerRef.current) clearTimeout(timerRef.current);
      };
    }

    if (isDeleting && displayedText === '') {
      // Selesai menghapus, pindah ke font berikutnya dan mulai mengetik
      setIsDeleting(false);
      setFontIndex((prev) => (prev + 1) % FONT_SEQUENCE.length);
      return;
    }

    const typingSpeed = isDeleting ? 36 : 72;
    timerRef.current = setTimeout(() => {
      if (!isDeleting) {
        setDisplayedText(fullText.slice(0, displayedText.length + 1));
      } else {
        setDisplayedText(fullText.slice(0, displayedText.length - 1));
      }
    }, typingSpeed);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [displayedText, isDeleting, fontIndex, hasStartedLoop]);

  const currentFont = FONT_SEQUENCE[fontIndex];
  const hasDot = displayedText.endsWith('.');
  const baseText = hasDot ? displayedText.slice(0, -1) : displayedText;

  return (
    <section id="hero" className="hero-section" aria-label="Expedition Hero & Field Entry">
      {/* 1. Minimalist Top Bar (Khusus Hero, memudar saat scroll) */}
      <div className={`hero-top-bar ${isScrolled ? 'is-scrolled' : ''}`}>
        <a href="#hero" className="hero-top-logo" aria-label="Selvagant Archive Home">
          <img
            src="/logo/Logo SVG/Logo-text-deep-ink.svg"
            alt="Selvagant"
            className="hero-top-logo-img"
          />
        </a>

        {/* Live WIB Clock murni tanpa label teks */}
        <div className="hero-top-clock font-mono" aria-live="polite">
          {wibTime}
        </div>
      </div>

      {/* 2. Hero Body Full-Width Container (1600px Max-Width) */}
      <div className="hero-body-container">
        {/* Kolom Kiri: Judul Dinamis & Bio Editorial */}
        <div className="hero-left-col">
          <div className="hero-meta-kicker font-mono">
            <span>[ 00 // FIELD ARCHIVE & EXPEDITIONS ]</span>
          </div>

          <div className="hero-title-wrapper">
            <h1
              className="hero-dynamic-title"
              style={{
                fontFamily: `'${currentFont.fontFamily}', sans-serif`,
                fontWeight: currentFont.fontWeight,
                fontSize: currentFont.fontSize,
                letterSpacing: currentFont.letterSpacing || 'normal',
              }}
            >
              {baseText}
              {hasDot && (
                <span id="hero-portal-dot" className="hero-portal-dot">
                  .
                </span>
              )}
              <span className="hero-typewriter-cursor" aria-hidden="true" />
            </h1>
          </div>

          <p className="hero-bio-paragraph font-serif">
            A digital field journal by <strong>Selvagant (Taki)</strong> —{' '}
            <strong>Creative Developer & Mobile Architect</strong> based in Central Java.
            Bridging analytical software engineering with tactile digital systems and organic
            exploration.
          </p>
        </div>

        {/* 3. Atmospheric Background Compass Dial (Fixed Position di Layer Belakang) */}
        <div className="hero-compass-backdrop" aria-hidden="true">
          <div className="hero-compass-dial" id="hero-compass-dial">
            <span className="hero-compass-cardinal n">N</span>
            <span className="hero-compass-cardinal e">E</span>
            <span className="hero-compass-cardinal s">S</span>
            <span className="hero-compass-cardinal w">W</span>

            <div className="hero-compass-hub">
              <div className="hero-compass-needle-ring" />
              <span className="hero-compass-label font-mono">COMPASS SENSOR</span>
              <span className="hero-compass-coords font-mono">7.05°S // 110.44°E</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
