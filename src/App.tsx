/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { AppSettings } from './types';
import { Navbar, ViewMode } from './components/Navbar';
import { Footer } from './components/Footer';
import { BlessingCard } from './components/BlessingCard';
import { GospelView } from './components/GospelView';
import { PrayersView } from './components/PrayersView';
import { RosaryView } from './components/RosaryView';
import { CandleRoom } from './components/CandleRoom';
import { LiturgicalCalendarView } from './components/LiturgicalCalendarView';
import { SaintsView } from './components/SaintsView';
import { DailyReflectionView } from './components/DailyReflectionView';
import { SilenceModeView } from './components/SilenceModeView';
import { AboutView } from './components/AboutView';
import { FullSanctuaryView } from './components/FullSanctuaryView';
import { TenCommandmentsView } from './components/TenCommandmentsView';

export default function App() {
  const [currentView, setCurrentView] = useState<ViewMode>('home');
  const [settings, setSettings] = useState<AppSettings>({
    theme: 'candlelight',
    fontSize: 'normal',
    reducedMotion: false,
    quietBell: false
  });

  // Scroll to top of window whenever the user switches views
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentView]);

  // Apply theme class to root body
  useEffect(() => {
    const isDark = settings.theme === 'candlelight' || settings.theme === 'stone';
    if (isDark) {
      document.body.classList.add('dark');
      document.body.style.backgroundColor = '#121110';
      document.body.style.color = '#F5EBD8';
    } else {
      document.body.classList.remove('dark');
      document.body.style.backgroundColor = '#FDFCF5';
      document.body.style.color = '#1A2A40';
    }
  }, [settings.theme]);

  // Apply font size modifier class
  useEffect(() => {
    if (settings.fontSize === 'large') {
      document.documentElement.style.fontSize = '18px';
    } else {
      document.documentElement.style.fontSize = '16px';
    }
  }, [settings.fontSize]);

  const renderContent = () => {
    switch (currentView) {
      case 'home':
        return <BlessingCard settings={settings} onNavigate={setCurrentView} />;
      case 'gospel':
        return <GospelView settings={settings} />;
      case 'prayers':
        return <PrayersView settings={settings} />;
      case 'rosary':
        return <RosaryView settings={settings} />;
      case 'candle':
        return <CandleRoom settings={settings} />;
      case 'commandments':
        return <TenCommandmentsView settings={settings} />;
      case 'calendar':
        return <LiturgicalCalendarView settings={settings} />;
      case 'saints':
        return <SaintsView settings={settings} />;
      case 'reflection':
        return <DailyReflectionView settings={settings} />;
      case 'about':
        return <AboutView settings={settings} />;
      case 'full-sanctuary':
        return <FullSanctuaryView settings={settings} onRetry={() => setCurrentView('home')} />;
      default:
        return <BlessingCard settings={settings} onNavigate={setCurrentView} />;
    }
  };

  const isDark = settings.theme === 'candlelight' || settings.theme === 'stone';

  return (
    <div className={`min-h-screen flex flex-col transition-colors duration-300 natural-tones-bg ${
      isDark ? 'bg-[#121110] text-[#f0e8db]' : 'bg-[#FDFCF5] text-[#1A2A40]'
    }`}>
      {/* Navbar (hidden in Silence Mode) */}
      {currentView !== 'silence' && (
        <Navbar
          currentView={currentView}
          onSelectView={setCurrentView}
          settings={settings}
          onUpdateSettings={setSettings}
        />
      )}

      {/* Main View Container */}
      <main className="flex-1 w-full pb-16">
        {currentView === 'silence' ? (
          <SilenceModeView settings={settings} onExit={() => setCurrentView('home')} />
        ) : (
          renderContent()
        )}
      </main>

      {/* Footer (hidden in Silence Mode) */}
      {currentView !== 'silence' && (
        <Footer settings={settings} />
      )}
    </div>
  );
}
