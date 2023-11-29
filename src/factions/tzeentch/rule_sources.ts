import { TRuleSources } from 'meta/rule_sources'

const rule_sources = {
  BATTLETOME_TZEENTCH: {
    name: 'Battletome: Disciples of Tzeentch',
    type: 'battletome',
  },
  ERRATA_JANUARY_2022: {
    name: 'Errata (January 2022)',
    type: 'errata',
    url: 'https://www.warhammer-community.com/wp-content/uploads/2018/07/GXWsABT46yRGS413.pdf',
  },
} satisfies TRuleSources

export default rule_sources
