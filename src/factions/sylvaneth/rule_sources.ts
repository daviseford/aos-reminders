import { TRuleSources } from 'meta/rule_sources'

const rule_sources = {
  BATTLETOME_SYLVANETH: {
    name: 'Battletome: Sylvaneth',
    type: 'battletome',
  },
  ERRATA_OCTOBER_2022: {
    name: 'Errata (October 2022)',
    type: 'errata',
    url: 'https://www.warhammer-community.com/wp-content/uploads/2019/08/aYMD9OEkOOdb02oN.pdf',
  },
  ERRATA_JANUARY_2023: {
    name: 'Errata (January 2023)',
    type: 'errata',
    url: 'https://www.warhammer-community.com/wp-content/uploads/2019/08/7iIV0GHcihoKuRXU.pdf',
  },
  ERRATA_NOVEMBER_2023: {
    name: 'Errata (November 2023)',
    type: 'errata',
    url: 'https://www.warhammer-community.com/wp-content/uploads/2019/08/OoFjYBMRphTA30o3.pdf',
  },
} satisfies TRuleSources

export default rule_sources
