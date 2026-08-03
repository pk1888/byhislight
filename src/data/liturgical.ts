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

export function getCurrentLiturgicalSeason(date: Date = new Date()): LiturgicalSeasonDetails {
  const month = date.getMonth(); // 0-11
  const day = date.getDate();

  // Advent (Late Nov - Dec 24)
  if ((month === 10 && day >= 27) || (month === 11 && day <= 24)) {
    return LITURGICAL_SEASONS_DATA.Advent;
  }
  // Christmas (Dec 25 - Jan 12)
  if ((month === 11 && day >= 25) || (month === 0 && day <= 12)) {
    return LITURGICAL_SEASONS_DATA.Christmas;
  }
  // Lent / Holy Week (Late Feb - Mid April ~ approx)
  if ((month === 2 && day >= 1) || (month === 3 && day <= 15)) {
    if (month === 3 && day >= 10 && day <= 16) {
      return LITURGICAL_SEASONS_DATA.HolyWeek;
    }
    return LITURGICAL_SEASONS_DATA.Lent;
  }
  // Easter (Mid April - May)
  if ((month === 3 && day > 15) || (month === 4)) {
    return LITURGICAL_SEASONS_DATA.Easter;
  }

  // Default Ordinary Time
  return LITURGICAL_SEASONS_DATA.OrdinaryTime;
}
