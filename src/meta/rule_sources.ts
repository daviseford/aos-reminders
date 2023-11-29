export type TRuleSource = {
  name: string
  type: 'battletome' | 'white_dwarf' | 'errata' | 'ghb' | 'other_book' | 'boxed_game'
  /**
   * A helpful link to where these rules can be found. Optional.
   */
  url?: string
}

export type TRuleSources = Record<string, TRuleSource>

// Use this as the centralized rule_sources
// Core books, non-faction books, General's Handbooks, etc
const meta_rule_sources = {
  ERRATA_BROKEN_REALMS_TECLIS_MAY_2021: {
    name: 'Broken Realms: Teclis Errata (May 2021)',
    type: 'errata',
    url: 'https://www.warhammer-community.com/wp-content/uploads/2021/05/a5tBnjkUz0X5zrFr.pdf',
  },
  ERRATA_BROKEN_REALMS_TECLIS_JULY_2021: {
    name: 'Broken Realms: Teclis Errata (July 2021)',
    type: 'errata',
    url: 'https://www.warhammer-community.com/wp-content/uploads/2021/05/5TXh9dhnksx7PhbX.pdf',
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

  ERRATA_WRATH_OF_THE_EVERCHOSEN_JULY_2021: {
    name: 'Soul Wars: Wrath of the Everchosen Errata (July 2021)',
    type: 'errata',
    url: 'https://www.warhammer-community.com/wp-content/uploads/2020/07/grTM4zXseeVRy7HL.pdf',
  },
  ERRATA_WRATH_OF_THE_EVERCHOSEN_AUGUST_2021: {
    name: 'Soul Wars: Wrath of the Everchosen Errata (August 2021)',
    type: 'errata',
    url: 'https://www.warhammer-community.com/wp-content/uploads/2020/07/tHcsi6mqEyQoq1SE.pdf',
  },

  BOOK_BROKEN_REALMS_KRAGNOS: {
    name: 'Broken Realms: Kragnos',
    type: 'other_book',
  },
  ERRATA_BROKEN_REALMS_KRAGNOS_JULY_2021: {
    name: 'Broken Realms: Kragnos Errata (July 2021)',
    type: 'errata',
    url: 'https://www.warhammer-community.com/wp-content/uploads/2021/07/OEZvWdlyDRHD9tfj.pdf',
  },
  ERRATA_BROKEN_REALMS_KRAGNOS_AUGUST_2021: {
    name: 'Broken Realms: Kragnos Errata (August 2021)',
    type: 'errata',
    url: 'https://www.warhammer-community.com/wp-content/uploads/2021/07/rqrtl9Iet9Yq3vDX.pdf',
  },

  BOOK_BROKEN_REALMS_BELAKOR: {
    name: "Broken Realms: Be'lakor",
    type: 'other_book',
  },
  ERRATA_BROKEN_REALMS_BELAKOR_AUGUST_2021: {
    name: "Broken Realms: Be'lakor Errata (August 2021)",
    type: 'errata',
    url: 'https://www.warhammer-community.com/wp-content/uploads/2021/07/OQelhstq4HoJuYm6.pdf',
  },
  ERRATA_BROKEN_REALMS_BELAKOR_JULY_2022: {
    name: "Broken Realms: Be'lakor Errata (July 2022)",
    type: 'errata',
    url: 'https://www.warhammer-community.com/wp-content/uploads/2021/07/Z4b4plVM8gDObBDe.pdf',
  },

  CORE_RULES_2021: {
    name: 'Core Rules (2021)',
    type: 'other_book',
    url: 'https://www.warhammer-community.com/wp-content/uploads/2021/06/bHB57xEZVMKO4T1U.pdf',
  },
  ERRATA_CORE_RULES_JULY_2021: {
    name: 'Core Rules Errata (July 2021)',
    type: 'errata',
    url: 'https://www.warhammer-community.com/wp-content/uploads/2019/07/u7QSQCYGoqZ6e4TL.pdf',
  },
  ERRATA_CORE_RULES_SEPTEMBER_2021: {
    name: 'Core Rules Errata (September 2021)',
    type: 'errata',
    url: 'https://www.warhammer-community.com/wp-content/uploads/2019/07/0f2lPBAeWV2trBmu.pdf',
  },
  ERRATA_CORE_RULES_OCTOBER_2021: {
    name: 'Core Rules Errata (October 2021)',
    type: 'errata',
    url: 'https://www.warhammer-community.com/wp-content/uploads/2019/07/mx79gx5TnnSNrWI2.pdf',
  },
  ERRATA_CORE_RULES_DECEMBER_2021: {
    name: 'Core Rules Errata (December 2021)',
    type: 'errata',
    url: 'https://www.warhammer-community.com/wp-content/uploads/2019/07/VrQ1PX4ZvydjBuKl.pdf',
  },
  ERRATA_CORE_RULES_JULY_2022: {
    name: 'Core Rules Errata (July 2022)',
    type: 'errata',
    url: 'https://www.warhammer-community.com/wp-content/uploads/2019/07/TKy3YFHtTFpL4ZVW.pdf',
  },
  ERRATA_CORE_RULES_OCTOBER_2022: {
    name: 'Core Rules Errata (October 2022)',
    type: 'errata',
    url: 'https://www.warhammer-community.com/wp-content/uploads/2019/07/svhEUwlP6J1AQFXl.pdf',
  },
  ERRATA_CORE_RULES_JANUARY_2023: {
    name: 'Core Rules Errata (January 2023)',
    type: 'errata',
    url: 'https://www.warhammer-community.com/wp-content/uploads/2019/07/Y9OeMNhzYrlFauuB.pdf',
  },

  GHB_2021: {
    name: "General's Handbook (2021)",
    type: 'ghb',
  },
  GHB_2022: {
    name: "General's Handbook (2022)",
    type: 'ghb',
  },
  GHB_2022_2023_SEASON_2: {
    name: "General's Handbook (2022-23 - Season 2)",
    type: 'ghb',
  },
  GHB_2023_2024: {
    name: "General's Handbook (2023-2024)",
    type: 'ghb',
  },

  ERRATA_GHB_SEPTEMBER_2021: {
    name: "General's Handbook Errata (September 2021)",
    type: 'errata',
    url: 'https://www.warhammer-community.com/wp-content/uploads/2019/07/Nx3vTlkaz7ekCv7J.pdf',
  },
  ERRATA_GHB_OCTOBER_2022: {
    name: "General's Handbook Errata (October 2022)",
    type: 'errata',
    url: 'https://www.warhammer-community.com/wp-content/uploads/2022/06/v1iepvOM3Oycl774.pdf',
  },
  ERRATA_GHB_JANUARY_2023: {
    name: "General's Handbook (2022-23 - Season 2) Errata (January 2023)",
    type: 'errata',
    url: 'https://www.warhammer-community.com/wp-content/uploads/2022/06/0niAh9Z8ntoVaTlG.pdf',
  },

  CROSS_FACTION_HEROES_JULY_2022: {
    name: 'Cross Faction Heroes (July 2022)',
    type: 'other_book',
    url: 'https://www.warhammer-community.com/wp-content/uploads/2022/07/F7rLk5rmPJoiqZZw.pdf',
  },

  ERRATA_SEASON_OF_WAR_THONDIA: {
    name: 'Season of War: Thondia (January 2023)',
    type: 'errata',
    url: 'https://www.warhammer-community.com/wp-content/uploads/2022/10/AIPRIiH3XKEsLKFl.pdf',
  },

  BATTLESCROLL_GALLETIAN_CHAMPIONS_JANUARY_2022: {
    name: 'Battlescroll: Galletian Champions (July 2022)',
    type: 'other_book',
    url: 'https://www.warhammer-community.com/wp-content/uploads/2023/01/Ugb15RoC5uAQIMWi.pdf',
  },

  BATTLESCROLL_DEPLETED_RESERVES_APRIL_2023: {
    name: 'Battlescroll: Depleted Reserves (April 2023)',
    type: 'other_book',
  },

  BATTLESCROLL_ANDTOR_SEPTEMBER_2023: {
    name: 'Battlescroll: Tactics of Andtor (September 2023)',
    type: 'other_book',
    url: 'https://www.warhammer-community.com/wp-content/uploads/2023/07/AefiGVn8NoPchpF2.pdf',
  },

  BOOK_DAWNBRINGERS_BOOK_1: {
    name: 'Dawnbringers Book I',
    type: 'other_book',
  },

  BOOK_DAWNBRINGERS_BOOK_2: {
    name: 'Dawnbringers Book II',
    type: 'other_book',
  },
  ERRATA_DAWNBRINGERS_BOOK_2: {
    name: 'Dawnbringers Book II Errata (October 2023)',
    type: 'errata',
    url: 'https://www.warhammer-community.com/wp-content/uploads/2023/10/82g1IHzMFxXDUL4j.pdf',
  },

  BOOK_DAWNBRINGERS_BOOK_3: {
    name: 'Dawnbringers Book III',
    type: 'other_book',
  },
} satisfies TRuleSources

export default meta_rule_sources
