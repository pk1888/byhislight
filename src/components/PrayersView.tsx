import React, { useState } from 'react';
import { AppSettings, CatholicPrayer } from '../types';
import { CATHOLIC_PRAYERS } from '../data/prayers';
import { ChapelCross } from './ChapelCross';
import { Search, Globe, Info, Clock } from 'lucide-react';
import { playChapelBell } from '../utils/audio';

interface PrayersViewProps {
  settings: AppSettings;
}

export const PrayersView: React.FC<PrayersViewProps> = ({ settings }) => {
  const isDark = settings.theme === 'candlelight' || settings.theme === 'stone';
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showLatinMap, setShowLatinMap] = useState<Record<string, boolean>>({});
  const [expandedInfoMap, setExpandedInfoMap] = useState<Record<string, boolean>>({});

  const categories = [
    { id: 'all', label: 'All Prayers' },
    { id: 'core', label: 'Core Prayers' },
    { id: 'marian', label: 'Marian Prayers' },
    { id: 'morning_evening', label: 'Morning & Evening' },
    { id: 'protection', label: 'Protection' },
    { id: 'meals', label: 'Table Prayers' },
    { id: 'intention', label: 'Intentions' },
  ];

  const filteredPrayers = CATHOLIC_PRAYERS.filter(p => {
    const matchesCategory = selectedCategory === 'all' || p.category === selectedCategory;
    const matchesSearch = searchQuery === '' ||
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.latinTitle && p.latinTitle.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const toggleLatin = (id: string) => {
    if (settings.quietBell) playChapelBell(0.08);
    setShowLatinMap(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleInfo = (id: string) => {
    setExpandedInfoMap(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="text-center space-y-3">
        <h1 className={`font-heading text-3xl sm:text-4xl font-semibold tracking-wide ${
          isDark ? 'text-[#f5ebd8]' : 'text-[#1c2536]'
        }`}>
          Traditional Catholic Prayers
        </h1>

        <p className={`text-sm sm:text-base font-sans leading-relaxed ${
          isDark ? 'text-[#C2B7A5]' : 'text-stone-600'
        }`}>
          Ancient prayers handed down through generations of faithful saints and believers
        </p>
      </div>

      {/* Filter & Search Bar */}
      <div className="space-y-4">
        {/* Search input */}
        <div className="relative max-w-md mx-auto">
          <Search className={`w-4 h-4 absolute left-3.5 top-3.5 ${isDark ? 'text-[#C2B7A5]' : 'text-stone-500'}`} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search prayers by title or words..."
            className={`w-full pl-10 pr-4 py-2.5 text-sm rounded-full border transition-all focus:outline-none focus:ring-2 focus:ring-[#c5a059] ${
              isDark
                ? 'bg-[#1b1916] border-[#332e27] text-[#ece4d6] placeholder-stone-400'
                : 'bg-[#faf6ee] border-[#ebdcc8] text-[#2d2922] placeholder-stone-500'
            }`}
          />
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center justify-center flex-wrap gap-1.5">
          {categories.map(cat => {
            const isActive = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-[#c5a059] text-stone-950 font-semibold shadow-sm'
                    : isDark
                      ? 'bg-[#22201d] text-[#b0a798] hover:bg-[#2c2822]'
                      : 'bg-[#eee5d4] text-[#4d463d] hover:bg-[#e4d8c2]'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Prayers Grid */}
      <div className="space-y-6">
        {filteredPrayers.length === 0 ? (
          <div className="text-center py-12 text-stone-500 font-scripture italic">
            No prayers match your search.
          </div>
        ) : (
          filteredPrayers.map((prayer) => {
            const isLatin = Boolean(showLatinMap[prayer.id] && prayer.latinText);
            const showInfo = Boolean(expandedInfoMap[prayer.id]);

            return (
              <div
                key={prayer.id}
                className={`p-6 sm:p-8 rounded-2xl border transition-all shadow-sm ${
                  isDark
                    ? 'bg-[#1b1916] border-[#332e27] text-[#ece4d6]'
                    : 'bg-[#faf6ee] border-[#ebdcc8] text-[#2d2922]'
                }`}
              >
                {/* Card Title Row */}
                <div className="flex flex-wrap items-start justify-between gap-2 border-b pb-4 border-stone-300/30">
                  <div>
                    <h2 className="font-heading text-2xl sm:text-3xl font-bold tracking-wide">
                      {prayer.title}
                    </h2>
                    {prayer.latinTitle && (
                      <span className="text-base sm:text-lg font-scripture italic text-[#d4af37] font-medium block mt-1 tracking-wide">
                        {prayer.latinTitle}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center space-x-2">
                    {/* Info Toggle */}
                    <button
                      onClick={() => toggleInfo(prayer.id)}
                      title="When to pray & explanation"
                      className={`p-1.5 rounded-md border text-xs transition-colors ${
                        showInfo
                          ? 'border-[#c5a059] text-[#c5a059] bg-[#c5a059]/10'
                          : isDark
                            ? 'border-stone-400/30 text-[#C2B7A5] hover:text-[#f5ebd8]'
                            : 'border-stone-400/30 text-stone-600 hover:text-stone-900'
                      }`}
                    >
                      <Info className="w-4 h-4" />
                    </button>

                    {/* Latin Toggle */}
                    {prayer.latinText && (
                      <button
                        onClick={() => toggleLatin(prayer.id)}
                        className={`inline-flex items-center space-x-1 px-2.5 py-1 rounded-md text-xs font-mono border transition-colors ${
                          isLatin
                            ? 'border-[#c5a059] text-[#c5a059] bg-[#c5a059]/15'
                            : isDark
                              ? 'border-stone-400/30 text-[#C2B7A5] hover:text-[#f5ebd8]'
                              : 'border-stone-400/30 text-stone-600 hover:text-stone-900'
                        }`}
                      >
                        <Globe className="w-3.5 h-3.5" />
                        <span>{isLatin ? 'English' : 'Latin'}</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Optional Explanation Drawer */}
                {showInfo && (
                  <div className={`mt-4 p-4 rounded-xl text-xs space-y-2 border transition-all ${
                    isDark ? 'bg-[#24211c] border-[#38322a] text-[#ded6c7]' : 'bg-[#f2e7d5] border-[#dfcfb5] text-[#3d3730]'
                  }`}>
                    {prayer.traditionalTime && (
                      <div className="flex items-center space-x-1.5 font-mono text-[#c5a059]">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{prayer.traditionalTime}</span>
                      </div>
                    )}
                    <p className="font-sans leading-relaxed">
                      {prayer.explanation}
                    </p>
                  </div>
                )}

                {/* Prayer Text */}
                <div className="mt-6">
                  <p className="font-scripture text-lg sm:text-xl leading-relaxed whitespace-pre-line tracking-wide">
                    {isLatin ? prayer.latinText : prayer.text}
                  </p>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
