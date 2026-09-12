import { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export const useMotionEngine = () => {
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

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
            end: 'bottom top',
            scrub: 0.6,
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

              // Pre-trigger nocturnal mode on About section as portal envelops screen
              if (aboutSection) {
                if (self.progress > 0.45) {
                  aboutSection.classList.add('is-nocturne');
                }
              }
            },
          },
        });

        // Step 1: Lingkaran solid nocturnal (#121512) muncul dari tengah layar dan membesar
        // Mengembang menutupi seluruh layar pada progress 0.0 -> 0.70 (scale 320)
        heroTimeline.to(
          centerPortal,
          {
            opacity: 1,
            scale: 320,
            duration: 0.70,
            ease: 'power2.in',
          },
          0
        );

        // Step 2: Konten Hero meredup lembut di awal ekspansi portal
        heroTimeline.to(
          '.hero-body-container, .hero-top-bar',
          {
            opacity: 0,
            duration: 0.28,
            ease: 'power1.out',
          },
          0.05
        );

        // Step 3: Cegah Section About bocor di bawah layar sebelum lingkaran penuh.
        // Section About di-hold hidden & opacity: 0 sampai layar 100% hitam pekat (progress 0.70).
        // Tepat di progress 0.75 - 1.0 (ketika About sudah seated sempurna di top: 0),
        // About diungkapkan secara dramatis dan mulus tanpa merangkak dari bawah!
        if (aboutSection) {
          heroTimeline.fromTo(
            aboutSection,
            {
              opacity: 0,
              visibility: 'hidden',
              pointerEvents: 'none',
            },
            {
              opacity: 1,
              visibility: 'visible',
              pointerEvents: 'auto',
              duration: 0.25,
              ease: 'power2.out',
            },
            0.75
          );
        }

        // Step 4: Di progress 0.88 - 1.0, tirai lingkaran memudar halus
        // mengungkap Section About yang sudah 100% identik latar belakangnya (#121512)
        heroTimeline.to(
          centerPortal,
          {
            opacity: 0,
            duration: 0.12,
            ease: 'power1.out',
          },
          0.88
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
          y: -18,
          opacity: 0,
          duration: 0.7,
          ease: 'power2.out',
        });

        // 5b. 4-Column Colophon stagger entrance
        gsap.from('.footer-identity-col, .footer-journal-col, .footer-col', {
          scrollTrigger: {
            trigger: '.footer-container',
            start: 'top 85%',
            toggleActions: 'play none none reverse',
          },
          y: 35,
          opacity: 0,
          stagger: 0.12,
          duration: 0.8,
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
            scale: 1.06,
            opacity: 0,
            duration: 1.2,
            ease: 'power2.out',
          });

          // Layer 2: Hardcoded SLVGNT individual characters rise up from behind the hill
          gsap.from('.slvgnt-char', {
            scrollTrigger: {
              trigger: landscapeStage,
              start: 'top 82%',
              toggleActions: 'play none none reverse',
            },
            y: 90,
            opacity: 0,
            stagger: 0.08,
            duration: 0.9,
            ease: 'back.out(1.3)',
          });

          // Layer 3: Foreground hill with mossy CRT monitor
          gsap.from('.footer-landscape-fg', {
            scrollTrigger: {
              trigger: landscapeStage,
              start: 'top 84%',
              toggleActions: 'play none none reverse',
            },
            y: 45,
            opacity: 0,
            duration: 0.9,
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
            scale: 0.92,
            delay: 0.35,
            duration: 0.6,
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
        }
      }
    });

    return () => {
      ctx.revert();
      const portal = document.getElementById('hero-center-portal');
      if (portal && portal.parentNode) {
        portal.parentNode.removeChild(portal);
      }
    };
  }, []);
};
