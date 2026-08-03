import React from 'react';
import { AppSettings, LiturgicalSeason } from '../types';
import { getCurrentLiturgicalSeason, LITURGICAL_SEASONS_DATA } from '../data/liturgical';
import { ChapelCross } from './ChapelCross';
import { BookOpen } from 'lucide-react';

interface LiturgicalCalendarViewProps {
  settings: AppSettings;
}

export const LiturgicalCalendarView: React.FC<LiturgicalCalendarViewProps> = ({ settings }) => {
  const isDark = settings.theme === 'candlelight' || settings.theme === 'stone';
  const currentDetails = getCurrentLiturgicalSeason();

  const allSeasons: LiturgicalSeason[] = [
    'Advent',
    'Christmas',
    'Lent',
    'HolyWeek',
    'Easter',
    'OrdinaryTime'
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-10">
      {/* Header */}
      <div className="text-center space-y-3">
        <h1 className={`font-heading text-3xl sm:text-4xl font-semibold tracking-wide ${
          isDark ? 'text-[#f5ebd8]' : 'text-[#1c2536]'
        }`}>
          Liturgical Calendar
        </h1>

        <p className={`text-sm sm:text-base font-sans leading-relaxed ${
          isDark ? 'text-[#C2B7A5]' : 'text-stone-600'
        }`}>
          The holy cycle of time sanctifying the days, months, and seasons in the life of Christ
        </p>
      </div>

      {/* Current Season Spotlight Card */}
      <div className={`p-8 sm:p-10 rounded-2xl border space-y-6 shadow-sm ${
        isDark ? 'bg-[#1b1916] border-[#38332b] text-[#f5ebd8]' : 'bg-[#faf6ee] border-[#ebdcc8] text-[#1c2536]'
      }`}>
        <div className="flex flex-wrap items-center justify-between gap-3 border-b pb-4 border-stone-400/20">
          <div>
            <span className="text-xs font-mono uppercase tracking-widest text-[#c5a059] block">
              Current Liturgical Season • {currentDetails.latinName}
            </span>
            <h2 className="font-heading text-3xl sm:text-4xl font-semibold mt-1">
              {currentDetails.name}
            </h2>
          </div>

          <div className="flex items-center space-x-2 text-xs font-mono px-3.5 py-1.5 rounded-full border border-stone-400/30 bg-stone-500/10">
            <span className="w-3 h-3 rounded-full inline-block shadow-sm" style={{ backgroundColor: currentDetails.colorInfo.hex }} />
            <span className="font-medium">Canonical Colour: {currentDetails.colorInfo.name}</span>
          </div>
        </div>

        {/* Season Description */}
        <p className="font-scripture text-lg sm:text-xl leading-relaxed text-[#d4cebf]">
          {currentDetails.description}
        </p>

        {/* Seasonal Scripture */}
        <div className={`p-5 sm:p-6 rounded-xl border space-y-2 ${
          isDark ? 'bg-[#22201d] border-[#38332b]' : 'bg-[#f4ebe0] border-[#e2d5c3]'
        }`}>
          <div className="text-xs font-mono uppercase tracking-wider text-[#c5a059] flex items-center space-x-1.5">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Seasonal Scripture • {currentDetails.scriptureRef}</span>
          </div>
          <blockquote className="font-scripture italic text-base sm:text-lg text-[#f5ebd8]">
            "{currentDetails.scriptureText}"
          </blockquote>
        </div>

        {/* Spiritual Focus */}
        <div className="text-xs sm:text-sm font-mono space-y-1 text-stone-300">
          <span className="block text-[#c5a059] uppercase tracking-wider font-semibold">Spiritual Focus:</span>
          <span>{currentDetails.spiritualFocus}</span>
        </div>
      </div>

      {/* Overview of All Seasons */}
      <div className="space-y-4">
        <h3 className={`text-xs font-mono tracking-widest uppercase border-b pb-2 border-stone-400/20 ${
          isDark ? 'text-[#C2B7A5]' : 'text-stone-600'
        }`}>
          The Six Sacred Liturgical Seasons
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {allSeasons.map((sKey) => {
            const sData = LITURGICAL_SEASONS_DATA[sKey];
            const isCurrent = sData.season === currentDetails.season;

            return (
              <div
                key={sKey}
                className={`p-6 rounded-2xl border flex flex-col justify-between space-y-3 transition-all ${
                  isCurrent
                    ? 'ring-2 ring-[#c5a059] border-[#c5a059]'
                    : isDark
                      ? 'bg-[#1b1916] border-[#332e27] text-[#ece4d6]'
                      : 'bg-[#faf6ee] border-[#ebdcc8] text-[#2d2922]'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono uppercase tracking-widest text-[#c5a059]">
                      {sData.colorInfo.name}
                    </span>
                    {isCurrent && (
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#c5a059] text-stone-950 font-bold">
                        ACTIVE
                      </span>
                    )}
                  </div>
                  <h4 className="font-heading text-xl font-bold mt-1">
                    {sData.name}
                  </h4>
                </div>

                <p className="font-sans text-xs opacity-80 leading-relaxed line-clamp-3">
                  {sData.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
