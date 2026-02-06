import React from 'react';
import { COMPANY_NAME } from '../constants';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="bg-gray-800 text-gray-300 py-8 text-center">
      <div className="container mx-auto px-4">
        <p className="text-sm">
          &copy; {currentYear} {COMPANY_NAME}. جميع الحقوق محفوظة.
        </p>
        <p className="mt-2 text-xs">
          صمم بـ ❤️ في المملكة العربية السعودية.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
