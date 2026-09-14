import { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export const useMotionEngine = () => {
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let footerMouseMoveHandler: ((e: MouseEvent) => void) | null = null;

    const ctx = gsap.context(() => {
      // 0. Accessible Fallback for Reduced Motion
      if (prefersReducedMotion) {
        gsap.set('#top-notch-header', { opacity: 1, visibility: 'visible' });
      }

      // ======================================================================
      // 1. HERO -> ABOUT CENTER CIRCLE PORTAL TRANSITION (CLIP-PATH BLOOM)
      // ======================================================================
      const stageWrapper = document.getElementById('hero-stage-wrapper');
      const aboutSection = document.getElementById('about');
      const notchHeader = document.getElementById('top-notch-header');
      const expeditionsSection = document.getElementById('expeditions');

      if (stageWrapper && aboutSection) {
        let currentExpIndex = -1;

        const portalTimeline = gsap.timeline({
          scrollTrigger: {
            trigger: stageWrapper,
            start: 'top top',
            end: 'bottom bottom',
            scrub: 0.6,
            onUpdate: (self) => {
              // Coordinate 3D Compass Warp (Hero -> Black Void transition: 0.00 -> 0.11)
              const compassWarp = Math.min(1.0, Math.max(0.0, self.progress / 0.11));
              window.dispatchEvent(
                new CustomEvent('adventure:compass-warp', { detail: { progress: compassWarp } })
              );

              // Coordinate Notch Dock appearance
              if (notchHeader) {
                if (self.progress > 0.08) {
                  notchHeader.classList.add('is-visible');
                  notchHeader.classList.remove('is-hidden');
                } else if (self.progress < 0.03) {
                  notchHeader.classList.remove('is-visible');
                  notchHeader.classList.add('is-hidden');
                }
              }
              // Coordinate About section pointer-events interactivity (hanya aktif saat bio tampil)
              if (self.progress >= 0.15 && self.progress < 0.33) {
                aboutSection.classList.add('is-active');
              } else {
                aboutSection.classList.remove('is-active');
              }

              // Coordinate Expeditions stage visibility & interactivity (aktif saat Section 02 mekar hingga tertutup Section 03)
              if (expeditionsSection) {
                if (self.progress >= 0.34) {
                  expeditionsSection.classList.add('is-active');
                } else {
                  expeditionsSection.classList.remove('is-active');
                }
              }

              // Synchronize 4 Featured Expeditions continuously based on scroll progress (bidirectional & reverse-safe)
              // Calibrated for 520vh stage (effective scroll 420vh):
              // Mock 0: 0.340->0.440, Mock 1: 0.440->0.550, Mock 2: 0.550->0.655, Mock 3: 0.655->0.760
              // At 0.760, Section 4 (Field Arsenal) smoothly slides up over Section 3
              if (self.progress >= 0.34) {
                let targetExp = 0;
                if (self.progress >= 0.655) {
                  targetExp = 3;
                } else if (self.progress >= 0.55) {
                  targetExp = 2;
                } else if (self.progress >= 0.44) {
                  targetExp = 1;
                } else {
                  targetExp = 0;
                }

                if (targetExp !== currentExpIndex) {
                  currentExpIndex = targetExp;
                  window.dispatchEvent(
                    new CustomEvent('adventure:expedition-change', { detail: { index: targetExp } })
                  );
                }
              } else {
                currentExpIndex = -1;
              }
            },
          },
        });

        // 1a. Reset display and ensure bio container is 100% hidden initially
        portalTimeline.set('#about', { display: 'flex', opacity: 0 }, 0);
        portalTimeline.set('.about-container', { opacity: 0 }, 0);

        // Konten kiri Hero (judul & bio) meredup lembut di awal scroll
        portalTimeline.to(
          '.hero-left-col, .hero-top-bar',
          {
            opacity: 0,
            duration: 0.28,
            ease: 'power1.out',
          },
          0.04
        );

        // Background hitam pekat Section 01 (#about) memudar masuk
        // Layar telah 100% solid hitam pekat pada t = 0.85
        portalTimeline.fromTo(
          aboutSection,
          { opacity: 0 },
          {
            opacity: 1,
            duration: 0.65,
            ease: 'power2.inOut',
          },
          0.15
        );

        // ======================================================================
        // TOTAL BLACK VOID (t = 0.85 -> 1.30): Seluruh layar 100% HITAM PEKAT
        // Kompas 3D telah menembus layar & larut. Section Bio BELUM MUNCUL.
        // ======================================================================

        // 1b. Munculkan kontainer bio hanya SETELAH seluruh layar benar-benar hitam (t >= 1.30)
        portalTimeline.to(
          '.about-container',
          {
            opacity: 1,
            duration: 0.25,
            ease: 'power1.out',
          },
          1.30
        );

        // 1c. Entrance Tiap Elemen Section 2 (Muncul berurutan dari kegelapan total)
        portalTimeline.fromTo(
          '.about-kicker',
          { opacity: 0, y: 12 },
          { opacity: 1, y: 0, duration: 0.22, ease: 'power2.out' },
          1.35
        );

        portalTimeline.fromTo(
          '.field-zine-card',
          { opacity: 0, y: 24, scale: 0.96 },
          { opacity: 1, y: 0, scale: 1, duration: 0.35, ease: 'back.out(1.2)' },
          1.38
        );

        // Frame artikel bio di sisi kanan
        portalTimeline.fromTo(
          '.about-article',
          { opacity: 0, y: 14 },
          { opacity: 1, y: 0, duration: 0.30, ease: 'power2.out' },
          1.38
        );

        // Stagger per-kata pada headline Section 2
        portalTimeline.fromTo(
          '.about-headline .about-word',
          { opacity: 0, y: 16 },
          { opacity: 1, y: 0, stagger: 0.025, duration: 0.25, ease: 'power2.out' },
          1.42
        );

        // Stagger per-kata pada bio editorial Section 2
        portalTimeline.fromTo(
          '.about-lead .about-word, .about-body .about-word',
          { opacity: 0, y: 10 },
          { opacity: 1, y: 0, stagger: 0.006, duration: 0.20, ease: 'power2.out' },
          1.50
        );

        // Selvagant emblem logo badge
        portalTimeline.fromTo(
          '.field-zine-logo-badge',
          { opacity: 0, scale: 0.88, y: -8 },
          { opacity: 1, scale: 1, y: 0, duration: 0.20, ease: 'power2.out' },
          1.60
        );

        // ======================================================================
        // JEDA TENANG MEMBACA SECTION 2 (DWELL / RESTING ZONE: t = 1.30 -> 2.40)
        // Dwell zone dioptimalkan (~56vh equivalent) sehingga cukup waktu membaca
        // tanpa menimbulkan rasa scroll yang terlalu lama/lambat.
        // ======================================================================

        // ----------------------------------------------------------------------
        // 1d. White Card Transformation & Viewport Expansion (t = 2.40 -> 3.20)
        // ----------------------------------------------------------------------

        // 1. Foto, badge logo, dan teks dalam frame kartu menghilang (menjadi solid white)
        portalTimeline.to(
          '#field-zine-portrait-img, .field-zine-footer, .field-zine-logo-badge',
          {
            opacity: 0,
            duration: 0.25,
            ease: 'power2.inOut',
          },
          2.40
        );

        // Bio editorial, headline meredup keluar
        portalTimeline.to(
          '.about-article',
          {
            opacity: 0,
            y: -20,
            duration: 0.25,
            ease: 'power2.in',
          },
          2.40
        );

        // 2. Kotak kartu putih membesar memenuhi layar sesuai 4 direksi sudut hingga menutup 100% viewport
        portalTimeline.to(
          '#field-zine-card-elem',
          {
            scale: 28,
            duration: 0.50,
            ease: 'power2.inOut',
          },
          2.55
        );

        // Background putih kanvas Section 02 menyala penuh menutup seluruh layar
        portalTimeline.to(
          '#expeditions-white-canvas',
          {
            opacity: 1,
            duration: 0.45,
            ease: 'power2.inOut',
          },
          2.60
        );

        // Enable visibility & pointer events on expeditions stage tepat saat tertutup sempurna
        portalTimeline.set(
          '#expeditions',
          { visibility: 'visible', pointerEvents: 'auto' },
          3.06
        );

        // Sembunyikan Section 01 (#about) sepenuhnya setelah background putih menutupi 100% layar
        portalTimeline.set('#about', { opacity: 0, visibility: 'hidden', display: 'none' }, 3.08);

        // 3. BARU MUNCUL KONTEN SECTION 02 SETELAH LAYAR TERTUTUP 100% SEMPURNA! (t >= 3.12)
        // Swiss Editorial Showcase Container Fade-In
        portalTimeline.fromTo(
          '#expeditions-swiss-container',
          { opacity: 0, y: 24 },
          {
            opacity: 1,
            y: 0,
            duration: 0.45,
            ease: 'power2.out',
          },
          3.12
        );

        // ----------------------------------------------------------------------
        // 1e. Swiss Editorial Showcase: Timeline pacing (t = 3.20 -> 8.30)
        // Project indexing is synchronized continuously via onUpdate (reverse-scrub safe)
        // ----------------------------------------------------------------------

        // Project 04 stays settled and calm on screen (section 3 tetap di situ)
        // Stationary resting room as Section 4 pulls over it
        portalTimeline.to(
          '#expeditions-swiss-container',
          {
            y: 0,
            duration: 0.50,
            ease: 'none',
          },
          8.20
        );
      }

      // ======================================================================
      // 4. SELECTED EXPEDITIONS -> FIELD ARSENAL TRANSITION (DOSSIER SHEET OVERLAP)
      // ======================================================================
      const arsenalSection = document.getElementById('arsenal') || document.getElementById('field-arsenal');
      if (arsenalSection) {

        // 4c. Centered Header & Tagline Stagger Entrance
        gsap.fromTo(
          '.arsenal-header > *',
          { autoAlpha: 0, y: 28 },
          {
            autoAlpha: 1,
            y: 0,
            stagger: 0.08,
            duration: 0.85,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: arsenalSection,
              start: 'top 80%',
              toggleActions: 'play none none reverse',
            },
          }
        );

        // 4d. Pillar Tab Buttons Stagger Entrance
        gsap.fromTo(
          '.arsenal-tab-btn',
          { autoAlpha: 0, y: 16 },
          {
            autoAlpha: 1,
            y: 0,
            stagger: 0.06,
            duration: 0.55,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: '.arsenal-control-bar',
              start: 'top 85%',
              toggleActions: 'play none none reverse',
            },
          }
        );

        // 4e. Accordion Gallery Panels 3D Stagger Reveal (Curtain Sheet Unfold)
        gsap.fromTo(
          '.ag-panel',
          { autoAlpha: 0, y: 48, scale: 0.96, rotateX: 6 },
          {
            autoAlpha: 1,
            y: 0,
            scale: 1,
            rotateX: 0,
            stagger: 0.14,
            duration: 0.95,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: '.arsenal-gallery-wrapper',
              start: 'top 84%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      }

      // ======================================================================
      // 5. FOOTER MULTI-STAGE ENTRANCE & LAYERED CHOREOGRAPHY
      // ======================================================================
      const footerSection = document.getElementById('footer');
      if (footerSection) {
        // 5a. Marquee Ribbon slide & fade in
        gsap.from('.footer-marquee-ribbon', {
          scrollTrigger: {
            trigger: footerSection,
            start: 'top 92%',
            toggleActions: 'play none none reverse',
          },
          y: -22,
          opacity: 0,
          duration: 1.1,
          ease: 'power2.out',
        });

        // 5b. 4-Column Colophon stagger entrance (Lebih lama dan anggun)
        gsap.from('.footer-identity-col, .footer-journal-col, .footer-col', {
          scrollTrigger: {
            trigger: '.footer-container',
            start: 'top 85%',
            toggleActions: 'play none none reverse',
          },
          y: 40,
          opacity: 0,
          stagger: 0.16,
          duration: 1.0,
          ease: 'power2.out',
        });

        // 5c. Landscape Stage: Multi-layer individual entrances & parallax
        const landscapeStage = document.querySelector('.footer-landscape-stage');
        if (landscapeStage) {
          // Layer 1: Background mountain sky soft zoom & fade
          gsap.from('.footer-landscape-bg', {
            scrollTrigger: {
              trigger: landscapeStage,
              start: 'top bottom+=60',
              toggleActions: 'play none none reverse',
            },
            scale: 1.08,
            opacity: 0,
            duration: 1.6,
            ease: 'power2.out',
          });

          // Layer 3: Foreground hill with mossy CRT monitor
          gsap.from('.footer-landscape-fg', {
            scrollTrigger: {
              trigger: landscapeStage,
              start: 'top bottom',
              toggleActions: 'play none none reverse',
            },
            y: 55,
            opacity: 0,
            duration: 1.3,
            ease: 'power2.out',
          });

          // Layer 2 & 4: Coordinated Finale Timeline (Aktif saat scroll mentok ke paling bawah)
          // 1. SLVGNT turun berurutan dari atas ke balik bukit
          // 2. Setelah SLVGNT selesai mendarat, badge ALL RIGHTS RESERVED naik dari bawah di tengah
          const finaleTimeline = gsap.timeline({
            scrollTrigger: {
              trigger: landscapeStage,
              start: 'bottom-=20 bottom',
              toggleActions: 'play none none reverse',
            },
          });

          // Step 1: SLVGNT vector characters drop down majestically & smoothly from above
          finaleTimeline.fromTo(
            '.slvgnt-char',
            { y: -80, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              stagger: 0.08,
              duration: 1.15,
              ease: 'power3.out',
            },
            0
          );

          // Step 2: Frosted glass copyright badge rises straight up after SLVGNT lands
          finaleTimeline.fromTo(
            '.footer-stage-copyright',
            {
              y: 40,
              opacity: 0,
            },
            {
              y: 0,
              opacity: 1,
              duration: 0.95,
              ease: 'power3.out',
            },
            0.90 // Dimulai tepat saat karakter SLVGNT mendarat mantap
          );

          // Background sky parallax scrub as user scrolls the landscape
          gsap.to('.footer-landscape-bg', {
            yPercent: -5,
            ease: 'none',
            scrollTrigger: {
              trigger: landscapeStage,
              start: 'top bottom',
              end: 'bottom bottom',
              scrub: 0.4,
            },
          });

          // 5d. Interactive 3D Cursor-Dependent Parallax on Landscape Diorama
          // Note: SLVGNT stands firmly anchored as the monumental baseline behind the hills
          const prefersReduced =
            typeof window !== 'undefined' && window.matchMedia
              ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
              : false;

          let isLandscapeVisible = false;
          let landscapeObserver: IntersectionObserver | null = null;
          let updateCachedRect: (() => void) | null = null;

          if (!prefersReduced) {
            const stageEl = landscapeStage as HTMLElement;
            const bgX = gsap.quickTo('.footer-landscape-bg', 'x', { duration: 0.9, ease: 'power2.out' });
            const bgY = gsap.quickTo('.footer-landscape-bg', 'y', { duration: 0.9, ease: 'power2.out' });
            const fgX = gsap.quickTo('.footer-landscape-fg', 'x', { duration: 0.5, ease: 'power2.out' });
            const fgY = gsap.quickTo('.footer-landscape-fg', 'y', { duration: 0.5, ease: 'power2.out' });
            const copyrightX = gsap.quickTo('.footer-stage-copyright', 'x', { duration: 0.4, ease: 'power2.out' });
            const copyrightY = gsap.quickTo('.footer-stage-copyright', 'y', { duration: 0.4, ease: 'power2.out' });

            landscapeObserver = new IntersectionObserver(
              ([entry]) => {
                isLandscapeVisible = entry.isIntersecting;
              },
              { rootMargin: '50px 0px 50px 0px' }
            );
            landscapeObserver.observe(stageEl);

            let cachedRect = stageEl.getBoundingClientRect();
            updateCachedRect = () => {
              if (isLandscapeVisible) {
                cachedRect = stageEl.getBoundingClientRect();
              }
            };
            window.addEventListener('resize', updateCachedRect, { passive: true });
            window.addEventListener('scroll', updateCachedRect, { passive: true });

            const handleFooterMouseMove = (e: MouseEvent) => {
              if (!isLandscapeVisible) return;

              const normX = ((e.clientX - cachedRect.left) / cachedRect.width - 0.5) * 2;
              const normY = ((e.clientY - cachedRect.top) / cachedRect.height - 0.5) * 2;

              bgX(normX * -18);
              bgY(normY * -10);
              fgX(normX * 10);
              fgY(normY * 6);
              copyrightX(normX * 16);
              copyrightY(normY * 12);
            };

            footerMouseMoveHandler = handleFooterMouseMove;
            window.addEventListener('mousemove', footerMouseMoveHandler, { passive: true });
          }
        }
      }
    });

    return () => {
      ctx.revert();
      if (footerMouseMoveHandler) {
        window.removeEventListener('mousemove', footerMouseMoveHandler);
      }
    };
  }, []);
};
