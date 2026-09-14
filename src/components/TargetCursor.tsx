import React, { useEffect, useRef, useCallback, useMemo } from 'react';
import { createPortal } from 'react-dom';
import gsap from 'gsap';
import './TargetCursor.css';

export interface TargetCursorProps {
  targetSelector?: string;
  spinDuration?: number;
  hideDefaultCursor?: boolean;
  hoverDuration?: number;
  parallaxOn?: boolean;
  cursorColor?: string;
  cursorColorOnTarget?: string;
  ringSize?: number;
  dotSize?: number;
  dashArray?: string;
}

const getContainingBlock = (element: Element | null): HTMLElement | null => {
  let node = element?.parentElement;
  while (node && node !== document.documentElement) {
    const style = getComputedStyle(node);
    if (
      style.transform !== 'none' ||
      style.perspective !== 'none' ||
      style.filter !== 'none' ||
      style.willChange.includes('transform') ||
      style.willChange.includes('perspective') ||
      style.willChange.includes('filter') ||
      /paint|layout|strict|content/.test(style.contain)
    ) {
      return node as HTMLElement;
    }
    node = node.parentElement;
  }
  return null;
};

const getContainingBlockOffset = (block: HTMLElement | null) => {
  if (!block) return { x: 0, y: 0 };
  const rect = block.getBoundingClientRect();
  return { x: rect.left + block.clientLeft, y: rect.top + block.clientTop };
};

export const TargetCursor: React.FC<TargetCursorProps> = ({
  targetSelector = '.cursor-target',
  spinDuration = 2,
  hideDefaultCursor = true,
  hoverDuration = 0.2,
  parallaxOn = true,
  cursorColor = '#ffffff',
  cursorColorOnTarget,
  ringSize = 34,
  dotSize = 6,
  dashArray = '4 4'
}) => {
  const cursorRef = useRef<HTMLDivElement | null>(null);
  const ringRef = useRef<SVGSVGElement | null>(null);
  const dotRef = useRef<HTMLDivElement | null>(null);
  const cornersRef = useRef<NodeListOf<HTMLDivElement> | null>(null);
  const spinTl = useRef<gsap.core.Timeline | null>(null);
  const containingBlockRef = useRef<HTMLElement | null>(null);

  const isActiveRef = useRef(false);
  const targetCornerPositionsRef = useRef<{ x: number; y: number }[] | null>(null);
  const tickerFnRef = useRef<(() => void) | null>(null);
  const activeStrengthRef = useRef(0);

  const isTouchOnly = useMemo(() => {
    if (typeof window === 'undefined') return false;
    // Hanya nonaktifkan jika perangkat murni sentuh (misal smartphone tanpa mouse)
    const isCoarseOnly =
      window.matchMedia('(pointer: coarse)').matches &&
      !window.matchMedia('(pointer: fine)').matches;
    const isMobileUA = /android|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(
      navigator.userAgent.toLowerCase()
    );
    return isCoarseOnly || (isMobileUA && window.innerWidth <= 768);
  }, []);

  const constants = useMemo(
    () => ({
      borderWidth: 2,
      cornerSize: 12
    }),
    []
  );

  const moveCursor = useCallback((x: number, y: number) => {
    if (!cursorRef.current) return;
    const { x: offsetX, y: offsetY } = getContainingBlockOffset(containingBlockRef.current);
    gsap.to(cursorRef.current, {
      x: x - offsetX,
      y: y - offsetY,
      duration: 0.08,
      ease: 'power3.out'
    });
  }, []);

  useEffect(() => {
    if (isTouchOnly || !cursorRef.current) return;

    // Sembunyikan kursor default jika hideDefaultCursor true
    const originalCursor = document.body.style.cursor;

    if (hideDefaultCursor) {
      document.documentElement.classList.add('target-cursor-active');
      document.body.style.cursor = 'none';
    }

    const cursor = cursorRef.current;
    cornersRef.current = cursor.querySelectorAll('.target-cursor-corner');
    containingBlockRef.current = getContainingBlock(cursor);
    const getOffset = () => getContainingBlockOffset(containingBlockRef.current);

    let activeTarget: Element | null = null;
    let currentLeaveHandler: (() => void) | null = null;
    let resumeTimeout: ReturnType<typeof setTimeout> | null = null;

    const cleanupTarget = (target: Element) => {
      if (currentLeaveHandler) {
        target.removeEventListener('mouseleave', currentLeaveHandler);
      }
      currentLeaveHandler = null;
    };

    const initialOffset = getOffset();
    gsap.set(cursor, {
      xPercent: -50,
      yPercent: -50,
      x: window.innerWidth / 2 - initialOffset.x,
      y: window.innerHeight / 2 - initialOffset.y
    });

    // Inisialisasi putaran lingkaran putus-putus (Gambar 1)
    const createSpinTimeline = () => {
      if (spinTl.current) {
        spinTl.current.kill();
      }
      if (ringRef.current) {
        spinTl.current = gsap
          .timeline({ repeat: -1 })
          .to(ringRef.current, { rotation: '+=360', duration: spinDuration, ease: 'none' });
      }
    };

    createSpinTimeline();

    // Ticker untuk update posisi bidik & efek parallax dinamis saat hover
    const tickerFn = () => {
      if (!targetCornerPositionsRef.current || !cursorRef.current || !cornersRef.current) {
        return;
      }

      const strength = activeStrengthRef.current;
      if (strength === 0) return;

      const cursorX = gsap.getProperty(cursorRef.current, 'x') as number;
      const cursorY = gsap.getProperty(cursorRef.current, 'y') as number;

      const corners = Array.from(cornersRef.current);
      corners.forEach((corner, i) => {
        const currentX = gsap.getProperty(corner, 'x') as number;
        const currentY = gsap.getProperty(corner, 'y') as number;

        const targetX = targetCornerPositionsRef.current![i].x - cursorX;
        const targetY = targetCornerPositionsRef.current![i].y - cursorY;

        const finalX = currentX + (targetX - currentX) * strength;
        const finalY = currentY + (targetY - currentY) * strength;

        const duration = strength >= 0.99 ? (parallaxOn ? 0.2 : 0) : 0.05;

        gsap.to(corner, {
          x: finalX,
          y: finalY,
          duration: duration,
          ease: duration === 0 ? 'none' : 'power1.out',
          overwrite: 'auto'
        });
      });
    };

    tickerFnRef.current = tickerFn;

    const moveHandler = (e: MouseEvent) => moveCursor(e.clientX, e.clientY);
    window.addEventListener('mousemove', moveHandler);

    const scrollHandler = () => {
      if (!activeTarget || !cursorRef.current) return;
      const { x: offsetX, y: offsetY } = getOffset();
      const mouseX = (gsap.getProperty(cursorRef.current, 'x') as number) + offsetX;
      const mouseY = (gsap.getProperty(cursorRef.current, 'y') as number) + offsetY;
      const elementUnderMouse = document.elementFromPoint(mouseX, mouseY);
      const isStillOverTarget =
        elementUnderMouse &&
        (elementUnderMouse === activeTarget || elementUnderMouse.closest(targetSelector) === activeTarget);
      if (!isStillOverTarget) {
        if (currentLeaveHandler) {
          currentLeaveHandler();
        }
      }
    };
    window.addEventListener('scroll', scrollHandler, { passive: true });

    // Efek tekan / mousedown tactile feedback
    const mouseDownHandler = () => {
      if (dotRef.current) {
        gsap.to(dotRef.current, { scale: 0.6, duration: 0.15 });
      }
      if (ringRef.current && !activeTarget) {
        gsap.to(ringRef.current, { scale: 0.85, duration: 0.15 });
      }
    };

    const mouseUpHandler = () => {
      if (dotRef.current) {
        gsap.to(dotRef.current, { scale: 1, duration: 0.25, ease: 'back.out(2)' });
      }
      if (ringRef.current && !activeTarget) {
        gsap.to(ringRef.current, { scale: 1, duration: 0.25, ease: 'back.out(2)' });
      }
    };

    window.addEventListener('mousedown', mouseDownHandler);
    window.addEventListener('mouseup', mouseUpHandler);

    // Handler Hover Masuk ke Elemen Target (.cursor-target)
    const enterHandler = (e: MouseEvent) => {
      const directTarget = e.target as Element | null;
      const target = directTarget ? directTarget.closest(targetSelector) : null;

      if (!target || !cursorRef.current || !cornersRef.current) return;
      if (activeTarget === target) return;

      if (activeTarget) {
        cleanupTarget(activeTarget);
      }
      if (resumeTimeout) {
        clearTimeout(resumeTimeout as number);
        resumeTimeout = null;
      }

      activeTarget = target;
      const corners = Array.from(cornersRef.current);
      corners.forEach(corner => gsap.killTweensOf(corner, 'x,y,opacity'));

      // Saat hover: sembunyikan lingkaran putus-putus dan hentikan putaran
      if (ringRef.current) {
        spinTl.current?.pause();
        gsap.to(ringRef.current, { opacity: 0, scale: 0.5, duration: 0.2, ease: 'power2.out' });
      }

      // Tampilkan 4 sudut penarget
      gsap.to(corners, { opacity: 1, duration: 0.2, ease: 'power2.out' });

      if (cursorColorOnTarget) {
        gsap.to(corners, {
          borderColor: cursorColorOnTarget,
          duration: 0.15,
          ease: 'power2.out'
        });
        if (dotRef.current) {
          gsap.to(dotRef.current, {
            backgroundColor: cursorColorOnTarget,
            duration: 0.15,
            ease: 'power2.out'
          });
        }
      }

      const rect = target.getBoundingClientRect();
      const { borderWidth, cornerSize } = constants;
      const { x: offsetX, y: offsetY } = getOffset();
      const cursorX = gsap.getProperty(cursorRef.current, 'x') as number;
      const cursorY = gsap.getProperty(cursorRef.current, 'y') as number;

      // 4 Posisi Sudut Mengunci Elemen Target
      targetCornerPositionsRef.current = [
        { x: rect.left - borderWidth - offsetX, y: rect.top - borderWidth - offsetY },
        { x: rect.right + borderWidth - cornerSize - offsetX, y: rect.top - borderWidth - offsetY },
        { x: rect.right + borderWidth - cornerSize - offsetX, y: rect.bottom + borderWidth - cornerSize - offsetY },
        { x: rect.left - borderWidth - offsetX, y: rect.bottom + borderWidth - cornerSize - offsetY }
      ];

      isActiveRef.current = true;
      if (tickerFnRef.current) {
        gsap.ticker.add(tickerFnRef.current);
      }

      gsap.to(activeStrengthRef, {
        current: 1,
        duration: hoverDuration,
        ease: 'power2.out'
      });

      corners.forEach((corner, i) => {
        gsap.to(corner, {
          x: targetCornerPositionsRef.current![i].x - cursorX,
          y: targetCornerPositionsRef.current![i].y - cursorY,
          duration: 0.2,
          ease: 'power2.out'
        });
      });

      // Handler Keluar dari Target
      const leaveHandler = () => {
        if (tickerFnRef.current) {
          gsap.ticker.remove(tickerFnRef.current);
        }

        isActiveRef.current = false;
        targetCornerPositionsRef.current = null;
        gsap.set(activeStrengthRef, { current: 0, overwrite: true });
        activeTarget = null;

        if (cursorColorOnTarget && cornersRef.current) {
          gsap.to(Array.from(cornersRef.current), {
            borderColor: cursorColor,
            duration: 0.15,
            ease: 'power2.out'
          });
          if (dotRef.current) {
            gsap.to(dotRef.current, {
              backgroundColor: cursorColor,
              duration: 0.15,
              ease: 'power2.out'
            });
          }
        }

        // Kembalikan 4 sudut ke posisi istirahat dan sembunyikan (opacity 0)
        if (cornersRef.current) {
          const corners = Array.from(cornersRef.current);
          gsap.killTweensOf(corners, 'x,y,opacity');
          const { cornerSize } = constants;
          const restingPositions = [
            { x: -cornerSize * 1.5, y: -cornerSize * 1.5 },
            { x: cornerSize * 0.5, y: -cornerSize * 1.5 },
            { x: cornerSize * 0.5, y: cornerSize * 0.5 },
            { x: -cornerSize * 1.5, y: cornerSize * 0.5 }
          ];

          corners.forEach((corner, index) => {
            gsap.to(corner, {
              x: restingPositions[index].x,
              y: restingPositions[index].y,
              opacity: 0,
              duration: 0.25,
              ease: 'power3.out'
            });
          });
        }

        // Kembalikan lingkaran putus-putus dan lanjutkan rotasi
        if (ringRef.current) {
          gsap.to(ringRef.current, {
            opacity: 1,
            scale: 1,
            duration: 0.25,
            ease: 'power2.out'
          });
        }

        resumeTimeout = setTimeout(() => {
          if (!activeTarget && ringRef.current && spinTl.current) {
            spinTl.current.resume();
          }
          resumeTimeout = null;
        }, 50);

        cleanupTarget(target);
      };

      currentLeaveHandler = leaveHandler;
      target.addEventListener('mouseleave', leaveHandler);
    };

    window.addEventListener('mouseover', enterHandler, { passive: true });

    const resizeHandler = () => {
      containingBlockRef.current = getContainingBlock(cursor);
    };
    window.addEventListener('resize', resizeHandler);

    return () => {
      if (tickerFnRef.current) {
        gsap.ticker.remove(tickerFnRef.current);
      }

      window.removeEventListener('mousemove', moveHandler);
      window.removeEventListener('mouseover', enterHandler);
      window.removeEventListener('scroll', scrollHandler);
      window.removeEventListener('resize', resizeHandler);
      window.removeEventListener('mousedown', mouseDownHandler);
      window.removeEventListener('mouseup', mouseUpHandler);

      if (activeTarget) {
        cleanupTarget(activeTarget);
      }

      spinTl.current?.kill();
      document.body.style.cursor = originalCursor;
      document.documentElement.classList.remove('target-cursor-active');

      isActiveRef.current = false;
      targetCornerPositionsRef.current = null;
      activeStrengthRef.current = 0;
    };
  }, [
    targetSelector,
    spinDuration,
    moveCursor,
    constants,
    hideDefaultCursor,
    isTouchOnly,
    hoverDuration,
    parallaxOn,
    cursorColor,
    cursorColorOnTarget
  ]);

  useEffect(() => {
    if (isTouchOnly || !ringRef.current || !spinTl.current) return;
    if (spinTl.current.isActive()) {
      spinTl.current.kill();
      spinTl.current = gsap
        .timeline({ repeat: -1 })
        .to(ringRef.current, { rotation: '+=360', duration: spinDuration, ease: 'none' });
    }
  }, [spinDuration, isTouchOnly]);

  if (isTouchOnly || typeof document === 'undefined') {
    return null;
  }

  const radius = (ringSize - 3) / 2;

  return createPortal(
    <div ref={cursorRef} className="target-cursor-wrapper" aria-hidden="true">
      {/* 1. Titik Putih di Tengah (Gambar 1) */}
      <div
        ref={dotRef}
        className="target-cursor-dot"
        style={{
          width: dotSize,
          height: dotSize,
          backgroundColor: cursorColor
        }}
      />

      {/* 2. Lingkaran Putus-Putus Berputar di Sekitarnya (Gambar 1 - Putus-putus) */}
      <svg
        ref={ringRef}
        className="target-cursor-ring"
        width={ringSize}
        height={ringSize}
        viewBox={`0 0 ${ringSize} ${ringSize}`}
        style={{
          width: ringSize,
          height: ringSize,
          color: cursorColor
        }}
      >
        <circle
          cx={ringSize / 2}
          cy={ringSize / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeDasharray={dashArray}
        />
      </svg>

      {/* 3. 4 Sudut Pengunci Target (Aktif saat hover .cursor-target) */}
      <div className="target-cursor-corner corner-tl" style={{ borderColor: cursorColor }} />
      <div className="target-cursor-corner corner-tr" style={{ borderColor: cursorColor }} />
      <div className="target-cursor-corner corner-br" style={{ borderColor: cursorColor }} />
      <div className="target-cursor-corner corner-bl" style={{ borderColor: cursorColor }} />
    </div>,
    document.body
  );
};

export default TargetCursor;
