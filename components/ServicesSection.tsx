import React from 'react';
import { SERVICES, COMMITMENT_STATEMENT } from '../constants';
import { ServiceItem } from '../types';

const ServiceCard: React.FC<{ service: ServiceItem }> = ({ service }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 transform hover:scale-105 transition-transform duration-300">
      <div className="text-5xl mb-4 text-indigo-600 text-center">{service.icon}</div>
      <h3 className="text-2xl font-semibold mb-3 text-center text-gray-900">{service.title}</h3>
      <p className="text-gray-700 text-center leading-relaxed">{service.description}</p>
    </div>
  );
};

const ServicesSection: React.FC = () => {
  return (
    <section id="services" className="py-16 md:py-24 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-extrabold text-center text-gray-900 mb-12">
          خدماتنا الشاملة
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {SERVICES.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>

        <div className="mt-16 text-center max-w-4xl mx-auto">
          <p className="text-2xl font-bold text-indigo-700 leading-relaxed mb-6">
            {COMMITMENT_STATEMENT}
          </p>
          <p className="text-lg text-gray-700">
            نسعى دائمًا لتقديم أفضل الحلول التي تلبي احتياجاتكم وتتجاوز توقعاتكم.
          </p>
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
