import { TRuleSources } from 'meta/rule_sources'

const rule_sources = {
  BATTLETOME_NURGLE: {
    name: 'Battletome: Maggotkin of Nurgle',
    type: 'battletome',
  },
  ERRATA_JANUARY_2022: {
    name: 'Errata (January 2022)',
    type: 'errata',
    url: 'https://www.warhammer-community.com/wp-content/uploads/2018/07/GjHi2Ip94TenkORr.pdf',
  },
  ERRATA_JULY_2022: {
    name: 'Errata (July 2022)',
    type: 'errata',
    url: 'https://www.warhammer-community.com/wp-content/uploads/2018/07/oeeKXfBv3sqy06LO.pdf',
  },
  ERRATA_JANUARY_2023: {
    name: 'Errata (January 2023)',
    type: 'errata',
    url: 'https://www.warhammer-community.com/wp-content/uploads/2018/07/OAwscbnmGZsyoHxE.pdf',
  },
} satisfies TRuleSources

export default rule_sources
