import React, { useState, useEffect } from 'react';
import { ChapelCross } from './ChapelCross';
import { AppSettings } from '../types';
import { RefreshCw, ShieldAlert, Sparkles } from 'lucide-react';

interface FullSanctuaryViewProps {
  settings: AppSettings;
  onRetry?: () => void;
}

export const FullSanctuaryView: React.FC<FullSanctuaryViewProps> = ({ settings, onRetry }) => {
  const isDark = settings.theme === 'candlelight' || settings.theme === 'stone';
  const [countdown, setCountdown] = useState<number>(15);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          if (onRetry) onRetry();
          return 15;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [onRetry]);

  const handleManualRetry = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      if (onRetry) onRetry();
    }, 600);
  };

  return (
    <div className={`min-h-[85vh] flex items-center justify-center p-4 sm:p-6 transition-colors duration-300 ${
      isDark ? 'bg-[#121110] text-[#F5EBD8]' : 'bg-[#FDFCF5] text-[#1A2A40]'
    }`}>
      <div className={`w-full max-w-xl rounded-3xl border p-8 sm:p-12 text-center space-y-8 shadow-2xl relative overflow-hidden backdrop-blur-md ${
        isDark ? 'bg-[#181614]/90 border-[#38332B]' : 'bg-[#FAF6EE]/95 border-[#EBDCC8]'
      }`}>
        {/* Subtle background glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-48 bg-[#D4AF37]/10 rounded-full blur-3xl pointer-events-none" />

        {/* Pulsing Candle Flame Icon */}
        <div className="flex flex-col items-center justify-center space-y-3">
          <div className="relative">
            <div className="w-4 h-4 rounded-full bg-[#D4AF37] animate-ping opacity-75 absolute inset-0" />
            <div className="w-4 h-4 rounded-full bg-[#D4AF37] shadow-[0_0_20px_#D4AF37]" />
          </div>
          <ChapelCross showGlow={true} className="w-12 h-12 text-[#D4AF37] mt-3" />
        </div>

        {/* Title */}
        <div className="space-y-3">
          <div className="inline-flex items-center space-x-2 text-xs font-mono tracking-[0.18em] uppercase font-bold text-[#D4AF37] drop-shadow-[0_0_10px_rgba(212,175,55,0.6)]">
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Capacity Exceeded • 503 Fallback</span>
          </div>

          <h1 className="font-heading text-3xl sm:text-4xl font-bold tracking-tight text-[#F5EBD8] dark:text-[#F5EBD8]">
            The Sanctuary is Full
          </h1>
        </div>

        {/* Psalm 46:10 Quote */}
        <blockquote className="font-scripture italic text-xl sm:text-2xl text-[#D4AF37] leading-relaxed px-2">
          "Be still, and know that I am God."
          <footer className="text-sm font-sans not-italic text-stone-400 font-normal mt-1">
            - Psalm 46:10
          </footer>
        </blockquote>

        {/* Fallback Explanation Message */}
        <p className={`text-base sm:text-lg leading-relaxed max-w-md mx-auto font-sans ${
          isDark ? 'text-[#C2B7A5]' : 'text-stone-700'
        }`}>
          Our little micro-chapel in Scotland is currently filled with quiet visitors. Please pause, take a breath, and step inside again in a few moments.
        </p>

        {/* Action Controls */}
        <div className="space-y-4 pt-2">
          <button
            onClick={handleManualRetry}
            disabled={isRefreshing}
            className="w-full sm:w-auto px-8 py-3.5 rounded-full font-semibold text-sm bg-[#D4AF37] text-[#121110] hover:bg-[#E6C254] transition-all transform active:scale-95 shadow-lg flex items-center justify-center space-x-2 mx-auto disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>Step Inside Again</span>
          </button>

          <p className="text-xs font-mono text-stone-400 flex items-center justify-center space-x-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>Auto-retrying in <strong className="text-[#D4AF37]">{countdown}</strong> seconds...</span>
          </p>
        </div>

        {/* Telemetry Note */}
        <div className="pt-6 border-t border-stone-800/60 text-xs font-sans text-stone-400 leading-relaxed space-y-1">
          <div>Raspberry Pi Zero 2 W on My Home Altar in Scotland</div>
          <div className="text-[#D4AF37]/80 text-[11px]">
            Inverclyde, Scotland • Connected to My Prayer Altar
          </div>
        </div>
      </div>
    </div>
  );
};
