import { TItemDescriptions } from 'factions/factionTypes'
import { tagAs } from 'factions/metatagger'
import { END_OF_CHARGE_PHASE, HERO_PHASE } from 'types/phases'

const IronjawzCommandAbilities = {
  'Mighty Destroyers': {
    effects: [
      {
        name: `Mighty Destroyers`,
        desc: `You can use this command ability in your hero phase. The model that issues the command must be an IRONJAWZ model and the unit that receives the command must be an IRONJAWZ unit.

        - If the unit that received the command is more than 12" from all enemy units, you must make a normal move with the unit.

        - If the unit that received the command is within 3" of an enemy unit, you must make a pile-in move with each model in the unit.

        - If the unit is within 12" of an enemy unit and more than 3" from all enemy units, you must attempt a charge with the unit.`,
        when: [HERO_PHASE],
      },
    ],
  },

  "Alright, Get 'Em!": {
    effects: [
      {
        name: `Alright, Get 'Em!`,
        desc: `You can use this command ability at the end of the enemy charge phase. The unit that receives the command must be a friendly IRONSUNZ unit that is within 12" of an enemy unit and more than 3" from all enemy units. That IRONSUNZ unit can attempt a charge.`,
        when: [END_OF_CHARGE_PHASE],
      },
    ],
  },
} satisfies TItemDescriptions

export default tagAs(IronjawzCommandAbilities, 'command_ability')
