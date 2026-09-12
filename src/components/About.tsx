import React from 'react';

export const About: React.FC = () => {
  return (
    <section id="about" className="hairline-b" style={{ padding: 'var(--space-4xl) 0' }}>
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 'var(--space-3xl)', alignItems: 'center' }}>
          
          {/* Tactical Archival Portrait Frame */}
          <div>
            <div
              className="hairline-box"
              style={{
                position: 'relative',
                padding: 'var(--space-md)',
                backgroundColor: 'var(--color-canvas-subtle)',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginBottom: 'var(--space-xs)',
                  borderBottom: '1px solid var(--hairline-subtle)',
                  paddingBottom: '4px',
                }}
              >
                <span className="font-mono" style={{ fontSize: 'var(--text-xs)', color: 'var(--color-olive)' }}>
                  PORTRAIT // FILE 001
                </span>
                <span className="font-mono" style={{ fontSize: 'var(--text-xs)', color: 'var(--color-ink-muted)' }}>
                  TAKI [CARTOGRAPHER]
                </span>
              </div>

              {/* Portrait Placeholder Canvas Frame */}
              <div
                style={{
                  width: '100%',
                  aspectRatio: '4 / 5',
                  backgroundColor: 'var(--color-canvas)',
                  border: '1px solid var(--hairline-base)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: 'var(--space-lg)',
                  textAlign: 'center',
                }}
              >
                <div
                  style={{
                    width: '64px',
                    height: '64px',
                    borderRadius: '50%',
                    border: '1px dashed var(--color-olive)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: 'var(--space-md)',
                    color: 'var(--color-olive)',
                    fontFamily: 'var(--font-mono)',
                    fontSize: 'var(--text-xs)',
                  }}
                >
                  FIELD
                </div>
                <div style={{ fontWeight: 700, fontSize: 'var(--text-base)' }}>Taki</div>
                <div className="font-mono" style={{ fontSize: 'var(--text-xs)', color: 'var(--color-ink-muted)', marginTop: '4px' }}>
                  Creative Developer & Mobile Architect
                </div>
              </div>

              <div
                style={{
                  marginTop: 'var(--space-xs)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  paddingTop: '4px',
                }}
              >
                <span className="font-mono" style={{ fontSize: 'var(--text-xs)', color: 'var(--color-ink-faint)' }}>
                  SCALE: 1:1 NATURAL
                </span>
                <span className="font-mono" style={{ fontSize: 'var(--text-xs)', color: 'var(--color-olive)' }}>
                  SCAN AREA READY
                </span>
              </div>
            </div>
          </div>

          {/* Editorial Storytelling & Moniker */}
          <div>
            <div style={{ marginBottom: 'var(--space-sm)' }}>
              <span className="tag-badge">FIELD BRIEF // 01 · ABOUT SELVAGANT</span>
            </div>
            
            <h2
              style={{
                fontSize: 'var(--text-2xl)',
                fontWeight: 700,
                marginBottom: 'var(--space-xs)',
                letterSpacing: '-0.02em',
              }}
            >
              About Selvagant.
            </h2>
            <div
              className="font-mono"
              style={{
                fontSize: 'var(--text-xs)',
                color: 'var(--color-olive)',
                marginBottom: 'var(--space-md)',
                textTransform: 'uppercase',
                letterSpacing: '0.04em',
              }}
            >
              Creative Developer & Mobile Architect // The Digital Cartographer
            </div>

            <p style={{ marginBottom: 'var(--space-md)' }}>
              Operating at the intersection of deep engineering logic and organic visual taste.
              I build scalable mobile systems and interactive web environments designed to feel
              tactile, responsive, and grounded.
            </p>

            <p style={{ marginBottom: 'var(--space-lg)' }}>
              Every interface is treated like an expedition map: discarding unnecessary noise,
              prioritizing legibility, and celebrating thoughtful micro-craftsmanship.
            </p>

            {/* Moniker Citation: Selvagant */}
            <div
              style={{
                borderLeft: '2px solid var(--color-olive)',
                paddingLeft: 'var(--space-md)',
                marginTop: 'var(--space-lg)',
                background: 'var(--color-olive-tint)',
                padding: 'var(--space-md)',
              }}
            >
              <div
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'var(--text-lg)',
                  color: 'var(--color-ink)',
                }}
              >
                <span style={{ fontStyle: 'italic', fontWeight: 800, textDecoration: 'underline var(--color-olive)' }}>Selv</span>agant
                <span style={{ color: 'var(--color-ink-faint)', marginLeft: '8px', fontSize: 'var(--text-sm)' }}>
                  — The Wandering <span style={{ fontStyle: 'italic' }}>Selv</span>
                </span>
              </div>
              <p className="font-mono" style={{ fontSize: 'var(--text-xs)', color: 'var(--color-ink-muted)', marginTop: '4px' }}>
                Rooted in Solivagant (one who wanders alone) & Self. Exploration of digital craft as self-discovery.
              </p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
