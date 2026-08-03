import { Saint } from '../types';

const SAINTS_COLLECTION: Saint[] = [
  {
    id: 'st-francis',
    name: 'Saint Francis of Assisi',
    title: 'Founder of the Franciscan Order',
    feastDay: 'October 4',
    month: 10,
    day: 4,
    century: '12th-13th Century',
    patronage: 'Animals, Ecology, Merchants, Peace',
    quote: 'Lord, make me an instrument of your peace. Where there is hatred, let me sow love.',
    bio: 'Born in Assisi, Italy, Francis abandoned his wealth and inheritance to live in radical poverty, rebuilding broken churches and preaching God\'s peace to all creation. He received the stigmata and taught profound humility and joy in Christ.',
    prayer: 'Lord, make me an instrument of Your peace. Where there is hatred, let me sow love; where there is injury, pardon; where there is doubt, faith; where there is despair, hope; where there is darkness, light; and where there is sadness, joy. Amen.'
  },
  {
    id: 'st-therese',
    name: 'Saint Thérèse of Lisieux',
    title: 'The Little Flower & Doctor of the Church',
    feastDay: 'October 1',
    month: 10,
    day: 1,
    century: '19th Century',
    patronage: 'Florists, Missions, Aviators, Loss of Parents',
    quote: 'What matters in life is not great deeds, but great love.',
    bio: 'Entering the Discalced Carmelite convent at age 15, Thérèse developed "The Little Way" - seeking holiness in small, quiet, daily acts of love performed for God. She promised to spend her heaven doing good upon earth.',
    prayer: 'St. Thérèse, Little Flower of Jesus, help me to walk your Little Way of trust and love. Teach me to accept small daily crosses with a peaceful heart and to offer every moment to God. Amen.'
  },
  {
    id: 'st-joseph',
    name: 'Saint Joseph',
    title: 'Foster Father of Jesus & Spouse of Mary',
    feastDay: 'March 19',
    month: 3,
    day: 19,
    century: '1st Century',
    patronage: 'Universal Church, Workers, Fathers, Happy Death',
    quote: 'He was a just man, silent and faithful.',
    bio: 'Saint Joseph protected the Holy Family through silent obedience, hard work as a carpenter, and deep trust in God\'s promises. Though no words of his are recorded in Scripture, his silent holiness radiates through history.',
    prayer: 'O Saint Joseph, whose protection is so great, so strong, so prompt before the Throne of God, I place in you all my interests and desires. Obtain for me from your Divine Foster Son all spiritual blessings through Jesus Christ, Our Lord. Amen.'
  },
  {
    id: 'st-benedict',
    name: 'Saint Benedict of Nursia',
    title: 'Father of Western Monasticism',
    feastDay: 'July 11',
    month: 7,
    day: 11,
    century: '5th-6th Century',
    patronage: 'Europe, Monks, Students, Protection from Evil',
    quote: 'Ora et Labora - Pray and Work.',
    bio: 'Benedict founded the monastery at Monte Cassino and authored the famous Rule of Saint Benedict, emphasizing a balanced rhythm of prayer, work, study, and quiet hospitality that shaped Western civilization.',
    prayer: 'Holy Father Benedict, help us to keep our hearts focused on Christ above all things. Grant us peace in our daily labor, balance in our prayers, and protection from all spiritual harm. Amen.'
  },
  {
    id: 'st-anthony',
    name: 'Saint Anthony of Padua',
    title: 'Doctor of the Church & Finder of Lost Things',
    feastDay: 'June 13',
    month: 6,
    day: 13,
    century: '13th Century',
    patronage: 'Lost Things, The Poor, Travellers, Sailors',
    quote: 'Actions speak louder than words; let your words teach and your actions speak.',
    bio: 'A Portuguese Franciscan priest renowned for his gift of preaching, deep knowledge of Scripture, and profound love for the poor. Millions invoke his aid when seeking lost items or lost peace of soul.',
    prayer: 'St. Anthony, glorious servant of God, help me to restore what is lost in my life - whether it be faith, peace, hope, or patience. Guide me back to Christ, who is the Way, the Truth, and the Life. Amen.'
  },
  {
    id: 'st-jude',
    name: 'Saint Jude Thaddeus',
    title: 'Apostle & Patron of Desperate Cases',
    feastDay: 'October 28',
    month: 10,
    day: 28,
    century: '1st Century',
    patronage: 'Impossible Causes, Desperate Situations, Hospitals',
    quote: 'Contend earnestly for the faith which was once delivered unto the saints.',
    bio: 'One of the Twelve Apostles and author of the Epistle of Jude. He travelled widely preaching the Gospel and laying down his life for Christ. He is venerated worldwide as a patron in times of extremity.',
    prayer: 'Most holy Apostle St. Jude, faithful servant and friend of Jesus, come to my assistance in this time of trial. Bring comfort where there is despair, and help me to place my trust unreservedly in God. Amen.'
  },
  {
    id: 'st-teresa-avila',
    name: 'Saint Teresa of Ávila',
    title: 'Doctor of the Church & Carmelite Reformer',
    feastDay: 'October 15',
    month: 10,
    day: 15,
    century: '16th Century',
    patronage: 'Headaches, Spanish Writers, Interior Life',
    quote: 'Let nothing disturb you, let nothing frighten you. All things are passing; God never changes.',
    bio: 'Spanish Carmelite nun, mystic, and author of spiritual classics like The Interior Castle. She reformed the Carmelite Order, urging nuns back to a life of quiet prayer, simplicity, and mental recollection.',
    prayer: 'Let nothing disturb thee, let nothing affright thee. All things are passing; God never changeth. Patient endurance attaineth to all things; who God possesseth in nothing is wanting; alone God sufficeth. Amen.'
  },
  {
    id: 'st-patrick',
    name: 'Saint Patrick',
    title: 'Apostle of Ireland',
    feastDay: 'March 17',
    month: 3,
    day: 17,
    century: '5th Century',
    patronage: 'Ireland, Engineers, Protection',
    quote: 'Christ with me, Christ before me, Christ behind me.',
    bio: 'Kidnapped as a youth into Irish slavery, Patrick turned to prayer in captivity. After escaping, he returned to Ireland as a bishop to preach Christ, converting the nation through humility, grace, and teaching.',
    prayer: 'Christ with me, Christ before me, Christ behind me, Christ in me, Christ beneath me, Christ above me, Christ on my right, Christ on my left, Christ when I lie down, Christ when I sit down, Christ when I arise. Amen.'
  },
  {
    id: 'st-thomas-aquinas',
    name: 'Saint Thomas Aquinas',
    title: 'Angelic Doctor of the Church',
    feastDay: 'January 28',
    month: 1,
    day: 28,
    century: '13th Century',
    patronage: 'Students, Academics, Theologians, Schools',
    quote: 'To one who has faith, no explanation is necessary. To one without faith, no explanation is possible.',
    bio: 'Dominican friar whose Summa Theologiae remains a pillar of Christian philosophy and theology. Despite his immense intellect, he considered all his writings like straw compared to the beauty of God revealed in prayer.',
    prayer: 'Creator of all things, true source of light and wisdom, grant me clarity of mind, strength of memory, and humility of heart to seek and love Your truth above all else. Amen.'
  },
  {
    id: 'st-augustine',
    name: 'Saint Augustine of Hippo',
    title: 'Doctor of Grace',
    feastDay: 'August 28',
    month: 8,
    day: 28,
    century: '4th-5th Century',
    patronage: 'Brewers, Printers, Theologians, Seeking Souls',
    quote: 'You have made us for Yourself, O Lord, and our heart is restless until it rests in You.',
    bio: 'After years of wandering in intellectual and moral confusion, Augustine was converted through the prayers of his mother Saint Monica and the study of Scripture. He became Bishop of Hippo and a master of Christian thought.',
    prayer: 'O Eternal Truth, True Love, and Beloved Eternity! You are my God, to You do I sigh night and day. Calm my restless heart and anchor my soul in Your eternal peace. Amen.'
  }
];

export function getDailySaint(date: Date = new Date()): Saint {
  const month = date.getMonth() + 1;
  const day = date.getDate();
  
  // Try exact match
  const match = SAINTS_COLLECTION.find(s => s.month === month && s.day === day);
  if (match) return match;

  // Otherwise cycle deterministically based on day of year
  const start = new Date(date.getFullYear(), 0, 0);
  const diff = date.getTime() - start.getTime();
  const oneDay = 1000 * 60 * 60 * 24;
  const dayOfYear = Math.floor(diff / oneDay);
  
  return SAINTS_COLLECTION[dayOfYear % SAINTS_COLLECTION.length];
}
