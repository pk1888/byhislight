export interface AltarCandleOption {
  id: string;
  name: string;
  latinTitle: string;
  subtitle: string;
  devotionFocus: string;
  accentColor: string;
  secondaryColor: string;
  scriptureVerse: string;
  altarChannel: string;
}

export const ALTAR_CANDLES: AltarCandleOption[] = [
  {
    id: 'sacred_heart_jesus',
    name: 'Sacred Heart of Jesus',
    latinTitle: 'Sacratissimum Cor Iesu',
    subtitle: 'Divine Mercy & Unconditional Love',
    devotionFocus: 'Protection, forgiveness, and healing of hearts',
    accentColor: '#D9383A',
    secondaryColor: '#FFD700',
    scriptureVerse: 'Learn from me, for I am gentle and humble in heart. - Matt 11:29',
    altarChannel: 'Altar Channel 1'
  },
  {
    id: 'st_theresa',
    name: 'St. Theresa (St. Thérèse)',
    latinTitle: 'Sancta Teresia a Jesu Infante',
    subtitle: 'The Little Flower of Jesus',
    devotionFocus: 'Simplicity, trust, and spiritual grace',
    accentColor: '#E11D48',
    secondaryColor: '#FEF08A',
    scriptureVerse: 'I will spend my heaven doing good upon earth. - St. Thérèse',
    altarChannel: 'Altar Channel 2'
  },
  {
    id: 'sacred_heart_mary',
    name: 'Sacred Heart of Mary',
    latinTitle: 'Sacratissimum Cor Mariae',
    subtitle: 'Maternal Intercession & Peace',
    devotionFocus: 'Protection of family, peace, and quiet hope',
    accentColor: '#2B59C3',
    secondaryColor: '#F5D061',
    scriptureVerse: 'My soul proclaims the greatness of the Lord. - Luke 1:46',
    altarChannel: 'Altar Channel 3'
  },
  {
    id: 'st_francis',
    name: 'St. Francis of Assisi',
    latinTitle: 'Sanctus Franciscus Assisiensis',
    subtitle: 'Patron of Peace & All Creation',
    devotionFocus: 'Humility, harmony, and divine comfort',
    accentColor: '#8B5CF6',
    secondaryColor: '#FDE047',
    scriptureVerse: 'Lord, make me an instrument of your peace. - St. Francis',
    altarChannel: 'Altar Channel 4'
  },
  {
    id: 'fifth_figure_tbd',
    name: '5th Devotion (To Be Decided)',
    latinTitle: 'Devotio Quinta',
    subtitle: 'Sanctuary Special Intention',
    devotionFocus: 'Reserved for upcoming sacred figure addition',
    accentColor: '#D97706',
    secondaryColor: '#FCD34D',
    scriptureVerse: 'Wait for the Lord; be strong and take heart. - Psalm 27:14',
    altarChannel: 'Altar Channel 5'
  }
];
