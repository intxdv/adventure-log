import { useRef, useEffect, useState, useCallback } from 'react';
import type { CSSProperties, KeyboardEvent, MouseEvent } from 'react';
import { gsap } from 'gsap';

import './AccordionGallery.css';

export interface AccordionGalleryItem {
  image: string;
  label?: string;
  link?: string;
  alt?: string;
  code?: string;
  tagline?: string;
}

export interface AccordionGalleryProps {
  items?: AccordionGalleryItem[];
  defaultIndex?: number;
  activeIndex?: number;
  onActiveChange?: (index: number) => void;
  accentColor?: string;
  overlayColor?: string;
  textColor?: string;
  height?: number;
  gap?: number;
  radius?: number;
  expandRatio?: number;
  orientation?: 'horizontal' | 'vertical';
  duration?: number;
  ease?: string;
  parallax?: number;
  tilt?: number;
  stagger?: number;
  trigger?: 'hover' | 'click';
  showLabels?: boolean;
  grayscale?: boolean;
  className?: string;
}

const DEFAULT_ITEMS: AccordionGalleryItem[] = [
  { image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1200&auto=format&fit=crop', label: 'Creative Web & Spatial', code: 'GEAR.WEB // 01' },
  { image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=1200&auto=format&fit=crop', label: 'Mobile Architecture', code: 'GEAR.MOBILE // 02' },
  { image: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?q=80&w=1200&auto=format&fit=crop', label: 'Interface Systems', code: 'GEAR.DESIGN // 03' }
];

export const AccordionGallery = ({
  items = DEFAULT_ITEMS,
  defaultIndex = 0,
  activeIndex,
  onActiveChange,
  accentColor = '#4A5844',
  overlayColor = '#181A18',
  textColor = '#F7F6F2',
  height = 440,
  gap = 12,
  radius = 4,
  expandRatio = 0.54,
  orientation = 'horizontal',
  duration = 0.6,
  ease = 'power3.out',
  parallax = 0.45,
  tilt = 6,
  stagger = 0.05,
  trigger = 'hover',
  showLabels = true,
  grayscale = true,
  className = ''
}: AccordionGalleryProps) => {
  const rootRef = useRef<HTMLDivElement>(null);
  const panelRefs = useRef<(HTMLElement | null)[]>([]);
  const mediaRefs = useRef<(HTMLElement | null)[]>([]);
  const barRefs = useRef<(HTMLElement | null)[]>([]);
  const textRefs = useRef<(HTMLElement | null)[]>([]);
  const tlRef = useRef<gsap.core.Timeline | null>(null);
  const firstRunRef = useRef(true);
  const mediaSizeRef = useRef(320);

  const vertical = orientation === 'vertical';
  const count = items.length;
  
  const [internalActive, setInternalActive] = useState<number>(
    Math.min(Math.max(activeIndex !== undefined ? activeIndex : defaultIndex, 0), count - 1)
  );

  const active = activeIndex !== undefined ? activeIndex : internalActive;

  const handleActiveChange = useCallback(
    (index: number) => {
      const clamped = Math.min(Math.max(index, 0), count - 1);
      setInternalActive(clamped);
      onActiveChange?.(clamped);
    },
    [count, onActiveChange]
  );

  const prefersReduced =
    typeof window !== 'undefined' && window.matchMedia
      ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
      : false;

  const applyLayout = useCallback(
    (animate: boolean) => {
      const panels = panelRefs.current;
      if (!panels.length) return;

      const r = Math.min(Math.max(expandRatio, 0.2), 0.9);
      const grow = count > 1 ? (r * (count - 1)) / (1 - r) : 1;
      const mediaSize = mediaSizeRef.current;

      tlRef.current?.kill();
      const dur = animate && !prefersReduced ? duration : 0;
      const tl = gsap.timeline();

      panels.forEach((panel, i) => {
        if (!panel) return;
        const isActive = i === active;
        const media = mediaRefs.current[i];
        const bar = barRefs.current[i];
        const text = textRefs.current[i];

        const rot = isActive ? 0 : i < active ? tilt : -tilt;
        const rotProp = vertical ? { rotateX: -rot } : { rotateY: rot };

        tl.to(panel, { flexGrow: isActive ? grow : 1, ...rotProp, duration: dur, ease }, 0);

        if (media) {
          const drift = Math.max(-1.5, Math.min(1.5, active - i));
          const shift = drift * parallax * mediaSize * 0.06;
          const gray = grayscale ? (isActive ? 0 : 0.85) : 0;
          tl.to(
            media,
            {
              xPercent: -50,
              yPercent: -50,
              x: vertical ? 0 : isActive ? 0 : shift,
              y: vertical ? (isActive ? 0 : shift) : 0,
              '--ag-gray': gray,
              '--ag-dim': isActive ? 0.15 : 0.45,
              duration: dur,
              ease
            },
            0
          );
        }

        if (showLabels && bar && text) {
          if (isActive) {
            tl.to([bar, text], { opacity: 1, x: 0, duration: dur, ease, stagger: prefersReduced ? 0 : stagger }, 0);
          } else {
            tl.to([bar, text], { opacity: 0, x: -14, duration: dur * 0.6, ease }, 0);
          }
        }
      });

      tlRef.current = tl;
    },
    [
      active,
      count,
      expandRatio,
      duration,
      ease,
      vertical,
      tilt,
      parallax,
      grayscale,
      showLabels,
      stagger,
      prefersReduced
    ]
  );

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;

    const measure = () => {
      const rect = el.getBoundingClientRect();
      const total = vertical ? rect.height : rect.width;
      const usable = Math.max(total - gap * (count - 1), 120);
      const size = Math.max(140, usable * Math.min(Math.max(expandRatio, 0.2), 0.9) * 1.22);
      mediaSizeRef.current = size;
      el.style.setProperty('--ag-media-size', `${size}px`);
      applyLayout(!firstRunRef.current);
    };

    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [applyLayout, gap, count, expandRatio, vertical]);

  useEffect(() => {
    applyLayout(!firstRunRef.current);
    firstRunRef.current = false;
  }, [applyLayout]);

  useEffect(
    () => () => {
      tlRef.current?.kill();
    },
    []
  );

  const handleEnter = (i: number) => {
    if (trigger === 'hover') handleActiveChange(i);
  };

  const handleClick = (i: number, e: MouseEvent) => {
    if (i !== active) {
      e.preventDefault();
      handleActiveChange(i);
    }
  };

  const handleKeyDown = (i: number, e: KeyboardEvent) => {
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      e.preventDefault();
      handleActiveChange((i + 1) % count);
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault();
      handleActiveChange((i - 1 + count) % count);
    }
  };

  const rootStyle = {
    '--ag-accent': accentColor,
    '--ag-overlay': overlayColor,
    '--ag-text': textColor,
    '--ag-gap': `${gap}px`,
    '--ag-radius': `${radius}px`,
    height: vertical ? `${Math.round(height * 1.6)}px` : `${height}px`
  } as CSSProperties;

  return (
    <div
      ref={rootRef}
      className={`accordion-gallery${vertical ? ' accordion-gallery--vertical' : ''}${className ? ` ${className}` : ''}`}
      style={rootStyle}
      role="list"
      aria-label="Image accordion gallery"
    >
      {items.map((item, i) => {
        const isActive = i === active;
        const Tag = (item.link ? 'a' : 'div') as 'a';
        return (
          <Tag
            key={i}
            ref={(el: HTMLElement | null) => {
              panelRefs.current[i] = el;
            }}
            className={`ag-panel${isActive ? ' ag-panel--active' : ''}`}
            style={{ borderRadius: `${radius}px` }}
            href={item.link || undefined}
            onClick={e => handleClick(i, e)}
            onMouseEnter={() => handleEnter(i)}
            onFocus={() => handleActiveChange(i)}
            onKeyDown={e => handleKeyDown(i, e)}
            role="listitem"
            tabIndex={0}
            aria-current={isActive ? 'true' : undefined}
            aria-label={item.label}
          >
            {/* Top Tactical Metadata Badge */}
            <div className="ag-panel__top font-mono" aria-hidden="true">
              <span className="ag-panel__badge">0{i + 1}</span>
              {item.code && <span className="ag-panel__code">{item.code}</span>}
            </div>

            <span className="ag-panel__frame">
              <span
                className="ag-panel__media"
                ref={(el: HTMLElement | null) => {
                  mediaRefs.current[i] = el;
                }}
              >
                <img src={item.image} alt={item.alt || item.label || ''} draggable={false} />
              </span>
              <span className="ag-panel__overlay" aria-hidden="true" />
            </span>

            {showLabels && (
              <span className="ag-panel__label" aria-hidden="true">
                <span
                  className="ag-panel__bar"
                  ref={(el: HTMLElement | null) => {
                    barRefs.current[i] = el;
                  }}
                />
                <div className="ag-panel__content">
                  <span
                    className="ag-panel__text font-display"
                    ref={(el: HTMLElement | null) => {
                      textRefs.current[i] = el;
                    }}
                  >
                    {item.label}
                  </span>
                  {item.tagline && (
                    <span className="ag-panel__tagline font-mono">
                      {item.tagline}
                    </span>
                  )}
                </div>
              </span>
            )}
          </Tag>
        );
      })}
    </div>
  );
};

export default AccordionGallery;
