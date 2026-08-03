export type LiturgicalSeason = 
  | 'Advent' 
  | 'Christmas' 
  | 'Lent' 
  | 'HolyWeek' 
  | 'Easter' 
  | 'OrdinaryTime';

export interface LiturgicalColorInfo {
  name: string;
  hex: string;
  bgClass: string;
  textClass: string;
  borderClass: string;
}

export interface ScriptureItem {
  id: string;
  reference: string;
  text: string;
  translation: string;
  reflection?: string;
  category?: 'peace' | 'hope' | 'trust' | 'comfort' | 'praise' | 'grace';
}

export interface DailyBlessing {
  id: string;
  text: string;
  scriptureRef: string;
  traditionNote?: string;
}

export interface GospelReading {
  date: string; // YYYY-MM-DD
  reference: string;
  title: string;
  reading: string;
  reflection: string;
  liturgicalColor: string;
  liturgicalSeason: LiturgicalSeason;
}

export interface CatholicPrayer {
  id: string;
  title: string;
  latinTitle?: string;
  text: string;
  latinText?: string;
  category: 'core' | 'marian' | 'morning_evening' | 'protection' | 'meals' | 'intention';
  traditionalTime?: string;
  explanation: string;
}

export type RosaryMysteryType = 'joyful' | 'sorrowful' | 'glorious' | 'luminous';

export interface RosaryMysteryDecade {
  decadeNumber: number;
  title: string;
  scriptureRef: string;
  scriptureText: string;
  meditation: string;
}

export interface Saint {
  id: string;
  name: string;
  title: string;
  feastDay: string; // e.g., "October 4"
  month: number;   // 1-12
  day: number;     // 1-31
  patronage: string;
  bio: string;
  prayer: string;
  quote?: string;
  century?: string;
}

export interface DailyReflection {
  id: string;
  date: string;
  title: string;
  scriptureRef: string;
  scriptureText: string;
  reflectionText: string; // 50-75 words
  prayer: string; // one sentence
}

export interface AppSettings {
  theme: 'parchment' | 'candlelight' | 'stone'; // Light, Dark/Candlelight, Stone
  fontSize: 'normal' | 'large';
  reducedMotion: boolean;
  quietBell: boolean;
}
