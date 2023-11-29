import { TItemDescriptions } from 'factions/factionTypes'
import { tagAs } from 'factions/metatagger'
import { START_OF_CHARGE_PHASE, START_OF_HERO_PHASE } from 'types/phases'

const CommandAbilities = {
  'A Barrel of Meat and the Jobs Done': {
    effects: [
      {
        name: `A Barrel of Meat and the Jobs Done`,
        desc: `You can use this command ability at the start of the hero phase. The command can only be issued by your general and must be received by this unit. Until the end of the turn, each model in this unit counts as 3 models for the purposes of contesting objectives.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
  'Lead the Skal': {
    effects: [
      {
        name: `Lead the Skal`,
        desc: `You can use this command ability at the start of your charge phase. Pick 1 friendly Frost Sabres. Until the end of that phase, when you attempt a charge with that unit, you can change 1 of the dice in the charge roll to a 4.`,
        when: [START_OF_CHARGE_PHASE],
      },
    ],
  },
} satisfies TItemDescriptions

export default tagAs(CommandAbilities, 'command_ability')
