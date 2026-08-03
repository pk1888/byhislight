import React from 'react';
import { AppSettings } from '../types';
import { formatUptime } from '../utils/format';

interface FooterProps {
  settings: AppSettings;
}

interface PiStatus {
  online: boolean;
  device: string;
  hostname: string;
  cpuTempC: number | null;
  uptimeSeconds: number;
  cpuLoadPercent: number | null;
  memoryUsedPercent: number | null;
  diskUsedPercent: number | null;
  relayStatus: {
    connected: boolean;
    pin: string;
    label: string;
  };
}

export const Footer: React.FC<FooterProps> = ({ settings }) => {
  const [scotlandTime, setScotlandTime] = React.useState<string>('08:35');
  const [candleStatus, setCandleStatus] = React.useState<string>('Ready');
  const [piStatus, setPiStatus] = React.useState<PiStatus | null>(null);
  const isDark = settings.theme === 'candlelight' || settings.theme === 'stone';

  React.useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      const timeStr = now.toLocaleTimeString('en-GB', {
        timeZone: 'Europe/London',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      });
      setScotlandTime(timeStr);
    };
    updateClock();
    const timer = setInterval(updateClock, 1000);
    return () => clearInterval(timer);
  }, []);

  React.useEffect(() => {
    const checkCandle = async () => {
      try {
        const res = await fetch('/api/candles/stats');
        if (res.ok) {
          const data = await res.json();
          if (data.lastAltarPulseAt) {
            const diff = Date.now() - new Date(data.lastAltarPulseAt).getTime();
            // If a candle was lit in the last 15 minutes, show burning message
            if (diff < 15 * 60 * 1000) {
              setCandleStatus('A candle is burning in the chapel');
              return;
            }
          }
        }
        setCandleStatus('Ready');
      } catch {
        setCandleStatus('Ready');
      }
    };
    checkCandle();
    const interval = setInterval(checkCandle, 20000);
    return () => clearInterval(interval);
  }, []);

  React.useEffect(() => {
    const checkPi = async () => {
      try {
        const res = await fetch('/api/pi/status');
        if (res.ok) {
          setPiStatus(await res.json());
        }
      } catch {
        // Keep last known status quietly if the node is unreachable
      }
    };
    checkPi();
    const interval = setInterval(checkPi, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <footer className={`w-full border-t transition-colors duration-300 py-10 px-6 ${
      isDark 
        ? 'bg-[#0d0c0b] border-[#25221e] text-[#c2b7a5]' 
        : 'bg-[#faf6ee] border-[#ebdcc8] text-[#4a4237]'
    }`}>
      <div className="max-w-4xl mx-auto space-y-6 text-center font-sans text-xs sm:text-sm">
        <p className={`inline-flex items-center justify-center gap-2 flex-wrap ${isDark ? 'text-stone-300 font-medium' : 'text-stone-700 font-medium'}`}>
          <span>Quietly hosted on a Raspberry Pi Zero 2 W beside my prayer altar in Inverclyde, Scotland</span>
          <svg className="w-5 h-3.5 rounded-xs shadow-xs inline-block align-middle border border-stone-600/30 shrink-0" viewBox="0 0 60 36" aria-label="Flag of Scotland" title="Scotland">
            <rect width="60" height="36" fill="#005EB8" />
            <path d="M0,0 L60,36 M60,0 L0,36" stroke="#FFFFFF" strokeWidth="7.2" />
          </svg>
        </p>

        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-[#c5a059] font-medium">
          <div className="flex items-center space-x-2 px-3 py-1 rounded-full border border-[#c5a059]/30 bg-[#c5a059]/10 text-[#c5a059]">
            <span className="relative flex h-2 w-2 items-center justify-center">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#c5a059] opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#c5a059]" />
            </span>
            <span>Chapel Candle: {candleStatus}</span>
          </div>

          <div className="flex items-center space-x-1.5">
            <span>🕒</span>
            <span>Local Time: {scotlandTime}</span>
          </div>

          <div className="flex items-center space-x-1.5">
            <span>⏳</span>
            <span>Serving since: 1 August 2026</span>
          </div>
        </div>

        {/* Live chapel node status - quiet, minimal */}
        {piStatus && (
          <div className={`flex flex-wrap items-center justify-center gap-x-5 gap-y-1 text-[11px] font-sans tracking-wide ${
            isDark ? 'text-stone-500' : 'text-stone-500'
          }`}>
            <span className="flex items-center space-x-1.5">
              <span className="relative flex h-1.5 w-1.5 items-center justify-center">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-400" />
              </span>
              <span>Online</span>
            </span>
            <span>Uptime: {formatUptime(piStatus.uptimeSeconds)}</span>
            {piStatus.cpuTempC !== null && (
              <span>CPU Temp: {piStatus.cpuTempC.toFixed(1)}°C</span>
            )}
            {piStatus.cpuLoadPercent !== null && (
              <span>CPU Load: {piStatus.cpuLoadPercent}%</span>
            )}
            {piStatus.memoryUsedPercent !== null && (
              <span>Memory: {piStatus.memoryUsedPercent}%</span>
            )}
            {piStatus.diskUsedPercent !== null && (
              <span>Disk Used: {piStatus.diskUsedPercent}%</span>
            )}
          </div>
        )}

        {/* Quiet Brand & Foundation Footer */}
        <div className="pt-6 border-t border-stone-800/20 flex flex-col items-center text-center space-y-2">
          <div className="flex gap-2 items-center justify-center">
            <div className="w-1.5 h-1.5 rounded-full bg-[#3D5A45]" />
            <div className="w-1.5 h-1.5 rounded-full bg-[#c5a059]" />
            <div className="w-1.5 h-1.5 rounded-full bg-[#3D5A45]" />
          </div>
          <span className="font-heading text-lg font-semibold text-[#c5a059] tracking-wider">
            By His Light
          </span>
          <div className="text-xs opacity-75 font-sans space-y-0.5">
            <div>© {new Date().getFullYear()} All rights reserved.</div>
          </div>
        </div>
      </div>
    </footer>
  );
};


