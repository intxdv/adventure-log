import { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export const useMotionEngine = () => {
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let footerMouseMoveHandler: ((e: MouseEvent) => void) | null = null;

    const ctx = gsap.context(() => {
      // ======================================================================
      // 1. HERO -> ABOUT CENTER CIRCLE PORTAL TRANSITION (CLIP-PATH BLOOM)
      // ======================================================================
      const stageWrapper = document.getElementById('hero-stage-wrapper');
      const aboutSection = document.getElementById('about');
      const notchHeader = document.getElementById('top-notch-header');

      if (stageWrapper && aboutSection && !prefersReducedMotion) {
        // Scrub the clip-path of Section 2 from circle(0%) to circle(150%)
        // Ada jeda jarak scroll (42vh) di mana Hero tetap diam & tenang sebelum lingkaran mekar
        const portalTimeline = gsap.timeline({
          scrollTrigger: {
            trigger: stageWrapper,
            start: 'top -42vh',
            end: 'bottom bottom',
            scrub: 0.6,
            onUpdate: (self) => {
              // Coordinate Notch Dock appearance
              if (notchHeader) {
                if (self.progress > 0.12) {
                  notchHeader.classList.add('is-visible');
                  notchHeader.classList.remove('is-hidden');
                } else if (self.progress < 0.05) {
                  notchHeader.classList.remove('is-visible');
                  notchHeader.classList.add('is-hidden');
                }
              }
              // Coordinate About section pointer-events interactivity (hanya aktif saat bio tampil)
              if (self.progress > 0.10 && self.progress < 0.33) {
                aboutSection.classList.add('is-active');
              } else {
                aboutSection.classList.remove('is-active');
              }
            },
          },
        });

        // 1a. Section 2 mekar melingkar dari titik tengah layar menembus kanvas Hero
        portalTimeline.fromTo(
          aboutSection,
          { clipPath: 'circle(0% at 50% 50%)' },
          {
            clipPath: 'circle(150% at 50% 50%)',
            duration: 1.0,
            ease: 'power2.inOut',
          },
          0
        );

        // 1b. Konten Hero meredup lembut di balik lingkaran nokturnal
        portalTimeline.to(
          '.hero-body-container, .hero-top-bar',
          {
            opacity: 0,
            duration: 0.4,
            ease: 'power1.out',
          },
          0.05
        );

        // 1c. Entrance Tiap Elemen Section 2 (Muncul SETELAH seluruh screen tertutup hijau/gelap)
        // Dimulai pada t = 1.05 setelah lingkaran mekar 100% penuh!
        portalTimeline.fromTo(
          '.about-kicker, .about-subhead',
          { opacity: 0, y: 16 },
          { opacity: 1, y: 0, duration: 0.25, ease: 'power2.out' },
          1.05
        );

        portalTimeline.fromTo(
          '.field-zine-card',
          { opacity: 0, y: 28, scale: 0.94 },
          { opacity: 1, y: 0, scale: 1, duration: 0.35, ease: 'back.out(1.2)' },
          1.10
        );

        // Stagger per-kata pada headline Section 2
        portalTimeline.fromTo(
          '.about-headline .about-word',
          { opacity: 0, y: 18 },
          { opacity: 1, y: 0, stagger: 0.035, duration: 0.25, ease: 'power2.out' },
          1.15
        );

        // Stagger per-kata pada bio editorial Section 2 (Selesai sebelum t = 1.76)
        portalTimeline.fromTo(
          '.about-lead .about-word, .about-body .about-word',
          { opacity: 0, y: 12 },
          { opacity: 1, y: 0, stagger: 0.006, duration: 0.18, ease: 'power2.out' },
          1.22
        );

        // Selvagant reveal dock
        portalTimeline.fromTo(
          '.selvagant-reveal-dock',
          { opacity: 0, y: 16 },
          { opacity: 1, y: 0, duration: 0.25, ease: 'power2.out' },
          1.36
        );

        portalTimeline.fromTo(
          '.about-tags-row .tag-badge',
          { opacity: 0, y: 10, scale: 0.92 },
          { opacity: 1, y: 0, scale: 1, stagger: 0.04, duration: 0.25, ease: 'power2.out' },
          1.42
        );

        // TERAKHIR BANGET: Kotak manifesto baru mulai muncul setelah SEMUA elemen lain di Section 2 SELESAI TOTAL
        // Pada t = 1.90 (semua teks bio, card, dock, dan tags sudah 100% diam dan selesai)
        portalTimeline.fromTo(
          '.about-manifesto',
          { opacity: 0, y: 16 },
          { opacity: 1, y: 0, duration: 0.35, ease: 'power2.out' },
          1.90
        );

        // Kicker kutipan manifesto
        portalTimeline.fromTo(
          '.about-manifesto .about-manifesto-kicker',
          { opacity: 0, y: 10 },
          { opacity: 1, y: 0, duration: 0.25, ease: 'power2.out' },
          2.26
        );

        portalTimeline.fromTo(
          '.about-manifesto .about-word, .about-manifesto-cite',
          { opacity: 0, y: 10 },
          { opacity: 1, y: 0, stagger: 0.012, duration: 0.25, ease: 'power2.out' },
          2.52
        );
        // ----------------------------------------------------------------------
        // 1d. White Card Transformation & Viewport Expansion (t = 3.10 -> 4.10)
        // 1. Foto Taki dan tulisan di frame kartu menghilang (menjadi putih solid)
        // 2. Teks editorial & manifesto About meredup keluar
        // 3. Kotak kartu foto membesar mengikuti direksi panah hingga memenuhi layar
        // 4. Latar Section 3 menjadi full putih bersih
        // ----------------------------------------------------------------------

        // 1. Foto dan teks dalam frame kartu menghilang (menjadi solid white)
        portalTimeline.to(
          '#field-zine-portrait-img, .field-zine-footer',
          {
            opacity: 0,
            duration: 0.35,
            ease: 'power2.inOut',
          },
          3.10
        );

        // Bio editorial, headline, tag, dan manifesto meredup keluar
        portalTimeline.to(
          '.about-article, .selvagant-reveal-dock',
          {
            opacity: 0,
            y: -25,
            duration: 0.35,
            ease: 'power2.in',
          },
          3.10
        );

        // 2. Kotak kartu putih membesar memenuhi layar sesuai 4 direksi sudut
        portalTimeline.to(
          '#field-zine-card-elem',
          {
            scale: 22,
            duration: 0.70,
            ease: 'power2.inOut',
          },
          3.40
        );

        // Background putih kanvas Section 3 menyala penuh
        portalTimeline.to(
          '#expeditions-white-canvas',
          {
            opacity: 1,
            duration: 0.50,
            ease: 'power2.inOut',
          },
          3.50
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
          3.70
        );

        // Enable pointer events on expeditions stage
        portalTimeline.set('#expeditions', { pointerEvents: 'auto' }, 3.90);

        // Sembunyikan About sepenuhnya setelah background putih menutupi 100% layar
        portalTimeline.set('#about', { opacity: 0 }, 4.10);

        // ----------------------------------------------------------------------
        // 1e. Swiss Editorial Showcase: Synchronize 4 Featured Expeditions (t = 4.10 -> 10.50)
        // Dispatches custom event to trigger PixelSwap and odometer counter roll
        // ----------------------------------------------------------------------

        // Project 01: lapor fsm. (t = 4.10 -> 5.60)
        portalTimeline.call(
          () => {
            window.dispatchEvent(
              new CustomEvent('adventure:expedition-change', { detail: { index: 0 } })
            );
          },
          [],
          4.10
        );

        // Project 02: dipofeed. (t = 5.60 -> 7.10)
        portalTimeline.call(
          () => {
            window.dispatchEvent(
              new CustomEvent('adventure:expedition-change', { detail: { index: 1 } })
            );
          },
          [],
          5.60
        );

        // Project 03: aware. (t = 7.10 -> 8.60)
        portalTimeline.call(
          () => {
            window.dispatchEvent(
              new CustomEvent('adventure:expedition-change', { detail: { index: 2 } })
            );
          },
          [],
          7.10
        );

        // Project 04: kagu. (t = 8.60 -> 10.20)
        portalTimeline.call(
          () => {
            window.dispatchEvent(
              new CustomEvent('adventure:expedition-change', { detail: { index: 3 } })
            );
          },
          [],
          8.60
        );

        // Smooth handoff into Section 4 (Field Arsenal) (t = 10.20 -> 10.60)
        portalTimeline.to(
          '#expeditions-swiss-container',
          {
            opacity: 0,
            y: -20,
            duration: 0.40,
            ease: 'power2.in',
          },
          10.20
        );
        portalTimeline.set('#expeditions', { pointerEvents: 'none' }, 10.60);
      }

      // ======================================================================
      // 4. SELECTED EXPEDITIONS -> FIELD ARSENAL TRANSITION
      // ======================================================================
      const arsenalSection = document.getElementById('arsenal') || document.getElementById('field-arsenal');
      if (arsenalSection) {
        gsap.from('.arsenal-category-card', {
          scrollTrigger: {
            trigger: arsenalSection,
            start: 'top 78%',
            toggleActions: 'play none none reverse',
          },
          y: 30,
          opacity: 0,
          stagger: 0.1,
          duration: 0.65,
          ease: 'power2.out',
        });
      }

      // ======================================================================
      // 5. FOOTER MULTI-STAGE ENTRANCE & LAYERED CHOREOGRAPHY
      // ======================================================================
      const footerSection = document.getElementById('footer');
      if (footerSection && !prefersReducedMotion) {
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
