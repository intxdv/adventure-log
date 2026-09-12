import React, { useEffect, useState, useRef, useCallback } from 'react';
import gsap from 'gsap';
import { useWibTime } from '../hooks/useWibTime';
import './Hero.css';

interface FontConfig {
  text: string;
  fontFamily: string;
  fontWeight: number | string;
  fontSize: string;
  letterSpacing?: string;
}

// 8 Variasi Font & Casing terkalibrasi secara optik dengan skala berwibawa & megah
const FONT_SEQUENCE: FontConfig[] = [
  {
    text: 'Adventure Log.',
    fontFamily: 'Hitobito',
    fontWeight: 400,
    fontSize: 'clamp(3.4rem, 6.8vw, 5.8rem)',
    letterSpacing: '0.02em',
  },
  {
    text: 'ADVENTURE LOG.',
    fontFamily: 'Lufga',
    fontWeight: 800,
    fontSize: 'clamp(3.1rem, 6.2vw, 5.2rem)',
    letterSpacing: '-0.02em',
  },
  {
    text: 'ADVENTURE LOG.',
    fontFamily: 'Daydream',
    fontWeight: 400,
    fontSize: 'clamp(2.3rem, 4.6vw, 3.8rem)',
    letterSpacing: '0.04em',
  },
  {
    text: 'ADVENTURE LOG.',
    fontFamily: 'Hitobito',
    fontWeight: 400,
    fontSize: 'clamp(3.1rem, 6.2vw, 5.2rem)',
    letterSpacing: '0.03em',
  },
  {
    text: 'Adventure Log.',
    fontFamily: 'Printvetica',
    fontWeight: 400,
    fontSize: 'clamp(3.3rem, 6.5vw, 5.4rem)',
    letterSpacing: '-0.01em',
  },
  {
    text: 'Adventure Log.',
    fontFamily: 'TBJ Serial Port',
    fontWeight: 400,
    fontSize: 'clamp(2.8rem, 5.6vw, 4.6rem)',
    letterSpacing: '0.02em',
  },
  {
    text: 'Adventure Log.',
    fontFamily: 'Lufga',
    fontWeight: 800,
    fontSize: 'clamp(3.4rem, 6.8vw, 5.8rem)',
    letterSpacing: '-0.01em',
  },
  {
    text: 'ADVENTURE LOG.',
    fontFamily: 'TBJ Serial Port',
    fontWeight: 700,
    fontSize: 'clamp(2.7rem, 5.4vw, 4.4rem)',
    letterSpacing: '0.04em',
  },
];

interface HeroProps {
  isAppLoaded?: boolean;
}

export const Hero: React.FC<HeroProps> = ({ isAppLoaded = true }) => {
  const wibTime = useWibTime();
  const [fontIndex, setFontIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [hasStartedLoop, setHasStartedLoop] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const startupTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Fungsi untuk langsung memulai seluruh animasi Hero tanpa menunggu sisa jeda
  const startHeroImmediately = useCallback(() => {
    setHasStartedLoop((prev) => {
      if (prev) return true;

      if (startupTimerRef.current) {
        clearTimeout(startupTimerRef.current);
        startupTimerRef.current = null;
      }

      // Tampilkan Top Bar dan Phrase Bio secara serempak
      gsap.to('.hero-top-bar', {
        opacity: 1,
        y: 0,
        duration: 0.65,
        ease: 'power2.out',
      });

      gsap.to('.hero-bio-phrase', {
        opacity: 1,
        y: 0,
        stagger: 0.06,
        duration: 0.65,
        ease: 'power2.out',
      });

      return true;
    });
  }, []);

  // Monitor scroll untuk Top Bar visibility
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Jeda hening default 2.2 detik, TETAPI jika user mulai gerak (scroll, wheel, touch, keydown),
  // langsung paksa mulai animasinya agar tidak ada kesan "kosong" saat user buru-buru!
  useEffect(() => {
    if (!isAppLoaded) return;

    // Jika user sudah berada di posisi scroll > 15 saat siap, langsung mulai
    if (window.scrollY > 15) {
      startHeroImmediately();
      return;
    }

    startupTimerRef.current = setTimeout(() => {
      startHeroImmediately();
    }, 2200); // 2.2 detik jeda hening unhurried jika user diam menikmati

    const handleEarlyInteraction = () => {
      startHeroImmediately();
    };

    window.addEventListener('scroll', handleEarlyInteraction, { passive: true, once: true });
    window.addEventListener('wheel', handleEarlyInteraction, { passive: true, once: true });
    window.addEventListener('touchstart', handleEarlyInteraction, { passive: true, once: true });
    window.addEventListener('keydown', handleEarlyInteraction, { passive: true, once: true });

    return () => {
      if (startupTimerRef.current) clearTimeout(startupTimerRef.current);
      window.removeEventListener('scroll', handleEarlyInteraction);
      window.removeEventListener('wheel', handleEarlyInteraction);
      window.removeEventListener('touchstart', handleEarlyInteraction);
      window.removeEventListener('keydown', handleEarlyInteraction);
    };
  }, [isAppLoaded, startHeroImmediately]);

  const handleHeroClick = (e: React.MouseEvent<HTMLElement>) => {
    // Jangan picu transisi jika user mengklik link, tombol, atau navigasi top bar
    if ((e.target as HTMLElement).closest('a, button, .hero-top-bar')) return;

    // Jika animasi belum mulai, klik pertama langsung paksa mulai animasinya
    if (!hasStartedLoop) {
      startHeroImmediately();
      return;
    }

    // Jika sudah mulai, klik memicu transisi halus menuju Section About
    const aboutEl = document.getElementById('about');
    if (aboutEl) {
      aboutEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

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
    <section
      id="hero"
      className="hero-section"
      aria-label="Expedition Hero & Field Entry"
      onClick={handleHeroClick}
    >
      {/* 1. Minimalist Top Bar (Khusus Hero, memudar saat scroll) */}
      <div className={`hero-top-bar ${!hasStartedLoop ? 'is-initial-hidden' : ''} ${isScrolled ? 'is-scrolled' : ''}`}>
        <a href="#hero" className="hero-top-logo" aria-label="Selvagant Archive Home">
          <img
            src="/logo/Logo SVG/Logo-text-deep-ink.svg"
            alt="Selvagant"
            className="hero-top-logo-img"
          />
        </a>

        {/* Center Tactical Motto / Datum */}
        <div className="hero-top-datum font-mono" aria-hidden="true">
          <span className="hero-datum-cross">+</span>
          <span className="hero-top-motto font-serif">
            The Wandering <em>Selv.</em>
          </span>
          <span className="hero-datum-cross">+</span>
        </div>

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
            <span className="hero-bio-phrase">A digital field journal by </span>{' '}
            <span className="hero-bio-phrase"><strong>Selvagant (Taki)</strong> — </span>{' '}
            <span className="hero-bio-phrase"><strong>Creative Developer & Mobile Architect</strong> </span>{' '}
            <span className="hero-bio-phrase">based in Central Java. </span>{' '}
            <span className="hero-bio-phrase">Bridging analytical software engineering </span>{' '}
            <span className="hero-bio-phrase">with tactile digital systems </span>{' '}
            <span className="hero-bio-phrase">and organic exploration.</span>
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
