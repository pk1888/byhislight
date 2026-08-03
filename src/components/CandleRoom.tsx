import React, { useState, useEffect } from 'react';
import { AppSettings } from '../types';
import { FlameVisual } from './FlameVisual';
import { Flame, Sparkles, CheckCircle2, Dices, RefreshCw, ShieldAlert } from 'lucide-react';
import { playChapelBell } from '../utils/audio';
import { ALTAR_CANDLES, AltarCandleOption } from '../data/candles';
import { DevotionalCandleGraphic } from './DevotionalCandleGraphic';

export interface UserCandleLog {
  id: string;
  candleTypeId: string;
  litAt: number;
}

export interface CandleSlotDetail {
  id: number;
  isLit: boolean;
  intention?: string;
  candleTypeId?: string;
  remainingSeconds: number;
}

const CANDLE_DURATION_MS = 15 * 60 * 1000; // 15 Minutes physical altar flame duration

const ROMAN_NUMERALS: Record<number, string> = { 1: 'I', 2: 'II', 3: 'III', 4: 'IV', 5: 'V' };

interface CandleRoomProps {
  settings: AppSettings;
}

export const CandleRoom: React.FC<CandleRoomProps> = ({ settings }) => {
  const isDark = settings.theme === 'candlelight' || settings.theme === 'stone';
  const [totalCandles, setTotalCandles] = useState<number>(1428);
  const [previewIndex, setPreviewIndex] = useState<number>(0);
  const [intention, setIntention] = useState<string>('');
  const [hasLitInSession, setHasLitInSession] = useState<boolean>(false);
  const [lastLitCandle, setLastLitCandle] = useState<AltarCandleOption>(ALTAR_CANDLES[0]);
  const [isShuffling, setIsShuffling] = useState<boolean>(false);
  const [nowTs, setNowTs] = useState<number>(Date.now());
  const [scotlandHour, setScotlandHour] = useState<number>(() => {
    try {
      const hrStr = new Intl.DateTimeFormat('en-GB', {
        timeZone: 'Europe/London',
        hour: 'numeric',
        hour12: false
      }).format(new Date());
      return parseInt(hrStr, 10);
    } catch {
      return 12;
    }
  });

  // 5 Altar Lights & Queue State
  const [queueLength, setQueueLength] = useState<number>(0);
  const [activeCandlesMap, setActiveCandlesMap] = useState<Record<string, boolean>>({
    '1': false,
    '2': false,
    '3': false,
    '4': false,
    '5': false
  });
  const [slotsDetail, setSlotsDetail] = useState<CandleSlotDetail[]>([
    { id: 1, isLit: false, remainingSeconds: 0 },
    { id: 2, isLit: false, remainingSeconds: 0 },
    { id: 3, isLit: false, remainingSeconds: 0 },
    { id: 4, isLit: false, remainingSeconds: 0 },
    { id: 5, isLit: false, remainingSeconds: 0 }
  ]);
  const [lastOfferMessage, setLastOfferMessage] = useState<string | null>(null);

  const [userCandleLogs, setUserCandleLogs] = useState<UserCandleLog[]>(() => {
    try {
      const saved = localStorage.getItem('byhislight_user_candle_logs');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {}
    return [];
  });

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [selectedCandleId, setSelectedCandleId] = useState<string | null>(null);

  const previewCandle = ALTAR_CANDLES[previewIndex % ALTAR_CANDLES.length];
  const displayedCandle = selectedCandleId
    ? (ALTAR_CANDLES.find(c => c.id === selectedCandleId) || previewCandle)
    : previewCandle;

  // Active candles in 15-minute physical window
  const activeUserCandles = userCandleLogs.filter(c => nowTs - c.litAt < CANDLE_DURATION_MS);
  const activeUserCount = activeUserCandles.length;
  const candlesLitInPastHour = userCandleLogs.filter(c => nowTs - c.litAt < 60 * 60 * 1000).length;
  const hasPastCandles = userCandleLogs.length > 0;

  // Interval timer to update local hour
  useEffect(() => {
    const update = () => {
      setNowTs(Date.now());
      try {
        const hrStr = new Intl.DateTimeFormat('en-GB', {
          timeZone: 'Europe/London',
          hour: 'numeric',
          hour12: false
        }).format(new Date());
        setScotlandHour(parseInt(hrStr, 10));
      } catch {}
    };

    update();
    const timer = setInterval(update, 5000);
    return () => clearInterval(timer);
  }, []);

  // Poll status endpoint every 1.5 seconds for holy 5-votive altar state
  useEffect(() => {
    const pollStatus = async () => {
      try {
        const res = await fetch('/api/status');
        if (!res.ok) return;
        const data = await res.json();

        setQueueLength(data.queue_length || 0);
        const qTextEl = document.getElementById('queueText');
        if (qTextEl) {
          qTextEl.innerText = `Prayers in Waiting: ${data.queue_length || 0}`;
        }

        if (data.totalCandlesLit) {
          setTotalCandles(data.totalCandlesLit);
        }

        if (data.slots) {
          setSlotsDetail(data.slots);
        }

        if (data.active_candles) {
          setActiveCandlesMap(data.active_candles);

          for (const [candleId, isLit] of Object.entries(data.active_candles)) {
            const candleElement = document.getElementById(`candle-display-${candleId}`);
            if (candleElement) {
              const num = parseInt(candleId, 10);
              const roman = ROMAN_NUMERALS[num] || candleId;
              if (isLit) {
                candleElement.classList.add('lit');
                candleElement.innerText = `🕯️ Votive ${roman} Burning`;
              } else {
                candleElement.classList.remove('lit');
                candleElement.innerText = `🕯️ Votive ${roman} Awaiting`;
              }
            }
          }
        }
      } catch (err) {
        console.debug('Error polling /api/status:', err);
      }
    };

    pollStatus();
    const interval = setInterval(pollStatus, 1500);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('byhislight_user_candle_logs', JSON.stringify(userCandleLogs));
    } catch {}
  }, [userCandleLogs]);

  // Shuffle preview manually & reset manual selection
  const handleShufflePreview = () => {
    setSelectedCandleId(null);
    setIsShuffling(true);
    let count = 0;
    const interval = setInterval(() => {
      setPreviewIndex(prev => (prev + 1) % ALTAR_CANDLES.length);
      count++;
      if (count > 6) {
        clearInterval(interval);
        setIsShuffling(false);
      }
    }, 100);
  };

  const handleLightCandle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    setErrorMessage(null);

    // Use manually selected candle if user clicked one, otherwise pick a random candle from the pool
    let chosenCandle: AltarCandleOption;
    if (selectedCandleId) {
      chosenCandle = ALTAR_CANDLES.find(c => c.id === selectedCandleId) || ALTAR_CANDLES[0];
    } else {
      const randomIndex = Math.floor(Math.random() * ALTAR_CANDLES.length);
      chosenCandle = ALTAR_CANDLES[randomIndex];
    }

    try {
      const res = await fetch('/api/candles/light', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          intention: intention.trim(),
          candleTypeId: chosenCandle.id
        })
      });

      const data = await res.json();
      if (!res.ok) {
        setErrorMessage(data.error || 'Failed to light candle.');
        setIsSubmitting(false);
        return;
      }

      setTotalCandles(data.totalCandlesLit);
      setLastLitCandle(chosenCandle);
      setLastOfferMessage(data.altarPulseMessage);
      setHasLitInSession(true);

      const newRecord: UserCandleLog = {
        id: 'c_' + Date.now(),
        candleTypeId: chosenCandle.id,
        litAt: Date.now()
      };
      setUserCandleLogs(prev => [newRecord, ...prev]);
      setIntention('');
      if (settings.quietBell) {
        playChapelBell(0.3);
      }
    } catch (err) {
      setErrorMessage('Could not connect to chapel server.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-10">
      {/* View Header */}
      <div className="text-center space-y-3">
        <h1 className={`font-heading text-3xl sm:text-4xl font-semibold tracking-wide ${
          isDark ? 'text-[#f5ebd8]' : 'text-[#1c2536]'
        }`}>
          Light a Candle
        </h1>

        <p className={`text-sm sm:text-base font-sans max-w-xl mx-auto leading-relaxed ${
          isDark ? 'text-[#C2B7A5]' : 'text-stone-600'
        }`}>
          Lighting a candle here sends a real-time signal to light physical votive candles on my home altar in Scotland
        </p>
      </div>

      {/* Main Candle Lighting Card */}
      <div className={`p-8 sm:p-12 rounded-3xl border text-center space-y-8 shadow-sm ${
        isDark
          ? 'bg-[#1b1916] border-[#332e27] text-[#ece4d6]'
          : 'bg-[#faf6ee] border-[#ebdcc8] text-[#2d2922]'
      }`}>
        {/* Interactive Candle Centerpiece */}
        <div className="flex flex-col items-center justify-center space-y-4">
          <FlameVisual size="xl" isLit={true} />
          <div className="text-sm sm:text-base font-mono font-semibold tracking-widest text-[#c5a059] uppercase">
            {totalCandles.toLocaleString()} Candles Offered in Sanctuary
          </div>
        </div>

        {hasLitInSession ? (
          <div className={`p-8 sm:p-10 rounded-2xl border text-center space-y-6 animate-fade-in ${
            isDark ? 'bg-[#22201d] border-[#38332b]' : 'bg-[#f4ebe0] border-[#e2d5c3]'
          }`}>
            <CheckCircle2 className="w-12 h-12 mx-auto text-amber-500" />
            <h3 className="font-heading text-2xl sm:text-3xl font-bold text-[#f5ebd8]">
              Your {lastLitCandle.name} Candle Has Been Offered.
            </h3>
            
            {/* Show Selected Devotional Candle Graphic in Success View */}
            <div className="py-2 flex justify-center">
              <DevotionalCandleGraphic candle={lastLitCandle} isSelected={true} size="lg" />
            </div>

            <div className="p-5 sm:p-6 rounded-xl border border-amber-500/30 bg-amber-500/10 text-amber-200 dark:text-amber-100 text-sm sm:text-base font-sans space-y-3 max-w-2xl mx-auto text-left sm:text-center">
              <div className="font-semibold flex items-center justify-center space-x-2 text-[#c5a059]">
                <Sparkles className="w-5 h-5 text-amber-400" />
                <span className="text-base">🟢 Connected to my prayer altar in Scotland ({lastLitCandle.altarChannel})</span>
              </div>
              <p className="text-sm sm:text-base text-stone-300 leading-relaxed">
                The Raspberry Pi on my home altar in Inverclyde, Scotland has received your request. The physical <strong>{lastLitCandle.name}</strong> votive candle on my altar has lit up in prayer with yours for 15 minutes.
              </p>
              <p className="text-xs sm:text-sm font-serif italic text-amber-300/90 pt-2 border-t border-amber-500/20">
                {scotlandHour >= 23 || scotlandHour < 6
                  ? `🌙 A flame is now burning on the ${lastLitCandle.name} candle to protect my family and me while we sleep.`
                  : scotlandHour < 12
                  ? `🌅 A flame is now burning on the ${lastLitCandle.name} candle to bless and protect my family and me today.`
                  : `🕯️ A flame is now burning on the ${lastLitCandle.name} candle to protect, guide, and bless my family and me.`}
              </p>
            </div>

            <p className="font-scripture italic text-lg sm:text-xl text-stone-300 max-w-xl mx-auto">
              "{lastLitCandle.scriptureVerse}"
            </p>

            <button
              onClick={() => setHasLitInSession(false)}
              className="text-sm font-mono text-[#c5a059] hover:text-amber-400 pt-2 underline block mx-auto font-medium"
            >
              Offer another candle
            </button>
          </div>
        ) : (
          <form onSubmit={handleLightCandle} className="max-w-3xl mx-auto space-y-8">
            {/* Devotional Candle Selection Showcase */}
            <div className={`p-6 sm:p-8 rounded-3xl border text-center space-y-6 relative overflow-hidden ${
              isDark 
                ? 'bg-gradient-to-b from-[#25201a] via-[#1d1915] to-[#171411] border-[#3e352b]' 
                : 'bg-gradient-to-b from-[#f9f3e6] via-[#f3e8d4] to-[#ebdcc4] border-[#dfceb5]'
            }`}>
              <div className="space-y-2 max-w-xl mx-auto">
                <h3 className={`font-heading text-2xl sm:text-3xl font-bold ${isDark ? 'text-[#f5ebd8]' : 'text-stone-900'}`}>
                  {selectedCandleId ? `Selected: ${displayedCandle.name}` : `A Devotional Candle Will Be Randomly Chosen`}
                </h3>
                <p className={`text-xs sm:text-sm leading-relaxed ${isDark ? 'text-stone-200' : 'text-stone-800'}`}>
                  {selectedCandleId
                    ? `Your prayer intent will be offered specifically with the ${displayedCandle.name} votive candle on my home altar, or choose another devotion below.`
                    : `When you offer a candle, one of our sacred devotional candles will be randomly selected for your prayer intent, or select a specific devotion below.`}
                </p>
              </div>

              {/* Shimmering Preview Candle Showcase */}
              <div className="py-4 px-6 rounded-2xl border border-amber-500/30 bg-black/20 max-w-md mx-auto flex flex-col items-center space-y-4 relative">
                <button
                  type="button"
                  onClick={handleShufflePreview}
                  disabled={isShuffling}
                  className="absolute top-3 right-3 p-2 rounded-full bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 transition-all text-xs font-mono flex items-center space-x-1 cursor-pointer"
                  title="Shuffle preview / reset to random"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isShuffling ? 'animate-spin' : ''}`} />
                  <span className="hidden sm:inline">Shuffle</span>
                </button>

                <DevotionalCandleGraphic candle={displayedCandle} isSelected={true} size="md" />

                <div className="space-y-1 text-center">
                  <div className="text-xs font-mono text-amber-500 uppercase tracking-widest font-bold">
                    {selectedCandleId ? 'Selected Devotion' : 'Preview Rotation'}
                  </div>
                  <div className={`font-heading text-xl font-bold ${isDark ? 'text-[#f5ebd8]' : 'text-stone-900'}`}>
                    {displayedCandle.name}
                  </div>
                  <div className={`text-xs font-serif italic ${isDark ? 'text-amber-300' : 'text-amber-900 font-semibold'}`}>
                    {displayedCandle.latinTitle}
                  </div>
                  <div className={`text-xs font-sans pt-1 ${isDark ? 'text-stone-200' : 'text-stone-800'}`}>
                    {displayedCandle.devotionFocus}
                  </div>
                </div>
              </div>

              {/* Devotional Candle Selection List */}
              <div className="pt-2 border-t border-amber-900/20 space-y-3">
                <div className="flex items-center justify-between text-[11px] font-mono uppercase tracking-wider px-1">
                  <span className={isDark ? 'text-stone-200 font-semibold' : 'text-stone-800 font-semibold'}>
                    Select a Devotion (or keep default Random):
                  </span>
                  {selectedCandleId && (
                    <button
                      type="button"
                      onClick={handleShufflePreview}
                      className="text-amber-400 hover:text-amber-300 font-semibold flex items-center space-x-1 cursor-pointer normal-case text-xs"
                    >
                      <RefreshCw className="w-3 h-3" />
                      <span>Reset to Random</span>
                    </button>
                  )}
                </div>

                <div className="flex flex-wrap justify-center gap-2">
                  {/* Default Random Shuffle Button */}
                  <button
                    type="button"
                    onClick={handleShufflePreview}
                    className={`text-xs font-sans px-3.5 py-1.5 rounded-full border transition-all cursor-pointer flex items-center space-x-1.5 ${
                      selectedCandleId === null
                        ? 'bg-amber-500/30 border-amber-400 text-amber-200 font-bold shadow-xs ring-1 ring-amber-400/50'
                        : isDark
                        ? 'bg-stone-900/80 border-stone-700 text-stone-200 hover:border-amber-500/50 hover:text-amber-200'
                        : 'bg-white border-stone-300 text-stone-800 hover:border-amber-500/50 hover:text-amber-800'
                    }`}
                  >
                    <Dices className="w-3.5 h-3.5 text-amber-400" />
                    <span>Random Selection (Default)</span>
                  </button>

                  {ALTAR_CANDLES.map((c) => {
                    const isSelected = selectedCandleId === c.id;
                    return (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => setSelectedCandleId(c.id)}
                        className={`text-xs font-sans px-3.5 py-1.5 rounded-full border transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-amber-500/35 border-amber-400 text-amber-100 font-bold shadow-xs ring-1 ring-amber-400'
                            : isDark
                            ? 'bg-stone-900/80 border-stone-700 text-stone-200 hover:border-amber-500/50 hover:text-amber-200'
                            : 'bg-white border-stone-300 text-stone-800 hover:border-amber-500/50 hover:text-amber-800 font-medium'
                        }`}
                      >
                        {c.name}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Dynamic Time-aware Altar Protection Note */}
            <div className={`p-5 sm:p-6 rounded-xl border text-sm sm:text-base font-sans text-left space-y-2 ${
              isDark 
                ? 'bg-[#24211c] border-[#4d4438] text-[#f2ebd9]' 
                : 'bg-[#f4ebe0] border-[#d4c5b0] text-stone-900'
            }`}>
              <div className="font-semibold text-amber-500 flex items-center space-x-2 text-sm sm:text-base">
                <span className="font-bold">
                  {selectedCandleId
                    ? `🕯️ ${displayedCandle.name} Candle`
                    : scotlandHour >= 23 || scotlandHour < 6
                    ? '🌙 Nighttime Protection'
                    : scotlandHour < 12
                    ? '🌅 Morning Blessing'
                    : '🕯️ Sanctuary Altar Candle'}
                </span>
                <span className="opacity-40">•</span>
                <span className={`font-mono text-xs font-semibold ${isDark ? 'text-amber-300' : 'text-amber-900'}`}>Inverclyde Altar</span>
              </div>
              <p className={`leading-relaxed text-xs sm:text-sm font-medium ${isDark ? 'text-stone-200' : 'text-stone-900'}`}>
                {scotlandHour >= 23 || scotlandHour < 6
                  ? `It is nighttime in Scotland. Offering ${selectedCandleId ? `the ${displayedCandle.name}` : 'a random'} candle now will light up a flame on my altar to protect my family and me during sleep.`
                  : scotlandHour < 12
                  ? `It is morning in Scotland. Offering ${selectedCandleId ? `the ${displayedCandle.name}` : 'a random'} candle now will light up a flame on my altar to protect and bless my family and me throughout the day.`
                  : `Offering ${selectedCandleId ? `the ${displayedCandle.name}` : 'a random'} candle now will light up a flame on my altar to protect, guide, and bless my family and me.`}
              </p>
            </div>

            <div>
              <label htmlFor="candle-intention" className={`block text-sm sm:text-base font-mono mb-2 font-semibold text-left ${
                isDark ? 'text-stone-200' : 'text-stone-900'
              }`}>
                Silent Intention or Prayer (Optional)
              </label>
              <textarea
                id="candle-intention"
                rows={3}
                value={intention}
                onChange={(e) => setIntention(e.target.value)}
                placeholder="Offer a silent prayer or name..."
                maxLength={300}
                className={`w-full p-4 text-base rounded-xl border transition-all focus:outline-none focus:ring-2 focus:ring-[#c5a059] ${
                  isDark
                    ? 'bg-[#24211c] border-[#3a342c] text-[#ece4d6] placeholder-stone-400'
                    : 'bg-white border-[#ded1be] text-stone-900 placeholder-stone-500'
                }`}
              />
            </div>

            {errorMessage && (
              <div className="p-4 rounded-xl border border-rose-500/40 bg-rose-500/15 text-rose-300 text-xs sm:text-sm font-sans flex items-start space-x-2.5">
                <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <span className="text-left font-medium">{errorMessage}</span>
              </div>
            )}

            {/* Anti-Spam Rate Limit Notice */}
            <div className={`p-4 rounded-xl border text-xs sm:text-sm font-sans flex items-start space-x-3 ${
              isDark 
                ? 'bg-[#1e1b17] border-[#42392b] text-[#f5ebd8]' 
                : 'bg-[#f4ebe0] border-[#d8c7b0] text-stone-900'
            }`}>
              <ShieldAlert className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
              <div className="space-y-1 text-left">
                <span className="font-bold block text-amber-500">Sanctuary Anti-Spam Notice</span>
                <p className={`leading-relaxed text-xs font-medium ${isDark ? 'text-stone-200' : 'text-stone-900'}`}>
                  Sadly, to protect our sanctuary altar from automated bots or spam, candle offerings are limited to <strong>3 candles per hour</strong> per visitor.
                  {candlesLitInPastHour > 0 && (
                    <span className="ml-1 font-mono text-[11px] block sm:inline text-amber-500 font-bold">
                      (Offered in past hour: {candlesLitInPastHour}/3)
                    </span>
                  )}
                </p>
              </div>
            </div>

            <div className="flex justify-center pt-2">
              <button
                type="submit"
                disabled={isSubmitting || candlesLitInPastHour >= 3}
                className={`w-full sm:w-auto min-w-[260px] max-w-md py-3 px-6 sm:px-8 rounded-xl font-bold text-base sm:text-lg transition-all shadow-md flex items-center justify-center space-x-2.5 ${
                  candlesLitInPastHour >= 3
                    ? 'bg-stone-700 text-stone-400 cursor-not-allowed opacity-60'
                    : 'bg-gradient-to-r from-amber-600 to-[#c5a059] text-stone-950 hover:brightness-110 cursor-pointer shadow-amber-900/20'
                }`}
              >
                {selectedCandleId ? (
                  <Flame className="w-5 h-5 text-amber-950 fill-amber-950 shrink-0" />
                ) : (
                  <Dices className="w-5 h-5 text-amber-950 shrink-0" />
                )}
                <span className="truncate">
                  {isSubmitting
                    ? `Offering Candle...`
                    : candlesLitInPastHour >= 3
                    ? `Limit Reached (3 per Hour)`
                    : selectedCandleId
                    ? `Offer ${displayedCandle.name} Candle`
                    : `Offer a Random Devotional Candle`}
                </span>
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Virtual Sanctuary Candles Visual (30 Digital Flames) */}
      <div className={`p-6 sm:p-8 rounded-3xl border space-y-5 ${
        isDark ? 'bg-[#181613] border-[#2d2822]' : 'bg-[#faf6ee] border-[#e6d9c5]'
      }`}>
        <div className="flex flex-wrap items-center justify-between gap-3 border-b pb-4 border-amber-500/20">
          <div className="space-y-1 text-left">
            <div className="flex items-center space-x-2 text-amber-500 font-bold text-base sm:text-lg">
              <Sparkles className="w-5 h-5 text-amber-500" />
              <h3 className={`font-heading font-bold ${isDark ? 'text-[#f5ebd8]' : 'text-stone-900'}`}>
                30 Virtual Sanctuary Candles (15-Minute Digital Flames)
              </h3>
            </div>
            <p className={`text-xs sm:text-sm font-sans leading-relaxed ${isDark ? 'text-stone-200' : 'text-stone-800'}`}>
              These are the <strong>Virtual Sanctuary Candles</strong> in our online chapel. Each candle offered burns here for 15 minutes. If all 30 digital flames are occupied, incoming prayer intentions enter our digital waiting queue.
            </p>
          </div>

          {activeUserCount > 0 ? (
            <span className="text-xs font-sans text-amber-500 font-semibold px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30">
              🕯️ {activeUserCount === 1 ? 'Your virtual candle is burning in the chapel' : `${activeUserCount} of your virtual candles are burning`}
            </span>
          ) : hasPastCandles ? (
            <span className="text-xs font-serif italic text-amber-300 font-medium">
              Your virtual candle completed its 15-minute prayer
            </span>
          ) : null}
        </div>

        {/* Quiet rows of flickering flames */}
        <div className={`p-6 sm:p-8 rounded-2xl border grid grid-cols-5 sm:grid-cols-10 gap-4 sm:gap-6 justify-items-center items-end ${
          isDark ? 'bg-[#141311] border-[#26231f]' : 'bg-[#f0e8db] border-[#ded4c3]'
        }`}>
          {Array.from({ length: 30 }).map((_, i) => {
            const isUserCandle = i < activeUserCount;
            return (
              <div
                key={i}
                className={`flex flex-col items-center transition-all duration-500 relative ${
                  isUserCandle
                    ? 'p-2.5 rounded-xl border-2 border-[#d4af37] bg-[#d4af37]/15 shadow-lg shadow-amber-500/25 ring-2 ring-amber-400/40 animate-pulse'
                    : 'opacity-80 hover:opacity-100 p-1'
                }`}
              >
                {isUserCandle && (
                  <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 whitespace-nowrap px-1.5 py-0.5 text-[9px] font-mono font-bold tracking-wider text-stone-950 bg-[#d4af37] rounded-full shadow-md">
                    Yours
                  </span>
                )}
                <FlameVisual size={isUserCandle ? "md" : "sm"} isLit={true} />
                <div className={`w-2.5 h-6 rounded-t-sm shadow-inner ${
                  isUserCandle ? 'bg-amber-300 dark:bg-amber-500' : 'bg-amber-100/70 dark:bg-amber-900/40'
                }`} />
              </div>
            );
          })}
        </div>
      </div>

      {/* Real-time Physical Altar 5-Candle Light System */}
      <div className={`p-6 sm:p-8 rounded-3xl border space-y-6 ${
        isDark ? 'bg-[#181613] border-[#2d2822] text-[#f5ebd8]' : 'bg-[#faf6ee] border-[#e6d9c5] text-stone-800'
      }`}>
        <div className="flex flex-wrap items-center justify-between gap-4 border-b pb-4 border-amber-500/20">
          <div className="space-y-1 text-left">
            <div className="flex items-center space-x-2 text-amber-500 font-bold tracking-wide text-sm sm:text-base">
              <Flame className="w-5 h-5 text-amber-500 animate-pulse" />
              <span className={`font-heading font-bold ${isDark ? 'text-[#f5ebd8]' : 'text-stone-900'}`}>
                5 Physical Altar Votives (Inverclyde Altar, Scotland)
              </span>
            </div>
            <p className={`text-xs sm:text-sm font-sans leading-relaxed ${isDark ? 'text-stone-200' : 'text-stone-700'}`}>
              In addition to your Virtual Sanctuary Candle, each offering triggers a physical relay to burn one of 5 votive candles on my home altar in Inverclyde, Scotland for 15 minutes.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm">
            {/* id="queueText" required element - styled strictly as un-pill text */}
            <span
              id="queueText"
              className={`font-serif italic font-semibold ${isDark ? 'text-amber-200' : 'text-amber-900'}`}
            >
              Prayers in Waiting: {queueLength}
            </span>

            <span className={`font-serif font-medium flex items-center space-x-2 ${isDark ? 'text-amber-300' : 'text-amber-800'}`}>
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shadow-xs shadow-emerald-400/50"></span>
              <span>Sanctuary Altar Connected</span>
            </span>
          </div>
        </div>

        {/* 5 Candle Votive Displays Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-5 gap-4">
          {[1, 2, 3, 4, 5].map(num => {
            const slot = slotsDetail.find(s => s.id === num);
            const isLit = activeCandlesMap[String(num)] || (slot && slot.isLit);
            const remainingSec = slot?.remainingSeconds || 0;
            const mins = Math.floor(remainingSec / 60);
            const secs = remainingSec % 60;
            const roman = ROMAN_NUMERALS[num] || String(num);

            return (
              <div
                key={num}
                className={`p-4 rounded-3xl border text-center flex flex-col items-center justify-between space-y-3 transition-all duration-700 relative overflow-hidden ${
                  isLit
                    ? 'bg-gradient-to-b from-[#2A1D0E] via-[#20150A] to-[#140C05] border-amber-500/70 shadow-2xl shadow-amber-950/80 ring-1 ring-amber-400/50 glow-candle'
                    : isDark
                    ? 'bg-[#1D1915] border-[#352D24] text-stone-500'
                    : 'bg-[#F5EDE0] border-[#E3D4C0] text-stone-600'
                }`}
              >
                {/* Background Ambient Candle Warmth Radial Glow */}
                {isLit && (
                  <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-48 h-48 bg-amber-500/20 rounded-full blur-2xl pointer-events-none animate-pulse" />
                )}

                {/* Top Votive Header */}
                <div className="flex items-center justify-between w-full px-1 z-10">
                  <span className={`text-xs font-serif font-bold ${isDark ? 'text-amber-300' : 'text-amber-900'}`}>
                    Votive {roman}
                  </span>
                  <span className={`text-[11px] font-serif italic ${
                    isLit
                      ? isDark ? 'text-amber-200 font-semibold' : 'text-amber-900 font-semibold'
                      : isDark ? 'text-stone-300' : 'text-stone-600'
                  }`}>
                    {isLit ? 'Lit in Prayer' : 'Awaiting Intention'}
                  </span>
                </div>

                {/* 3D Realistic Votive Pillar Candle Assembly */}
                <div className="relative flex flex-col items-center my-2 select-none z-10">
                  {/* Dancing Flame with Ambient Halo */}
                  <div className="relative -mb-3 z-30 flex flex-col items-center">
                    <FlameVisual size="lg" isLit={Boolean(isLit)} />
                  </div>

                  {/* Melted Wax Top Concave Pool */}
                  <div className={`w-16 h-3 rounded-t-full border-t relative z-20 flex items-center justify-center ${
                    isLit
                      ? 'bg-gradient-to-r from-[#FDE68A] via-[#FEF3C7] to-[#F59E0B] border-amber-300/60 shadow-[inset_0_1px_4px_rgba(217,119,6,0.6)]'
                      : 'bg-gradient-to-r from-[#D6C7B2] via-[#E8DCCB] to-[#C4B39C] border-stone-400/40'
                  }`}>
                    <div className={`w-3 h-1 rounded-full blur-[0.5px] ${isLit ? 'bg-amber-900/30' : 'bg-stone-700/40'}`} />
                  </div>

                  {/* 3D Wax Pillar Body */}
                  <div className={`relative w-16 h-28 rounded-b-sm border overflow-hidden flex flex-col items-center justify-between p-1 transition-all duration-500 shadow-xl ${
                    isLit
                      ? 'bg-gradient-to-r from-[#D49931] via-[#FDE047] to-[#B87A1B] border-amber-400/80 shadow-[0_0_25px_rgba(245,158,11,0.45)]'
                      : 'bg-gradient-to-r from-[#B0A290] via-[#D8CBBB] to-[#9C8E7C] border-stone-500/30'
                  }`}>
                    {/* Translucent Highlight & Depth Shading */}
                    <div className="absolute top-0 bottom-0 left-2 w-3 bg-gradient-to-r from-transparent via-white/40 to-transparent pointer-events-none" />
                    <div className="absolute top-0 bottom-0 right-0 w-3 bg-black/20 pointer-events-none" />

                    {/* Wax Drip Textures */}
                    <div className={`absolute top-0 left-1 w-1.5 h-7 rounded-b-full pointer-events-none ${isLit ? 'bg-amber-100/60' : 'bg-white/40'}`} />
                    <div className={`absolute top-0 right-2 w-1 h-4 rounded-b-full pointer-events-none ${isLit ? 'bg-amber-200/50' : 'bg-white/30'}`} />
                    <div className={`absolute top-2 left-4 w-1 h-9 rounded-b-full pointer-events-none ${isLit ? 'bg-amber-100/50' : 'bg-white/30'}`} />

                    {/* Sacred Cross Motif embossed on Wax */}
                    <div className="flex-1 flex items-center justify-center opacity-75">
                      <div className={`w-0.5 h-10 ${isLit ? 'bg-amber-900/40' : 'bg-stone-700/40'}`} />
                      <div className={`h-0.5 w-6 -ml-3 ${isLit ? 'bg-amber-900/40' : 'bg-stone-700/40'}`} />
                    </div>
                  </div>

                  {/* Polished Brass Altar Base Pedestal */}
                  <div className="w-20 h-4 bg-gradient-to-r from-[#5E4416] via-[#D4AF37] to-[#4A340E] rounded-b-md border-t border-amber-300/60 shadow-lg flex flex-col items-center justify-center">
                    <div className="w-full h-0.5 bg-[#FFF0A5]/60" />
                    <div className="w-16 h-1 bg-[#805D1E] rounded-full mt-0.5" />
                  </div>
                </div>

                {/* Main candle status element with ID candle-display-1..5 - styled strictly as un-pill text */}
                <div
                  id={`candle-display-${num}`}
                  className={`text-xs font-serif text-center transition-all z-10 w-full truncate ${
                    isLit
                      ? 'lit text-amber-200 font-semibold'
                      : isDark ? 'text-stone-300' : 'text-stone-700'
                  }`}
                >
                  {isLit ? `🕯️ Votive ${roman} Burning` : `🕯️ Votive ${roman} Awaiting`}
                </div>

                {/* Remaining active countdown timer */}
                <div className="z-10 w-full">
                  {isLit && remainingSec > 0 ? (
                    <div className="text-xs font-serif text-amber-300 font-medium">
                      {mins}m {secs < 10 ? `0${secs}` : secs}s remaining
                    </div>
                  ) : (
                    <div className={`text-[11px] font-serif italic ${isDark ? 'text-stone-300/90' : 'text-stone-600'}`}>
                      Awaiting Intention
                    </div>
                  )}
                </div>

                {/* Intention detail */}
                {slot?.intention && (
                  <div className="text-[10px] font-serif italic text-amber-200/90 line-clamp-2 px-1 border-t border-amber-500/20 pt-1.5 z-10 w-full">
                    "{slot.intention}"
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {queueLength > 0 && (
          <div className="p-4 rounded-xl border border-amber-500/30 bg-amber-500/10 text-amber-200 text-xs sm:text-sm font-serif flex items-center justify-center space-x-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>
              All 5 sanctuary votives are currently burning in prayer. <strong>{queueLength} intention(s)</strong> in waiting will ignite automatically as active votives conclude.
            </span>
          </div>
        )}

        <p className={`font-serif italic text-xs sm:text-sm leading-relaxed text-left border-t border-stone-500/20 pt-3 ${isDark ? 'text-stone-200' : 'text-stone-800'}`}>
          <strong>Dual 15-Minute Prayer System:</strong> Each offering lights a <strong>Virtual Sanctuary Candle</strong> in our online chapel (30 digital flames above) and a <strong>Physical Altar Votive</strong> on my home altar in Inverclyde, Scotland. Both burn for 15 minutes. If candles are currently full, your intention enters the queue and ignites automatically as a votive opens.
        </p>
      </div>
    </div>
  );
};
