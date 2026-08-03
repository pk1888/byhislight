interface Commandment {
  number: number;
  roman: string;
  title: string;
  shortText: string;
  scriptureRef: string;
  biblicalText: string;
  catechismSummary: string;
  meditation: string;
  reflectionQuestion: string;
}

export const TEN_COMMANDMENTS: Commandment[] = [
  {
    number: 1,
    roman: 'I',
    title: 'First Commandment',
    shortText: 'I am the Lord your God: you shall not have strange gods before me.',
    scriptureRef: 'Exodus 20:2-3',
    biblicalText: 'I am the LORD your God, who brought you out of the land of Egypt, out of the house of slavery. You shall have no other gods before me.',
    catechismSummary: 'Call to faith, hope, and charity in God alone, trusting His wisdom above all worldly idols and human pride.',
    meditation: 'Place God at the very center of your day. Surrender your worries, ambitions, and fears into His loving care.',
    reflectionQuestion: 'Is there anything in my life - wealth, approval, fear, or self-reliance - that I am placing above my trust in God?'
  },
  {
    number: 2,
    roman: 'II',
    title: 'Second Commandment',
    shortText: 'You shall not take the name of the Lord your God in vain.',
    scriptureRef: 'Exodus 20:7',
    biblicalText: 'You shall not take the name of the LORD your God in vain, for the LORD will not hold him guiltless who takes his name in vain.',
    catechismSummary: 'Reverence for God\'s holy name, keeping oaths faithfully, and speaking of divine things with quiet awe and respect.',
    meditation: 'Speak the name of Jesus with gentle love. Let your speech bring grace, peace, and blessing to all who hear.',
    reflectionQuestion: 'Do I treat the holy name of God and sacred things with quiet respect and honor in my daily conversations?'
  },
  {
    number: 3,
    roman: 'III',
    title: 'Third Commandment',
    shortText: 'Remember to keep holy the Lord\'s Day.',
    scriptureRef: 'Exodus 20:8',
    biblicalText: 'Remember the Sabbath day, to keep it holy. Six days you shall labor, and do all your work, but the seventh day is a Sabbath to the LORD your God.',
    catechismSummary: 'Worship of God on Sunday, rest from unnecessary labor, and dedication of time to family, prayer, and charity.',
    meditation: 'Rest in the quiet presence of Christ. Allow Sunday to be a sanctuary of renewal for your soul and your family.',
    reflectionQuestion: 'Do I protect the Lord\'s Day as a true sanctuary of prayer, family peace, and spiritual rest?'
  },
  {
    number: 4,
    roman: 'IV',
    title: 'Fourth Commandment',
    shortText: 'Honor your father and your mother.',
    scriptureRef: 'Exodus 20:12',
    biblicalText: 'Honor your father and your mother, that your days may be long in the land that the LORD your God is giving you.',
    catechismSummary: 'Love, respect, and gratitude toward parents, family, elders, and legitimate authority in society.',
    meditation: 'Cultivate gratitude for those who nurtured you. Seek reconciliation, patience, and kindness within your family.',
    reflectionQuestion: 'How can I show greater love, patience, and honor to my parents, elders, and family members today?'
  },
  {
    number: 5,
    roman: 'V',
    title: 'Fifth Commandment',
    shortText: 'You shall not kill.',
    scriptureRef: 'Exodus 20:13',
    biblicalText: 'You shall not murder.',
    catechismSummary: 'Sacredness of human life from conception to natural death; avoiding anger, hatred, envy, self-harm, and violence.',
    meditation: 'Guarding life means nurturing peace in your heart. Let go of grudges and let Christ\'s mercy heal old wounds.',
    reflectionQuestion: 'Am I harboring anger, resentment, or harsh words toward anyone that I can surrender to Christ\'s mercy?'
  },
  {
    number: 6,
    roman: 'VI',
    title: 'Sixth Commandment',
    shortText: 'You shall not commit adultery.',
    scriptureRef: 'Exodus 20:14',
    biblicalText: 'You shall not commit adultery.',
    catechismSummary: 'Chastity, purity of heart, fidelity in marriage, and respect for the dignity of human love.',
    meditation: 'Purity of heart brings clear vision to see God. Guard your mind and eyes with modesty and noble affection.',
    reflectionQuestion: 'Do I strive for purity of intention, speech, and sight in all my personal relationships?'
  },
  {
    number: 7,
    roman: 'VII',
    title: 'Seventh Commandment',
    shortText: 'You shall not steal.',
    scriptureRef: 'Exodus 20:15',
    biblicalText: 'You shall not steal.',
    catechismSummary: 'Honesty, respect for others\' property, fair labor, stewardship of creation, and generosity toward the poor.',
    meditation: 'True wealth is a peaceful conscience before God. Practice quiet generosity and contentment with what you have.',
    reflectionQuestion: 'Am I completely honest in my work and dealings, and open-handed toward those in need?'
  },
  {
    number: 8,
    roman: 'VIII',
    title: 'Eighth Commandment',
    shortText: 'You shall not bear false witness against your neighbor.',
    scriptureRef: 'Exodus 20:16',
    biblicalText: 'You shall not bear false witness against your neighbor.',
    catechismSummary: 'Truthfulness in speech, avoiding gossip, slander, lying, and rash judgment of others\' motives.',
    meditation: 'Walk in the light of truth. Let your speech build up, encourage, and defend the good name of others.',
    reflectionQuestion: 'Do I guard against gossip, rash judgments, and uncharitable speech about others?'
  },
  {
    number: 9,
    roman: 'IX',
    title: 'Ninth Commandment',
    shortText: 'You shall not covet your neighbor\'s wife.',
    scriptureRef: 'Deuteronomy 5:21',
    biblicalText: 'Neither shall you covet your neighbor\'s wife.',
    catechismSummary: 'Purity of thought and desire, guarding the heart against lust and unchaste fantasies.',
    meditation: 'Ask the Holy Spirit to clean the inner room of your heart, replacing selfish desire with holy love.',
    reflectionQuestion: 'Do I pray for a clean heart and turn away quickly from unchaste or envy-filled thoughts?'
  },
  {
    number: 10,
    roman: 'X',
    title: 'Tenth Commandment',
    shortText: 'You shall not covet your neighbor\'s goods.',
    scriptureRef: 'Exodus 20:17',
    biblicalText: 'You shall not covet your neighbor\'s house, field, or anything that belongs to your neighbor.',
    catechismSummary: 'Detachment from material riches, freedom from envy, and joy in God\'s spiritual gifts to others.',
    meditation: 'Rejoice sincerely when others are blessed. God\'s grace toward you is abundant, unique, and complete.',
    reflectionQuestion: 'Can I truly rejoice in the blessings and success of others without envy or comparison?'
  }
];
