import React, { useState } from 'react';
import { AppSettings } from '../types';
import { ChapelCross } from './ChapelCross';
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
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
  const readingDate = new Date();
  readingDate.setDate(readingDate.getDate() + offset);
  const formattedReadingDate = readingDate.toLocaleDateString('en-GB', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      {/* View Header */}
      <div className="text-center space-y-3">
        <h1 className={`font-heading text-3xl sm:text-4xl font-semibold tracking-wide ${
          isDark ? 'text-[#f5ebd8]' : 'text-[#1c2536]'
        }`}>
          Today's Gospel
        </h1>

        <p className={`text-sm font-sans flex items-center justify-center space-x-2 ${
          isDark ? 'text-[#C2B7A5]' : 'text-stone-600'
        }`}>
          <Calendar className="w-3.5 h-3.5" />
          <span>{formattedReadingDate}</span>
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

        <div className={`p-6 rounded-xl border ${
          isDark
            ? 'bg-[#201c17] border-[#3d3730] text-[#ded6c7]'
            : 'bg-[#f5ecdf] border-[#dfcfb5] text-[#3b352c]'
        }`}>
          <div className="flex items-center space-x-2 text-xs font-mono uppercase tracking-wider text-[#c5a059] mb-3">
            <ChapelCross size={14} />
            <span>Prayer</span>
          </div>
          <div className="mx-auto max-w-2xl text-center font-scripture text-lg leading-relaxed sm:text-xl sm:leading-[1.9]">
            <p>Lord Jesus Christ,</p>
            <p className="mt-5">
              Help me to receive Your Word with humility,<br />
              to keep it in my heart,<br />
              and to live it with love today.
            </p>
            <p className="mt-5">Amen.</p>
          </div>
        </div>

        {/* Quiet day-based navigation */}
        <div className="pt-2 flex items-center justify-between gap-4 border-t border-stone-300/20">
          <button
            onClick={() => setOffset(prev => prev - 1)}
            className={`inline-flex items-center space-x-2 text-xs font-medium hover:text-[#c5a059] transition-colors ${
              isDark ? 'text-[#C2B7A5]' : 'text-stone-600'
            }`}
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            <span>Previous Day</span>
          </button>
          <button
            onClick={() => setOffset(prev => prev + 1)}
            className={`inline-flex items-center space-x-2 text-xs font-medium hover:text-[#c5a059] transition-colors ${
              isDark ? 'text-[#C2B7A5]' : 'text-stone-600'
            }`}
          >
            <span>{offset === 0 ? "Read Tomorrow's Gospel" : 'Next Day'}</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
