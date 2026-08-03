import React, { useState, useEffect } from 'react';
import { AppSettings } from '../types';
import { ChapelCross } from './ChapelCross';
import { FlameVisual } from './FlameVisual';
import { Sparkles, Server } from 'lucide-react';
import { formatUptimeWords } from '../utils/format';
import holyFamilyPhoto1 from '../assets/images/holy-family-church/photo-1.avif';
import holyFamilyPhoto2 from '../assets/images/holy-family-church/photo-2.avif';
import holyFamilyPhoto3 from '../assets/images/holy-family-church/photo-3.avif';
import holyFamilyPhoto4 from '../assets/images/holy-family-church/photo-4.avif';

interface AboutViewProps {
  settings: AppSettings;
}

interface HealthTelemetry {
  status: string;
  system: string;
  location: string;
  powerSource: string;
  sunshinePercent: number;
  solarBatteryPercent: number;
  uptimeDays: number;
  uptimeSeconds: number;
  memoryMB: number;
  tagline: string;
  attribution: string;
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

export const AboutView: React.FC<AboutViewProps> = ({ settings }) => {
  const isDark = settings.theme === 'candlelight' || settings.theme === 'stone';
  const [healthData, setHealthData] = useState<HealthTelemetry | null>(null);
  const [piStatus, setPiStatus] = useState<PiStatus | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string>('');
  const [lightbox, setLightbox] = useState<string | null>(null);

  // Dynamic age calculation based on DOB 01/03/1984 (March 1, 1984)
  const calculateAge = (birthDateString: string): number => {
    const today = new Date();
    const birthDate = new Date(birthDateString);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const paulAge = calculateAge('1984-03-01');

  const scotlandClock = () => new Date().toLocaleTimeString('en-GB', { timeZone: 'Europe/London', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true });

  useEffect(() => {
    const load = () => {
      fetch('/api/health')
        .then(res => res.json())
        .then(data => {
          setHealthData(data);
          setLastUpdated(scotlandClock());
        })
        .catch(err => console.debug('Health check fail:', err));
    };
    load();
    const id = setInterval(load, 30000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const load = () => {
      fetch('/api/pi/status')
        .then(res => res.ok ? res.json() : null)
        .then(data => setPiStatus(data))
        .catch(err => console.debug('Pi status fail:', err));
    };
    load();
    const id = setInterval(load, 30000);
    return () => clearInterval(id);
  }, []);

  const scotlandTime = new Date().toLocaleTimeString('en-GB', { timeZone: 'Europe/London', hour: '2-digit', minute: '2-digit', hour12: true });

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-10">
      {/* Header */}
      <div className="text-center space-y-3">
        <h1 className={`font-heading text-3xl sm:text-4xl font-semibold tracking-wide ${
          isDark ? 'text-[#f5ebd8]' : 'text-[#1c2536]'
        }`}>
          A Micro-Chapel on the Web
        </h1>

        <p className={`text-sm sm:text-base font-sans italic ${
          isDark ? 'text-[#C2B7A5]' : 'text-stone-600'
        }`}>
          "For where two or three are gathered together in My name, there am I in the midst of them" - Matthew 18:20
        </p>

        <nav className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 pt-2">
          <a href="#journey" className="text-sm font-sans font-medium text-[#D4AF37] hover:underline underline-offset-4">
            My Journey
          </a>
          <a href="#creation" className="text-sm font-sans font-medium text-[#D4AF37] hover:underline underline-offset-4">
            Wonder of Creation
          </a>
          <a href="#chapel" className="text-sm font-sans font-medium text-[#D4AF37] hover:underline underline-offset-4">
            The Chapel
          </a>
          <a href="#node-stats" className="text-sm font-sans font-medium text-[#D4AF37] hover:underline underline-offset-4">
            Home Altar Node
          </a>
        </nav>
      </div>

      {/* Main Container / Sections Stack */}
      <div className="space-y-8">
        {/* Section 1: Welcome & A Personal Journey */}
        <div id="journey" className={`p-8 sm:p-10 rounded-2xl border space-y-6 shadow-sm scroll-mt-40 sm:scroll-mt-36 ${
          isDark
            ? 'bg-[#1b1916] border-[#332e27] text-[#ece4d6]'
            : 'bg-[#faf6ee] border-[#ebdcc8] text-[#2d2922]'
        }`}>
          <div className="flex items-center space-x-3 border-b pb-4 border-stone-500/20">
            <FlameVisual size="sm" isLit={true} />
            <h2 className="font-heading text-2xl font-bold">
              A Journey Back to Faith
            </h2>
          </div>

          <div className="font-sans text-base sm:text-lg leading-relaxed space-y-4">
            <p className="font-semibold text-lg text-[#d4af37]">
              Hello, and welcome.
            </p>
            <p>
              My name is <strong>Paul</strong>. I am {paulAge} years old, happily married with two beautiful girls, and live in <strong>Inverclyde, Scotland</strong>.
            </p>
            <p>
              When I was growing up, my gran took me to Mass every Sunday. Those mornings remain some of my most treasured memories, and it was through her quiet faith that my journey with God first began.
            </p>
            <p>
              My church was located right next to my primary school, <strong>Holy Family Primary</strong>, and the two were divided only by a little gate. We'd occasionally walk through the gate and go to church, and I have so many fond memories of those days. The church has since closed, but those memories remain dear to me.
            </p>
            <p>
              Like many people, I lost my way as I grew older. Faith slowly drifted into the background of my life, and for many years I lived without the relationship with God that I once had.
            </p>
            <p className="font-semibold italic text-[#d4af37]">
              By God's grace, that changed.
            </p>
            <p>
              One day, I came across an online discussion by <strong>Charlie Kirk</strong> about faith, and his words made me see things clearly again. Something stirred deep within me, and in that quiet moment, my heart opened back up to God.
            </p>

            <div className="pt-2">
              <p className="font-semibold text-[#d4af37] mb-3">
                The church I grew up going to - Holy Family (now closed)
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  holyFamilyPhoto1,
                  holyFamilyPhoto2,
                  holyFamilyPhoto3,
                  holyFamilyPhoto4,
                ].map((src, i) => (
                  <figure
                    key={src}
                    className={`overflow-hidden rounded-xl border shadow-sm ${
                      isDark ? 'border-[#2d2822]' : 'border-[#e4d3b8]'
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => setLightbox(src)}
                      title="Open full size"
                      className="block w-full cursor-zoom-in focus:outline-none"
                    >
                      <img
                        src={src}
                        alt={`Holy Family Church photo ${i + 1}`}
                        loading="lazy"
                        className="w-full h-44 sm:h-56 object-cover hover:scale-105 transition-transform duration-300"
                      />
                    </button>
                    <figcaption className="px-3 py-2 text-xs text-center font-sans text-stone-500 dark:text-stone-400">
                      Holy Family Church
                    </figcaption>
                  </figure>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: Wonder of Creation */}
        <div id="creation" className={`p-8 sm:p-10 rounded-2xl border space-y-6 shadow-sm scroll-mt-40 sm:scroll-mt-36 ${
          isDark
            ? 'bg-[#1b1916] border-[#332e27] text-[#ece4d6]'
            : 'bg-[#faf6ee] border-[#ebdcc8] text-[#2d2922]'
        }`}>
          <div className="flex items-center space-x-3 border-b pb-4 border-stone-500/20">
            <Sparkles className="w-5 h-5 text-[#D4AF37]" />
            <h2 className="font-heading text-2xl font-bold">
              The Wonder of Creation
            </h2>
          </div>

          <div className="font-sans text-base sm:text-lg leading-relaxed space-y-4">
            <p>
              As my faith grew, I began to see the world with fresh eyes. The changing seasons, the warmth of the sun, the movement of the clouds, the complexity of the human body, the beauty of animals, and the vastness of the cosmos filled me with deep wonder.
            </p>
            <p>
              Looking at creation, I could not believe it was all the result of random chance. To me, it speaks of divine purpose, order, and the hand of a loving God. Every part of creation points my heart back to Him.
            </p>
          </div>
        </div>

        {/* Section 3: The Micro-Chapel Mission */}
        <div id="chapel" className={`p-8 sm:p-10 rounded-2xl border space-y-6 shadow-sm scroll-mt-40 sm:scroll-mt-36 ${
          isDark
            ? 'bg-[#1b1916] border-[#332e27] text-[#ece4d6]'
            : 'bg-[#faf6ee] border-[#ebdcc8] text-[#2d2922]'
        }`}>
          <div className="flex items-center space-x-3 border-b pb-4 border-stone-500/20">
            <ChapelCross size={20} />
            <h2 className="font-heading text-2xl font-bold">
              Hosted on a Raspberry Pi Zero 2 W on My Home Altar
            </h2>
          </div>

          <div className="font-sans text-base sm:text-lg leading-relaxed space-y-4">
            <div className={`float-left mr-6 mb-3 p-3 rounded-2xl border shadow-inner max-w-[220px] ${
              isDark ? 'bg-[#12110e] border-[#2d2822]' : 'bg-[#f4ebd9] border-[#e4d3b8]'
            }`}>
              <img
                src="https://assets.raspberrypi.com/static/51035ec4c2f8f630b3d26c32e90c93f1/6e7df/zero2-hero.png"
                alt="Raspberry Pi Zero 2 W"
                referrerPolicy="no-referrer"
                className="w-full h-auto object-contain rounded-lg drop-shadow-md hover:scale-105 transition-transform duration-300"
              />
            </div>

            <p>
              <strong>By His Light</strong> is a quiet digital chapel, lovingly hosted on a tiny <strong>Raspberry Pi Zero 2 W</strong> sitting directly on my personal <strong>home altar in Inverclyde, Scotland</strong>. The entire site - website, candle database, and all - runs from a single <strong>64GB microSD card</strong>, with no cloud servers and no data centres.
            </p>
            <p>
              Whenever a visitor anywhere in the world offers a candle on this website, an electronic relay connected to the Raspberry Pi GPIO pin <strong>lights physical votive candles right on my altar at home</strong>. It is a real-time link of prayer between your heart, this web sanctuary, and our home - offering up a heartfelt blessing for my family and me with every flame.
            </p>

            <div className={`float-right ml-6 mb-3 p-3 rounded-2xl border shadow-inner max-w-[170px] ${
              isDark ? 'bg-[#12110e] border-[#2d2822]' : 'bg-[#f4ebd9] border-[#e4d3b8]'
            }`}>
              <img
                src="/images/microsd-64gb.jpg"
                alt="64GB microSD card"
                className="w-full h-auto object-contain rounded-lg drop-shadow-md hover:scale-105 transition-transform duration-300"
              />
              <p className="text-xs text-center mt-2 text-stone-500 dark:text-stone-400 font-sans">
                The whole chapel lives on this 64GB microSD card
              </p>
            </div>

            <p>
              Here you will find no advertisements, no tracking, no algorithms, and no distractions - only Scripture, prayer, and a quiet place to spend time with Christ.
            </p>
            <p>
              Whether you are Catholic, from another Christian tradition, returning to faith after many years, or simply searching for God, you are always welcome here.
            </p>
            <div className="clear-both pt-4 border-t border-stone-400/20 font-serif space-y-1">
              <p className="italic text-base sm:text-lg">Peace be with you.</p>
              <p className="font-semibold text-lg text-[#d4af37]">- Paul</p>
            </div>
          </div>
        </div>

        {/* Home Altar telemetry */}
        {healthData && (
          <div id="node-stats" className={`p-6 sm:p-8 rounded-2xl border font-sans space-y-5 transition-all shadow-sm scroll-mt-40 sm:scroll-mt-36 ${
            isDark ? 'bg-[#1b1916] border-[#332e27] text-[#ece4d6]' : 'bg-[#faf6ee] border-[#ebdcc8] text-[#1A2A40]'
          }`}>
            <div className="flex flex-wrap items-center justify-between gap-2 border-b pb-3 border-stone-400/20">
              <div className="flex items-center space-x-2 text-[#D4AF37] uppercase tracking-wider text-sm font-bold">
                <Server className="w-4.5 h-4.5 text-[#D4AF37]" />
                <span>Home Altar Node • Scotland</span>
              </div>
              <div className="flex items-center space-x-1.5 text-xs text-[#c5a059] font-medium">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span>Online</span>
              </div>
            </div>

            <p className="font-sans text-base sm:text-lg leading-relaxed text-stone-600 dark:text-stone-300">
              Curious how this chapel is built? Here's a live look at the Pi.
            </p>

            <div className="rounded-xl border border-[#2d2822] bg-[#0f0e0c] overflow-hidden shadow-inner">
              <div className="flex items-center gap-1.5 px-4 py-2.5 border-b border-[#2d2822] bg-[#16140f]">
                <span className="w-3 h-3 rounded-full bg-[#f25f5c]/80" />
                <span className="w-3 h-3 rounded-full bg-[#f7c948]/80" />
                <span className="w-3 h-3 rounded-full bg-[#3aa76d]/80" />
                <span className="ml-2 font-mono text-xs text-[#8a8477]">
                  paul@byhislight - ssh pi@byhislight.faith
                </span>
              </div>
              <div className="px-5 py-4 font-mono text-sm leading-relaxed overflow-x-auto">
                <p className="text-[#8a8477]">
                  <span className="text-[#3aa76d]">paul@byhislight</span>
                  <span>:</span>
                  <span className="text-[#D4AF37]">~</span>
                  <span>$</span>
                  <span className="text-[#D4AF37] font-semibold"> neofetch</span>
                </p>
                <div className="mt-3 space-y-1.5">
                  {[
                    { key: 'Hardware', value: piStatus?.device ?? healthData.system },
                    { key: 'Architecture', value: 'ARM64' },
                    { key: 'Kernel', value: 'Linux 6.12' },
                    { key: 'Location', value: healthData.location },
                    { key: 'Frontend', value: 'React 19 + TypeScript' },
                    { key: 'Backend', value: 'Node.js + Express' },
                    { key: 'Build', value: 'Vite + esbuild' },
                    { key: 'Storage', value: 'JSON (no SQL)' },
                    { key: 'Deployment', value: 'GitHub → systemd' },
                    { key: 'Serving Since', value: '1 August 2026' },
                    { key: 'Uptime', value: formatUptimeWords(piStatus?.uptimeSeconds ?? healthData.uptimeSeconds) },
                    ...(piStatus && piStatus.cpuTempC !== null ? [{ key: 'CPU Temp', value: `${piStatus.cpuTempC.toFixed(1)}°C` }] : []),
                    ...(piStatus && piStatus.cpuLoadPercent !== null ? [{ key: 'CPU Load', value: `${piStatus.cpuLoadPercent}%` }] : []),
                    ...(piStatus && piStatus.memoryUsedPercent !== null ? [{ key: 'Memory', value: `${piStatus.memoryUsedPercent}%` }] : []),
                    ...(piStatus && piStatus.diskUsedPercent !== null ? [{ key: 'Disk', value: `${piStatus.diskUsedPercent}%` }] : []),
                    ...(piStatus && piStatus.relayStatus ? [{ key: 'Relay', value: piStatus.relayStatus.pin.replace(/\s/g, '') }] : []),
                    { key: 'Last Updated', value: lastUpdated },
                  ].map(row => (
                    <p key={row.key} className="whitespace-pre">
                      <span className="text-[#8a8477]">{row.key.padEnd(15, '.')}</span>
                      <span className="text-[#D4AF37] font-medium">{row.value}</span>
                    </p>
                  ))}
                </div>
              </div>
            </div>

            <p className="flex items-center justify-center gap-1.5 text-sm font-sans text-stone-500 dark:text-stone-300">
              🕯️ This altar has been quietly serving visitors for {formatUptimeWords(piStatus?.uptimeSeconds ?? healthData.uptimeSeconds)}.
            </p>

            <div className="flex flex-wrap justify-between items-center text-xs text-stone-500 dark:text-stone-400 border-t pt-3 border-stone-400/20 font-sans gap-2">
              <span>byhislight.faith</span>
              <div className="flex items-center space-x-3">
                <span>Local Time: {scotlandTime}</span>
                <span className="text-[#D4AF37] font-semibold">{healthData.attribution}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {lightbox && (
        <div
          className="fixed inset-0 z-50 bg-black/85 flex items-center justify-center p-4 cursor-zoom-out animate-fade-in"
          onClick={() => setLightbox(null)}
        >
          <img
            src={lightbox}
            alt="Holy Family Church full view"
            className="max-h-[90vh] max-w-full object-contain rounded-lg shadow-2xl"
          />
        </div>
      )}
    </div>
  );
};
