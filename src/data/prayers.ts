import { CatholicPrayer } from '../types';

export const CATHOLIC_PRAYERS: CatholicPrayer[] = [
  {
    id: 'our-father',
    title: 'Our Father',
    latinTitle: 'Pater Noster',
    category: 'core',
    traditionalTime: 'Prayed daily, during Mass, the Rosary, and all liturgical hours.',
    explanation: 'Given directly by Christ to His disciples when they asked Him how to pray (Matthew 6:9-13). It is the foundational prayer of all Christian life.',
    text: `Our Father, Who art in heaven, hallowed be Thy name; Thy kingdom come; Thy will be done on earth as it is in heaven. Give us this day our daily bread; and forgive us our trespasses as we forgive those who trespass against us; and lead us not into temptation, but deliver us from evil. Amen.`,
    latinText: `Pater noster, qui es in caelis, sanctificetur nomen tuum. Adveniat regnum tuum. Fiat voluntas tua, sicut in caelo et in terra. Panem nostrum quotidianum da nobis hodie, et dimitte nobis debita nostra sicut et nos dimittimus debitoribus nostris. Et ne nos inducas in tentationem, sed libera nos a malo. Amen.`
  },
  {
    id: 'hail-mary',
    title: 'Hail Mary',
    latinTitle: 'Ave Maria',
    category: 'marian',
    traditionalTime: 'Prayed during the Rosary, the Angelus (dawn, noon, 6 PM), and times of devotion.',
    explanation: 'Combines the words of the Archangel Gabriel at the Annunciation (Luke 1:28) and Saint Elizabeth at the Visitation (Luke 1:42), followed by a humble petition for Mary\'s intercession.',
    text: `Hail Mary, full of grace, the Lord is with thee. Blessed art thou among women, and blessed is the fruit of thy womb, Jesus. Holy Mary, Mother of God, pray for us sinners, now and at the hour of our death. Amen.`,
    latinText: `Ave Maria, gratia plena, Dominus tecum. Benedicta tu in mulieribus, et benedictus fructus ventris tui, Iesus. Sancta Maria, Mater Dei, ora pro nobis peccatoribus, nunc et in hora mortis nostrae. Amen.`
  },
  {
    id: 'glory-be',
    title: 'Glory Be',
    latinTitle: 'Gloria Patri',
    category: 'core',
    traditionalTime: 'Concludes Psalms in the Liturgy of the Hours and decades of the Holy Rosary.',
    explanation: 'An ancient doxology celebrating the Eternal Trinity - Father, Son, and Holy Spirit - existing before time, now, and for all eternity.',
    text: `Glory be to the Father, and to the Son, and to the Holy Spirit, as it was in the beginning, is now, and ever shall be, world without end. Amen.`,
    latinText: `Gloria Patri, et Filio, et Spiritui Sancto. Sicut erat in principio, et nunc, et semper, et in saecula saeculorum. Amen.`
  },
  {
    id: 'apostles-creed',
    title: "Apostles' Creed",
    latinTitle: 'Symbolum Apostolorum',
    category: 'core',
    traditionalTime: 'Prayed at the beginning of the Rosary and during Baptismal promises.',
    explanation: 'An ancient summary of the core beliefs handed down by the Apostles, expressing faith in God the Father, Jesus Christ His only Son, and the Holy Spirit.',
    text: `I believe in God, the Father Almighty, Creator of heaven and earth, and in Jesus Christ, His only Son, our Lord, who was conceived by the Holy Spirit, born of the Virgin Mary, suffered under Pontius Pilate, was crucified, died and was buried; He descended into hell; on the third day He rose again from the dead; He ascended into heaven, and is seated at the right hand of God the Father Almighty; from there He will come to judge the living and the dead.

I believe in the Holy Spirit, the holy catholic Church, the communion of saints, the forgiveness of sins, the resurrection of the body, and life everlasting. Amen.`
  },
  {
    id: 'nicene-creed',
    title: 'Nicene Creed',
    latinTitle: 'Symbolum Nicaenum',
    category: 'core',
    traditionalTime: 'Recited during Sunday Holy Mass and major Solemnities.',
    explanation: 'Formulated at the Councils of Nicaea (325 AD) and Constantinople (381 AD) to clarify and defend the full divinity and humanity of Christ.',
    text: `I believe in one God, the Father almighty, maker of heaven and earth, of all things visible and invisible.

I believe in one Lord Jesus Christ, the Only Begotten Son of God, born of the Father before all ages. God from God, Light from Light, true God from true God, begotten, not made, consubstantial with the Father; through him all things were made. For us men and for our salvation he came down from heaven, and by the Holy Spirit was incarnate of the Virgin Mary, and became man. For our sake he was crucified under Pontius Pilate, he suffered death and was buried, and rose again on the third day in accordance with the Scriptures. He ascended into heaven and is seated at the right hand of the Father. He will come again in glory to judge the living and the dead and his kingdom will have no end.

I believe in the Holy Spirit, the Lord, the giver of life, who proceeds from the Father and the Son, who with the Father and the Son is adored and glorified, who has spoken through the prophets.

I believe in one, holy, catholic and apostolic Church. I confess one Baptism for the forgiveness of sins and I look forward to the resurrection of the dead and the life of the world to come. Amen.`
  },
  {
    id: 'st-michael',
    title: 'Prayer to Saint Michael',
    latinTitle: 'Sancte Michael Archangele',
    category: 'protection',
    traditionalTime: 'Prayed after Mass or in moments seeking spiritual protection and courage.',
    explanation: 'Composed by Pope Leo XIII in 1884, invoking the Prince of the Heavenly Host for defense against spiritual harm and evil.',
    text: `Saint Michael the Archangel, defend us in battle. Be our protection against the wickedness and snares of the devil. May God rebuke him, we humbly pray; and do thou, O Prince of the Heavenly Host, by the power of God, cast into hell Satan and all the evil spirits who prowl about the world seeking the ruin of souls. Amen.`
  },
  {
    id: 'act-of-contrition',
    title: 'Act of Contrition',
    latinTitle: 'Actus Contritionis',
    category: 'core',
    traditionalTime: 'Prayed during the Sacrament of Reconciliation (Confession) and before sleep.',
    explanation: 'A formal expression of sorrow for one\'s sins out of love for God, paired with a firm resolve to amend one\'s life.',
    text: `O my God, I am heartily sorry for having offended Thee, and I detest all my sins because of Thy just punishments, but most of all because they offend Thee, my God, Who art all good and deserving of all my love. I firmly resolve, with the help of Thy grace, to sin no more and to avoid the near occasions of sin. Amen.`
  },
  {
    id: 'anima-christi',
    title: 'Anima Christi',
    latinTitle: 'Anima Christi',
    category: 'core',
    traditionalTime: 'Traditionally prayed after receiving Holy Communion or during Eucharistic Adoration.',
    explanation: 'A beloved 14th-century prayer of deep mystical union with Christ\'s Soul, Body, Blood, and Sacred Passion.',
    text: `Soul of Christ, sanctify me.
Body of Christ, save me.
Blood of Christ, inebriate me.
Water from the side of Christ, wash me.
Passion of Christ, strengthen me.
O good Jesus, hear me.
Within Thy wounds hide me.
Suffer me not to be separated from Thee.
From the malicious enemy defend me.
In the hour of my death call me,
And bid me come unto Thee,
That with Thy saints I may praise Thee
For ever and ever. Amen.`
  },
  {
    id: 'morning-offering',
    title: 'Morning Offering',
    category: 'morning_evening',
    traditionalTime: 'Prayed upon waking to dedicate the new day to God.',
    explanation: 'Consecrates all thoughts, words, joys, and sufferings of the day ahead for God\'s glory and the salvation of souls.',
    text: `O Jesus, through the Immaculate Heart of Mary, I offer You my prayers, works, joys, and sufferings of this day for all the intentions of Your Sacred Heart, in union with the Holy Sacrifice of the Mass throughout the world, for the salvation of souls, the reparation of sins, and the reunion of all Christians. Amen.`
  },
  {
    id: 'angelus',
    title: 'The Angelus',
    latinTitle: 'Angelus Domini',
    category: 'marian',
    traditionalTime: 'Traditionally recited three times daily: 6:00 AM, 12:00 PM, and 6:00 PM, accompanied by church bells.',
    explanation: 'Commemorates the Incarnation of Jesus Christ, meditating on Mary\'s humble acceptance of God\'s call.',
    text: `V. The Angel of the Lord declared unto Mary.
R. And she conceived of the Holy Spirit.
(Hail Mary...)

V. Behold the handmaid of the Lord.
R. Be it done unto me according to thy word.
(Hail Mary...)

V. And the Word was made flesh.
R. And dwelt among us.
(Hail Mary...)

V. Pray for us, O Holy Mother of God.
R. That we may be made worthy of the promises of Christ.

Let us pray: Pour forth, we beseech Thee, O Lord, Thy grace into our hearts; that we, to whom the Incarnation of Christ Thy Son was made known by the message of an Angel, may by His Passion and Cross be brought to the glory of His Resurrection. Through the same Christ our Lord. Amen.`
  },
  {
    id: 'memorare',
    title: 'The Memorare',
    category: 'marian',
    traditionalTime: 'Prayed when in urgent need of guidance, comfort, or maternal aid.',
    explanation: 'Attributed to Saint Bernard of Clairvaux, expressing absolute confidence that Our Lady never turns away anyone who flees to her protection.',
    text: `Remember, O most gracious Virgin Mary, that never was it known that anyone who fled to thy protection, implored thy help, or sought thy intercession was left unaided. Inspired by this confidence, I fly unto thee, O Virgin of virgins, my Mother; to thee do I come, before thee I stand, sinful and sorrowful. O Mother of the Word Incarnate, despise not my petitions, but in thy mercy hear and answer me. Amen.`
  },
  {
    id: 'prayer-before-meals',
    title: 'Prayer Before Meals',
    category: 'meals',
    traditionalTime: 'Prayed before partaking in breakfast, lunch, or dinner.',
    explanation: 'Giving thanks to God for His providence and asking His blessing upon the nourishment provided.',
    text: `Bless us, O Lord, and these Thy gifts, which we are about to receive from Thy bounty, through Christ our Lord. Amen.`
  },
  {
    id: 'prayer-after-meals',
    title: 'Prayer After Meals',
    category: 'meals',
    traditionalTime: 'Prayed immediately following a meal.',
    explanation: 'Expressing gratitude for the food received and praying for the souls of the faithful departed.',
    text: `We give Thee thanks, Almighty God, for all Thy benefits, Who livest and reignest world without end. And may the souls of the faithful departed, through the mercy of God, rest in peace. Amen.`
  },
  {
    id: 'evening-prayer',
    title: 'Evening Prayer',
    category: 'morning_evening',
    traditionalTime: 'Prayed as twilight falls, before resting.',
    explanation: 'A tranquil surrender of the day into the hands of God, thanking Him for His protection.',
    text: `O Lord Jesus Christ, light of the world, stay with us as the day draws to a close. We thank You for Your presence throughout this day, for Your grace in our trials, and Your love in our blessings. Protect us during the quiet hours of night, forgive our shortcomings, and grant us peaceful rest. Into Your hands, Lord, we commend our spirits. Amen.`
  },
  {
    id: 'prayer-for-sick',
    title: 'Prayer for the Sick',
    category: 'intention',
    traditionalTime: 'Prayed when visiting the ailing or offering intentions for physical and spiritual healing.',
    explanation: 'Asks Christ, the Divine Physician, to bring bodily comfort, peace of heart, and endurance to those who suffer.',
    text: `O Lord Jesus, Divine Physician of our souls and bodies, look with compassion upon those who are sick, suffering, or infirm. Comfort them in their pain, alleviate their burdens, and grant them patience in their illness. May Your healing hand touch them according to Your holy will, and fill their hearts with the peace that surpasses all understanding. Amen.`
  },
  {
    id: 'prayer-for-families',
    title: 'Prayer for Families',
    category: 'intention',
    traditionalTime: 'Prayed for domestic peace, unity, and moral strength.',
    explanation: 'Entrusts our homes to the Holy Family of Nazareth - Jesus, Mary, and Joseph.',
    text: `Heavenly Father, we place our families under Your loving care. Grant that our homes may be places of peace, forgiveness, and mutual love, modeled after the Holy Family of Nazareth. Help parents guide their children with wisdom, and grant children hearts of honor and gratitude. Preserve us in unity and faith through all the changes of this life. Amen.`
  },
  {
    id: 'prayer-for-peace',
    title: 'Prayer for Peace',
    category: 'intention',
    traditionalTime: 'Prayed in times of anxiety, conflict, or world distress.',
    explanation: 'Asks Christ, the Prince of Peace, to calm troubled hearts and quiet the discord of the world.',
    text: `Lord Jesus Christ, You said to Your Apostles: "Peace I leave with you, My peace I give to you." Look not on our sins, but on the faith of Your Church, and graciously grant her peace and unity in accordance with Your will. Bring quiet to every anxious mind, reconcile those who are divided, and let Your peace reign throughout the world. Amen.`
  },
  {
    id: 'prayer-before-sleep',
    title: 'Prayer Before Sleep',
    category: 'morning_evening',
    traditionalTime: 'Prayed right before closing one\'s eyes for the night.',
    explanation: 'A simple entrustment of body and soul to God\'s guardian angels and divine care.',
    text: `Visit, we beseech Thee, O Lord, this dwelling, and drive far from it all snares of the enemy. Let Thy holy Angels dwell herein to preserve us in peace; and let Thy blessing be always upon us. Through Christ our Lord. Amen.`
  },
  {
    id: 'salve-regina',
    title: 'Hail, Holy Queen',
    latinTitle: 'Salve Regina',
    category: 'marian',
    traditionalTime: 'Prayed at the conclusion of the Rosary and during Compline (Night Prayer).',
    explanation: 'An ancient 11th-century Marian hymn invoking Our Lady as Advocate and Mother of Mercy in life and death.',
    text: `Hail, Holy Queen, Mother of Mercy, our life, our sweetness and our hope. To thee do we cry, poor banished children of Eve. To thee do we send up our sighs, mourning and weeping in this valley of tears. Turn then, most gracious advocate, thine eyes of mercy toward us, and after this our exile, show unto us the blessed fruit of thy womb, Jesus. O clement, O loving, O sweet Virgin Mary. Amen.`,
    latinText: `Salve, Regina, Mater misericordiae; vita, dulcedo, et spes nostra, salve. Ad te clamamus, exsules filii Hevae. Ad te suspiramus, gementes et flentes in hac lacrimarum valle. Eia ergo, advocata nostra, illos tuos misericordes oculos ad nos converte. Et Iesum, benedictum fructum ventris tui, nobis post hoc exsilium ostende. O clemens, o pia, o dulcis Virgo Maria. Amen.`
  },
  {
    id: 'guardian-angel',
    title: 'Guardian Angel Prayer',
    latinTitle: 'Angele Dei',
    category: 'protection',
    traditionalTime: 'Prayed morning and evening, especially taught to children for lifelong spiritual protection.',
    explanation: 'A beloved prayer asking one\'s personal guardian angel sent by God for guidance and guardianship.',
    text: `Angel of God, my guardian dear, to whom God's love commits me here, ever this day be at my side, to light and guard, to rule and guide. Amen.`,
    latinText: `Angele Dei, qui custos es mei, me, tibi commissum pietate superna, illumina, custodi, rege et guberna. Amen.`
  },
  {
    id: 'st-francis',
    title: 'Prayer of Saint Francis',
    category: 'intention',
    traditionalTime: 'Prayed for peace, reconciliation, and selflessness in daily life.',
    explanation: 'A revered Christian prayer for peace and charity attributed to Saint Francis of Assisi.',
    text: `Lord, make me an instrument of Your peace: where there is hatred, let me sow love; where there is injury, pardon; where there is doubt, faith; where there is despair, hope; where there is darkness, light; and where there is sadness, joy.

O Divine Master, grant that I may not so much seek to be consoled as to console; to be understood as to understand; to be loved as to love. For it is in giving that we receive; it is in pardoning that we are pardoned; and it is in dying that we are born to eternal life. Amen.`
  },
  {
    id: 'divine-mercy',
    title: 'Divine Mercy Prayer',
    category: 'intention',
    traditionalTime: 'Prayed especially during the Hour of Great Mercy (3:00 PM) or during the Chaplet of Divine Mercy.',
    explanation: 'Revealed to St. Faustina Kowalska, invoking the infinite ocean of Christ\'s mercy for the entire world.',
    text: `You expired, Jesus, but the source of life gushed forth for souls, and the ocean of mercy opened up for the whole world. O Fount of Life, unfathomable Divine Mercy, enfold the whole world and empty Yourself out upon us.

O Blood and Water, which gushed forth from the Heart of Jesus as a fount of mercy for us, I trust in You! Amen.`
  },
  {
    id: 'serenity-prayer',
    title: 'Serenity Prayer',
    category: 'intention',
    traditionalTime: 'Prayed in moments of trial, seeking inner quietude and surrender to God\'s will.',
    explanation: 'A widely cherished Christian prayer of surrender and discernment by Reinhold Niebuhr.',
    text: `God, grant me the serenity to accept the things I cannot change, courage to change the things I can, and wisdom to know the difference. Living one day at a time, enjoying one moment at a time, accepting hardships as the pathway to peace, taking, as He did, this sinful world as it is, not as I would have it, trusting that He will make all things right if I surrender to His Will. Amen.`
  },
  {
    id: 'st-teresa-avila',
    title: 'Bookmark of St. Teresa of Ávila',
    latinTitle: 'Solo Dios Basta',
    category: 'protection',
    traditionalTime: 'Prayed during periods of fear, worry, or difficulty.',
    explanation: 'Written by St. Teresa of Ávila, reminded believers that God alone is sufficient for all human needs.',
    text: `Let nothing disturb you, let nothing frighten you. All things are passing away: God never changes. Patience obtains all things. Whoever has God lacks nothing; God alone suffices. Amen.`
  }
];
