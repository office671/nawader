import React from 'react';
import { CALL_TO_ACTION_TEXT, PHONE_NUMBER, CONTACT_EMAIL } from '../constants';
import Button from './Button';

const CallToAction: React.FC = () => {
  return (
    <section id="contact" className="bg-indigo-700 text-white py-16 md:py-20 text-center shadow-inner">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-extrabold mb-6">
          {CALL_TO_ACTION_TEXT}
        </h2>
        <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto opacity-90">
          فريقنا المختص جاهز لتقديم الدعم والمساعدة اللازمة لكم.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Button
            variant="secondary"
            size="lg"
            className="bg-white text-indigo-700 hover:bg-gray-100 shadow-md"
            onClick={() => window.open(`tel:${PHONE_NUMBER}`, '_self')}
          >
            اتصل بنا: {PHONE_NUMBER}
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="border-white text-white hover:bg-indigo-600 shadow-md"
            onClick={() => window.open(`mailto:${CONTACT_EMAIL}`, '_self')}
          >
            أرسل بريدًا إلكترونيًا
          </Button>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;
