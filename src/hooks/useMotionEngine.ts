import { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export const useMotionEngine = () => {
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let footerMouseMoveHandler: ((e: MouseEvent) => void) | null = null;

    const ctx = gsap.context(() => {
      // 0. Accessible Fallback for Reduced Motion (WCAG 2.3.3 & Level AAA compliance)
      if (prefersReducedMotion) {
        gsap.set('#expeditions-white-canvas, #expeditions-swiss-container', {
          opacity: 1,
          visibility: 'visible',
          y: 0,
        });
        gsap.set('#expeditions', { pointerEvents: 'auto' });
        gsap.set('.arsenal-header > *, .arsenal-tab-btn, .ag-panel', {
          opacity: 1,
          y: 0,
          scale: 1,
        });
        gsap.set('#top-notch-header', { opacity: 1, visibility: 'visible' });
        return;
      }

      // ======================================================================
      // 1. HERO -> ABOUT CENTER CIRCLE PORTAL TRANSITION (CLIP-PATH BLOOM)
      // ======================================================================
      const stageWrapper = document.getElementById('hero-stage-wrapper');
      const aboutSection = document.getElementById('about');
      const notchHeader = document.getElementById('top-notch-header');

      if (stageWrapper && aboutSection) {
        // Scrub the clip-path of Section 2 from circle(0%) to circle(150%)
        // Flow: Clean hero pinned with editorial boxes -> scroll: nocturnal circle blooms to Section 01
        const portalTimeline = gsap.timeline({
          scrollTrigger: {
            trigger: stageWrapper,
            start: 'top top',
            end: 'bottom bottom',
            scrub: 0.6,
            onUpdate: (self) => {
              // Coordinate Notch Dock appearance
              if (notchHeader) {
                if (self.progress > 0.13) {
                  notchHeader.classList.add('is-visible');
                  notchHeader.classList.remove('is-hidden');
                } else if (self.progress < 0.05) {
                  notchHeader.classList.remove('is-visible');
                  notchHeader.classList.add('is-hidden');
                }
              }
              // Coordinate About section pointer-events interactivity (hanya aktif saat bio tampil)
              if (self.progress > 0.12 && self.progress < 0.35) {
                aboutSection.classList.add('is-active');
              } else {
                aboutSection.classList.remove('is-active');
              }
            },
          },
        });

        // 1a. Section 2 mekar melingkar dari titik tengah layar menembus kanvas Hero (t = 0.40 -> 1.45)
        portalTimeline.fromTo(
          aboutSection,
          { clipPath: 'circle(0% at 50% 50%)' },
          {
            clipPath: 'circle(150% at 50% 50%)',
            duration: 1.05,
            ease: 'power2.inOut',
          },
          0.40
        );

        // 1b. Konten Hero meredup lembut di balik mekarnya lingkaran portal nokturnal
        portalTimeline.to(
          '.hero-body-container, .hero-top-bar',
          {
            opacity: 0,
            duration: 0.45,
            ease: 'power1.out',
          },
          0.45
        );

        // 1c. Entrance Tiap Elemen Section 2 (Muncul SETELAH seluruh screen tertutup hijau/gelap)
        // Dimulai pada t = 1.50 setelah lingkaran mekar 100% penuh!
        portalTimeline.fromTo(
          '.about-kicker, .about-subhead',
          { opacity: 0, y: 16 },
          { opacity: 1, y: 0, duration: 0.25, ease: 'power2.out' },
          1.50
        );

        portalTimeline.fromTo(
          '.field-zine-card',
          { opacity: 0, y: 28, scale: 0.94 },
          { opacity: 1, y: 0, scale: 1, duration: 0.35, ease: 'back.out(1.2)' },
          1.55
        );

        // Stagger per-kata pada headline Section 2
        portalTimeline.fromTo(
          '.about-headline .about-word',
          { opacity: 0, y: 18 },
          { opacity: 1, y: 0, stagger: 0.035, duration: 0.25, ease: 'power2.out' },
          1.60
        );

        // Stagger per-kata pada bio editorial Section 2
        portalTimeline.fromTo(
          '.about-lead .about-word, .about-body .about-word',
          { opacity: 0, y: 12 },
          { opacity: 1, y: 0, stagger: 0.006, duration: 0.18, ease: 'power2.out' },
          1.67
        );

        // Selvagant emblem logo badge
        portalTimeline.fromTo(
          '.field-zine-logo-badge',
          { opacity: 0, scale: 0.88, y: -8 },
          { opacity: 1, scale: 1, y: 0, duration: 0.25, ease: 'power2.out' },
          1.75
        );

        portalTimeline.fromTo(
          '.about-tags-row .tag-badge',
          { opacity: 0, y: 10, scale: 0.92 },
          { opacity: 1, y: 0, scale: 1, stagger: 0.04, duration: 0.25, ease: 'power2.out' },
          1.87
        );

        // Kotak manifesto baru mulai muncul setelah SEMUA elemen lain di Section 2 SELESAI TOTAL
        portalTimeline.fromTo(
          '.about-manifesto',
          { opacity: 0, y: 16 },
          { opacity: 1, y: 0, duration: 0.35, ease: 'power2.out' },
          2.35
        );

        // Kicker kutipan manifesto
        portalTimeline.fromTo(
          '.about-manifesto .about-manifesto-kicker',
          { opacity: 0, y: 10 },
          { opacity: 1, y: 0, duration: 0.25, ease: 'power2.out' },
          2.71
        );

        portalTimeline.fromTo(
          '.about-manifesto .about-word, .about-manifesto-cite',
          { opacity: 0, y: 10 },
          { opacity: 1, y: 0, stagger: 0.012, duration: 0.25, ease: 'power2.out' },
          2.97
        );

        // ----------------------------------------------------------------------
        // 1d. White Card Transformation & Viewport Expansion (t = 3.55 -> 4.55)
        // ----------------------------------------------------------------------

        // 1. Foto, badge logo, dan teks dalam frame kartu menghilang (menjadi solid white)
        portalTimeline.to(
          '#field-zine-portrait-img, .field-zine-footer, .field-zine-logo-badge',
          {
            opacity: 0,
            duration: 0.35,
            ease: 'power2.inOut',
          },
          3.55
        );

        // Bio editorial, headline, tag, dan manifesto meredup keluar
        portalTimeline.to(
          '.about-article',
          {
            opacity: 0,
            y: -25,
            duration: 0.35,
            ease: 'power2.in',
          },
          3.55
        );

        // 2. Kotak kartu putih membesar memenuhi layar sesuai 4 direksi sudut
        portalTimeline.to(
          '#field-zine-card-elem',
          {
            scale: 22,
            duration: 0.70,
            ease: 'power2.inOut',
          },
          3.85
        );

        // Background putih kanvas Section 3 menyala penuh
        portalTimeline.to(
          '#expeditions-white-canvas',
          {
            opacity: 1,
            duration: 0.50,
            ease: 'power2.inOut',
          },
          3.95
        );

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
          4.15
        );

        // Enable pointer events on expeditions stage
        portalTimeline.set('#expeditions', { pointerEvents: 'auto' }, 4.35);

        // Sembunyikan About sepenuhnya setelah background putih menutupi 100% layar
        portalTimeline.set('#about', { opacity: 0 }, 4.55);

        // ----------------------------------------------------------------------
        // 1e. Swiss Editorial Showcase: Synchronize 4 Featured Expeditions (t = 4.55 -> 10.65)
        // ----------------------------------------------------------------------

        // Project 01: lapor fsm. (t = 4.55 -> 6.05)
        portalTimeline.call(
          () => {
            window.dispatchEvent(
              new CustomEvent('adventure:expedition-change', { detail: { index: 0 } })
            );
          },
          [],
          4.55
        );

        // Project 02: dipofeed. (t = 6.05 -> 7.55)
        portalTimeline.call(
          () => {
            window.dispatchEvent(
              new CustomEvent('adventure:expedition-change', { detail: { index: 1 } })
            );
          },
          [],
          6.05
        );

        // Project 03: aware. (t = 7.55 -> 9.05)
        portalTimeline.call(
          () => {
            window.dispatchEvent(
              new CustomEvent('adventure:expedition-change', { detail: { index: 2 } })
            );
          },
          [],
          7.55
        );

        // Project 04: kagu. (t = 9.05 -> 10.65)
        portalTimeline.call(
          () => {
            window.dispatchEvent(
              new CustomEvent('adventure:expedition-change', { detail: { index: 3 } })
            );
          },
          [],
          9.05
        );

        // Project 04 stays settled and calm on screen (no blank screen fadeout)
        // Subtle settled breathing room before curtain overlap
        portalTimeline.to(
          '#expeditions-swiss-container',
          {
            y: -8,
            duration: 0.50,
            ease: 'power1.out',
          },
          10.55
        );
      }

      // ======================================================================
      // 4. SELECTED EXPEDITIONS -> FIELD ARSENAL TRANSITION (CURTAIN SHEET OVERLAP)
      // ======================================================================
      const arsenalSection = document.getElementById('arsenal') || document.getElementById('field-arsenal');
      if (arsenalSection) {
        // 4a. Header & Tagline Stagger Entrance
        gsap.fromTo(
          '.arsenal-header > *',
          { opacity: 0, y: 26 },
          {
            opacity: 1,
            y: 0,
            stagger: 0.08,
            duration: 0.75,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: arsenalSection,
              start: 'top 82%',
              toggleActions: 'play none none reverse',
            },
          }
        );

        // 4b. Pillar Tab Buttons Entrance
        gsap.fromTo(
          '.arsenal-tab-btn',
          { opacity: 0, y: 16 },
          {
            opacity: 1,
            y: 0,
            stagger: 0.06,
            duration: 0.55,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: '.arsenal-control-bar',
              start: 'top 86%',
              toggleActions: 'play none none reverse',
            },
          }
        );

        // 4c. Accordion Gallery Panels 3D Stagger Reveal (Curtain Sheet Unfold)
        gsap.fromTo(
          '.ag-panel',
          { opacity: 0, y: 44, scale: 0.95 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            stagger: 0.12,
            duration: 0.85,
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
          const stageEl = landscapeStage as HTMLElement;
          const bgX = gsap.quickTo('.footer-landscape-bg', 'x', { duration: 0.9, ease: 'power2.out' });
          const bgY = gsap.quickTo('.footer-landscape-bg', 'y', { duration: 0.9, ease: 'power2.out' });
          const fgX = gsap.quickTo('.footer-landscape-fg', 'x', { duration: 0.5, ease: 'power2.out' });
          const fgY = gsap.quickTo('.footer-landscape-fg', 'y', { duration: 0.5, ease: 'power2.out' });
          const copyrightX = gsap.quickTo('.footer-stage-copyright', 'x', { duration: 0.4, ease: 'power2.out' });
          const copyrightY = gsap.quickTo('.footer-stage-copyright', 'y', { duration: 0.4, ease: 'power2.out' });

          const handleFooterMouseMove = (e: MouseEvent) => {
            const rect = stageEl.getBoundingClientRect();
            // Hanya aktif saat stage berada di dalam atau dekat viewport
            if (rect.bottom < -100 || rect.top > window.innerHeight + 100) return;

            const normX = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
            const normY = ((e.clientY - rect.top) / rect.height - 0.5) * 2;

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
    });

    return () => {
      ctx.revert();
      if (footerMouseMoveHandler) {
        window.removeEventListener('mousemove', footerMouseMoveHandler);
      }
    };
  }, []);
};
