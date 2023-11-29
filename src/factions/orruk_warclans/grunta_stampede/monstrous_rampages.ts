import { TItemDescriptions } from 'factions/factionTypes'
import { tagAs } from 'factions/metatagger'
import meta_rule_sources from 'meta/rule_sources'
import { END_OF_CHARGE_PHASE } from 'types/phases'

const MonstrousRampages = {
  'Greedy Gobble': {
    effects: [
      {
        name: `Greedy Gobble`,
        desc: `You can only carry out this monstrous rampage with a unit that has a momentum score of 3 or less. Pick 1 enemy model within 3" of it and roll a dice. If the roll is at least double that model's Wounds characteristic, it is slain.`,
        when: [END_OF_CHARGE_PHASE],
        rule_sources: [meta_rule_sources.BOOK_DAWNBRINGERS_BOOK_2],
      },
    ],
  },
  'Charge Down': {
    effects: [
      {
        name: `Charge Down`,
        desc: `You can only carry out this monstrous rampage with a model that made a charge move this turn and is not in a unit that has multiple models. That model can make a D6" move but must finish that move within 3" of any enemy units. Then, add 1 to the momentum score of that model.`,
        when: [END_OF_CHARGE_PHASE],
        rule_sources: [meta_rule_sources.BOOK_DAWNBRINGERS_BOOK_2],
      },
    ],
  },
} satisfies TItemDescriptions

export default tagAs(MonstrousRampages, 'monstrous_rampage')
