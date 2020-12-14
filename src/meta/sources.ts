export type TSource = {
  name: string
  // publication_date: `${number}-${number}-${number}`,
  publication_date: string
  type: 'battletome' | 'white_dwarf' | 'errata' | 'ghb' | 'other_book' | 'boxed_game'
}

const sources: Record<string, TSource> = {
  BATTLETOME_SONS_OF_BEHEMAT: {
    name: 'Battletome: Sons of Behemat',
    publication_date: '20-10-17',
    type: 'battletome',
  },
  ERRATA_SONS_OF_BEHEMAT_NOV_2020: {
    name: 'Battletome: Sons of Behemat Errata, November 2020',
    publication_date: '20-11-18',
    type: 'errata',
  },
}

export default sources
