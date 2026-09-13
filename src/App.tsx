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

export const App: React.FC = () => {
  const [isAppLoaded, setIsAppLoaded] = React.useState(false);
  useMotionEngine();

  return (
    <div style={{ position: 'relative', minHeight: '100vh', backgroundColor: 'var(--color-canvas)' }}>
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
