import React from 'react';
import { initialExpeditions } from '../data/expeditions';

export const SelectedExpeditions: React.FC = () => {
  return (
    <section id="expeditions" className="hairline-b" style={{ padding: 'var(--space-4xl) 0' }}>
      <div className="container">
        {/* Section Header */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            marginBottom: 'var(--space-2xl)',
            paddingBottom: 'var(--space-sm)',
            borderBottom: '1px solid var(--hairline-base)',
          }}
        >
          <div>
            <span className="tag-badge" style={{ marginBottom: 'var(--space-2xs)' }}>
              FIELD ARCHIVE // 02
            </span>
            <h2
              style={{
                fontSize: 'var(--text-2xl)',
                fontWeight: 800,
                marginTop: 'var(--space-xs)',
                letterSpacing: '-0.02em',
              }}
            >
              Selected Expeditions.
            </h2>
          </div>
          <div className="font-mono" style={{ fontSize: 'var(--text-xs)', color: 'var(--color-ink-muted)' }}>
            INDEX: 04 LOG ENTRIES
          </div>
        </div>

        {/* Expeditions Grid / Cards */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: 'var(--space-xl)',
          }}
        >
          {initialExpeditions.map((exp) => (
            <article
              key={exp.id}
              className="hairline-box"
              style={{
                backgroundColor: 'var(--color-canvas-subtle)',
                padding: 'var(--space-lg)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                transition: 'border-color var(--duration-normal) var(--ease-out-quad), transform var(--duration-normal) var(--ease-out-quad)',
              }}
            >
              <div>
                {/* Card Top Metadata */}
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: 'var(--space-md)',
                    borderBottom: '1px solid var(--hairline-subtle)',
                    paddingBottom: 'var(--space-xs)',
                  }}
                >
                  <span className="font-mono" style={{ fontSize: 'var(--text-xs)', color: 'var(--color-olive)' }}>
                    {exp.indexNumber}
                  </span>
                  <span className="font-mono" style={{ fontSize: 'var(--text-xs)', color: 'var(--color-ink-faint)' }}>
                    {exp.year}
                  </span>
                </div>

                {/* Card Title & Category */}
                <h3
                  style={{
                    fontSize: 'var(--text-xl)',
                    fontWeight: 700,
                    marginBottom: 'var(--space-2xs)',
                    letterSpacing: '-0.01em',
                  }}
                >
                  {exp.title}
                </h3>
                <div
                  className="font-mono"
                  style={{
                    fontSize: 'var(--text-xs)',
                    color: 'var(--color-olive)',
                    marginBottom: 'var(--space-md)',
                  }}
                >
                  {exp.category}
                </div>

                <p style={{ fontSize: 'var(--text-sm)', marginBottom: 'var(--space-lg)' }}>
                  {exp.summary}
                </p>
              </div>

              {/* Card Footer Tech Stack */}
              <div>
                <div
                  style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: 'var(--space-2xs)',
                    paddingTop: 'var(--space-sm)',
                    borderTop: '1px solid var(--hairline-subtle)',
                    marginBottom: 'var(--space-sm)',
                  }}
                >
                  {exp.stack.map((item) => (
                    <span
                      key={item}
                      className="font-mono"
                      style={{
                        fontSize: '0.7rem',
                        padding: '2px 6px',
                        backgroundColor: 'var(--color-canvas)',
                        border: '1px solid var(--hairline-base)',
                        borderRadius: '2px',
                        color: 'var(--color-ink-muted)',
                      }}
                    >
                      {item}
                    </span>
                  ))}
                </div>

                <a
                  href={exp.link || '#'}
                  className="font-mono"
                  style={{
                    fontSize: 'var(--text-xs)',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                    color: 'var(--color-ink)',
                    fontWeight: 600,
                  }}
                >
                  INSPECT LOG ENTRY <span>↗</span>
                </a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};
