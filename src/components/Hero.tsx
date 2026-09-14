import React, { useEffect, useState, useRef, useCallback } from 'react';
import gsap from 'gsap';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import { useWibTime } from '../hooks/useWibTime';
import './Hero.css';

gsap.registerPlugin(ScrollToPlugin);

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

      // Tampilkan Top Bar, Kicker, Compass, dan Phrase Bio secara serempak
      gsap.to('.hero-top-bar', {
        opacity: 1,
        y: 0,
        duration: 0.65,
        ease: 'power2.out',
      });

      gsap.to('.hero-meta-kicker', {
        opacity: 1,
        y: 0,
        duration: 0.65,
        ease: 'power2.out',
      });

      gsap.to('.hero-compass-3d-wrapper', {
        opacity: 0.95,
        duration: 0.85,
        ease: 'power2.out',
      });

      gsap.to('.hero-bio-word', {
        opacity: 1,
        y: 0,
        stagger: 0.075,
        duration: 0.65,
        ease: 'power2.out',
      });

      // 4. Tactical Navigation Entrance Choreography
      gsap.fromTo(
        '.tactical-nav-altimeter',
        { opacity: 0, y: -12 },
        { opacity: 1, y: 0, duration: 0.55, ease: 'power2.out', delay: 0.1 }
      );

      gsap.fromTo(
        '.tactical-nav-item',
        { opacity: 0, x: 26 },
        { opacity: 1, x: 0, stagger: 0.065, duration: 0.55, ease: 'power3.out', delay: 0.15 }
      );

      gsap.fromTo(
        '.tactical-nav-footer',
        { opacity: 0, y: 12 },
        { opacity: 1, y: 0, duration: 0.55, ease: 'power2.out', delay: 0.35 }
      );

      gsap.fromTo(
        '.tactical-nav-mobile',
        { opacity: 0, y: 28 },
        { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out', delay: 0.2 }
      );

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

  // Jeda hening 0.35 detik pasca-preloader, TETAPI jika user mulai gerak (scroll, wheel, touch, keydown),
  // langsung paksa mulai animasinya agar responsif seketika!
  useEffect(() => {
    if (!isAppLoaded) return;

    // Jika user sudah berada di posisi scroll > 15 saat siap, langsung mulai
    if (window.scrollY > 15) {
      startHeroImmediately();
      return;
    }

    startupTimerRef.current = setTimeout(() => {
      startHeroImmediately();
    }, 350); // 0.35 detik jeda responsif pasca-preloader

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
    // Jangan picu transisi jika user mengklik link, tombol, navigasi top bar, atau kompas 3D
    if ((e.target as HTMLElement).closest('a, button, .hero-top-bar, .hero-compass-3d-wrapper, .compass-interactive-hit-area')) return;

    // Jika animasi belum mulai, klik pertama langsung paksa mulai animasinya
    if (!hasStartedLoop) {
      startHeroImmediately();
      return;
    }

    // Jika sudah mulai, klik memicu transisi halus menuju Section About (1.4s tenang & sinematik)
    const stageWrapper = document.getElementById('hero-stage-wrapper');
    const maxScroll = stageWrapper ? stageWrapper.offsetHeight - window.innerHeight : window.innerHeight * 4.8;
    const targetScroll = stageWrapper ? stageWrapper.offsetTop + maxScroll * 0.25 : window.innerHeight * 1.35;

    gsap.to(window, {
      duration: 1.4,
      scrollTo: { y: targetScroll, autoKill: false },
      ease: 'power2.inOut',
    });
  };

  // Navigasi langsung ke section bio (#about) saat tulisan "The Wandering Selv." diklik
  const handleNavigateToBio = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    e.stopPropagation();

    // Pastikan animasi hero dimulai jika user mengklik sebelum timer startup
    startHeroImmediately();

    const stageWrapper = document.getElementById('hero-stage-wrapper');
    if (stageWrapper) {
      const stageTop = stageWrapper.offsetTop;
      const maxScroll = stageWrapper.offsetHeight - window.innerHeight;
      const targetScroll = stageTop + maxScroll * 0.24;

      gsap.to(window, {
        duration: 1.2,
        scrollTo: { y: targetScroll, autoKill: false },
        ease: 'power2.inOut',
      });
      return;
    }

    const aboutSection = document.getElementById('about');
    if (aboutSection) {
      aboutSection.scrollIntoView({ behavior: 'smooth' });
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
      {/* 1. Minimalist Top Bar (Khusus Hero, full bleed edge-to-edge) */}
      <div className={`hero-top-bar ${!hasStartedLoop ? 'is-initial-hidden' : ''} ${isScrolled ? 'is-scrolled' : ''}`}>
        <div className="hero-top-bar-inner">
          <a href="#hero" className="hero-top-logo" aria-label="Selvagant Archive Home">
            <img
              src="/logo/Logo SVG/Logo-text-deep-ink.svg"
              alt="Selvagant"
              className="hero-top-logo-img"
            />
          </a>

          {/* Center Tactical Motto / Datum (Interactive link to Field Log / Bio) */}
          <div className="hero-top-datum font-mono">
            <a
              href="#about"
              onClick={handleNavigateToBio}
              className="hero-top-motto font-serif hero-top-motto-link"
              aria-label="Navigate to Field Log / Bio"
              title="Navigate to Field Log / Bio"
            >
              <span>The Wandering</span>
              <em>Selv.</em>
            </a>
          </div>

          {/* Live WIB Clock murni tanpa label teks */}
          <div className="hero-top-clock font-mono" aria-live="polite">
            {wibTime}
          </div>
        </div>
      </div>

      {/* 2. Hero Body Full-Width Container (1600px Max-Width) */}
      <div className="hero-body-container">
        {/* Kolom Kiri: Judul Dinamis & Bio Editorial */}
        <div className="hero-left-col">
          <div className={`hero-meta-kicker font-mono ${hasStartedLoop ? 'is-visible' : ''}`}>
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
              {hasStartedLoop && <span className="hero-typewriter-cursor" aria-hidden="true" />}
            </h1>
          </div>

          <p className="hero-bio-paragraph font-serif">
            <span className="hero-bio-word">A</span>{' '}
            <span className="hero-bio-word">digital</span>{' '}
            <span className="hero-bio-word">field</span>{' '}
            <span className="hero-bio-word">journal</span>{' '}
            <span className="hero-bio-word">by</span>{' '}
            <span className="hero-bio-word"><strong>Selvagant</strong></span>{' '}
            <span className="hero-bio-word"><strong>(Taki)</strong></span>{' '}
            <span className="hero-bio-word">—</span>{' '}
            <span className="hero-bio-word"><strong>Creative</strong></span>{' '}
            <span className="hero-bio-word"><strong>Developer</strong></span>{' '}
            <span className="hero-bio-word"><strong>&amp;</strong></span>{' '}
            <span className="hero-bio-word"><strong>Mobile</strong></span>{' '}
            <span className="hero-bio-word"><strong>Architect</strong></span>{' '}
            <span className="hero-bio-word">based</span>{' '}
            <span className="hero-bio-word">in</span>{' '}
            <span className="hero-bio-word">Central</span>{' '}
            <span className="hero-bio-word">Java.</span>{' '}
            <span className="hero-bio-word">Bridging</span>{' '}
            <span className="hero-bio-word">analytical</span>{' '}
            <span className="hero-bio-word">software</span>{' '}
            <span className="hero-bio-word">engineering</span>{' '}
            <span className="hero-bio-word">with</span>{' '}
            <span className="hero-bio-word">tactile</span>{' '}
            <span className="hero-bio-word">digital</span>{' '}
            <span className="hero-bio-word">systems</span>{' '}
            <span className="hero-bio-word">and</span>{' '}
            <span className="hero-bio-word">organic</span>{' '}
            <span className="hero-bio-word">exploration.</span>
          </p>
        </div>
      </div>
    </section>
  );
};
