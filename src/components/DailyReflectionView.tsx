import React from 'react';
import { AppSettings } from '../types';
import { getDailyReflection } from '../data/reflections';

interface DailyReflectionViewProps {
  settings: AppSettings;
}

export const DailyReflectionView: React.FC<DailyReflectionViewProps> = ({ settings }) => {
  const isDark = settings.theme === 'candlelight' || settings.theme === 'stone';
  const reflection = getDailyReflection();

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8 animate-fade-in">
      {/* View Header */}
      <div className="text-center space-y-3">
        <h1 className={`font-heading text-3xl sm:text-4xl font-semibold tracking-wide ${
          isDark ? 'text-[#f5ebd8]' : 'text-[#1c2536]'
        }`}>
          Daily Reflection
        </h1>

        <p className={`text-sm font-sans font-medium ${
          isDark ? 'text-[#C2B7A5]' : 'text-stone-600'
        }`}>
          {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
      </div>

      {/* Sanctuary Card */}
      <div className={`p-8 sm:p-12 rounded-2xl border space-y-8 text-center shadow-sm ${
        isDark
          ? 'bg-[#1b1916] border-[#38332b] text-[#ece4d6]'
          : 'bg-[#faf6ee] border-[#ebdcc8] text-[#2d2922]'
      }`}>
        {/* 1. Reflection Title */}
        <h2 className={`font-heading text-2xl sm:text-3xl font-semibold tracking-wide ${
          isDark ? 'text-[#f5ebd8]' : 'text-[#1c2536]'
        }`}>
          {reflection.title}
        </h2>

        {/* 2. Scripture */}
        <div className="space-y-2 max-w-lg mx-auto border-y py-6 border-stone-400/20">
          <div className="text-xs font-mono uppercase tracking-widest text-[#c5a059]">
            {reflection.scriptureRef}
          </div>
          <blockquote className="font-scripture text-lg sm:text-xl italic text-[#f5ebd8] leading-relaxed">
            "{reflection.scriptureText}"
          </blockquote>
        </div>

        {/* 3. Short Reflection */}
        <p className="font-scripture text-lg sm:text-xl leading-relaxed max-w-lg mx-auto text-balance">
          {reflection.reflectionText}
        </p>

        {/* 4. Short Prayer */}
        <div className="pt-6 border-t border-stone-400/20 max-w-md mx-auto">
          <p className="font-scripture text-base sm:text-lg italic text-[#c5a059]">
            {reflection.prayer}
          </p>
        </div>
      </div>
    </div>
  );
};

