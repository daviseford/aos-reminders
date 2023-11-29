import { TItemDescriptions } from 'factions/factionTypes'
import { tagAs } from 'factions/metatagger'
import meta_rule_sources from 'meta/rule_sources'
import { COMBAT_PHASE } from 'types/phases'

const CommandTraits = {
  'Monsta Hunta': {
    effects: [
      {
        name: `Monsta Hunta`,
        desc: `Improve the Rend characteristic of this general's Pig-hacka by 1 for attacks that target an enemy MONSTER.`,
        when: [COMBAT_PHASE],
        rule_sources: [meta_rule_sources.BOOK_DAWNBRINGERS_BOOK_2],
      },
    ],
  },
} satisfies TItemDescriptions

export default tagAs(CommandTraits, 'command_trait')
