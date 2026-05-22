import React from 'react';

export function Button({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  onClick, 
  className = '', 
  disabled = false,
  type = 'button'
}) {
  const baseStyle = "inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background disabled:opacity-50 disabled:pointer-events-none active:scale-[0.98]";
  
  const variants = {
    primary: "bg-primary text-primary-foreground hover:bg-primary/95 shadow-md shadow-primary/20",
    secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80 border border-border",
    accent: "bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-600/10",
    outline: "border border-border hover:bg-accent/50 text-foreground",
    ghost: "hover:bg-accent/50 text-foreground",
    danger: "bg-red-600 hover:bg-red-500 text-white shadow-md shadow-red-600/10"
  };

  const sizes = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base"
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyle} ${variants[variant]} ${sizes[size]} ${className}`}
    >
      {children}
    </button>
  );
}
