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
        // directly from center of screen as user scrolls through the stage
        const portalTimeline = gsap.timeline({
          scrollTrigger: {
            trigger: stageWrapper,
            start: 'top top',
            end: '+=100%',
            scrub: 0.6,
            onUpdate: (self) => {
              // Coordinate Notch Dock appearance
              if (notchHeader) {
                if (self.progress > 0.6) {
                  notchHeader.classList.add('is-visible');
                  notchHeader.classList.remove('is-hidden');
                } else if (self.progress < 0.25) {
                  notchHeader.classList.remove('is-visible');
                  notchHeader.classList.add('is-hidden');
                }
              }
              // Coordinate About section pointer-events interactivity
              if (self.progress > 0.5) {
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
            duration: 1,
            ease: 'power2.inOut',
          },
          0
        );

        // 1b. Konten Hero meredup lembut di balik lingkaran nokturnal
        portalTimeline.to(
          '.hero-body-container, .hero-top-bar',
          {
            opacity: 0,
            duration: 0.35,
            ease: 'power1.out',
          },
          0.05
        );

        // 1c. Elemen internal About mekar masuk saat lingkaran terbuka (tidak muncul duluan!)
        portalTimeline.fromTo(
          '.field-zine-card, .about-content-col',
          {
            y: 35,
            opacity: 0,
          },
          {
            y: 0,
            opacity: 1,
            stagger: 0.1,
            duration: 0.45,
            ease: 'power2.out',
          },
          0.35
        );
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
    };
  }, []);
};
