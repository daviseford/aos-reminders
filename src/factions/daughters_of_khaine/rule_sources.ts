import { TRuleSources } from 'meta/rule_sources'

const rule_sources = {
  BATTLETOME_DAUGHTERS_OF_KHAINE: {
    name: 'Battletome: Daughters of Khaine',
    type: 'battletome',
  },
  ERRATA_JULY_2022: {
    name: 'Errata (July 2022)',
    type: 'errata',
    url: 'https://www.warhammer-community.com/wp-content/uploads/2019/10/DiOjGMyi3tGkZuOm.pdf',
  },
  ERRATA_DECEMBER_2022: {
    name: 'Errata (December 2022)',
    type: 'errata',
    url: 'https://www.warhammer-community.com/wp-content/uploads/2019/10/4IQvpkhYMBDojDZ6.pdf',
  },
} satisfies TRuleSources

export default rule_sources
