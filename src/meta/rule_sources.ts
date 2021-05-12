export type TRuleSource = {
  name: string
  // publication_date: `${number}-${number}-${number}`
  publication_date: string
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
    name: 'Errata (May 2021)',
    publication_date: '23-05-21',
    type: 'errata',
    url: 'https://www.warhammer-community.com/wp-content/uploads/2021/05/a5tBnjkUz0X5zrFr.pdf',
  },
}

export default rule_sources
