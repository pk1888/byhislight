import { LiturgicalColorInfo, LiturgicalSeason } from '../types';

interface LiturgicalSeasonDetails {
  season: LiturgicalSeason;
  name: string;
  latinName: string;
  colorInfo: LiturgicalColorInfo;
  description: string;
  scriptureRef: string;
  scriptureText: string;
  spiritualFocus: string;
}

const LITURGICAL_COLORS: Record<string, LiturgicalColorInfo> = {
  purple: {
    name: 'Violet',
    hex: '#5c3a70',
    bgClass: 'bg-purple-950/40 text-purple-200 border-purple-800/40',
    textClass: 'text-purple-300',
    borderClass: 'border-purple-800/40'
  },
  gold: {
    name: 'White & Gold',
    hex: '#c5a059',
    bgClass: 'bg-amber-950/30 text-amber-100 border-amber-700/40',
    textClass: 'text-amber-300',
    borderClass: 'border-amber-700/40'
  },
  green: {
    name: 'Green',
    hex: '#273b30',
    bgClass: 'bg-emerald-950/40 text-emerald-100 border-emerald-800/40',
    textClass: 'text-emerald-300',
    borderClass: 'border-emerald-800/40'
  },
  red: {
    name: 'Red',
    hex: '#6b2d35',
    bgClass: 'bg-rose-950/40 text-rose-100 border-rose-900/40',
    textClass: 'text-rose-300',
    borderClass: 'border-rose-900/40'
  },
  rose: {
    name: 'Rose',
    hex: '#8c5060',
    bgClass: 'bg-pink-950/40 text-pink-100 border-pink-800/40',
    textClass: 'text-pink-300',
    borderClass: 'border-pink-800/40'
  }
};

export const LITURGICAL_SEASONS_DATA: Record<LiturgicalSeason, LiturgicalSeasonDetails> = {
  Advent: {
    season: 'Advent',
    name: 'Season of Advent',
    latinName: 'Tempus Adventus',
    colorInfo: LITURGICAL_COLORS.purple,
    description: 'A season of quiet anticipation, prayerful preparation, and joyful hope as we await the incarnation of Our Saviour and His return in glory.',
    scriptureRef: 'Isaiah 9:2',
    scriptureText: 'The people that walked in darkness have seen a great light: to them that dwelt in the region of the shadow of death, light is risen.',
    spiritualFocus: 'Vigilance, repentance, silent waiting, and preparing a dwelling place for Christ in our hearts.'
  },
  Christmas: {
    season: 'Christmas',
    name: 'Christmas Time',
    latinName: 'Tempus Nativitatis',
    colorInfo: LITURGICAL_COLORS.gold,
    description: 'Celebrating the mystery of the Incarnation - God taking on human flesh to dwell among us in humility and endless love.',
    scriptureRef: 'Luke 2:10-11',
    scriptureText: 'Behold, I bring you good tidings of great joy... For, this day, is born to you a Saviour, who is Christ the Lord, in the city of David.',
    spiritualFocus: 'Gratitude for the Incarnation, wonder, family devotion, and reflecting the light of Christ.'
  },
  Lent: {
    season: 'Lent',
    name: 'Season of Lent',
    latinName: 'Quadragesima',
    colorInfo: LITURGICAL_COLORS.purple,
    description: 'A forty-day period of prayer, fasting, and almsgiving in union with Christ\'s forty days in the desert, preparing for Holy Week and Easter.',
    scriptureRef: 'Joel 2:12-13',
    scriptureText: 'Be converted to me with all your heart, in fasting, and in weeping, and in mourning. And rend your hearts, and not your garments.',
    spiritualFocus: 'Interior conversion, humble self-denial, acts of mercy, and meditative prayer.'
  },
  HolyWeek: {
    season: 'HolyWeek',
    name: 'Holy Week & Paschal Triduum',
    latinName: 'Hebdomada Sancta',
    colorInfo: LITURGICAL_COLORS.red,
    description: 'The most sacred week of the Christian year, walking step by step with Jesus through His Last Supper, Passion, Crucifixion, and Burial.',
    scriptureRef: 'Philippians 2:8',
    scriptureText: 'He humbled Himself, becoming obedient unto death, even to the death of the cross.',
    spiritualFocus: 'Contemplating Christ\'s boundless sacrifice, silence, reverence, and gratitude for redemption.'
  },
  Easter: {
    season: 'Easter',
    name: 'Eastertide',
    latinName: 'Tempus Paschale',
    colorInfo: LITURGICAL_COLORS.gold,
    description: 'Fifty days of unbridled joy celebrating Christ\'s triumph over sin and death, culminating in the Solemnity of Pentecost.',
    scriptureRef: '1 Corinthians 15:54-55',
    scriptureText: 'Death is swallowed up in victory. O death, where is thy victory? O death, where is thy sting?',
    spiritualFocus: 'Paschal joy, living as resurrected people, confidence in eternal life, and walking in the Holy Spirit.'
  },
  OrdinaryTime: {
    season: 'OrdinaryTime',
    name: 'Ordinary Time',
    latinName: 'Tempus per Annum',
    colorInfo: LITURGICAL_COLORS.green,
    description: 'The steady, faithful rhythm of daily discipleship, focusing on the public ministry, parables, and miracles of Our Lord.',
    scriptureRef: 'Psalm 119:105',
    scriptureText: 'Thy word is a lamp to my feet, and a light to my paths.',
    spiritualFocus: 'Fidelity in routine duties, growth in virtue, daily prayer, and quiet witness in everyday life.'
  }
};

const DAY = 24 * 60 * 60 * 1000;

// DST-safe day arithmetic: JS normalises overflow/underflow in the Date
// constructor against the local calendar, so wall-clock midnight stays put.
function addDays(d: Date, n: number): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate() + n);
}

function startOfDay(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

function nextSundayOnOrAfter(d: Date): Date {
  const result = startOfDay(d);
  while (result.getDay() !== 0) {
    result.setDate(result.getDate() + 1);
  }
  return result;
}

// Gregorian Easter computus (Meeus/Jones/Butcher algorithm)
export function getEasterSunday(year: number): Date {
  const a = year % 19;
  const b = Math.floor(year / 100);
  const c = year % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const month = Math.floor((h + l - 7 * m + 114) / 31) - 1;
  const day = ((h + l - 7 * m + 114) % 31) + 1;
  return startOfDay(new Date(year, month, day));
}

// First Sunday of Advent: the Sunday on or after 27 November
function getAdventSunday(year: number): Date {
  return nextSundayOnOrAfter(new Date(year, 10, 27));
}

// Baptism of the Lord: the Sunday after the Epiphany (6 January)
function getBaptismSunday(year: number): Date {
  const jan6 = startOfDay(new Date(year, 0, 6));
  const baptism = nextSundayOnOrAfter(jan6);
  return baptism.getDate() === jan6.getDate() ? addDays(baptism, 7) : baptism;
}

export interface SeasonPeriod {
  season: LiturgicalSeason;
  start: Date;
  end: Date;
}

export interface LiturgicalCalendar {
  currentSeason: LiturgicalSeason;
  currentPeriod: SeasonPeriod;
  nextSeason: { season: LiturgicalSeason; start: Date };
}

interface LiturgicalYear {
  adventStart: Date;
  christmasStart: Date;
  christmasEnd: Date;
  ot1Start: Date;
  ashWednesday: Date;
  palmSunday: Date;
  easter: Date;
  easterEnd: Date;
  ot2Start: Date;
  adventNext: Date;
}

// Build the liturgical year that opens with Advent in `lyYear`.
function buildLiturgicalYear(lyYear: number): LiturgicalYear {
  const adventStart = getAdventSunday(lyYear);
  const christmasStart = startOfDay(new Date(lyYear, 11, 25));
  const christmasEnd = getBaptismSunday(lyYear + 1);
  const easter = getEasterSunday(lyYear + 1);
  const ashWednesday = addDays(easter, -46);
  const palmSunday = addDays(easter, -7);
  const ot2Start = addDays(easter, 50);
  const adventNext = getAdventSunday(lyYear + 1);

  return {
    adventStart,
    christmasStart,
    christmasEnd,
    ot1Start: addDays(christmasEnd, 1),
    ashWednesday,
    palmSunday,
    easter,
    easterEnd: addDays(easter, 49),
    ot2Start,
    adventNext,
  };
}

function inRange(d: Date, start: Date, end: Date): boolean {
  return d.getTime() >= start.getTime() && d.getTime() <= end.getTime();
}

function periodForDate(d: Date, ly: LiturgicalYear): SeasonPeriod {
  const ot1End = addDays(ly.ashWednesday, -1);
  const holyWeekEnd = addDays(ly.easter, -1);
  const ot2End = addDays(ly.adventNext, -1);

  if (inRange(d, ly.adventStart, addDays(ly.christmasStart, -1))) {
    return { season: 'Advent', start: ly.adventStart, end: addDays(ly.christmasStart, -1) };
  }
  if (inRange(d, ly.christmasStart, ly.christmasEnd)) {
    return { season: 'Christmas', start: ly.christmasStart, end: ly.christmasEnd };
  }
  if (inRange(d, ly.ot1Start, ot1End)) {
    return { season: 'OrdinaryTime', start: ly.ot1Start, end: ot1End };
  }
  if (inRange(d, ly.ashWednesday, addDays(ly.palmSunday, -1))) {
    return { season: 'Lent', start: ly.ashWednesday, end: addDays(ly.palmSunday, -1) };
  }
  if (inRange(d, ly.palmSunday, holyWeekEnd)) {
    return { season: 'HolyWeek', start: ly.palmSunday, end: holyWeekEnd };
  }
  if (inRange(d, ly.easter, ly.easterEnd)) {
    return { season: 'Easter', start: ly.easter, end: ly.easterEnd };
  }
  return { season: 'OrdinaryTime', start: ly.ot2Start, end: ot2End };
}

export function getLiturgicalCalendar(today: Date = new Date()): LiturgicalCalendar {
  const t = startOfDay(today);
  const lyYear = t.getTime() >= getAdventSunday(t.getFullYear()).getTime()
    ? t.getFullYear()
    : t.getFullYear() - 1;
  const ly = buildLiturgicalYear(lyYear);

  const currentPeriod = periodForDate(t, ly);
  const currentSeason = currentPeriod.season;

  let nextSeason: { season: LiturgicalSeason; start: Date };
  switch (currentSeason) {
    case 'Advent':
      nextSeason = { season: 'Christmas', start: ly.christmasStart };
      break;
    case 'Christmas':
      nextSeason = { season: 'OrdinaryTime', start: ly.ot1Start };
      break;
    case 'OrdinaryTime':
      nextSeason = currentPeriod.start.getTime() === ly.ot2Start.getTime()
        ? { season: 'Advent', start: ly.adventNext }
        : { season: 'Lent', start: ly.ashWednesday };
      break;
    case 'Lent':
      nextSeason = { season: 'HolyWeek', start: ly.palmSunday };
      break;
    case 'HolyWeek':
      nextSeason = { season: 'Easter', start: ly.easter };
      break;
    case 'Easter':
      nextSeason = { season: 'OrdinaryTime', start: ly.ot2Start };
      break;
  }

  return { currentSeason, currentPeriod, nextSeason };
}

export function getCurrentLiturgicalSeason(date: Date = new Date()): LiturgicalSeasonDetails {
  return LITURGICAL_SEASONS_DATA[getLiturgicalCalendar(date).currentSeason];
}
