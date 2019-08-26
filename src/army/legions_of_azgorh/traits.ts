import { TTraits } from 'types/army'
import { COMBAT_PHASE } from 'types/phases'

const CommandTraits: TTraits = [
  {
    name: `Contemptuous`,
    effects: [
      {
        name: `Contemptuous`,
        desc: `You can re-roll wound rolls of 1 for attacks made by this general.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Relentless`,
    effects: [
      {
        name: `Relentless`,
        desc: `After this general has fought in each combat phase for the first time, if it is within 3" of an enemy Hero or Monster, roll a D6. On a 5+, it can make a pile-in move and then attack with all of the melee weapons it is armed with for a second time.`,
        when: [COMBAT_PHASE],
        command_ability: true,
      },
    ],
  },
  {
    name: `Grotesque`,
    effects: [
      {
        name: `Grotesque`,
        desc: `Subtract 1 from hit rolls for attacks made with melee weapons that target this general.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
]

export default CommandTraits
