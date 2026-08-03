import { DailyReflection } from '../types';

const DAILY_REFLECTIONS: DailyReflection[] = [
  {
    id: 'r1',
    date: 'Today',
    title: 'The Light in the Darkness',
    scriptureRef: 'John 1:5',
    scriptureText: 'The light shines in the darkness, and the darkness has not overcome it.',
    reflectionText: 'Even a small candle scatters the deepest shadow. In moments of quiet uncertainty, we do not need to generate our own light or carry heavy answers. We only need to turn toward Him who is the Light. Let His presence gently warm what is cold and guide your next quiet step today.',
    prayer: 'Lord Jesus, let Your quiet light rest upon my heart this day. Amen.'
  },
  {
    id: 'r2',
    date: 'Daily',
    title: 'Resting in His Word',
    scriptureRef: 'Psalm 46:10',
    scriptureText: 'Be still, and know that I am God.',
    reflectionText: 'So much of our day is spent striving, worrying, and holding things together. Yet God does not ask for our restless energy before giving us His peace. He simply asks us to pause, breathe, and remember who He is. In this moment of stillness, hand over what weighs upon you and let Him be God.',
    prayer: 'Father, quiet my mind and help me trust in Your unfailing care. Amen.'
  },
  {
    id: 'r3',
    date: 'Daily',
    title: 'The Gentle Yoke',
    scriptureRef: 'Matthew 11:28-29',
    scriptureText: 'Come to me, all who labor and are heavy laden, and I will give you rest.',
    reflectionText: 'Christ does not wait for us to be strong, perfect, or untroubled before welcoming us. He calls directly to the tired, the weary, and those carrying quiet burdens. You do not need to prove anything here. Simply come as you are, lay down your fatigue, and learn the gentle rhythm of His grace.',
    prayer: 'Jesus, meek and humble of heart, grant my soul Your restful peace. Amen.'
  },
  {
    id: 'r4',
    date: 'Daily',
    title: 'Walking by Light',
    scriptureRef: 'Psalm 119:105',
    scriptureText: 'Your word is a lamp to my feet and a light to my path.',
    reflectionText: 'A lantern on a dark path does not illuminate the entire journey at once; it lights only the single step directly before us. God rarely reveals every tomorrow, but He faithfully provides enough grace for today. Trust the light you have been given for this moment, and walk forward in His peace.',
    prayer: 'Lord, guide my steps today and grant me grace to walk in Your light. Amen.'
  },
  {
    id: 'r5',
    date: 'Daily',
    title: 'Unfailing Mercy',
    scriptureRef: 'Lamentations 3:22-23',
    scriptureText: 'The mercies of the Lord are new every morning; great is your faithfulness.',
    reflectionText: 'Yesterday\'s regrets and tomorrow\'s apprehensions disappear before the dawn of God\'s new morning mercy. Every new sunrise is a holy invitation to begin again, clean and forgiven, wrapped in the eternal fidelity of Christ.',
    prayer: 'Merciful Father, renew my heart today with Your unfailing love. Amen.'
  },
  {
    id: 'r6',
    date: 'Daily',
    title: 'Peace Which Surpasseth Understanding',
    scriptureRef: 'Philippians 4:6-7',
    scriptureText: 'In everything, by prayer and supplication, let your requests be made known to God.',
    reflectionText: 'When anxious thoughts gather, we are invited to transform every worry into a silent prayer. Handing our concerns over to God allows His supernatural peace to garrison our hearts and minds in Christ Jesus.',
    prayer: 'Lord, I place my worries in Your hands and rest in Your holy peace. Amen.'
  },
  {
    id: 'r7',
    date: 'Daily',
    title: 'The Shelter of the Most High',
    scriptureRef: 'Psalm 91:1-2',
    scriptureText: 'He that dwelleth in the aid of the Most High, shall abide under the protection of the God of Jacob.',
    reflectionText: 'No fortress of stone offers the security found in abiding close to the Heart of God. In every trial, His grace forms a quiet sanctuary around the trusting soul.',
    prayer: 'O God, my refuge and fortress, in You alone do I place my trust. Amen.'
  }
];

export function getDailyReflection(date: Date = new Date()): DailyReflection {
  const start = new Date(date.getFullYear(), 0, 0);
  const diff = date.getTime() - start.getTime();
  const oneDay = 1000 * 60 * 60 * 24;
  const dayOfYear = Math.floor(diff / oneDay);

  return DAILY_REFLECTIONS[dayOfYear % DAILY_REFLECTIONS.length];
}


