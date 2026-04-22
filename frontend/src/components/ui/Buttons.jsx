import React from 'react';

export const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md',
  className = '',
  ...props 
}) => {
  const baseClasses = 'inline-flex items-center justify-center gap-2 font-semibold rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variants = {
    primary: 'bg-gradient-to-r from-art-gold to-art-gold-dark text-art-black hover:shadow-gold-lg hover:-translate-y-0.5 active:translate-y-0',
    secondary: 'bg-transparent border border-art-gold/50 text-art-gold hover:bg-art-gold/10 hover:border-art-gold',
    ghost: 'bg-transparent text-art-white hover:text-art-gold hover:bg-white/5',
    danger: 'bg-red-500 text-white hover:bg-red-600'
  };
  
  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-5 py-2.5 text-base',
    lg: 'px-6 py-3 text-lg'
  };
  
  return (
    <button 
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;