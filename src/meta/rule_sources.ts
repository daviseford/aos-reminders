export type TRuleSource = {
  name: string
  /**
   * DD-MM-YY format
   */
  publication_date: string // `${number}-${number}-${number}`
  type: 'battletome' | 'white_dwarf' | 'errata' | 'ghb' | 'other_book' | 'boxed_game' | string
  /**
   * A helpful link to where these rules can be found. Optional.
   */
  url?: string
}

// Use this as the centralized rule_sources
// For things like Arcane Bolt, general rules, etc.
const rule_sources = {
  ERRATA_BROKEN_REALMS_TECLIS_MAY_2021: {
    name: 'Broken Realms: Teclis Errata (May 2021)',
    publication_date: '23-05-21',
    type: 'errata',
    url: 'https://www.warhammer-community.com/wp-content/uploads/2021/05/a5tBnjkUz0X5zrFr.pdf',
  },
  ERRATA_BROKEN_REALMS_MORATHI_JANUARY_2021: {
    name: 'Broken Realms: Morathi Errata (January 2021)',
    publication_date: '25-01-21',
    type: 'errata',
    url: 'https://www.warhammer-community.com/wp-content/uploads/2021/01/q9Fg2qordsr7bbCP.pdf',
  },
  BOOK_BROKEN_REALMS_KRAGNOS: {
    name: 'Broken Realms: Kragnos',
    publication_date: '05-06-21',
    type: 'other_book',
  },
  BOOK_BROKEN_REALMS_BELAKOR: {
    name: "Broken Realms: Be'lakor",
    publication_date: '23-04-21',
    type: 'other_book',
  },
  CORE_RULES_2021: {
    name: 'Core Rules (2021)',
    publication_date: '19-06-21',
    type: 'other_book',
    url: 'https://www.warhammer-community.com/wp-content/uploads/2021/06/bHB57xEZVMKO4T1U.pdf',
  },
  GHB_2021: {
    name: "General's Handbook (2021)",
    publication_date: '19-06-21',
    type: 'ghb',
  },
}

export default rule_sources
