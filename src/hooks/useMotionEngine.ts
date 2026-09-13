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
        // 1d. Camera Obscura 3D Room Formation (t = 3.30 -> 4.00)
        // Gambar 1: Foto jadi abu-abu, memancarkan garis perspektif ke 4 sudut
        // Gambar 2: Dinding kanan terbentuk menjadi wireframe grid 3D room
        // ----------------------------------------------------------------------
        // Foto Taki berubah menjadi monokrom abu-abu kontras tinggi
        portalTimeline.to(
          '#field-zine-portrait-img',
          {
            filter: 'grayscale(100%) contrast(1.15) brightness(0.95)',
            duration: 0.7,
            ease: 'power2.inOut',
          },
          3.30
        );

        // Bio editorial, headline, tag, dan manifesto meredup keluar
        portalTimeline.to(
          '.about-article, .selvagant-reveal-dock',
          {
            opacity: 0,
            y: -25,
            duration: 0.6,
            ease: 'power2.in',
          },
          3.30
        );

        // SVG Wireframe Grid mekar dari 4 sudut kartu menuju sudut viewport
        portalTimeline.fromTo(
          '.expeditions-perspective-grid-svg',
          { opacity: 0, scale: 0.94 },
          {
            opacity: 1,
            scale: 1,
            duration: 0.7,
            ease: 'power2.out',
          },
          3.40
        );

        portalTimeline.to(
          '.perspective-telemetry-bar',
          { opacity: 1, duration: 0.5, ease: 'power2.out' },
          3.60
        );

        // ----------------------------------------------------------------------
        // 1e. 3D Project Cards Traversal (t = 4.00 -> 8.50)
        // Tiap item proyek meluncur di sepanjang dinding kanan, membesar,
        // lalu menembus layar user ke arah kamera!
        // ----------------------------------------------------------------------

        // Card 1: lapor fsm.
        portalTimeline.fromTo(
          '#expedition-3d-card-1',
          { transform: 'translateY(-50%) translate3d(0, 0, -800px) rotateY(-22deg)', opacity: 0 },
          { transform: 'translateY(-50%) translate3d(0, 0, 0px) rotateY(-14deg)', opacity: 1, duration: 0.55, ease: 'power2.out' },
          4.00
        );
        portalTimeline.set('#expedition-3d-card-1', { pointerEvents: 'auto', className: '+=is-in-focus' }, 4.35);
        portalTimeline.set('#expedition-3d-card-1', { pointerEvents: 'none', className: '-=is-in-focus' }, 4.85);
        portalTimeline.to(
          '#expedition-3d-card-1',
          { transform: 'translateY(-50%) translate3d(120px, 0, 750px) rotateY(-8deg)', opacity: 0, duration: 0.55, ease: 'power2.in' },
          4.85
        );

        // Card 2: dipofeed.
        portalTimeline.fromTo(
          '#expedition-3d-card-2',
          { transform: 'translateY(-50%) translate3d(0, 0, -800px) rotateY(-22deg)', opacity: 0 },
          { transform: 'translateY(-50%) translate3d(0, 0, 0px) rotateY(-14deg)', opacity: 1, duration: 0.55, ease: 'power2.out' },
          5.10
        );
        portalTimeline.set('#expedition-3d-card-2', { pointerEvents: 'auto', className: '+=is-in-focus' }, 5.45);
        portalTimeline.set('#expedition-3d-card-2', { pointerEvents: 'none', className: '-=is-in-focus' }, 5.95);
        portalTimeline.to(
          '#expedition-3d-card-2',
          { transform: 'translateY(-50%) translate3d(120px, 0, 750px) rotateY(-8deg)', opacity: 0, duration: 0.55, ease: 'power2.in' },
          5.95
        );

        // Card 3: aware.
        portalTimeline.fromTo(
          '#expedition-3d-card-3',
          { transform: 'translateY(-50%) translate3d(0, 0, -800px) rotateY(-22deg)', opacity: 0 },
          { transform: 'translateY(-50%) translate3d(0, 0, 0px) rotateY(-14deg)', opacity: 1, duration: 0.55, ease: 'power2.out' },
          6.20
        );
        portalTimeline.set('#expedition-3d-card-3', { pointerEvents: 'auto', className: '+=is-in-focus' }, 6.55);
        portalTimeline.set('#expedition-3d-card-3', { pointerEvents: 'none', className: '-=is-in-focus' }, 7.05);
        portalTimeline.to(
          '#expedition-3d-card-3',
          { transform: 'translateY(-50%) translate3d(120px, 0, 750px) rotateY(-8deg)', opacity: 0, duration: 0.55, ease: 'power2.in' },
          7.05
        );

        // Card 4: kagu.
        portalTimeline.fromTo(
          '#expedition-3d-card-4',
          { transform: 'translateY(-50%) translate3d(0, 0, -800px) rotateY(-22deg)', opacity: 0 },
          { transform: 'translateY(-50%) translate3d(0, 0, 0px) rotateY(-14deg)', opacity: 1, duration: 0.55, ease: 'power2.out' },
          7.30
        );
        portalTimeline.set('#expedition-3d-card-4', { pointerEvents: 'auto', className: '+=is-in-focus' }, 7.65);
        portalTimeline.set('#expedition-3d-card-4', { pointerEvents: 'none', className: '-=is-in-focus' }, 8.15);
        portalTimeline.to(
          '#expedition-3d-card-4',
          { transform: 'translateY(-50%) translate3d(120px, 0, 750px) rotateY(-8deg)', opacity: 0, duration: 0.55, ease: 'power2.in' },
          8.15
        );

        // Complete Repository CTA Card
        portalTimeline.fromTo(
          '#perspective-archive-cta',
          { transform: 'translateY(-50%) translate3d(0, 0, -600px) rotateY(-16deg)', opacity: 0 },
          { transform: 'translateY(-50%) translate3d(0, 0, 0px) rotateY(-8deg)', opacity: 1, duration: 0.55, ease: 'power2.out' },
          8.40
        );
        portalTimeline.set('#perspective-archive-cta', { pointerEvents: 'auto', className: '+=is-in-focus' }, 8.70);
        portalTimeline.to(
          '#perspective-archive-cta',
          { opacity: 0, y: -20, duration: 0.4, ease: 'power2.in' },
          9.15
        );

        // ----------------------------------------------------------------------
        // 1f. Whiteout Exposure Bloom (t = 9.15 -> 10.0)
        // Layar gelap meledak lembut menjadi putih terang, menyatu mulus ke Arsenal
        // ----------------------------------------------------------------------
        portalTimeline.fromTo(
          '#expeditions-whiteout-veil',
          { opacity: 0 },
          {
            opacity: 1,
            duration: 0.85,
            ease: 'power2.inOut',
          },
          9.15
        );
      }

      // ======================================================================
      // 4. SELECTED EXPEDITIONS -> FIELD ARSENAL TRANSITION
      // ======================================================================
      const arsenalSection = document.getElementById('field-arsenal');
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
