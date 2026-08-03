import React, { useState } from 'react';
import { DailyBlessing, ScriptureItem, AppSettings } from '../types';
import { DAILY_BLESSINGS } from '../data/blessings';
import { SCRIPTURE_COLLECTION } from '../data/scriptures';
import { FlameVisual } from './FlameVisual';
import { ChapelCross } from './ChapelCross';
import { Sparkles, Heart, BookOpen, Flame, Compass, Moon, Scroll } from 'lucide-react';
import { playChapelBell } from '../utils/audio';

interface BlessingCardProps {
  settings: AppSettings;
  onNavigate: (view: any) => void;
}

const getDayOfYear = (): number => {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const diff = now.getTime() - start.getTime();
  const oneDay = 1000 * 60 * 60 * 24;
  return Math.floor(diff / oneDay);
};

export const BlessingCard: React.FC<BlessingCardProps> = ({ settings, onNavigate }) => {
  const isDark = settings.theme === 'candlelight' || settings.theme === 'stone';
  
  const [currentIndex, setCurrentIndex] = useState<number>(() => getDayOfYear());
  const [contentType, setContentType] = useState<'blessing' | 'scripture'>('blessing');
  const [fade, setFade] = useState<boolean>(true);

  const currentBlessing: DailyBlessing = DAILY_BLESSINGS[currentIndex % DAILY_BLESSINGS.length];
  const currentScripture: ScriptureItem = SCRIPTURE_COLLECTION[currentIndex % SCRIPTURE_COLLECTION.length];

  const handleNextBlessing = () => {
    if (settings.quietBell) {
      playChapelBell(0.12);
    }
    setFade(false);
    setTimeout(() => {
      setCurrentIndex(prev => prev + 1);
      setContentType(prev => prev === 'blessing' ? 'scripture' : 'blessing');
      setFade(true);
    }, 250);
  };

  return (
    <section className="min-h-[75vh] flex flex-col items-center justify-center px-6 sm:px-12 py-10 sm:py-16 max-w-5xl mx-auto text-center relative">
      {/* Decorative Corner Accents (with pointer-events-none and ample padding) */}
      <div className="hidden sm:block absolute top-3 left-3 sm:top-4 sm:left-4 w-8 h-8 border-t border-l border-[#E0DBC1]/50 pointer-events-none" />
      <div className="hidden sm:block absolute top-3 right-3 sm:top-4 sm:right-4 w-8 h-8 border-t border-r border-[#E0DBC1]/50 pointer-events-none" />
      <div className="hidden sm:block absolute bottom-3 left-3 sm:bottom-4 sm:left-4 w-8 h-8 border-b border-l border-[#E0DBC1]/50 pointer-events-none" />
      <div className="hidden sm:block absolute bottom-3 right-3 sm:bottom-4 sm:right-4 w-8 h-8 border-b border-r border-[#E0DBC1]/50 pointer-events-none" />

      {/* Candle & Cross Accent SVG from Design */}
      <div className="mb-4 flex flex-col items-center space-y-3 opacity-90">
        <svg width="40" height="52" viewBox="0 0 48 64" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="22" y="0" width="4" height="64" fill="#D4AF37" opacity="0.65"/>
          <rect x="8" y="18" width="32" height="4" fill="#D4AF37" opacity="0.65"/>
        </svg>
      </div>

      {/* Primary Gentle Welcome */}
      <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl italic font-semibold leading-relaxed tracking-wide text-[#F5EBD8]">
        "Peace be with you."
      </h1>

      <p className="font-sans text-sm sm:text-base mt-2 tracking-wide text-[#C2B7A5] font-medium">
        Take a quiet moment in prayer.
      </p>
      <p className="font-sans text-xs sm:text-sm italic text-[#C2B7A5]/80 mt-1 tracking-wide font-normal">
        A quiet sanctuary for my Catholic and Christian brothers and sisters.
      </p>

      {/* Main Reflective Focus Card */}
      <div className={`mt-8 mb-8 w-full max-w-4xl p-8 sm:p-12 rounded-2xl border transition-all duration-500 shadow-lg relative ${
        fade ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-2'
      } bg-[#1b1916]/95 border-[#3d3830] text-[#F5EBD8]`}>
        {contentType === 'blessing' ? (
          <div className="space-y-6">
            <span className="inline-block text-xs font-mono tracking-[0.2em] uppercase font-bold text-[#D4AF37] drop-shadow-[0_0_10px_rgba(212,175,55,0.6)]">
              ✨ Daily Blessing ✨
            </span>
            <blockquote className="font-scripture text-2xl sm:text-3xl md:text-4xl leading-relaxed italic text-balance font-medium text-[#F5EBD8]">
              "{currentBlessing.text}"
            </blockquote>
            <div className="pt-2 text-xs sm:text-sm font-sans tracking-wide text-[#C2B7A5]">
              - Inspired by {currentBlessing.scriptureRef}
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <span className="inline-block text-xs font-mono tracking-[0.18em] uppercase font-bold text-[#98c5a2] drop-shadow-[0_0_10px_rgba(152,197,162,0.6)]">
              📖 Holy Scripture • {currentScripture.reference} ({currentScripture.translation})
            </span>
            <blockquote className="font-scripture text-2xl sm:text-3xl md:text-4xl leading-relaxed text-balance font-medium text-[#F5EBD8]">
              "{currentScripture.text}"
            </blockquote>
            {currentScripture.reflection && (
              <p className="font-sans text-xs sm:text-sm italic text-[#D4CEBF] pt-3 border-t border-[#332e27]">
                {currentScripture.reflection}
              </p>
            )}
          </div>
        )}

        {/* Action: Receive another blessing */}
        <div className="mt-8 pt-4">
          <button
            onClick={handleNextBlessing}
            className="px-6 py-2.5 rounded-full border border-[#D4AF37]/60 text-[#F5EBD8] hover:bg-[#D4AF37]/20 text-xs sm:text-sm font-semibold tracking-wide transition-all shadow-sm"
          >
            Receive another blessing
          </button>
        </div>
      </div>

      {/* Primary Sanctuary Navigation Grid */}
      <div className="w-full max-w-4xl">
        <h2 className="text-xs uppercase tracking-wider text-[#D4AF37] mb-4 font-semibold text-center">
          Chapel Offerings & Prayer Modes
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          <button
            onClick={() => onNavigate('gospel')}
            className="p-4 rounded-xl border text-center transition-all group bg-[#1b1916] border-[#38332b] hover:border-[#D4AF37] text-[#F5EBD8] hover:bg-[#25221e]"
          >
            <BookOpen className="w-5 h-5 mx-auto mb-2 text-[#D4AF37] group-hover:scale-110 transition-transform" />
            <span className="block text-xs sm:text-sm font-semibold tracking-wide">Today's Gospel</span>
          </button>

          <button
            onClick={() => onNavigate('prayers')}
            className="p-4 rounded-xl border text-center transition-all group bg-[#1b1916] border-[#38332b] hover:border-[#D4AF37] text-[#F5EBD8] hover:bg-[#25221e]"
          >
            <Heart className="w-5 h-5 mx-auto mb-2 text-[#88b392] group-hover:scale-110 transition-transform" />
            <span className="block text-xs sm:text-sm font-semibold tracking-wide">Catholic Prayers</span>
          </button>

          <button
            onClick={() => onNavigate('rosary')}
            className="p-4 rounded-xl border text-center transition-all group bg-[#1b1916] border-[#38332b] hover:border-[#D4AF37] text-[#F5EBD8] hover:bg-[#25221e]"
          >
            <Moon className="w-5 h-5 mx-auto mb-2 text-[#D4AF37] group-hover:scale-110 transition-transform" />
            <span className="block text-xs sm:text-sm font-semibold tracking-wide">Holy Rosary</span>
          </button>

          <button
            onClick={() => onNavigate('candle')}
            className="p-4 rounded-xl border text-center transition-all group bg-[#1b1916] border-[#38332b] hover:border-[#D4AF37] text-[#F5EBD8] hover:bg-[#25221e]"
          >
            <Flame className="w-5 h-5 mx-auto mb-2 text-[#D4AF37] group-hover:scale-110 transition-transform" />
            <span className="block text-xs sm:text-sm font-semibold tracking-wide">Light a Candle</span>
          </button>

          <button
            onClick={() => onNavigate('commandments')}
            className="p-4 rounded-xl border text-center transition-all group bg-[#1b1916] border-[#38332b] hover:border-[#D4AF37] text-[#F5EBD8] hover:bg-[#25221e]"
          >
            <Scroll className="w-5 h-5 mx-auto mb-2 text-[#D4AF37] group-hover:scale-110 transition-transform" />
            <span className="block text-xs sm:text-sm font-semibold tracking-wide">10 Commandments</span>
          </button>

          <button
            onClick={() => onNavigate('calendar')}
            className="p-4 rounded-xl border text-center transition-all group bg-[#1b1916] border-[#38332b] hover:border-[#D4AF37] text-[#F5EBD8] hover:bg-[#25221e]"
          >
            <Compass className="w-5 h-5 mx-auto mb-2 text-[#88b392] group-hover:scale-110 transition-transform" />
            <span className="block text-xs sm:text-sm font-semibold tracking-wide">Liturgical Calendar</span>
          </button>

          <button
            onClick={() => onNavigate('saints')}
            className="p-4 rounded-xl border text-center transition-all group bg-[#1b1916] border-[#38332b] hover:border-[#D4AF37] text-[#F5EBD8] hover:bg-[#25221e]"
          >
            <Sparkles className="w-5 h-5 mx-auto mb-2 text-[#D4AF37] group-hover:scale-110 transition-transform" />
            <span className="block text-xs sm:text-sm font-semibold tracking-wide">Saints</span>
          </button>

          <button
            onClick={() => onNavigate('about')}
            className="p-4 rounded-xl border text-center transition-all group bg-[#1b1916] border-[#38332b] hover:border-[#D4AF37] text-[#F5EBD8] hover:bg-[#25221e]"
          >
            <ChapelCross className="w-5 h-5 mx-auto mb-2 text-[#C2B7A5] group-hover:scale-110 transition-transform" />
            <span className="block text-xs sm:text-sm font-semibold tracking-wide">About By His Light</span>
          </button>
        </div>
      </div>
    </section>
  );
};
