import { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export const useMotionEngine = () => {
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Wait for DOM layout to settle
    const ctx = gsap.context(() => {
      // ======================================================================
      // 1. HERO PINNING & DOT-ZOOM PORTAL TO ABOUT (ANIMASI 2)
      // ======================================================================
      const heroSection = document.getElementById('hero');
      const portalDot = document.getElementById('hero-portal-dot');
      const notchHeader = document.getElementById('top-notch-header');

      if (heroSection && !prefersReducedMotion) {
        // Create an expanding aperture element if not already present
        let portalCircle = document.getElementById('hero-portal-aperture');
        if (!portalCircle) {
          portalCircle = document.createElement('div');
          portalCircle.id = 'hero-portal-aperture';
          portalCircle.style.cssText = `
            position: fixed;
            width: 24px;
            height: 24px;
            border-radius: 50%;
            background-color: var(--color-olive);
            pointer-events: none;
            z-index: 90;
            transform: translate(-50%, -50%) scale(0);
            will-change: transform, opacity;
            opacity: 0;
          `;
          document.body.appendChild(portalCircle);
        }

        const heroTimeline = gsap.timeline({
          scrollTrigger: {
            trigger: heroSection,
            start: 'top top',
            end: '+=120%',
            pin: true,
            scrub: 0.7,
            anticipatePin: 1,
            onUpdate: (self) => {
              // Synchronize portal aperture origin with current dot position
              if (portalDot && portalCircle) {
                const rect = portalDot.getBoundingClientRect();
                if (rect.width > 0) {
                  portalCircle.style.left = `${rect.left + rect.width / 2}px`;
                  portalCircle.style.top = `${rect.top + rect.height / 2}px`;
                }
              }

              // Show or hide Notch Dock based on progress
              if (notchHeader) {
                if (self.progress > 0.75) {
                  notchHeader.classList.add('is-visible');
                  notchHeader.classList.remove('is-hidden');
                } else if (self.progress < 0.3) {
                  notchHeader.classList.remove('is-visible');
                  notchHeader.classList.add('is-hidden');
                }
              }
            },
          },
        });

        // Step 1: Content softens as scroll starts
        heroTimeline.to(
          '.hero-left-col, .hero-right-col',
          {
            opacity: 0.15,
            scale: 0.96,
            duration: 0.35,
            ease: 'power1.out',
          },
          0
        );

        // Step 2: Dot portal aperture appears and expands exponentially to cover screen
        heroTimeline.to(
          portalCircle,
          {
            opacity: 1,
            scale: 160,
            duration: 0.75,
            ease: 'power2.in',
          },
          0.15
        );

        // Step 3: Dissolve the portal circle smoothly to reveal About section
        heroTimeline.to(
          portalCircle,
          {
            opacity: 0,
            duration: 0.3,
            ease: 'power1.out',
          },
          0.85
        );
      }

      // ======================================================================
      // 2. ABOUT -> SELECTED EXPEDITIONS TRANSITION
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
      // 3. SELECTED EXPEDITIONS -> FIELD ARSENAL TRANSITION
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
      // 4. FOOTER MULTI-PLANE PARALLAX CHOREOGRAPHY (SLVGNT + HILLS)
      // ======================================================================
      const footerStage = document.querySelector('.footer-landscape-stage');
      const footerWordmark = document.querySelector('.footer-stage-wordmark');
      const footerBg = document.querySelector('.footer-stage-bg');

      if (footerStage && footerWordmark && !prefersReducedMotion) {
        // Multi-plane parallax:
        // SLVGNT wordmark starts deeper and rises up behind the grassy foreground cutout
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

        // Background landscape sky moves with a gentle, slower rate
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
      // Clean up all GSAP timelines and triggers on unmount
      ctx.revert();
      const aperture = document.getElementById('hero-portal-aperture');
      if (aperture && aperture.parentNode) {
        aperture.parentNode.removeChild(aperture);
      }
    };
  }, []);
};
