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
        // Hingga progress 0.65, membesar hingga menutupi seluruh layar kanvas
        heroTimeline.to(
          centerPortal,
          {
            opacity: 1,
            scale: 260,
            duration: 0.65,
            ease: 'power2.in',
          },
          0
        );

        // Step 2: Konten Hero meredup lembut di balik tirai nocturnal
        heroTimeline.to(
          '.hero-body-container, .hero-top-bar',
          {
            opacity: 0,
            duration: 0.35,
            ease: 'power1.out',
          },
          0.1
        );

        // Step 3: Di progress 0.85-1.0 (ketika Section About sudah tiba persis di top: 0),
        // tirai memudar halus mengungkap Section About yang sudah penuh duduk di atas layar!
        heroTimeline.to(
          centerPortal,
          {
            opacity: 0,
            duration: 0.15,
            ease: 'power1.out',
          },
          0.85
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
      // 5. FOOTER MULTI-PLANE PARALLAX CHOREOGRAPHY (SLVGNT + HILLS)
      // ======================================================================
      const footerStage = document.querySelector('.footer-landscape-stage');
      const footerWordmark = document.querySelector('.footer-stage-wordmark');
      const footerBg = document.querySelector('.footer-stage-bg');

      if (footerStage && footerWordmark && !prefersReducedMotion) {
        gsap.fromTo(
          footerWordmark,
          { yPercent: 12 },
          {
            yPercent: -14,
            ease: 'none',
            scrollTrigger: {
              trigger: footerStage,
              start: 'top bottom',
              end: 'bottom bottom',
              scrub: 0.6,
            },
          }
        );

        if (footerBg) {
          gsap.fromTo(
            footerBg,
            { yPercent: 0 },
            {
              yPercent: -6,
              ease: 'none',
              scrollTrigger: {
                trigger: footerStage,
                start: 'top bottom',
                end: 'bottom bottom',
                scrub: 0.4,
              },
            }
          );
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
