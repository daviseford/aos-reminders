import { TRuleSources } from 'meta/rule_sources'

const rule_sources = {
  BATTLETOME_LUMINETH: {
    name: 'Battletome: Lumineth Realm-Lords',
    type: 'battletome',
  },
  ERRATA_MAY_2021: {
    name: 'Errata (May 2021)',
    type: 'errata',
    url: 'https://www.warhammer-community.com/wp-content/uploads/2020/08/mWMEOpCm7uWKs6FN.pdf',
  },
  ERRATA_JULY_2021: {
    name: 'Errata (July 2021)',
    type: 'errata',
    url: 'https://www.warhammer-community.com/wp-content/uploads/2020/08/8jwyJBDuvMUu0EsE.pdf',
  },
  ERRATA_APRIL_2023: {
    name: 'Errata (April 2023)',
    type: 'errata',
    url: 'https://www.warhammer-community.com/wp-content/uploads/2020/08/Nr72FSWnhsPFWgoZ.pdf',
  },
} satisfies TRuleSources

export default rule_sources
