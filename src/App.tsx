import React from 'react';
import { Preloader } from './components/Preloader';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { About } from './components/About';
import { SelectedExpeditions } from './components/SelectedExpeditions';
import { FieldArsenal } from './components/FieldArsenal';
import { Footer } from './components/Footer';

export const App: React.FC = () => {
  return (
    <div style={{ position: 'relative', minHeight: '100vh', backgroundColor: 'var(--color-canvas)' }}>
      {/* Tactile Paper Noise Overlay */}
      <div className="paper-grain-overlay" aria-hidden="true" />

      {/* Preloader Screen */}
      <Preloader />

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
