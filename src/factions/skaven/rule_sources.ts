import { TRuleSources } from 'meta/rule_sources'

const rule_sources = {
  BATTLETOME_SKAVEN: {
    name: 'Battletome: Skaven',
    type: 'battletome',
  },
  ERRATA_OCTOBER_2022: {
    name: 'Errata (October 2022)',
    type: 'errata',
    url: 'https://www.warhammer-community.com/wp-content/uploads/2019/07/MqngzVQxuC9OhX5q.pdf',
  },
  ERRATA_JANUARY_2023: {
    name: 'Errata (January 2023)',
    type: 'errata',
    url: 'https://www.warhammer-community.com/wp-content/uploads/2019/07/I6erkna5aSTFhKRg.pdf',
  },
} satisfies TRuleSources

export default rule_sources
