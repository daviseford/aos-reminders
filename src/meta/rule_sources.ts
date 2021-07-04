export type TRuleSource = {
  name: string
  type: 'battletome' | 'white_dwarf' | 'errata' | 'ghb' | 'other_book' | 'boxed_game' | string
  /**
   * A helpful link to where these rules can be found. Optional.
   */
  url?: string
}

// Use this as the centralized rule_sources
// For things like Arcane Bolt, general rules, etc.
const meta_rule_sources = {
  ERRATA_BROKEN_REALMS_TECLIS_MAY_2021: {
    name: 'Broken Realms: Teclis Errata (May 2021)',
    type: 'errata',
    url: 'https://www.warhammer-community.com/wp-content/uploads/2021/05/a5tBnjkUz0X5zrFr.pdf',
  },
  ERRATA_BROKEN_REALMS_MORATHI_JANUARY_2021: {
    name: 'Broken Realms: Morathi Errata (January 2021)',
    type: 'errata',
    url: 'https://www.warhammer-community.com/wp-content/uploads/2021/01/q9Fg2qordsr7bbCP.pdf',
  },
  ERRATA_BROKEN_REALMS_MORATHI_JULY_2021: {
    name: 'Broken Realms: Morathi Errata (July 2021)',
    type: 'errata',
    url: 'https://www.warhammer-community.com/wp-content/uploads/2021/01/soZJF6JOs4BrQi8z.pdf',
  },
  BOOK_BROKEN_REALMS_KRAGNOS: {
    name: 'Broken Realms: Kragnos',
    type: 'other_book',
  },
  BOOK_BROKEN_REALMS_BELAKOR: {
    name: "Broken Realms: Be'lakor",
    type: 'other_book',
  },
  CORE_RULES_2021: {
    name: 'Core Rules (2021)',
    type: 'other_book',
    url: 'https://www.warhammer-community.com/wp-content/uploads/2021/06/bHB57xEZVMKO4T1U.pdf',
  },
  GHB_2021: {
    name: "General's Handbook (2021)",
    type: 'ghb',
  },
  ERRATA_CORE_RULES_2021: {
    name: 'Core Rules Errata (July 2021)',
    type: 'errata',
    url: 'https://www.warhammer-community.com/wp-content/uploads/2019/07/u7QSQCYGoqZ6e4TL.pdf',
  },
}

export default meta_rule_sources
