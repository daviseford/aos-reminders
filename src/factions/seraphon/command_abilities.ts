import { TItemDescriptions } from 'factions/factionTypes'
import { tagAs } from 'factions/metatagger'
import { HERO_PHASE } from 'types/phases'

const CommandAbilities = {
  'Gift from the Heavens': {
    effects: [
      {
        name: `Gift from the Heavens`,
        desc: `You can use this command ability in your hero phase. The command can only be issued by this unit, and the unit that receives the command must be a friendly SERAPHON unit. Until your next hero phase, that unit can fly. In addition, add 1 to save rolls for attacks made with missile weapons that target that unit until your next hero phase.`,
        when: [HERO_PHASE],
      },
    ],
  },
} satisfies TItemDescriptions

export default tagAs(CommandAbilities, 'command_ability')
