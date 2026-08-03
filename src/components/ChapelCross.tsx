import React from 'react';

interface ChapelCrossProps {
  className?: string;
  size?: number;
  showGlow?: boolean;
}

export const ChapelCross: React.FC<ChapelCrossProps> = ({
  className = "w-6 h-6 text-[#c5a059]",
  size,
  showGlow = false
}) => {
  const style = size ? { width: size, height: size } : undefined;

  return (
    <div className={`relative inline-flex items-center justify-center ${showGlow ? 'glow-candle rounded-full p-2' : ''}`}>
      <svg
        style={style}
        className={className}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        {/* Simple elegant Christian Latin cross */}
        <line x1="12" y1="2" x2="12" y2="22" />
        <line x1="6" y1="8" x2="18" y2="8" />
      </svg>
    </div>
  );
};
