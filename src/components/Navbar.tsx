import React from 'react';
import { ChapelCross } from './ChapelCross';
import { AppSettings } from '../types';
import { Volume2, VolumeX, Flame } from 'lucide-react';
import { playChapelBell } from '../utils/audio';
import { getDailySaint } from '../data/saints';

export type ViewMode = 
  | 'home'
  | 'gospel'
  | 'prayers'
  | 'rosary'
  | 'candle'
  | 'commandments'
  | 'calendar'
  | 'saints'
  | 'reflection'
  | 'guestbook'
  | 'silence'
  | 'about'
  | 'full-sanctuary';

interface NavbarProps {
  currentView: ViewMode;
  onSelectView: (view: ViewMode) => void;
  settings: AppSettings;
  onUpdateSettings: (updater: (prev: AppSettings) => AppSettings) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onSelectView,
  settings,
  onUpdateSettings
}) => {
  const isDark = settings.theme === 'candlelight' || settings.theme === 'stone';

  const toggleTheme = () => {
    onUpdateSettings(prev => ({
      ...prev,
      theme: prev.theme === 'parchment' ? 'candlelight' : 'parchment'
    }));
    if (settings.quietBell) {
      playChapelBell(0.15);
    }
  };

  const toggleBell = () => {
    const nextBell = !settings.quietBell;
    onUpdateSettings(prev => ({ ...prev, quietBell: nextBell }));
    if (nextBell) {
      playChapelBell(0.2);
    }
  };

  const toggleFontSize = () => {
    onUpdateSettings(prev => ({
      ...prev,
      fontSize: prev.fontSize === 'normal' ? 'large' : 'normal'
    }));
  };

  const navItems: { id: ViewMode; label: string; icon?: React.ReactNode }[] = [
    { id: 'gospel', label: 'Gospel' },
    { id: 'prayers', label: 'Prayers' },
    { id: 'rosary', label: 'Holy Rosary' },
    { id: 'candle', label: 'Light a Candle' },
    { id: 'commandments', label: 'Commandments' },
    { id: 'calendar', label: 'Calendar' },
    { id: 'saints', label: 'Saints' },
    { id: 'reflection', label: 'Reflection' },
    { id: 'guestbook', label: "Visitors' Book" },
    { id: 'about', label: 'About' },
  ];

  return (
    <header className={`w-full border-b transition-colors duration-300 ${
      isDark 
        ? 'bg-[#161514]/90 border-[#2d2a26] text-[#e6ded1]' 
        : 'bg-[#FDFCF5]/95 border-[#EAE6D6] text-[#1A2A40]'
    } sticky top-0 z-40 backdrop-blur-md`}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4">
        {/* Top Context & Brand Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-3 pb-3 border-b border-[#332e27]">
          {/* Liturgical Season Context */}
          <button
            onClick={() => {
              onSelectView('calendar');
              if (settings.quietBell) playChapelBell(0.08);
            }}
            className="hidden sm:flex flex-col text-left font-sans hover:opacity-85 transition-opacity cursor-pointer group focus:outline-none"
            title="View Liturgical Calendar"
          >
            <span className="text-xs uppercase tracking-wider text-[#D4AF37] font-semibold">
              Liturgical Season
            </span>
            <span className="text-sm tracking-wide font-medium text-[#F5EBD8] group-hover:text-[#D4AF37] transition-colors">
              Ordinary Time <span className="text-xs opacity-75 font-normal">(Season of Growth)</span>
            </span>
          </button>

          {/* Logo / Brand Title */}
          <button
            onClick={() => onSelectView('home')}
            className="group flex items-center space-x-3 text-center focus:outline-none outline-none rounded-md px-2 py-1 transition-transform select-none"
          >
            <ChapelCross showGlow={true} className="w-7 h-7 text-[#D4AF37] transition-colors" />
            <div className="text-center">
              <span className="block font-heading text-2xl sm:text-3xl font-semibold tracking-wider text-[#F5EBD8]">
                By His Light
              </span>
              <span className="block text-xs font-sans tracking-wide text-[#C2B7A5] font-medium mt-0.5">
                A Quiet Chapel on the Internet
              </span>
            </div>
          </button>

          {/* Top Right Controls & Today's Saint Context */}
          <div className="flex items-center space-x-2">
            <button
              onClick={() => {
                onSelectView('saints');
                if (settings.quietBell) playChapelBell(0.08);
              }}
              className="hidden lg:flex flex-col text-right mr-3 hover:opacity-85 transition-opacity cursor-pointer group focus:outline-none"
              title="View Saint of the Day"
            >
              <span className="text-xs uppercase tracking-wider text-[#D4AF37] mb-0.5 font-semibold">
                Today's Saint
              </span>
              <span className="text-sm tracking-wide font-medium text-[#F5EBD8] group-hover:text-[#D4AF37] transition-colors">
                {getDailySaint().name}
              </span>
            </button>

            {/* Silence Mode Quick Button */}
            <button
              onClick={() => {
                if (settings.quietBell) playChapelBell(0.2);
                onSelectView('silence');
              }}
              title="Enter Silence Mode"
              className="flex items-center space-x-1.5 px-3 py-1.5 text-xs font-semibold rounded-full border transition-all border-[#D4AF37]/50 hover:border-[#D4AF37] bg-[#22201d] text-[#F5EBD8]"
            >
              <Flame className="w-4 h-4 text-[#D4AF37] animate-pulse" />
              <span>Silence Mode</span>
            </button>

            {/* Quiet Bell Toggle */}
            <button
              onClick={toggleBell}
              title={settings.quietBell ? "Chapel Sound Enabled (Click to Mute)" : "Chapel Sound Muted"}
              className={`p-2 rounded-full transition-colors border ${
                settings.quietBell
                  ? 'border-[#D4AF37] text-[#D4AF37] bg-[#22201d]'
                  : 'border-[#3a352f] text-[#A8A291] hover:text-[#F5EBD8] bg-[#1a1816]'
              }`}
              aria-label="Toggle chapel bell sound"
            >
              {settings.quietBell ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>

            {/* Text Size Toggle */}
            <button
              onClick={toggleFontSize}
              title={`Text Size: ${settings.fontSize} (Click to toggle)`}
              className={`px-3 py-1 rounded-full text-xs font-sans font-bold transition-colors border ${
                settings.fontSize === 'large'
                  ? 'border-[#D4AF37] text-[#D4AF37] bg-[#D4AF37]/20'
                  : 'border-[#3a352f] text-[#C2B7A5] hover:text-[#F5EBD8]'
              }`}
              aria-label="Toggle text size"
            >
              {settings.fontSize === 'large' ? 'A+' : 'A'}
            </button>
          </div>
        </div>

        {/* Navigation Bar Menu Items */}
        <nav className="mt-3 flex flex-wrap items-center justify-center gap-1 sm:gap-1.5 pt-1">
          {navItems.map((item) => {
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  onSelectView(item.id);
                  if (settings.quietBell && !isActive) {
                    playChapelBell(0.08);
                  }
                }}
                className={`px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all duration-200 flex items-center space-x-1.5 whitespace-nowrap ${
                  isActive
                    ? 'bg-[#D4AF37]/20 text-[#F5EBD8] font-semibold border border-[#D4AF37]/60 shadow-sm'
                    : 'text-[#D4CEBF] hover:text-[#FFFFFF] hover:bg-[#25221e]'
                }`}
              >
                {isActive && <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] inline-block" />}
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
