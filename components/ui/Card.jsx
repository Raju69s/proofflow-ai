import React from 'react';

export function Card({ 
  children, 
  variant = 'glass', 
  className = '', 
  onClick,
  hoverEffect = false
}) {
  const baseStyle = "rounded-xl overflow-hidden transition-all duration-300";
  
  const variants = {
    glass: "glass-premium border border-white/5",
    standard: "bg-card border border-border text-card-foreground",
    outline: "border border-border/80 bg-transparent",
    accent: "glass-premium border-l-4 border-l-emerald-500 border border-white/5"
  };

  const hoverStyle = hoverEffect ? "hover:scale-[1.02] hover:border-white/10 hover:shadow-lg hover:shadow-primary/5 cursor-pointer" : "";

  return (
    <div
      onClick={onClick}
      className={`${baseStyle} ${variants[variant]} ${hoverStyle} ${className}`}
    >
      {children}
    </div>
  );
}

export function CardHeader({ children, className = '' }) {
  return (
    <div className={`p-5 border-b border-white/5 ${className}`}>
      {children}
    </div>
  );
}

export function CardBody({ children, className = '' }) {
  return (
    <div className={`p-5 ${className}`}>
      {children}
    </div>
  );
}

export function CardFooter({ children, className = '' }) {
  return (
    <div className={`p-5 bg-black/20 border-t border-white/5 ${className}`}>
      {children}
    </div>
  );
}
