import React from 'react';

const Logo = ({ size = 'md', variant = 'dark', showText = true, className = '' }) => {
  // Dimensions map
  const sizeMap = {
    sm: { icon: 'w-7 h-7', text: 'text-base', sub: 'text-[9px]' },
    md: { icon: 'w-10 h-10', text: 'text-xl', sub: 'text-[10px]' },
    lg: { icon: 'w-14 h-14', text: 'text-2xl', sub: 'text-xs' },
    xl: { icon: 'w-20 h-20', text: 'text-3xl', sub: 'text-sm' },
  };

  const currentSize = sizeMap[size] || sizeMap.md;
  const isLight = variant === 'light';

  return (
    <div className={`flex items-center space-x-3 select-none group ${className}`}>
      {/* Precision Geometric SVG Emblem */}
      <div className={`${currentSize.icon} shrink-0 relative transition-transform duration-300 group-hover:scale-105`}>
        <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-xs">
          {/* Base plate */}
          <rect
            x="8"
            y="8"
            width="104"
            height="104"
            rx="4"
            fill={isLight ? '#FFFFFF' : '#141719'}
            stroke={isLight ? '#EFECE6' : '#2C3238'}
            strokeWidth="2"
          />

          {/* Coordinate crosshairs */}
          <line x1="60" y1="18" x2="60" y2="102" stroke={isLight ? '#E2DFD7' : '#2C3238'} strokeWidth="1.5" strokeDasharray="3 3" />
          <line x1="18" y1="60" x2="102" y2="60" stroke={isLight ? '#E2DFD7' : '#2C3238'} strokeWidth="1.5" strokeDasharray="3 3" />
          <circle cx="60" cy="60" r="42" stroke={isLight ? '#E2DFD7' : '#2C3238'} strokeWidth="1.5" />

          {/* Maritime North Compass Needle (Safety Rust) */}
          <polygon points="60,20 70,56 60,60" fill="#C85A32" />
          <polygon points="60,20 50,56 60,60" fill="#D96E49" />

          {/* South Needle */}
          <polygon points="60,100 70,64 60,60" fill={isLight ? '#697077' : '#9AA1A9'} />
          <polygon points="60,100 50,64 60,60" fill={isLight ? '#9AA1A9' : '#EFECE6'} />

          {/* East / West Guides */}
          <polygon points="98,60 64,55 60,60" fill={isLight ? '#CBD5E1' : '#484F56'} />
          <polygon points="22,60 56,65 60,60" fill={isLight ? '#CBD5E1' : '#484F56'} />

          {/* Core Eye */}
          <circle cx="60" cy="60" r="6" fill={isLight ? '#FFFFFF' : '#141719'} stroke={isLight ? '#141719' : '#EFECE6'} strokeWidth="2" />
          <circle cx="60" cy="60" r="2.5" fill="#C85A32" />
        </svg>
      </div>

      {/* Brand Typography */}
      {showText && (
        <div className="leading-tight">
          <span
            className={`font-display font-bold ${currentSize.text} tracking-tight block ${
              isLight ? 'text-white' : 'text-[#141719]'
            }`}
          >
            PROJECT<span className="font-light">HUB</span>
          </span>
          <span
            className={`font-mono uppercase tracking-widest ${currentSize.sub} block ${
              isLight ? 'text-[#9AA1A9]' : 'text-[#697077]'
            }`}
          >
            Cornwall Academic Commons
          </span>
        </div>
      )}
    </div>
  );
};

export default Logo;

