import React from 'react';

export function Badge({ 
  children, 
  variant = 'primary', 
  className = '' 
}) {
  const baseStyle = "inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold tracking-wider uppercase";
  
  const variants = {
    primary: "bg-primary/20 text-purple-300 border border-primary/30",
    secondary: "bg-secondary text-secondary-foreground",
    success: "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30",
    warning: "bg-yellow-500/20 text-yellow-300 border border-yellow-500/30",
    danger: "bg-red-500/20 text-red-300 border border-red-500/30",
    pro: "bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-sm shadow-purple-600/20 font-bold"
  };

  return (
    <span className={`${baseStyle} ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
}
