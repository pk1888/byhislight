import React, { useEffect, useState } from 'react';
import { AppSettings } from '../types';
import { FlameVisual } from './FlameVisual';
import { Dices, RefreshCw, ShieldAlert } from 'lucide-react';
import { playChapelBell } from '../utils/audio';
import { ALTAR_CANDLES, AltarCandleOption } from '../data/candles';
import { DevotionalCandleGraphic } from './DevotionalCandleGraphic';
import sacredHeartImage from '../assets/images/alter-statues/Sacred Heart.webp';
import saintTheresaImage from '../assets/images/alter-statues/Saint Theresa.webp';
import sacredHeartMaryImage from '../assets/images/alter-statues/Heart of Mary.jpg';
import saintFrancisImage from '../assets/images/alter-statues/Saint Francis.webp';

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
const DEVOTION_IMAGES: Record<string, string> = {
  sacred_heart_jesus: sacredHeartImage,
  st_theresa: saintTheresaImage,
  sacred_heart_mary: sacredHeartMaryImage,
  st_francis: saintFrancisImage
};

const devotionImagePosition = (id: string): string =>
  id === 'sacred_heart_mary' ? 'object-top' : 'object-center';

function estimateQueueMinutes(slots: CandleSlotDetail[], position: number): number {
  const remaining = slots
    .filter(slot => slot.isLit && slot.remainingSeconds > 0)
    .map(slot => slot.remainingSeconds)
    .sort((a, b) => a - b);
  if (remaining.length === 0) return Math.max(1, position * 15);
  const wave = Math.floor((position - 1) / remaining.length);
  const slotIndex = (position - 1) % remaining.length;
  return Math.max(1, Math.ceil((remaining[slotIndex] + wave * 15 * 60) / 60));
}
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
  const [lastQueuePosition, setLastQueuePosition] = useState<number>(0);
  const [lastEstimatedMinutes, setLastEstimatedMinutes] = useState<number>(0);
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
  const [virtualCandleLitUntil, setVirtualCandleLitUntil] = useState<number>(0);

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [selectedCandleId, setSelectedCandleId] = useState<string | null>(null);
  const [leaveInVisitorsBook, setLeaveInVisitorsBook] = useState<boolean>(false);
  const [inspectedCandle, setInspectedCandle] = useState<number | null>(null);
  const [lightbox, setLightbox] = useState<{ src: string; alt: string } | null>(null);

  const previewCandle = ALTAR_CANDLES[previewIndex % ALTAR_CANDLES.length];
  const displayedCandle = selectedCandleId
    ? (ALTAR_CANDLES.find(c => c.id === selectedCandleId) || previewCandle)
    : previewCandle;

  const activeUserCandles = userCandleLogs.filter(c => nowTs - c.litAt < CANDLE_DURATION_MS);
  const activeUserCount = activeUserCandles.length;
  const candlesLitInPastHour = userCandleLogs.filter(c => nowTs - c.litAt < 60 * 60 * 1000).length;
  const isVirtualCandleLit = virtualCandleLitUntil > nowTs || activeUserCount > 0;
  const activePhysicalCount = Object.values(activeCandlesMap).filter(Boolean).length;
  const numberWords = ['Zero', 'One', 'Two', 'Three', 'Four', 'Five'];

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
      setSelectedCandleId(chosenCandle.id);
      setLastOfferStatus(data.status === 'queued' ? 'queued' : 'lit');
      setLastQueuePosition(data.queuePosition || 0);
      setLastEstimatedMinutes(data.status === 'queued' ? estimateQueueMinutes(slotsDetail, data.queuePosition || 1) : 0);
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
      setVirtualCandleLitUntil(Date.now() + CANDLE_DURATION_MS);
      setNowTs(Date.now());
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
    const altarCandle = ALTAR_CANDLES[num - 1] || ALTAR_CANDLES[0];
    const remainingSec = slot?.remainingSeconds || 0;
    const isLastLit = hasLitInSession && lastOfferStatus === 'lit' && Boolean(slot?.candleTypeId === lastLitCandle.id);
    const isInspected = inspectedCandle === num;

    return (
      <div
        key={num}
        className="relative flex min-h-[310px] cursor-pointer flex-col items-center justify-start px-1 sm:px-2"
        onMouseEnter={() => setInspectedCandle(num)}
        onMouseLeave={() => setInspectedCandle(null)}
        onClick={() => setInspectedCandle(current => current === num ? null : num)}
        onKeyDown={event => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            setInspectedCandle(current => current === num ? null : num);
          }
        }}
        role="button"
        tabIndex={0}
        aria-label={`Inspect ${altarCandle.name} candle`}
      >
        {isLit && (
          <div className="absolute top-1/4 h-32 w-32 rounded-full bg-amber-500/20 blur-3xl animate-pulse" aria-hidden="true" />
        )}
        <div className={`relative z-10 flex h-12 max-w-28 flex-col items-center justify-end text-center ${isLit ? 'text-amber-100' : isDark ? 'text-stone-300' : 'text-stone-700'}`}>
          <span className="text-xs font-heading leading-tight">{altarCandle.name}</span>
        </div>
        <div className="relative z-10 flex h-[220px] w-full items-end justify-center">
          <div className={`flex origin-bottom flex-col items-center transition-transform duration-700 ${isLit ? isLastLit ? 'scale-[1.25]' : 'scale-[1.2]' : ''}`}>
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
        </div>
        <div
          id={`candle-display-${num}`}
          className={`relative z-10 mt-4 flex items-start justify-center text-center text-xs font-serif ${isLit ? 'text-amber-200 font-semibold' : 'text-stone-400'}`}
        >
          {isLit ? '🕯 Burning' : '🕯 Awaiting Prayer'}
        </div>
        <div className="relative z-0 mt-0.5 text-center text-[11px] font-serif text-amber-300">
          {isLit && remainingSec > 0
            ? `${Math.max(1, Math.ceil(remainingSec / 60))} min${Math.ceil(remainingSec / 60) === 1 ? '' : 's'} remaining`
            : ''}
        </div>
        {isLit && (
          <div className={`relative z-10 mt-1 text-center text-[10px] leading-tight ${isDark ? 'text-stone-400' : 'text-stone-600'}`}>
            <span className="block font-serif italic">Prayer Intention</span>
            <span className="block">Held in confidence</span>
          </div>
        )}
        {DEVOTION_IMAGES[altarCandle.id] ? (
          <button
            type="button"
            aria-label={`View ${altarCandle.name} artwork`}
            onClick={event => { event.stopPropagation(); setLightbox({ src: DEVOTION_IMAGES[altarCandle.id], alt: altarCandle.name }); }}
            className="relative z-10 mt-4 rounded-full focus:outline-none focus:ring-2 focus:ring-amber-300"
          >
            <img
              src={DEVOTION_IMAGES[altarCandle.id]}
              alt=""
              className={`h-[3.25rem] w-[3.25rem] rounded-full border-2 border-amber-200/70 bg-gradient-to-br from-[#f2d98a] via-[#b58a32] to-[#6e4c16] p-1 object-cover ${devotionImagePosition(altarCandle.id)} opacity-95 shadow-[0_0_12px_rgba(212,175,55,0.3)]`}
            />
          </button>
        ) : (
          <span className="relative z-10 mt-4 flex h-[3.25rem] w-[3.25rem] items-center justify-center rounded-full border-2 border-amber-200/70 bg-gradient-to-br from-[#f2d98a] via-[#b58a32] to-[#6e4c16] text-xl text-[#4a300d] shadow-[0_0_12px_rgba(212,175,55,0.3)]" aria-hidden="true">✝</span>
        )}
        {isInspected && (
          <div className={`absolute bottom-1/2 left-1/2 z-30 w-40 -translate-x-1/2 translate-y-1/2 rounded-xl border px-3 py-2 text-center shadow-xl ${isDark ? 'border-amber-300/40 bg-[#17120e]/95 text-[#f5ebd8]' : 'border-amber-700/30 bg-[#fffaf0]/95 text-stone-900'}`} onClick={event => event.stopPropagation()}>
            <p className="font-heading text-sm">{altarCandle.name}</p>
            <p className="mt-1 text-[11px] font-serif">{isLit ? '🕯 Burning' : 'Available now'}</p>
            {isLit && remainingSec > 0 && <p className="text-[11px] text-amber-600">{Math.max(1, Math.ceil(remainingSec / 60))} minutes remaining</p>}
            {!isLit && <button type="button" onClick={() => { setSelectedCandleId(altarCandle.id); setInspectedCandle(null); document.getElementById('candle-intention')?.scrollIntoView({ behavior: 'smooth', block: 'center' }); }} className="mt-1 text-[11px] font-semibold text-amber-700 underline-offset-2 hover:underline">Choose this devotion</button>}
          </div>
        )}
      </div>
    );
  };

  useEffect(() => {
    if (!lightbox) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setLightbox(null);
    };
    window.addEventListener('keydown', closeOnEscape);
    return () => window.removeEventListener('keydown', closeOnEscape);
  }, [lightbox]);

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

        <div className="relative z-10 mx-auto -mt-1 w-fit rounded-b-sm border border-[#e6c866]/60 bg-gradient-to-b from-[#e1c15e] via-[#ae852d] to-[#704b16] px-4 py-1.5 text-center shadow-[inset_0_1px_2px_rgba(255,244,180,0.55),0_3px_5px_rgba(20,10,3,0.45)]">
          <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-[#3d280b]">Home Prayer Altar</p>
          <p className="mt-0.5 font-serif text-[10px] italic text-[#4d330e]">Inverclyde, Scotland</p>
        </div>

        <p className={`relative z-10 mt-5 text-center font-serif text-sm italic ${isDark ? 'text-amber-200' : 'text-amber-900'}`}>
          {queueLength > 0
            ? '🕯 All five altar candles are currently burning.'
            : activePhysicalCount === 0
            ? '🕯 All five altar candles are available.'
            : `${activePhysicalCount === 1 ? '🕯 One prayer is' : `🕯 ${numberWords[activePhysicalCount]} prayers are`} currently being held on the home altar.`}
        </p>

        {queueLength === 0 && activePhysicalCount > 0 && activePhysicalCount < 5 && (
          <p className={`relative z-10 mt-1 text-center font-serif text-xs italic ${isDark ? 'text-stone-400' : 'text-stone-600'}`}>
             {numberWords[5 - activePhysicalCount]} {5 - activePhysicalCount === 1 ? 'candle remains' : 'candles remain'} ready for prayer.
          </p>
        )}

        {queueLength > 0 && (
          <div className={`relative z-10 mx-auto mt-3 max-w-xl rounded-2xl border px-5 py-4 text-center ${isDark ? 'border-amber-500/25 bg-amber-500/10 text-amber-100' : 'border-amber-700/20 bg-amber-50 text-amber-900'}`}>
            <p className="font-serif text-sm font-semibold">
              {queueLength} prayer {queueLength === 1 ? 'intention is' : 'intentions are'} waiting.
            </p>
            <p className="mt-1 text-xs italic">Your prayer will illuminate the next available candle.</p>
          </div>
        )}

        <div className={`relative z-10 mx-auto mt-7 max-w-xl border-t pt-4 text-center ${isDark ? 'border-amber-500/15 text-stone-500' : 'border-amber-800/15 text-stone-500'}`}>
          <p className="font-serif text-sm italic">
            🕯 {isVirtualCandleLit ? 'Your virtual candle is burning quietly in the online chapel.' : 'A quiet virtual candle waits here for prayer.'}
          </p>
          {isVirtualCandleLit && <p className="mt-1 text-[11px]">It will remain lit here for fifteen minutes.</p>}
          <div className="mx-auto mt-3 flex max-w-sm items-end justify-center gap-1.5 opacity-75" aria-hidden="true">
            {Array.from({ length: 18 }).map((_, index) => (
              <span
                key={index}
                className="relative flex h-10 w-4 flex-col items-center justify-end"
              >
                <span className={`absolute top-0 rounded-full ${
                  isVirtualCandleLit && index === 0
                    ? 'h-4 w-3 bg-amber-200 shadow-[0_0_14px_rgba(252,211,77,0.95)] animate-pulse'
                    : `h-3 w-2 ${isDark ? 'bg-amber-900/50' : 'bg-amber-700/25'}`
                }`} />
                <span className={`rounded-t-sm rounded-b-[2px] border ${
                  isVirtualCandleLit && index === 0
                    ? 'h-8 w-4 border-amber-300/60 bg-gradient-to-r from-amber-500 via-amber-200 to-amber-600'
                    : `h-6 w-3 ${isDark ? 'border-stone-700 bg-stone-700/70' : 'border-stone-400 bg-stone-300'}`
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
              <h2 className="font-heading text-2xl sm:text-3xl">Your prayer has been received.</h2>
              <p className={`mt-4 font-sans leading-relaxed ${isDark ? 'text-stone-300' : 'text-stone-600'}`}>
                🕯 Your candle has joined the home altar.
              </p>
              <div className={`mx-auto mt-5 max-w-xs rounded-2xl border px-5 py-4 ${isDark ? 'border-amber-500/25 bg-amber-500/10' : 'border-amber-700/20 bg-amber-50'}`}>
                <p className="font-serif text-sm">Queue position: <strong>#{lastQueuePosition}</strong></p>
                <p className="mt-1 font-serif text-sm">Estimated lighting: <strong>approximately {lastEstimatedMinutes} minutes</strong></p>
              </div>
              <p className={`mt-5 font-serif italic ${isDark ? 'text-amber-200' : 'text-amber-900'}`}>
                Your candle will automatically illuminate as soon as another prayer concludes.
              </p>
              <p className={`mt-4 font-scripture text-lg italic ${isDark ? 'text-[#f5ebd8]' : 'text-stone-800'}`}>
                May God bless you and all who are praying today.
              </p>
            </>
          ) : (
            <>
              <h2 className="font-heading text-2xl sm:text-3xl">Your candle has been lit.</h2>
              <p className={`mt-4 font-sans leading-relaxed ${isDark ? 'text-stone-300' : 'text-stone-600'}`}>
                Your candle has been entrusted to {lastLitCandle.name} and is now burning on the home altar in Inverclyde, Scotland.
              </p>
              <p className={`mt-3 font-serif italic ${isDark ? 'text-amber-200' : 'text-amber-900'}`}>
                It will remain lit for fifteen minutes.
              </p>
              <p className={`mt-5 font-scripture text-lg italic ${isDark ? 'text-[#f5ebd8]' : 'text-stone-800'}`}>
                May Christ hear the prayer held quietly within your heart.
              </p>
              {DEVOTION_IMAGES[lastLitCandle.id] && (
                <img
                  src={DEVOTION_IMAGES[lastLitCandle.id]}
                  alt={lastLitCandle.name}
                  className={`mx-auto mt-6 h-[6.5rem] w-[6.5rem] rounded-full object-cover ${devotionImagePosition(lastLitCandle.id)} shadow-[0_0_22px_rgba(212,175,55,0.35)] ring-1 ring-amber-300/60`}
                />
              )}
              <p className="mt-5 font-heading text-lg text-amber-500">{lastLitCandle.name}</p>
              <p className={`mt-2 font-serif text-sm italic ${isDark ? 'text-amber-200' : 'text-amber-900'}`}>
                Your prayer has been entrusted to the intercession of {lastLitCandle.name}.
              </p>
            </>
          )}
          <button onClick={() => { setHasLitInSession(false); setSelectedCandleId(null); }} className={`mt-8 text-sm underline-offset-4 hover:underline ${isDark ? 'text-amber-300' : 'text-amber-800'}`}>
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
                <p className={`font-mono text-[11px] uppercase tracking-[0.18em] ${isDark ? 'text-amber-300' : 'text-amber-800'}`}>
                  Your Prayer Will Be Entrusted To
                </p>
                {selectedCandleId && DEVOTION_IMAGES[displayedCandle.id] && (
                  <img
                    src={DEVOTION_IMAGES[displayedCandle.id]}
                    alt={displayedCandle.name}
                    className={`h-[6.5rem] w-[6.5rem] rounded-full object-cover ${devotionImagePosition(displayedCandle.id)} shadow-[0_0_20px_rgba(212,175,55,0.35)] ring-1 ring-amber-300/60`}
                  />
                )}
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

      {lightbox && (
        <div
          className="fixed inset-0 z-50 flex cursor-zoom-out items-center justify-center bg-black/85 p-6 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-label={`${lightbox.alt} artwork`}
          onClick={() => setLightbox(null)}
        >
          <img
            src={lightbox.src}
            alt={lightbox.alt}
            className="max-h-[80vh] max-w-[90vw] rounded-2xl object-contain shadow-2xl ring-1 ring-amber-300/50"
            onClick={event => event.stopPropagation()}
          />
        </div>
      )}

    </div>
  );
};
