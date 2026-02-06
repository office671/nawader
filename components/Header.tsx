import React from 'react';
import { COMPANY_NAME } from '../constants';

const Header: React.FC = () => {
  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="text-2xl font-bold text-indigo-600">
          {COMPANY_NAME}
        </div>
        <nav>
          <ul className="flex space-x-4 space-x-reverse">
            <li><a href="#home" className="text-gray-600 hover:text-indigo-600 transition-colors duration-200">الرئيسية</a></li>
            <li><a href="#services" className="text-gray-600 hover:text-indigo-600 transition-colors duration-200">خدماتنا</a></li>
            <li><a href="#gemini-assistant" className="text-gray-600 hover:text-indigo-600 transition-colors duration-200">مساعد Gemini</a></li>
            <li><a href="#contact" className="text-gray-600 hover:text-indigo-600 transition-colors duration-200">تواصل معنا</a></li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
