import React, { useState, useEffect } from 'react';
import { AppSettings } from '../types';
import { SCRIPTURE_COLLECTION } from '../data/scriptures';
import { ChapelCross } from './ChapelCross';
import { FlameVisual } from './FlameVisual';
import { X, RefreshCw } from 'lucide-react';
import { playChapelBell } from '../utils/audio';

interface SilenceModeViewProps {
  settings: AppSettings;
  onExit: () => void;
}

export const SilenceModeView: React.FC<SilenceModeViewProps> = ({ settings, onExit }) => {
  const [timeString, setTimeString] = useState<string>('');
  const [scriptureIndex, setScriptureIndex] = useState<number>(0);

  const currentScripture = SCRIPTURE_COLLECTION[scriptureIndex % SCRIPTURE_COLLECTION.length];

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeString(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    };
    updateTime();
    const timer = setInterval(updateTime, 10000);
    return () => clearInterval(timer);
  }, []);

  const handleCycleScripture = () => {
    if (settings.quietBell) playChapelBell(0.1);
    setScriptureIndex(prev => prev + 1);
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#0c0b0a] text-[#f2e7d5] flex flex-col justify-between p-6 sm:p-12 overflow-y-auto animate-fade-in select-none">
      {/* Top Bar: Exit Button & Ambient Clock */}
      <div className="flex justify-between items-center w-full max-w-4xl mx-auto border-b border-stone-800/60 pb-4">
        <div className="text-xs font-mono tracking-widest text-[#c5a059] flex items-center space-x-2">
          <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
          <span>Silence Chamber</span>
        </div>

        <div className="font-mono text-xs sm:text-sm text-stone-400 tracking-widest">
          {timeString}
        </div>

        <button
          onClick={onExit}
          className="flex items-center space-x-1 px-3 py-1.5 rounded-full border border-stone-800 hover:border-[#c5a059] text-xs font-mono text-stone-400 hover:text-stone-100 transition-colors"
          title="Exit Silence Mode"
        >
          <X className="w-4 h-4" />
          <span className="hidden sm:inline">Exit Silence</span>
        </button>
      </div>

      {/* Center Sanctuary Focal Point */}
      <div className="my-auto py-12 flex flex-col items-center text-center max-w-2xl mx-auto space-y-8">
        {/* Flame & Cross Focal */}
        <div className="flex flex-col items-center space-y-4">
          <FlameVisual size="xl" isLit={true} />
          <ChapelCross size={28} showGlow={true} className="text-[#c5a059]" />
        </div>

        {/* Quiet Scripture */}
        <div className="space-y-4 px-4">
          <blockquote className="font-scripture text-2xl sm:text-3xl md:text-4xl leading-relaxed italic font-light tracking-wide text-balance text-[#f5ebd8]">
            "{currentScripture.text}"
          </blockquote>

          <div className="text-xs font-mono text-[#c5a059] tracking-widest">
            - {currentScripture.reference} ({currentScripture.translation})
          </div>
        </div>

        {/* Quiet Short Prayer */}
        <div className="pt-6 border-t border-stone-800/60 max-w-md">
          <p className="font-scripture italic text-stone-400 text-sm sm:text-base leading-relaxed">
            "Lord Jesus Christ, Son of the Living God, have mercy on me, a sinner."
          </p>
        </div>

        {/* Cycle Scripture */}
        <button
          onClick={handleCycleScripture}
          className="inline-flex items-center space-x-2 px-4 py-2 rounded-full border border-stone-800 hover:border-[#c5a059] text-xs font-mono text-stone-400 hover:text-[#c5a059] transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Contemplate Another Scripture</span>
        </button>
      </div>

      {/* Bottom Footer */}
      <div className="text-center font-mono text-[11px] text-stone-600 tracking-widest max-w-md mx-auto border-t border-stone-800/40 pt-4">
        Be still, and know that I am God.
      </div>
    </div>
  );
};
