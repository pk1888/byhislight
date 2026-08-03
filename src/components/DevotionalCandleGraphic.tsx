import React from 'react';
import { AltarCandleOption } from '../data/candles';
import { FlameVisual } from './FlameVisual';

interface DevotionalCandleGraphicProps {
  candle: AltarCandleOption;
  isSelected?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const DevotionalCandleGraphic: React.FC<DevotionalCandleGraphicProps> = ({
  candle,
  isSelected = false,
  size = 'md'
}) => {
  const heightClasses = size === 'sm' ? 'h-40 w-20' : size === 'lg' ? 'h-64 w-32' : 'h-52 w-24 sm:h-56 sm:w-28';

  return (
    <div className={`relative flex flex-col items-center select-none transition-all duration-300 ${
      isSelected ? 'scale-105' : 'hover:scale-[1.02]'
    }`}>
      {/* Flame & Warm Candlelight Aura */}
      <div className="relative -mb-3 z-30 flex flex-col items-center">
        <FlameVisual size={size === 'sm' ? 'sm' : size === 'lg' ? 'lg' : 'md'} isLit={true} />
      </div>

      {/* Melted Wax Concave Basin Top */}
      <div className="w-16 sm:w-20 h-2.5 bg-gradient-to-r from-[#D9C49D] via-[#FFF8E7] to-[#CBB48A] rounded-t-full border-t border-amber-900/20 shadow-inner relative z-20 flex justify-center items-center">
        <div className="w-4 h-1 bg-amber-950/20 rounded-full blur-[0.5px]" />
      </div>

      {/* Realistic Devotional Pillar Candle Body */}
      <div className={`relative ${heightClasses} rounded-t-lg rounded-b-sm border transition-all duration-300 overflow-hidden flex flex-col items-center justify-between p-2 shadow-xl ${
        isSelected
          ? 'border-[#D4AF37] ring-2 ring-[#D4AF37]/70 shadow-[0_0_28px_rgba(212,175,55,0.4)]'
          : 'border-amber-950/40 hover:border-amber-600/50'
      } bg-gradient-to-r from-[#D4C3A3] via-[#FAF3E6] to-[#C9B693]`}>
        
        {/* Soft Translucent Specular Highlight Strip down center */}
        <div className="absolute top-0 bottom-0 left-1/3 w-1/4 bg-gradient-to-r from-transparent via-white/35 to-transparent pointer-events-none" />

        {/* Wax Drips Effect */}
        <div className="absolute top-0 left-2 w-1.5 h-6 bg-white/40 rounded-b-full pointer-events-none" />
        <div className="absolute top-0 right-3 w-1 h-4 bg-white/30 rounded-b-full pointer-events-none" />

        {/* Sacred Iconography Arch Frame (Catholic Altarpiece Style) */}
        <div className="relative w-full flex-1 my-1 rounded-t-full rounded-b-md overflow-hidden border border-amber-900/40 bg-[#16100A] flex flex-col items-center justify-center text-center p-2 shadow-inner">
          
          {/* Subtle Halo / Rays Background */}
          <div 
            className="absolute inset-0 opacity-40" 
            style={{
              background: `radial-gradient(circle at center 35%, ${candle.secondaryColor} 0%, transparent 75%)`
            }} 
          />

          {/* SACRED HEART OF JESUS */}
          {candle.id === 'sacred_heart_jesus' && (
            <svg viewBox="0 0 100 130" className="w-full h-full relative z-10" fill="none">
              {/* Golden Halo */}
              <circle cx="50" cy="45" r="28" fill="url(#halo-gold)" opacity="0.85" />
              <circle cx="50" cy="45" r="28" stroke="#D4AF37" strokeWidth="1.5" strokeDasharray="2 2" />
              
              {/* Red Tunic & Blue Mantle */}
              <path d="M25 125 C 25 75, 35 55, 50 55 C 65 55, 75 75, 75 125 Z" fill="#9B1C1C" />
              <path d="M20 125 C 22 80, 32 60, 42 60 C 35 80, 30 100, 25 125 Z" fill="#1E3A8A" />
              <path d="M80 125 C 78 80, 68 60, 58 60 C 65 80, 70 100, 75 125 Z" fill="#1E3A8A" />
              
              {/* Head / Face Silhouette */}
              <circle cx="50" cy="42" r="14" fill="#EAD5BE" />
              {/* Hair */}
              <path d="M35 40 C 35 28, 65 28, 65 40 C 65 48, 61 52, 61 52 C 61 52, 59 42, 50 42 C 41 42, 39 52, 39 52 C 39 52, 35 48, 35 40 Z" fill="#4A2E18" />

              {/* Sacred Heart burning on Chest */}
              <g transform="translate(50, 82)">
                <path d="M0 12 C -12 2, -14 -8, -6 -14 C -1 -18, 0 -10, 0 -10 C 0 -10, 1 -18, 6 -14 C 14 -8, 12 2, 0 12 Z" fill="#DC2626" stroke="#F59E0B" strokeWidth="1" />
                {/* Flame atop Sacred Heart */}
                <path d="M-3 -14 C -5 -20, 0 -25, 0 -25 C 0 -25, 5 -20, 3 -14 Z" fill="#FBBF24" />
                {/* Cross atop flame */}
                <path d="M0 -24 V -29 M -2.5 -27 H 2.5" stroke="#FEF3C7" strokeWidth="1" strokeLinecap="round" />
              </g>

              {/* Linear Gradients */}
              <defs>
                <radialGradient id="halo-gold" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#FEF08A" />
                  <stop offset="70%" stopColor="#D4AF37" />
                  <stop offset="100%" stopColor="#B45309" stopOpacity="0" />
                </radialGradient>
              </defs>
            </svg>
          )}

          {/* ST. THERESA (THE LITTLE FLOWER) */}
          {candle.id === 'st_theresa' && (
            <svg viewBox="0 0 100 130" className="w-full h-full relative z-10" fill="none">
              {/* Soft Rose-Gold Halo */}
              <circle cx="50" cy="44" r="27" fill="url(#theresa-halo)" opacity="0.9" />
              <circle cx="50" cy="44" r="27" stroke="#FDA4AF" strokeWidth="1.2" strokeDasharray="3 2" />

              {/* Carmelite Habit (Brown Robe & Cream Mantle) */}
              <path d="M22 125 C 22 75, 32 58, 50 58 C 68 58, 78 75, 78 125 Z" fill="#543A23" />
              <path d="M30 125 C 32 72, 40 60, 50 60 C 60 60, 68 72, 70 125 Z" fill="#FDF6E2" />

              {/* Black Veil */}
              <path d="M33 42 C 33 28, 67 28, 67 42 C 67 58, 65 68, 65 78 L 35 78 C 35 68, 33 58, 33 42 Z" fill="#1C1917" />
              <path d="M36 40 C 36 32, 64 32, 64 40 Z" fill="#FDF6E2" />

              {/* Face Silhouette */}
              <circle cx="50" cy="45" r="12" fill="#F5E0D0" />

              {/* Holding Bouquet of Roses & Crucifix */}
              <g transform="translate(50, 84)">
                {/* Crucifix */}
                <path d="M0 -14 V 10 M -6 -8 H 6" stroke="#D4AF37" strokeWidth="2" strokeLinecap="round" />
                {/* Roses cluster */}
                <circle cx="-6" cy="2" r="4" fill="#F43F5E" />
                <circle cx="0" cy="4" r="4.5" fill="#E11D48" />
                <circle cx="6" cy="2" r="4" fill="#FB7185" />
                <circle cx="-3" cy="-3" r="3.5" fill="#FDA4AF" />
                <circle cx="3" cy="-3" r="3.5" fill="#F43F5E" />
              </g>

              <defs>
                <radialGradient id="theresa-halo" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#FFE4E6" />
                  <stop offset="70%" stopColor="#FB7185" />
                  <stop offset="100%" stopColor="#881337" stopOpacity="0" />
                </radialGradient>
              </defs>
            </svg>
          )}

          {/* SACRED HEART OF MARY */}
          {candle.id === 'sacred_heart_mary' && (
            <svg viewBox="0 0 100 130" className="w-full h-full relative z-10" fill="none">
              {/* Crown of Stars & Golden Blue Halo */}
              <circle cx="50" cy="45" r="28" fill="url(#mary-halo)" opacity="0.9" />
              <circle cx="50" cy="45" r="28" stroke="#FDE047" strokeWidth="1.2" />
              
              {/* White Gown & Heavenly Blue Mantle */}
              <path d="M20 125 C 20 65, 30 40, 50 35 C 70 40, 80 65, 80 125 Z" fill="#1E40AF" />
              <path d="M30 125 C 32 60, 40 42, 50 40 C 60 42, 68 60, 70 125 Z" fill="#F8FAFC" opacity="0.9" />
              
              {/* Face Silhouette */}
              <circle cx="50" cy="45" r="13" fill="#F5E0D0" />

              {/* Immaculate Sacred Heart with Rose Garland */}
              <g transform="translate(50, 84)">
                <path d="M0 12 C -12 2, -14 -8, -6 -14 C -1 -18, 0 -10, 0 -10 C 0 -10, 1 -18, 6 -14 C 14 -8, 12 2, 0 12 Z" fill="#E11D48" stroke="#FDE047" strokeWidth="1" />
                {/* Roses Wreath */}
                <circle cx="-6" cy="-2" r="3" fill="#FB7185" />
                <circle cx="0" cy="4" r="3" fill="#FB7185" />
                <circle cx="6" cy="-2" r="3" fill="#FB7185" />
                {/* Flame of Divine Love */}
                <path d="M-2.5 -14 C -4 -19, 0 -23, 0 -23 C 0 -23, 4 -19, 2.5 -14 Z" fill="#FBBF24" />
              </g>

              <defs>
                <radialGradient id="mary-halo" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#BAE6FD" />
                  <stop offset="70%" stopColor="#38BDF8" />
                  <stop offset="100%" stopColor="#1E3A8A" stopOpacity="0" />
                </radialGradient>
              </defs>
            </svg>
          )}

          {/* ST. FRANCIS OF ASSISI */}
          {candle.id === 'st_francis' && (
            <svg viewBox="0 0 100 130" className="w-full h-full relative z-10" fill="none">
              {/* Warm Golden Nature Halo */}
              <circle cx="50" cy="44" r="27" fill="url(#francis-halo)" opacity="0.85" />
              <circle cx="50" cy="44" r="27" stroke="#FACC15" strokeWidth="1.2" strokeDasharray="4 2" />

              {/* Franciscan Habit (Brown Robe & Hood) */}
              <path d="M22 125 C 22 75, 32 56, 50 56 C 68 56, 78 75, 78 125 Z" fill="#653819" />
              <path d="M38 56 C 38 42, 62 42, 62 56 L 66 70 C 66 70, 50 76, 34 70 Z" fill="#4A260F" />
              {/* White Cord Belt with Knots */}
              <path d="M30 92 C 42 96, 58 96, 70 92" stroke="#FEF08A" strokeWidth="2.5" strokeDasharray="3 3" />

              {/* Tonsure / Hair & Face */}
              <circle cx="50" cy="44" r="12" fill="#EAD5BE" />
              <path d="M38 38 C 38 30, 62 30, 62 38 Z" fill="#3B1F0E" />

              {/* Holding Crucifix & Peaceful Dove */}
              <g transform="translate(50, 82)">
                <path d="M-4 -12 V 12 M -10 -4 H 2" stroke="#D4AF37" strokeWidth="2" strokeLinecap="round" />
                {/* White Bird / Dove of Peace */}
                <path d="M8 -6 C 14 -12, 18 -4, 12 2 C 8 4, 4 -2, 8 -6 Z" fill="#FFFFFF" />
                <path d="M12 -8 C 16 -14, 20 -10, 16 -4 Z" fill="#F1F5F9" />
              </g>

              <defs>
                <radialGradient id="francis-halo" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#FEF08A" />
                  <stop offset="70%" stopColor="#EAB308" />
                  <stop offset="100%" stopColor="#713F12" stopOpacity="0" />
                </radialGradient>
              </defs>
            </svg>
          )}

          {/* 5TH DEVOTION (ST. MICHAEL / SANCTUARY SPECIAL INTENTION) */}
          {candle.id === 'fifth_figure_tbd' && (
            <svg viewBox="0 0 100 130" className="w-full h-full relative z-10" fill="none">
              {/* Heavenly Archangel Wings & Radiant Shield Halo */}
              <circle cx="50" cy="45" r="28" fill="url(#st-michael-halo)" opacity="0.9" />
              
              {/* Angelic Wings */}
              <path d="M50 45 C 30 15, 5 35, 18 75 C 25 60, 38 52, 50 50 Z" fill="#FDE047" opacity="0.75" />
              <path d="M50 45 C 70 15, 95 35, 82 75 C 75 60, 62 52, 50 50 Z" fill="#FDE047" opacity="0.75" />

              {/* Armor Mantle */}
              <path d="M25 125 C 25 75, 35 56, 50 56 C 65 56, 75 75, 75 125 Z" fill="#1E293B" />
              <path d="M35 125 C 35 78, 42 64, 50 64 C 58 64, 65 78, 65 125 Z" fill="#D4AF37" />

              {/* Face Silhouette */}
              <circle cx="50" cy="43" r="12" fill="#F5E0D0" />
              <path d="M38 38 C 38 28, 62 28, 62 38 Z" fill="#B45309" />

              {/* Flaming Sword & Golden Shield of Faith */}
              <g transform="translate(50, 85)">
                {/* Shield */}
                <path d="M-10 -10 H 10 V 4 C 10 12, 0 18, 0 18 C 0 18, -10 12, -10 4 Z" fill="#DC2626" stroke="#FDE047" strokeWidth="1.5" />
                {/* Cross on Shield */}
                <path d="M0 -6 V 12 M -6 0 H 6" stroke="#FEF08A" strokeWidth="1.5" />
                {/* Flame atop Shield */}
                <path d="M-2 -18 C -4 -23, 0 -26, 0 -26 C 0 -26, 4 -23, 2 -18 Z" fill="#F59E0B" />
              </g>

              <defs>
                <radialGradient id="st-michael-halo" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#FEF08A" />
                  <stop offset="60%" stopColor="#F59E0B" />
                  <stop offset="100%" stopColor="#7C2D12" stopOpacity="0" />
                </radialGradient>
              </defs>
            </svg>
          )}

          {/* Candle Title on Arch Frame Base */}
          <div className="absolute bottom-1.5 inset-x-1 py-0.5 bg-black/60 backdrop-blur-xs rounded text-[10px] font-serif text-amber-200/90 border border-amber-500/20 truncate px-1">
            {candle.name}
          </div>
        </div>

        {/* Polished Brass Altar Stand Base */}
        <div className="w-[110%] h-3.5 bg-gradient-to-r from-[#634814] via-[#D4AF37] to-[#543D11] rounded-b-md border-t border-amber-300/40 shadow-md flex justify-center items-center">
          <div className="w-full h-0.5 bg-[#FFF0A5]/40" />
        </div>
      </div>
    </div>
  );
};
