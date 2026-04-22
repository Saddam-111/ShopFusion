import React from 'react';

export const Card = ({ 
  children, 
  hover = true,
  padding = 'md',
  className = '',
  ...props 
}) => {
  const paddingSizes = {
    none: 'p-0',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8'
  };
  
  const hoverClasses = hover 
    ? 'hover:border-art-gold/40 hover:-translate-y-1 hover:shadow-xl transition-all duration-300' 
    : '';
  
  return (
    <div 
      className={`
        bg-art-charcoal 
        border border-art-gold/15 
        rounded-xl 
        ${paddingSizes[padding]}
        ${hoverClasses}
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;