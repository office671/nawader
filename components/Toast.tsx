import React, { useEffect } from 'react';
import { ToastMessage } from '../types';

interface ToastProps {
  toast: ToastMessage;
  onDismiss: (id: string) => void;
}

const Toast: React.FC<ToastProps> = ({ toast, onDismiss }) => {
  const { id, type, message } = toast;

  useEffect(() => {
    const timer = setTimeout(() => {
      onDismiss(id);
    }, 5000); // Auto-dismiss after 5 seconds

    return () => clearTimeout(timer);
  }, [id, onDismiss]);

  const typeStyles = {
    success: 'bg-green-500 border-green-700',
    error: 'bg-red-500 border-red-700',
    info: 'bg-blue-500 border-blue-700',
  };

  return (
    <div
      className={`relative p-4 mb-3 rounded-lg shadow-lg text-white text-right border-b-4 ${typeStyles[type]}`}
      role="alert"
    >
      <button
        onClick={() => onDismiss(id)}
        className="absolute top-2 left-2 text-white opacity-70 hover:opacity-100 text-lg font-bold"
        aria-label="إغلاق"
      >
        &times;
      </button>
      <p className="font-semibold text-lg">{message}</p>
    </div>
  );
};

export default Toast;
