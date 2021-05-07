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

// TODO: Use this as the centralized rules_source
// For things like Arcane Bolt, general rules, etc.
const rule_sources: Record<string, TRuleSource> = {}

export default rule_sources
