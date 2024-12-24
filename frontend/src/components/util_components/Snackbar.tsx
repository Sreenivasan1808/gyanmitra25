import React, { useEffect } from 'react';

const Snackbar = ({ 
  message, 
  isOpen, 
  type = 'info', 
  duration = 3000, 
  onClose 
}) => {
  // Auto-dismiss logic
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [isOpen, duration, onClose]);

  // Color classes based on type
  const colorClasses = {
    success: 'bg-green-500',
    error: 'bg-red-500',
    warning: 'bg-yellow-500',
    info: 'bg-blue-500',
  };

  return (
    <div
      className={`fixed bottom-4 left-1/2 transform -translate-x-1/2 px-4 py-2 rounded shadow-lg text-white transition-all ${
        isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      } ${colorClasses[type]}`}
      role="alert"
    >
      {message}
    </div>
  );
};

export default Snackbar;
