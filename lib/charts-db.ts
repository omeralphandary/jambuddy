export interface StandardChart {
  title: string
  key: string
  style: string
  content: string
}

export const STANDARDS: StandardChart[] = [
  {
    title: 'Autumn Leaves',
    key: 'Gm',
    style: 'Jazz Waltz / Swing',
    content: `[A]
Cm7  F7  | Bbmaj7  Ebmaj7
Am7b5  D7  | Gm7

[A2]
Cm7  F7  | Bbmaj7  Ebmaj7
Am7b5  D7  | Gm7

[B]
Am7b5  D7  | Gm7  G7
Cm7  F7  | Bbmaj7
Ebmaj7  Am7b5  D7  | Gm7`,
  },
  {
    title: 'All The Things You Are',
    key: 'Ab',
    style: 'Swing',
    content: `[A]
Fm7  Bbm7  | Eb7  Abmaj7
Dbmaj7  Dm7  G7  | Cmaj7

[A2]
Cm7  Fm7  | Bb7  Ebmaj7
Abmaj7  Am7  D7  | Gmaj7

[B]
Am7  D7  | Gmaj7
F#m7  B7  | Emaj7
Bb7  | Eb7

[A3]
Fm7  Bbm7  | Eb7  Abmaj7
Dbmaj7  Dbm7  Gb7  | Cmaj7
Bdim7  Bbm7  Eb7  | Abmaj7`,
  },
  {
    title: 'Blue Bossa',
    key: 'Cm',
    style: 'Bossa Nova',
    content: `[A]
Cm7  | Cm7
Fm7  | Fm7
Dm7b5  G7  | Cm7
Cm7  |

[B]
Ebm7  Ab7  | Dbmaj7
Dm7  G7  | Cmaj7

[A2]
Cm7  | Cm7
Fm7  | Fm7
Dm7b5  G7  | Cm7
Cm7  |`,
  },
  {
    title: 'So What',
    key: 'Dm',
    style: 'Modal / Cool',
    content: `[A - D Dorian]
Dm7  | Dm7  | Dm7  | Dm7
Dm7  | Dm7  | Dm7  | Dm7
Dm7  | Dm7  | Dm7  | Dm7
Dm7  | Dm7  | Dm7  | Dm7

[B - Eb Dorian]
Ebm7  | Ebm7  | Ebm7  | Ebm7
Ebm7  | Ebm7  | Ebm7  | Ebm7

[A2 - D Dorian]
Dm7  | Dm7  | Dm7  | Dm7
Dm7  | Dm7  | Dm7  | Dm7`,
  },
  {
    title: 'Summertime',
    key: 'Am',
    style: 'Ballad / Blues',
    content: `[A]
Am  E7  | Am  E7
Am  Am7  | Dm7  Dm
F  E7  | Am  C7
F  E7  | Am  E7

[B]
C  G7  | C  C7
F  D7  | Am  E7
Am  Am7  | Dm  Dm7
F  E7  | Am`,
  },
  {
    title: 'Take The A Train',
    key: 'C',
    style: 'Swing',
    content: `[A]
Cmaj7  | Cmaj7
D7  | D7
Dm7  G7  | Cmaj7
Cmaj7  |

[B]
Cmaj7  C7  | Fmaj7
Fmaj7  | Fmaj7
D7  | D7
Dm7  G7  | Cmaj7`,
  },
  {
    title: 'Stella By Starlight',
    key: 'Bb',
    style: 'Ballad',
    content: `[A]
Em7b5  A7  | Cm7  F7
Fm7  Bb7  | Ebmaj7
Ab7  | Bbmaj7
Em7b5  A7  | Dm7

[B]
Gm7  C7  | Fmaj7
Fm7  Bb7  | Ebmaj7
Am7b5  D7  | Gm7
Cm7  F7  | Bbmaj7`,
  },
  {
    title: 'My Funny Valentine',
    key: 'Cm',
    style: 'Ballad',
    content: `[A]
Cm  Cm/B  | Cm7  Cm6
Abmaj7  | Fm7  G7

[A2]
Cm  Cm/B  | Cm7  Cm6
Abmaj7  | Dm7b5  G7

[B]
Abmaj7  | Fm7
Dm7b5  | G7
Cm  Ab7  | G7  C7

[A3]
Fm7  Bb7  | Ebmaj7
Abmaj7  | Dm7b5  G7
Cm  |`,
  },
  {
    title: 'There Will Never Be Another You',
    key: 'Eb',
    style: 'Swing',
    content: `[A]
Ebmaj7  | Eb7
Abmaj7  | Ab6  Abm6
Ebmaj7  Cm7  | Fm7  Bb7

[A2]
Ebmaj7  | Eb7
Abmaj7  | Abm7  Db7
Ebmaj7  Cm7  | Fm7  Bb7
Ebmaj7  Gm7  C7  |

[B]
Fm7  | Bb7
Gm7  C7  | Fm7  Bb7
Ebmaj7  Am7  D7  | Gmaj7
Gm7  C7  | Fm7  Bb7`,
  },
  {
    title: 'Wave',
    key: 'D',
    style: 'Bossa Nova',
    content: `[A]
Dmaj7  | G7
Gm7  C7  | Fmaj7
Fm7  Bb7  | Emaj7
Em7b5  A7  | Dmaj7

[B]
F#m7  B7  | Em7
F#m7  B7  | Emaj7
Bm7  E7  | Amaj7
Am7  D7  | Gmaj7
Gm7  C7  | Fmaj7
F#m7  B7  | Emaj7
Em7b5  A7  | Dmaj7`,
  },
  {
    title: 'Girl From Ipanema',
    key: 'F',
    style: 'Bossa Nova',
    content: `[A]
Fmaj7  | Fmaj7
G7  | G7
Gm7  | Gm7
Gb7  | Gb7

[B]
Gbmaj7  | Gbmaj7
B7  | B7
F#m7  | F#m7
D7  | D7
Gm7  | Gm7
Eb7  | Eb7

[A2]
Fmaj7  | Fmaj7
G7  | G7
Gm7  Gb7  | Fmaj7`,
  },
  {
    title: 'Fly Me To The Moon',
    key: 'Am',
    style: 'Swing / Bossa Nova',
    content: `[A]
Am7  Dm7  | G7  Cmaj7
Fmaj7  Bm7b5  | E7  Am7
A7  Dm7  | G7  Cmaj7
Bm7b5  E7  | Am7  E7

[B]
Am7  Dm7  | G7  Cmaj7
Fmaj7  Bm7b5  | E7  Am7
A7  Dm7  | G7  Cmaj7
Bm7b5  E7  | Am7`,
  },
  {
    title: 'Misty',
    key: 'Eb',
    style: 'Ballad',
    content: `[A]
Ebmaj7  | Bbm7  Eb7
Abmaj7  | Abm7  Db7
Ebmaj7  Cm7  | Fm7  Bb7
Gm7  C7  | Fm7  Bb7

[B]
Bbm7  Eb7  | Abmaj7
Abm7  Db7  | Ebmaj7  Cm7
Fm7  Bb7  | Ebmaj7

[A2]
Ebmaj7  | Bbm7  Eb7
Abmaj7  | Abm7  Db7
Ebmaj7  Cm7  | Fm7  Bb7
Gm7  C7  | Fm7  Bb7  Ebmaj7`,
  },
  {
    title: 'Round Midnight',
    key: 'Eb',
    style: 'Ballad',
    content: `[A]
Ebm7  | Ab7
Dbmaj7  | Dbm7  Gb7
Bm7  Bbm7  | Eb7  Abmaj7
Am7  D7  | Abmaj7

[B]
Ebm7  | Ab7
Dbmaj7  | Dbm7  Gb7
Bm7  Bbm7  | Eb7  Abmaj7
Abm7  Db7  | Dbmaj7

[C]
Gm7b5  C7  | Fm7
Bb7  | Ebm7
Gm7b5  C7  | Fm7
Bb7  | Ebm7

[A2]
Ebm7  | Ab7
Dbmaj7  | Dbm7  Gb7
Bm7  Bbm7  | Eb7  Abmaj7
Abm7  Db7  | Dbmaj7`,
  },
  {
    title: 'Billie\'s Bounce (F Blues)',
    key: 'F',
    style: 'Blues / Bebop',
    content: `[12-bar Blues in F]
F7  | F7  | F7  | F7
Bb7  | Bb7  | F7  | F7
Cm7  | Bb7  | F7  Dm7  | Gm7  C7`,
  },
  {
    title: 'Straight No Chaser (F Blues)',
    key: 'F',
    style: 'Blues / Hard Bop',
    content: `[12-bar Blues in F]
F7  | F7  | F7  | F7
Bb7  | Bb7  | F7  | F7
Gm7  | Gb7  | F7  Db7  | Gm7  C7`,
  },
  {
    title: 'Tenor Madness (Bb Blues)',
    key: 'Bb',
    style: 'Blues / Hard Bop',
    content: `[12-bar Blues in Bb]
Bb7  | Bb7  | Bb7  | Bb7
Eb7  | Eb7  | Bb7  | Bb7
Fm7  | Eb7  | Bb7  Gm7  | Cm7  F7`,
  },
  {
    title: 'Satin Doll',
    key: 'C',
    style: 'Swing',
    content: `[A]
Dm7  G7  | Dm7  G7
Em7  A7  | Em7  A7
Am7  D7  | Abm7  Db7
Cmaj7  | Cmaj7

[B]
Gm7  C7  | Gm7  C7
Fmaj7  | Fmaj7
Am7  D7  | Abm7  Db7
Cmaj7  | Cmaj7`,
  },
  {
    title: 'Oleo (Rhythm Changes)',
    key: 'Bb',
    style: 'Bebop',
    content: `[A]
Bbmaj7  Gm7  | Cm7  F7
Dm7  Db7  | Cm7  F7
Bbmaj7  Gm7  | Cm7  F7
Bbmaj7  F7  | Bbmaj7

[B]
D7  | D7
G7  | G7
C7  | C7
F7  | F7

[A2]
Bbmaj7  Gm7  | Cm7  F7
Dm7  Db7  | Cm7  F7
Bbmaj7  Gm7  | Cm7  F7
Bbmaj7  F7  | Bbmaj7`,
  },
  {
    title: 'Body and Soul',
    key: 'Db',
    style: 'Ballad',
    content: `[A]
Ebm7  | Ebm7  Bb7
Ebm7  Ab7  | Dbmaj7
Ebm7  Ab7  | Dbmaj7
Gm7  C7  | Fm7  Bb7

[B]
Dm7  G7  | Dmaj7
Dm7  G7  | Dmaj7
Dbm7  Gb7  | Bmaj7
Fm7  Bb7  | Ebm7

[A2]
Ebm7  | Ebm7  Bb7
Ebm7  Ab7  | Dbmaj7
Ebm7  Ab7  | Dbmaj7
Gm7  C7  | Fm7  Bb7  Dbmaj7`,
  },
  {
    title: 'What A Wonderful World',
    key: 'F',
    style: 'Ballad',
    content: `[Verse]
F  Am  | Bb  Am
Gm  F  | Am  Gm7
F  E7  | Am  Abm
Gm  F  | A7  Dm

[Chorus]
Db  Dbmaj7  | Db6  Db
Bbm  Bbm7  | Bbm6  C7
F  Fmaj7  | F6  F
F  |`,
  },
  {
    title: 'Besame Mucho',
    key: 'Dm',
    style: 'Latin / Bolero',
    content: `[A]
Dm  | Dm
E7  | A7
Dm  | Dm
Gm6  A7  | Dm

[B]
D7  | D7
Gm  | Gm
Gm  | Dm
A7  | Dm  A7`,
  },
  {
    title: 'Stand By Me',
    key: 'A',
    style: 'R&B / Pop',
    content: `[Verse / Chorus]
A  | A
F#m  | F#m
D  E  | A
D  E  | A`,
  },
  {
    title: 'Hit The Road Jack',
    key: 'Am',
    style: 'Blues / R&B',
    content: `[Chorus]
Am  G  | F  E7
Am  G  | F  E7

[Verse]
Am  | Am
G  | G
F  | F
E7  | E7`,
  },
  {
    title: 'Footprints',
    key: 'Cm',
    style: 'Jazz Waltz (3/4)',
    content: `[3/4 time]
Cm7  |  |  |
Cm7  |  |  |
Fm7  |  |
Cm7  |  |
D7  |  |
Ab7  G7  |
Cm7  |  |  |`,
  },
]

export function searchCharts(query: string): StandardChart[] {
  if (!query.trim()) return STANDARDS
  const q = query.toLowerCase()
  return STANDARDS.filter(
    c => c.title.toLowerCase().includes(q) || c.style.toLowerCase().includes(q) || c.key.toLowerCase().includes(q)
  )
}
