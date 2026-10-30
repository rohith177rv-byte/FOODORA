import { useEffect } from 'react';
import { CheckCircle, Info, X } from 'lucide-react';

export default function Toast({ message, type = 'success', onClose }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      if (onClose) onClose();
    }, 2500);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-slide-up">
      <div
        className={`flex items-center gap-3 px-5 py-3 rounded-xl shadow-lg text-white font-medium ${
          type === 'success'
            ? 'bg-green-500'
            : type === 'error'
            ? 'bg-red-500'
            : 'bg-[#FF6B35]'
        }`}
      >
        {type === 'success' ? (
          <CheckCircle size={20} />
        ) : (
          <Info size={20} />
        )}
        <span>{message}</span>
        <button onClick={onClose} className="ml-2 hover:opacity-70 transition-opacity">
          <X size={16} />
        </button>
      </div>
    </div>
  );
}
