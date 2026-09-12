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
      // 1. HERO PINNING & CENTER SOLID CIRCLE PORTAL TO ABOUT
      // ======================================================================
      const stageWrapper = document.getElementById('hero-stage-wrapper') || document.getElementById('hero');
      const aboutSection = document.getElementById('about');
      const notchHeader = document.getElementById('top-notch-header');

      if (stageWrapper && !prefersReducedMotion) {
        // Create solid nocturnal expanding circle anchored at EXACT center of viewport
        let centerPortal = document.getElementById('hero-center-portal');
        if (!centerPortal) {
          centerPortal = document.createElement('div');
          centerPortal.id = 'hero-center-portal';
          centerPortal.style.cssText = `
            position: fixed;
            top: 50vh;
            left: 50vw;
            width: 32px;
            height: 32px;
            border-radius: 50%;
            background-color: #121512;
            pointer-events: none;
            z-index: 95;
            transform: translate(-50%, -50%) scale(0);
            will-change: transform, opacity;
            opacity: 0;
          `;
          document.body.appendChild(centerPortal);
        }

        const heroTimeline = gsap.timeline({
          scrollTrigger: {
            trigger: stageWrapper,
            start: 'top top',
            end: '+=100%',
            pin: true,
            scrub: 0.6,
            anticipatePin: 1,
            onUpdate: (self) => {
              // Coordinate Notch Dock appearance
              if (notchHeader) {
                if (self.progress > 0.8) {
                  notchHeader.classList.add('is-visible');
                  notchHeader.classList.remove('is-hidden');
                } else if (self.progress < 0.25) {
                  notchHeader.classList.remove('is-visible');
                  notchHeader.classList.add('is-hidden');
                }
              }
            },
          },
        });

        // Step 1: Lingkaran solid nocturnal (#121512) muncul dari tengah layar dan membesar
        // Mengembang menutupi seluruh layar pada progress 0.0 -> 0.80 (scale 350)
        heroTimeline.to(
          centerPortal,
          {
            opacity: 1,
            scale: 350,
            duration: 0.80,
            ease: 'power2.in',
          },
          0
        );

        // Step 2: Konten Hero meredup lembut di awal ekspansi portal
        heroTimeline.to(
          '.hero-body-container, .hero-top-bar',
          {
            opacity: 0,
            duration: 0.35,
            ease: 'power1.out',
          },
          0.05
        );

        // Step 3: Di progress 0.90 - 1.0 (saat portal sudah 100% solid gelap dan unpin terjadi),
        // portal memudar halus mengungkap Section About yang berlatar identik #121512
        heroTimeline.to(
          centerPortal,
          {
            opacity: 0,
            duration: 0.1,
            ease: 'power1.out',
          },
          0.9
        );
      }

      // ======================================================================
      // 2. ABOUT SECTION ENTRANCE & CHOREOGRAPHY
      // ======================================================================
      if (aboutSection) {
        gsap.from('.field-zine-card, .about-content-col', {
          scrollTrigger: {
            trigger: aboutSection,
            start: 'top 70%',
            toggleActions: 'play none none reverse',
          },
          y: 35,
          opacity: 0,
          stagger: 0.15,
          duration: 0.8,
          ease: 'power2.out',
        });
      }

      // ======================================================================
      // 3. ABOUT -> SELECTED EXPEDITIONS TRANSITION
      // ======================================================================
      const expeditionsSection = document.getElementById('selected-expeditions');
      if (expeditionsSection) {
        gsap.from('.expeditions-header-block', {
          scrollTrigger: {
            trigger: expeditionsSection,
            start: 'top 82%',
            toggleActions: 'play none none reverse',
          },
          y: 35,
          opacity: 0,
          duration: 0.8,
          ease: 'power2.out',
        });

        const cards = gsap.utils.toArray<HTMLElement>('.expedition-card');
        cards.forEach((card, index) => {
          gsap.from(card, {
            scrollTrigger: {
              trigger: card,
              start: 'top 88%',
              toggleActions: 'play none none reverse',
            },
            y: 40,
            opacity: 0,
            duration: 0.75,
            delay: (index % 2) * 0.15,
            ease: 'power2.out',
          });
        });
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
              start: 'top 88%',
              toggleActions: 'play none none reverse',
            },
            scale: 1.08,
            opacity: 0,
            duration: 1.6,
            ease: 'power2.out',
          });

          // Layer 2: Hardcoded SLVGNT individual characters rise up from behind the hill
          gsap.from('.slvgnt-char', {
            scrollTrigger: {
              trigger: landscapeStage,
              start: 'top 82%',
              toggleActions: 'play none none reverse',
            },
            y: 110,
            opacity: 0,
            stagger: 0.12,
            duration: 1.3,
            ease: 'back.out(1.2)',
          });

          // Layer 3: Foreground hill with mossy CRT monitor
          gsap.from('.footer-landscape-fg', {
            scrollTrigger: {
              trigger: landscapeStage,
              start: 'top 84%',
              toggleActions: 'play none none reverse',
            },
            y: 55,
            opacity: 0,
            duration: 1.3,
            ease: 'power2.out',
          });

          // Layer 4: Frosted glass copyright badge
          gsap.from('.footer-stage-copyright', {
            scrollTrigger: {
              trigger: landscapeStage,
              start: 'top 76%',
              toggleActions: 'play none none reverse',
            },
            opacity: 0,
            scale: 0.90,
            delay: 0.5,
            duration: 0.8,
            ease: 'power2.out',
          });

          // Multi-plane parallax scrub as user scrolls the landscape
          gsap.to('.footer-landscape-wordmark', {
            yPercent: -12,
            ease: 'none',
            scrollTrigger: {
              trigger: landscapeStage,
              start: 'top bottom',
              end: 'bottom bottom',
              scrub: 0.6,
            },
          });

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
          const stageEl = landscapeStage as HTMLElement;
          const bgX = gsap.quickTo('.footer-landscape-bg', 'x', { duration: 0.9, ease: 'power2.out' });
          const bgY = gsap.quickTo('.footer-landscape-bg', 'y', { duration: 0.9, ease: 'power2.out' });
          const wordmarkX = gsap.quickTo('.footer-landscape-wordmark', 'x', { duration: 0.7, ease: 'power2.out' });
          const wordmarkY = gsap.quickTo('.footer-landscape-wordmark', 'y', { duration: 0.7, ease: 'power2.out' });
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
            wordmarkX(normX * 28);
            wordmarkY(normY * 16);
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
      const portal = document.getElementById('hero-center-portal');
      if (portal && portal.parentNode) {
        portal.parentNode.removeChild(portal);
      }
    };
  }, []);
};
