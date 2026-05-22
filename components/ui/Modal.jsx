import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { Card } from './Card';

export function Modal({ 
  isOpen = false, 
  onClose, 
  title, 
  children, 
  className = '' 
}) {
  // Prevent background scrolling when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop overlay */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
      />
      
      {/* Main dialog box */}
      <Card 
        variant="glass" 
        className={`relative z-10 w-full max-w-lg shadow-2xl border border-white/10 animate-slide-up ${className}`}
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold font-display text-white">{title}</h3>
            {onClose && (
              <button 
                onClick={onClose}
                className="text-slate-400 hover:text-white transition-colors p-1 hover:bg-white/5 rounded-lg"
              >
                <X size={20} />
              </button>
            )}
          </div>
          
          <div className="text-slate-300 text-sm">
            {children}
          </div>
        </div>
      </Card>
    </div>
  );
}
