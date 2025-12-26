
import React from 'react';

interface GlassContainerProps {
  children: React.ReactNode;
  className?: string;
}

export const GlassContainer: React.FC<GlassContainerProps> = ({ children, className = "" }) => {
  return (
    <div className={`liquid-glass rounded-3xl shadow-xl overflow-hidden ${className}`}>
      {children}
    </div>
  );
};
