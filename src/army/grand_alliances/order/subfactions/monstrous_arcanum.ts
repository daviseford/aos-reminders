import { TUnits } from 'types/army'
import { DURING_GAME, SHOOTING_PHASE, WOUND_ALLOCATION_PHASE } from 'types/phases'

export const MonstrousArcanumOrder: TUnits = [
  {
    name: `Carmine Dragon`,
    effects: [
      {
        name: `Deathly Dark Scales`,
        desc: `Roll a D6 each time you allocate a mortal wound to this unit. On a 5+, that mortal wound is negated.`,
        when: [WOUND_ALLOCATION_PHASE],
      },
      {
        name: `Soul-sheering Blast`,
        desc: `Do not use the attack sequence for an attack made with a Soul-sheering Blast. Instead roll a D6. On a 5+, the target unit suffers D6 mortal wounds.`,
        when: [SHOOTING_PHASE],
      },
      {
        name: `Spell Devourer`,
        desc: `Each time this model is affected by a spell or endless spell, you can roll a D6. If you do so, on a 4+, ignore the effects of that spell on this model.`,
        when: [DURING_GAME],
      },
    ],
  },
]
