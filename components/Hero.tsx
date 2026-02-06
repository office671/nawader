import React from 'react';
import { COMPANY_NAME, COMPANY_DESCRIPTION } from '../constants';
import Button from './Button';

const Hero: React.FC = () => {
  return (
    <section id="home" className="relative bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-20 md:py-32 overflow-hidden shadow-lg">
      <div className="container mx-auto px-4 text-center relative z-10">
        <h1 className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight">
          {COMPANY_NAME}
        </h1>
        <p className="text-lg md:text-2xl mb-8 max-w-3xl mx-auto opacity-90">
          {COMPANY_DESCRIPTION}
        </p>
        <Button size="lg" className="bg-white text-indigo-700 hover:bg-gray-100 shadow-xl" onClick={() => window.location.hash = '#services'}>
          استكشف خدماتنا
        </Button>
      </div>
      {/* Background shapes for visual interest */}
      <div className="absolute top-0 left-0 w-full h-full">
        <div className="absolute w-64 h-64 bg-white opacity-5 rounded-full -top-16 -right-16 md:w-96 md:h-96 md:-top-24 md:-right-24"></div>
        <div className="absolute w-48 h-48 bg-white opacity-5 rounded-full -bottom-12 -left-12 md:w-72 md:h-72 md:-bottom-16 md:-left-16"></div>
      </div>
    </section>
  );
};

export default Hero;
