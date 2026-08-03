import React from 'react';
import { AppSettings } from '../types';
import { getDailySaint } from '../data/saints';
import { ChapelCross } from './ChapelCross';
import { Sparkles, Heart } from 'lucide-react';

interface SaintsViewProps {
  settings: AppSettings;
}

export const SaintsView: React.FC<SaintsViewProps> = ({ settings }) => {
  const isDark = settings.theme === 'candlelight' || settings.theme === 'stone';
  const dailySaint = getDailySaint();

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="text-center space-y-3">
        <h1 className={`font-heading text-3xl sm:text-4xl font-semibold tracking-wide ${
          isDark ? 'text-[#f5ebd8]' : 'text-[#1c2536]'
        }`}>
          Saint of the Day
        </h1>

        <p className={`text-sm sm:text-base font-sans leading-relaxed ${
          isDark ? 'text-[#C2B7A5]' : 'text-stone-600'
        }`}>
          Holy men and women whose heroic faith lights our pilgrimage toward God
        </p>
      </div>

      {/* Featured Daily Saint Card */}
      <div className={`p-8 sm:p-12 rounded-3xl border space-y-6 shadow-md ${
        isDark
          ? 'bg-[#1b1916] border-[#332e27] text-[#ece4d6]'
          : 'bg-[#faf6ee] border-[#ebdcc8] text-[#2d2922]'
      }`}>
        <div className="flex flex-wrap items-start justify-between gap-4 border-b pb-4 border-stone-300/30">
          <div>
            <div className="inline-flex items-center space-x-1.5 text-xs font-mono uppercase tracking-widest text-[#c5a059] mb-1 font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Today's Featured Saint • Feast Day: {dailySaint.feastDay}</span>
            </div>
            <h2 className="font-heading text-3xl sm:text-4xl font-bold mt-1">
              {dailySaint.name}
            </h2>
            <p className={`text-xs font-mono mt-1 ${isDark ? 'text-[#C2B7A5]' : 'text-stone-600'}`}>
              {dailySaint.title} {dailySaint.century ? `(${dailySaint.century})` : ''}
            </p>
          </div>

          <div className="text-right">
            <span className={`text-[10px] font-mono uppercase tracking-widest block ${isDark ? 'text-[#C2B7A5]' : 'text-stone-500'}`}>Patronage</span>
            <span className="text-xs font-semibold text-[#c5a059]">{dailySaint.patronage}</span>
          </div>
        </div>

        {dailySaint.quote && (
          <blockquote className="font-scripture italic text-lg sm:text-xl text-[#c5a059] border-l-2 border-[#c5a059] pl-4 py-1">
            "{dailySaint.quote}"
          </blockquote>
        )}

        {/* Bio */}
        <div className="space-y-2">
          <h4 className={`text-xs font-mono uppercase tracking-wider ${isDark ? 'text-[#C2B7A5]' : 'text-stone-600'}`}>Biography</h4>
          <p className="font-sans text-sm sm:text-base leading-relaxed opacity-90">
            {dailySaint.bio}
          </p>
        </div>

        {/* Saint's Prayer */}
        <div className={`p-6 rounded-2xl border space-y-2 ${
          isDark ? 'bg-[#24211c] border-[#38332b]' : 'bg-[#f2e7d5] border-[#dfcfb5]'
        }`}>
          <div className="flex items-center space-x-1.5 text-xs font-mono uppercase tracking-wider text-[#c5a059]">
            <ChapelCross size={14} />
            <span>Prayer of Intercession</span>
          </div>
          <p className="font-scripture italic text-base sm:text-lg leading-relaxed">
            "{dailySaint.prayer}"
          </p>
        </div>

        {/* Quiet reflection note */}
        <div className="text-center pt-2">
          <p className="text-xs font-mono text-stone-400 flex items-center justify-center space-x-1">
            <Heart className="w-3 h-3 text-[#c5a059]/70" />
            <span>A quiet daily companion for your pilgrimage</span>
          </p>
        </div>
      </div>
    </div>
  );
};
