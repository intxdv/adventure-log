import { useRef, useEffect, useState, useCallback } from 'react';
import type { CSSProperties, KeyboardEvent, MouseEvent } from 'react';
import { gsap } from 'gsap';
import type { ArsenalSkill } from '../../types';

import './AccordionGallery.css';

export interface AccordionGalleryItem {
  id?: string;
  image: string;
  label: string; // Title
  code?: string;
  tagline?: string;
  pillarIndex?: string;
  description?: string;
  skills?: ArsenalSkill[];
  tools?: string[];
  link?: string;
  alt?: string;
}

export interface AccordionGalleryProps {
  items: AccordionGalleryItem[];
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
  grayscale?: boolean;
  className?: string;
}

export const AccordionGallery = ({
  items,
  defaultIndex = 0,
  activeIndex,
  onActiveChange,
  accentColor = '#4A5844',
  overlayColor = '#141714',
  textColor = '#F7F6F2',
  height = 700,
  gap = 14,
  radius = 4,
  expandRatio = 0.65,
  orientation = 'horizontal',
  duration = 0.6,
  ease = 'power3.out',
  parallax = 0.4,
  tilt = 5,
  trigger = 'hover',
  grayscale = true,
  className = ''
}: AccordionGalleryProps) => {
  const rootRef = useRef<HTMLDivElement>(null);
  const panelRefs = useRef<(HTMLElement | null)[]>([]);
  const mediaRefs = useRef<(HTMLElement | null)[]>([]);
  const spineRefs = useRef<(HTMLElement | null)[]>([]);
  const dossierRefs = useRef<(HTMLElement | null)[]>([]);
  const tlRef = useRef<gsap.core.Timeline | null>(null);
  const firstRunRef = useRef(true);
  const mediaSizeRef = useRef(400);

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
        const spine = spineRefs.current[i];
        const dossier = dossierRefs.current[i];

        const rot = isActive ? 0 : i < active ? tilt : -tilt;
        const rotProp = vertical ? { rotateX: -rot } : { rotateY: rot };

        // Expand/Collapse panel width and 3D tilt
        tl.to(panel, { flexGrow: isActive ? grow : 1, ...rotProp, duration: dur, ease }, 0);

        // Parallax image drift & dimming
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
              '--ag-dim': isActive ? 0.08 : 0.45,
              duration: dur,
              ease
            },
            0
          );
        }

        // Vertical Spine Title transition (Visible when collapsed)
        if (spine) {
          if (isActive) {
            tl.to(spine, { opacity: 0, scale: 0.95, duration: dur * 0.4, ease }, 0);
          } else {
            tl.to(spine, { opacity: 1, scale: 1, duration: dur, ease, delay: prefersReduced ? 0 : 0.1 }, 0);
          }
        }

        // Detailed Dossier Content transition (Visible when expanded)
        if (dossier) {
          if (isActive) {
            tl.to(dossier, { opacity: 1, y: 0, pointerEvents: 'auto', duration: dur, ease, delay: prefersReduced ? 0 : 0.08 }, 0);
          } else {
            tl.to(dossier, { opacity: 0, y: 14, pointerEvents: 'none', duration: dur * 0.35, ease }, 0);
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
      const size = Math.max(160, usable * Math.min(Math.max(expandRatio, 0.2), 0.9) * 1.25);
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
    height: vertical ? 'auto' : `${height}px`
  } as CSSProperties;

  return (
    <div
      ref={rootRef}
      className={`accordion-gallery${vertical ? ' accordion-gallery--vertical' : ''}${className ? ` ${className}` : ''}`}
      style={rootStyle}
      role="list"
      aria-label="Technical Arsenal Accordion Gallery"
    >
      {items.map((item, i) => {
        const isActive = i === active;
        const Tag = (item.link ? 'a' : 'div') as 'a';
        return (
          <Tag
            key={item.id || i}
            ref={(el: HTMLElement | null) => {
              panelRefs.current[i] = el;
            }}
            className={`ag-panel${isActive ? ' ag-panel--active' : ' ag-panel--collapsed'}`}
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

            {/* Background Photographic Frame & Film */}
            <span className="ag-panel__frame" aria-hidden="true">
              <span
                className="ag-panel__media"
                ref={(el: HTMLElement | null) => {
                  mediaRefs.current[i] = el;
                }}
              >
                <img src={item.image} alt={item.alt || item.label || ''} draggable={false} />
              </span>
              <span className="ag-panel__overlay" />
            </span>

            {/* Collapsed View: Vertical Spine Title (Shown when inactive) */}
            <div
              className="ag-panel__spine"
              ref={(el: HTMLElement | null) => {
                spineRefs.current[i] = el;
              }}
              aria-hidden={isActive}
            >
              <div className="ag-panel__spine-content">
                <span className="ag-panel__spine-idx font-mono">
                  0{i + 1} //
                </span>
                <h3 className="ag-panel__spine-title font-display">
                  {item.label}
                </h3>
                {item.code && (
                  <span className="ag-panel__spine-code font-mono">
                    [{item.code.replace('GEAR.', '')}]
                  </span>
                )}
              </div>
            </div>

            {/* Expanded View: Full Technical Dossier Content (Shown when active) */}
            <div
              className="ag-panel__dossier"
              ref={(el: HTMLElement | null) => {
                dossierRefs.current[i] = el;
              }}
              aria-hidden={!isActive}
            >
              {/* Dossier Header Info */}
              <div className="ag-dossier__header">
                <div className="ag-dossier__meta font-mono">
                  <span className="ag-dossier__pillar-idx">{item.pillarIndex || `PILLAR // 0${i + 1}`}</span>
                  <span className="ag-dossier__sep">/</span>
                  <span className="ag-dossier__pillar-code">{item.code}</span>
                </div>
                <h3 className="ag-dossier__title font-display">
                  {item.label}
                </h3>
                {item.tagline && (
                  <p className="ag-dossier__tagline font-mono">
                    “{item.tagline}”
                  </p>
                )}
                {item.description && (
                  <p className="ag-dossier__desc">
                    {item.description}
                  </p>
                )}
              </div>

              {/* Verified Capabilities (6 Specs) */}
              {item.skills && item.skills.length > 0 && (
                <div className="ag-dossier__skills">
                  <div className="ag-dossier__skills-label font-mono">
                    <span>VERIFIED CAPABILITIES (0{item.skills.length} SPECS) //</span>
                    <span className="ag-dossier__skills-status font-mono">PRODUCTION TESTED</span>
                  </div>
                  <ul className="ag-dossier__skills-grid" role="list">
                    {item.skills.map((skill) => (
                      <li key={skill.name} className="ag-skill-card">
                        <div className="ag-skill-card__header">
                          <span className="ag-skill-card__bullet font-mono" aria-hidden="true">
                            ▸
                          </span>
                          <span className="ag-skill-card__name font-mono">
                            {skill.name}
                          </span>
                        </div>
                        {skill.spec && (
                          <span className="ag-skill-card__spec font-mono">
                            {skill.spec}
                          </span>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Primary Production Toolchain Tray */}
              {item.tools && item.tools.length > 0 && (
                <div className="ag-dossier__tools font-mono">
                  <span className="ag-dossier__tools-heading">PRIMARY PRODUCTION TOOLCHAIN //</span>
                  <div className="ag-dossier__tools-pills">
                    {item.tools.map((tool) => (
                      <span key={tool} className="ag-tool-pill">
                        {tool}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </Tag>
        );
      })}
    </div>
  );
};

export default AccordionGallery;
