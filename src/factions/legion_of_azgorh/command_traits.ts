import { tagAs } from 'factions/metatagger'
import { COMBAT_PHASE } from 'types/phases'
const CommandTraits = {
  Contemptuous: {
    effects: [
      {
        name: `Contemptuous`,
        desc: `You can reroll wound rolls of 1 for attacks made by this general.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  Relentless: {
    effects: [
      {
        name: `Relentless`,
        desc: `After this general has fought in each combat phase for the first time, if it is within 3" of an enemy HERO or MONSTER, roll a D6. On a 5+, it can make a pile-in move and then attack with all of the melee weapons it is armed with for a second time.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  Grotesque: {
    effects: [
      {
        name: `Grotesque`,
        desc: `Subtract 1 from hit rolls for attacks made with melee weapons that target this general.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
}

export default tagAs(CommandTraits, 'command_trait')
