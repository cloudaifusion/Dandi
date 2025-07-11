import React from 'react';

interface NotificationProps {
  message: string | null;
  type?: 'success' | 'error';
  onClose: () => void;
}

const Notification: React.FC<NotificationProps> = ({ message, type = 'success', onClose }) => {
  if (!message) return null;
  return (
    <div className={`fixed top-6 left-1/2 transform -translate-x-1/2 z-50 flex items-center px-6 py-3 rounded shadow-lg min-w-[280px] max-w-[90vw] text-white ${type === 'error' ? 'bg-red-500' : 'bg-green-500'}`}>
      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
      </svg>
      <span className="flex-1">{message}</span>
      <button className="ml-4 text-white hover:text-gray-200" onClick={onClose}>
        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>
    </div>
  );
};

export default Notification; 