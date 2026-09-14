import React from 'react';
import { useMotionEngine } from './hooks/useMotionEngine';
import { Preloader } from './components/Preloader';
import { TacticalNav } from './components/TacticalNav';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { About } from './components/About';
import { SelectedExpeditions } from './components/SelectedExpeditions';
import { FieldArsenal } from './components/FieldArsenal';
import { Footer } from './components/Footer';
import TargetCursor from './TargetCursor';

export const App: React.FC = () => {
  const [isAppLoaded, setIsAppLoaded] = React.useState(false);
  useMotionEngine();

  return (
    <div style={{ position: 'relative', minHeight: '100vh', backgroundColor: 'var(--color-canvas)' }}>
      {/* Tactical Dynamic Target Cursor */}
      <TargetCursor 
        spinDuration={2}
        hideDefaultCursor={true}
        parallaxOn={true}
        targetSelector=".cursor-target, [data-hover-reveal], [aria-haspopup], [aria-expanded], a, button"
        excludeSelector="#top-notch-header, #top-notch-header *, .notch-header-container, .notch-header-container *, .notch-dock-body, .notch-dock-body *, .notch-brand-anchor, .notch-brand-anchor *, .ag-panel, .ag-panel *, .accordion-gallery, .accordion-gallery *, .arsenal-gallery-wrapper, .arsenal-gallery-wrapper *, .no-cursor-target, .no-cursor-target *"
      />
      {/* Tactile Paper Noise Overlay */}
      <div className="paper-grain-overlay" aria-hidden="true" />

      {/* Preloader Screen */}
      <Preloader onComplete={() => setIsAppLoaded(true)} />

      {/* Tactical Right-Rail & Mobile Floating Navigation */}
      <TacticalNav />

      {/* Main Structural Content */}
      <Header />
      <main id="main-content">
        <div id="hero-stage-wrapper" className="hero-stage-wrapper">
          <Hero isAppLoaded={isAppLoaded} />
          <About />
          <SelectedExpeditions />
        </div>
        <FieldArsenal />
      </main>
      <Footer />
    </div>
  );
};

export default App;
