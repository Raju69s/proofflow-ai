"use client";

import React, { useEffect } from 'react';
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from 'lucide-react';

export function Toast({ 
  message, 
  type = 'success', 
  onClose, 
  duration = 4000 
}) {
  useEffect(() => {
    const timer = setTimeout(() => {
      if (onClose) onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const icons = {
    success: <CheckCircle2 size={16} className="text-emerald-400" />,
    warning: <AlertTriangle size={16} className="text-yellow-400" />,
    error: <AlertCircle size={16} className="text-red-400" />,
    info: <Info size={16} className="text-indigo-400" />
  };

  const borders = {
    success: "border-emerald-500/30",
    warning: "border-yellow-500/30",
    error: "border-red-500/30",
    info: "border-indigo-500/30"
  };

  return (
    <div className={`
      fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-xl glass border shadow-2xl animate-slide-up
      ${borders[type]}
    `}>
      {icons[type]}
      <span className="text-xs font-semibold text-white font-sans">{message}</span>
      {onClose && (
        <button 
          onClick={onClose}
          className="text-slate-400 hover:text-white transition-colors ml-2 p-0.5 rounded hover:bg-white/5"
        >
          <X size={14} />
        </button>
      )}
    </div>
  );
}

// Visual wrapper to display lists of active notifications
export function ToastContainer({ toasts, setToasts }) {
  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 pointer-events-auto">
      {toasts.map((t) => (
        <Toast
          key={t.id}
          message={t.message}
          type={t.type}
          onClose={() => removeToast(t.id)}
        />
      ))}
    </div>
  );
}
