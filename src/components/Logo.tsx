import React from 'react';

export const LogoIcon = ({ className = "w-8 h-8" }: { className?: string }) => (
  <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    {/* Top Bar - Rounded top-left */}
    <path 
      d="M20 10 H85 V30 H40 C30 30 20 20 20 10 Z" 
      fill="currentColor" 
    />
    {/* Middle Bar and Stem - Rounded top-left of middle bar */}
    <path 
      d="M20 40 H75 V60 H40 C30 60 20 70 20 80 V100 H40 V60 H75 V40 H20 Z" 
      fill="currentColor" 
    />
  </svg>
);

export const Logo = ({ className = "", textClassName = "" }: { className?: string, textClassName?: string }) => (
  <div className={`flex items-center gap-3 ${className}`}>
    <LogoIcon className="w-8 h-8 text-primary" />
    <span className={`font-display text-2xl font-black tracking-tighter text-on-surface uppercase ${textClassName}`}>
      La Forge
    </span>
  </div>
);
