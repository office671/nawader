import React from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import ServicesSection from './components/ServicesSection';
import GeminiAssistant from './components/GeminiAssistant';
import CallToAction from './components/CallToAction';
import Footer from './components/Footer';
import { SERVICES } from './constants';

const App: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <Hero />
        <ServicesSection />
        <GeminiAssistant services={SERVICES} />
        <CallToAction />
      </main>
      <Footer />
    </div>
  );
};

export default App;
