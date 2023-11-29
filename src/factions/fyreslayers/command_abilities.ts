import { TItemDescriptions } from 'factions/factionTypes'
import { tagAs } from 'factions/metatagger'
import { START_OF_COMBAT_PHASE } from 'types/phases'

const CommandAbilities = {
  'Fierce Counter-Attack': {
    effects: [
      {
        name: `Fierce Counter-Attack`,
        desc: `You can use this command ability at the start of the enemy combat phase. The unit that receives the command must be an Auric Hearthguard, Hearthguard Berzerkers or Vulkite Berzerkers unit that is within 3" of an enemy unit that made a charge move in the same turn and not within 3" of any enemy units that have not made a charge move in the same turn. The strike-first effect applies to that unit until the end of that phase. A unit cannot receive this command more than once per battle.`,
        when: [START_OF_COMBAT_PHASE],
      },
    ],
  },
} satisfies TItemDescriptions

export default tagAs(CommandAbilities, 'command_ability')
