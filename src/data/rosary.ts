import { RosaryMysteryDecade, RosaryMysteryType } from '../types';

interface RosaryMysterySet {
  type: RosaryMysteryType;
  title: string;
  days: string;
  decades: RosaryMysteryDecade[];
}

export const ROSARY_MYSTERIES: Record<RosaryMysteryType, RosaryMysterySet> = {
  joyful: {
    type: 'joyful',
    title: 'Joyful Mysteries',
    days: 'Mondays & Saturdays',
    decades: [
      {
        decadeNumber: 1,
        title: 'The Annunciation',
        scriptureRef: 'Luke 1:28, 38',
        scriptureText: 'The Angel Gabriel came to Mary and said: "Hail, full of grace, the Lord is with thee." Mary answered: "Behold the handmaid of the Lord; be it done to me according to thy word."',
        meditation: 'Contemplate Mary\'s humble obedience and purity of heart in consenting to become the Mother of our Saviour. Pray for the virtue of humility.'
      },
      {
        decadeNumber: 2,
        title: 'The Visitation',
        scriptureRef: 'Luke 1:41-42',
        scriptureText: 'When Elizabeth heard Mary\'s greeting, the infant leaped in her womb, and Elizabeth was filled with the Holy Spirit and cried out: "Blessed art thou among women, and blessed is the fruit of thy womb!"',
        meditation: 'Contemplate Mary\'s self-sacrificing charity in journeying to assist her cousin Elizabeth. Pray for charity towards our neighbour.'
      },
      {
        decadeNumber: 3,
        title: 'The Nativity',
        scriptureRef: 'Luke 2:7',
        scriptureText: 'And she brought forth her firstborn Son, wrapped Him in swaddling clothes, and laid Him in a manger, because there was no room for them in the inn.',
        meditation: 'Contemplate the humble poverty of Christ\'s birth in Bethlehem. Pray for detachment from earthly wealth and peace of spirit.'
      },
      {
        decadeNumber: 4,
        title: 'The Presentation in the Temple',
        scriptureRef: 'Luke 2:22-23',
        scriptureText: 'When the days of her purification according to the law of Moses were accomplished, they brought Him to Jerusalem to present Him to the Lord.',
        meditation: 'Contemplate Mary and Joseph fulfilling God\'s law with reverence. Pray for the virtue of obedience and purity of mind.'
      },
      {
        decadeNumber: 5,
        title: 'The Finding of Jesus in the Temple',
        scriptureRef: 'Luke 2:46, 49',
        scriptureText: 'After three days they found Him in the temple, sitting in the midst of the teachers. And He said: "Did you not know that I must be about My Father\'s business?"',
        meditation: 'Contemplate the joy of finding Jesus after a period of seeking. Pray for true wisdom and fidelity to God\'s will.'
      }
    ]
  },
  sorrowful: {
    type: 'sorrowful',
    title: 'Sorrowful Mysteries',
    days: 'Tuesdays & Fridays',
    decades: [
      {
        decadeNumber: 1,
        title: 'The Agony in the Garden',
        scriptureRef: 'Matthew 26:39',
        scriptureText: 'Jesus fell on His face and prayed: "My Father, if it be possible, let this cup pass from Me; nevertheless, not as I will, but as Thou wilt."',
        meditation: 'Contemplate Christ kneeling in Gethsemane, bearing the spiritual agony of human sin. Pray for sorrow for sin and resignation to God\'s will.'
      },
      {
        decadeNumber: 2,
        title: 'The Scourging at the Pillar',
        scriptureRef: 'John 19:1',
        scriptureText: 'Then Pilate took Jesus and scourged Him. He was wounded for our transgressions; He was bruised for our iniquities.',
        meditation: 'Contemplate the quiet endurance of Our Lord under cruel scourging. Pray for the virtue of purity and mortification of the senses.'
      },
      {
        decadeNumber: 3,
        title: 'The Crowning with Thorns',
        scriptureRef: 'Matthew 27:29',
        scriptureText: 'Plaiting a crown of thorns, they put it upon His head, and a reed in His right hand, and bowing before Him they mocked Him, saying: "Hail, King of the Jews!"',
        meditation: 'Contemplate the mockery and humiliation suffered by the King of Kings. Pray for moral courage and forgiveness toward those who mistreat us.'
      },
      {
        decadeNumber: 4,
        title: 'The Carrying of the Cross',
        scriptureRef: 'John 19:17',
        scriptureText: 'And bearing His own cross, He went forth to the place which is called the Skull, in Hebrew Golgotha.',
        meditation: 'Contemplate Jesus carrying the heavy wood of our redemption up Calvary. Pray for patience in bearing our daily crosses.'
      },
      {
        decadeNumber: 5,
        title: 'The Crucifixion and Death of Our Lord',
        scriptureRef: 'Luke 23:46',
        scriptureText: 'Jesus, crying out with a loud voice, said: "Father, into Thy hands I commend My spirit." And having said this, He expired.',
        meditation: 'Contemplate the total offering of Christ\'s life upon the Tree of the Cross. Pray for final perseverance and salvation of souls.'
      }
    ]
  },
  glorious: {
    type: 'glorious',
    title: 'Glorious Mysteries',
    days: 'Wednesdays & Sundays',
    decades: [
      {
        decadeNumber: 1,
        title: 'The Resurrection',
        scriptureRef: 'Mark 16:6',
        scriptureText: 'The Angel said: "Do not be amazed; you seek Jesus of Nazareth, who was crucified. He has risen; He is not here. See the place where they laid Him."',
        meditation: 'Contemplate Christ rising triumphant from the tomb on Easter morning. Pray for a vibrant faith and new spiritual life.'
      },
      {
        decadeNumber: 2,
        title: 'The Ascension',
        scriptureRef: 'Acts 1:9',
        scriptureText: 'While they looked on, He was raised up, and a cloud received Him out of their sight into heaven.',
        meditation: 'Contemplate Our Lord ascending into heaven to prepare a place for us. Pray for heavenly desire and steadfast hope.'
      },
      {
        decadeNumber: 3,
        title: 'The Descent of the Holy Spirit',
        scriptureRef: 'Acts 2:4',
        scriptureText: 'They were all filled with the Holy Spirit and began to speak in foreign tongues, as the Spirit gave them utterance.',
        meditation: 'Contemplate the Holy Spirit descending upon Mary and the Apostles in the Upper Room. Pray for the gifts and fruits of the Holy Spirit.'
      },
      {
        decadeNumber: 4,
        title: 'The Assumption of Mary',
        scriptureRef: 'Song of Songs 2:10',
        scriptureText: 'Arise, my love, my fair one, and come away; for lo, the winter is past, the rain is over and gone.',
        meditation: 'Contemplate Mary being taken up body and soul into heavenly glory. Pray for devotion to Our Lady and grace for a happy death.'
      },
      {
        decadeNumber: 5,
        title: 'The Coronation of Mary as Queen of Heaven',
        scriptureRef: 'Revelation 12:1',
        scriptureText: 'A great sign appeared in heaven: a woman clothed with the sun, with the moon under her feet, and on her head a crown of twelve stars.',
        meditation: 'Contemplate Mary crowned in heaven as Mother of the Church and Queen of Peace. Pray for eternal trust in her maternal intercession.'
      }
    ]
  },
  luminous: {
    type: 'luminous',
    title: 'Luminous Mysteries',
    days: 'Thursdays',
    decades: [
      {
        decadeNumber: 1,
        title: 'The Baptism of Jesus in the Jordan',
        scriptureRef: 'Matthew 3:17',
        scriptureText: 'A voice from heaven said: "This is My beloved Son, in whom I am well pleased."',
        meditation: 'Contemplate Christ stepping into the Jordan to sanctify the waters of Baptism. Pray for fidelity to our baptismal promises.'
      },
      {
        decadeNumber: 2,
        title: 'The Wedding at Cana',
        scriptureRef: 'John 2:5',
        scriptureText: 'His mother said to the servants: "Do whatever He tells you."',
        meditation: 'Contemplate Christ\'s first miracle worked through the intercession of His Mother. Pray for strong families and trust in God\'s timing.'
      },
      {
        decadeNumber: 3,
        title: 'The Proclamation of the Kingdom of God',
        scriptureRef: 'Mark 1:15',
        scriptureText: 'Jesus said: "The time is fulfilled, and the kingdom of God is at hand; repent, and believe in the Gospel."',
        meditation: 'Contemplate Christ inviting all hearts to repentance and reconciliation. Pray for true conversion of heart.'
      },
      {
        decadeNumber: 4,
        title: 'The Transfiguration',
        scriptureRef: 'Luke 9:29',
        scriptureText: 'As He prayed, the appearance of His countenance was altered, and His raiment became dazzling white.',
        meditation: 'Contemplate Christ revealing His divine glory on Mount Tabor. Pray for interior transformation and spiritual vision.'
      },
      {
        decadeNumber: 5,
        title: 'The Institution of the Eucharist',
        scriptureRef: 'Matthew 26:26',
        scriptureText: 'Jesus took bread, blessed and broke it, and gave it to His disciples, saying: "Take, eat; this is My body."',
        meditation: 'Contemplate Christ giving Himself entirely in the Most Blessed Sacrament. Pray for deep love for Holy Communion and Eucharistic devotion.'
      }
    ]
  }
};

export const FATIMA_PRAYER = `O my Jesus, forgive us our sins, save us from the fires of hell, lead all souls to heaven, especially those most in need of Thy mercy. Amen.`;

export const HAIL_HOLY_QUEEN = `Hail, Holy Queen, Mother of Mercy, our life, our sweetness, and our hope. To thee do we cry, poor banished children of Eve. To thee do we send up our sighs, mourning and weeping in this valley of tears. Turn then, most gracious advocate, thine eyes of mercy toward us, and after this our exile, show unto us the blessed fruit of thy womb, Jesus. O clement, O loving, O sweet Virgin Mary.

V. Pray for us, O Holy Mother of God.
R. That we may be made worthy of the promises of Christ.

Let us pray: O God, whose only begotten Son, by His life, death, and resurrection, has purchased for us the rewards of eternal life, grant, we beseech Thee, that meditating upon these mysteries of the Most Holy Rosary of the Blessed Virgin Mary, we may imitate what they contain and obtain what they promise, through the same Christ our Lord. Amen.`;

export function getRecommendedMysteryForDay(date: Date = new Date()): RosaryMysteryType {
  const day = date.getDay(); // 0 = Sun, 1 = Mon, ..., 6 = Sat
  switch (day) {
    case 1: // Mon
    case 6: // Sat
      return 'joyful';
    case 2: // Tue
    case 5: // Fri
      return 'sorrowful';
    case 3: // Wed
    case 0: // Sun
      return 'glorious';
    case 4: // Thu
      return 'luminous';
    default:
      return 'joyful';
  }
}
