import React from "react";

export const Button = ({ 
  children, 
  variant = "primary", 
  className = "", 
  disabled = false,
  onClick,
  type = "button",
  ...props 
}) => {
  const baseClasses = "px-8 py-3 font-semibold tracking-wider uppercase transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "btn-gold",
    outline: "btn-outline",
    ghost: "bg-transparent text-art-gold hover:bg-art-gold/10"
  };

  return (
    <button
      type={type}
      className={`${baseClasses} ${variants[variant]} ${className}`}
      disabled={disabled}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
};

export const Card = ({ children, className = "", hover = true, ...props }) => {
  return (
    <div 
      className={`p-6 ${hover ? "card-luxury" : "bg-bg-secondary"} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export const Input = ({ 
  label, 
  error, 
  className = "", 
  type = "text",
  ...props 
}) => {
  return (
    <div className={`mb-4 ${className}`}>
      {label && (
        <label className="block text-sm tracking-wider uppercase text-art-silver mb-2">
          {label}
        </label>
      )}
      <input
        type={type}
        className={`w-full input-luxury ${error ? "border-red-500" : ""}`}
        {...props}
      />
      {error && (
        <p className="text-red-500 text-sm mt-1">{error}</p>
      )}
    </div>
  );
};

export const Badge = ({ children, variant = "gold", className = "" }) => {
  const variants = {
    gold: "bg-art-gold text-art-black",
    outline: "border border-art-gold text-art-gold bg-transparent"
  };

  return (
    <span className={`px-3 py-1 text-xs uppercase tracking-wider font-semibold ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
};

export const Divider = ({ className = "" }) => {
  return (
    <div className={`flex items-center gap-4 ${className}`}>
      <div className="flex-1 h-px bg-gradient-to-r from-transparent via-art-gold to-transparent opacity-30" />
      <div className="w-2 h-2 rotate-45 border border-art-gold" />
      <div className="flex-1 h-px bg-gradient-to-r from-transparent via-art-gold to-transparent opacity-30" />
    </div>
  );
};

export const Loader = ({ size = "md", className = "" }) => {
  const sizes = {
    sm: "w-4 h-4",
    md: "w-8 h-8", 
    lg: "w-12 h-12"
  };

  return (
    <div className={`${sizes[size]} border-2 border-art-gold/30 border-t-art-gold animate-spin rounded-full ${className}`} />
  );
};

export const SectionTitle = ({ children, className = "" }) => {
  return (
    <h2 className={`text-3xl md:text-4xl font-art-deco text-center text-gradient-gold ${className}`}>
      {children}
    </h2>
  );
};

export const PageContainer = ({ children, className = "" }) => {
  return (
    <div className={`min-h-screen pt-20 px-4 md:px-8 max-w-7xl mx-auto ${className}`}>
      {children}
    </div>
  );
};