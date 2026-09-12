import React from 'react';
import { initialArsenal } from '../data/arsenal';

export const FieldArsenal: React.FC = () => {
  return (
    <section id="arsenal" className="hairline-b" style={{ padding: 'var(--space-4xl) 0' }}>
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
              FIELD GEAR // 03
            </span>
            <h2
              style={{
                fontSize: 'var(--text-2xl)',
                fontWeight: 800,
                marginTop: 'var(--space-xs)',
                letterSpacing: '-0.02em',
              }}
            >
              Technical Arsenal.
            </h2>
          </div>
          <div className="font-mono" style={{ fontSize: 'var(--text-xs)', color: 'var(--color-ink-muted)' }}>
            CORE CAPABILITIES: 03 PILLARS
          </div>
        </div>

        {/* 3 Pillars Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: 'var(--space-xl)',
          }}
        >
          {initialArsenal.map((pillar, idx) => (
            <div
              key={pillar.id}
              className="hairline-box"
              style={{
                padding: 'var(--space-lg)',
                backgroundColor: 'var(--color-canvas)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <div>
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
                    PILLAR // 0{idx + 1}
                  </span>
                  <span className="font-mono" style={{ fontSize: 'var(--text-xs)', color: 'var(--color-ink-faint)' }}>
                    ACTIVE
                  </span>
                </div>

                <h3
                  style={{
                    fontSize: 'var(--text-lg)',
                    fontWeight: 700,
                    marginBottom: 'var(--space-2xs)',
                  }}
                >
                  {pillar.title}
                </h3>
                <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-ink-muted)', marginBottom: 'var(--space-lg)' }}>
                  {pillar.tagline}
                </p>

                {/* Skill Chips */}
                <ul style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-xs)' }}>
                  {pillar.skills.map((skill) => (
                    <li
                      key={skill.name}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 'var(--space-xs)',
                        fontSize: 'var(--text-sm)',
                        padding: '6px 10px',
                        backgroundColor: 'var(--color-canvas-subtle)',
                        border: '1px solid var(--hairline-subtle)',
                        borderRadius: '2px',
                      }}
                    >
                      <span className="font-mono" style={{ color: 'var(--color-olive)', fontSize: '10px' }}>
                        ▸
                      </span>
                      <span className="font-mono" style={{ fontSize: 'var(--text-xs)' }}>
                        {skill.name}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
