import React, { useEffect, useState } from 'react';
import { AppSettings } from '../types';
import { FlameVisual } from './FlameVisual';
import { Dices, RefreshCw, ShieldAlert } from 'lucide-react';
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

const CANDLE_DURATION_MS = 15 * 60 * 1000;
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
  const [lastOfferStatus, setLastOfferStatus] = useState<'lit' | 'queued'>('lit');
  const [isShuffling, setIsShuffling] = useState<boolean>(false);
  const [nowTs, setNowTs] = useState<number>(Date.now());

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

  const [userCandleLogs, setUserCandleLogs] = useState<UserCandleLog[]>(() => {
    try {
      const saved = localStorage.getItem('byhislight_user_candle_logs');
      if (saved) return JSON.parse(saved);
    } catch {}
    return [];
  });

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [selectedCandleId, setSelectedCandleId] = useState<string | null>(null);
  const [leaveInVisitorsBook, setLeaveInVisitorsBook] = useState<boolean>(false);

  const previewCandle = ALTAR_CANDLES[previewIndex % ALTAR_CANDLES.length];
  const displayedCandle = selectedCandleId
    ? (ALTAR_CANDLES.find(c => c.id === selectedCandleId) || previewCandle)
    : previewCandle;

  const activeUserCandles = userCandleLogs.filter(c => nowTs - c.litAt < CANDLE_DURATION_MS);
  const activeUserCount = activeUserCandles.length;
  const candlesLitInPastHour = userCandleLogs.filter(c => nowTs - c.litAt < 60 * 60 * 1000).length;

  useEffect(() => {
    const update = () => setNowTs(Date.now());
    update();
    const timer = setInterval(update, 5000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const pollStatus = async () => {
      try {
        const res = await fetch('/api/status');
        if (!res.ok) return;
        const data = await res.json();
        setQueueLength(data.queue_length || 0);
        if (data.totalCandlesLit) setTotalCandles(data.totalCandlesLit);
        if (data.slots) setSlotsDetail(data.slots);
        if (data.active_candles) setActiveCandlesMap(data.active_candles);
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

    const chosenCandle = selectedCandleId
      ? (ALTAR_CANDLES.find(c => c.id === selectedCandleId) || ALTAR_CANDLES[0])
      : ALTAR_CANDLES[Math.floor(Math.random() * ALTAR_CANDLES.length)];

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
        setErrorMessage(data.error || 'Your candle could not be lit just now.');
        setIsSubmitting(false);
        return;
      }

      await new Promise(resolve => setTimeout(resolve, 450));
      setTotalCandles(data.totalCandlesLit);
      setLastLitCandle(chosenCandle);
      setLastOfferStatus(data.status === 'queued' ? 'queued' : 'lit');
      setHasLitInSession(true);

      if (leaveInVisitorsBook && intention.trim().length > 0) {
        fetch('/api/guestbook', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message: intention.trim().slice(0, 300),
            anonymous: true
          })
        }).catch(() => {});
        setLeaveInVisitorsBook(false);
      }

      const newRecord: UserCandleLog = {
        id: 'c_' + Date.now(),
        candleTypeId: chosenCandle.id,
        litAt: Date.now()
      };
      setUserCandleLogs(prev => [newRecord, ...prev]);
      setIntention('');
      if (settings.quietBell) playChapelBell(0.3);
    } catch {
      setErrorMessage('Could not connect to the chapel just now.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderAltarCandle = (num: number) => {
    const slot = slotsDetail.find(s => s.id === num);
    const isLit = Boolean(activeCandlesMap[String(num)] || slot?.isLit);
    const altarCandle = ALTAR_CANDLES.find(candle => candle.id === slot?.candleTypeId) || ALTAR_CANDLES[num - 1] || ALTAR_CANDLES[0];
    const remainingSec = slot?.remainingSeconds || 0;
    const isLastLit = hasLitInSession && lastOfferStatus === 'lit' && Boolean(slot?.candleTypeId === lastLitCandle.id);

    return (
      <div key={num} className="relative flex min-h-[210px] flex-col items-center justify-end px-1 sm:px-2">
        {isLit && (
          <div className="absolute top-1/4 h-32 w-32 rounded-full bg-amber-500/20 blur-3xl animate-pulse" aria-hidden="true" />
        )}
        <div className={`relative z-10 flex flex-col items-center transition-transform duration-700 ${isLit ? isLastLit ? 'scale-[1.3]' : 'scale-[1.2]' : ''}`}>
          <div className="relative -mb-3 z-20 flex justify-center">
            <FlameVisual size="lg" isLit={isLit} />
          </div>
          <div className={`relative z-10 h-2 w-16 rounded-t-full border-t ${
            isLit
              ? 'bg-gradient-to-r from-[#FDE68A] via-[#FEF3C7] to-[#F59E0B] border-amber-300/60'
              : 'bg-gradient-to-r from-[#B8AA98] via-[#E8DCCB] to-[#9C8E7C] border-stone-400/40'
          }`} />
          <div className={`relative h-24 w-16 overflow-hidden rounded-b-sm border shadow-xl ${
            isLit
              ? 'bg-gradient-to-r from-[#B87920] via-[#FDE047] to-[#B87A1B] border-amber-400/80 shadow-[0_0_25px_rgba(245,158,11,0.45)]'
              : 'bg-gradient-to-r from-[#8E8274] via-[#D8CBBB] to-[#766B5E] border-stone-500/30'
          }`}>
            <div className="absolute top-0 bottom-0 left-2 w-3 bg-gradient-to-r from-transparent via-white/35 to-transparent" />
            <div className={`absolute top-0 left-1 w-1.5 h-7 rounded-b-full ${isLit ? 'bg-amber-100/60' : 'bg-white/30'}`} />
            <div className={`absolute top-2 left-1/2 h-8 w-0.5 -translate-x-1/2 ${isLit ? 'bg-amber-900/40' : 'bg-stone-700/35'}`} />
            <div className={`absolute top-1/2 left-1/2 h-0.5 w-5 -translate-x-1/2 ${isLit ? 'bg-amber-900/40' : 'bg-stone-700/35'}`} />
          </div>
          <div className="mx-auto h-3 w-20 rounded-b-md border-t border-amber-300/60 bg-gradient-to-r from-[#5E4416] via-[#D4AF37] to-[#4A340E] shadow-lg" />
        </div>
        <div
          id={`candle-display-${num}`}
          className={`relative z-10 text-center text-xs font-serif ${isLit ? 'mt-7 text-amber-200 font-semibold' : 'mt-3 text-stone-400'}`}
        >
          {isLit ? '🕯 Burning' : '🕯 Awaiting Prayer'}
        </div>
        <div className={`relative z-10 mt-1 max-w-28 text-center text-xs font-heading leading-tight ${isLit ? 'text-amber-100' : isDark ? 'text-stone-300' : 'text-stone-700'}`}>
          {altarCandle.name}
        </div>
        {isLit && remainingSec > 0 && (
          <div className="relative z-10 mt-1 text-[11px] font-serif text-amber-300">
            {Math.max(1, Math.ceil(remainingSec / 60))} minute{Math.ceil(remainingSec / 60) === 1 ? '' : 's'} remaining
          </div>
        )}
        <div className={`relative z-10 mt-2 text-xs font-serif italic ${isDark ? 'text-stone-300' : 'text-stone-700'}`}>
          {queueLength} {queueLength === 1 ? 'prayer' : 'prayers'} waiting
        </div>
      </div>
    );
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:py-12">
      <header className="mx-auto max-w-2xl space-y-4 text-center">
        <h1 className={`font-heading text-4xl font-semibold tracking-wide sm:text-5xl ${isDark ? 'text-[#f5ebd8]' : 'text-[#1c2536]'}`}>
          Light a Candle
        </h1>
        <p className={`font-sans text-sm leading-relaxed sm:text-base ${isDark ? 'text-[#C2B7A5]' : 'text-stone-600'}`}>
          Offer a quiet prayer and illuminate one of five real votive candles burning on my home altar in Inverclyde, Scotland.
        </p>
      </header>

      <section aria-labelledby="altar-heading" className={`relative mt-10 overflow-hidden rounded-[2rem] border px-4 py-8 shadow-2xl sm:px-10 sm:py-12 ${
        isDark ? 'border-[#4a3824] bg-gradient-to-b from-[#211810] via-[#17120e] to-[#0f0c09]' : 'border-[#d9c7ae] bg-gradient-to-b from-[#f7efe1] via-[#eee0ca] to-[#e5d1b3]'
      }`}>
        <div
          className="absolute inset-0 bg-cover bg-center opacity-20 mix-blend-screen"
          style={{ backgroundImage: "url('/images/home-altar.jpg')" }}
          aria-hidden="true"
        />
        <div className={`absolute inset-0 ${isDark ? 'bg-gradient-to-b from-[#110b07]/75 via-[#120c08]/90 to-[#0c0907]' : 'bg-gradient-to-b from-[#f3e6d2]/80 via-[#f3e6d2]/90 to-[#e8d5b7]/95'}`} aria-hidden="true" />
        <div className="relative z-10 text-center">
          <h2 id="altar-heading" className={`font-heading text-2xl sm:text-3xl ${isDark ? 'text-[#f5ebd8]' : 'text-stone-900'}`}>
            The Home Altar
          </h2>
          <p className={`mt-2 font-serif text-sm italic ${isDark ? 'text-amber-200/80' : 'text-amber-900/80'}`}>
            Five small flames, held in prayer in Inverclyde, Scotland
          </p>
        </div>

        <div className="relative z-10 mx-auto mt-8 grid max-w-3xl grid-cols-3 items-end gap-2 border-b-8 border-[#70481f] bg-gradient-to-b from-transparent to-[#3a2112]/40 px-1 pb-5 sm:grid-cols-5 sm:gap-6 sm:px-8">
          {[1, 2, 3, 4, 5].map(renderAltarCandle)}
        </div>

        <p className={`relative z-10 mt-5 text-center font-serif text-sm italic ${isDark ? 'text-amber-200' : 'text-amber-900'}`}>
          {Object.values(activeCandlesMap).filter(Boolean).length === 5
            ? 'All candles are currently burning. Your prayer will be next.'
            : Object.values(activeCandlesMap).filter(Boolean).length === 1
            ? 'One candle is currently burning in prayer.'
            : `${Object.values(activeCandlesMap).filter(Boolean).length} altar candles are burning in prayer.`}
        </p>

        <div className={`relative z-10 mx-auto mt-7 max-w-xl border-t pt-4 text-center ${isDark ? 'border-amber-500/15 text-stone-500' : 'border-amber-800/15 text-stone-500'}`}>
          <p className="font-serif text-sm italic">
            🕯 {activeUserCount > 0 ? 'Your virtual candle is burning quietly in the online chapel.' : 'A quiet virtual candle waits here for prayer.'}
          </p>
          <div className="mx-auto mt-3 flex max-w-sm items-end justify-center gap-1.5 opacity-75" aria-hidden="true">
            {Array.from({ length: 18 }).map((_, index) => (
              <span
                key={index}
                className="relative flex h-10 w-4 flex-col items-center justify-end"
              >
                <span className={`absolute top-0 h-3 w-2 rounded-full ${
                  activeUserCount > 0 && index === 0
                    ? 'bg-amber-200 shadow-[0_0_10px_rgba(252,211,77,0.95)] animate-pulse'
                    : isDark ? 'bg-amber-900/50' : 'bg-amber-700/25'
                }`} />
                <span className={`h-6 w-3 rounded-t-sm rounded-b-[2px] border ${
                  activeUserCount > 0 && index === 0
                    ? 'border-amber-300/60 bg-gradient-to-r from-amber-500 via-amber-200 to-amber-600'
                    : isDark ? 'border-stone-700 bg-stone-700/70' : 'border-stone-400 bg-stone-300'
                }`} />
              </span>
            ))}
          </div>
          <p className="mt-2 text-[11px]">Every offering is held by a virtual candle here as well as on the altar.</p>
        </div>

        <p className={`relative z-10 mt-5 text-center font-serif text-xs italic ${isDark ? 'text-emerald-200/80' : 'text-emerald-900/80'}`}>
          🟢 The home altar is quietly receiving prayers
        </p>
        <p className={`relative z-10 mx-auto mt-4 max-w-xl text-center text-xs leading-relaxed ${isDark ? 'text-stone-400' : 'text-stone-600'}`}>
          Each candle burns for fifteen minutes before making room for the next prayer. If all five are burning, your prayer is lovingly placed in the queue and will be next.
        </p>
        <div className="relative z-10 mt-5 flex items-center justify-center gap-3">
          <FlameVisual size="sm" isLit={true} />
          <span className={`font-mono text-sm font-semibold tracking-wide sm:text-base ${isDark ? 'text-amber-200' : 'text-amber-900'}`}>
            {totalCandles.toLocaleString()} Candles Offered in Sanctuary
          </span>
        </div>
      </section>

      {hasLitInSession ? (
        <section className={`mx-auto mt-10 max-w-2xl rounded-3xl border px-6 py-9 text-center shadow-sm animate-fade-in sm:px-10 ${isDark ? 'border-[#4a3824] bg-[#1b1610] text-[#f5ebd8]' : 'border-[#e1d0b8] bg-[#faf6ee] text-stone-900'}`} aria-live="polite">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-amber-500/15 shadow-[0_0_35px_rgba(245,158,11,0.3)]">
            <FlameVisual size="md" isLit={lastOfferStatus === 'lit'} />
          </div>
          {lastOfferStatus === 'queued' ? (
            <>
              <h2 className="font-heading text-2xl sm:text-3xl">All candles are currently burning in prayer.</h2>
              <p className={`mt-4 font-sans leading-relaxed ${isDark ? 'text-stone-300' : 'text-stone-600'}`}>
                Your intention has been lovingly placed next. It will automatically illuminate as soon as another prayer concludes.
              </p>
            </>
          ) : (
            <>
              <h2 className="font-heading text-2xl sm:text-3xl">Your candle has been lit.</h2>
              <p className={`mt-4 font-sans leading-relaxed ${isDark ? 'text-stone-300' : 'text-stone-600'}`}>
                <span className="block">A real flame is now burning</span>
                <span className="block">on my home altar</span>
                <span className="block">in Inverclyde, Scotland.</span>
              </p>
              <p className={`mt-3 font-serif italic ${isDark ? 'text-amber-200' : 'text-amber-900'}`}>
                It will remain lit for fifteen minutes.
              </p>
              <p className={`mt-5 font-scripture text-lg italic ${isDark ? 'text-[#f5ebd8]' : 'text-stone-800'}`}>
                May Christ hear the prayer held quietly within your heart.
              </p>
              <p className="mt-5 font-heading text-lg text-amber-500">{lastLitCandle.name}</p>
            </>
          )}
          <button onClick={() => setHasLitInSession(false)} className={`mt-8 text-sm underline-offset-4 hover:underline ${isDark ? 'text-amber-300' : 'text-amber-800'}`}>
            Offer another prayer
          </button>
        </section>
      ) : (
        <form onSubmit={handleLightCandle} className="mx-auto mt-10 max-w-2xl space-y-7">
          <div>
            <label htmlFor="candle-intention" className={`mb-2 block text-sm font-sans font-semibold ${isDark ? 'text-stone-200' : 'text-stone-900'}`}>
              Silent Prayer <span className="font-normal opacity-70">(Optional)</span>
            </label>
            <textarea
              id="candle-intention"
              rows={4}
              value={intention}
              onChange={e => setIntention(e.target.value)}
              placeholder="Offer your prayer to God..."
              maxLength={300}
              className={`w-full rounded-2xl border p-4 text-base leading-relaxed transition-all focus:outline-none focus:ring-2 focus:ring-[#c5a059] ${isDark ? 'border-[#3a342c] bg-[#1b1916] text-[#ece4d6] placeholder-stone-500' : 'border-[#ded1be] bg-[#faf6ee] text-stone-900 placeholder-stone-500'}`}
            />
          </div>

          <details className={`group rounded-2xl border ${isDark ? 'border-[#3a3023] bg-[#17120e]' : 'border-[#e1d0b8] bg-[#faf6ee]'}`}>
            <summary className={`flex cursor-pointer list-none items-center justify-between px-5 py-4 font-serif ${isDark ? 'text-amber-200' : 'text-amber-900'}`}>
              <span>Devotion: {selectedCandleId ? displayedCandle.name : 'Random Devotion'}</span>
              <span className="text-xs opacity-60 transition-transform group-open:rotate-180">⌄</span>
            </summary>
            <div className="space-y-5 border-t border-amber-500/20 px-5 pb-5 pt-5">
              <div className="flex flex-col items-center gap-3 text-center">
                <DevotionalCandleGraphic candle={displayedCandle} isSelected={Boolean(selectedCandleId)} size="md" />
                <div>
                  <p className={`font-heading text-lg ${isDark ? 'text-[#f5ebd8]' : 'text-stone-900'}`}>{displayedCandle.name}</p>
                  <p className={`text-xs italic ${isDark ? 'text-amber-300' : 'text-amber-900'}`}>{displayedCandle.devotionFocus}</p>
                </div>
              </div>
              <div className="flex flex-wrap justify-center gap-2">
                <button type="button" onClick={handleShufflePreview} disabled={isShuffling} className={`rounded-full border px-3 py-1.5 text-xs transition ${selectedCandleId === null ? 'border-amber-400 bg-amber-500/20 text-amber-200' : isDark ? 'border-stone-700 text-stone-300 hover:border-amber-500' : 'border-stone-300 text-stone-700 hover:border-amber-500'}`}>
                  <span className="inline-flex items-center gap-1.5"><Dices className="h-3.5 w-3.5" /> Random Devotion</span>
                </button>
                {ALTAR_CANDLES.map(candle => (
                  <button key={candle.id} type="button" onClick={() => setSelectedCandleId(candle.id)} className={`rounded-full border px-3 py-1.5 text-xs transition ${selectedCandleId === candle.id ? 'border-amber-400 bg-amber-500/25 text-amber-100' : isDark ? 'border-stone-700 text-stone-300 hover:border-amber-500' : 'border-stone-300 text-stone-700 hover:border-amber-500'}`}>
                    {candle.name}
                  </button>
                ))}
              </div>
              {selectedCandleId && (
                <button type="button" onClick={handleShufflePreview} className="mx-auto flex items-center gap-1 text-xs text-amber-400 hover:text-amber-300">
                  <RefreshCw className="h-3 w-3" /> Return to Random Devotion
                </button>
              )}
            </div>
          </details>

          {intention.trim().length > 0 && (
            <label htmlFor="leave-in-visitors-book" className={`flex cursor-pointer select-none items-start gap-3 text-sm ${isDark ? 'text-stone-300' : 'text-stone-700'}`}>
              <input id="leave-in-visitors-book" type="checkbox" checked={leaveInVisitorsBook} onChange={e => setLeaveInVisitorsBook(e.target.checked)} className="mt-0.5 h-4 w-4 rounded accent-[#c5a059]" />
              <span>Leave this prayer in the Visitors' Book<span className={`mt-0.5 block text-xs ${isDark ? 'text-stone-500' : 'text-stone-500'}`}>It will appear anonymously once quietly approved.</span></span>
            </label>
          )}

          {errorMessage && (
            <div role="alert" className="flex items-start gap-2.5 rounded-xl border border-rose-500/40 bg-rose-500/10 p-4 text-sm text-rose-300">
              <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          <p className={`text-center text-xs leading-relaxed ${isDark ? 'text-stone-500' : 'text-stone-500'}`}>
            To keep the altar available to everyone, each visitor may offer up to three candles in an hour.
          </p>

          <button type="submit" disabled={isSubmitting || candlesLitInPastHour >= 3} className={`mx-auto flex w-full max-w-sm items-center justify-center gap-2.5 rounded-2xl px-8 py-4 text-lg font-semibold shadow-lg transition-all ${isSubmitting || candlesLitInPastHour >= 3 ? 'cursor-not-allowed bg-stone-700 text-stone-400 opacity-60' : 'bg-gradient-to-r from-amber-600 to-[#c5a059] text-stone-950 hover:brightness-110 hover:shadow-amber-900/30'}`}>
            <span aria-hidden="true">🕯</span>
            <span>{isSubmitting ? 'Lighting a candle...' : candlesLitInPastHour >= 3 ? 'Please return later' : 'Light a Candle'}</span>
          </button>
        </form>
      )}

    </div>
  );
};
