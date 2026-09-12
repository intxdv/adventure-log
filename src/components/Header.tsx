import React, { useEffect, useState } from 'react';

export const Header: React.FC = () => {
  const [timeString, setTimeString] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      // Format WIB (UTC+7)
      const options: Intl.DateTimeFormatOptions = {
        timeZone: 'Asia/Jakarta',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
      };
      setTimeString(new Intl.DateTimeFormat('id-ID', options).format(now) + ' WIB');
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header
      className="hairline-b"
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        backgroundColor: 'rgba(247, 246, 242, 0.92)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        transition: 'all var(--duration-normal) var(--ease-out-quad)',
      }}
    >
      <div
        className="container"
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          height: '60px',
        }}
      >
        {/* Left Telemetry / Brand */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)' }}>
          <a
            href="#hero"
            style={{
              fontFamily: 'var(--font-display)',
              fontWeight: 800,
              fontSize: 'var(--text-base)',
              letterSpacing: '-0.02em',
            }}
          >
            ADVENTURE LOG.
          </a>
          <span
            className="tag-badge"
            style={{ display: 'none' /* Will be unhidden on md+ screens via css or inline */ }}
          >
            DISPATCH 2026
          </span>
        </div>

        {/* Center Cutout Notch Placeholder (Target for Sprint 2.1) */}
        <div
          id="header-notch-placeholder"
          style={{
            position: 'absolute',
            left: '50%',
            transform: 'translateX(-50%)',
            top: 0,
            height: '42px',
            minWidth: '180px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderBottom: '1px dashed var(--color-olive-border)',
            borderLeft: '1px dashed var(--color-olive-border)',
            borderRight: '1px dashed var(--color-olive-border)',
            borderBottomLeftRadius: '12px',
            borderBottomRightRadius: '12px',
            backgroundColor: 'var(--color-canvas-subtle)',
            padding: '0 var(--space-md)',
          }}
        >
          <span className="font-mono" style={{ fontSize: 'var(--text-xs)', color: 'var(--color-olive)' }}>
            [ NOTCH DOCK ]
          </span>
        </div>

        {/* Right Navigation & Telemetry */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-lg)' }}>
          <div style={{ display: 'flex', gap: 'var(--space-md)' }}>
            <a href="#about" className="font-mono" style={{ fontSize: 'var(--text-xs)' }}>
              01. BRIEF
            </a>
            <a href="#expeditions" className="font-mono" style={{ fontSize: 'var(--text-xs)' }}>
              02. EXPEDITIONS
            </a>
            <a href="#arsenal" className="font-mono" style={{ fontSize: 'var(--text-xs)' }}>
              03. ARSENAL
            </a>
          </div>
          <div
            className="font-mono"
            style={{
              fontSize: 'var(--text-xs)',
              color: 'var(--color-ink-muted)',
              borderLeft: '1px solid var(--hairline-base)',
              paddingLeft: 'var(--space-md)',
            }}
          >
            {timeString || '12:00:00 WIB'}
          </div>
        </nav>
      </div>
    </header>
  );
};
