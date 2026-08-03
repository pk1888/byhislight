import React from 'react';
import { AppSettings } from '../types';
import { TEN_COMMANDMENTS } from '../data/commandments';
import { ChapelCross } from './ChapelCross';

interface TenCommandmentsViewProps {
  settings: AppSettings;
}

export const TenCommandmentsView: React.FC<TenCommandmentsViewProps> = ({ settings }) => {
  const isDark = settings.theme === 'candlelight' || settings.theme === 'stone';

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8 animate-fade-in">
      {/* View Header */}
      <div className="text-center space-y-3">
        <h1 className={`font-heading text-3xl sm:text-4xl font-semibold tracking-wide ${
          isDark ? 'text-[#f5ebd8]' : 'text-[#1c2536]'
        }`}>
          The Ten Commandments
        </h1>

        <p className={`text-sm font-sans font-medium flex items-center justify-center space-x-2 ${
          isDark ? 'text-[#C2B7A5]' : 'text-stone-600'
        }`}>
          <span>Exodus 20:2–17</span>
          <span>•</span>
          <span>Deuteronomy 5:6–21</span>
        </p>
      </div>

      {/* Main Card (Same styling, width, & coloring as Gospel View) */}
      <div className={`p-8 sm:p-12 rounded-2xl border space-y-8 shadow-sm ${
        isDark
          ? 'bg-[#1b1916] border-[#332e27] text-[#ece4d6]'
          : 'bg-[#faf6ee] border-[#ebdcc8] text-[#2d2922]'
      }`}>
        {/* Reference header */}
        <div className="border-b pb-4 border-stone-300/30 space-y-2">
          <div className="flex justify-between items-center">
            <span className="font-heading text-xl font-bold text-[#c5a059]">
              The Decalogue
            </span>
            <span className="text-xs font-mono px-2.5 py-1 rounded border border-stone-400/30">
              Douay-Rheims & Catholic Catechism
            </span>
          </div>
          <h2 className={`font-heading text-2xl font-semibold tracking-wide ${
            isDark ? 'text-[#f5ebd8]' : 'text-[#1c2536]'
          }`}>
            Sacred Commandments of the Lord
          </h2>
        </div>

        {/* List of Commandments */}
        <div className="divide-y divide-stone-500/20">
          {TEN_COMMANDMENTS.map((item) => (
            <div key={item.number} className="py-5 first:pt-0 last:pb-0 flex items-start space-x-4">
              <span className="font-mono text-lg font-bold text-[#c5a059] min-w-[2.2rem] pt-0.5">
                {item.roman}.
              </span>
              <div className="space-y-1">
                <p className={`font-serif text-lg sm:text-xl font-medium leading-relaxed ${
                  isDark ? 'text-[#f5ebd8]' : 'text-[#1c2536]'
                }`}>
                  {item.shortText}
                </p>
                <p className="text-xs font-mono text-[#c5a059]/80">
                  {item.scriptureRef}
                </p>
              </div>
            </div>
          ))}
        </div>

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
            "The law of the Lord is perfect, refreshing the soul; the decree of the Lord is trustworthy, giving wisdom to the simple." - Psalm 19:7
          </p>
        </div>
      </div>
    </div>
  );
};
