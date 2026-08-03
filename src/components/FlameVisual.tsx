import React from 'react';

interface FlameVisualProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  isLit?: boolean;
}

export const FlameVisual: React.FC<FlameVisualProps> = ({ size = 'md', isLit = true }) => {
  const sizeMap = {
    sm: 'w-6 h-9',
    md: 'w-8 h-12',
    lg: 'w-12 h-18',
    xl: 'w-18 h-28'
  };

  if (!isLit) {
    return (
      <div className={`${sizeMap[size]} flex flex-col items-center justify-end relative select-none`}>
        {/* Soft unlit wick */}
        <div className="w-1 h-3 bg-stone-900 rounded-t border-t border-amber-900/40 shadow-xs" />
        <div className="w-2.5 h-1 bg-stone-800/80 rounded-full -mt-0.5" />
      </div>
    );
  }

  return (
    <div className={`relative flex flex-col items-center justify-end ${sizeMap[size]} select-none pointer-events-none`}>
      {/* Soft Ambient Golden Halo Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full rounded-full bg-amber-400/30 blur-md animate-pulse pointer-events-none" />

      {/* Flame & Wick assembly */}
      <div className="animate-flame origin-bottom flex flex-col items-center relative z-10 w-full h-full">
        <svg viewBox="0 0 100 150" className="w-full h-full overflow-visible filter drop-shadow-[0_0_12px_rgba(245,158,11,0.85)]">
          <defs>
            {/* Outer Flame Gradient */}
            <radialGradient id={`outerFlame-${size}`} cx="50%" cy="75%" r="65%">
              <stop offset="0%" stopColor="#FFFBEB" stopOpacity="1" />
              <stop offset="25%" stopColor="#FDE047" stopOpacity="0.95" />
              <stop offset="55%" stopColor="#F97316" stopOpacity="0.85" />
              <stop offset="85%" stopColor="#C2410C" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#7C2D12" stopOpacity="0" />
            </radialGradient>

            {/* Inner Intense Core Gradient */}
            <linearGradient id={`innerCore-${size}`} x1="0%" y1="100%" x2="0%" y2="0%">
              <stop offset="0%" stopColor="#60A5FA" stopOpacity="0.9" />
              <stop offset="20%" stopColor="#FDE047" stopOpacity="1" />
              <stop offset="60%" stopColor="#FFFFFF" stopOpacity="1" />
              <stop offset="100%" stopColor="#FEF08A" stopOpacity="0.9" />
            </linearGradient>

            {/* Blue Teardrop Base */}
            <radialGradient id={`blueBase-${size}`} cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.95" />
              <stop offset="70%" stopColor="#1D4ED8" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#1E3A8A" stopOpacity="0" />
            </radialGradient>

            {/* Ambient Room Radiance */}
            <radialGradient id={`roomRadiance-${size}`} cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#FBBF24" stopOpacity="0.45" />
              <stop offset="60%" stopColor="#D97706" stopOpacity="0.15" />
              <stop offset="100%" stopColor="#78350F" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Ambient background radiance */}
          <circle cx="50" cy="70" r="70" fill={`url(#roomRadiance-${size})`} />

          {/* Outer teardrop flame shape */}
          <path
            d="M50,8 C68,48 82,82 72,112 C62,138 38,138 28,112 C18,82 32,48 50,8 Z"
            fill={`url(#outerFlame-${size})`}
          />

          {/* Inner hot flame core */}
          <path
            className="animate-inner-flame"
            d="M50,30 C60,60 70,88 62,110 C56,128 44,128 38,110 C30,88 40,60 50,30 Z"
            fill={`url(#innerCore-${size})`}
          />

          {/* White-hot center filament */}
          <path
            d="M50,55 C55,75 60,95 56,110 C52,120 48,120 44,110 C40,95 45,75 50,55 Z"
            fill="#FFFFFF"
            opacity="0.95"
          />

          {/* Glowing blue teardrop base of candle flame */}
          <ellipse cx="50" cy="118" rx="14" ry="9" fill={`url(#blueBase-${size})`} />
        </svg>

        {/* Charred Wick with glowing red ember tip */}
        <div className="w-1 h-3.5 bg-gradient-to-t from-stone-900 via-stone-800 to-red-600 rounded-t -mt-2 relative z-20 flex justify-center">
          <div className="w-1.5 h-1.5 bg-amber-400 rounded-full blur-[0.5px] animate-ping opacity-75 -mt-0.5" />
        </div>
      </div>
    </div>
  );
};
