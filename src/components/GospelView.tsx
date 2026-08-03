import React, { useState } from 'react';
import { AppSettings } from '../types';
import { ChapelCross } from './ChapelCross';
import { Calendar, RefreshCw } from 'lucide-react';
import { getCurrentLiturgicalSeason } from '../data/liturgical';
import { GOSPEL_COLLECTION, getDailyGospel } from '../data/gospels';

interface GospelViewProps {
  settings: AppSettings;
}

export const GospelView: React.FC<GospelViewProps> = ({ settings }) => {
  const isDark = settings.theme === 'candlelight' || settings.theme === 'stone';
  const dailyGospel = getDailyGospel();
  const initialIndex = GOSPEL_COLLECTION.findIndex(g => g.reference === dailyGospel.reference);
  const [offset, setOffset] = useState<number>(0);

  const currentIndex = (initialIndex + offset + GOSPEL_COLLECTION.length) % GOSPEL_COLLECTION.length;
  const currentGospel = GOSPEL_COLLECTION[currentIndex >= 0 ? currentIndex : 0];
  const seasonDetails = getCurrentLiturgicalSeason();

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      {/* View Header */}
      <div className="text-center space-y-3">
        <h1 className={`font-heading text-3xl sm:text-4xl font-semibold tracking-wide ${
          isDark ? 'text-[#f5ebd8]' : 'text-[#1c2536]'
        }`}>
          Daily Gospel Reading
        </h1>

        <p className={`text-sm font-sans flex items-center justify-center space-x-2 ${
          isDark ? 'text-[#C2B7A5]' : 'text-stone-600'
        }`}>
          <Calendar className="w-3.5 h-3.5" />
          <span>{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
          <span>•</span>
          <span>{seasonDetails.name}</span>
        </p>
      </div>

      {/* Scripture Container */}
      <div className={`p-8 sm:p-12 rounded-2xl border space-y-8 shadow-sm ${
        isDark
          ? 'bg-[#1b1916] border-[#332e27] text-[#ece4d6]'
          : 'bg-[#faf6ee] border-[#ebdcc8] text-[#2d2922]'
      }`}>
        {/* Reference header */}
        <div className="border-b pb-4 border-stone-300/30 space-y-2">
          <div className="flex justify-between items-center">
            <span className="font-heading text-xl font-bold text-[#c5a059]">
              {currentGospel.reference}
            </span>
            <span className="text-xs font-mono px-2.5 py-1 rounded border border-stone-400/30">
              Douay-Rheims Translation
            </span>
          </div>
          <h2 className={`font-heading text-2xl font-semibold tracking-wide ${
            isDark ? 'text-[#f5ebd8]' : 'text-[#1c2536]'
          }`}>
            {currentGospel.title}
          </h2>
        </div>

        {/* Reading Body */}
        <article className="font-scripture text-lg sm:text-xl leading-relaxed whitespace-pre-line space-y-4">
          {currentGospel.reading}
        </article>

        {/* Meditation Box */}
        <div className={`p-6 rounded-xl border ${
          isDark
            ? 'bg-[#24211c] border-[#3d3730] text-[#ded6c7]'
            : 'bg-[#eee4d2] border-[#dfcfb5] text-[#3b352c]'
        }`}>
          <div className="flex items-center space-x-2 text-xs font-mono uppercase tracking-wider text-[#c5a059] mb-2">
            <ChapelCross size={14} />
            <span>Humble Reflection</span>
          </div>
          <p className="font-sans text-sm sm:text-base leading-relaxed italic">
            {currentGospel.reflection}
          </p>
        </div>

        {/* Toggle alternate gospel reading */}
        <div className="pt-2 flex justify-end">
          <button
            onClick={() => setOffset(prev => prev + 1)}
            className={`inline-flex items-center space-x-2 text-xs font-medium hover:text-[#c5a059] transition-colors ${
              isDark ? 'text-[#C2B7A5]' : 'text-stone-600'
            }`}
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Read Next Gospel Selection</span>
          </button>
        </div>
      </div>
    </div>
  );
};
