import React from 'react';
import { initialArsenal } from '../data/arsenal';
import './FieldArsenal.css';

export const FieldArsenal: React.FC = () => {
  return (
    <section id="arsenal" className="arsenal-section hairline-b" aria-labelledby="arsenal-heading">
      <div className="container">
        
        {/* Section Header */}
        <header className="arsenal-header">
          <div className="arsenal-header-top">
            <div>
              <span className="tag-badge">FIELD GEAR // 03 · ARSENAL</span>
              <h2 id="arsenal-heading" className="arsenal-headline font-display">
                Technical Arsenal<span style={{ color: 'var(--color-olive)' }}>.</span>
              </h2>
            </div>
            <div className="arsenal-telemetry-meta font-mono">
              CORE INVENTORY: 03 PILLARS // 18 VERIFIED CAPABILITIES
            </div>
          </div>
          <p className="arsenal-header-tagline">
            “Tactical toolchains & craft disciplines forged through production expeditions.”
          </p>
        </header>

        {/* 3 Pillars Grid */}
        <div className="arsenal-grid" role="region" aria-label="Technical Capabilities Inventory">
          {initialArsenal.map((pillar) => (
            <article
              key={pillar.id}
              className="arsenal-pillar hairline-box"
              aria-labelledby={`pillar-${pillar.id}`}
            >
              <div>
                {/* Pillar Header Meta */}
                <div className="arsenal-pillar-header font-mono">
                  <span className="arsenal-pillar-index">{pillar.pillarIndex}</span>
                  <span className="arsenal-pillar-status">
                    <span className="status-dot" aria-hidden="true" />
                    <span>ACTIVE</span>
                  </span>
                </div>

                {/* Pillar Body */}
                <div className="arsenal-pillar-body">
                  <div className="arsenal-pillar-code font-mono">{pillar.code}</div>
                  <h3 id={`pillar-${pillar.id}`} className="arsenal-pillar-title font-display">
                    {pillar.title}
                  </h3>
                  <span className="arsenal-pillar-tagline">
                    “{pillar.tagline}”
                  </span>
                  <p className="arsenal-pillar-desc">
                    {pillar.description}
                  </p>

                  {/* Skills Inventory List */}
                  <ul className="arsenal-skills-list" role="list">
                    {pillar.skills.map((skill) => (
                      <li key={skill.name} className="arsenal-skill-item">
                        <div className="arsenal-skill-header">
                          <span className="arsenal-skill-bullet font-mono" aria-hidden="true">
                            ▸
                          </span>
                          <span className="arsenal-skill-name font-mono">
                            {skill.name}
                          </span>
                        </div>
                        {skill.spec && (
                          <span className="arsenal-skill-spec font-mono">
                            {skill.spec}
                          </span>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Primary Toolchain Tray */}
              <footer className="arsenal-pillar-footer font-mono">
                <span className="arsenal-tools-heading">PRIMARY TOOLCHAIN //</span>
                <div className="arsenal-tools-pills">
                  {pillar.tools.map((tool) => (
                    <span key={tool} className="arsenal-tool-pill">
                      {tool}
                    </span>
                  ))}
                </div>
              </footer>
            </article>
          ))}
        </div>

      </div>
    </section>
  );
};

