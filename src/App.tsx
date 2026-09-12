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
  useMotionEngine();

  return (
    <div style={{ position: 'relative', minHeight: '100vh', backgroundColor: 'var(--color-canvas)' }}>
      {/* Tactile Paper Noise Overlay */}
      <div className="paper-grain-overlay" aria-hidden="true" />

      {/* Preloader Screen */}
      <Preloader />

      {/* Tactical Right-Rail & Mobile Floating Navigation */}
      <TacticalNav />

      {/* Main Structural Content */}
      <Header />
      <main id="main-content">
        <Hero />
        <About />
        <SelectedExpeditions />
        <FieldArsenal />
      </main>
      <Footer />
    </div>
  );
};

export default App;
